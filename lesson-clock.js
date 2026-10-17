/* Niezależny zegar lekcji: czas rzeczywisty, nie liczba wywołań interwału. */
(() => {
  'use strict';
  const LIMIT = 45 * 60;
  const KEY = 'emocje-lesson-clock-v1';
  function create({ now = () => Date.now(), storage } = {}) {
    if (storage === undefined) {
      try { storage = window.sessionStorage; } catch { storage = null; }
    }
    let starts = { 1: null, 2: null };
    try {
      const saved = JSON.parse(storage?.getItem(KEY) || 'null');
      for (const lesson of [1, 2]) {
        const value = saved?.[lesson];
        if (Number.isFinite(value) && value >= 0 && value <= now()) starts[lesson] = value;
      }
    } catch { /* Bez pamięci przeglądarki zegar nadal działa w bieżącej sesji. */ }
    const save = () => { try { storage?.setItem(KEY, JSON.stringify(starts)); } catch {} };
    return {
      start(lesson) {
        if (![1, 2].includes(lesson) || starts[lesson] !== null) return false;
        starts[lesson] = now();
        save();
        return true;
      },
      elapsed(lesson) {
        return starts[lesson] === null ? null : Math.min(LIMIT, Math.max(0, Math.floor((now() - starts[lesson]) / 1000)));
      },
      reset() { starts = { 1: null, 2: null }; save(); }
    };
  }
  function timing(seconds, startMinute, endMinute) {
    if (seconds === null) return 'idle';
    if (seconds < Math.round(startMinute * 60)) return 'ahead';
    if (seconds >= Math.round(endMinute * 60) && !(endMinute === 45 && seconds === LIMIT)) return 'late';
    return 'on-time';
  }
  window.WorkshopLessonClock = { create, timing, LIMIT };
})();
