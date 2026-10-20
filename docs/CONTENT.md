# Editando o conteúdo

Todo texto do site fica em `src/content/`. **Nenhum componente precisa ser alterado** para mudar textos, preços, produtos ou experiências.

## Onde está cada coisa

| Quero mudar… | Arquivo | Campo |
|---|---|---|
| Nome, e-mail, WhatsApp, LinkedIn, GitHub | `src/content/profile.ts` | `profile` |
| Link da agenda (Google Agenda) | `src/content/profile.ts` | `profile.bookingUrl` |
| Preços e itens da mentoria/diagnóstico | `src/content/locales/*.ts` | `offer.plans` (`price`, `priceShort`, `priceNote`, `regularPrice`); os dados estruturados leem os valores daqui |
| Páginas da mentoria e do diagnóstico (hero, escopo, etapas, entregáveis, FAQ) | `src/content/locales/*.ts` | `mentoringPage`, `diagnosticPage` |
| Título e descrição de cada página (SEO) | `src/content/locales/*.ts` | `home.meta`, `mentoringPage.meta`, `diagnosticPage.meta`, `aboutPage.meta`, `notFound.meta` |
| Cargo nos dados estruturados (Person.jobTitle) | `src/content/profile.ts` | `profile.jobTitle` |
| Mensagem pré-preenchida do WhatsApp | `src/content/locales/*.ts` | `plans[].whatsappMessage`, `contact.whatsappMessage` |
| Serviços | `src/content/locales/*.ts` | `services.items` |
| Produtos | `src/content/locales/*.ts` | `products.items` |
| Experiências | `src/content/locales/*.ts` | `experience.items` (a mais recente primeiro; `current: true` marca a atual) |
| Certificações | `src/content/locales/*.ts` | `education.certifications` (`inProgress: true` mostra "em andamento") |
| Depoimentos | `src/content/locales/*.ts` | `testimonials.items` |
| Perguntas frequentes | `src/content/locales/*.ts` | `mentoringPage.faq`, `diagnosticPage.faq` (viram `FAQPage` no JSON-LD) |
| Ordem e numeração das seções de cada página | `src/lib/router/routes.ts` + `src/pages/` | `PAGE_SECTIONS` |
| Nova página | `src/lib/router/routes.ts`, `src/pages/`, `src/App.tsx`, `src/seo/head.ts` | entra sozinha no prerender e no sitemap |

## Regras

1. **Edite os dois idiomas.** O `npm test` falha se `pt-BR.ts` e `en.ts` tiverem estruturas diferentes, como um item a mais em uma lista.
2. **Confidencialidade:** cases de clientes aparecem generalizados (ex.: "instituição financeira de médio porte"). O teste `content.test.ts` bloqueia nomes de clientes confidenciais. Para incluir novos nomes proibidos, edite a lista no teste.
3. **Imagens de banco** ficam em `public/images/` e são registradas em `stockImages` (`profile.ts`). Use sempre o componente `Figure`, que aplica o tratamento de impressão e a legenda "imagem ilustrativa". Nunca use foto de banco para representar um produto real.
4. **Preço fundador:** quando as vagas acabarem, atualize `price`, `priceNote` e `regularPrice` em cada plano, além do `hero.badge`.

## Adicionando um idioma

1. Crie `src/content/locales/es.ts` exportando `export const es: SiteContent = { locale: 'es', … }`.
2. Adicione `'es'` ao tipo `Locale` em `types.ts`.
3. Registre o idioma em `src/lib/i18n/registry.ts`.
4. Adicione o botão no seletor do `Header`.

## Agenda (Google Agenda)

1. No Google Agenda, crie uma **Agenda de horários** com uma conversa de 30 min.
2. Em **Compartilhar**, copie o link da página de agendamento (algo como `https://calendar.app.google/...`).
3. Cole o link em `profile.bookingUrl` (`src/content/profile.ts`).

Com o link definido:
- o botão "Agendar conversa" do header passa a abrir a agenda;
- cada plano ganha o link "ou agende uma conversa gratuita de 30 min";
- no contato, a agenda vira a ação principal e o WhatsApp passa a secundário.

Com `null`, nada disso aparece e o site usa só WhatsApp e e-mail.

