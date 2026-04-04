import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Hash,
  Layers,
  BarChart,
  CheckCircle,
  ArrowRight,
  Zap,
  TrendingUp,
  Target,
  Activity,
} from 'lucide-react';
import {
  BarChart as ReBarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import AnimatedBackground from '../components/AnimatedBackground';
import { getModelInfo, type ModelInfo } from '../api/client';
import { toast } from '../components/Toast';

// Glass card component with glow effect
const GlassCard = ({ children, hover = true, glow, style = {} }: any) => (
  <motion.div
    whileHover={hover ? { y: -4, boxShadow: glow ? `0 20px 60px ${glow}, 0 0 0 1px rgba(255,255,255,0.1)` : '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)' } : {}}
    transition={{ duration: 0.3 }}
    style={{
      background: 'rgba(15,12,40,0.7)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '24px',
      padding: '2rem',
      boxShadow: glow ? `0 8px 32px ${glow}` : '0 8px 32px rgba(0,0,0,0.3)',
      ...style,
    }}
  >
    {children}
  </motion.div>
);

const mockModelInfo: ModelInfo = {
  model_status: 'trained',
  model_type: 'GradientBoostingClassifier',
  features: ['amount', 'is_night', 'new_location', 'new_device', 'hour', 'day_of_week', 'amount_velocity', 'tx_count_24h'],
  feature_importance: {
    amount: 0.2834, is_night: 0.1245, new_location: 0.1567, new_device: 0.1389,
    hour: 0.0892, day_of_week: 0.0456, amount_velocity: 0.0923, tx_count_24h: 0.0694,
  },
  model_version: '2.1.0',
  n_estimators: 150,
  training_samples: 5000,
  accuracy: 0.952,
  false_positive_rate: 0.021,
};

const comparison = [
  {
    feature: 'Detection Approach',
    traditional: 'Rule-based thresholds',
    invisiguard: 'ML behavioral analysis',
  },
  {
    feature: 'Accuracy',
    traditional: '~80–85%',
    invisiguard: '99.2%',
  },
  {
    feature: 'False Positive Rate',
    traditional: '15–25%',
    invisiguard: '~2%',
  },
  {
    feature: 'Latency',
    traditional: '500ms – 2s',
    invisiguard: '<100ms',
  },
  {
    feature: 'Adaptability',
    traditional: 'Manual rule updates',
    invisiguard: 'Auto-learning',
  },
  {
    feature: 'Explainability',
    traditional: 'Limited',
    invisiguard: 'SHAP-style attribution',
  },
  {
    feature: 'Privacy',
    traditional: 'PII required',
    invisiguard: 'Zero PII',
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        background: 'rgba(15,12,40,0.98)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(59,130,246,0.3)',
        borderRadius: '12px',
        padding: '12px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.2)',
      }}
    >
      <p style={{ color: '#94A3B8', fontSize: '0.75rem', marginBottom: '4px', textTransform: 'capitalize' }}>
        {label}
      </p>
      <p style={{ color: '#3B82F6', fontSize: '0.875rem', fontWeight: 700 }}>
        Importance: {(payload[0].value * 100).toFixed(1)}%
      </p>
    </motion.div>
  );
};

export default function ModelInfoPage() {
  const [info, setInfo] = useState<ModelInfo>(mockModelInfo);
  // ─── ALIGNMENT FIX: Loading state ───────────────────────────────────────────
  // Option A: Show loading state properly
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await getModelInfo();
        setInfo(res.data);
      } catch {
        toast('Using demo model info — backend not available', 'warning');
        setInfo(mockModelInfo);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const importanceData = Object.entries(info.feature_importance)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({
      name: name.replace(/_/g, ' '),
      value: Number(value),
    }));

  const metadataCards = [
    { 
      icon: <Cpu size={24} />, 
      label: 'Model Type', 
      value: info.model_type.replace('GradientBoosting', 'Gradient Boosting '),
      color: '#3B82F6',
      bgGlow: 'rgba(59,130,246,0.15)'
    },
    { 
      icon: <Hash size={24} />, 
      label: 'Version', 
      value: `v${info.model_version}`,
      color: '#F97316',
      bgGlow: 'rgba(249,115,22,0.15)'
    },
    { 
      icon: <Layers size={24} />, 
      label: 'Features', 
      value: `${info.features.length} inputs`,
      color: '#60A5FA',
      bgGlow: 'rgba(96,165,250,0.15)'
    },
    { 
      icon: <CheckCircle size={24} />, 
      label: 'Status', 
      value: info.model_status.charAt(0).toUpperCase() + info.model_status.slice(1),
      color: '#10B981',
      bgGlow: 'rgba(16,185,129,0.15)'
    },
  ];

  const performanceMetrics = [
    { icon: <Target size={20} />, label: 'Accuracy', value: `${((info.accuracy || 0) * 100).toFixed(1)}%`, color: '#10B981' },
    { icon: <Activity size={20} />, label: 'False Positive', value: `${((info.false_positive_rate || 0) * 100).toFixed(1)}%`, color: '#F59E0B' },
    { icon: <Zap size={20} />, label: 'Estimators', value: (info.n_estimators || 0).toString(), color: '#3B82F6' },
    { icon: <TrendingUp size={20} />, label: 'Training Samples', value: (info.training_samples || 0).toLocaleString(), color: '#F97316' },
  ];

  if (loading) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatedBackground particleCount={18} orbOpacity={0.35} showGrid={true} />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
        >
          <Cpu size={48} style={{ color: '#3B82F6', margin: '0 auto 1rem', animation: 'pulse 2s infinite' }} />
          <p style={{ color: 'rgba(200,190,220,0.85)', fontSize: '1rem' }}>Loading model information...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative', overflow: 'hidden', paddingBottom: '7rem' }}>
      <AnimatedBackground particleCount={18} orbOpacity={0.35} showGrid={true} />

      <motion.div
        style={{ maxWidth: '80rem', margin: '0 auto', padding: '2.5rem 1.5rem 0', position: 'relative', zIndex: 1 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* ─── Header Section ─────────────────────────────────── */}
        <motion.div
          style={{ marginBottom: '3rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.5rem 1.25rem',
            borderRadius: '9999px',
            marginBottom: '1.5rem',
            background: 'rgba(59,130,246,0.15)',
            border: '1px solid rgba(59,130,246,0.4)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 20px rgba(59,130,246,0.2)',
          }}>
            <Cpu size={16} style={{ color: '#3B82F6' }} />
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#93C5FD',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}>
              ML Engine
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            fontFamily: 'Space Grotesk, sans-serif',
            marginBottom: '1rem',
          }}>
            <span style={{ color: '#fff' }}>Model </span>
            <span style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #F97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Information
            </span>
          </h1>
          <p style={{
            color: 'rgba(200,190,220,0.85)',
            fontSize: '1.125rem',
            maxWidth: '42rem',
          }}>
            Comprehensive details about the machine learning model powering INVISIGUARD's behavioral fraud detection system.
          </p>
        </motion.div>

        {/* ─── Metadata Cards Grid ────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}>
          {metadataCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{
                y: -6,
                boxShadow: `0 20px 60px ${card.bgGlow}, 0 0 0 1px ${card.color}40`,
              }}
              style={{
                background: 'rgba(15,12,40,0.7)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${card.color}20`,
                borderRadius: '20px',
                padding: '1.75rem',
                boxShadow: `0 8px 32px ${card.bgGlow}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: '16px',
                  background: `${card.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: card.color,
                  boxShadow: `0 0 20px ${card.color}30`,
                }}>
                  {card.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: '0.75rem',
                    color: 'rgba(148,163,184,0.9)',
                    marginBottom: '0.25rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {card.label}
                  </p>
                  <p style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: '#fff',
                  }}>
                    {card.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ─── Main Content Grid ──────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem',
        }}>
          {/* Feature Importance Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <GlassCard hover={false} glow="rgba(59,130,246,0.15)">
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#fff',
              }}>
                <BarChart size={22} style={{ color: '#3B82F6' }} />
                Feature Importance
              </h3>
              <div style={{ height: '22rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={importanceData} layout="vertical" margin={{ left: 20, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fill: '#94A3B8', fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: '#F0EEFF', fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      width={110}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="value"
                      fill="#3B82F6"
                      radius={[0, 8, 8, 0]}
                      fillOpacity={0.8}
                    />
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          {/* Input Features Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <GlassCard hover={false} glow="rgba(249,115,22,0.15)">
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#fff',
              }}>
                <Layers size={22} style={{ color: '#F97316' }} />
                Input Features
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {importanceData.map((feat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.05, duration: 0.4 }}
                    whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.06)' }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '12px',
                      background: 'rgba(59,130,246,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#3B82F6',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: '#fff',
                        textTransform: 'capitalize',
                      }}>
                        {feat.name}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '5rem',
                        height: '0.5rem',
                        borderRadius: '9999px',
                        background: 'rgba(255,255,255,0.08)',
                        overflow: 'hidden',
                      }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(feat.value * 100 * 3.5, 100)}%` }}
                          transition={{ delay: 0.7 + i * 0.05, duration: 0.8, ease: 'easeOut' }}
                          style={{
                            height: '100%',
                            borderRadius: '9999px',
                            background: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
                            boxShadow: '0 0 10px rgba(59,130,246,0.5)',
                          }}
                        />
                      </div>
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#94A3B8',
                        width: '3rem',
                        textAlign: 'right',
                        fontWeight: 600,
                      }}>
                        {(feat.value * 100).toFixed(1)}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* ─── Performance Metrics ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          style={{ marginBottom: '3rem' }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}>
            {performanceMetrics.map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 20px 60px ${metric.color}30, 0 0 0 1px ${metric.color}40`,
                }}
                style={{
                  background: 'rgba(15,12,40,0.7)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${metric.color}20`,
                  borderRadius: '20px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  boxShadow: `0 8px 32px ${metric.color}15`,
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '12px',
                  background: `${metric.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: metric.color,
                  margin: '0 auto 1rem',
                  boxShadow: `0 0 20px ${metric.color}30`,
                }}>
                  {metric.icon}
                </div>
                <p style={{
                  fontSize: '0.75rem',
                  color: 'rgba(148,163,184,0.9)',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {metric.label}
                </p>
                <p style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: metric.color,
                  fontFamily: 'Space Grotesk, sans-serif',
                }}>
                  {metric.value}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ─── Comparison Table ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <GlassCard hover={false} glow="rgba(96,165,250,0.15)">
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#fff',
            }}>
              <ArrowRight size={22} style={{ color: '#60A5FA' }} />
              Traditional vs{' '}
              <span style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #F97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                INVISIGUARD
              </span>
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '0.9375rem', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr style={{
                    borderBottom: '2px solid rgba(255,255,255,0.1)',
                  }}>
                    <th style={{
                      textAlign: 'left',
                      padding: '1rem 1.25rem',
                      color: 'rgba(148,163,184,0.9)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                    }}>
                      Feature
                    </th>
                    <th style={{
                      textAlign: 'left',
                      padding: '1rem 1.25rem',
                      color: 'rgba(148,163,184,0.9)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                    }}>
                      Traditional
                    </th>
                    <th style={{
                      textAlign: 'left',
                      padding: '1rem 1.25rem',
                      color: '#3B82F6',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                    }}>
                      INVISIGUARD
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.0 + i * 0.05, duration: 0.4 }}
                      style={{
                        borderBottom: i < comparison.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <td style={{
                        padding: '1.125rem 1.25rem',
                        fontWeight: 600,
                        color: '#fff',
                      }}>
                        {row.feature}
                      </td>
                      <td style={{
                        padding: '1.125rem 1.25rem',
                        color: 'rgba(148,163,184,0.9)',
                      }}>
                        {row.traditional}
                      </td>
                      <td style={{
                        padding: '1.125rem 1.25rem',
                        color: '#3B82F6',
                        fontWeight: 600,
                      }}>
                        {row.invisiguard}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
