/**
 * A passagem entre o site e a Área do cliente — o mesmo desenho da entrada do GiraHub:
 *
 * - **chegada** (site → /entrar): a navegação entre documentos usa a View Transitions API
 *   (`@view-transition { navigation: auto }` em globals.css): a marca "Leonardo Pontes" voa do
 *   cabeçalho do site para o da página de login, e a cortina anil recua até o painel da marca,
 *   com o formulário surgindo depois (entrar.css, `.passagem-*`);
 * - **saída** (/entrar → site, ou → app depois de entrar): a cortina avança sobre a tela e só então
 *   a página troca.
 *
 * Com `prefers-reduced-motion` (ou o modo suave do site) nada anima: a troca é direta.
 */

/** Quanto dura a cortina cobrindo a tela antes da troca — o mesmo tempo do CSS. */
export const DURACAO_DA_SAIDA_MS = 650;

export function movimentoReduzido(): boolean {
  if (typeof window === 'undefined') return true;
  const html = document.documentElement;
  if (html.classList.contains('reduced-motion')) return true;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/** A troca de página em si; um objeto para os testes poderem observá-la. */
export const navegador = {
  ir: (href: string) => window.location.assign(href),
};

/** Fecha a cortina e só então navega. */
export function sairPara(href: string, trocar: (href: string) => void = (h) => navegador.ir(h)): Promise<void> {
  if (movimentoReduzido()) {
    trocar(href);
    return Promise.resolve();
  }
  document.documentElement.dataset.passagem = 'saindo';
  return new Promise((resolve) => {
    // Uma folga depois da animação: a troca só começa com a tela toda coberta.
    setTimeout(() => {
      trocar(href);
      resolve();
    }, DURACAO_DA_SAIDA_MS + 80);
  });
}
