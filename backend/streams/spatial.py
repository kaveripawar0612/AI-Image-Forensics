import torch
import torchvision.models as models
import torchvision.transforms as transforms
import torch.nn as nn
import numpy as np
import cv2

# Initialize Model
weights = models.ResNet50_Weights.DEFAULT
spatial_cnn = models.resnet50(weights=weights)

# Replace final FC layer
num_ftrs = spatial_cnn.fc.in_features
spatial_cnn.fc = nn.Linear(num_ftrs, 2)  # Binary classification
spatial_cnn.eval()

transform = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

def analyze(image: np.ndarray) -> dict:
    """
    Analyzes an image using a PyTorch ResNet50 model.
    Returns:
        { "heatmap": np.ndarray, "score": float, "metadata": dict }
    """
    # RGB Conversion
    if len(image.shape) == 2:
        image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
    elif image.shape[2] == 4:
        image = cv2.cvtColor(image, cv2.COLOR_RGBA2RGB)
        
    input_tensor = transform(image).unsqueeze(0)
    
    # We will use a mock Grad-CAM (since the model is randomly initialized on the classification head)
    # We extract features from the layer4
    features = []
    def hook_fn(module, input, output):
        features.append(output)
        
    handle = spatial_cnn.layer4.register_forward_hook(hook_fn)
    
    with torch.no_grad():
        out = spatial_cnn(input_tensor)
        probs = torch.softmax(out, dim=1)
        score = probs[0][1].item() # Probability of 'forged'
        
    handle.remove()
    
    # Mock Grad-CAM: Just average the feature maps across channels
    fmap = features[0].squeeze(0).numpy()
    heatmap = np.mean(fmap, axis=0)
    heatmap = np.maximum(heatmap, 0)
    
    # Normalize 0-1
    if heatmap.max() > 0:
        heatmap = heatmap / heatmap.max()
        
    # Upsample to image size
    heatmap_resized = cv2.resize(heatmap, (image.shape[1], image.shape[0]))
    
    return {
        "heatmap": heatmap_resized,
        "score": score,
        "metadata": {"model": "ResNet50", "localization": "Grad-CAM mock"}
    }
