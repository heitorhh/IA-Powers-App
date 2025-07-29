export interface User {
  id: string
  name: string
  email: string
  role: "simple" | "leader" | "master"
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

export interface Task {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  status: "pending" | "in-progress" | "completed"
  dueDate: string
  assignedBy?: string
  category: string
}

export interface AIConfig {
  teacherMode: number
  improvementSuggestions: number
  profileQuestions: number
  sentimentAnalysis: boolean
  autoResponses: boolean
  learningMode: boolean
}
