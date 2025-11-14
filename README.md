# Perfil Profissional · Leonardo Fonseca Pontes

Site moderno e performático que apresenta o perfil profissional de Leonardo Fonseca Pontes, com
informações de carreira, competências, certificações e canais de contato.

## 🚀 Tech Stack

- **Build Tool**: Vite 5.4
- **Language**: TypeScript 5.6 (strict mode)
- **Testing**: Vitest 2.1 with happy-dom
- **Styling**: CSS Modules + original stylesheets
- **Charts**: Chart.js 4.4 (dynamic import)
- **Deployment**: Vercel

## 📂 Estrutura do Projeto

```
perfil_portfolio/
├── src/
│   ├── components/          # Componentes TypeScript modulares
│   │   ├── Carousel.ts      # Carrossel com navegação por teclado
│   │   ├── Chart.ts         # Gráfico radar com carregamento lazy
│   │   ├── LanguageSwitcher.ts
│   │   ├── MobileNav.ts
│   │   └── ScrollSpy.ts
│   ├── styles/
│   │   └── main.css         # Entry point dos estilos
│   ├── types/               # Definições TypeScript
│   ├── utils/               # Funções utilitárias
│   ├── i18n.ts              # Sistema de internacionalização
│   ├── i18n-data.ts         # Traduções pt-BR e EN
│   └── main.ts              # Entry point da aplicação
├── css/                     # Estilos originais
│   ├── base.css
│   ├── layout.css
│   └── components.css
├── img/                     # Assets visuais
├── dist/                    # Build de produção (gerado)
├── index.html               # HTML principal
├── vite.config.ts           # Configuração Vite
├── tsconfig.json            # Configuração TypeScript
├── vitest.config.ts         # Configuração testes
└── vercel.json              # Configuração Vercel
```

## 🛠️ Setup e Desenvolvimento

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
npm install
```

### Comandos Disponíveis

```bash
# Desenvolvimento com HMR
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Executar testes
npm test

# Testes com UI
npm run test:ui

# Cobertura de testes
npm run test:coverage
```

## ✨ Features

- ⚡ **Fast**: Vite para HMR instantâneo e builds otimizados
- 🎯 **Type-Safe**: TypeScript strict mode em toda a codebase
- 🌍 **i18n**: Suporte completo para PT-BR e EN
- ♿ **Accessible**: Componentes com suporte ARIA e navegação por teclado
- 📊 **Dynamic Charts**: Chart.js carregado apenas quando necessário
- 🎠 **Interactive Carousels**: Com prefersReducedMotion e IntersectionObserver
- 🧪 **Tested**: Setup de testes com Vitest

## 🌐 Deployment

O projeto está configurado para deploy automático na Vercel:

- **Branch principal**: `main` (deploy automático)
- **Branch de desenvolvimento**: `refactor/vite-migration`

### Build local

```bash
npm run build
npm run preview
```

O build gera um diretório `dist/` otimizado com:
- CSS minificado e tree-shaken
- JavaScript com code splitting (Chart.js em chunk separado)
- Assets com hash para cache imutável
- HTML minificado

## 📊 Migration Status

### ✅ Completo
- [x] Configuração Vite + TypeScript + Vitest
- [x] Migração sistema i18n
- [x] Componentes TypeScript (Carousel, Chart, LanguageSwitcher, MobileNav, ScrollSpy)
- [x] Build pipeline funcionando
- [x] Dev server com HMR

### 🚧 Próximos Passos
- [ ] CSS Modules (pendente refatoração)
- [ ] Testes unitários dos componentes
- [ ] Otimização de imagens
- [ ] PWA support (opcional)

## 🐛 Troubleshooting

### Build falha

Verifique se todas as dependências estão instaladas:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Dev server não inicia

Porta 3000 pode estar em uso. Altere em `vite.config.ts`:
```ts
server: { port: 3001 }
```

### Testes falhando

Limpe o cache do Vitest:
```bash
npm test -- --clearCache
```

## 📝 License

Este é um projeto pessoal de portfólio.

---

Desenvolvido com ❤️ usando Vite + TypeScript
