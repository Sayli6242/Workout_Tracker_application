import { useState, useEffect, useRef } from 'react';

export function useWorkoutTimer(startedAt) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef           = useRef(null);

  useEffect(() => {
    if (!startedAt) return;
    const tick = () => {
      const start = new Date(startedAt).getTime();
      setElapsed(Math.floor((Date.now() - start) / 1000));
    };
    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => clearInterval(intervalRef.current);
  }, [startedAt]);

  const fmt = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  return { elapsed, formatted: fmt(elapsed) };
}
