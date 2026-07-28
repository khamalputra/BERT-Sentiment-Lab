import os
import zipfile
import sys

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
    url = f"https://drive.google.com/uc?id={file_id}"
    print(f"Downloading File ID [{file_id}] to '{output_path}'...")
    gdown.download(url, output_path, quiet=False)

def setup_models():
    """Ensures model_a.pt and model_b directory are downloaded and extracted."""
    os.makedirs(MODELS_DIR, exist_ok=True)
    
    model_a_path = os.path.join(MODELS_DIR, "model_a.pt")
    model_b_dir = os.path.join(MODELS_DIR, "model_b")
    model_b_zip_path = os.path.join(MODELS_DIR, "model_b.zip")
    
    # 1. Check and download Model A (Frozen classifier head weights)
    if not os.path.exists(model_a_path):
        print("\n--- Downloading Model A (Feature Extraction Weights) ---")
        download_from_gdrive(MODEL_A_FILE_ID, model_a_path)
    else:
        print("Model A (model_a.pt) is already present.")

    # 2. Check and download Model B (Fine-Tuned BertForSequenceClassification folder or zip)
    if not os.path.exists(model_b_dir):
        print("\n--- Downloading Model B (Fine-Tuned BERT) ---")
        if not os.path.exists(model_b_zip_path):
            download_from_gdrive(MODEL_B_FILE_ID, model_b_zip_path)
        
        # Check if the downloaded file is a ZIP or direct file
        if zipfile.is_zipfile(model_b_zip_path):
            print("Extracting Model B archive...")
            with zipfile.ZipFile(model_b_zip_path, 'r') as zip_ref:
                zip_ref.extractall(MODELS_DIR)
            if os.path.exists(model_b_zip_path):
                os.remove(model_b_zip_path)
            print("Model B extracted successfully.")
        else:
            print("Downloaded Model B file directly.")
    else:
        print("Model B directory (model_b/) is already present.")

    print("\n[SUCCESS] Model verification and setup complete!")

if __name__ == "__main__":
    setup_models()
