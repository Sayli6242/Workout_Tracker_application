import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function SetRow({ set, setIndex, onUpdate, onDelete, previousWeight }) {
  const [weight, setWeight] = useState(String(set.weight_kg || previousWeight || ''));
  const [reps,   setReps]   = useState(String(set.reps || ''));

  const handleComplete = () => {
    const w = parseFloat(weight) || 0;
    const r = parseInt(reps)    || 0;
    onUpdate(set.id, { weight_kg: w, reps: r, is_completed: !set.is_completed });
  };

  const handleWeightBlur = () => {
    const w = parseFloat(weight) || 0;
    if (w !== set.weight_kg) onUpdate(set.id, { weight_kg: w });
  };

  const handleRepsBlur = () => {
    const r = parseInt(reps) || 0;
    if (r !== set.reps) onUpdate(set.id, { reps: r });
  };

  return (
    <div className={`flex items-center gap-3 px-2 py-2 rounded-xl transition-colors
      ${set.is_completed ? 'bg-green-500/10' : 'hover:bg-white/5'}`}>

      {/* Set number */}
      <span className={`w-6 text-center text-sm font-bold tabular-nums
        ${set.is_completed ? 'text-green-400' : 'text-gray-500'}`}>
        {setIndex + 1}
      </span>

      {/* Weight input */}
      <div className="flex-1 relative">
        <input
          type="number"
          inputMode="decimal"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          onBlur={handleWeightBlur}
          placeholder={previousWeight ? String(previousWeight) : '0'}
          className={`w-full bg-white/5 border rounded-xl px-3 py-2 text-sm text-center font-medium
            focus:outline-none focus:ring-1 focus:ring-purple-500 tabular-nums
            ${set.is_completed
              ? 'border-green-500/30 text-green-300'
              : 'border-white/10 text-white placeholder-gray-600'}`}
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 pointer-events-none">kg</span>
      </div>

      {/* Reps input */}
      <div className="flex-1">
        <input
          type="number"
          inputMode="numeric"
          value={reps}
          onChange={e => setReps(e.target.value)}
          onBlur={handleRepsBlur}
          placeholder="0"
          className={`w-full bg-white/5 border rounded-xl px-3 py-2 text-sm text-center font-medium
            focus:outline-none focus:ring-1 focus:ring-purple-500 tabular-nums
            ${set.is_completed
              ? 'border-green-500/30 text-green-300'
              : 'border-white/10 text-white placeholder-gray-600'}`}
        />
      </div>

      {/* Complete button */}
      <button
        onClick={handleComplete}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0
          ${set.is_completed
            ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
            : 'bg-white/5 border border-white/10 text-gray-500 hover:border-purple-500/50 hover:text-purple-400'}`}
      >
        <Check className="w-4 h-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}
