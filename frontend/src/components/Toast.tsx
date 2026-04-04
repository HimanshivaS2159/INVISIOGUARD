import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

// ─── BUG FIX #1 ───────────────────────────────────────────────────────────────
// nextId was declared INSIDE the component with `let nextId = 0`
// This caused it to reset to 0 on every re-render, producing duplicate IDs
// and breaking toast deduplication/removal logic.
// Fix: move it outside the component so it persists across renders.
let nextId = 0;
let addToastGlobal: ((message: string, type?: ToastType) => void) | null = null;

export function toast(message: string, type: ToastType = 'info') {
  addToastGlobal?.(message, type);
}

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} className="text-success" />,
  error:   <XCircle    size={18} className="text-danger"  />,
  warning: <AlertTriangle size={18} className="text-warning" />,
  info:    <Info       size={18} className="text-accent"  />,
};

const borderMap: Record<ToastType, string> = {
  success: 'border-l-[#10B981]',
  error:   'border-l-[#EF4444]',
  warning: 'border-l-[#F59E0B]',
  info:    'border-l-[#3B82F6]',
};

const bgGlowMap: Record<ToastType, string> = {
  success: 'rgba(16,185,129,0.08)',
  error:   'rgba(239,68,68,0.08)',
  warning: 'rgba(245,158,11,0.08)',
  info:    'rgba(59,130,246,0.08)',
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ─── BUG FIX #2 ─────────────────────────────────────────────────────────────
  // addToastGlobal was reassigned on EVERY render (`addToastGlobal = addToast`
  // outside useEffect). This caused a stale-closure race condition where rapid
  // renders could briefly point addToastGlobal at a stale addToast closure.
  // Fix: register/unregister inside useEffect so it only runs on mount/unmount.
  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++nextId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    addToastGlobal = addToast;
    return () => { addToastGlobal = null; };
  }, [addToast]);

  const dismiss = (id: number) =>
    setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <div className="fixed bottom-24 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(t => (
          <motion.div
            key={t.id}
            layout
            className={`
              pointer-events-auto
              flex items-start gap-3 px-4 py-3.5
              backdrop-blur-xl rounded-xl
              border border-[rgba(255,255,255,0.10)]
              border-l-4 ${borderMap[t.type]}
              shadow-[0_8px_32px_rgba(0,0,0,0.45)]
            `}
            style={{ background: `rgba(18,16,58,0.94)` }}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0,  scale: 1   }}
            exit={{   opacity: 0, x: 80,  scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            {/* Icon with subtle background */}
            <div
              className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: bgGlowMap[t.type] }}
            >
              {iconMap[t.type]}
            </div>

            {/* Message */}
            <span className="flex-1 text-sm text-[#F0EEFF] leading-5 pt-0.5">
              {t.message}
            </span>

            {/* Dismiss button */}
            <button
              onClick={() => dismiss(t.id)}
              className="mt-0.5 text-[#94A3B8] hover:text-[#F0EEFF] transition-colors shrink-0"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}