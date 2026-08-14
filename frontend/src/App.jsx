import React, { useState, useRef } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
      setShowHeatmap(false);
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
      // Points to your active VS Code public tunnel connection on port 8080
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
      <header className="app-header">
        <h1>AI Image Forensics</h1>
        <p>Detect Deepfake & Traditional Image Forgery with Deep Learning</p>
      </header>

      <main className="main-content">
        <section className="workstation-card">
          <h2>Forensic Inspection Workstation</h2>
          
          {/* Dynamic Image Display Area */}
          <div className="image-preview-box">
            {preview ? (
              <img
                src={showHeatmap && result?.heatmap ? result.heatmap : preview}
                alt="Forensic View"
                className="preview-image"
              />
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
        </section>

        {error && <div className="error-message-box">{error}</div>}

        {/* Forensic Metrics Results Panel */}
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
                <span className="label">Detected Type:</span>
                <span className="value">{result.forgery_type}</span>
              </div>
              <div className="metric-item">
                <span className="label">Confidence Score:</span>
                <span className="value">{result.confidence}%</span>
              </div>
              <div className="metric-item">
                <span className="label">Risk Level:</span>
                <span className={`value risk-${result.risk_level.toLowerCase()}`}>
                  {result.risk_level}
                </span>
              </div>
              <div className="metric-item">
                <span className="label">Resolution:</span>
                <span className="value">{result.width} × {result.height} px</span>
              </div>
            </div>

            {result.heatmap && (
              <div className="heatmap-toggle-container">
                <button
                  className={`btn ${showHeatmap ? "btn-active" : "btn-heatmap"}`}
                  onClick={() => setShowHeatmap(!showHeatmap)}
                >
                  {showHeatmap ? "← View Original Image" : "🔍 View Forensic Heatmap"}
                </button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
