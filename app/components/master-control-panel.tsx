"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Crown, Settings, Users, Brain, Database, MessageSquare, Plus, Trash2, Edit } from "lucide-react"
import type { AIConfig } from "@/types/user"

export default function MasterControlPanel() {
  const [aiConfig, setAiConfig] = useState<AIConfig>({
    teacherMode: 20,
    improvementSuggestions: 50,
    profileQuestions: 10,
    sentimentAnalysis: true,
    autoResponses: false,
    learningMode: true,
  })

  const [clients, setClients] = useState([
    { id: "1", name: "Empresa ABC", users: 25, plan: "Premium", status: "active" },
    { id: "2", name: "Tech Corp", users: 12, plan: "Standard", status: "active" },
    { id: "3", name: "StartupXYZ", users: 5, plan: "Basic", status: "trial" },
  ])

  const [hierarchies, setHierarchies] = useState([
    { id: "1", name: "Diretoria", level: 1, permissions: ["all"] },
    { id: "2", name: "Gerência", level: 2, permissions: ["team_management", "reports"] },
    { id: "3", name: "Coordenação", level: 3, permissions: ["task_management"] },
    { id: "4", name: "Operacional", level: 4, permissions: ["basic"] },
  ])

  const [newClient, setNewClient] = useState({ name: "", users: "", plan: "Basic" })
  const [newHierarchy, setNewHierarchy] = useState({ name: "", level: "", permissions: [] })

  const updateAIConfig = (key: keyof AIConfig, value: number | boolean) => {
    setAiConfig((prev) => ({ ...prev, [key]: value }))
  }

  const addClient = () => {
    if (newClient.name && newClient.users) {
      setClients([
        ...clients,
        {
          id: Date.now().toString(),
          name: newClient.name,
          users: Number.parseInt(newClient.users),
          plan: newClient.plan,
          status: "active",
        },
      ])
      setNewClient({ name: "", users: "", plan: "Basic" })
    }
  }

  const systemStats = {
    totalUsers: clients.reduce((acc, c) => acc + c.users, 0),
    activeClients: clients.filter((c) => c.status === "active").length,
    totalMessages: 15420,
    aiAccuracy: 94.2,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Painel Master</h1>
                <p className="text-xs opacity-90">Controle Total do Sistema</p>
              </div>
            </div>

            <Badge className="bg-white bg-opacity-20 text-white border-white border-opacity-30">Master Admin</Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{systemStats.totalUsers}</p>
                  <p className="text-sm text-gray-600">Usuários Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Database className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{systemStats.activeClients}</p>
                  <p className="text-sm text-gray-600">Clientes Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{systemStats.totalMessages.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Mensagens Processadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Brain className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{systemStats.aiAccuracy}%</p>
                  <p className="text-sm text-gray-600">Precisão da IA</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="ai-config" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ai-config">Configuração IA</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="hierarchy">Hierarquias</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="ai-config">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span>Configurações de IA</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium">Modo Professor: {aiConfig.teacherMode}%</Label>
                    <p className="text-xs text-gray-600 mb-2">Frequência que a IA dará explicações educativas</p>
                    <Slider
                      value={[aiConfig.teacherMode]}
                      onValueChange={(value) => updateAIConfig("teacherMode", value[0])}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">
                      Sugestões de Melhoria: {aiConfig.improvementSuggestions}%
                    </Label>
                    <p className="text-xs text-gray-600 mb-2">Frequência de dicas de comunicação</p>
                    <Slider
                      value={[aiConfig.improvementSuggestions]}
                      onValueChange={(value) => updateAIConfig("improvementSuggestions", value[0])}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Perguntas de Perfil: {aiConfig.profileQuestions}%</Label>
                    <p className="text-xs text-gray-600 mb-2">Frequência de perguntas para descobrir perfil DISC</p>
                    <Slider
                      value={[aiConfig.profileQuestions]}
                      onValueChange={(value) => updateAIConfig("profileQuestions", value[0])}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Análise de Sentimentos</Label>
                        <p className="text-xs text-gray-600">Ativar análise emocional automática</p>
                      </div>
                      <Switch
                        checked={aiConfig.sentimentAnalysis}
                        onCheckedChange={(checked) => updateAIConfig("sentimentAnalysis", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Respostas Automáticas</Label>
                        <p className="text-xs text-gray-600">IA pode responder automaticamente</p>
                      </div>
                      <Switch
                        checked={aiConfig.autoResponses}
                        onCheckedChange={(checked) => updateAIConfig("autoResponses", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Modo Aprendizado</Label>
                        <p className="text-xs text-gray-600">Sistema aprende com interações</p>
                      </div>
                      <Switch
                        checked={aiConfig.learningMode}
                        onCheckedChange={(checked) => updateAIConfig("learningMode", checked)}
                      />
                    </div>
                  </div>

                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Salvar Configurações
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preview das Configurações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-800 mb-1">Modo Professor Ativo</h4>
                      <p className="text-xs text-blue-700">
                        A IA dará explicações educativas em {aiConfig.teacherMode}% das interações
                      </p>
                    </div>

                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="text-sm font-medium text-green-800 mb-1">Sugestões de Melhoria</h4>
                      <p className="text-xs text-green-700">
                        Dicas de comunicação aparecerão em {aiConfig.improvementSuggestions}% das vezes
                      </p>
                    </div>

                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="text-sm font-medium text-purple-800 mb-1">Descoberta de Perfil</h4>
                      <p className="text-xs text-purple-700">
                        Perguntas DISC em {aiConfig.profileQuestions}% das oportunidades
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-800 mb-1">Status do Sistema</h4>
                      <div className="space-y-1">
                        <p className="text-xs">
                          Análise de Sentimentos: {aiConfig.sentimentAnalysis ? "✅ Ativa" : "❌ Inativa"}
                        </p>
                        <p className="text-xs">
                          Respostas Automáticas: {aiConfig.autoResponses ? "✅ Ativa" : "❌ Inativa"}
                        </p>
                        <p className="text-xs">Modo Aprendizado: {aiConfig.learningMode ? "✅ Ativo" : "❌ Inativo"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clients">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Adicionar Cliente</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="client-name">Nome da Empresa</Label>
                    <Input
                      id="client-name"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      placeholder="Nome da empresa"
                    />
                  </div>

                  <div>
                    <Label htmlFor="client-users">Número de Usuários</Label>
                    <Input
                      id="client-users"
                      type="number"
                      value={newClient.users}
                      onChange={(e) => setNewClient({ ...newClient, users: e.target.value })}
                      placeholder="Ex: 25"
                    />
                  </div>

                  <div>
                    <Label htmlFor="client-plan">Plano</Label>
                    <select
                      id="client-plan"
                      value={newClient.plan}
                      onChange={(e) => setNewClient({ ...newClient, plan: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Basic">Basic</option>
                      <option value="Standard">Standard</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>

                  <Button onClick={addClient} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Cliente
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Clientes Cadastrados</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {clients.map((client) => (
                        <div key={client.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{client.name}</h4>
                            <Badge
                              className={
                                client.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : client.status === "trial"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                              }
                            >
                              {client.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Usuários: {client.users}</p>
                            <p>Plano: {client.plan}</p>
                          </div>
                          <div className="flex space-x-2 mt-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3 mr-1" />
                              Editar
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                              <Trash2 className="h-3 w-3 mr-1" />
                              Remover
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="hierarchy">
            <Card>
              <CardHeader>
                <CardTitle>Configuração de Hierarquias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hierarchies.map((hierarchy) => (
                    <div key={hierarchy.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{hierarchy.name}</h4>
                          <p className="text-sm text-gray-600">Nível {hierarchy.level}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remover
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {hierarchy.permissions.map((permission, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Métricas do Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Precisão da IA</span>
                        <span className="text-sm">{systemStats.aiAccuracy}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${systemStats.aiAccuracy}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Satisfação dos Usuários</span>
                        <span className="text-sm">91%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "91%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Uptime do Sistema</span>
                        <span className="text-sm">99.8%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: "99.8%" }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Uso da IA por Funcionalidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Análise de Sentimentos</span>
                      <span className="text-sm font-medium">8,420 análises</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sugestões de Melhoria</span>
                      <span className="text-sm font-medium">3,210 sugestões</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Perguntas de Perfil</span>
                      <span className="text-sm font-medium">1,540 perguntas</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Modo Professor</span>
                      <span className="text-sm font-medium">2,890 explicações</span>
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
