import numpy as np
import cv2

def analyze(image: np.ndarray) -> dict:
    """
    Stream 4: Geometric Upsampling (FFT).
    Detects periodic peaks in the frequency domain. Global only.
    """
    if len(image.shape) == 3:
        if image.shape[2] == 4:
            image = cv2.cvtColor(image, cv2.COLOR_RGBA2GRAY)
        else:
            image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
            
    # Apply FFT
    f = np.fft.fft2(image)
    fshift = np.fft.fftshift(f)
    magnitude_spectrum = 20 * np.log(np.abs(fshift) + 1e-8)
    
    # Basic analysis: count high energy peaks outside the DC center
    h, w = magnitude_spectrum.shape
    center_y, center_x = h // 2, w // 2
    
    # Mask out the DC component and low frequencies
    mask = np.ones((h, w), dtype=np.uint8)
    cv2.circle(mask, (center_x, center_y), 20, 0, -1)
    
    filtered_spectrum = magnitude_spectrum * mask
    
    # Score based on max high-frequency peak relative to average
    avg_hf = np.mean(filtered_spectrum)
    max_hf = np.max(filtered_spectrum)
    
    # Normalize score somewhat arbitrarily for the mock
    score = float(np.clip((max_hf - avg_hf) / 100.0, 0, 1))
    
    # Global heatmap
    heatmap = np.ones((h, w), dtype=np.float32) * score
    
    return {
        "heatmap": heatmap,
        "score": score,
        "metadata": {"localized": False, "max_freq_peak": float(max_hf)}
    }
