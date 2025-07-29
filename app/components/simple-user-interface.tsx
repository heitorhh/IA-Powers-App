"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, Target, MessageSquare, TrendingUp, User } from "lucide-react"

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Minhas Tarefas</h1>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Tarefas */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  <span>Suas Tarefas</span>
                  <Badge variant="secondary">{tasks.filter((t) => t.status !== "completed").length} pendentes</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                        task.status === "completed" ? "opacity-60 bg-gray-50" : "bg-white"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={task.status === "completed"}
                          onCheckedChange={() => handleTaskToggle(task.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3
                              className={`font-medium ${
                                task.status === "completed" ? "line-through text-gray-500" : "text-gray-900"
                              }`}
                            >
                              {task.title}
                            </h3>
                            <Badge className={getPriorityColor(task.priority)} variant="outline">
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Por: {task.assignedBy}</span>
                            <span>Prazo: {new Date(task.dueDate).toLocaleDateString("pt-BR")}</span>
                          </div>
                          <Badge variant="outline" className="text-xs mt-2">
                            {task.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Painel de Sugestões */}
          <div className="space-y-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-800">
                  {currentSuggestionData.icon && <currentSuggestionData.icon className="h-5 w-5" />}
                  <span>{currentSuggestionData.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700">{currentSuggestionData.content}</p>
                <div className="mt-4 flex space-x-2">
                  <Button size="sm" variant="outline" className="text-blue-700 border-blue-300 bg-transparent">
                    Aplicar Dica
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setCurrentSuggestion((prev) => (prev + 1) % aiSuggestions.length)}
                    className="text-blue-700"
                  >
                    Próxima
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progresso */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Seu Progresso Hoje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tarefas Concluídas</span>
                  <span className="font-medium">
                    {tasks.filter((t) => t.status === "completed").length}/{tasks.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${(tasks.filter((t) => t.status === "completed").length / tasks.length) * 100}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
