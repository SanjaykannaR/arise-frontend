"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Calendar, Edit3, Save, CheckCircle2, AlertCircle } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import SearchOverlay from "@/components/dashboard/SearchOverlay";
import { useJournalEntries, useSaveJournalEntry } from "@/lib/queries/hooks";
import { getTodayString, formatDateDisplay } from "@/lib/utils/dateHelpers";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

export default function JournalPage() {
  const todayStr = getTodayString();
  const { data: entries, isLoading } = useJournalEntries();
  const saveEntryMutation = useSaveJournalEntry(todayStr);

  // Today's entry editing state
  const [content, setContent] = useState("");
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Sync today's entry content on load
  useEffect(() => {
    if (entries) {
      const todayEntry = entries.find((e) => e.date === todayStr);
      if (todayEntry) {
        setContent(todayEntry.content);
      }
    }
  }, [entries, todayStr]);

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  const handleSave = () => {
    if (!content.trim()) return;

    saveEntryMutation.mutate(content, {
      onSuccess: () => {
        setShowSaveToast(true);
        setTimeout(() => setShowSaveToast(false), 2000);
      },
      onError: () => {
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 3000);
      },
    });
  };

  // Sort past entries (excluding today)
  const pastEntries = entries
    ? [...entries]
        .filter((e) => e.date !== todayStr)
        .sort((a, b) => b.date.localeCompare(a.date))
    : [];

  return (
    <div className="flex flex-col flex-1 pb-24 relative">
      {/* Page Header */}
      <PageHeader title="Fitness Journal" subtitle="Track your mental & physical recovery" onSearch={() => setSearchOpen(true)} />

      {/* Search Overlay (top of page) */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className="px-5 space-y-6">
        {/* Today's Reflection Editor Card */}
        <div className="glass-panel rounded-3xl p-5 space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-primary">
              <Edit3 className="w-4 h-4" />
              Today&apos;s Reflections
            </span>
            <span>{formatDateDisplay(todayStr)}</span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="How was today's training? How is your energy, recovery, or mental state? Write reflections to solidify habits..."
            className="w-full h-36 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 resize-none leading-relaxed"
          />

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleSave}
            disabled={saveEntryMutation.isPending || !content.trim()}
            className="w-full py-3.5 bg-primary hover:bg-primary-light text-slate-950 font-bold rounded-2xl text-sm transition-all duration-300 neon-glow flex items-center justify-center gap-2"
          >
            {saveEntryMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Commit to Journal
              </>
            )}
          </motion.button>
        </div>

        {/* Timeline of Past Entries */}
        <div className="space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
            Past Reflections Timeline
          </span>

          {pastEntries.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No Past Entries"
              description="Your journal log timeline is currently empty. Make today's entry to begin your fitness diary!"
            />
          ) : (
            <div className="space-y-3">
              {pastEntries.map((entry) => (
                <Link key={entry.id} href={`/journal/${entry.date}`} className="block w-full">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="glass-panel-interactive rounded-2xl p-4 flex flex-col gap-2.5 text-left"
                  >
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {formatDateDisplay(entry.date)}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-600">
                        Read entry
                      </span>
                    </div>
                    
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {entry.content}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
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
            Journal Entry Committed!
          </motion.div>
        )}
        {showErrorToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg z-50 flex items-center gap-1.5"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Failed to save. Check your connection and try again.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
