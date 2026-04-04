// ─── SHARED RISK UTILITIES ──────────────────────────────────────────────────
// Extracted from Predict.tsx and UserProfile.tsx to avoid duplication

export const getRiskColor = (score: number): string => {
  if (score < 30) return '#10B981';
  if (score < 70) return '#F59E0B';
  return '#EF4444';
};

export const getRiskLabel = (score: number): string => {
  if (score < 30) return 'SAFE';
  if (score < 70) return 'SUSPICIOUS';
  return 'FRAUD';
};

export const getRiskBadge = (score: number): string => {
  if (score < 30) return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25';
  if (score < 70) return 'bg-amber-500/15 text-amber-400 border-amber-500/25';
  return 'bg-red-500/15 text-red-400 border-red-500/25';
};
