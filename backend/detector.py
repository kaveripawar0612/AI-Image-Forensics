import cv2
import numpy as np
from PIL import Image, ImageChops, ImageEnhance
import io
import base64

def perform_ela(image_bytes: bytes, quality: int = 90) -> tuple[np.ndarray, float]:
    original = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    
    # Save image in memory at specific quality level
    buffer = io.BytesIO()
    original.save(buffer, 'JPEG', quality=quality)
    buffer.seek(0)
    
    compressed = Image.open(buffer)
    
    # Calculate error difference between original and re-compressed version
    ela_im = ImageChops.difference(original, compressed)
    extrema = ela_im.getextrema()
    max_diff = max([ex[1] for ex in extrema])
    scale = 255.0 / max_diff if max_diff != 0 else 1.0
    ela_im = ImageEnhance.Brightness(ela_im).enhance(scale)
    
    ela_array = np.array(ela_im)
    ela_score = float(np.mean(ela_array))
    return ela_array, ela_score


def analyze_image_forensics(image_bytes: bytes):
    ela_array, ela_score = perform_ela(image_bytes)
    
    nparr = np.frombuffer(image_bytes, np.uint8)
    cv_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if cv_img is None:
        raise ValueError("Invalid image file")

    gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
    laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    
    # Decision Engine
    if ela_score > 32.0:
        is_forged = True
        forgery_type = "Image Splicing / Copy-Move"
        confidence = min(98.5, 65.0 + (ela_score - 32.0) * 1.2)
        risk_level = "HIGH"
    elif ela_score > 22.0:
        is_forged = True
        forgery_type = "Digital Retouching / Manipulation"
        confidence = min(88.0, 50.0 + (ela_score - 22.0) * 2.5)
        risk_level = "MEDIUM"
    elif laplacian_var > 1500.0 and ela_score > 18.0:
        is_forged = True
        forgery_type = "Deepfake / AI Synthetic Artifacts"
        confidence = 84.5
        risk_level = "MEDIUM"
    else:
        is_forged = False
        forgery_type = "Authentic (No Manipulation Detected)"
        confidence = max(91.2, 100.0 - (ela_score * 2))
        risk_level = "LOW"

    # Generate Heatmap Visualization
    heatmap_gray = cv2.cvtColor(ela_array, cv2.COLOR_RGB2GRAY)
    heatmap_color = cv2.applyColorMap(heatmap_gray, cv2.COLORMAP_JET)
    overlay = cv2.addWeighted(cv_img, 0.6, heatmap_color, 0.4, 0)
    
    _, buffer = cv2.imencode('.jpg', overlay)
    heatmap_base64 = base64.b64encode(buffer).decode('utf-8')
    
    return {
        "prediction": "FORGED" if is_forged else "AUTHENTIC",
        "is_forged": is_forged,
        "confidence": round(confidence, 2),
        "forgery_type": forgery_type,
        "risk_level": risk_level,
        "heatmap": f"data:image/jpeg;base64,{heatmap_base64}",
        "message": "Forensic analysis complete."
    }