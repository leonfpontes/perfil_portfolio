/**
 * DevTools detection utility
 * Heuristic based on window size delta and repeated polling.
 * Progressive enhancement: no-ops if not supported.
 */

export type DevtoolsChangeHandler = (isOpen: boolean) => void;

const POLL_INTERVAL = 500; // ms
const THRESHOLD = 160; // px difference between outer and inner sizes

function computeIsOpen(): boolean {
  // Heuristic: when DevTools is docked, outer vs inner dimensions differ a lot
  const widthDiff = Math.abs(window.outerWidth - window.innerWidth);
  const heightDiff = Math.abs(window.outerHeight - window.innerHeight);
  return widthDiff > THRESHOLD || heightDiff > THRESHOLD;
}

export function isOpen(): boolean {
  try {
    return computeIsOpen();
  } catch {
    return false;
  }
}

export function onChange(callback: DevtoolsChangeHandler): () => void {
  let last = isOpen();
  let stopped = false;

  const tick = () => {
    if (stopped) return;
    const current = isOpen();
    if (current !== last) {
      last = current;
      try {
        callback(current);
      } catch {}
    }
    timer = window.setTimeout(tick, POLL_INTERVAL);
  };

  let timer = window.setTimeout(tick, POLL_INTERVAL);

  // Return unsubscribe
  return () => {
    stopped = true;
    window.clearTimeout(timer);
  };
}
