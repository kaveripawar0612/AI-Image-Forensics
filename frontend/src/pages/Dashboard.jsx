import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle2, AlertTriangle, Image as ImageIcon, BarChart3, Clock, Layers, ScanEye } from 'lucide-react';

export default function Dashboard() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeHeatmap, setActiveHeatmap] = useState("blended");

  const fileInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/analyze";

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
      setActiveHeatmap("blended");
    }
  };

  const analyzeImage = async () => {
    if (!image) return setError("Please select an image first.");
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
        headers: {
          "Bypass-Tunnel-Reminder": "true"
        }
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(`Unable to connect to backend at ${API_URL}. Ensure it is running.`);
    } finally {
      setLoading(false);
    }
  };

  const renderHeatmap = () => {
    if (!result) return null;
    let src = result.overall_heatmap_base64;
    if (activeHeatmap === "spatial") src = result.streams.spatial_cnn.heatmap_base64;
    if (activeHeatmap === "chrominance") src = result.streams.chrominance.heatmap_base64;
    if (activeHeatmap === "micro_texture") src = result.streams.micro_texture.heatmap_base64;
    if (activeHeatmap === "frequency") src = result.streams.frequency.heatmap_base64;
    
    return (
      <motion.img 
        key={activeHeatmap}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        src={src} 
        alt={`${activeHeatmap} heatmap`} 
        style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: '8px' }} 
      />
    );
  };

  const isForged = result?.verdict === "forged";

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
      <header style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "32px", margin: "0 0 10px 0", color: "#fff", fontWeight: "800" }}>Forensic Workstation</h1>
        <p style={{ color: "#9ca3af", fontSize: "16px", margin: 0 }}>Upload an image to run a deep multi-stream analysis.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
        
        <div style={{ backgroundColor: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "30px", backdropFilter: 'blur(10px)' }}>
          <div style={{ display: "flex", gap: "20px", flexDirection: window.innerWidth > 600 ? "row" : "column" }}>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#e5e7eb' }}>
                <ImageIcon size={18} /> <span style={{ fontWeight: '500' }}>Source Image</span>
              </div>
              <div 
                onClick={() => fileInputRef.current.click()}
                style={{ 
                  aspectRatio: "4/3", 
                  backgroundColor: "rgba(0,0,0,0.3)", 
                  border: "2px dashed rgba(255,255,255,0.1)", 
                  borderRadius: "12px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  overflow: "hidden", 
                  cursor: "pointer",
                  position: 'relative'
                }} 
              >
                {preview ? (
                  <img src={preview} alt="Input asset" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                ) : (
                  <div style={{ textAlign: "center", color: "#6b7280" }}>
                    <UploadCloud size={48} style={{ marginBottom: '10px', opacity: 0.5 }} />
                    <p style={{ margin: 0, fontSize: '14px' }}>Click to browse files</p>
                  </div>
                )}
              </div>
            </div>

            {result && (
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#e5e7eb' }}>
                  <Layers size={18} /> <span style={{ fontWeight: '500' }}>Activation Heatmap</span>
                </div>
                <div style={{ aspectRatio: "4/3", backgroundColor: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", overflow: "hidden" }}>
                  <AnimatePresence mode="wait">
                    {renderHeatmap()}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: "none" }} accept="image/*" />

          <div style={{ display: "flex", gap: "15px", marginTop: '25px' }}>
            <button 
              onClick={analyzeImage} 
              disabled={loading || !image} 
              style={{ flex: 1, backgroundColor: loading || !image ? "rgba(255,255,255,0.1)" : "#00d2ff", color: loading || !image ? "#9ca3af" : "#000", border: "none", padding: "14px", borderRadius: "8px", fontWeight: "bold", cursor: loading || !image ? "not-allowed" : "pointer", fontSize: "15px", transition: 'all 0.3s' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                   <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><ScanEye size={18} /></motion.div> Processing...
                </span>
              ) : "Analyze Artifact"}
            </button>
            <button 
              onClick={() => { setImage(null); setPreview(null); setResult(null); setError(null); }} 
              disabled={loading || !image}
              style={{ flex: 1, backgroundColor: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", padding: "14px", borderRadius: "8px", cursor: loading || !image ? "not-allowed" : "pointer", fontSize: "15px", transition: 'all 0.3s', opacity: (!image || loading) ? 0.3 : 1 }}
            >
              Clear Workspace
            </button>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '20px', padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', borderRadius: '4px', color: '#fca5a5', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={18} /> {error}
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "30px", backdropFilter: 'blur(10px)' }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "20px", marginBottom: "25px" }}>
                <div>
                  <h3 style={{ color: "#fff", margin: "0 0 5px 0", fontSize: "18px", fontWeight: "600", display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isForged ? <AlertTriangle color="#ef4444" size={20} /> : <CheckCircle2 color="#10b981" size={20} />}
                    Final Verdict
                  </h3>
                  <p style={{ margin: 0, color: '#9ca3af', fontSize: '13px' }}>Multi-stream consensus</p>
                </div>
                <span style={{ 
                  backgroundColor: isForged ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)", 
                  color: isForged ? "#ef4444" : "#10b981", 
                  padding: "6px 16px", 
                  borderRadius: "30px", 
                  fontWeight: "800", 
                  fontSize: "14px", 
                  textTransform: "uppercase",
                  letterSpacing: '1px',
                  border: `1px solid ${isForged ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`
                }}>
                  {result.verdict}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "20px", marginBottom: "35px" }}>
                <div style={{ padding: '15px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '10px' }}>
                  <p style={{ color: "#9ca3af", margin: "0 0 5px 0", fontSize: "12px", display: 'flex', alignItems: 'center', gap: '6px' }}><BarChart3 size={14}/> Attack Vector</p>
                  <p style={{ color: "#fff", margin: "0", fontWeight: "bold", fontSize: "16px", textTransform: "capitalize" }}>{result.predicted_attack_type}</p>
                </div>
                <div style={{ padding: '15px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '10px' }}>
                  <p style={{ color: "#9ca3af", margin: "0 0 5px 0", fontSize: "12px", display: 'flex', alignItems: 'center', gap: '6px' }}><ScanEye size={14}/> Model Confidence</p>
                  <p style={{ color: "#fff", margin: "0", fontWeight: "bold", fontSize: "16px" }}>{(result.confidence * 100).toFixed(1)}%</p>
                </div>
                <div style={{ padding: '15px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '10px' }}>
                  <p style={{ color: "#9ca3af", margin: "0 0 5px 0", fontSize: "12px", display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14}/> Processing Time</p>
                  <p style={{ color: "#fff", margin: "0", fontWeight: "bold", fontSize: "16px" }}>{result.processing_time_ms} ms</p>
                </div>
              </div>

              <h4 style={{ color: "#fff", margin: "0 0 15px 0", fontSize: "16px", fontWeight: '600' }}>Isolate Signal Streams</h4>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "15px" }}>
                {['blended', 'spatial', 'chrominance', 'micro_texture', 'frequency'].map(stream => {
                  const isActive = activeHeatmap === stream;
                  const label = stream === 'blended' ? 'Blended Fusion' : 
                                stream === 'spatial' ? `Spatial (${(result.streams.spatial_cnn.score*100).toFixed(0)}%)` :
                                stream === 'chrominance' ? `Chrominance (${(result.streams.chrominance.score*100).toFixed(0)}%)` :
                                stream === 'micro_texture' ? `Micro-Texture (${(result.streams.micro_texture.score*100).toFixed(0)}%)` :
                                `Frequency (${(result.streams.frequency.score*100).toFixed(0)}%)`;
                  return (
                    <button 
                      key={stream}
                      onClick={() => setActiveHeatmap(stream)}
                      style={{ 
                        backgroundColor: isActive ? "#00d2ff" : "rgba(255,255,255,0.05)", 
                        color: isActive ? "#000" : "#d1d5db", 
                        border: `1px solid ${isActive ? '#00d2ff' : 'rgba(255,255,255,0.1)'}`, 
                        padding: "8px 16px", 
                        borderRadius: "30px", 
                        cursor: "pointer", 
                        fontSize: "13px",
                        fontWeight: isActive ? "bold" : "500",
                        transition: 'all 0.2s'
                      }}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
