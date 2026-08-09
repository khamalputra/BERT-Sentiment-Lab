from .database import engine, Base, SessionLocal
from .models import BenchmarkResult, StatisticalTest, PredictionLog, ErrorAnalysisLog

def check_and_migrate_db():
    try:
        conn = engine.raw_connection()
        cursor = conn.cursor()
        cursor.execute("PRAGMA table_info(prediction_logs)")
        columns = [row[1] for row in cursor.fetchall()]
        if "username" not in columns:
            print("Migrating database: Adding 'username' column to prediction_logs table...")
            cursor.execute("ALTER TABLE prediction_logs ADD COLUMN username VARCHAR(50) DEFAULT 'public'")
            conn.commit()
            print("Migration complete!")
        conn.close()
    except Exception as e:
        print(f"Migration check note: {e}")

def init_db():
    # Create all tables in the database
    Base.metadata.create_all(bind=engine)
    check_and_migrate_db()
    
    db = SessionLocal()
    try:
        # Check if tables are already populated
        if db.query(BenchmarkResult).count() > 0:
            stat = db.query(StatisticalTest).first()
            if stat:
                stat.wilcoxon_p_value = 0.015625
                stat.cohens_d = 9.80
                stat.bootstrap_ci_lower = 0.0548
                stat.bootstrap_ci_upper = 0.0964
                stat.mcnemar_both_correct = 735
                stat.mcnemar_a_correct_b_wrong = 14
                stat.mcnemar_b_correct_a_wrong = 83
                stat.mcnemar_both_wrong = 40
                stat.mcnemar_chi2 = 47.6701
                db.commit()
            
            # Update or Seed ErrorAnalysisLog
            db.query(ErrorAnalysisLog).delete()
            error_logs = [
                ErrorAnalysisLog(category_name="Tanpa Negasi", model_a_accuracy=87.8, model_b_accuracy=94.4, sample_count=674),
                ErrorAnalysisLog(category_name="Negasi Biner", model_a_accuracy=79.8, model_b_accuracy=93.1, sample_count=173),
                ErrorAnalysisLog(category_name="Ironi / Sarkasme", model_a_accuracy=81.2, model_b_accuracy=91.3, sample_count=149),
                ErrorAnalysisLog(category_name="Review Panjang", model_a_accuracy=78.0, model_b_accuracy=94.0, sample_count=50),
                ErrorAnalysisLog(category_name="Ambiguitas Tinggi", model_a_accuracy=79.3, model_b_accuracy=89.7, sample_count=29)
            ]
            db.add_all(error_logs)
            db.commit()
            
            print("Database already initialized. Statistical test updated.")
            return

        print("Seeding database...")
        
        # 1. Seed Benchmark Results for Model A (Feature Extraction - NVIDIA A100 Run)
        model_a_data = [
            BenchmarkResult(seed_number=42, model_type="Model A", accuracy=0.8589, precision=0.8452, recall=0.8851, f1_score=0.8647, inference_time_ms=1.81, peak_vram_mb=992.93),
            BenchmarkResult(seed_number=123, model_type="Model A", accuracy=0.8635, precision=0.8556, recall=0.8806, f1_score=0.8679, inference_time_ms=1.83, peak_vram_mb=3179.42),
            BenchmarkResult(seed_number=777, model_type="Model A", accuracy=0.8647, precision=0.8528, recall=0.8874, f1_score=0.8698, inference_time_ms=1.83, peak_vram_mb=3182.88),
            BenchmarkResult(seed_number=999, model_type="Model A", accuracy=0.8624, precision=0.8491, recall=0.8874, f1_score=0.8678, inference_time_ms=1.83, peak_vram_mb=3166.67),
            BenchmarkResult(seed_number=1234, model_type="Model A", accuracy=0.8658, precision=0.8547, recall=0.8874, f1_score=0.8707, inference_time_ms=1.83, peak_vram_mb=3170.55),
            BenchmarkResult(seed_number=2024, model_type="Model A", accuracy=0.8475, precision=0.8129, recall=0.9099, f1_score=0.8587, inference_time_ms=1.82, peak_vram_mb=3185.13)
        ]
        
        # 2. Seed Benchmark Results for Model B (Fine-Tuning - NVIDIA A100 Run)
        model_b_data = [
            BenchmarkResult(seed_number=42, model_type="Model B", accuracy=0.9381, precision=0.9314, recall=0.9482, f1_score=0.9397, inference_time_ms=1.82, peak_vram_mb=3170.63),
            BenchmarkResult(seed_number=123, model_type="Model B", accuracy=0.9312, precision=0.9267, recall=0.9392, f1_score=0.9329, inference_time_ms=1.83, peak_vram_mb=3168.17),
            BenchmarkResult(seed_number=777, model_type="Model B", accuracy=0.9163, precision=0.9406, recall=0.8919, f1_score=0.9156, inference_time_ms=1.82, peak_vram_mb=3175.50),
            BenchmarkResult(seed_number=999, model_type="Model B", accuracy=0.9278, precision=0.9205, recall=0.9392, f1_score=0.9298, inference_time_ms=1.82, peak_vram_mb=3179.63),
            BenchmarkResult(seed_number=1234, model_type="Model B", accuracy=0.9255, precision=0.9165, recall=0.9392, f1_score=0.9277, inference_time_ms=1.83, peak_vram_mb=3175.30),
            BenchmarkResult(seed_number=2024, model_type="Model B", accuracy=0.9278, precision=0.9114, recall=0.9505, f1_score=0.9305, inference_time_ms=1.84, peak_vram_mb=3169.55)
        ]
        
        # 3. Seed Statistical Tests (Audited A100 Experiment Values)
        stat_tests = StatisticalTest(
            mcnemar_p_value=5.04e-12,
            wilcoxon_p_value=0.015625,
            bootstrap_ci_lower=0.0548,
            bootstrap_ci_upper=0.0964,
            cohens_d=9.80,
            mcnemar_both_correct=735,
            mcnemar_a_correct_b_wrong=14,
            mcnemar_b_correct_a_wrong=83,
            mcnemar_both_wrong=40,
            mcnemar_chi2=47.6701
        )
        
        # 4. Seed Error Analysis per Linguistic Category (Empirical A100 values)
        error_logs = [
            ErrorAnalysisLog(category_name="Tanpa Negasi", model_a_accuracy=87.8, model_b_accuracy=94.4, sample_count=674),
            ErrorAnalysisLog(category_name="Negasi Biner", model_a_accuracy=79.8, model_b_accuracy=93.1, sample_count=173),
            ErrorAnalysisLog(category_name="Ironi / Sarkasme", model_a_accuracy=81.2, model_b_accuracy=91.3, sample_count=149),
            ErrorAnalysisLog(category_name="Review Panjang", model_a_accuracy=78.0, model_b_accuracy=94.0, sample_count=50),
            ErrorAnalysisLog(category_name="Ambiguitas Tinggi", model_a_accuracy=79.3, model_b_accuracy=89.7, sample_count=29)
        ]
        
        # 5. Seed initial prediction history log
        initial_log = PredictionLog(
            input_text="The movie was not bad, in fact the acting was surprisingly good.",
            model_a_label="Negative",
            model_a_confidence=58.42,
            model_a_latency_ms=14.25,
            model_b_label="Positive",
            model_b_confidence=97.86,
            model_b_latency_ms=15.10
        )
        
        db.add_all(model_a_data)
        db.add_all(model_b_data)
        db.add(stat_tests)
        db.add_all(error_logs)
        db.add(initial_log)
        
        db.commit()
        print("Database initialized and seeded successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
