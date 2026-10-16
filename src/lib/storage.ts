/** Acesso seguro ao localStorage (pode lançar em modo privado ou se bloqueado). */
export const safeStorage = {
  get(key: string): string | null {
    try {
      return globalThis.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      globalThis.localStorage?.setItem(key, value);
    } catch {
      /* preferência não persistida — sem impacto funcional */
    }
  },
};
