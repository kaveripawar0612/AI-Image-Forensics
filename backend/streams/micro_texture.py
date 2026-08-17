import numpy as np
import cv2
from skimage.feature import local_binary_pattern

def analyze(image: np.ndarray) -> dict:
    """
    Stream 3: Micro-Texture Forensic (Local Binary Patterns).
    """
    if len(image.shape) == 3:
        if image.shape[2] == 4:
            image = cv2.cvtColor(image, cv2.COLOR_RGBA2GRAY)
        else:
            image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
            
    radius = 2
    n_points = 8 * radius
    
    # Calculate LBP
    lbp = local_binary_pattern(image, n_points, radius, method='uniform')
    
    # To find local anomalies, we calculate block-wise LBP histogram divergence
    # For speed, we will do a simplified sliding window variance
    
    h, w = lbp.shape
    window_size = 32
    
    # Pad
    pad_h = (window_size - h % window_size) % window_size
    pad_w = (window_size - w % window_size) % window_size
    lbp_padded = np.pad(lbp, ((0, pad_h), (0, pad_w)), mode='reflect')
    
    h_pad, w_pad = lbp_padded.shape
    blocks_h = h_pad // window_size
    blocks_w = w_pad // window_size
    
    heatmap_blocks = np.zeros((blocks_h, blocks_w))
    
    # Simplified anomaly: variance of LBP values
    for i in range(blocks_h):
        for j in range(blocks_w):
            block = lbp_padded[i*window_size:(i+1)*window_size, j*window_size:(j+1)*window_size]
            heatmap_blocks[i, j] = np.var(block)
            
    # Smoothing out (too smooth = deepfake boundary)
    # So we invert the variance (lower variance = higher anomaly)
    if np.max(heatmap_blocks) > 0:
        heatmap_blocks = 1.0 - (heatmap_blocks / np.max(heatmap_blocks))
        
    heatmap_upsampled = cv2.resize(heatmap_blocks, (w_pad, h_pad), interpolation=cv2.INTER_LINEAR)
    heatmap_final = heatmap_upsampled[:h, :w]
    
    # Overall score
    score = float(np.percentile(heatmap_blocks, 90)) if heatmap_blocks.size > 0 else 0.0
    
    return {
        "heatmap": heatmap_final,
        "score": score,
        "metadata": {"radius": radius, "points": n_points}
    }
