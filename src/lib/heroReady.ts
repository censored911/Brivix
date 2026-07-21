"use client";

/**
 * Load coordination for the preloader.
 *
 * Two independent components cooperate on first paint without importing each
 * other, via resolve-once promises and a shared progress registry stashed on
 * window (same pattern as window.__lenis):
 *
 *   - GLBackground owns the WebGL scene. It reports the hero GLB's byte-download
 *     progress as it streams, and signals `markHeroReady()` at the one moment the
 *     hero figure (model index 0) has loaded, had its materials applied, compiled
 *     its shaders, and painted a real frame — genuinely ready to render with no
 *     shader-compile hitch left to hit mid-animation.
 *
 *   - Loader owns the preloader curtain and the percentage. It must not lift onto
 *     an empty scene (pop-in) nor let the counter reach 100% before the assets it
 *     represents are actually loaded. It reads the strict progress registry to
 *     render the real percentage, and lifts only when every critical
 *     initial-viewport asset is ready.
 *
 * "Strict real progress": the percentage is the literal weighted sum of discrete,
 * genuinely-observed load steps — never a timed animation. It reaches 100% only
 * when every tracked step has completed, at which instant `heroReady()` also
 * resolves. There is no cosmetic tween; the number can pause and jump exactly as
 * the underlying downloads and compiles do.
 */

/** The critical initial-viewport load steps and their share of the bar.
 *  Weights sum to 1. The hero GLB is the heavy asset and dominates; fonts and
 *  the final first-frame paint round it out. */
export interface LoadSteps {
  /** Hero GLB byte download (0..1 of its own bytes). */
  heroModel: number;
  /** Above-the-fold web fonts ready (0 or 1). */
  fonts: number;
  /** Hero loaded, shaders compiled, first real frame painted (0 or 1). */
  heroPaint: number;
}

const WEIGHTS: LoadSteps = { heroModel: 0.7, fonts: 0.2, heroPaint: 0.1 };

declare global {
  interface Window {
    __heroReady?: Promise<void>;
    __resolveHeroReady?: () => void;
    /** Live per-step progress, mutated in place by the reporters below. */
    __loadSteps?: LoadSteps;
    /** Subscribers notified on every progress mutation. */
    __loadListeners?: Set<() => void>;
  }
}

function ensure(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (!window.__heroReady) {
    let resolve!: () => void;
    window.__heroReady = new Promise<void>((r) => {
      resolve = r;
    });
    window.__resolveHeroReady = resolve;
  }
  if (!window.__loadSteps) {
    window.__loadSteps = { heroModel: 0, fonts: 0, heroPaint: 0 };
  }
  if (!window.__loadListeners) {
    window.__loadListeners = new Set();
  }
  return window.__heroReady;
}

function notify() {
  window.__loadListeners?.forEach((fn) => fn());
}

/** Await the hero being fully initialised and painted. Resolves immediately if
 *  it already happened. */
export function heroReady(): Promise<void> {
  return ensure();
}

/** Report a critical load step's progress (clamped 0..1). Idempotent-safe: a
 *  step can only advance, never regress, so out-of-order or duplicate reports
 *  never rewind the bar. */
export function reportLoad<K extends keyof LoadSteps>(step: K, value: number): void {
  if (typeof window === "undefined") return;
  ensure();
  const steps = window.__loadSteps!;
  const next = Math.max(0, Math.min(1, value));
  if (next <= steps[step]) return;
  steps[step] = next;
  notify();
}

/** Current strict progress across all critical steps, as an integer 0..100.
 *  This is the exact fraction of real load steps completed — not a timed sweep. */
export function loadPct(): number {
  if (typeof window === "undefined") return 0;
  const s = window.__loadSteps ?? { heroModel: 0, fonts: 0, heroPaint: 0 };
  const frac =
    s.heroModel * WEIGHTS.heroModel +
    s.fonts * WEIGHTS.fonts +
    s.heroPaint * WEIGHTS.heroPaint;
  return Math.round(Math.min(1, frac) * 100);
}

/** Subscribe to progress changes. Returns an unsubscribe fn. */
export function onLoadProgress(fn: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  ensure();
  window.__loadListeners!.add(fn);
  return () => window.__loadListeners?.delete(fn);
}

/** Signal that the hero is initialised and has rendered its first real frame.
 *  Completes the final `heroPaint` step (driving the bar to 100%) and resolves
 *  the readiness promise. Safe to call more than once — only the first call has
 *  any effect. */
export function markHeroReady(): void {
  if (typeof window === "undefined") return;
  ensure();
  // By the time the hero has painted, its bytes are necessarily all in. Settle
  // any step that a non-computable transfer (e.g. a dev server that omits
  // Content-Length) left short, so the bar coheres to a true 100% at reveal
  // rather than lifting on a partial number.
  reportLoad("heroModel", 1);
  reportLoad("fonts", 1);
  reportLoad("heroPaint", 1);
  window.__resolveHeroReady?.();
  // Null the resolver so a second call is a genuine no-op and the promise
  // reference stays stable for any later awaiters.
  window.__resolveHeroReady = undefined;
}
