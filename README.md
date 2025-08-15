# 🤖 WhatsApp AI Companion

Um sistema simples e amigável para conectar WhatsApp com inteligência artificial.

## ✨ Características

- 📱 **Interface Amigável** - Dashboard simples e intuitivo
- 🔗 **Múltiplas Conexões** - Zapier, Make.com ou API direta
- 🧠 **Análise de Sentimentos** - Detecta mensagens positivas/negativas
- 📊 **Analytics em Tempo Real** - Estatísticas e métricas
- ⚡ **Configuração Rápida** - 15 minutos para estar funcionando

## 🚀 Como Usar

### 1. Deploy Rápido
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/seu-usuario/whatsapp-ai-companion)

### 2. Configurar Variáveis
\`\`\`bash
WHATSAPP_VERIFY_TOKEN=meu_token_secreto_123
NEXT_PUBLIC_APP_URL=https://sua-app.vercel.app
\`\`\`

### 3. Escolher Método de Conexão

#### 🟠 Zapier (Recomendado - Mais Fácil)
- ✅ Não precisa Facebook
- ✅ WhatsApp pessoal ou business
- ✅ 100 mensagens grátis/mês
- ⏱️ 15 minutos para configurar

[📖 Tutorial Zapier Completo](/tutorial/zapier)

#### 🔵 Make.com (Mais Recursos)
- ⚠️ Precisa conta Facebook
- ✅ 1000 mensagens grátis/mês
- ✅ Mais automações
- ⏱️ 30 minutos para configurar

[📖 Tutorial Make.com](/tutorial/make)

#### 🟢 WhatsApp Business API (Direto)
- ⚠️ Para desenvolvedores
- ⚠️ Precisa aprovação Facebook
- ✅ Sem limites
- ⏱️ 2+ horas para configurar

## 📱 Funcionalidades

### Dashboard Principal
- 📊 Estatísticas em tempo real
- 📱 Lista de mensagens recentes
- 🎯 Análise de sentimentos
- ⚙️ Configuração simplificada

### Análise Inteligente
- 😊 **Positivas**: Agradecimentos, elogios
- 😐 **Neutras**: Perguntas, informações
- 😞 **Negativas**: Reclamações, problemas

### Webhook Automático
- 🔄 Recebe mensagens em tempo real
- 🧠 Processa com IA
- 📊 Gera estatísticas
- 🚨 Alertas para mensagens negativas

## 🛠️ Desenvolvimento Local

\`\`\`bash
# Clonar repositório
git clone https://github.com/seu-usuario/whatsapp-ai-companion
cd whatsapp-ai-companion

# Instalar dependências
npm install

# Configurar variáveis
cp .env.example .env.local

# Executar em desenvolvimento
npm run dev
\`\`\`

## 📋 Endpoints da API

- `GET /api/whatsapp/webhook` - Verificação do webhook
- `POST /api/whatsapp/webhook` - Receber mensagens
- `GET /api/whatsapp/health` - Status do sistema
- `GET /api/whatsapp/test` - Testar configuração

## 🔧 Configuração do Webhook

### URL do Webhook
\`\`\`
https://sua-app.vercel.app/api/whatsapp/webhook
\`\`\`

### Token de Verificação
\`\`\`
meu_token_secreto_123
\`\`\`

## 📞 Suporte

- 📖 [Documentação Completa](/)
- 🎥 [Tutoriais em Vídeo](/tutorial)
- 🧪 [Página de Testes](/test/automation)
- ❓ [FAQ](/help)

## 📄 Licença

MIT License - Livre para uso pessoal e comercial.

---

**Feito com ❤️ para facilitar a integração WhatsApp + IA**
