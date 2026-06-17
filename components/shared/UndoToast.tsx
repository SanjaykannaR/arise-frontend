"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UndoToastProps {
  visible: boolean;
  message: string;
  onUndo: () => void;
  onTimeout: () => void;
  duration?: number;
}

export default function UndoToast({
  visible,
  message,
  onUndo,
  onTimeout,
  duration = 5000,
}: UndoToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onTimeout, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, onTimeout]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[70]
            flex items-center gap-3
            bg-slate-900/95 border border-white/10 backdrop-blur-xl
            rounded-2xl px-5 py-3.5 shadow-2xl"
        >
          <span className="text-sm text-white whitespace-nowrap">{message}</span>
          <button
            onClick={onUndo}
            className="text-sm font-bold text-primary hover:text-primary-light shrink-0"
          >
            Undo
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
