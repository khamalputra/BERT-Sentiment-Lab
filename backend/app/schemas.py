from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

# Input payload for /api/predict
class PredictRequest(BaseModel):
    text: str = Field(..., max_length=500, description="Input text to analyze for sentiment")
    username: Optional[str] = Field("public", description="Username associated with prediction for isolated history")

# Model result details in response
class ModelResultDetails(BaseModel):
    name: str
    label: str
    confidence: float
    latency_ms: float

# Inner data for prediction response
class PredictResponseData(BaseModel):
    input_text: str
    model_a: ModelResultDetails
    model_b: ModelResultDetails
    timestamp: datetime

# Final prediction response payload
class PredictResponse(BaseModel):
    status: str = "success"
    data: PredictResponseData

# Log database schema response
class PredictionLogResponse(BaseModel):
    id: int
    username: str = "public"
    input_text: str
    model_a_label: str
    model_a_confidence: float
    model_a_latency_ms: float
    model_b_label: str
    model_b_confidence: float
    model_b_latency_ms: float
    created_at: datetime

    class Config:
        from_attributes = True

# Model summary stats structure for benchmark
class ModelSummaryStats(BaseModel):
    accuracy_mean: float
    accuracy_std: float
    f1_mean: float
    f1_std: float
    avg_latency_ms: float
    peak_vram_mb: float
    reserved_vram: Optional[float] = None
    train_peak_vram: Optional[float] = None
    train_reserved_vram: Optional[float] = None
    stopped_epoch: Optional[int] = None
    best_val_f1: Optional[float] = None

# Statistical test metrics in benchmark stats API
class StatisticalTestDetails(BaseModel):
    mcnemar_p_value: float
    wilcoxon_p_value: float
    bootstrap_95_ci: List[float]
    cohens_d: float
    effect_size_interpretation: str

# Error analysis per category for Radar Chart
class ErrorAnalysisCategory(BaseModel):
    subject: str
    model_a_accuracy: float
    model_b_accuracy: float
    sample_count: int
    primary_error_type: Optional[str] = None

# McNemar contingency matrix 2x2 details
class McNemarMatrixDetails(BaseModel):
    both_correct: int
    a_correct_b_wrong: int
    b_correct_a_wrong: int
    both_wrong: int
    chi2: float

# Final benchmark response payload
class BenchmarkStatsResponse(BaseModel):
    status: str
    summary: Dict[str, ModelSummaryStats]
    statistical_tests: StatisticalTestDetails
    error_analysis: List[ErrorAnalysisCategory]
    mcnemar_matrix: McNemarMatrixDetails


# Authentication schemas for Dosen & Peneliti RBAC
class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    status: str
    token: str
    role: str
    user_name: str
    user_username: str
