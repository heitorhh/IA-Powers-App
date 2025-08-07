'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Users, Settings, BarChart3, Shield, Plus, Edit, Trash2, Eye, Key, DollarSign, Activity, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react'

interface Client {
  id: string
  name: string
  email: string
  plan: 'basic' | 'pro' | 'enterprise'
  status: 'active' | 'inactive' | 'suspended'
  apiKeys: {
    openai?: string
    anthropic?: string
    groq?: string
  }
  usage: {
    tokens: number
    cost: number
    limit: number
  }
  createdAt: string
}

export default function MasterControlPanel() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Empresa ABC',
      email: 'contato@empresaabc.com',
      plan: 'pro',
      status: 'active',
      apiKeys: {
        openai: 'sk-proj-***************',
        groq: 'gsk_***************'
      },
      usage: {
        tokens: 45000,
        cost: 67.50,
        limit: 100000
      },
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'StartupXYZ',
      email: 'admin@startupxyz.com',
      plan: 'basic',
      status: 'active',
      apiKeys: {
        openai: 'sk-proj-***************'
      },
      usage: {
        tokens: 12000,
        cost: 18.00,
        limit: 25000
      },
      createdAt: '2024-02-01'
    }
  ])

  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showAddClient, setShowAddClient] = useState(false)

  const handleAddApiKey = (clientId: string, provider: string, apiKey: string) => {
    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { 
            ...client, 
            apiKeys: { 
              ...client.apiKeys, 
              [provider]: apiKey 
            } 
          }
        : client
    ))
  }

  const handleRemoveApiKey = (clientId: string, provider: string) => {
    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { 
            ...client, 
            apiKeys: { 
              ...client.apiKeys, 
              [provider]: undefined 
            } 
          }
        : client
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel Master</h1>
            <p className="text-gray-600">Controle total do sistema e clientes</p>
          </div>
          <Badge className="bg-red-100 text-red-800">
            <Shield className="w-4 h-4 mr-1" />
            Acesso Master
          </Badge>
        </div>

        <Tabs defaultValue="clients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="ai-config">Config Global</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Gerenciamento de Clientes</h2>
              <Button onClick={() => setShowAddClient(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Cliente
              </Button>
            </div>

            <div className="grid gap-6">
              {clients.map((client) => (
                <Card key={client.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {client.name}
                          <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                            {client.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{client.email}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Informações do Plano */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Plano</div>
                        <div className="font-semibold capitalize">{client.plan}</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Tokens Usados</div>
                        <div className="font-semibold">{client.usage.tokens.toLocaleString()}</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Custo Mensal</div>
                        <div className="font-semibold">R$ {client.usage.cost.toFixed(2)}</div>
                      </div>
                    </div>

                    <Separator />

                    {/* API Keys Management */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium flex items-center gap-2">
                          <Key className="w-4 h-4" />
                          API Keys do Cliente
                        </h4>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedClient(client)}
                        >
                          Gerenciar Keys
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* OpenAI */}
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">OpenAI</span>
                            {client.apiKeys.openai ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          {client.apiKeys.openai ? (
                            <div className="space-y-1">
                              <div className="text-xs text-gray-600 font-mono">
                                {client.apiKeys.openai}
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleRemoveApiKey(client.id, 'openai')}
                              >
                                Remover
                              </Button>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-500">Não configurada</div>
                          )}
                        </div>

                        {/* Anthropic */}
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Anthropic</span>
                            {client.apiKeys.anthropic ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          {client.apiKeys.anthropic ? (
                            <div className="space-y-1">
                              <div className="text-xs text-gray-600 font-mono">
                                {client.apiKeys.anthropic}
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleRemoveApiKey(client.id, 'anthropic')}
                              >
                                Remover
                              </Button>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-500">Não configurada</div>
                          )}
                        </div>

                        {/* Groq */}
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Groq</span>
                            {client.apiKeys.groq ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          {client.apiKeys.groq ? (
                            <div className="space-y-1">
                              <div className="text-xs text-gray-600 font-mono">
                                {client.apiKeys.groq}
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleRemoveApiKey(client.id, 'groq')}
                              >
                                Remover
                              </Button>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-500">Não configurada</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Usage Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Uso de Tokens</span>
                        <span>{((client.usage.tokens / client.usage.limit) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(client.usage.tokens / client.usage.limit) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Modal para adicionar/editar API Keys */}
            {selectedClient && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>Gerenciar API Keys - {selectedClient.name}</CardTitle>
                    <CardDescription>
                      Configure as chaves de API para controle individual de custos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="openai-key">OpenAI API Key</Label>
                      <Input
                        id="openai-key"
                        placeholder="sk-proj-..."
                        defaultValue={selectedClient.apiKeys.openai || ''}
                        onBlur={(e) => {
                          if (e.target.value) {
                            handleAddApiKey(selectedClient.id, 'openai', e.target.value)
                          }
                        }}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="anthropic-key">Anthropic API Key</Label>
                      <Input
                        id="anthropic-key"
                        placeholder="sk-ant-..."
                        defaultValue={selectedClient.apiKeys.anthropic || ''}
                        onBlur={(e) => {
                          if (e.target.value) {
                            handleAddApiKey(selectedClient.id, 'anthropic', e.target.value)
                          }
                        }}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="groq-key">Groq API Key</Label>
                      <Input
                        id="groq-key"
                        placeholder="gsk_..."
                        defaultValue={selectedClient.apiKeys.groq || ''}
                        onBlur={(e) => {
                          if (e.target.value) {
                            handleAddApiKey(selectedClient.id, 'groq', e.target.value)
                          }
                        }}
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setSelectedClient(null)}>
                        Cancelar
                      </Button>
                      <Button onClick={() => setSelectedClient(null)}>
                        Salvar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai-config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Globais de IA</CardTitle>
                <CardDescription>
                  Configurações que se aplicam a todo o sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Modelo Padrão</Label>
                    <Select defaultValue="gpt-4">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3">Claude 3</SelectItem>
                        <SelectItem value="llama-70b">Llama 70B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Limite de Tokens por Usuário</Label>
                    <Input type="number" defaultValue="100000" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Funcionalidades Globais</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Análise de Sentimento</div>
                        <div className="text-sm text-gray-600">Ativar análise automática de sentimento</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Sugestões Inteligentes</div>
                        <div className="text-sm text-gray-600">Ativar sugestões contextuais da IA</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Moderação de Conteúdo</div>
                        <div className="text-sm text-gray-600">Filtrar conteúdo inadequado automaticamente</div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total de Clientes</p>
                      <p className="text-2xl font-bold">{clients.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Receita Mensal</p>
                      <p className="text-2xl font-bold">R$ {clients.reduce((acc, client) => acc + client.usage.cost, 0).toFixed(2)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Tokens Processados</p>
                      <p className="text-2xl font-bold">{clients.reduce((acc, client) => acc + client.usage.tokens, 0).toLocaleString()}</p>
                    </div>
                    <Activity className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Uptime</p>
                      <p className="text-2xl font-bold">99.9%</p>
                    </div>
                    <Zap className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Uso por Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-gray-600">{client.usage.tokens.toLocaleString()} tokens</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">R$ {client.usage.cost.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">{client.plan}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>API OpenAI</span>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>WhatsApp Integration</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Conectando</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Database</span>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Evolution API</span>
                      <Badge className="bg-red-100 text-red-800">Offline</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Webhook Service</span>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Analytics</span>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Modo de Manutenção</div>
                    <div className="text-sm text-gray-600">Desabilitar acesso temporariamente</div>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Logs Detalhados</div>
                    <div className="text-sm text-gray-600">Ativar logging completo do sistema</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Backup Automático</div>
                    <div className="text-sm text-gray-600">Backup diário dos dados</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
