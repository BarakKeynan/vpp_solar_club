import { useState, useEffect, useCallback } from 'react';

const TOUR_KEY = 'vpp_info_tour_done';

/**
 * useInfoTour — manages the one-time onboarding tooltip tour.
 *
 * tourIds: ordered array of info IDs to tour through.
 * Returns: { activeId, isDone, next, skip }
 */
export function useInfoTour(tourIds = []) {
  const [tourIndex, setTourIndex] = useState(null); // null = not started
  const [isDone, setIsDone] = useState(true);

  useEffect(() => {
    const done = localStorage.getItem(TOUR_KEY);
    if (!done) {
      setIsDone(false);
      // Start tour after a short delay so the page has rendered
      const t = setTimeout(() => setTourIndex(0), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const next = useCallback(() => {
    setTourIndex(prev => {
      const nextIdx = (prev ?? 0) + 1;
      if (nextIdx >= tourIds.length) {
        localStorage.setItem(TOUR_KEY, '1');
        setIsDone(true);
        return null;
      }
      return nextIdx;
    });
  }, [tourIds.length]);

  const skip = useCallback(() => {
    localStorage.setItem(TOUR_KEY, '1');
    setIsDone(true);
    setTourIndex(null);
  }, []);

  const resetTour = useCallback(() => {
    localStorage.removeItem(TOUR_KEY);
    setIsDone(false);
    setTourIndex(0);
  }, []);

  const activeId = tourIndex !== null ? tourIds[tourIndex] : null;

  return { activeId, isDone, next, skip, resetTour };
}