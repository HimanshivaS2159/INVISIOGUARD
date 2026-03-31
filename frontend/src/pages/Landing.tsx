import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Features from '../components/Features';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="w-full">

      {/* ── HERO — Simple CSS Fallback ─────────────────────────── */}
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #0A0A1A 0%, #1A0A2E 100%)' }}>
        
        {/* Animated gradient background */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
          <div style={{ position: 'absolute', top: '20%', left: '10%', width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)',
            filter: 'blur(80px)', animation: 'float 8s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '400px', height: '400px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
            filter: 'blur(80px)', animation: 'float 10s ease-in-out infinite reverse' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 2rem' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem,10vw,7rem)', fontWeight: 900, letterSpacing: '0.15em',
            background: 'linear-gradient(135deg,#fff 0%,#C084FC 50%,#A855F7 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginBottom: '1rem', filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.6))' }}>
            INVISIGUARD
          </h1>
          <p style={{ color: 'rgba(240,238,255,0.75)', fontSize: 'clamp(0.875rem,2vw,1.25rem)', marginBottom: '2rem' }}>
            Behavioral fraud detection powered by AI.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              System Active
            </span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <motion.button onClick={() => navigate('/predict')}
              style={{ background: 'linear-gradient(135deg,#A855F7,#6366F1)', color: '#fff', fontWeight: 700,
                fontSize: '0.9375rem', padding: '0.875rem 2rem', borderRadius: '9999px', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                boxShadow: '0 8px 32px rgba(168,85,247,0.45)' }}
              whileHover={{ scale: 1.06, boxShadow: '0 12px 48px rgba(168,85,247,0.65)' }}
              whileTap={{ scale: 0.97 }}>
              Try Live Demo <ArrowRight size={18} />
            </motion.button>
            <motion.button onClick={() => navigate('/dashboard')}
              style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: 700,
                fontSize: '0.9375rem', padding: '0.875rem 2rem', borderRadius: '9999px',
                border: '1px solid rgba(255,255,255,0.18)', cursor: 'pointer', backdropFilter: 'blur(12px)' }}
              whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.13)' }}
              whileTap={{ scale: 0.97 }}>
              View Dashboard
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <div style={{ width: '100%', background: 'rgba(8,6,24,0.9)' }}>
        <Features />
      </div>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <div style={{ width: '100%', background: 'rgba(8,6,24,0.9)', padding: '7rem 1.5rem' }}>
        <motion.div
          style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center', padding: '3.5rem',
            borderRadius: '1.5rem', background: 'rgba(15,12,40,0.92)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(168,85,247,0.2)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.07)', position: 'relative' }}
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <div style={{ position: 'absolute', inset: 0, borderRadius: '1.5rem', pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 50% 0%,rgba(168,85,247,0.14),transparent 65%)' }} />
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2.25rem)', fontWeight: 900, color: '#fff', marginBottom: '1rem', lineHeight: 1.2 }}>
            Ready to Detect Fraud{' '}
            <span style={{ background: 'linear-gradient(135deg,#A855F7,#6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Intelligently?
            </span>
          </h2>
          <p style={{ color: '#9B8EC4', fontSize: '1.0625rem', marginBottom: '2.5rem', lineHeight: 1.7, maxWidth: '36rem', margin: '0 auto 2.5rem' }}>
            Start analyzing transactions in real-time with our AI-powered behavioral engine.
            No setup required — just plug in and protect.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button onClick={() => navigate('/predict')}
              style={{ background: 'linear-gradient(135deg,#A855F7,#6366F1)', color: '#fff', fontWeight: 700,
                fontSize: '0.9375rem', padding: '0.875rem 2rem', borderRadius: '9999px', border: 'none',
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                boxShadow: '0 8px 32px rgba(168,85,247,0.4)' }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              Try Live Demo <ArrowRight size={18} />
            </motion.button>
            <motion.button onClick={() => navigate('/dashboard')}
              style={{ background: 'rgba(255,255,255,0.07)', color: '#fff', fontWeight: 700,
                fontSize: '0.9375rem', padding: '0.875rem 2rem', borderRadius: '9999px',
                border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              View Analytics
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div style={{ height: '6rem', background: 'rgba(8,6,24,0.9)' }} />
    </div>
  );
}
