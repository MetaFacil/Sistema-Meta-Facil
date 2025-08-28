# Configuração do VS Code para Meta Fácil

## Extensões Recomendadas

Para uma melhor experiência de desenvolvimento, instale as seguintes extensões do VS Code:

1. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
   - Autocomplete, sintaxe highlighting e linting para Tailwind CSS
   - Remove avisos de "unknown at-rules" para `@tailwind` e `@apply`

2. **Prettier - Code formatter** (`esbenp.prettier-vscode`)
   - Formatação automática de código

3. **TypeScript Importer** (`pmneo.tsimporter`)
   - Auto import para TypeScript

4. **ES7+ React/Redux/React-Native snippets** (`dsznajder.es7-react-js-snippets`)
   - Snippets úteis para React

## Configuração Automática

O projeto já inclui:
- `.vscode/settings.json` - Configurações específicas do projeto
- `.vscode/extensions.json` - Lista de extensões recomendadas
- `postcss.config.js` - Configuração PostCSS para Tailwind

## Resolver Avisos CSS

Os avisos de "Unknown at rule @tailwind" e "@apply" são normais em projetos Tailwind CSS. Para resolvê-los:

### Opção 1: Instalar Extensão (Recomendado)
```bash
# No VS Code, instale a extensão:
# Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)
```

### Opção 2: Configuração Manual
Se os avisos persistirem, adicione ao seu `settings.json` do VS Code:

```json
{
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false,
  "css.lint.unknownAtRules": "ignore",
  "css.lint.vendorPrefix": "ignore"
}
```

## Recursos de Desenvolvimento

- **IntelliSense para Tailwind**: Autocomplete de classes CSS
- **Type checking**: TypeScript configurado com verificação rigorosa
- **Linting**: ESLint configurado para React e TypeScript
- **Formatação**: Prettier para formatação consistente

## Comandos Úteis

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Verificar tipos TypeScript
npm run type-check

# Executar linting
npm run lint
```

## Estrutura do Projeto

```
src/
├── app/                 # Next.js App Router
├── components/          # Componentes React
├── hooks/              # Custom React Hooks
├── lib/                # Utilitários e configurações
├── styles/             # Estilos globais (Tailwind CSS)
├── types/              # Definições TypeScript
└── utils/              # Funções utilitárias
```

## Troubleshooting

### Avisos CSS persistem
1. Verifique se a extensão Tailwind CSS IntelliSense está instalada
2. Reinicie o VS Code
3. Verifique se o arquivo `tailwind.config.ts` está presente

### TypeScript errors
1. Execute `npm run type-check` para verificar erros
2. Verifique se todas as dependências estão instaladas
3. Reinicie o TypeScript server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### Problemas de autocomplete
1. Verifique se está usando a extensão oficial do Tailwind
2. Confirme que o `postcss.config.js` está configurado corretamente
3. Reinicie o VS Code