'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useNotifications } from '@/hooks/use-notifications'
import { MessageSquare, CheckCircle2, Clock, TrendingUp, Users, Brain, Zap, Target, BarChart3, Bell, Settings, Plus, Filter, Search } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in-progress' | 'completed'
  dueDate: Date
  category: string
}

interface Conversation {
  id: string
  contact: string
  lastMessage: string
  timestamp: Date
  unread: number
  sentiment: 'positive' | 'neutral' | 'negative'
  platform: 'whatsapp' | 'email' | 'chat'
}

interface AISuggestion {
  id: string
  type: 'task' | 'response' | 'optimization' | 'insight'
  title: string
  description: string
  confidence: number
  action?: () => void
}

export function ThreeColumnWorkspace() {
  const { addNotification, unreadCount } = useNotifications()
  const [tasks, setTasks] = useState<Task[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([])
  const [selectedTab, setSelectedTab] = useState('overview')

  // Initialize demo data
  useEffect(() => {
    // Demo tasks
    setTasks([
      {
        id: '1',
        title: 'Responder proposta comercial',
        description: 'Analisar e responder proposta do cliente ABC',
        priority: 'high',
        status: 'pending',
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        category: 'Vendas'
      },
      {
        id: '2',
        title: 'Reunião de planejamento',
        description: 'Preparar apresentação para reunião semanal',
        priority: 'medium',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
        category: 'Gestão'
      },
      {
        id: '3',
        title: 'Atualizar relatório mensal',
        description: 'Compilar dados de performance do mês',
        priority: 'low',
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        category: 'Relatórios'
      }
    ])

    // Demo conversations
    setConversations([
      {
        id: '1',
        contact: 'João Silva',
        lastMessage: 'Quando podemos agendar a reunião?',
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        unread: 2,
        sentiment: 'positive',
        platform: 'whatsapp'
      },
      {
        id: '2',
        contact: 'Maria Santos',
        lastMessage: 'Preciso de mais informações sobre o produto',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        unread: 1,
        sentiment: 'neutral',
        platform: 'email'
      },
      {
        id: '3',
        contact: 'Pedro Costa',
        lastMessage: 'Obrigado pelo excelente atendimento!',
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        unread: 0,
        sentiment: 'positive',
        platform: 'chat'
      }
    ])

    // Demo AI suggestions
    setAiSuggestions([
      {
        id: '1',
        type: 'task',
        title: 'Priorizar tarefa urgente',
        description: 'A proposta comercial tem prazo apertado e alta importância',
        confidence: 95
      },
      {
        id: '2',
        type: 'response',
        title: 'Resposta sugerida para João',
        description: 'Baseado no histórico, sugiro agendar para amanhã às 14h',
        confidence: 87
      },
      {
        id: '3',
        type: 'insight',
        title: 'Padrão identificado',
        description: 'Clientes respondem 40% mais rápido às mensagens matinais',
        confidence: 78
      }
    ])
  }, [])

  const handleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed' as const }
        : task
    ))
    
    addNotification({
      title: 'Tarefa Concluída',
      message: 'Parabéns! Você completou uma tarefa.',
      type: 'tasks',
      priority: 'medium'
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'default'
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      case 'neutral': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Column - Tasks & Productivity */}
      <div className="w-1/3 border-r bg-white p-4 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Target className="h-5 w-5" />
            Produtividade
          </h2>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Nova Tarefa
          </Button>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Progresso Diário</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tarefas Concluídas</span>
                    <span>{completedTasks}/{totalTasks}</span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                  <p className="text-xs text-gray-600">
                    {completionRate.toFixed(0)}% do objetivo diário
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Concluídas hoje</span>
                  </div>
                  <span className="font-semibold">{completedTasks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">Pendentes</span>
                  </div>
                  <span className="font-semibold">
                    {tasks.filter(t => t.status === 'pending').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Em progresso</span>
                  </div>
                  <span className="font-semibold">
                    {tasks.filter(t => t.status === 'in-progress').length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="mt-4">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-3">
                {tasks.map((task) => (
                  <Card key={task.id} className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{task.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {task.dueDate.toLocaleDateString()}
                        </span>
                        {task.status !== 'completed' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleTaskComplete(task.id)}
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Concluir
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Middle Column - Conversations */}
      <div className="w-1/3 border-r bg-white p-4 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversas
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="space-y-3">
            {conversations.map((conversation) => (
              <Card key={conversation.id} className="p-3 hover:bg-gray-50 cursor-pointer">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{conversation.contact}</h4>
                      <Badge variant="outline" className="text-xs">
                        {conversation.platform}
                      </Badge>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {conversation.lastMessage}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {conversation.timestamp.toLocaleTimeString()}
                    </span>
                    <div className={`text-xs ${getSentimentColor(conversation.sentiment)}`}>
                      {conversation.sentiment}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Column - AI Insights & Analytics */}
      <div className="w-1/3 bg-white p-4 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5" />
            IA Insights
          </h2>
          <Button size="sm" variant="outline">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="suggestions" className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="suggestions">Sugestões</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="mt-4">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-3">
                {aiSuggestions.map((suggestion) => (
                  <Card key={suggestion.id} className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-600" />
                          <h4 className="font-medium text-sm">{suggestion.title}</h4>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {suggestion.confidence}%
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{suggestion.description}</p>
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.type}
                        </Badge>
                        <Button size="sm" variant="outline">
                          Aplicar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Performance Hoje
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mensagens respondidas</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tempo médio resposta</span>
                    <span className="font-semibold">12min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Satisfação cliente</span>
                    <span className="font-semibold text-green-600">94%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Conversas Ativas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>WhatsApp</span>
                      <span className="font-semibold">8</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Email</span>
                      <span className="font-semibold">3</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Chat</span>
                      <span className="font-semibold">2</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Tendências</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-xs">+15% produtividade esta semana</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-blue-600" />
                      <span className="text-xs">Melhor horário: 9h-11h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Export as default
export default ThreeColumnWorkspace
