-- Criar tabela de webhooks
CREATE TABLE IF NOT EXISTS webhooks (
    id VARCHAR(255) PRIMARY KEY,
    client_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    platform VARCHAR(50) NOT NULL DEFAULT 'zapier',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    user_role VARCHAR(20) NOT NULL DEFAULT 'simple',
    message_count INTEGER NOT NULL DEFAULT 0,
    last_received TIMESTAMP,
    ai_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_webhooks_client_id ON webhooks(client_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_status ON webhooks(status);
CREATE INDEX IF NOT EXISTS idx_webhooks_platform ON webhooks(platform);

-- Criar tabela de mensagens do WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id VARCHAR(255) PRIMARY KEY,
    client_id VARCHAR(255) NOT NULL,
    webhook_id VARCHAR(255),
    from_number VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    platform VARCHAR(50) NOT NULL DEFAULT 'zapier',
    sentiment VARCHAR(20) NOT NULL DEFAULT 'neutral',
    processed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_messages_client_id ON whatsapp_messages(client_id);
CREATE INDEX IF NOT EXISTS idx_messages_webhook_id ON whatsapp_messages(webhook_id);
CREATE INDEX IF NOT EXISTS idx_messages_sentiment ON whatsapp_messages(sentiment);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON whatsapp_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_from_number ON whatsapp_messages(from_number);

-- Criar tabela de sugestões de IA
CREATE TABLE IF NOT EXISTS ai_suggestions (
    id VARCHAR(255) PRIMARY KEY,
    client_id VARCHAR(255) NOT NULL,
    message_id VARCHAR(255),
    from_number VARCHAR(50) NOT NULL,
    original_message TEXT NOT NULL,
    sentiment VARCHAR(20) NOT NULL,
    suggestion TEXT NOT NULL,
    confidence DECIMAL(3,2) NOT NULL DEFAULT 0.5,
    used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Criar índices para sugestões de IA
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_client_id ON ai_suggestions(client_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_message_id ON ai_suggestions(message_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_sentiment ON ai_suggestions(sentiment);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_confidence ON ai_suggestions(confidence);

-- Criar tabela de estatísticas
CREATE TABLE IF NOT EXISTS webhook_stats (
    id SERIAL PRIMARY KEY,
    client_id VARCHAR(255) NOT NULL,
    webhook_id VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    message_count INTEGER NOT NULL DEFAULT 0,
    positive_count INTEGER NOT NULL DEFAULT 0,
    negative_count INTEGER NOT NULL DEFAULT 0,
    neutral_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(client_id, webhook_id, date)
);

-- Criar índices para estatísticas
CREATE INDEX IF NOT EXISTS idx_webhook_stats_client_id ON webhook_stats(client_id);
CREATE INDEX IF NOT EXISTS idx_webhook_stats_date ON webhook_stats(date);
CREATE INDEX IF NOT EXISTS idx_webhook_stats_webhook_id ON webhook_stats(webhook_id);

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON webhooks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON whatsapp_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stats_updated_at BEFORE UPDATE ON webhook_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados de exemplo (opcional)
INSERT INTO webhooks (id, client_id, name, url, platform, status, user_role, message_count, ai_enabled) 
VALUES 
    ('demo_webhook_123', 'demo_client', 'Zapier Demo Webhook', 'https://hooks.zapier.com/hooks/catch/demo', 'zapier', 'active', 'simple', 0, true)
ON CONFLICT (id) DO NOTHING;
