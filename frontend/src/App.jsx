import React, { useState, useRef } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", image);

    try {
      // Connects directly to your active VS Code public tunnel connection on port 8080
      const response = await fetch("https://devtunnels.ms", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server status error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to FastAPI backend. Ensure uvicorn is running on port 8080.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <nav className="nav-bar">
        <span className="nav-logo">🛡️ AI Image Forensics</span>
        <div className="nav-links">
          <a href="#dashboard" className="active">Dashboard</a>
          <a href="#about">About</a>
        </div>
      </nav>

      <header className="app-header">
        <p className="subtitle-tag">AI-POWERED IMAGE ANALYSIS</p>
        <h1>Detect Image Forgery <span className="gradient-text">with AI</span></h1>
        <p className="description-text">
          Analyze images for deepfakes, copy-move forgery, splicing, and digital alterations.
        </p>
      </header>

      <main className="main-content">
        <section className="workstation-card">
          <h2>Forensic Inspection Workstation</h2>
          <p className="view-mode-label">Original Image</p>
          
          <div className="image-preview-box">
            {preview ? (
              <img src={preview} alt="Forensic Inspection View" className="preview-image" />
            ) : (
              <div className="upload-placeholder" onClick={() => fileInputRef.current.click()}>
                <p>Drag & Drop or Click to Upload Image</p>
              </div>
            )}
          </div>

          <p className="file-info-text">{image ? image.name : "No file chosen"}</p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            style={{ display: "none" }}
            accept="image/*"
          />

          <div className="action-buttons">
            <button className="btn btn-primary" onClick={analyzeImage} disabled={loading}>
              {loading ? "Analyzing Matrix..." : "Analyze Image"}
            </button>
            <button className="btn btn-secondary" onClick={() => fileInputRef.current.click()}>
              Choose Another Image
            </button>
          </div>

          {error && <div className="error-message-text">{error}</div>}
        </section>

        {result && (
          <section className="results-card">
            <div className="results-header">
              <h3>Analysis Results</h3>
              <span className={`status-badge ${result.prediction.toLowerCase()}`}>
                {result.prediction}
              </span>
            </div>

            <div className="metrics-grid">
              <div className="metric-item">
                <strong>Detected Type:</strong> <span>{result.forgery_type}</span>
              </div>
              <div className="metric-item">
                <strong>Confidence Score:</strong> <span>{result.confidence}%</span>
              </div>
              <div className="metric-item">
                <strong>Risk Level:</strong>{" "}
                <span className={`risk-tag risk-${result.risk_level.toLowerCase()}`}>
                  {result.risk_level}
                </span>
              </div>
              <div className="metric-item">
                <strong>Resolution:</strong> <span>{result.width} × {result.height} px</span>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
