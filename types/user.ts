export interface User {
  id: string
  name: string
  email: string
  role: "simple" | "leader" | "master"
  clientId: string
  position?: string
  department?: string
  discProfile?: "D" | "I" | "S" | "C"
  secretaryName?: string
  avatar?: string
  teamSize?: number
  organizationSize?: number
  preferences?: {
    communicationStyle: string
    workingHours: string
    timezone: string
  }
  stats?: {
    tasksCompleted: number
    avgResponseTime: string
    satisfactionScore: number
    collaborations?: number
    teamPerformance?: number
    teamSatisfaction?: number
    organizationHealth?: number
    leadershipScore?: number
  }
}

export interface APIConfig {
  openai?: {
    apiKey: string
    model: string
    maxTokens: number
    temperature: number
    enabled: boolean
  }
  gemini?: {
    apiKey: string
    model: string
    maxTokens: number
    temperature: number
    enabled: boolean
  }
  internetAccess?: {
    enabled: boolean
    searchEngine: "google" | "bing"
    apiKey: string
    maxQueries: number
  }
  whatsapp?: {
    enabled: boolean
    maxConnections: number
    webhookUrl: string
  }
}

export interface TokenUsage {
  openai: {
    used: number
    limit: number
    cost: number
  }
  gemini: {
    used: number
    limit: number
    cost: number
  }
  internetQueries: {
    used: number
    limit: number
  }
  whatsappMessages: {
    sent: number
    received: number
    limit: number
  }
}

export interface Client {
  id: string
  name: string
  plan: "basic" | "standard" | "premium"
  status: "active" | "trial" | "suspended" | "expired"
  users: number
  maxUsers: number
  whatsappConnections: number
  maxWhatsappConnections: number
  apiCalls: number
  maxApiCalls: number
  createdAt: string
  expiresAt: string
  apiConfig: APIConfig
  tokenUsage: TokenUsage
  features: {
    whatsappIntegration: boolean
    sentimentAnalysis: boolean
    aiSuggestions: boolean
    customReports: boolean
    apiAccess: boolean
    internetAccess: boolean
    aiChat: boolean
  }
  consumption: {
    messages: number
    aiAnalysis: number
    reports: number
    storage: number
  }
  limits: {
    messagesPerMonth: number
    aiAnalysisPerMonth: number
    reportsPerMonth: number
    storageGB: number
    tokensPerMonth: number
  }
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  tokens?: number
  model?: string
}

export interface WhatsAppSession {
  id: string
  clientId: string
  name: string
  status: "disconnected" | "connecting" | "scan_qr" | "connected"
  qr?: string
  phone?: string
  lastActivity: string
  messagesCount: number
}

export interface SystemHealth {
  status: "healthy" | "warning" | "critical"
  uptime: number
  activeClients: number
  totalMessages: number
  aiAccuracy: number
  responseTime: number
  errors: number
}
