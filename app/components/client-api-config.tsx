"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Brain, Globe, Smartphone, Activity, Settings, Eye, EyeOff, Save, RefreshCw } from "lucide-react"
import type { Client, APIConfig } from "@/types/user"

interface ClientAPIConfigProps {
  client: Client
  onSave: (clientId: string, config: APIConfig) => void
}

export default function ClientAPIConfig({ client, onSave }: ClientAPIConfigProps) {
  const [apiConfig, setApiConfig] = useState<APIConfig>(client.apiConfig)
  const [showKeys, setShowKeys] = useState({
    openai: false,
    gemini: false,
    internet: false,
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(client.id, apiConfig)
      // Simular delay de salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } finally {
      setSaving(false)
    }
  }

  const updateOpenAI = (field: string, value: any) => {
    setApiConfig({
      ...apiConfig,
      openai: {
        ...apiConfig.openai!,
        [field]: value,
      },
    })
  }

  const updateGemini = (field: string, value: any) => {
    setApiConfig({
      ...apiConfig,
      gemini: {
        ...apiConfig.gemini!,
        [field]: value,
      },
    })
  }

  const updateInternetAccess = (field: string, value: any) => {
    setApiConfig({
      ...apiConfig,
      internetAccess: {
        ...apiConfig.internetAccess!,
        [field]: value,
      },
    })
  }

  const updateWhatsApp = (field: string, value: any) => {
    setApiConfig({
      ...apiConfig,
      whatsapp: {
        ...apiConfig.whatsapp!,
        [field]: value,
      },
    })
  }

  const getUsagePercentage = (used: number, limit: number) => {
    return limit > 0 ? (used / limit) * 100 : 0
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-green-600"
  }

  const maskApiKey = (key: string) => {
    if (!key) return ""
    return key.substring(0, 8) + "..." + key.substring(key.length - 4)
  }

  return (
    <div className="space-y-6">
      {/* Header com informações do cliente */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Configurações API - {client.name}</span>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">Gerencie APIs e controle de tokens para este cliente</p>
            </div>
            <Badge className={client.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {client.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-900">{client.tokenUsage.openai.used.toLocaleString()}</div>
              <div className="text-xs text-blue-700">Tokens OpenAI</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-900">{client.tokenUsage.gemini.used.toLocaleString()}</div>
              <div className="text-xs text-purple-700">Tokens Gemini</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-900">{client.tokenUsage.internetQueries.used}</div>
              <div className="text-xs text-green-700">Consultas Web</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-lg font-bold text-orange-900">
                ${(client.tokenUsage.openai.cost + client.tokenUsage.gemini.cost).toFixed(2)}
              </div>
              <div className="text-xs text-orange-700">Custo Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="openai" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="openai">OpenAI</TabsTrigger>
          <TabsTrigger value="gemini">Gemini</TabsTrigger>
          <TabsTrigger value="internet">Internet</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
        </TabsList>

        {/* OpenAI Configuration */}
        <TabsContent value="openai">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <span>Configuração OpenAI</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Ativar OpenAI</Label>
                  <Switch
                    checked={apiConfig.openai?.enabled || false}
                    onCheckedChange={(checked) => updateOpenAI("enabled", checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="openai-key">API Key</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="openai-key"
                      type={showKeys.openai ? "text" : "password"}
                      value={apiConfig.openai?.apiKey || ""}
                      onChange={(e) => updateOpenAI("apiKey", e.target.value)}
                      placeholder="sk-..."
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowKeys({ ...showKeys, openai: !showKeys.openai })}
                    >
                      {showKeys.openai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {apiConfig.openai?.apiKey && !showKeys.openai && (
                    <p className="text-xs text-gray-500 mt-1">Key: {maskApiKey(apiConfig.openai.apiKey)}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="openai-model">Modelo</Label>
                  <select
                    id="openai-model"
                    value={apiConfig.openai?.model || "gpt-3.5-turbo"}
                    onChange={(e) => updateOpenAI("model", e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="gpt-4o">GPT-4o</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="openai-tokens">Max Tokens</Label>
                  <Input
                    id="openai-tokens"
                    type="number"
                    value={apiConfig.openai?.maxTokens || 1000}
                    onChange={(e) => updateOpenAI("maxTokens", Number.parseInt(e.target.value))}
                    min="100"
                    max="4000"
                  />
                </div>

                <div>
                  <Label htmlFor="openai-temp">Temperature: {apiConfig.openai?.temperature || 0.7}</Label>
                  <input
                    id="openai-temp"
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={apiConfig.openai?.temperature || 0.7}
                    onChange={(e) => updateOpenAI("temperature", Number.parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Uso OpenAI</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Tokens Utilizados</span>
                    <span
                      className={`text-sm font-medium ${getUsageColor(
                        getUsagePercentage(client.tokenUsage.openai.used, client.tokenUsage.openai.limit),
                      )}`}
                    >
                      {client.tokenUsage.openai.used.toLocaleString()}/{client.tokenUsage.openai.limit.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={getUsagePercentage(client.tokenUsage.openai.used, client.tokenUsage.openai.limit)}
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Custo Estimado</span>
                    <span className="text-sm font-medium">${client.tokenUsage.openai.cost.toFixed(4)}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Modelo Atual:</span>
                    <span className="font-medium">{apiConfig.openai?.model || "Não configurado"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Tokens:</span>
                    <span className="font-medium">{apiConfig.openai?.maxTokens || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Temperature:</span>
                    <span className="font-medium">{apiConfig.openai?.temperature || 0}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resetar Contadores
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gemini Configuration */}
        <TabsContent value="gemini">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>Configuração Gemini</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Ativar Gemini</Label>
                  <Switch
                    checked={apiConfig.gemini?.enabled || false}
                    onCheckedChange={(checked) => updateGemini("enabled", checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="gemini-key">API Key</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="gemini-key"
                      type={showKeys.gemini ? "text" : "password"}
                      value={apiConfig.gemini?.apiKey || ""}
                      onChange={(e) => updateGemini("apiKey", e.target.value)}
                      placeholder="AIza..."
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowKeys({ ...showKeys, gemini: !showKeys.gemini })}
                    >
                      {showKeys.gemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="gemini-model">Modelo</Label>
                  <select
                    id="gemini-model"
                    value={apiConfig.gemini?.model || "gemini-pro"}
                    onChange={(e) => updateGemini("model", e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="gemini-pro">Gemini Pro</option>
                    <option value="gemini-pro-vision">Gemini Pro Vision</option>
                    <option value="gemini-ultra">Gemini Ultra</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="gemini-tokens">Max Tokens</Label>
                  <Input
                    id="gemini-tokens"
                    type="number"
                    value={apiConfig.gemini?.maxTokens || 1000}
                    onChange={(e) => updateGemini("maxTokens", Number.parseInt(e.target.value))}
                    min="100"
                    max="4000"
                  />
                </div>

                <div>
                  <Label htmlFor="gemini-temp">Temperature: {apiConfig.gemini?.temperature || 0.7}</Label>
                  <input
                    id="gemini-temp"
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={apiConfig.gemini?.temperature || 0.7}
                    onChange={(e) => updateGemini("temperature", Number.parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Uso Gemini</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Tokens Utilizados</span>
                    <span
                      className={`text-sm font-medium ${getUsageColor(
                        getUsagePercentage(client.tokenUsage.gemini.used, client.tokenUsage.gemini.limit),
                      )}`}
                    >
                      {client.tokenUsage.gemini.used.toLocaleString()}/{client.tokenUsage.gemini.limit.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={getUsagePercentage(client.tokenUsage.gemini.used, client.tokenUsage.gemini.limit)}
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Custo Estimado</span>
                    <span className="text-sm font-medium">${client.tokenUsage.gemini.cost.toFixed(4)}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Modelo Atual:</span>
                    <span className="font-medium">{apiConfig.gemini?.model || "Não configurado"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Tokens:</span>
                    <span className="font-medium">{apiConfig.gemini?.maxTokens || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Temperature:</span>
                    <span className="font-medium">{apiConfig.gemini?.temperature || 0}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resetar Contadores
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Internet Access Configuration */}
        <TabsContent value="internet">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  <span>Acesso à Internet</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Ativar Acesso à Internet</Label>
                  <Switch
                    checked={apiConfig.internetAccess?.enabled || false}
                    onCheckedChange={(checked) => updateInternetAccess("enabled", checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="search-engine">Motor de Busca</Label>
                  <select
                    id="search-engine"
                    value={apiConfig.internetAccess?.searchEngine || "google"}
                    onChange={(e) => updateInternetAccess("searchEngine", e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="google">Google Search</option>
                    <option value="bing">Bing Search</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="search-key">API Key de Busca</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="search-key"
                      type={showKeys.internet ? "text" : "password"}
                      value={apiConfig.internetAccess?.apiKey || ""}
                      onChange={(e) => updateInternetAccess("apiKey", e.target.value)}
                      placeholder="API Key..."
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowKeys({ ...showKeys, internet: !showKeys.internet })}
                    >
                      {showKeys.internet ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="max-queries">Max Consultas por Mês</Label>
                  <Input
                    id="max-queries"
                    type="number"
                    value={apiConfig.internetAccess?.maxQueries || 100}
                    onChange={(e) => updateInternetAccess("maxQueries", Number.parseInt(e.target.value))}
                    min="10"
                    max="10000"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Uso Internet</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Consultas Realizadas</span>
                    <span
                      className={`text-sm font-medium ${getUsageColor(
                        getUsagePercentage(
                          client.tokenUsage.internetQueries.used,
                          client.tokenUsage.internetQueries.limit,
                        ),
                      )}`}
                    >
                      {client.tokenUsage.internetQueries.used}/{client.tokenUsage.internetQueries.limit}
                    </span>
                  </div>
                  <Progress
                    value={getUsagePercentage(
                      client.tokenUsage.internetQueries.used,
                      client.tokenUsage.internetQueries.limit,
                    )}
                    className="h-2"
                  />
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Motor de Busca:</span>
                    <span className="font-medium capitalize">
                      {apiConfig.internetAccess?.searchEngine || "Não configurado"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Limite Mensal:</span>
                    <span className="font-medium">{apiConfig.internetAccess?.maxQueries || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant={apiConfig.internetAccess?.enabled ? "default" : "secondary"}>
                      {apiConfig.internetAccess?.enabled ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resetar Contadores
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* WhatsApp Configuration */}
        <TabsContent value="whatsapp">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  <span>Configuração WhatsApp</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Ativar WhatsApp</Label>
                  <Switch
                    checked={apiConfig.whatsapp?.enabled || false}
                    onCheckedChange={(checked) => updateWhatsApp("enabled", checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="max-connections">Max Conexões Simultâneas</Label>
                  <Input
                    id="max-connections"
                    type="number"
                    value={apiConfig.whatsapp?.maxConnections || 1}
                    onChange={(e) => updateWhatsApp("maxConnections", Number.parseInt(e.target.value))}
                    min="1"
                    max="10"
                  />
                </div>

                <div>
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input
                    id="webhook-url"
                    value={apiConfig.whatsapp?.webhookUrl || ""}
                    onChange={(e) => updateWhatsApp("webhookUrl", e.target.value)}
                    placeholder="https://seu-dominio.com/webhook"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Uso WhatsApp</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Mensagens Enviadas</span>
                    <span
                      className={`text-sm font-medium ${getUsageColor(
                        getUsagePercentage(
                          client.tokenUsage.whatsappMessages.sent,
                          client.tokenUsage.whatsappMessages.limit,
                        ),
                      )}`}
                    >
                      {client.tokenUsage.whatsappMessages.sent}/{client.tokenUsage.whatsappMessages.limit}
                    </span>
                  </div>
                  <Progress
                    value={getUsagePercentage(
                      client.tokenUsage.whatsappMessages.sent,
                      client.tokenUsage.whatsappMessages.limit,
                    )}
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Mensagens Recebidas</span>
                    <span className="text-sm font-medium">{client.tokenUsage.whatsappMessages.received}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Conexões Ativas:</span>
                    <span className="font-medium">{client.whatsappConnections}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Conexões:</span>
                    <span className="font-medium">{apiConfig.whatsapp?.maxConnections || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant={apiConfig.whatsapp?.enabled ? "default" : "secondary"}>
                      {apiConfig.whatsapp?.enabled ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resetar Contadores
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="min-w-32">
          {saving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
