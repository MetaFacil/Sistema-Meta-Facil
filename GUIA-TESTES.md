# 🧪 Guia de Testes - Meta Fácil

## 🚀 Como Executar o Aplicativo

### Passo 1: Iniciar o Servidor
```bash
# Navegue até a pasta do projeto
cd "C:\Users\Marcelo\Desktop\Sistema Telegram"

# Execute em modo desenvolvimento
npm run dev
```

### Passo 2: Acessar o Aplicativo
Abra seu navegador e acesse: `http://localhost:3000`

---

## 📋 Lista de Testes Funcionais

### ✅ **1. Teste da Página Inicial**
- [ ] Dashboard carrega corretamente
- [ ] Métricas são exibidas (mesmo com dados mockados)
- [ ] Sidebar de navegação funciona
- [ ] Botões de ações rápidas respondem
- [ ] Design responsivo funciona (teste em mobile)

### ✅ **2. Teste de Navegação**
- [ ] **Dashboard** (`/`) - Página principal
- [ ] **IA Marketing** (`/ai-marketing`) - Assistente especializado
- [ ] **Marketing Manager** (`/marketing-manager`) - Gerenciador avançado
- [ ] **Criação de Conteúdo** (`/content/create`) - Formulário de criação
- [ ] **Biblioteca** (`/content/library`) - Conteúdos salvos
- [ ] **Calendário** (`/calendar`) - Agendamento visual
- [ ] **Analytics** (`/analytics`) - Relatórios e métricas
- [ ] **Campanhas** (`/campaigns`) - Meta Ads
- [ ] **Integrações** (`/integrations`) - APIs conectadas
- [ ] **Blog** (`/blog`) - Sistema de blog

### ✅ **3. Teste de Componentes Principais**

#### **Dashboard Principal**
- [ ] Header com informações do usuário
- [ ] Cards de métricas (Posts, Likes, Comentários, etc.)
- [ ] Gráficos e visualizações
- [ ] Posts recentes listados
- [ ] Ações rápidas funcionais

#### **IA Marketing**
- [ ] Chat com assistente IA funciona
- [ ] Seleção de pares de moedas
- [ ] Análise de mercado
- [ ] Sugestões de conteúdo
- [ ] Insights de performance

#### **Marketing Manager**
- [ ] Overview de campanhas
- [ ] Métricas de performance
- [ ] Calendário de conteúdo
- [ ] Regras de automação
- [ ] Insights de audiência

#### **Criação de Conteúdo**
- [ ] Formulário de criação
- [ ] Seleção de plataformas
- [ ] Preview do conteúdo
- [ ] Upload de mídia
- [ ] Agendamento de posts

### ✅ **4. Teste de Funcionalidades Avançadas**

#### **Sistema de IA**
- [ ] Geração de conteúdo (usa mock quando APIs não configuradas)
- [ ] Sugestões de hashtags
- [ ] Análise de mercado
- [ ] Otimização de copy

#### **Integrações**
- [ ] Status das conexões
- [ ] Configuração de APIs
- [ ] Sincronização de dados

#### **Analytics**
- [ ] Gráficos carregam
- [ ] Filtros por data funcionam
- [ ] Export de relatórios
- [ ] Métricas por plataforma

### ✅ **5. Teste de Interface**

#### **Design e UX**
- [ ] Layout responsivo (desktop, tablet, mobile)
- [ ] Cores e tipografia consistentes
- [ ] Animações suaves
- [ ] Loading states
- [ ] Estados de erro

#### **Navegação**
- [ ] Menu lateral funcional
- [ ] Breadcrumbs corretos
- [ ] Links internos funcionam
- [ ] Botões de volta

---

## 🔍 Testes Específicos por Módulo

### **📊 Dashboard**
1. Acesse `/`
2. Verifique se métricas aparecem
3. Teste os cartões de ações rápidas
4. Clique em "Post com IA" → deve levar para `/ai-marketing`
5. Clique em "Agendar Posts" → deve levar para `/calendar`

### **🤖 IA Marketing**
1. Acesse `/ai-marketing`
2. Teste seleção de par de moedas (EUR/USD, GBP/USD, etc.)
3. Teste chat com assistente (funcionará com respostas mock)
4. Navegue pelas abas: Chat, Análise, Sugestões, Insights
5. Teste ações rápidas

### **📈 Marketing Manager**
1. Acesse `/marketing-manager`
2. Verifique componentes de performance
3. Teste calendário de conteúdo
4. Verifique overview de campanhas

### **✍️ Criação de Conteúdo**
1. Acesse `/content/create`
2. Preencha formulário de criação
3. Selecione plataformas (Instagram, Facebook, Telegram)
4. Teste preview do conteúdo
5. Configure agendamento

### **📚 Biblioteca**
1. Acesse `/content/library`
2. Verifique listagem de conteúdos
3. Teste filtros e busca
4. Verifique analytics dos posts

### **📅 Calendário**
1. Acesse `/calendar`
2. Navegue entre meses
3. Verifique eventos agendados
4. Teste criação de novo evento

---

## 🐛 Como Reportar Problemas

### **Se encontrar erros:**
1. **Console do navegador**: Pressione F12 → Console
2. **Tire screenshot** do erro
3. **Anote os passos** que causaram o problema
4. **URL da página** onde ocorreu

### **Problemas comuns esperados:**
- **APIs de IA**: Retornarão respostas mock (normal)
- **Banco de dados**: Pode não estar configurado (normal para testes)
- **Autenticação**: Pode não funcionar completamente sem configuração

---

## 🚀 Próximos Passos

### **Para uso em produção:**
1. **Configurar banco de dados** (PostgreSQL/MySQL)
2. **Adicionar chaves de API** (OpenAI, Anthropic, Meta)
3. **Configurar autenticação** (NextAuth.js)
4. **Deploy na Vercel/outro serviço**

### **Para desenvolvimento:**
1. **Instalar dependências opcionais**:
   ```bash
   npm install openai @anthropic-ai/sdk axios clsx tailwind-merge @prisma/client
   ```
2. **Configurar .env.local** com suas chaves
3. **Configurar banco de dados**

---

## ✅ Checklist Final

- [ ] Aplicativo inicia sem erros críticos
- [ ] Todas as páginas carregam
- [ ] Navegação funciona
- [ ] Design está consistente
- [ ] Funcionalidades básicas operam
- [ ] Testes em diferentes resoluções
- [ ] Performance aceitável

**🎉 Parabéns! O Meta Fácil está funcionando corretamente!**