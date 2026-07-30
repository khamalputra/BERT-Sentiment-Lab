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
                stat.cohens_d = 12.72
                stat.bootstrap_ci_lower = 0.0501
                stat.bootstrap_ci_upper = 0.0927
                stat.mcnemar_both_correct = 717
                stat.mcnemar_a_correct_b_wrong = 22
                stat.mcnemar_b_correct_a_wrong = 88
                stat.mcnemar_both_wrong = 45
                stat.mcnemar_chi2 = 38.4091
                db.commit()
            
            # Seed ErrorAnalysisLog if empty
            if db.query(ErrorAnalysisLog).count() == 0:
                error_logs = [
                    ErrorAnalysisLog(category_name="Tanpa Negasi", model_a_accuracy=86.5, model_b_accuracy=93.9, sample_count=688),
                    ErrorAnalysisLog(category_name="Negasi Biner", model_a_accuracy=78.3, model_b_accuracy=86.4, sample_count=184),
                    ErrorAnalysisLog(category_name="Ironi / Sarkasme", model_a_accuracy=79.7, model_b_accuracy=91.2, sample_count=148),
                    ErrorAnalysisLog(category_name="Review Panjang", model_a_accuracy=83.4, model_b_accuracy=91.8, sample_count=380),
                    ErrorAnalysisLog(category_name="Ambiguitas Tinggi", model_a_accuracy=77.1, model_b_accuracy=89.6, sample_count=48)
                ]
                db.add_all(error_logs)
                db.commit()
            
            print("Database already initialized. Statistical test updated.")
            return

        print("Seeding database...")
        
        # 1. Seed Benchmark Results for Model A (Feature Extraction)
        model_a_data = [
            BenchmarkResult(seed_number=42, model_type="Model A", accuracy=0.8475, precision=0.8233, recall=0.8919, f1_score=0.8562, inference_time_ms=7.65, peak_vram_mb=568.57),
            BenchmarkResult(seed_number=123, model_type="Model A", accuracy=0.8658, precision=0.8759, recall=0.8581, f1_score=0.8669, inference_time_ms=7.63, peak_vram_mb=2332.74),
            BenchmarkResult(seed_number=777, model_type="Model A", accuracy=0.8578, precision=0.8463, recall=0.8806, f1_score=0.8631, inference_time_ms=7.59, peak_vram_mb=2322.74),
            BenchmarkResult(seed_number=999, model_type="Model A", accuracy=0.8417, precision=0.7965, recall=0.9257, f1_score=0.8562, inference_time_ms=7.67, peak_vram_mb=2327.74),
            BenchmarkResult(seed_number=1234, model_type="Model A", accuracy=0.8429, precision=0.8040, recall=0.9144, f1_score=0.8556, inference_time_ms=7.64, peak_vram_mb=2328.36),
            BenchmarkResult(seed_number=2024, model_type="Model A", accuracy=0.8532, precision=0.8251, recall=0.9032, f1_score=0.8624, inference_time_ms=7.66, peak_vram_mb=2327.00)
        ]
        
        # 2. Seed Benchmark Results for Model B (Fine-Tuning)
        model_b_data = [
            BenchmarkResult(seed_number=42, model_type="Model B", accuracy=0.9232, precision=0.9002, recall=0.9550, f1_score=0.9268, inference_time_ms=7.78, peak_vram_mb=2312.49),
            BenchmarkResult(seed_number=123, model_type="Model B", accuracy=0.9117, precision=0.8768, recall=0.9617, f1_score=0.9173, inference_time_ms=7.73, peak_vram_mb=2329.24),
            BenchmarkResult(seed_number=777, model_type="Model B", accuracy=0.9197, precision=0.8929, recall=0.9572, f1_score=0.9239, inference_time_ms=7.75, peak_vram_mb=2327.61),
            BenchmarkResult(seed_number=999, model_type="Model B", accuracy=0.9140, precision=0.8901, recall=0.9482, f1_score=0.9182, inference_time_ms=7.76, peak_vram_mb=2328.24),
            BenchmarkResult(seed_number=1234, model_type="Model B", accuracy=0.9255, precision=0.9278, recall=0.9257, f1_score=0.9267, inference_time_ms=7.77, peak_vram_mb=2323.36),
            BenchmarkResult(seed_number=2024, model_type="Model B", accuracy=0.9128, precision=0.9017, recall=0.9302, f1_score=0.9157, inference_time_ms=7.78, peak_vram_mb=2327.36)
        ]
        
        # 3. Seed Statistical Tests (Audited Exact Experiment Values)
        stat_tests = StatisticalTest(
            mcnemar_p_value=0.00000001,
            wilcoxon_p_value=0.01562,
            bootstrap_ci_lower=0.0501,
            bootstrap_ci_upper=0.0927,
            cohens_d=12.72,
            mcnemar_both_correct=717,
            mcnemar_a_correct_b_wrong=22,
            mcnemar_b_correct_a_wrong=88,
            mcnemar_both_wrong=45,
            mcnemar_chi2=38.4091
        )
        
        # 4. Seed Error Analysis per Linguistic Category (Empirical Colab values)
        # Note: Categories are overlapping (non-mutually-exclusive), so total samples > N=872.
        error_logs = [
            ErrorAnalysisLog(category_name="Tanpa Negasi", model_a_accuracy=86.5, model_b_accuracy=93.9, sample_count=688),
            ErrorAnalysisLog(category_name="Negasi Biner", model_a_accuracy=78.3, model_b_accuracy=86.4, sample_count=184),
            ErrorAnalysisLog(category_name="Ironi / Sarkasme", model_a_accuracy=79.7, model_b_accuracy=91.2, sample_count=148),
            ErrorAnalysisLog(category_name="Review Panjang", model_a_accuracy=83.4, model_b_accuracy=91.8, sample_count=380),
            ErrorAnalysisLog(category_name="Ambiguitas Tinggi", model_a_accuracy=77.1, model_b_accuracy=89.6, sample_count=48)
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
