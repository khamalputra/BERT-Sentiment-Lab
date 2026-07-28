import time
import os
import torch
import numpy as np
from transformers import BertModel, BertForSequenceClassification, BertTokenizerFast

class ModelEngine:
    def __init__(self):
        self.tokenizer = None
        self.has_real_models = False
        
        # Check if actual model files exist in the models directory
        models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
        model_a_path = os.path.join(models_dir, "model_a.pt")
        model_b_path = os.path.join(models_dir, "model_b")
        
        if os.path.exists(model_a_path) and os.path.exists(model_b_path):
            try:
                print(f"Weights detected! Loading real PyTorch models from {models_dir}...")
                self.tokenizer = BertTokenizerFast.from_pretrained("bert-base-uncased")
                
                # Load Model A (Frozen BERT + custom classifier linear head weights)
                self.bert_a = BertModel.from_pretrained("bert-base-uncased")
                self.classifier_a = torch.nn.Linear(768, 2)
                try:
                    state_dict = torch.load(model_a_path, map_location="cpu", weights_only=False)
                except TypeError:
                    state_dict = torch.load(model_a_path, map_location="cpu")
                self.classifier_a.load_state_dict(state_dict)
                self.bert_a.eval()
                self.classifier_a.eval()
                
                # Load Model B (Fine-Tuned BertForSequenceClassification model folder)
                self.model_b = BertForSequenceClassification.from_pretrained(model_b_path)
                self.model_b.eval()
                
                self.has_real_models = True
                print("Successfully loaded real PyTorch models for inference!")
            except Exception as e:
                print(f"Error loading PyTorch models: {e}")
                raise RuntimeError(f"Failed to load PyTorch models: {e}")
        else:
            print(f"Warning: Model weight files not found in {models_dir}.")

    def predict(self, text: str):
        """
        Runs side-by-side inference on the input text using real PyTorch neural network models.
        """
        if not self.has_real_models:
            raise RuntimeError("Real PyTorch models are not initialized or model weight files are missing.")

        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=128, padding=True)
        
        # PyTorch CPU Warmup Pass (eliminates cold-start OpenMP/MKL thread allocation overhead)
        with torch.no_grad():
            _ = self.bert_a(input_ids=inputs["input_ids"], attention_mask=inputs["attention_mask"])
        
        # Model A (Feature Extraction) inference
        start_a = time.time()
        with torch.no_grad():
            outputs_a_bert = self.bert_a(input_ids=inputs["input_ids"], attention_mask=inputs["attention_mask"])
            cls_rep = outputs_a_bert.last_hidden_state[:, 0, :]
            logits_a = self.classifier_a(cls_rep)
            probs_a = torch.softmax(logits_a, dim=1)[0].numpy()
            pred_class_a = int(np.argmax(probs_a))
        latency_a = round((time.time() - start_a) * 1000, 2)
        
        # Model B (Fine-Tuned) inference
        start_b = time.time()
        with torch.no_grad():
            logits_b = self.model_b(input_ids=inputs["input_ids"], attention_mask=inputs["attention_mask"]).logits
            probs_b = torch.softmax(logits_b, dim=1)[0].numpy()
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
