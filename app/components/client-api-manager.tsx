"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Edit,
  Trash2,
  Key,
  Brain,
  Globe,
  Save,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  Settings,
  Zap,
} from "lucide-react"

interface APIKey {
  id: string
  name: string
  provider: "openai" | "gemini" | "google-search" | "bing-search"
  key: string
  model?: string
  maxTokens: number
  temperature: number
  enabled: boolean
  usage: {
    used: number
    limit: number
    cost: number
  }
  createdAt: string
  lastUsed?: string
}

interface IAMaestroConfig {
  teachingMode: number // 0-100%
  suggestionFrequency: number // 0-100%
  profileAnalysis: number // 0-100%
  learningAdaptation: number // 0-100%
  contextMemory: number // 0-100%
  proactiveInsights: boolean
  personalizedResponses: boolean
  continuousLearning: boolean
  emotionalIntelligence: boolean
  discProfileIntegration: boolean
  communicationStyleAdaptation: boolean
}

interface ClientAPIManagerProps {
  clientId: string
  clientName: string
  onSave: (clientId: string, config: any) => void
}

export default function ClientAPIManager({ clientId, clientName, onSave }: ClientAPIManagerProps) {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: "1",
      name: "OpenAI Principal",
      provider: "openai",
      key: "sk-1234567890abcdef1234567890abcdef",
      model: "gpt-4",
      maxTokens: 2000,
      temperature: 0.7,
      enabled: true,
      usage: { used: 45000, limit: 100000, cost: 67.5 },
      createdAt: "2024-01-01",
      lastUsed: "2024-01-15",
    },
    {
      id: "2",
      name: "Gemini Backup",
      provider: "gemini",
      key: "AIza1234567890abcdef1234567890",
      model: "gemini-pro",
      maxTokens: 1500,
      temperature: 0.8,
      enabled: false,
      usage: { used: 12000, limit: 50000, cost: 15.6 },
      createdAt: "2024-01-05",
      lastUsed: "2024-01-10",
    },
  ])

  const [maestroConfig, setMaestroConfig] = useState<IAMaestroConfig>({
    teachingMode: 75,
    suggestionFrequency: 60,
    profileAnalysis: 80,
    learningAdaptation: 70,
    contextMemory: 90,
    proactiveInsights: true,
    personalizedResponses: true,
    continuousLearning: true,
    emotionalIntelligence: true,
    discProfileIntegration: true,
    communicationStyleAdaptation: true,
  })

  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({})
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [newKey, setNewKey] = useState({
    name: "",
    provider: "openai" as const,
    key: "",
    model: "gpt-4",
    maxTokens: 2000,
    temperature: 0.7,
    limit: 100000,
  })

  const addAPIKey = () => {
    const apiKey: APIKey = {
      id: Date.now().toString(),
      ...newKey,
      enabled: true,
      usage: { used: 0, limit: newKey.limit, cost: 0 },
      createdAt: new Date().toISOString(),
    }
    setApiKeys([...apiKeys, apiKey])
    setNewKey({
      name: "",
      provider: "openai",
      key: "",
      model: "gpt-4",
      maxTokens: 2000,
      temperature: 0.7,
      limit: 100000,
    })
  }

  const deleteAPIKey = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id))
  }

  const toggleKeyVisibility = (id: string) => {
    setShowKeys({ ...showKeys, [id]: !showKeys[id] })
  }

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key)
  }

  const maskKey = (key: string) => {
    if (key.length <= 8) return key
    return key.substring(0, 8) + "..." + key.substring(key.length - 4)
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "openai":
        return <Brain className="h-4 w-4 text-green-600" />
      case "gemini":
        return <Brain className="h-4 w-4 text-blue-600" />
      case "google-search":
      case "bing-search":
        return <Globe className="h-4 w-4 text-purple-600" />
      default:
        return <Key className="h-4 w-4 text-gray-600" />
    }
  }

  const getUsagePercentage = (used: number, limit: number) => {
    return limit > 0 ? (used / limit) * 100 : 0
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-green-600"
  }

  const totalCost = apiKeys.reduce((acc, key) => acc + key.usage.cost, 0)
  const totalUsage = apiKeys.reduce((acc, key) => acc + key.usage.used, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5 text-blue-600" />
                <span>Gerenciamento de APIs - {clientName}</span>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">Configure APIs individuais e IA Maestro para este cliente</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-100 text-blue-800">{apiKeys.length} APIs</Badge>
              <Badge className="bg-green-100 text-green-800">${totalCost.toFixed(2)} gasto</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Zap className="h-6 w-6 mx-auto text-blue-600 mb-1" />
              <div className="text-lg font-bold text-blue-900">{totalUsage.toLocaleString()}</div>
              <div className="text-xs text-blue-700">Tokens Usados</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 mx-auto text-green-600 mb-1" />
              <div className="text-lg font-bold text-green-900">{apiKeys.filter((k) => k.enabled).length}</div>
              <div className="text-xs text-green-700">APIs Ativas</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Brain className="h-6 w-6 mx-auto text-purple-600 mb-1" />
              <div className="text-lg font-bold text-purple-900">{maestroConfig.teachingMode}%</div>
              <div className="text-xs text-purple-700">Modo Ensino</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <Settings className="h-6 w-6 mx-auto text-orange-600 mb-1" />
              <div className="text-lg font-bold text-orange-900">{maestroConfig.suggestionFrequency}%</div>
              <div className="text-xs text-orange-700">Sugestões</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="api-keys">Chaves API</TabsTrigger>
          <TabsTrigger value="ia-maestro">IA Maestro</TabsTrigger>
        </TabsList>

        {/* Gerenciamento de API Keys */}
        <TabsContent value="api-keys">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de APIs */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>APIs Configuradas</span>
                  <Button size="sm" onClick={() => setEditingKey("new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova API
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {apiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getProviderIcon(apiKey.provider)}
                            <div>
                              <h3 className="font-medium">{apiKey.name}</h3>
                              <p className="text-sm text-gray-600 capitalize">
                                {apiKey.provider} - {apiKey.model}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch checked={apiKey.enabled} />
                            <Button variant="outline" size="sm" onClick={() => setEditingKey(apiKey.id)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteAPIKey(apiKey.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">API Key</span>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleKeyVisibility(apiKey.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  {showKeys[apiKey.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyKey(apiKey.key)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <code className="text-xs bg-gray-100 p-2 rounded block">
                              {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                            </code>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Uso de Tokens</span>
                              <span
                                className={`text-sm font-medium ${getUsageColor(
                                  getUsagePercentage(apiKey.usage.used, apiKey.usage.limit),
                                )}`}
                              >
                                {apiKey.usage.used.toLocaleString()}/{apiKey.usage.limit.toLocaleString()}
                              </span>
                            </div>
                            <Progress
                              value={getUsagePercentage(apiKey.usage.used, apiKey.usage.limit)}
                              className="h-2"
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <span className="text-gray-600">Custo:</span>
                              <div className="font-medium">${apiKey.usage.cost.toFixed(2)}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Max Tokens:</span>
                              <div className="font-medium">{apiKey.maxTokens}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Temperature:</span>
                              <div className="font-medium">{apiKey.temperature}</div>
                            </div>
                          </div>

                          <div className="text-xs text-gray-500">
                            Criado: {new Date(apiKey.createdAt).toLocaleDateString("pt-BR")}
                            {apiKey.lastUsed && (
                              <span className="ml-2">
                                Último uso: {new Date(apiKey.lastUsed).toLocaleDateString("pt-BR")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Formulário de Edição */}
            <Card>
              <CardHeader>
                <CardTitle>{editingKey === "new" ? "Nova API Key" : "Editar API Key"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingKey && (
                  <>
                    <div>
                      <Label htmlFor="api-name">Nome da API</Label>
                      <Input
                        id="api-name"
                        value={newKey.name}
                        onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                        placeholder="Ex: OpenAI Principal"
                      />
                    </div>

                    <div>
                      <Label htmlFor="provider">Provedor</Label>
                      <select
                        id="provider"
                        value={newKey.provider}
                        onChange={(e) => setNewKey({ ...newKey, provider: e.target.value as any })}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="openai">OpenAI</option>
                        <option value="gemini">Google Gemini</option>
                        <option value="google-search">Google Search</option>
                        <option value="bing-search">Bing Search</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="api-key">API Key</Label>
                      <Input
                        id="api-key"
                        type="password"
                        value={newKey.key}
                        onChange={(e) => setNewKey({ ...newKey, key: e.target.value })}
                        placeholder="Cole sua API key aqui"
                      />
                    </div>

                    {(newKey.provider === "openai" || newKey.provider === "gemini") && (
                      <>
                        <div>
                          <Label htmlFor="model">Modelo</Label>
                          <select
                            id="model"
                            value={newKey.model}
                            onChange={(e) => setNewKey({ ...newKey, model: e.target.value })}
                            className="w-full p-2 border rounded-md"
                          >
                            {newKey.provider === "openai" ? (
                              <>
                                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                <option value="gpt-4">GPT-4</option>
                                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                                <option value="gpt-4o">GPT-4o</option>
                              </>
                            ) : (
                              <>
                                <option value="gemini-pro">Gemini Pro</option>
                                <option value="gemini-pro-vision">Gemini Pro Vision</option>
                                <option value="gemini-ultra">Gemini Ultra</option>
                              </>
                            )}
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="max-tokens">Max Tokens</Label>
                          <Input
                            id="max-tokens"
                            type="number"
                            value={newKey.maxTokens}
                            onChange={(e) => setNewKey({ ...newKey, maxTokens: Number.parseInt(e.target.value) })}
                            min="100"
                            max="4000"
                          />
                        </div>

                        <div>
                          <Label htmlFor="temperature">Temperature: {newKey.temperature}</Label>
                          <input
                            id="temperature"
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            value={newKey.temperature}
                            onChange={(e) => setNewKey({ ...newKey, temperature: Number.parseFloat(e.target.value) })}
                            className="w-full"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <Label htmlFor="limit">Limite Mensal de Tokens</Label>
                      <Input
                        id="limit"
                        type="number"
                        value={newKey.limit}
                        onChange={(e) => setNewKey({ ...newKey, limit: Number.parseInt(e.target.value) })}
                        min="1000"
                        step="1000"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={addAPIKey} className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                      <Button variant="outline" onClick={() => setEditingKey(null)}>
                        Cancelar
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configuração IA Maestro */}
        <TabsContent value="ia-maestro">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>Configurações de Aprendizado</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">Modo Ensino: {maestroConfig.teachingMode}%</Label>
                  <p className="text-xs text-gray-600 mb-2">
                    Frequência com que a IA explica conceitos e ensina novas habilidades
                  </p>
                  <Slider
                    value={[maestroConfig.teachingMode]}
                    onValueChange={(value) => setMaestroConfig({ ...maestroConfig, teachingMode: value[0] })}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Frequência de Sugestões: {maestroConfig.suggestionFrequency}%
                  </Label>
                  <p className="text-xs text-gray-600 mb-2">
                    Com que frequência a IA oferece sugestões proativas de melhoria
                  </p>
                  <Slider
                    value={[maestroConfig.suggestionFrequency]}
                    onValueChange={(value) => setMaestroConfig({ ...maestroConfig, suggestionFrequency: value[0] })}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Análise de Perfil: {maestroConfig.profileAnalysis}%</Label>
                  <p className="text-xs text-gray-600 mb-2">Intensidade da análise comportamental e perfil DISC</p>
                  <Slider
                    value={[maestroConfig.profileAnalysis]}
                    onValueChange={(value) => setMaestroConfig({ ...maestroConfig, profileAnalysis: value[0] })}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Adaptação de Aprendizado: {maestroConfig.learningAdaptation}%
                  </Label>
                  <p className="text-xs text-gray-600 mb-2">
                    Capacidade da IA de se adaptar ao estilo de aprendizado do usuário
                  </p>
                  <Slider
                    value={[maestroConfig.learningAdaptation]}
                    onValueChange={(value) => setMaestroConfig({ ...maestroConfig, learningAdaptation: value[0] })}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Memória de Contexto: {maestroConfig.contextMemory}%</Label>
                  <p className="text-xs text-gray-600 mb-2">Quanto a IA lembra de conversas e contextos anteriores</p>
                  <Slider
                    value={[maestroConfig.contextMemory]}
                    onValueChange={(value) => setMaestroConfig({ ...maestroConfig, contextMemory: value[0] })}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  <span>Funcionalidades Avançadas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Insights Proativos</Label>
                    <p className="text-xs text-gray-600">IA oferece insights sem ser solicitada</p>
                  </div>
                  <Switch
                    checked={maestroConfig.proactiveInsights}
                    onCheckedChange={(checked) => setMaestroConfig({ ...maestroConfig, proactiveInsights: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Respostas Personalizadas</Label>
                    <p className="text-xs text-gray-600">Adapta linguagem ao perfil do usuário</p>
                  </div>
                  <Switch
                    checked={maestroConfig.personalizedResponses}
                    onCheckedChange={(checked) =>
                      setMaestroConfig({ ...maestroConfig, personalizedResponses: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Aprendizado Contínuo</Label>
                    <p className="text-xs text-gray-600">IA aprende com cada interação</p>
                  </div>
                  <Switch
                    checked={maestroConfig.continuousLearning}
                    onCheckedChange={(checked) => setMaestroConfig({ ...maestroConfig, continuousLearning: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Inteligência Emocional</Label>
                    <p className="text-xs text-gray-600">Reconhece e responde a emoções</p>
                  </div>
                  <Switch
                    checked={maestroConfig.emotionalIntelligence}
                    onCheckedChange={(checked) =>
                      setMaestroConfig({ ...maestroConfig, emotionalIntelligence: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Integração Perfil DISC</Label>
                    <p className="text-xs text-gray-600">Usa perfil DISC para personalizar</p>
                  </div>
                  <Switch
                    checked={maestroConfig.discProfileIntegration}
                    onCheckedChange={(checked) =>
                      setMaestroConfig({ ...maestroConfig, discProfileIntegration: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Adaptação de Comunicação</Label>
                    <p className="text-xs text-gray-600">Ajusta estilo de comunicação</p>
                  </div>
                  <Switch
                    checked={maestroConfig.communicationStyleAdaptation}
                    onCheckedChange={(checked) =>
                      setMaestroConfig({ ...maestroConfig, communicationStyleAdaptation: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Resumo da Configuração</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-purple-50 rounded">
                      <div className="font-medium">Ensino</div>
                      <div>{maestroConfig.teachingMode}%</div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="font-medium">Sugestões</div>
                      <div>{maestroConfig.suggestionFrequency}%</div>
                    </div>
                    <div className="p-2 bg-green-50 rounded">
                      <div className="font-medium">Perfil</div>
                      <div>{maestroConfig.profileAnalysis}%</div>
                    </div>
                    <div className="p-2 bg-orange-50 rounded">
                      <div className="font-medium">Memória</div>
                      <div>{maestroConfig.contextMemory}%</div>
                    </div>
                  </div>
                </div>

                <Button onClick={() => onSave(clientId, { apiKeys, maestroConfig })} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações IA Maestro
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
