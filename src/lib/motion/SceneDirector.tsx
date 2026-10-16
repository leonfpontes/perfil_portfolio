import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { SectionId } from '@/content/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTheme } from '@/lib/theme/ThemeProvider';
import { createDomToneReader, SceneThemeController, type Tone } from './SceneThemeController';

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
  activate: (scene: SceneInfo) => void;
}

const SceneDirectorContext = createContext<SceneDirectorValue>({ active: null, activate: () => {} });

/**
 * Orquestra qual cena está "no palco": leva o tom dela para o header e o
 * fundo da página (via SceneThemeController) e expõe a cena ativa.
 */
export function SceneDirector({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  const controllerRef = useRef<SceneThemeController | null>(null);
  const [active, setActive] = useState<SceneInfo | null>(null);

  useEffect(() => {
    const controller = new SceneThemeController(document.documentElement, createDomToneReader());
    controllerRef.current = controller;
    return () => controller.dispose();
  }, []);

  // Claro/escuro muda os valores dos tons: reaplica o tom atual sem transição.
  useEffect(() => {
    controllerRef.current?.refresh();
  }, [theme]);

  const activate = useCallback(
    (scene: SceneInfo) => {
      // As seções já pintam o próprio fundo; aqui só header e fundo da página
      // acompanham, com uma dissolução curta.
      controllerRef.current?.apply(scene.tone, { duration: reduced ? 0.4 : 0.6 });
      setActive((prev) => (prev?.id === scene.id ? prev : scene));
    },
    [reduced],
  );

  const value = useMemo(() => ({ active, activate }), [active, activate]);
  return (
    <SceneDirectorContext.Provider value={value}>{children}</SceneDirectorContext.Provider>
  );
}

export function useSceneDirector(): SceneDirectorValue {
  return useContext(SceneDirectorContext);
}
