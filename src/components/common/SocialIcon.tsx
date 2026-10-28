import { cn } from '@/lib/utils';

/**
 * Marcas das redes em traço único (currentColor), no mesmo peso visual do site.
 * Ficam de fora do lucide-react porque a biblioteca não mantém logos de marcas.
 */
const PATHS = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M3.5 20.5l1.3-4.2A8.6 8.6 0 1 1 8 19.4z" />
      <path d="M9.1 8.3c.2-.4.5-.4.8-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c-.1.2-.1.4 0 .6.6 1 1.5 1.9 2.6 2.5.2.1.4.1.6-.1l.6-.6c.2-.2.4-.2.6-.1l1.6.8c.2.1.3.3.3.5v.4c0 .4-.2.8-.5 1-.6.4-1.5.6-2.6.2-2.2-.8-4.2-2.7-5.1-4.9-.4-1.1-.2-2.1.2-2.6z" fill="currentColor" stroke="none" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.5 10.5v6M7.5 7.5v.01M11 16.5v-6M11 13c0-1.5 1-2.5 2.3-2.5s2.2.9 2.2 2.5v3.5" />
    </>
  ),
  github: (
    <path d="M9 19c-4 1.3-4-2-6-2.5m12 4.5v-3.4a3 3 0 0 0-.8-2.3c2.7-.3 5.5-1.3 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.5 2.6 5.5 2.9 5.5 2.9a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.1 9.3c0 4.7 2.8 5.7 5.5 6a3 3 0 0 0-.8 2.3V21" />
  ),
} as const;

export type SocialNetwork = keyof typeof PATHS;

export function SocialIcon({ name, className }: { name: SocialNetwork; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('size-5 shrink-0', className)}
    >
      {PATHS[name]}
    </svg>
  );
}
