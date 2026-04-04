import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  CreditCard,
  Activity,
  Tag,
  Calendar,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import GlassEffect from '../components/GlassEffect';
import AnimatedBackground from '../components/AnimatedBackground';
import { getUserProfile, type UserProfile as UserProfileType } from '../api/client';
import { toast } from '../components/Toast';
import { getRiskColor } from '../utils/risk';

const mockProfile: UserProfileType = {
  user_id: 'demo_user_1',
  total_transactions: 47,
  avg_risk_score: 24.3,
  risk_level: 'LOW',
  average_transaction_amount: 5200,
  unique_locations: 3,
  unique_devices: 2,
  transactions_last_24h: 4,
  frequency_score: 40,
  last_transaction: new Date().toISOString(),
  recent_transactions: [
    { amount: 2500, risk_score: 12, result: 'SAFE', timestamp: new Date().toISOString(), reasons: ['No risk factors'] },
    { amount: 45000, risk_score: 78, result: 'FRAUD', timestamp: new Date().toISOString(), reasons: ['High amount', 'Night transaction'] },
    { amount: 800, risk_score: 8, result: 'SAFE', timestamp: new Date().toISOString(), reasons: ['No risk factors'] },
    { amount: 12000, risk_score: 45, result: 'SAFE', timestamp: new Date().toISOString(), reasons: ['New device'] },
    { amount: 350, risk_score: 5, result: 'SAFE', timestamp: new Date().toISOString(), reasons: ['No risk factors'] },
    { amount: 67000, risk_score: 92, result: 'FRAUD', timestamp: new Date().toISOString(), reasons: ['Multiple flags'] },
  ],
  behavioral_patterns: [
    'Frequent daytime transactions',
    'Usually uses mobile device',
    'Domestic transactions preferred',
    'Average transaction ₹5,200',
    'Low-risk merchant categories',
  ],
};

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<UserProfileType>(mockProfile);
  const [, setLoading] = useState(true);
  const [searchId, setSearchId] = useState(id || 'demo_user_1');

  const fetchProfile = async (userId: string) => {
    setLoading(true);
    try {
      const res = await getUserProfile(userId);
      setProfile(res.data);
    } catch {
      toast('Using demo profile — backend not available', 'warning');
      setProfile({ ...mockProfile, user_id: userId });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile(id || 'demo_user_1');
  }, [id]);

  const getRiskLevelBadge = (level: string) => {
    switch (level.toUpperCase()) {
      case 'LOW': return 'bg-success/15 text-success border-success/25';
      case 'MEDIUM': return 'bg-warning/15 text-warning border-warning/25';
      case 'HIGH': return 'bg-danger/15 text-danger border-danger/25';
      default: return 'bg-accent/15 text-accent border-accent/25';
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative', overflow: 'hidden', paddingBottom: '7rem' }}>
      {/* Use shared AnimatedBackground component */}
      <AnimatedBackground particleCount={18} orbOpacity={0.35} showGrid={true} />

      {/* Content */}
      <motion.div
        style={{ maxWidth: '85rem', margin: '0 auto', padding: '3rem 2rem 0', position: 'relative', zIndex: 1 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
      {/* Page Header */}
      <motion.div 
        style={{ marginBottom: '3rem' }}
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 1.25rem', borderRadius: '9999px', marginBottom: '1.25rem', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.35)', backdropFilter: 'blur(10px)' }}>
          <User size={15} style={{ color: '#3B82F6' }} />
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Behavior Profile</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.25rem,5vw,3.5rem)', fontWeight: 900, lineHeight: 1.1, fontFamily: 'Space Grotesk, sans-serif', marginBottom: '1rem' }}>
          <span style={{ color: '#fff' }}>User </span>
          <span style={{ background: 'linear-gradient(135deg,#3B82F6,#F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Profile
          </span>
        </h1>
        <p style={{ color: 'rgba(200,190,220,0.9)', fontSize: '1.125rem', maxWidth: '42rem' }}>
          Comprehensive behavioral analysis and transaction history tracking.
        </p>
      </motion.div>

      {/* Search bar */}
      <motion.div 
        style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', maxWidth: '42rem' }}
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Enter User ID (e.g., demo_user_1)..."
          className="glass-input"
          style={{ flex: 1 }}
          id="user-search"
        />
        <motion.button
          onClick={() => fetchProfile(searchId)}
          style={{
            padding: '0.875rem 2rem',
            borderRadius: '0.875rem',
            background: 'linear-gradient(135deg,#3B82F6,#F97316)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.9375rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(59,130,246,0.35)',
            whiteSpace: 'nowrap'
          }}
          whileHover={{ scale: 1.03, boxShadow: '0 6px 28px rgba(59,130,246,0.45)' }}
          whileTap={{ scale: 0.98 }}
        >
          Search User
        </motion.button>
      </motion.div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* ─── User Header Card ────────────────────────────── */}
        <motion.div 
          style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <GlassEffect hover={false}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1rem' }}>
              <motion.div 
                style={{ 
                  width: '5.5rem', 
                  height: '5.5rem', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(249,115,22,0.15))',
                  border: '2px solid rgba(59,130,246,0.3)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginBottom: '1.5rem',
                  boxShadow: '0 8px 24px rgba(59,130,246,0.2)'
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 12px 32px rgba(59,130,246,0.3)' }}
              >
                <User size={42} style={{ color: '#3B82F6' }} />
              </motion.div>
              
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', fontFamily: 'Space Grotesk, sans-serif', color: '#fff' }}>
                {profile.user_id}
              </h2>
              
              <span className={`inline-flex px-4 py-1.5 rounded-full text-sm font-bold border mb-6 ${getRiskLevelBadge(profile.risk_level)}`}>
                {profile.risk_level} RISK
              </span>

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.9375rem', color: '#94A3B8', fontWeight: 500 }}>
                    <CreditCard size={16} /> Transactions
                  </span>
                  <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#fff' }}>{profile.total_transactions}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.9375rem', color: '#94A3B8', fontWeight: 500 }}>
                    <Activity size={16} /> Avg Risk Score
                  </span>
                  <span style={{ fontSize: '1.125rem', fontWeight: 800, color: getRiskColor(profile.avg_risk_score) }}>
                    {profile.avg_risk_score.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </GlassEffect>

          {/* Behavioral Patterns */}
          <GlassEffect hover={false}>
            <div style={{ padding: '0.5rem' }}>
              <h3 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tag size={15} />
                Behavioral Patterns
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                {(profile.behavioral_patterns ?? []).map((pattern, i) => (
                  <motion.span
                    key={i}
                    style={{
                      padding: '0.625rem 1rem',
                      fontSize: '0.8125rem',
                      borderRadius: '9999px',
                      background: 'rgba(59,130,246,0.12)',
                      color: '#93C5FD',
                      border: '1px solid rgba(59,130,246,0.2)',
                      fontWeight: 600
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    whileHover={{ scale: 1.05, background: 'rgba(59,130,246,0.18)' }}
                  >
                    {pattern}
                  </motion.span>
                ))}
              </div>
            </div>
          </GlassEffect>
        </motion.div>

        {/* ─── Transaction History ──────────────────────────── */}
        <motion.div 
          style={{ gridColumn: 'span 2 / span 2' }}
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <GlassEffect hover={false}>
            <div style={{ padding: '0.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.625rem', fontFamily: 'Space Grotesk, sans-serif', color: '#fff' }}>
                <Calendar size={20} style={{ color: '#3B82F6' }} />
                Transaction History
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(profile.recent_transactions ?? profile.transactions ?? []).map((tx: any, i: number) => (
                  <motion.div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.25rem',
                      padding: '1.25rem',
                      borderRadius: '1rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      transition: 'all 0.3s ease'
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    whileHover={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      borderColor: 'rgba(59,130,246,0.2)',
                      x: 4
                    }}
                  >
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      background: tx.result === 'FRAUD' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                      border: `1px solid ${tx.result === 'FRAUD' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`
                    }}>
                      {tx.result === 'FRAUD' ? (
                        <ShieldAlert size={20} style={{ color: '#EF4444' }} />
                      ) : (
                        <ShieldCheck size={20} style={{ color: '#10B981' }} />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#fff' }}>
                          ₹{tx.amount.toLocaleString()}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          border: '1px solid',
                          fontWeight: 700,
                          background: tx.result === 'FRAUD' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                          color: tx.result === 'FRAUD' ? '#EF4444' : '#10B981',
                          borderColor: tx.result === 'FRAUD' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'
                        }}>
                          {tx.result}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: '#94A3B8', lineHeight: 1.5 }}>
                        {tx.reasons.join(' · ')}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '2.25rem', fontWeight: 900, color: getRiskColor(tx.risk_score), fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1 }}>
                        {tx.risk_score}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem', fontWeight: 600 }}>
                        risk
                      </div>
                    </div>
                  </motion.div>
                ))}

                {(profile.recent_transactions ?? profile.transactions ?? []).length === 0 && (
                  <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94A3B8' }}>
                    <User size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <p style={{ fontSize: '1rem', fontWeight: 600 }}>No transactions found for this user.</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.7 }}>Try searching for a different user ID.</p>
                  </div>
                )}
              </div>
            </div>
          </GlassEffect>
        </motion.div>
      </div>
      </motion.div>
    </div>
  );
}
