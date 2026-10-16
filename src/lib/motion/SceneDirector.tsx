import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { SectionId } from '@/content/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTheme } from '@/lib/theme/ThemeProvider';
import { createDomToneReader, SceneThemeController, type ScrollDirection, type Tone } from './SceneThemeController';

export interface SceneInfo {
  /** id do elemento (âncora). */
  id: SectionId;
  /** Capítulo numerado ao qual a cena pertence (ex.: "jornada" pertence a "mentoria"). */
  chapter: SectionId;
  label: string;
  tone: Tone;
}

interface SceneDirectorValue {
  active: SceneInfo | null;
  activate: (scene: SceneInfo, direction?: number) => void;
}

const SceneDirectorContext = createContext<SceneDirectorValue>({ active: null, activate: () => {} });

/**
 * Orquestra qual cena está "no palco": aplica o tom de cor (via
 * SceneThemeController) e expõe a cena ativa para header e indicador.
 */
export function SceneDirector({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  const controllerRef = useRef<SceneThemeController | null>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<SceneInfo | null>(null);

  useEffect(() => {
    const controller = new SceneThemeController(document.documentElement, createDomToneReader(), curtainRef.current);
    controllerRef.current = controller;
    return () => controller.dispose();
  }, []);

  // Claro/escuro muda os valores dos tons: reaplica o tom atual sem transição.
  useEffect(() => {
    controllerRef.current?.refresh();
  }, [theme]);

  const activate = useCallback(
    (scene: SceneInfo, direction = 1) => {
      const dir: ScrollDirection = direction < 0 ? -1 : 1;
      // Modo suave: troca de cor por dissolução curta, sem a cortina varrendo a tela.
      controllerRef.current?.apply(scene.tone, { direction: dir, wipe: !reduced, duration: reduced ? 0.5 : 0.9 });
      setActive((prev) => (prev?.id === scene.id ? prev : scene));
    },
    [reduced],
  );

  const value = useMemo(() => ({ active, activate }), [active, activate]);
  return (
    <SceneDirectorContext.Provider value={value}>
      {/* Cortina: camada fixa atrás de todo o conteúdo (z negativo no contexto raiz). */}
      <div ref={curtainRef} aria-hidden="true" className="pointer-events-none invisible fixed inset-0 -z-10" />
      {children}
    </SceneDirectorContext.Provider>
  );
}

export function useSceneDirector(): SceneDirectorValue {
  return useContext(SceneDirectorContext);
}
