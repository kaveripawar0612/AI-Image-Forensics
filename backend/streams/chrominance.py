import numpy as np
import cv2
from scipy.fftpack import dct

def analyze(image: np.ndarray) -> dict:
    """
    Stream 2: Chrominance Discrepancy (YCbCr channel math).
    Splits into 8x8 blocks on Cb/Cr and measures DCT high-frequency energy anomaly.
    """
    if len(image.shape) == 2:
        # Grayscale images don't have chrominance, return zero response
        return {
            "heatmap": np.zeros(image.shape, dtype=np.float32),
            "score": 0.0,
            "metadata": {"error": "Grayscale image"}
        }
        
    if image.shape[2] == 4:
        image = cv2.cvtColor(image, cv2.COLOR_RGBA2RGB)
        
    ycbcr = cv2.cvtColor(image, cv2.COLOR_RGB2YCrCb)
    cb = ycbcr[:, :, 2].astype(np.float32)
    cr = ycbcr[:, :, 1].astype(np.float32)
    
    h, w = cb.shape
    block_size = 8
    
    heatmap = np.zeros((h, w), dtype=np.float32)
    
    # Very simple mock block-DCT energy calculation for speed
    energies = []
    
    # Pad to block size
    pad_h = (block_size - h % block_size) % block_size
    pad_w = (block_size - w % block_size) % block_size
    
    cb_padded = np.pad(cb, ((0, pad_h), (0, pad_w)), mode='reflect')
    
    h_pad, w_pad = cb_padded.shape
    blocks_h = h_pad // block_size
    blocks_w = w_pad // block_size
    
    block_energies = np.zeros((blocks_h, blocks_w))
    
    for i in range(blocks_h):
        for j in range(blocks_w):
            block = cb_padded[i*block_size:(i+1)*block_size, j*block_size:(j+1)*block_size]
            dct_block = dct(dct(block.T, norm='ortho').T, norm='ortho')
            # High freq energy (exclude DC component)
            energy = np.sum(np.abs(dct_block)) - np.abs(dct_block[0, 0])
            block_energies[i, j] = energy
            
    # Calculate anomaly (divergence from median)
    median_energy = np.median(block_energies)
    anomaly_map = np.abs(block_energies - median_energy)
    
    if np.max(anomaly_map) > 0:
        anomaly_map = anomaly_map / np.max(anomaly_map)
        
    # Upsample
    heatmap_upsampled = cv2.resize(anomaly_map, (w_pad, h_pad), interpolation=cv2.INTER_NEAREST)
    heatmap_final = heatmap_upsampled[:h, :w]
    
    # Score is the 95th percentile anomaly
    score = float(np.percentile(anomaly_map, 95)) if anomaly_map.size > 0 else 0.0
    
    return {
        "heatmap": heatmap_final,
        "score": score,
        "metadata": {"block_size": block_size, "channel": "Cb"}
    }
