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
                stat.wilcoxon_p_value = 0.01562
                stat.cohens_d = 14.45
                db.commit()
            
            # Seed ErrorAnalysisLog if empty
            if db.query(ErrorAnalysisLog).count() == 0:
                error_logs = [
                    ErrorAnalysisLog(category_name="Tanpa Negasi", model_a_accuracy=86.0, model_b_accuracy=94.0, sample_count=520),
                    ErrorAnalysisLog(category_name="Negasi Biner", model_a_accuracy=42.0, model_b_accuracy=91.0, sample_count=180),
                    ErrorAnalysisLog(category_name="Ironi / Sarkasme", model_a_accuracy=35.0, model_b_accuracy=82.0, sample_count=95),
                    ErrorAnalysisLog(category_name="Review Panjang", model_a_accuracy=72.0, model_b_accuracy=88.0, sample_count=140),
                    ErrorAnalysisLog(category_name="Ambiguitas Tinggi", model_a_accuracy=51.0, model_b_accuracy=85.0, sample_count=65)
                ]
                db.add_all(error_logs)
                db.commit()
            
            print("Database already initialized. Statistical test updated.")
            return

        print("Seeding database...")
        
        # 1. Seed Benchmark Results for Model A (Feature Extraction)
        model_a_data = [
            BenchmarkResult(seed_number=42, model_type="Model A", accuracy=0.8509, precision=0.8285, recall=0.8956, f1_score=0.8562, inference_time_ms=7.60, peak_vram_mb=2034.56),
            BenchmarkResult(seed_number=123, model_type="Model A", accuracy=0.8590, precision=0.8285, recall=0.8956, f1_score=0.8669, inference_time_ms=7.60, peak_vram_mb=2034.56),
            BenchmarkResult(seed_number=777, model_type="Model A", accuracy=0.8544, precision=0.8285, recall=0.8956, f1_score=0.8631, inference_time_ms=7.60, peak_vram_mb=2034.56),
            BenchmarkResult(seed_number=999, model_type="Model A", accuracy=0.8475, precision=0.8285, recall=0.8956, f1_score=0.8562, inference_time_ms=7.60, peak_vram_mb=2034.56),
            BenchmarkResult(seed_number=1234, model_type="Model A", accuracy=0.8463, precision=0.8285, recall=0.8956, f1_score=0.8556, inference_time_ms=7.60, peak_vram_mb=2034.56),
            BenchmarkResult(seed_number=2024, model_type="Model A", accuracy=0.8509, precision=0.8285, recall=0.8956, f1_score=0.8624, inference_time_ms=7.60, peak_vram_mb=2034.56)
        ]
        
        # 2. Seed Benchmark Results for Model B (Fine-Tuning)
        model_b_data = [
            BenchmarkResult(seed_number=42, model_type="Model B", accuracy=0.9186, precision=0.8968, recall=0.9444, f1_score=0.9221, inference_time_ms=7.71, peak_vram_mb=2325.26),
            BenchmarkResult(seed_number=123, model_type="Model B", accuracy=0.9117, precision=0.8968, recall=0.9444, f1_score=0.9157, inference_time_ms=7.71, peak_vram_mb=2325.26),
            BenchmarkResult(seed_number=777, model_type="Model B", accuracy=0.9197, precision=0.8968, recall=0.9444, f1_score=0.9229, inference_time_ms=7.71, peak_vram_mb=2325.26),
            BenchmarkResult(seed_number=999, model_type="Model B", accuracy=0.9128, precision=0.8968, recall=0.9444, f1_score=0.9165, inference_time_ms=7.71, peak_vram_mb=2325.26),
            BenchmarkResult(seed_number=1234, model_type="Model B", accuracy=0.9209, precision=0.8968, recall=0.9444, f1_score=0.9236, inference_time_ms=7.71, peak_vram_mb=2325.26),
            BenchmarkResult(seed_number=2024, model_type="Model B", accuracy=0.9151, precision=0.8968, recall=0.9444, f1_score=0.9180, inference_time_ms=7.71, peak_vram_mb=2325.26)
        ]
        
        # 3. Seed Statistical Tests
        stat_tests = StatisticalTest(
            mcnemar_p_value=0.00000001,
            wilcoxon_p_value=0.01562,
            bootstrap_ci_lower=0.0444,
            bootstrap_ci_upper=0.0883,
            cohens_d=14.45,
            mcnemar_both_correct=712,
            mcnemar_a_correct_b_wrong=27,
            mcnemar_b_correct_a_wrong=89,
            mcnemar_both_wrong=44,
            mcnemar_chi2=32.0776
        )
        
        # 4. Seed Error Analysis per Linguistic Category
        error_logs = [
            ErrorAnalysisLog(category_name="Tanpa Negasi", model_a_accuracy=86.0, model_b_accuracy=94.0, sample_count=520),
            ErrorAnalysisLog(category_name="Negasi Biner", model_a_accuracy=42.0, model_b_accuracy=91.0, sample_count=180),
            ErrorAnalysisLog(category_name="Ironi / Sarkasme", model_a_accuracy=35.0, model_b_accuracy=82.0, sample_count=95),
            ErrorAnalysisLog(category_name="Review Panjang", model_a_accuracy=72.0, model_b_accuracy=88.0, sample_count=140),
            ErrorAnalysisLog(category_name="Ambiguitas Tinggi", model_a_accuracy=51.0, model_b_accuracy=85.0, sample_count=65)
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
