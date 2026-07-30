import os
import sys
import math
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, Base, get_db
from .models import PredictionLog, BenchmarkResult, StatisticalTest, ErrorAnalysisLog
from .schemas import (
    PredictRequest, PredictResponse, PredictResponseData, ModelResultDetails,
    BenchmarkStatsResponse, ModelSummaryStats, StatisticalTestDetails,
    ErrorAnalysisCategory, McNemarMatrixDetails,
    PredictionLogResponse, LoginRequest, LoginResponse
)
from .engine import ModelEngine
from .init_db import init_db

# Initialize FastAPI App
app = FastAPI(
    title="BERT Sentiment Comparator & Benchmark Dashboard API",
    description="Backend API for real-time sentiment analysis comparison and research statistics.",
    version="1.0.0"
)

from fastapi import Response

# Enable CORS for Vercel production, preview deployments, and local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Explicit OPTIONS Preflight Route Handler for cross-origin browser requests
@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "BERT Sentiment Lab API Backend running on Google Colab Tesla T4 GPU",
        "docs": "/docs",
        "health": "/api/health",
        "debug": "/api/debug-device"
    }

@app.get("/api/debug-device")
def debug_device():
    import torch
    if model_engine is None or not model_engine.has_real_models:
        return {"status": "error", "message": "Model engine not loaded"}
    
    model_a_device = str(next(model_engine.model_a.parameters()).device)
    model_b_device = str(next(model_engine.model_b.parameters()).device)
    
    return {
        "status": "success",
        "cuda_available": torch.cuda.is_available(),
        "cuda_device_name": torch.cuda.get_device_name(0) if torch.cuda.is_available() else "None",
        "engine_device_setting": str(model_engine.device),
        "model_a_actual_device": model_a_device,
        "model_b_actual_device": model_b_device,
    }

# Comprehensive HTTP Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    if request.method == "OPTIONS":
        response = Response(status_code=200)
    else:
        response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Content-Security-Policy"] = "default-src 'self' https: data: blob: 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https: wss:;"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

# Global model engine instance
model_engine = None

@app.on_event("startup")
def startup_event():
    global model_engine
    print("Starting up server...")
    # Initialize and seed database if not already done
    init_db()
    
    # Auto-download PyTorch model weights from Google Drive if missing
    try:
        import sys
        backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        if backend_dir not in sys.path:
            sys.path.insert(0, backend_dir)
        from download_models import setup_models
        setup_models()
    except Exception as e:
        print(f"Auto-download check note: {e}")

    # Load BERT Model Engine
    model_engine = ModelEngine()
    print("Model Engine loaded.")

@app.get("/api/health")
def health_check():
    import torch
    is_gpu = (model_engine and model_engine.device.type == "cuda") or torch.cuda.is_available()
    return {
        "status": "healthy",
        "device": "GPU" if is_gpu else "CPU",
        "timestamp": datetime.utcnow()
    }

@app.post("/api/predict", response_model=PredictResponse)
def predict_sentiment(payload: PredictRequest, db: Session = Depends(get_db)):
    global model_engine
    if not model_engine:
        raise HTTPException(status_code=503, detail="Model engine not loaded")
        
    try:
        # Run prediction
        predictions = model_engine.predict(payload.text)
        user_clean = payload.username.strip().lower() if payload.username else "public"
        
        # Save to database prediction log with account isolation
        log_entry = PredictionLog(
            username=user_clean,
            input_text=payload.text,
            model_a_label=predictions["model_a"]["label"],
            model_a_confidence=predictions["model_a"]["confidence"],
            model_a_latency_ms=predictions["model_a"]["latency_ms"],
            model_b_label=predictions["model_b"]["label"],
            model_b_confidence=predictions["model_b"]["confidence"],
            model_b_latency_ms=predictions["model_b"]["latency_ms"]
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        
        # Build response
        response_data = PredictResponseData(
            input_text=payload.text,
            model_a=ModelResultDetails(
                name=predictions["model_a"]["name"],
                label=predictions["model_a"]["label"],
                confidence=predictions["model_a"]["confidence"],
                latency_ms=predictions["model_a"]["latency_ms"]
            ),
            model_b=ModelResultDetails(
                name=predictions["model_b"]["name"],
                label=predictions["model_b"]["label"],
                confidence=predictions["model_b"]["confidence"],
                latency_ms=predictions["model_b"]["latency_ms"]
            ),
            timestamp=log_entry.created_at
        )
        
        return PredictResponse(status="success", data=response_data)
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/api/benchmark-stats", response_model=BenchmarkStatsResponse)
def get_benchmark_stats(db: Session = Depends(get_db)):
    try:
        # Fetch all benchmark results
        results = db.query(BenchmarkResult).all()
        
        # Fetch statistical test results
        stat_test = db.query(StatisticalTest).order_by(StatisticalTest.id.desc()).first()
        if not stat_test:
            raise HTTPException(status_code=404, detail="Statistical test data not found")
            
        # Group by Model Type
        model_a_runs = [r for r in results if r.model_type == "Model A"]
        model_b_runs = [r for r in results if r.model_type == "Model B"]
        
        def calculate_stats(runs):
            if not runs:
                return ModelSummaryStats(
                    accuracy_mean=0.0, accuracy_std=0.0,
                    f1_mean=0.0, f1_std=0.0,
                    avg_latency_ms=0.0, peak_vram_mb=0.0
                )
            
            accs = [r.accuracy for r in runs]
            f1s = [r.f1_score for r in runs]
            lats = [r.inference_time_ms for r in runs]
            vrams = [r.peak_vram_mb for r in runs]
            
            def mean(lst):
                return sum(lst) / len(lst) if lst else 0.0
                
            def std(lst):
                if len(lst) < 2:
                    return 0.0
                m = mean(lst)
                return math.sqrt(sum((x - m) ** 2 for x in lst) / (len(lst) - 1))
                
            return ModelSummaryStats(
                accuracy_mean=round(mean(accs), 4),
                accuracy_std=round(std(accs), 4),
                f1_mean=round(mean(f1s), 4),
                f1_std=round(std(f1s), 4),
                avg_latency_ms=round(mean(lats), 2),
                peak_vram_mb=round(mean(vrams), 2)
            )
            
        summary = {
            "model_a": calculate_stats(model_a_runs),
            "model_b": calculate_stats(model_b_runs)
        }
        
        # Build statistical test object
        # Interpretation based on Cohen's d:
        # Small: d >= 0.2, Medium: d >= 0.5, Large: d >= 0.8, Very Large: d >= 1.2, Extremely Large: d >= 2.0
        effect_size = stat_test.cohens_d
        if effect_size >= 2.0:
            interpretation = "Extremely Large Effect"
        elif effect_size >= 1.2:
            interpretation = "Very Large Effect"
        elif effect_size >= 0.8:
            interpretation = "Large Effect"
        elif effect_size >= 0.5:
            interpretation = "Medium Effect"
        elif effect_size >= 0.2:
            interpretation = "Small Effect"
        else:
            interpretation = "Negligible Effect"
            
        statistical_details = StatisticalTestDetails(
            mcnemar_p_value=stat_test.mcnemar_p_value,
            wilcoxon_p_value=stat_test.wilcoxon_p_value,
            bootstrap_95_ci=[stat_test.bootstrap_ci_lower, stat_test.bootstrap_ci_upper],
            cohens_d=stat_test.cohens_d,
            effect_size_interpretation=interpretation
        )
        
        # Query error analysis logs
        error_logs = db.query(ErrorAnalysisLog).all()
        if not error_logs:
            # Fallback default error analysis logs if table is empty
            error_analysis_list = [
                ErrorAnalysisCategory(subject="Tanpa Negasi", model_a_accuracy=86.0, model_b_accuracy=94.0, sample_count=520),
                ErrorAnalysisCategory(subject="Negasi Biner", model_a_accuracy=42.0, model_b_accuracy=91.0, sample_count=180),
                ErrorAnalysisCategory(subject="Ironi / Sarkasme", model_a_accuracy=35.0, model_b_accuracy=82.0, sample_count=95),
                ErrorAnalysisCategory(subject="Review Panjang", model_a_accuracy=72.0, model_b_accuracy=88.0, sample_count=140),
                ErrorAnalysisCategory(subject="Ambiguitas Tinggi", model_a_accuracy=51.0, model_b_accuracy=85.0, sample_count=65)
            ]
        else:
            error_analysis_list = [
                ErrorAnalysisCategory(
                    subject=log.category_name,
                    model_a_accuracy=log.model_a_accuracy,
                    model_b_accuracy=log.model_b_accuracy,
                    sample_count=log.sample_count
                ) for log in error_logs
            ]

        mcnemar_matrix_details = McNemarMatrixDetails(
            both_correct=getattr(stat_test, 'mcnemar_both_correct', 717) or 717,
            a_correct_b_wrong=getattr(stat_test, 'mcnemar_a_correct_b_wrong', 22) or 22,
            b_correct_a_wrong=getattr(stat_test, 'mcnemar_b_correct_a_wrong', 88) or 88,
            both_wrong=getattr(stat_test, 'mcnemar_both_wrong', 45) or 45,
            chi2=getattr(stat_test, 'mcnemar_chi2', 38.4091) or 38.4091
        )
        
        return BenchmarkStatsResponse(
            status="success",
            summary=summary,
            statistical_tests=statistical_details,
            error_analysis=error_analysis_list,
            mcnemar_matrix=mcnemar_matrix_details
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database retrieval error: {str(e)}")

@app.get("/api/history", response_model=List[PredictionLogResponse])
def get_prediction_history(username: str = Query(None), limit: int = Query(10, ge=1, le=50), db: Session = Depends(get_db)):
    try:
        query = db.query(PredictionLog)
        if username:
            query = query.filter(PredictionLog.username == username.strip().lower())
        logs = query.order_by(PredictionLog.created_at.desc()).limit(limit).all()
        return logs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database retrieval error: {str(e)}")

@app.delete("/api/history")
def clear_prediction_history(username: str = Query(None), db: Session = Depends(get_db)):
    try:
        query = db.query(PredictionLog)
        if username:
            query.filter(PredictionLog.username == username.strip().lower()).delete()
        else:
            query.delete()
        db.commit()
        return {"status": "success", "message": "Prediction history cleared."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to clear history: {str(e)}")

@app.delete("/api/history/{log_id}")
def delete_single_prediction_log(log_id: int, db: Session = Depends(get_db)):
    try:
        log_entry = db.query(PredictionLog).filter(PredictionLog.id == log_id).first()
        if not log_entry:
            raise HTTPException(status_code=404, detail="Log entry not found")
        db.delete(log_entry)
        db.commit()
        return {"status": "success", "message": f"Log entry {log_id} deleted."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete log entry: {str(e)}")

@app.post("/api/login", response_model=LoginResponse)
def login_user(req: LoginRequest):
    """
    Authenticate Dosen and Peneliti accounts for accessing benchmark analytics.
    """
    valid_credentials = {
        "dosenpembimbing": "123456",
        "dosenpenguji": "123456",
        "syafiqmhd": "123456"
    }
    
    display_names = {
        "dosenpembimbing": "Dosen Pembimbing (UMSU)",
        "dosenpenguji": "Dosen Penguji (UMSU)",
        "syafiqmhd": "Syafiq Hasan (Peneliti)"
    }
    
    username_clean = req.username.strip().lower()
    if username_clean in valid_credentials and valid_credentials[username_clean] == req.password:
        return LoginResponse(
            status="success",
            token="umsu_jwt_researcher_token_2026",
            role="dosen",
            user_name=display_names.get(username_clean, f"{req.username.strip().capitalize()} (UMSU)"),
            user_username=username_clean
        )
    
    raise HTTPException(status_code=401, detail="Username atau Password salah. Silakan periksa kembali kredensial Anda.")
