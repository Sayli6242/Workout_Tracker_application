import React from 'react';
import { Trophy, Clock, Zap, Dumbbell, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function fmtDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function WorkoutSummaryModal({ summary, onClose }) {
  const navigate = useNavigate();

  const handleDone = () => {
    onClose();
    navigate('/history');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-[#13131f] rounded-3xl border border-purple-500/30 shadow-2xl shadow-purple-900/20 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-br from-purple-600/30 to-violet-600/10 px-6 pt-8 pb-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-500 mx-auto mb-4 flex items-center justify-center shadow-lg shadow-purple-900/40">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Workout Complete!</h2>
          <p className="text-gray-400 text-sm mt-1">{summary.workout_name}</p>
        </div>

        {/* Stats */}
        <div className="p-6 grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <Clock className="w-5 h-5 text-purple-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{fmtDuration(summary.duration_seconds)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Duration</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{summary.total_volume_kg.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total Volume (kg)</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <Dumbbell className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{summary.exercise_count}</p>
            <p className="text-xs text-gray-500 mt-0.5">Exercises</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <Star className="w-5 h-5 text-green-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{summary.set_count}</p>
            <p className="text-xs text-gray-500 mt-0.5">Sets Completed</p>
          </div>
        </div>

        {/* New PRs */}
        {summary.new_prs?.length > 0 && (
          <div className="px-6 pb-4">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-semibold text-sm">New Personal Records!</span>
              </div>
              {summary.new_prs.map(pr => (
                <div key={pr} className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                  <span className="text-yellow-200 text-sm">{pr}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action */}
        <div className="px-6 pb-6">
          <button
            onClick={handleDone}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600
              text-white font-semibold text-base shadow-lg shadow-purple-900/30
              hover:from-purple-500 hover:to-violet-500 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
