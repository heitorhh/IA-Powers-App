# 🚀 IA Powers - Sistema de Monitoramento WhatsApp

Sistema completo de monitoramento WhatsApp com análise de sentimentos em tempo real usando IA.

## ✨ Funcionalidades

- 📱 **Integração WhatsApp Real** - Conexão direta via QR Code
- 🤖 **Análise de Sentimentos IA** - Processamento automático de mensagens
- 📊 **Dashboard em Tempo Real** - Monitoramento e analytics
- 👥 **Gestão de Contatos** - Organização por hierarquia
- 🔔 **Alertas Inteligentes** - Notificações automáticas
- 📈 **Relatórios Detalhados** - Insights e métricas

## 🚀 Deploy Rápido

### Opção 1: Vercel (Recomendado)

1. **Fork este repositório** ou **baixe o código**
2. **Conecte no Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe seu repositório
   - Deploy automático!

3. **Ou use a CLI:**
\`\`\`bash
npm install -g vercel
vercel --prod
\`\`\`

### Opção 2: Netlify

\`\`\`bash
# Build do projeto
npm run build

# Deploy
npm install -g netlify-cli
netlify deploy --prod --dir=.next
\`\`\`

### Opção 3: Docker

\`\`\`bash
# Build da imagem
docker build -t iapowers-mvp .

# Execute o container
docker run -p 3000:3000 iapowers-mvp
\`\`\`

## 🛠️ Desenvolvimento Local

\`\`\`bash
# Clone o repositório
git clone <seu-repo>
cd iapowers-mvp

# Instale dependências
npm install

# Execute em desenvolvimento
npm run dev

# Acesse http://localhost:3000
\`\`\`

## 📋 Variáveis de Ambiente (Opcional)

Crie um arquivo `.env.local`:

\`\`\`env
# Opcional: Para integrações futuras
OPENAI_API_KEY=sua_chave_openai
WEBHOOK_SECRET=seu_webhook_secret
DATABASE_URL=sua_database_url
NEXT_PUBLIC_APP_URL=https://seu-dominio.com
\`\`\`

## 🎯 Como Usar

### 1. Acesse o Sistema
- Abra a URL do seu deploy
- Navegue até "Configurações → WhatsApp"

### 2. Conecte o WhatsApp
- Clique em "Conectar WhatsApp"
- Escaneie o QR Code com seu WhatsApp
- Aguarde confirmação de conexão

### 3. Configure Monitoramento
- Adicione contatos para monitorar
- Configure hierarquia organizacional
- Ative alertas automáticos

### 4. Monitore em Tempo Real
- Veja mensagens chegando automaticamente
- Analise sentimentos em tempo real
- Receba alertas de situações críticas

## 🔧 Estrutura do Projeto

\`\`\`
iapowers-mvp/
├── app/
│   ├── api/
│   │   └── whatsapp/          # APIs do WhatsApp
│   ├── components/            # Componentes React
│   ├── login/                 # Página de login
│   ├── settings/              # Configurações
│   └── page.tsx               # Dashboard principal
├── components/ui/             # Componentes UI (shadcn)
├── lib/                       # Utilitários
└── public/                    # Arquivos estáticos
\`\`\`

## 🔗 Endpoints da API

### Sistema
- `GET /api/whatsapp/health` - Status do sistema
- `GET /api/whatsapp/sessions` - Listar sessões
- `POST /api/whatsapp/sessions` - Criar sessão

### Mensagens
- `GET /api/whatsapp/messages` - Listar mensagens
- `POST /api/whatsapp/messages` - Processar mensagem

### Webhooks
- `POST /api/webhook/whatsapp` - Receber webhooks

## 🛡️ Segurança

- ✅ APIs protegidas
- ✅ Dados criptografados
- ✅ Sessões seguras
- ✅ Webhooks validados

## 📊 Tecnologias

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Node.js
- **UI:** shadcn/ui, Radix UI, Lucide Icons
- **Deploy:** Vercel, Netlify, Docker

## 🆘 Suporte

- 📧 **Email:** suporte@iapowers.com
- 📚 **Documentação:** [docs.iapowers.com](https://docs.iapowers.com)
- 🐛 **Issues:** [GitHub Issues](https://github.com/seu-repo/issues)

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

**✅ SISTEMA PRONTO PARA PRODUÇÃO!**

Desenvolvido com ❤️ pela equipe IA Powers
\`\`\`

Agora vou criar um Dockerfile para deploy em containers:
