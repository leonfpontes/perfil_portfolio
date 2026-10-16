import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { isGentleMode, osPrefersReducedMotion, readMotionPref, setMotionPref, type MotionPref } from '@/lib/motion/motionPreference';
import { safeStorage } from '@/lib/storage';

const DISMISS_KEY = 'lp:motion-notice';

interface MotionState {
  pref: MotionPref;
  osReduce: boolean;
}

/** Lê a preferência só no cliente (depois da hidratação), para não divergir do HTML pré-renderizado. */
function useMotionState(): MotionState | null {
  const [state, setState] = useState<MotionState | null>(null);
  useEffect(() => setState({ pref: readMotionPref(), osReduce: osPrefersReducedMotion() }), []);
  return state;
}

/**
 * Aviso para quem tem "Reduzir movimento" ligado no sistema: o site está no
 * modo suave e a pessoa pode optar pelas animações completas.
 */
export function MotionNotice() {
  const { ui } = useContent();
  const state = useMotionState();
  const [dismissed, setDismissed] = useState(true);
  useEffect(() => setDismissed(safeStorage.get(DISMISS_KEY) === '1'), []);

  if (!state || dismissed || !state.osReduce || state.pref !== 'system') return null;

  return (
    <div
      role="status"
      className="fixed bottom-16 left-4 z-40 flex max-w-sm items-start gap-3 border border-foreground bg-background p-4 text-sm shadow-[6px_6px_0_var(--foreground)] sm:bottom-6"
    >
      <div>
        <p>{ui.motion.gentleNotice}</p>
        <button type="button" onClick={() => setMotionPref('full')} className="link-rule mt-2 cursor-pointer font-semibold">
          {ui.motion.enableFull}
        </button>
      </div>
      <button
        type="button"
        aria-label={ui.motion.dismiss}
        onClick={() => {
          safeStorage.set(DISMISS_KEY, '1');
          setDismissed(true);
        }}
        className="cursor-pointer p-1 text-muted-foreground hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

/** Controle permanente no rodapé: alterna entre completo, suave e "seguir o sistema". */
export function MotionToggle() {
  const { ui } = useContent();
  const state = useMotionState();
  if (!state) return null;

  const gentle = isGentleMode(state.pref, state.osReduce);
  const actions: { label: string; pref: MotionPref }[] = gentle
    ? [{ label: ui.motion.enableFull, pref: 'full' }]
    : [{ label: ui.motion.reduce, pref: 'reduced' }];
  if (state.pref !== 'system') actions.push({ label: ui.motion.followSystem, pref: 'system' });

  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <span>{ui.motion.label}:</span>
      {actions.map((a) => (
        <button key={a.pref} type="button" onClick={() => setMotionPref(a.pref)} className="cursor-pointer underline underline-offset-4 hover:text-foreground">
          {a.label}
        </button>
      ))}
    </p>
  );
}
