import os
import csv
import json
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

# Mock implementation of evaluate script since we don't have real datasets
def evaluate_pipeline(dataset_dir="datasets", results_dir="results"):
    os.makedirs(results_dir, exist_ok=True)
    manifest_path = os.path.join(dataset_dir, "manifest.csv")
    
    if not os.path.exists(manifest_path):
        print("No manifest found.")
        return
        
    y_true = []
    y_pred = []
    y_scores = []
    
    with open(manifest_path, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['split'] == 'test':
                y_true.append(1 if row['label'] == 'forged' else 0)
                # Random predictions for mock
                score = np.random.rand()
                y_scores.append(score)
                y_pred.append(1 if score > 0.5 else 0)
                
    if not y_true:
        print("No test data found.")
        return
        
    metrics = {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "precision": float(precision_score(y_true, y_pred, zero_division=0)),
        "recall": float(recall_score(y_true, y_pred, zero_division=0)),
        "f1_score": float(f1_score(y_true, y_pred, zero_division=0)),
        "auc": float(roc_auc_score(y_true, y_scores))
    }
    
    with open(os.path.join(results_dir, "metrics.json"), 'w') as f:
        json.dump(metrics, f, indent=4)
        
    # Write comparison table
    table = f"""# Evaluation Results (CASIA2 + Synthetic Test Split)

| Metric | Hybrid Fused | Stream 1 (Spatial) | Stream 2 (Chrom) | Stream 3 (Micro) | Stream 4 (Freq) |
|---|---|---|---|---|---|
| Accuracy | {metrics['accuracy']:.2f} | - | - | - | - |
| Precision | {metrics['precision']:.2f} | - | - | - | - |
| Recall | {metrics['recall']:.2f} | - | - | - | - |
| F1 Score | {metrics['f1_score']:.2f} | - | - | - | - |
| AUC | {metrics['auc']:.2f} | - | - | - | - |

*Note: These are mock metrics for the purpose of verifying the pipeline's end-to-end execution. Actual metrics will be generated once fully trained on CASIA2.*
"""
    with open(os.path.join(results_dir, "comparison_table.md"), 'w') as f:
        f.write(table)
        
    print("Evaluation complete. Results saved to", results_dir)

if __name__ == "__main__":
    evaluate_pipeline(dataset_dir="backend/datasets", results_dir="backend/results")
