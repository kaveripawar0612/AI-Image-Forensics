import React from 'react';
import { motion } from 'framer-motion';
import { Printer, ArrowRight, Layers, Fingerprint, Zap, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  const handlePrint = () => {
    window.print();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px', minHeight: '80vh' }} className="printable-area">
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
          <div>
            <motion.div variants={itemVariants} style={{ fontSize: 'clamp(28px, 5vw, 42px)', color: '#fff', margin: '0 0 15px 0', fontWeight: '800', background: 'linear-gradient(135deg, #fff 0%, #9ca3af 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Implementation Process & Architecture
            </motion.div>
            <motion.div variants={itemVariants} style={{ color: '#9ca3af', fontSize: '18px', lineHeight: '1.6', maxWidth: '800px', margin: 0 }}>
              <strong style={{ color: '#00d2ff' }}>Image Forensic AI</strong> implements a state-of-the-art Hybrid Deep Learning Heatmap Blending Matrix. To simultaneously detect Copy-Move, Splicing, Deepfakes, and Generative AI, we upgrade traditional backends to a true multi-stream network architecture.
            </motion.div>
          </div>
          
          <motion.button 
            variants={itemVariants}
            onClick={handlePrint}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: 'rgba(0, 210, 255, 0.1)', color: '#00d2ff', border: '1px solid rgba(0, 210, 255, 0.3)', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s' }}
            className="no-print"
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#00d2ff'; e.currentTarget.style.color = '#000'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 210, 255, 0.1)'; e.currentTarget.style.color = '#00d2ff'; }}
          >
            <Printer size={18} /> Export PDF
          </motion.button>
        </div>

        {/* Streams Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '40px' }}>
          
          {/* Stream 1 */}
          <motion.div variants={itemVariants} style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(0, 210, 255, 0.2)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 30px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', backgroundColor: 'rgba(0, 210, 255, 0.1)', borderRadius: '12px' }}>
                <Layers size={24} color="#00d2ff" />
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: '20px', margin: 0, fontWeight: 'bold' }}>Spatial Deep Learning</div>
                <div style={{ color: '#00d2ff', margin: '5px 0 0 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>PyTorch ResNet50 Classifier</div>
              </div>
            </div>
            <div style={{ color: '#d1d5db', lineHeight: '1.6', margin: 0, fontSize: '15px' }}>
              Extracts high-level semantic anomalies and organic blending boundaries. A network pretrained on ImageNet is fine-tuned on CASIA2. It learns inconsistencies such as unnatural edges, lighting mismatches, and blending boundaries that a human eye might miss.
            </div>
          </motion.div>

          {/* Stream 2 */}
          <motion.div variants={itemVariants} style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 30px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px' }}>
                <Zap size={24} color="#8b5cf6" />
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: '20px', margin: 0, fontWeight: 'bold' }}>Chrominance Discrepancy</div>
                <div style={{ color: '#8b5cf6', margin: '5px 0 0 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>YCbCr Channel Math</div>
              </div>
            </div>
            <div style={{ color: '#d1d5db', lineHeight: '1.6', margin: 0, fontSize: '15px' }}>
              Pinpoints local compression anomalies left behind when pasting elements from one JPEG into another (Splicing/Copy-Move). By converting to YCbCr and evaluating 8x8 block Discrete Cosine Transform (DCT) high-frequency energy, we isolate pasted patches that carry their own distinct compression "fingerprint".
            </div>
          </motion.div>

          {/* Stream 3 */}
          <motion.div variants={itemVariants} style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 30px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                <Fingerprint size={24} color="#10b981" />
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: '20px', margin: 0, fontWeight: 'bold' }}>Micro-Texture Forensic</div>
                <div style={{ color: '#10b981', margin: '5px 0 0 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Local Binary Patterns (LBP)</div>
              </div>
            </div>
            <div style={{ color: '#d1d5db', lineHeight: '1.6', margin: 0, fontSize: '15px' }}>
              Catches pixel-level face blending, boundary smoothing, and feathering artifacts typical in Deepfakes. LBP describes fine-grained pixel texture (skin pores, noise). When a deepfake blends a face, the natural micro-texture is smoothed out. This stream catches patches that are "suspiciously smooth".
            </div>
          </motion.div>

          {/* Stream 4 */}
          <motion.div variants={itemVariants} style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.2)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 30px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px' }}>
                <ShieldAlert size={24} color="#f59e0b" />
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: '20px', margin: 0, fontWeight: 'bold' }}>Geometric Upsampling</div>
                <div style={{ color: '#f59e0b', margin: '5px 0 0 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Fast Fourier Transform (FFT)</div>
              </div>
            </div>
            <div style={{ color: '#d1d5db', lineHeight: '1.6', margin: 0, fontSize: '15px' }}>
              Exposes the periodic grid spikes left behind by generative upsampling layers (GANs/Stable Diffusion). Because these models synthesize images through repeated transposed convolutions, they leave characteristic grid-like artifacts in the frequency domain that are invisible to the naked eye but glow brightly in a Fourier spectrum.
            </div>
          </motion.div>

        </div>

        {/* Fusion Section & CTA */}
        <motion.div variants={itemVariants} style={{ backgroundColor: 'rgba(0, 210, 255, 0.05)', padding: '40px', borderRadius: '20px', border: '1px solid rgba(0, 210, 255, 0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ color: '#fff', fontSize: '26px', margin: '0 0 15px 0', fontWeight: '800' }}>Final Matrix Fusion</div>
          <div style={{ color: '#d1d5db', lineHeight: '1.6', margin: '0 0 30px 0', fontSize: '16px', maxWidth: '800px' }}>
            The backend takes all 4 data streams, normalizes their mathematical outputs to a 0–1 scale, and blends them via a carefully calibrated weighted sum. The output is a unified multi-layered Base64 forensic heatmap matrix and a highly accurate result card, ensuring that even if one stream fails to detect a novel manipulation, the other three streams will catch it.
          </div>
          
          <Link to="/dashboard" className="no-print" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '10px', 
            backgroundColor: '#00d2ff', 
            color: '#000', 
            padding: '16px 32px', 
            borderRadius: '50px', 
            fontWeight: 'bold', 
            fontSize: '16px', 
            textDecoration: 'none',
            boxShadow: '0 10px 25px rgba(0, 210, 255, 0.3)',
            transition: 'transform 0.2s'
          }}>
            Go to Workstation Dashboard <ArrowRight size={20} />
          </Link>
        </motion.div>

      </motion.div>

      {/* CSS for printing cleanly */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: #fff !important; color: #000 !important; }
          .no-print { display: none !important; }
          nav, footer { display: none !important; }
          .printable-area * { color: #000 !important; border-color: #ccc !important; box-shadow: none !important; }
          .printable-area { padding: 0 !important; }
          h1, h3, h4 { color: #000 !important; }
          div { background: none !important; backdrop-filter: none !important; }
        }
      `}} />
    </div>
  );
}
