from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.sql import func
from .database import Base

class PredictionLog(Base):
    __tablename__ = "prediction_logs"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), nullable=True, index=True, default="public")
    input_text = Column(Text, nullable=False)
    model_a_label = Column(String(20), nullable=False)
    model_a_confidence = Column(Float, nullable=False)
    model_a_latency_ms = Column(Float, nullable=False)
    model_b_label = Column(String(20), nullable=False)
    model_b_confidence = Column(Float, nullable=False)
    model_b_latency_ms = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class BenchmarkResult(Base):
    __tablename__ = "benchmark_results"

    id = Column(Integer, primary_key=True, index=True)
    seed_number = Column(Integer, nullable=False)
    model_type = Column(String(20), nullable=False)  # 'Model A' or 'Model B'
    accuracy = Column(Float, nullable=False)
    precision = Column(Float, nullable=False)
    recall = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    inference_time_ms = Column(Float, nullable=False)
    peak_vram_mb = Column(Float, nullable=False)

class StatisticalTest(Base):
    __tablename__ = "statistical_tests"

    id = Column(Integer, primary_key=True, index=True)
    mcnemar_p_value = Column(Float, nullable=False)
    wilcoxon_p_value = Column(Float, nullable=False)
    bootstrap_ci_lower = Column(Float, nullable=False)
    bootstrap_ci_upper = Column(Float, nullable=False)
    cohens_d = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
