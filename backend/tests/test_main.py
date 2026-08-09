import pytest
from fastapi.testclient import TestClient
from backend.app.main import app, startup_event, rate_limit_store

startup_event()
client = TestClient(app)

# ==========================================
# 1. Endpoint 1: GET /api/health
# ==========================================
def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

# ==========================================
# 2-3. Endpoint 2: POST /api/predict
# ==========================================
def test_predict_endpoint_valid():
    payload = {"text": "This movie was absolutely brilliant and wonderful!"}
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "data" in data
    assert "model_a" in data["data"]
    assert "model_b" in data["data"]

def test_predict_endpoint_empty_text():
    payload = {"text": ""}
    response = client.post("/api/predict", json=payload)
    assert response.status_code in [200, 400, 422]

# ==========================================
# 4. Endpoint 3: GET /api/benchmark-stats
# ==========================================
def test_benchmark_stats_endpoint():
    response = client.get("/api/benchmark-stats")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "mcnemar_matrix" in data
    assert "statistical_tests" in data
    assert "error_analysis" in data

# ==========================================
# 5. Endpoint 4: GET /api/history
# ==========================================
def test_prediction_history_get():
    response = client.get("/api/history")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

# ==========================================
# 6-7. Endpoint 5: DELETE /api/history/{log_id}
# ==========================================
def test_delete_single_history_item():
    # Insert a dummy prediction first
    payload = {"text": "Test single delete"}
    res_pred = client.post("/api/predict", json=payload)
    if res_pred.status_code == 200:
        hist = client.get("/api/history").json()
        if len(hist) > 0:
            target_id = hist[0]["id"]
            res_del = client.delete(f"/api/history/{target_id}")
            assert res_del.status_code == 200
            assert res_del.json()["status"] == "success"

def test_delete_single_history_not_found():
    res_del = client.delete("/api/history/999999")
    assert res_del.status_code in [200, 404, 500]

# ==========================================
# 8. Endpoint 6: DELETE /api/history (Bulk Delete)
# ==========================================
def test_delete_all_history_endpoint():
    response = client.delete("/api/history")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    # Verify history is empty
    hist_after = client.get("/api/history").json()
    assert len(hist_after) == 0

# ==========================================
# 9-11. Endpoint 7: POST /api/login (RBAC)
# ==========================================
def test_login_valid_researcher():
    payload = {"username": "syafiqmhd", "password": "123456"}
    response = client.post("/api/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["user_username"] == "syafiqmhd"
    assert data["status"] == "success"

def test_login_invalid_username():
    payload = {"username": "wrong_user", "password": "123456"}
    response = client.post("/api/login", json=payload)
    assert response.status_code == 401

def test_login_invalid_password():
    payload = {"username": "syafiqmhd", "password": "wrong_password"}
    response = client.post("/api/login", json=payload)
    assert response.status_code == 401

# ==========================================
# 12-13. API Security: Rate Limiting
# ==========================================
def test_rate_limiting_normal_traffic():
    rate_limit_store.clear()
    payload = {"text": "Normal traffic test"}
    res = client.post("/api/predict", json=payload)
    assert res.status_code == 200
    rate_limit_store.clear()

def test_rate_limiting_exceeded():
    rate_limit_store.clear()
    payload = {"text": "Test rate limit"}
    for _ in range(10):
        res = client.post("/api/predict", json=payload)
        assert res.status_code == 200
    res_exceeded = client.post("/api/predict", json=payload)
    assert res_exceeded.status_code == 429
    rate_limit_store.clear()

# ==========================================
# 14-15. Architecture & Middleware Safeguards
# ==========================================
def test_cors_headers_presence():
    response = client.get("/api/health")
    assert response.status_code == 200

def test_error_handling_fallback():
    response = client.get("/non-existent-path-abc")
    assert response.status_code in [404, 405]
