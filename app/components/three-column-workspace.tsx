"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  MessageSquare,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Target,
  TrendingUp,
  User,
  Bot,
  Smile,
  Frown,
  Meh,
  AlertTriangle,
  Clock,
  Star,
} from "lucide-react"
import AIChat from "./ai-chat"

interface Conversation {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  unread: number
  avatar: string
  sentiment: "positive" | "negative" | "neutral"
  priority: "high" | "medium" | "low"
  status: "online" | "offline" | "away"
}

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

interface AISuggestion {
  id: string
  type: "communication" | "priority" | "productivity" | "disc"
  title: string
  content: string
  targetPerson?: string
  icon: any
}

interface ThreeColumnWorkspaceProps {
  userRole: "simple" | "leader"
  userProfile?: any
}

export default function ThreeColumnWorkspace({ userRole, userProfile }: ThreeColumnWorkspaceProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [chatMode, setChatMode] = useState<"ai" | "person">("ai")
  const [searchTerm, setSearchTerm] = useState("")
  const [tasks, setTasks] = useState<Task[]>([
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
  ])

  const [conversations] = useState<Conversation[]>([
    {
      id: "1",
      name: "Carlos Mendes",
      lastMessage: "Preciso do relatório até amanhã, por favor",
      timestamp: "14:30",
      unread: 2,
      avatar: "/placeholder.svg?height=40&width=40",
      sentiment: "negative",
      priority: "high",
      status: "online",
    },
    {
      id: "2",
      name: "Ana Silva",
      lastMessage: "Ótima apresentação hoje! 👏",
      timestamp: "13:45",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      sentiment: "positive",
      priority: "low",
      status: "online",
    },
    {
      id: "3",
      name: "João Santos",
      lastMessage: "Estou com dificuldades neste projeto...",
      timestamp: "12:20",
      unread: 1,
      avatar: "/placeholder.svg?height=40&width=40",
      sentiment: "negative",
      priority: "medium",
      status: "away",
    },
    {
      id: "4",
      name: "Maria Costa",
      lastMessage: "Vamos marcar uma reunião?",
      timestamp: "11:15",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      sentiment: "neutral",
      priority: "medium",
      status: "offline",
    },
    {
      id: "5",
      name: "Equipe Marketing",
      lastMessage: "Campanha aprovada! Vamos começar",
      timestamp: "10:30",
      unread: 3,
      avatar: "/placeholder.svg?height=40&width=40",
      sentiment: "positive",
      priority: "high",
      status: "online",
    },
  ])

  const [aiSuggestions] = useState<AISuggestion[]>([
    {
      id: "1",
      type: "communication",
      title: "Dica para Carlos",
      content: "Carlos tem perfil D (Dominante). Seja direto: 'Relatório será entregue às 16h hoje.' Evite rodeios.",
      targetPerson: "Carlos Mendes",
      icon: MessageSquare,
    },
    {
      id: "2",
      type: "priority",
      title: "Priorização Inteligente",
      content: "Baseado na urgência e seu perfil, sugiro: 1º Relatório (Carlos), 2º Proposta, 3º Planilha.",
      icon: Target,
    },
    {
      id: "3",
      type: "disc",
      title: "Perfil João Santos",
      content: "João demonstra características S (Estável). Ofereça suporte: 'Posso ajudar com o projeto?'",
      targetPerson: "João Santos",
      icon: User,
    },
    {
      id: "4",
      type: "productivity",
      title: "Técnica Pomodoro",
      content: "Para o relatório: 25min focado + 5min pausa. Sua produtividade aumenta 40% com blocos de tempo.",
      icon: TrendingUp,
    },
  ])

  const handleTaskToggle = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: task.status === "completed" ? "pending" : "completed" } : task,
      ),
    )
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Smile className="h-4 w-4 text-green-500" />
      case "negative":
        return <Frown className="h-4 w-4 text-red-500" />
      default:
        return <Meh className="h-4 w-4 text-yellow-500" />
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      default:
        return "bg-gray-400"
    }
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const selectedConv = conversations.find((c) => c.id === selectedConversation)

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Coluna Esquerda - Conversas */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold mb-3">Conversas Monitoradas</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 mb-2 ${
                  selectedConversation === conversation.id ? "bg-blue-50 border border-blue-200" : ""
                }`}
                onClick={() => {
                  setSelectedConversation(conversation.id)
                  setChatMode("person")
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={conversation.avatar || "/placeholder.svg"}
                      alt={conversation.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                        conversation.status,
                      )}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-sm truncate">{conversation.name}</h3>
                      <div className="flex items-center space-x-1">
                        {getSentimentIcon(conversation.sentiment)}
                        <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 truncate">{conversation.lastMessage}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge className={getPriorityColor(conversation.priority)} variant="outline">
                        {conversation.priority}
                      </Badge>
                      {conversation.unread > 0 && (
                        <Badge className="bg-blue-500 text-white text-xs">{conversation.unread}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={() => {
              setSelectedConversation(null)
              setChatMode("ai")
            }}
            className={`w-full ${chatMode === "ai" ? "bg-blue-600" : "bg-gray-600"}`}
          >
            <Bot className="h-4 w-4 mr-2" />
            Chat com IA
          </Button>
        </div>
      </div>

      {/* Coluna Central - Chat */}
      <div className="flex-1 flex flex-col">
        {chatMode === "ai" ? (
          <div className="h-full">
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Assistente IA</h3>
                  <p className="text-sm text-gray-600">
                    {userRole === "simple" ? "Sofia - Sua assistente pessoal" : "Helena - Assistente de liderança"}
                  </p>
                </div>
                <div className="ml-auto">
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <AIChat
                userRole={userRole}
                clientId="1"
                hasInternetAccess={userRole === "leader"}
                availableModels={
                  userRole === "simple" ? ["gpt-3.5-turbo", "gpt-4"] : ["gpt-3.5-turbo", "gpt-4", "gemini-pro"]
                }
              />
            </div>
          </div>
        ) : selectedConv ? (
          <div className="h-full flex flex-col">
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={selectedConv.avatar || "/placeholder.svg"}
                      alt={selectedConv.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                        selectedConv.status,
                      )}`}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedConv.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{selectedConv.status}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getSentimentIcon(selectedConv.sentiment)}
                    <Badge className={getPriorityColor(selectedConv.priority)} variant="outline">
                      {selectedConv.priority}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-gray-50 p-4">
              <div className="space-y-4">
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-lg max-w-xs shadow-sm">
                    <p className="text-sm">{selectedConv.lastMessage}</p>
                    <span className="text-xs text-gray-500 mt-1 block">{selectedConv.timestamp}</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                    <p className="text-sm">Entendi, vou providenciar o mais rápido possível.</p>
                    <span className="text-xs opacity-75 mt-1 block">14:32</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <Input placeholder="Digite sua mensagem..." className="flex-1" />
                <Button>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma conversa</h3>
              <p className="text-gray-600">Escolha uma conversa à esquerda ou use o chat com IA</p>
            </div>
          </div>
        )}
      </div>

      {/* Coluna Direita - Tarefas e Sugestões */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Tarefas & Sugestões</h2>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Tarefas */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm">Suas Tarefas</h3>
                <Badge variant="secondary">{tasks.filter((t) => t.status !== "completed").length} pendentes</Badge>
              </div>
              <div className="space-y-3">
                {tasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 border rounded-lg text-sm ${
                      task.status === "completed" ? "opacity-60 bg-gray-50" : "bg-white"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        checked={task.status === "completed"}
                        onCheckedChange={() => handleTaskToggle(task.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4
                            className={`font-medium text-xs ${
                              task.status === "completed" ? "line-through text-gray-500" : "text-gray-900"
                            }`}
                          >
                            {task.title}
                          </h4>
                          <Badge className={getPriorityColor(task.priority)} variant="outline">
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{task.assignedBy}</span>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(task.dueDate).toLocaleDateString("pt-BR")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Sugestões da IA */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm">Sugestões da IA</h3>
                <Badge className="bg-blue-100 text-blue-800">Ativo</Badge>
              </div>
              <div className="space-y-3">
                {aiSuggestions.slice(0, 3).map((suggestion) => (
                  <div key={suggestion.id} className="p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-start space-x-2">
                      <suggestion.icon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-xs text-blue-900 mb-1">{suggestion.title}</h4>
                        <p className="text-xs text-blue-700 mb-2">{suggestion.content}</p>
                        {suggestion.targetPerson && (
                          <div className="flex items-center space-x-1 mb-2">
                            <User className="h-3 w-3 text-blue-600" />
                            <span className="text-xs text-blue-600 font-medium">{suggestion.targetPerson}</span>
                          </div>
                        )}
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" className="text-xs h-6 px-2 bg-white border-blue-300">
                            Aplicar
                          </Button>
                          <Button size="sm" variant="ghost" className="text-xs h-6 px-2 text-blue-600">
                            Próxima
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Insights Rápidos */}
            <div>
              <h3 className="font-medium text-sm mb-3">Insights Rápidos</h3>
              <div className="space-y-2">
                <div className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="font-medium text-green-800">Produtividade +15%</span>
                  </div>
                  <p className="text-green-700 mt-1">Você está 15% mais produtivo esta semana!</p>
                </div>
                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="h-3 w-3 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Atenção</span>
                  </div>
                  <p className="text-yellow-700 mt-1">João Santos precisa de suporte no projeto</p>
                </div>
                <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-blue-600" />
                    <span className="font-medium text-blue-800">Destaque</span>
                  </div>
                  <p className="text-blue-700 mt-1">Ana Silva está com excelente engajamento</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
