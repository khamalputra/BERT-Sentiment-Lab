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
    if not os.path.exists(model_b_dir) or not any(f.endswith(('.safetensors', '.bin')) for root, _, files in os.walk(model_b_dir) for f in files):
        print("\n--- Downloading Model B (Fine-Tuned BERT Archive) ---")
        if not os.path.exists(model_b_zip_path):
            download_from_gdrive(MODEL_B_FILE_ID, model_b_zip_path)
        
        # Comprehensive ZIP handling
        if zipfile.is_zipfile(model_b_zip_path):
            print("Extracting Model B archive...")
            os.makedirs(model_b_dir, exist_ok=True)
            with zipfile.ZipFile(model_b_zip_path, 'r') as zip_ref:
                file_list = zip_ref.namelist()
                # If zip contains a top-level 'model_b/' folder
                if any(name.startswith('model_b/') for name in file_list):
                    zip_ref.extractall(MODELS_DIR)
                else:
                    # If zip contains files directly without 'model_b/' wrapper
                    zip_ref.extractall(model_b_dir)
            
            # Clean up zip archive after extraction
            if os.path.exists(model_b_zip_path):
                os.remove(model_b_zip_path)
            print("Model B extracted successfully to 'backend/models/model_b/'!")
        else:
            # Fallback if downloaded file is direct weight file
            if not os.path.exists(model_b_dir):
                os.makedirs(model_b_dir, exist_ok=True)
            target_file = os.path.join(model_b_dir, "model.safetensors")
            if os.path.exists(model_b_zip_path):
                shutil.move(model_b_zip_path, target_file)
            print("Moved Model B weight file directly to 'backend/models/model_b/model.safetensors'.")
    else:
        print("Model B directory (model_b/) and weights are already present.")

    print("\n[SUCCESS] Model verification and setup complete!")

if __name__ == "__main__":
    setup_models()
