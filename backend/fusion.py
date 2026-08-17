import numpy as np
import cv2
import base64
from io import BytesIO
from PIL import Image

# Import the streams
from streams import spatial, chrominance, micro_texture, frequency

# Default weights for fusion
STREAM_WEIGHTS = {
    "spatial": 0.25,
    "chrominance": 0.25,
    "micro_texture": 0.25,
    "frequency": 0.25
}

def analyze_image_hybrid(image_bytes: bytes) -> dict:
    """
    Main entry point for the Hybrid Multi-Stream Architecture.
    """
    # Load image
    img = Image.open(BytesIO(image_bytes))
    image_np = np.array(img)
    
    # Run streams
    res_spatial = spatial.analyze(image_np)
    res_chrom = chrominance.analyze(image_np)
    res_micro = micro_texture.analyze(image_np)
    res_freq = frequency.analyze(image_np)
    
    # Normalize heatmaps to 0-1 range just in case they aren't
    def normalize(hm):
        if hm.max() > 0:
            return hm / hm.max()
        return hm
        
    hm_spatial = normalize(res_spatial["heatmap"])
    hm_chrom = normalize(res_chrom["heatmap"])
    hm_micro = normalize(res_micro["heatmap"])
    hm_freq = normalize(res_freq["heatmap"])
    
    # Resize all to the original image dimensions (in case any stream didn't do it perfectly)
    h, w = image_np.shape[:2]
    
    hm_spatial = cv2.resize(hm_spatial, (w, h))
    hm_chrom = cv2.resize(hm_chrom, (w, h))
    hm_micro = cv2.resize(hm_micro, (w, h))
    hm_freq = cv2.resize(hm_freq, (w, h))
    
    # Blend heatmaps
    w_sp, w_cr, w_mt, w_fq = STREAM_WEIGHTS.values()
    blended_hm = (hm_spatial * w_sp) + (hm_chrom * w_cr) + (hm_micro * w_mt) + (hm_freq * w_fq)
    blended_hm = normalize(blended_hm)
    
    # Overall score
    overall_score = (res_spatial["score"] * w_sp) + (res_chrom["score"] * w_cr) + \
                    (res_micro["score"] * w_mt) + (res_freq["score"] * w_fq)
                    
    # Heuristic for predicted attack type
    scores = {
        "generative-ai": res_freq["score"],
        "splicing": max(res_spatial["score"], res_chrom["score"]),
        "copy-move": max(res_spatial["score"], res_chrom["score"]),
        "deepfake": res_micro["score"]
    }
    predicted_attack_type = max(scores, key=scores.get)
    
    if overall_score < 0.5:
        verdict = "authentic"
        predicted_attack_type = "none"
    else:
        verdict = "forged"
        
    # Helper to encode heatmap to base64 over the original image
    def render_overlay(hm, base_img):
        heatmap_colored = cv2.applyColorMap(np.uint8(255 * hm), cv2.COLORMAP_JET)
        if len(base_img.shape) == 2:
            base_img = cv2.cvtColor(base_img, cv2.COLOR_GRAY2BGR)
        elif base_img.shape[2] == 4:
            base_img = cv2.cvtColor(base_img, cv2.COLOR_RGBA2BGR)
        elif base_img.shape[2] == 3:
            base_img = cv2.cvtColor(base_img, cv2.COLOR_RGB2BGR)
            
        overlay = cv2.addWeighted(base_img, 0.5, heatmap_colored, 0.5, 0)
        overlay_rgb = cv2.cvtColor(overlay, cv2.COLOR_BGR2RGB)
        
        # Base64 encode
        _, buffer = cv2.imencode('.png', cv2.cvtColor(overlay_rgb, cv2.COLOR_RGB2BGR))
        return "data:image/png;base64," + base64.b64encode(buffer).decode('utf-8')
        
    return {
        "verdict": verdict,
        "confidence": float(overall_score),
        "predicted_attack_type": predicted_attack_type,
        "overall_heatmap_base64": render_overlay(blended_hm, image_np),
        "streams": {
            "spatial_cnn": {
                "score": float(res_spatial["score"]),
                "heatmap_base64": render_overlay(hm_spatial, image_np)
            },
            "chrominance": {
                "score": float(res_chrom["score"]),
                "heatmap_base64": render_overlay(hm_chrom, image_np)
            },
            "micro_texture": {
                "score": float(res_micro["score"]),
                "heatmap_base64": render_overlay(hm_micro, image_np)
            },
            "frequency": {
                "score": float(res_freq["score"]),
                "heatmap_base64": render_overlay(hm_freq, image_np),
                "localized": False
            }
        }
    }
