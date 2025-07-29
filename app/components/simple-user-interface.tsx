"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Target, MessageSquare, TrendingUp, User } from "lucide-react"
import ThreeColumnWorkspace from "./three-column-workspace"

interface Task {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  status: "pending" | "in-progress" | "completed"
  dueDate: string
  assignedBy?: string
  category: string
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Finalizar relatório mensal",
    description: "Completar análise de vendas do mês anterior",
    priority: "high",
    status: "pending",
    dueDate: "2024-01-15",
    assignedBy: "Carlos Mendes",
    category: "Relatórios",
  },
  {
    id: "2",
    title: "Revisar proposta comercial",
    description: "Analisar proposta para cliente ABC Corp",
    priority: "medium",
    status: "in-progress",
    dueDate: "2024-01-18",
    assignedBy: "Maria Santos",
    category: "Comercial",
  },
  {
    id: "3",
    title: "Atualizar planilha de controle",
    description: "Inserir dados da semana no sistema",
    priority: "low",
    status: "pending",
    dueDate: "2024-01-20",
    assignedBy: "Carlos Mendes",
    category: "Administrativo",
  },
]

export default function SimpleUserInterface() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [currentSuggestion, setCurrentSuggestion] = useState(0)

  const aiSuggestions = [
    {
      type: "priority",
      icon: Target,
      title: "Priorização Inteligente",
      content: "Baseado no seu perfil DISC 'I' (Influente), sugiro começar pelas tarefas que envolvem apresentações.",
    },
    {
      type: "communication",
      icon: MessageSquare,
      title: "Dica de Comunicação",
      content: "Ao falar com Carlos (perfil D), seja direto e objetivo. Apresente resultados primeiro.",
    },
    {
      type: "productivity",
      icon: TrendingUp,
      title: "Melhoria de Produtividade",
      content: "Você trabalha melhor em blocos de 45 minutos. Que tal usar a técnica Pomodoro?",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestion((prev) => (prev + 1) % aiSuggestions.length)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleTaskToggle = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: task.status === "completed" ? "pending" : "completed" } : task,
      ),
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const currentSuggestionData = aiSuggestions[currentSuggestion]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Workspace Pessoal</h1>
                <p className="text-xs text-gray-500">Sofia está aqui para ajudar</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800" variant="outline">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              IA Ativa
            </Badge>
          </div>
        </div>
      </header>

      <ThreeColumnWorkspace userRole="simple" />
    </div>
  )
}
