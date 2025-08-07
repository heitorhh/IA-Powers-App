"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MessageSquare, Send, Search, Users, CheckCircle, Clock, AlertTriangle, TrendingUp, Brain, Smartphone, QrCode, RefreshCw, CheckCircle2, AlertCircle, WifiOff, Wifi, User, Bot, ArrowRight, Target, Lightbulb, Calendar, BarChart3 } from 'lucide-react'
import NotificationCenter from './notification-center'

interface User {
  id: string
  name: string
  role: "simple" | "leader" | "master"
  clientId: string
}

interface Person {
  id: string
  name: string
  avatar: string
  status: "online" | "offline" | "away"
  lastMessage: string
  timestamp: string
  sentiment: "positive" | "negative" | "neutral"
  priority: "high" | "medium" | "low"
  unreadCount: number
}

interface Task {
  id: string
  title: string
  assignedBy?: string
  assignedTo?: string
  status: "pending" | "in_progress" | "completed"
  priority: "high" | "medium" | "low"
  dueDate: string
  needsFollowUp?: boolean
}

interface Message {
  id: string
  content: string
  sender: "user" | "ai" | string
  timestamp: string
  type: "text"
}

interface WhatsAppSession {
  id: string
  name: string
  status: "INITIALIZING" | "SCAN_QR_CODE" | "WORKING" | "EXPIRED" | "DISCONNECTED"
  qr?: string
  expiresAt?: string
  me?: {
    id: string
    pushName: string
    name: string
    phone: string
  }
}

interface ThreeColumnWorkspaceProps {
  user: User
}

export default function ThreeColumnWorkspace({ user }: ThreeColumnWorkspaceProps) {
  // Add safety check for user
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [chatMode, setChatMode] = useState<"ai" | "person">("ai")
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [whatsappSession, setWhatsappSession] = useState<WhatsAppSession | null>(null)
  const [isConnectingWhatsApp, setIsConnectingWhatsApp] = useState(false)
  const [whatsappError, setWhatsappError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)

  // Mock data
  const [people] = useState<Person[]>([
    {
      id: "1",
      name: "Carlos Mendes",
      avatar: "/placeholder.svg?height=40&width=40&text=CM",
      status: "online",
      lastMessage: "Preciso urgente do relatório financeiro...",
      timestamp: "2 min",
      sentiment: "negative",
      priority: "high",
      unreadCount: 3,
    },
    {
      id: "2",
      name: "Ana Silva",
      avatar: "/placeholder.svg?height=40&width=40&text=AS",
      status: "online",
      lastMessage: "Ótima apresentação hoje! Parabéns 👏",
      timestamp: "15 min",
      sentiment: "positive",
      priority: "medium",
      unreadCount: 0,
    },
    {
      id: "3",
      name: "João Santos",
      avatar: "/placeholder.svg?height=40&width=40&text=JS",
      status: "away",
      lastMessage: "Estou muito estressado com essas demandas...",
      timestamp: "1h",
      sentiment: "negative",
      priority: "high",
      unreadCount: 1,
    },
    {
      id: "4",
      name: "Maria Costa",
      avatar: "/placeholder.svg?height=40&width=40&text=MC",
      status: "offline",
      lastMessage: "Vou entregar o projeto amanhã cedo",
      timestamp: "3h",
      sentiment: "neutral",
      priority: "medium",
      unreadCount: 0,
    },
  ])

  const [tasks] = useState<Task[]>([
    {
      id: "1",
      title: "Revisar relatório mensal",
      assignedBy: user.role === "simple" ? "Ana Silva" : undefined,
      assignedTo: user.role !== "simple" ? "Carlos Mendes" : undefined,
      status: "pending",
      priority: "high",
      dueDate: "Hoje",
      needsFollowUp: user.role !== "simple",
    },
    {
      id: "2",
      title: "Preparar apresentação Q4",
      assignedBy: user.role === "simple" ? "João Santos" : undefined,
      assignedTo: user.role !== "simple" ? "Maria Costa" : undefined,
      status: "in_progress",
      priority: "medium",
      dueDate: "Amanhã",
    },
    {
      id: "3",
      title: "Análise de performance da equipe",
      assignedBy: user.role === "simple" ? "Diretor" : undefined,
      assignedTo: user.role !== "simple" ? "João Santos" : undefined,
      status: "completed",
      priority: "low",
      dueDate: "Ontem",
    },
  ])

  // WhatsApp Timer
  useEffect(() => {
    if (whatsappSession && whatsappSession.status === "SCAN_QR_CODE" && whatsappSession.expiresAt) {
      const updateTimer = () => {
        const now = new Date().getTime()
        const expires = new Date(whatsappSession.expiresAt!).getTime()
        const remaining = Math.max(0, expires - now)
        setTimeLeft(Math.floor(remaining / 1000))

        if (remaining <= 0) {
          setWhatsappSession({ ...whatsappSession, status: "EXPIRED" })
        }
      }

      updateTimer()
      const interval = setInterval(updateTimer, 1000)
      return () => clearInterval(interval)
    }
  }, [whatsappSession])

  // WhatsApp Status Polling
  useEffect(() => {
    if (whatsappSession && (whatsappSession.status === "SCAN_QR_CODE" || whatsappSession.status === "INITIALIZING")) {
      const interval = setInterval(() => {
        checkWhatsAppStatus()
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [whatsappSession])

  const checkWhatsAppStatus = async () => {
    if (!whatsappSession) return

    try {
      const response = await fetch(`/api/whatsapp/sessions/${whatsappSession.name}`)
      const data = await response.json()

      if (data.success) {
        setWhatsappSession(data.session)
        if (data.session.status === "WORKING") {
          setWhatsappError(null)
        }
      }
    } catch (error) {
      console.error("Erro ao verificar status:", error)
    }
  }

  const connectWhatsApp = async () => {
    if (!user) return
    
    setIsConnectingWhatsApp(true)
    setWhatsappError(null)

    try {
      const response = await fetch("/api/whatsapp/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `whatsapp_${user.role}_${Date.now()}`,
          clientId: user.clientId || `client_${user.id}`,
          userRole: user.role,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setWhatsappSession(data.session)
        setWhatsappError(null)
      } else {
        setWhatsappError(data.error || "Erro ao gerar QR Code")
      }
    } catch (error) {
      setWhatsappError("Erro de conexão com o servidor")
      console.error("Erro:", error)
    } finally {
      setIsConnectingWhatsApp(false)
    }
  }

  const disconnectWhatsApp = async () => {
    if (!whatsappSession) return

    try {
      const response = await fetch(`/api/whatsapp/sessions/${whatsappSession.name}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setWhatsappSession(null)
        setWhatsappError(null)
      }
    } catch (error) {
      console.error("Erro ao desconectar:", error)
    }
  }

  const refreshQRCode = () => {
    if (whatsappSession) {
      setWhatsappSession(null)
    }
    connectWhatsApp()
  }

  const getAIName = () => {
    if (!user) return "Assistente"
    switch (user.role) {
      case "simple":
        return "Sofia"
      case "leader":
        return "Helena"
      case "master":
        return "Alexandra"
      default:
        return "Assistente"
    }
  }

  const getAIPersonality = () => {
    if (!user) return "Assistente inteligente"
    switch (user.role) {
      case "simple":
        return "Sua assistente pessoal focada em produtividade"
      case "leader":
        return "Especialista em gestão de equipes e liderança"
      case "master":
        return "Consultora estratégica para alta gestão"
      default:
        return "Assistente inteligente"
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
      type: "text",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate AI response
    if (chatMode === "ai") {
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: getAIResponse(newMessage),
          sender: "ai",
          timestamp: new Date().toLocaleTimeString(),
          type: "text",
        }
        setMessages((prev) => [...prev, aiResponse])
      }, 1000)
    }
  }

  const getAIResponse = (userMessage: string): string => {
    if (!user) return "Desculpe, não consegui processar sua mensagem."
  
    const responses = {
      simple: [
        "Entendi! Vou te ajudar a organizar isso melhor. Que tal criarmos uma lista de prioridades?",
        "Ótima pergunta! Baseado no seu perfil, sugiro focar primeiro nas tarefas mais urgentes.",
        "Posso ver que você está se esforçando muito. Vamos encontrar uma forma mais eficiente de fazer isso.",
      ],
      leader: [
        "Como líder, é importante você delegar essa tarefa. Que tal conversar com o Carlos sobre isso?",
        "Vejo que sua equipe está com algumas demandas em atraso. Sugiro uma reunião de alinhamento.",
        "Excelente insight! Isso pode impactar positivamente toda a equipe. Como planeja implementar?",
      ],
      master: [
        "Essa decisão pode ter impacto estratégico. Vamos analisar os dados antes de prosseguir.",
        "Considerando o cenário atual, sugiro uma abordagem mais conservadora neste trimestre.",
        "Perfeito! Essa iniciativa está alinhada com nossos objetivos de longo prazo.",
      ],
    }

    const roleResponses = responses[user.role] || responses.simple
    return roleResponses[Math.floor(Math.random() * roleResponses.length)]
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-yellow-600"
    }
  }

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Badge className="bg-green-100 text-green-800 text-xs">😊</Badge>
      case "negative":
        return <Badge className="bg-red-100 text-red-800 text-xs">😟</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">😐</Badge>
    }
  }

  const getSubtleSuggestions = () => {
    if (!user) return []
    switch (user.role) {
      case "simple":
        return [
          { icon: Target, text: "Foque na tarefa do Carlos primeiro", type: "priority" },
          { icon: Clock, text: "15min de pausa pode aumentar sua produtividade", type: "wellness" },
          { icon: Lightbulb, text: "Que tal organizar suas tarefas por energia necessária?", type: "tip" },
        ]
      case "leader":
        return [
          { icon: Users, text: "João precisa de apoio - sentimento negativo detectado", type: "team" },
          { icon: TrendingUp, text: "Ana está motivada - bom momento para novos desafios", type: "opportunity" },
          { icon: AlertTriangle, text: "3 tarefas delegadas precisam de follow-up", type: "action" },
        ]
      case "master":
        return [
          { icon: BarChart3, text: "Produtividade da equipe subiu 12% esta semana", type: "insight" },
          { icon: Brain, text: "Padrão identificado: reuniões 2ª feira são 30% menos produtivas", type: "pattern" },
          { icon: Calendar, text: "Momento ideal para implementar mudanças estratégicas", type: "timing" },
        ]
      default:
        return []
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const filteredPeople = people.filter((person) => person.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Column - People List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredPeople.map((person) => (
              <div
                key={person.id}
                onClick={() => {
                  setSelectedPerson(person)
                  setChatMode("person")
                  setMessages([])
                }}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedPerson?.id === person.id && chatMode === "person"
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
                    <AvatarFallback>{person.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      person.status === "online"
                        ? "bg-green-500"
                        : person.status === "away"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">{person.name}</h3>
                    <div className="flex items-center space-x-1">
                      {getSentimentBadge(person.sentiment)}
                      <span className="text-xs text-gray-500">{person.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{person.lastMessage}</p>
                  <div className="flex items-center justify-between mt-1">
                    <Badge
                      variant={person.priority === "high" ? "destructive" : person.priority === "medium" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {person.priority}
                    </Badge>
                    {person.unreadCount > 0 && (
                      <Badge className="bg-blue-600 text-white text-xs">{person.unreadCount}</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Center Column - Chat */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {chatMode === "ai" ? (
                <>
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{getAIName()}</h2>
                    <p className="text-sm text-gray-600">{getAIPersonality()}</p>
                  </div>
                </>
              ) : selectedPerson ? (
                <>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedPerson.avatar || "/placeholder.svg"} alt={selectedPerson.name} />
                    <AvatarFallback>{selectedPerson.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedPerson.name}</h2>
                    <p className="text-sm text-gray-600 capitalize">{selectedPerson.status}</p>
                  </div>
                </>
              ) : (
                <div>
                  <h2 className="font-semibold text-gray-900">Selecione uma conversa</h2>
                  <p className="text-sm text-gray-600">Escolha alguém para conversar</p>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <NotificationCenter userId={user.id} />
              <Button
                variant={chatMode === "ai" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setChatMode("ai")
                  setSelectedPerson(null)
                  setMessages([])
                }}
              >
                <Bot className="w-4 h-4 mr-2" />
                IA
              </Button>
              <Button
                variant={chatMode === "person" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (people.length > 0) {
                    setSelectedPerson(people[0])
                    setChatMode("person")
                    setMessages([])
                  }
                }}
              >
                <User className="w-4 h-4 mr-2" />
                Pessoas
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {chatMode === "ai" ? `Converse com ${getAIName()}` : "Inicie uma conversa"}
                </h3>
                <p className="text-gray-600">
                  {chatMode === "ai"
                    ? "Sua assistente está pronta para ajudar com suas tarefas e produtividade"
                    : selectedPerson
                    ? `Comece a conversar com ${selectedPerson.name}`
                    : "Selecione uma pessoa na lista à esquerda"}
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : message.sender === "ai"
                        ? "bg-purple-100 text-purple-900"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "user" ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder={
                chatMode === "ai"
                  ? `Digite sua mensagem para ${getAIName()}...`
                  : selectedPerson
                  ? `Mensagem para ${selectedPerson.name}...`
                  : "Selecione uma conversa..."
              }
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              disabled={chatMode === "person" && !selectedPerson}
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={!newMessage.trim() || (chatMode === "person" && !selectedPerson)}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column - Tasks & Insights */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Painel de Controle</h2>
        </div>

        <ScrollArea className="flex-1 p-4 space-y-6">
          {/* WhatsApp Connection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Smartphone className="w-4 h-4 mr-2 text-green-600" />
                WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {whatsappError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700 text-xs">{whatsappError}</AlertDescription>
                </Alert>
              )}

              {!whatsappSession || whatsappSession.status === "EXPIRED" ? (
                <div className="text-center">
                  <Button onClick={connectWhatsApp} disabled={isConnectingWhatsApp} size="sm" className="w-full">
                    {isConnectingWhatsApp ? (
                      <>
                        <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                        Conectando...
                      </>
                    ) : (
                      <>
                        <QrCode className="w-3 h-3 mr-2" />
                        Conectar
                      </>
                    )}
                  </Button>
                </div>
              ) : whatsappSession.status === "INITIALIZING" ? (
                <div className="text-center py-2">
                  <RefreshCw className="w-6 h-6 text-blue-500 mx-auto mb-2 animate-spin" />
                  <p className="text-xs text-gray-600">Inicializando...</p>
                </div>
              ) : whatsappSession.status === "SCAN_QR_CODE" ? (
                <div className="text-center">
                  <div className="bg-white p-2 rounded border-2 border-dashed border-gray-300 mb-2">
                    {whatsappSession.qr ? (
                      <div className="relative">
                        <img
                          src={whatsappSession.qr || "/placeholder.svg"}
                          alt="QR Code WhatsApp"
                          className="w-32 h-32 mx-auto"
                          onError={(e) => {
                            console.error("Erro ao carregar QR Code")
                            setWhatsappError("Erro ao carregar QR Code. Tente novamente.")
                          }}
                        />
                        {timeLeft > 0 && (
                          <div className="absolute top-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
                            {formatTime(timeLeft)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-gray-100 flex items-center justify-center mx-auto">
                        <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Escaneie com WhatsApp</p>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm" onClick={refreshQRCode} className="flex-1">
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setWhatsappSession(null)} className="flex-1">
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : whatsappSession.status === "WORKING" ? (
                <div className="space-y-2">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700 text-xs">
                      <strong>Conectado!</strong>
                      {whatsappSession.me?.pushName && (
                        <>
                          <br />
                          {whatsappSession.me.pushName}
                        </>
                      )}
                    </AlertDescription>
                  </Alert>
                  <Button variant="outline" size="sm" onClick={disconnectWhatsApp} className="w-full">
                    <WifiOff className="w-3 h-3 mr-2" />
                    Desconectar
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <AlertCircle className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-2">Status: {whatsappSession.status}</p>
                  <Button size="sm" onClick={refreshQRCode} className="w-full">
                    Tentar Novamente
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subtle AI Suggestions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Brain className="w-4 h-4 mr-2 text-purple-600" />
                Insights Inteligentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {getSubtleSuggestions().map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 rounded text-xs">
                  <suggestion.icon className="w-3 h-3 mt-0.5 text-gray-600 flex-shrink-0" />
                  <span className="text-gray-700">{suggestion.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                  {user.role === "simple" ? "Suas Tarefas" : "Tarefas da Equipe"}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {tasks.filter((t) => t.status !== "completed").length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tasks.slice(0, 4).map((task) => (
                <div key={task.id} className="p-2 border border-gray-200 rounded text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 truncate">{task.title}</span>
                    {task.needsFollowUp && (
                      <Badge variant="destructive" className="text-xs">
                        Cobrar
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>
                      {user.role === "simple" ? `Por: ${task.assignedBy}` : `Para: ${task.assignedTo}`}
                    </span>
                    <span>{task.dueDate}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <Badge
                      variant={
                        task.status === "completed"
                          ? "default"
                          : task.status === "in_progress"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {task.status === "completed"
                        ? "Concluída"
                        : task.status === "in_progress"
                        ? "Em andamento"
                        : "Pendente"}
                    </Badge>
                    <Badge
                      variant={
                        task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <BarChart3 className="w-4 h-4 mr-2 text-green-600" />
                Resumo Rápido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Conversas ativas</span>
                <span className="font-medium">{people.filter((p) => p.status === "online").length}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Tarefas pendentes</span>
                <span className="font-medium">{tasks.filter((t) => t.status === "pending").length}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Sentimento geral</span>
                <span className="font-medium text-green-600">Positivo</span>
              </div>
              {user.role !== "simple" && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Precisam follow-up</span>
                  <span className="font-medium text-red-600">
                    {tasks.filter((t) => t.needsFollowUp).length}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </ScrollArea>
      </div>
    </div>
  )
}
