import time
import os
import torch
import torch.nn as nn
import numpy as np
from transformers import BertModel, BertForSequenceClassification, BertTokenizerFast

class FeatureExtractorClassifier(nn.Module):
    """Model A architecture matching Experiment_Notebook.ipynb Cell 8"""
    def __init__(self, bert):
        super().__init__()
        self.bert = bert
        self.classifier = nn.Linear(768, 2)

    def forward(self, input_ids, attention_mask):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        cls_representation = outputs.last_hidden_state[:, 0, :]
        return self.classifier(cls_representation)

class ModelEngine:
    def __init__(self):
        self.tokenizer = None
        self.has_real_models = False
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Check if actual model files exist in the models directory
        models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
        model_a_path = os.path.join(models_dir, "model_a.pt")
        model_b_path = os.path.join(models_dir, "model_b")
        
        if os.path.exists(model_a_path) and os.path.exists(model_b_path):
            try:
                print(f"Weights detected! Loading real PyTorch models from {models_dir} on {self.device}...")
                self.tokenizer = BertTokenizerFast.from_pretrained("bert-base-uncased")
                
                # Load Model A (Frozen BERT + custom classifier linear head weights)
                bert_a_base = BertModel.from_pretrained("bert-base-uncased")
                for param in bert_a_base.parameters():
                    param.requires_grad = False
                
                self.model_a = FeatureExtractorClassifier(bert_a_base)
                try:
                    state_dict = torch.load(model_a_path, map_location="cpu", weights_only=False)
                except TypeError:
                    state_dict = torch.load(model_a_path, map_location="cpu")
                self.model_a.classifier.load_state_dict(state_dict)
                self.model_a.to(self.device)
                self.model_a.eval()
                
                # Load Model B (Fine-Tuned BertForSequenceClassification model folder)
                self.model_b = BertForSequenceClassification.from_pretrained(model_b_path)
                self.model_b.to(self.device)
                self.model_b.eval()
                
                self.has_real_models = True
                print(f"Successfully loaded real PyTorch models matching Experiment Notebook on {self.device}!")
            except Exception as e:
                print(f"Error loading PyTorch models: {e}")
                raise RuntimeError(f"Failed to load PyTorch models: {e}")
        else:
            print(f"Warning: Model weight files not found in {models_dir}.")

    def predict(self, text: str):
        """
        Runs side-by-side inference on the input text matching Experiment_Notebook.ipynb.
        """
        if not self.has_real_models:
            raise RuntimeError("Real PyTorch models are not initialized or model weight files are missing.")

        encoded = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=128, padding=True)
        input_ids = encoded["input_ids"].to(self.device)
        attention_mask = encoded["attention_mask"].to(self.device)
        
        # Warmup pass for both models on device to ensure fair latency measurement
        with torch.no_grad():
            _ = self.model_a(input_ids=input_ids, attention_mask=attention_mask)
            _ = self.model_b(input_ids=input_ids, attention_mask=attention_mask)

        # Model A Inference (Feature Extraction)
        start_a = time.time()
        with torch.no_grad():
            logits_a = self.model_a(input_ids=input_ids, attention_mask=attention_mask)
            probs_a = torch.softmax(logits_a, dim=1)[0].cpu().numpy()
            pred_class_a = int(np.argmax(probs_a))
        latency_a = round((time.time() - start_a) * 1000, 2)
        
        # Model B Inference (End-to-End Fine-Tuning)
        start_b = time.time()
        with torch.no_grad():
            outputs_b = self.model_b(input_ids=input_ids, attention_mask=attention_mask)
            probs_b = torch.softmax(outputs_b.logits, dim=1)[0].cpu().numpy()
            pred_class_b = int(np.argmax(probs_b))
        latency_b = round((time.time() - start_b) * 1000, 2)
        
        label_map = {0: "Negative", 1: "Positive"}
        
        return {
            "model_a": {
                "name": "BERT Feature Extraction (Frozen)",
                "label": label_map[pred_class_a],
                "confidence": round(float(probs_a[pred_class_a]) * 100, 2),
                "latency_ms": latency_a
            },
            "model_b": {
                "name": "BERT End-to-End Fine-Tuning",
                "label": label_map[pred_class_b],
                "confidence": round(float(probs_b[pred_class_b]) * 100, 2),
                "latency_ms": latency_b
            }
        }
