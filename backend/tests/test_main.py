import pytest
from fastapi.testclient import TestClient
from backend.app.main import app, startup_event

startup_event()
client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_predict_endpoint_valid():
    payload = {
        "text": "This movie was absolutely brilliant and wonderful!"
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "data" in data
    assert "model_a" in data["data"]
    assert "model_b" in data["data"]

def test_benchmark_stats_endpoint():
    response = client.get("/api/benchmark-stats")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "mcnemar_matrix" in data
    assert "statistical_tests" in data
    assert "error_analysis" in data

def test_prediction_history_endpoint():
    response = client.get("/api/history")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_login_valid_researcher():
    payload = {
        "username": "syafiqmhd",
        "password": "123456"
    }
    response = client.post("/api/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["user_username"] == "syafiqmhd"
    assert data["status"] == "success"

def test_login_invalid_credentials():
    payload = {
        "username": "wrong_user",
        "password": "wrong_password"
    }
    response = client.post("/api/login", json=payload)
    assert response.status_code == 401

def test_rate_limiting_exceeded():
    from backend.app.main import rate_limit_store
    rate_limit_store.clear()
    payload = {"text": "Test rate limit"}
    for _ in range(10):
        res = client.post("/api/predict", json=payload)
        assert res.status_code == 200
    res_exceeded = client.post("/api/predict", json=payload)
    assert res_exceeded.status_code == 429
    rate_limit_store.clear()

