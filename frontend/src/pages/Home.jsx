import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Fingerprint, ScanEye, Zap, ShieldAlert } from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const features = [
    { icon: <ScanEye size={32} color="#00d2ff" />, title: "Spatial CNN", desc: "Detects structural anomalies using ResNet50." },
    { icon: <Zap size={32} color="#8b5cf6" />, title: "Chrominance DCT", desc: "Spots compression mismatches in YCbCr space." },
    { icon: <Fingerprint size={32} color="#10b981" />, title: "Micro-Texture", desc: "Analyzes LBP signatures to find deepfake blending." },
    { icon: <ShieldAlert size={32} color="#f59e0b" />, title: "Frequency FFT", desc: "Identifies GAN/Diffusion periodic upsampling grids." }
  ];

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={containerVariants}
        style={{ textAlign: 'center', marginBottom: '80px' }}
      >
        <motion.p variants={itemVariants} style={{ color: '#00d2ff', fontWeight: 'bold', letterSpacing: '2px', fontSize: '13px', textTransform: 'uppercase', marginBottom: '15px' }}>
          Next-Generation Image Forensics
        </motion.p>
        <motion.h1 variants={itemVariants} style={{ fontSize: 'clamp(36px, 6vw, 64px)', lineHeight: '1.1', fontWeight: '800', margin: '0 0 20px 0', background: 'linear-gradient(to right, #fff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Uncover the truth behind<br/>every pixel.
        </motion.h1>
        <motion.p variants={itemVariants} style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#9ca3af', maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
          Our Hybrid Multi-Stream Architecture fuses deep learning, signal processing, and spectral analysis to detect copy-move, splicing, and generative AI manipulations with unparalleled accuracy.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Link to="/dashboard" style={{ 
            display: 'inline-block',
            background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)', 
            color: '#fff', 
            padding: '16px 36px', 
            borderRadius: '50px', 
            fontWeight: 'bold', 
            fontSize: '16px', 
            textDecoration: 'none',
            boxShadow: '0 10px 25px rgba(0, 210, 255, 0.3)',
            transition: 'transform 0.2s'
          }}>
            Launch Workstation
          </Link>
        </motion.div>
      </motion.div>

      <motion.div 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true }} 
        variants={containerVariants}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}
      >
        {features.map((feature, idx) => (
          <motion.div key={idx} variants={itemVariants} style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.03)', 
            border: '1px solid rgba(255, 255, 255, 0.05)', 
            borderRadius: '16px', 
            padding: '30px',
            backdropFilter: 'blur(10px)',
            transition: 'transform 0.3s, border-color 0.3s',
            cursor: 'default'
          }}
          whileHover={{ y: -5, borderColor: 'rgba(0, 210, 255, 0.3)' }}
          >
            <div style={{ marginBottom: '20px' }}>{feature.icon}</div>
            <h3 style={{ fontSize: '20px', margin: '0 0 10px 0', color: '#fff' }}>{feature.title}</h3>
            <p style={{ color: '#9ca3af', fontSize: '15px', lineHeight: '1.5', margin: 0 }}>{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
