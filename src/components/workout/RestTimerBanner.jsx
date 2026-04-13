import React from 'react';
import { Timer, X } from 'lucide-react';

export default function RestTimerBanner({ seconds, total, isRunning, onSkip }) {
  if (!isRunning) return null;

  const progress  = total > 0 ? ((total - seconds) / total) * 100 : 0;
  const isAlmostDone = seconds <= 10;

  return (
    <div className={`fixed bottom-20 lg:bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm
      rounded-2xl border shadow-2xl shadow-black/40 backdrop-blur-sm
      ${isAlmostDone
        ? 'bg-green-950/90 border-green-500/40'
        : 'bg-[#1a1a2e]/90 border-purple-500/30'}`}>

      {/* Progress bar */}
      <div className="h-1 rounded-t-2xl bg-white/10 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear rounded-t-2xl
            ${isAlmostDone ? 'bg-green-400' : 'bg-purple-500'}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-3 px-4 py-3">
        <div className={`p-2 rounded-xl ${isAlmostDone ? 'bg-green-500/20' : 'bg-purple-500/20'}`}>
          <Timer className={`w-4 h-4 ${isAlmostDone ? 'text-green-400' : 'text-purple-400'}`} />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-400 leading-none mb-0.5">Rest Timer</p>
          <p className={`text-2xl font-bold tabular-nums leading-none
            ${isAlmostDone ? 'text-green-400' : 'text-white'}`}>
            {String(Math.floor(seconds / 60)).padStart(2,'0')}:{String(seconds % 60).padStart(2,'0')}
          </p>
        </div>
        <button
          onClick={onSkip}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20
            text-gray-300 hover:text-white text-xs font-medium transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Skip
        </button>
      </div>
    </div>
  );
}
