# Meta Fácil - Sistema de Gerenciamento de Conteúdo para Redes Sociais

<!-- Deploy trigger: 2025-01-27 -->

## 📋 Descrição

Meta Fácil é um sistema completo de gerenciamento de conteúdo para redes sociais, com foco especial em publicações no Telegram. O sistema permite criar, agendar, publicar e analisar o desempenho de conteúdos em múltiplas plataformas.

## 🚀 Funcionalidades

### ✨ Principais Recursos

- **Criação de Conteúdo**: Interface intuitiva para criação de posts
- **Agendamento**: Publique conteúdo em datas e horários específicos
- **Múltiplas Plataformas**: Suporte para Instagram, Facebook e Telegram
- **Upload de Mídia**: Envio de imagens, vídeos e documentos
- **Hashtags Inteligentes**: Geração automática de hashtags relevantes
- **Analytics Avançado**: Métricas detalhadas de desempenho
- **Histórico de Métricas**: Acompanhamento da evolução das métricas ao longo do tempo
- **Alertas Inteligentes**: Notificações sobre o desempenho do conteúdo
- **Integração com IA**: Geração de conteúdo e otimização com inteligência artificial

### 📊 Analytics e Métricas

O sistema oferece métricas detalhadas para acompanhar o desempenho dos conteúdos publicados:

- **Impressões**: Número de visualizações do conteúdo
- **Alcance**: Número de usuários únicos que viram o conteúdo
- **Curtidas**: Número de curtidas recebidas
- **Comentários**: Número de comentários recebidos
- **Compartilhamentos**: Número de vezes que o conteúdo foi compartilhado
- **Taxa de Engajamento**: Percentual de engajamento em relação ao alcance
- **Histórico de Métricas**: Acompanhamento da evolução das métricas ao longo do tempo
- **Alertas Inteligentes**: Notificações automáticas sobre quedas ou picos no desempenho

### 🤖 Integração com Telegram

- **Publicação Automática**: Envio automático de conteúdos para canais do Telegram
- **Upload Direto**: Envio direto de arquivos para o Telegram
- **Coleta de Métricas**: Obtenção de métricas reais de desempenho
- **Histórico de Métricas**: Armazenamento e visualização da evolução das métricas
- **Alertas Personalizados**: Configuração de alertas para métricas específicas

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Banco de Dados**: SQLite (desenvolvimento), PostgreSQL (produção)
- **Autenticação**: NextAuth.js
- **Integrações**: Telegram Bot API
- **Analytics**: Recharts para visualização de dados
- **IA**: Integração com modelos de linguagem para geração de conteúdo

## 📁 Estrutura do Projeto

```
src/
├── app/                 # Páginas e layouts (Next.js App Router)
├── components/          # Componentes reutilizáveis
├── hooks/              # Hooks personalizados
├── lib/                # Funções utilitárias e configurações
├── types/              # Definições de tipos TypeScript
├── utils/              # Funções auxiliares
├── styles/             # Estilos globais
└── middleware.ts       # Middleware de autenticação
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 16+
- npm ou yarn
- Banco de dados (SQLite para desenvolvimento)

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd meta-facil
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Execute as migrações do banco de dados:
```bash
npm run db:push
# ou
npm run db:migrate
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

6. Acesse http://localhost:3000

### Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa a verificação de linting
- `npm run db:push` - Sincroniza o schema do Prisma com o banco
- `npm run db:migrate` - Cria e aplica migrações do Prisma
- `npm run db:generate` - Gera o cliente Prisma
- `npm run db:studio` - Abre o Prisma Studio
- `npm run db:migrate:analytics` - Aplica migrações específicas para analytics

## 📈 Funcionalidades de Analytics

### Coleta de Métricas

O sistema coleta métricas de desempenho de conteúdos publicados no Telegram através da API do Telegram Bot. As métricas incluem:

- Impressões
- Alcance
- Curtidas
- Comentários
- Compartilhamentos
- Taxa de engajamento

### Histórico de Métricas

Todas as métricas coletadas são armazenadas em um histórico que permite:

- Visualizar a evolução das métricas ao longo do tempo
- Comparar o desempenho de diferentes conteúdos
- Identificar tendências e padrões de engajamento
- Tomar decisões baseadas em dados históricos

### Alertas Inteligentes

O sistema gera alertas automáticos quando:

- Há um crescimento significativo nas métricas
- Ocorre uma queda acentuada no engajamento
- As métricas atingem valores pré-configurados
- Há padrões incomuns no desempenho do conteúdo

## 🔧 Desenvolvimento

### Estrutura de Componentes

Os componentes estão organizados por funcionalidade:

```
components/
├── ai/                 # Componentes relacionados à IA
├── analytics/          # Componentes de análise e métricas
├── calendar/           # Componentes do calendário
├── content/            # Componentes de gerenciamento de conteúdo
├── dashboard/          # Componentes do dashboard
├── integrations/       # Componentes de integrações
├── layout/             # Componentes de layout
└── providers/          # Providers do Next.js
```

### APIs Disponíveis

- `/api/content` - Gerenciamento de conteúdo
- `/api/analytics/telegram` - Coleta de métricas do Telegram
- `/api/analytics/telegram/history` - Histórico de métricas do Telegram
- `/api/cron/collect-telegram-analytics` - Job cron para coleta automática
- `/api/integrations/telegram` - Integração com Telegram

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Contato

Marcelo - marcelo@example.com

Link do Projeto: [https://github.com/seu-usuario/meta-facil](https://github.com/seu-usuario/meta-facil)