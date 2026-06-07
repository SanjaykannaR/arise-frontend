"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Save, ArrowLeft, Edit3, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useJournalEntries, useSaveJournalEntry } from "@/lib/queries/hooks";
import { formatDateDisplay } from "@/lib/utils/dateHelpers";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

export default function JournalDetailPage({ params }: { params: Promise<{ date: string }> }) {
  const router = useRouter();
  
  // Resolve async parameters in client component
  const resolvedParams = use(params);
  const dateStr = resolvedParams.date;

  const { data: entries, isLoading } = useJournalEntries();
  const saveEntryMutation = useSaveJournalEntry(dateStr);

  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  useEffect(() => {
    if (entries) {
      const entry = entries.find((e) => e.date === dateStr);
      if (entry) {
        setContent(entry.content);
      }
    }
  }, [entries, dateStr]);

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  const handleSave = () => {
    if (!content.trim()) return;

    saveEntryMutation.mutate(content, {
      onSuccess: () => {
        setIsEditing(false);
        setShowSaveToast(true);
        setTimeout(() => setShowSaveToast(false), 2000);
      },
    });
  };

  return (
    <div className="flex flex-col flex-1 pb-24 relative">
      {/* Back Header */}
      <PageHeader title="Reflection Log" showBackButton />

      <div className="px-5 space-y-6">
        <div className="glass-panel rounded-3xl p-6 space-y-4">
          {/* Card Header */}
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-3">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-500" />
              {formatDateDisplay(dateStr)}
            </span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-primary hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditing ? "View" : "Edit"}
            </button>
          </div>

          {/* Card Content / Edit Textarea */}
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-primary/50 resize-none leading-relaxed"
            />
          ) : (
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {content || "No reflection log was written for this date."}
            </p>
          )}

          {/* Save Button during edit mode */}
          {isEditing && (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSave}
              disabled={saveEntryMutation.isPending || !content.trim()}
              className="w-full py-3 bg-primary hover:bg-primary-dark text-slate-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all neon-glow"
            >
              {saveEntryMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>

      {/* Save feedback toast */}
      <AnimatePresence>
        {showSaveToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-primary text-black text-xs font-bold px-4 py-2.5 rounded-full shadow-lg z-50 flex items-center gap-1.5 filter drop-shadow-[0_0_8px_rgba(139,227,70,0.4)]"
          >
            <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
            Changes Committed!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
