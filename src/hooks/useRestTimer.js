import { useState, useEffect, useRef, useCallback } from 'react';

export function useRestTimer() {
  const [seconds, setSeconds]     = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [total, setTotal]         = useState(0);
  const intervalRef               = useRef(null);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setSeconds(0);
    setTotal(0);
  }, []);

  const start = useCallback((duration) => {
    clearInterval(intervalRef.current);
    setTotal(duration);
    setSeconds(duration);
    setIsRunning(true);
  }, []);

  const skip = useCallback(() => stop(), [stop]);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const progress = total > 0 ? ((total - seconds) / total) : 0;

  return { seconds, isRunning, progress, start, stop, skip };
}
