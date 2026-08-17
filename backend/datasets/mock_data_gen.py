import os
import csv
import numpy as np
from PIL import Image

def generate_mock_dataset(base_dir="."):
    os.makedirs(base_dir, exist_ok=True)
    manifest_path = os.path.join(base_dir, "manifest.csv")
    
    data = [
        # filename, label, attack_type, source_dataset, split
        ("Au_1.jpg", "authentic", "none", "CASIA2", "train"),
        ("Au_2.jpg", "authentic", "none", "CASIA2", "test"),
        ("Tp_1.jpg", "forged", "copy-move", "CASIA2", "train"),
        ("Tp_2.jpg", "forged", "splicing", "CASIA2", "test"),
        ("Df_1.jpg", "forged", "deepfake", "FaceForensics++", "train"),
        ("Df_2.jpg", "forged", "deepfake", "FaceForensics++", "test"),
        ("Gan_1.jpg", "forged", "generative-ai", "Synthetic", "train"),
        ("Gan_2.jpg", "forged", "generative-ai", "Synthetic", "test")
    ]
    
    with open(manifest_path, mode='w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["filepath", "label", "attack_type", "source_dataset", "split"])
        for row in data:
            filepath = os.path.join(base_dir, row[0])
            writer.writerow([filepath, row[1], row[2], row[3], row[4]])
            
            # Generate dummy image
            img_arr = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
            
            if row[2] == "generative-ai":
                # Add some periodic high frequency artifact
                img_arr[::8, ::8] = 255
            elif row[2] == "copy-move":
                # Copy a block
                img_arr[50:100, 50:100] = img_arr[10:60, 10:60]
                
            img = Image.fromarray(img_arr)
            img.save(filepath)

if __name__ == "__main__":
    generate_mock_dataset("/Users/kirteshchavhan/AI-Image-Forensics/backend/datasets")
    print("Mock dataset generated.")
