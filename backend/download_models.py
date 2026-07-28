import os
import zipfile
import sys
import shutil

# Safe import for gdown
try:
    import gdown
except ImportError:
    print("Package 'gdown' not found. Installing gdown...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "gdown"])
    import gdown

# Directory configurations
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# Google Drive File IDs provided by user
MODEL_A_FILE_ID = "10Rdz9ZIWX6VqZ5mHuzsWe3OVFu70CtAR"
MODEL_B_FILE_ID = "1TVR2g4I3QnwcTUX5N9DKXQduSfBca0C7"

def download_from_gdrive(file_id: str, output_path: str):
    """Downloads a file from Google Drive using gdown."""
    print(f"Downloading File ID [{file_id}] to '{output_path}'...")
    url = f"https://drive.google.com/uc?id={file_id}"
    try:
        gdown.download(url, output_path, quiet=False)
        if os.path.exists(output_path) and os.path.getsize(output_path) > 5000:
            return
    except Exception as e1:
        print(f"gdown download attempt note: {e1}")

    # Fallback using requests
    print("Executing requests Session fallback with confirm=t...")
    try:
        import requests
        session = requests.Session()
        URL = "https://docs.google.com/uc?export=download"
        response = session.get(URL, params={'id': file_id, 'confirm': 't'}, stream=True)
        if response.status_code == 200:
            with open(output_path, "wb") as f:
                for chunk in response.iter_content(32768):
                    if chunk:
                        f.write(chunk)
            print(f"Requests fallback downloaded '{output_path}' ({os.path.getsize(output_path)} bytes).")
    except Exception as e2:
        print(f"Requests fallback error: {e2}")

def setup_models():
    """Ensures model_a.pt and model_b directory are downloaded and extracted."""
    os.makedirs(MODELS_DIR, exist_ok=True)
    
    model_a_path = os.path.join(MODELS_DIR, "model_a.pt")
    model_b_dir = os.path.join(MODELS_DIR, "model_b")
    model_b_zip_path = os.path.join(MODELS_DIR, "model_b.zip")
    safetensors_path = os.path.join(model_b_dir, "model.safetensors")

    # Clean up corrupted HTML fallback files if present
    if os.path.exists(safetensors_path) and os.path.getsize(safetensors_path) < 10000000: # < 10MB
        print("Cleaning up corrupted model_b weight file (<10MB HTML response)...")
        shutil.rmtree(model_b_dir, ignore_errors=True)
        
    if os.path.exists(model_a_path):
        with open(model_a_path, "rb") as f:
            head = f.read(50).lower()
            if b"<!doctype" in head or b"<html" in head:
                print("Cleaning up corrupted model_a weight file (HTML response)...")
                os.remove(model_a_path)
    
    # 1. Check and download Model A (Frozen classifier head weights)
    if not os.path.exists(model_a_path):
        print("\n--- Downloading Model A (Feature Extraction Weights) ---")
        download_from_gdrive(MODEL_A_FILE_ID, model_a_path)
        if os.path.exists(model_a_path):
            with open(model_a_path, "rb") as f:
                head = f.read(50).lower()
                if b"<!doctype" in head or b"<html" in head:
                    print("ERROR: Downloaded model_a.pt is an Access Denied HTML page from Google Drive!")
                    os.remove(model_a_path)
    else:
        print("Model A (model_a.pt) is already present.")

    # 2. Check and download Model B (Fine-Tuned BertForSequenceClassification folder or zip)
    has_valid_weights = os.path.exists(model_b_dir) and any(
        f.endswith(('.safetensors', '.bin')) and os.path.getsize(os.path.join(root, f)) > 10000000
        for root, _, files in os.walk(model_b_dir) for f in files
    )

    if not has_valid_weights:
        print("\n--- Downloading Model B (Fine-Tuned BERT Archive) ---")
        if not os.path.exists(model_b_zip_path):
            download_from_gdrive(MODEL_B_FILE_ID, model_b_zip_path)
        
        # Comprehensive ZIP handling
        if os.path.exists(model_b_zip_path) and zipfile.is_zipfile(model_b_zip_path):
            print("Extracting Model B archive...")
            os.makedirs(model_b_dir, exist_ok=True)
            with zipfile.ZipFile(model_b_zip_path, 'r') as zip_ref:
                file_list = zip_ref.namelist()
                if any(name.startswith('model_b/') for name in file_list):
                    zip_ref.extractall(MODELS_DIR)
                else:
                    zip_ref.extractall(model_b_dir)
            
            if os.path.exists(model_b_zip_path):
                os.remove(model_b_zip_path)
            print("Model B extracted successfully to 'backend/models/model_b/'!")
        else:
            if os.path.exists(model_b_zip_path):
                print(f"Downloaded model_b archive ({os.path.getsize(model_b_zip_path)} bytes) is not a valid ZIP file. Removing corrupted file.")
                os.remove(model_b_zip_path)
            print("Notice: Please ensure Google Drive file permissions are set to 'Anyone with the link'.")
    else:
        print("Model B directory (model_b/) and weights are already present.")

    print("\n[SUCCESS] Model verification and setup complete!")

if __name__ == "__main__":
    setup_models()
