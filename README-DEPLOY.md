# Guia de Deploy para Vercel

## Pré-requisitos

1. **Conta no Vercel**: Crie uma conta gratuita em [vercel.com](https://vercel.com)
2. **Conta no GitHub**: O projeto precisa estar em um repositório GitHub
3. **Token do Telegram Bot**: Obrigatório para funcionalidade principal

## Passos para Deploy

### 1. Preparar o Repositório

```bash
# Inicializar git (se ainda não foi feito)
git init
git add .
git commit -m "Initial commit"

# Criar repositório no GitHub e fazer push
git remote add origin https://github.com/seu-usuario/seu-repositorio.git
git branch -M main
git push -u origin main
```

### 2. Configurar Banco de Dados

**Opção A: Vercel Postgres (Recomendado)**
- Acesse o dashboard do Vercel
- Vá em "Storage" > "Create Database" > "Postgres"
- Copie a `DATABASE_URL` gerada

**Opção B: Neon, PlanetScale ou outro provedor**
- Crie uma conta no provedor escolhido
- Crie um banco PostgreSQL
- Copie a string de conexão

### 3. Deploy no Vercel

1. **Conectar Repositório**:
   - Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
   - Clique em "New Project"
   - Importe seu repositório do GitHub

2. **Configurar Variáveis de Ambiente**:
   ```
   DATABASE_URL=postgresql://username:password@hostname:5432/database
   NEXTAUTH_URL=https://seu-app.vercel.app
   NEXTAUTH_SECRET=gere-uma-chave-secreta-forte-aqui
   TELEGRAM_BOT_TOKEN=seu-token-do-bot-telegram
   NODE_ENV=production
   ```

3. **Deploy**:
   - Clique em "Deploy"
   - Aguarde o build completar

### 4. Configurar Banco de Dados

Após o primeiro deploy:

```bash
# Executar migrações do Prisma
npx prisma migrate deploy
npx prisma generate
```

### 5. Testar a Aplicação

1. Acesse a URL fornecida pelo Vercel
2. Teste o login
3. Verifique se os dados do Telegram estão sendo carregados
4. Teste a funcionalidade de analytics

## Variáveis de Ambiente Obrigatórias

- `DATABASE_URL`: String de conexão com o banco PostgreSQL
- `NEXTAUTH_URL`: URL da aplicação (https://seu-app.vercel.app)
- `NEXTAUTH_SECRET`: Chave secreta para NextAuth (gere uma forte)
- `TELEGRAM_BOT_TOKEN`: Token do seu bot do Telegram

## Variáveis Opcionais

- `OPENAI_API_KEY`: Para funcionalidades de IA
- `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`: Para login com Google
- `META_APP_ID`, `META_APP_SECRET`: Para integração com Facebook/Instagram

## Comandos Úteis

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login no Vercel
vercel login

# Deploy manual
vercel --prod

# Ver logs
vercel logs
```

## Solução de Problemas

### Build Falha
- Verifique se todas as dependências estão no `package.json`
- Confirme se as variáveis de ambiente estão configuradas
- Veja os logs de build no dashboard do Vercel

### Erro de Banco de Dados
- Verifique se a `DATABASE_URL` está correta
- Execute as migrações do Prisma
- Confirme se o banco está acessível

### Telegram não Funciona
- Verifique se o `TELEGRAM_BOT_TOKEN` está correto
- Confirme se o bot tem as permissões necessárias
- Teste a API do Telegram manualmente

## Monitoramento

- **Logs**: Acesse via dashboard do Vercel
- **Analytics**: Vercel fornece analytics básicos
- **Uptime**: Configure alertas se necessário

## Domínio Personalizado (Opcional)

1. No dashboard do Vercel, vá em "Domains"
2. Adicione seu domínio personalizado
3. Configure os DNS conforme instruções
4. Atualize `NEXTAUTH_URL` com o novo domínio

---

**Nota**: Este projeto está configurado para usar SQLite em desenvolvimento e PostgreSQL em produção. O Vercel não suporta SQLite, então o PostgreSQL é obrigatório para produção.