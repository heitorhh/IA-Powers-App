export interface User {
  id: string
  name: string
  email: string
  role: "simple" | "leader" | "master"
  clientId: string // Empresa/Cliente
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
  features: {
    whatsappIntegration: boolean
    sentimentAnalysis: boolean
    aiSuggestions: boolean
    customReports: boolean
    apiAccess: boolean
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
  }
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
