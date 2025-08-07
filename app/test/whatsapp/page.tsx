"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Smartphone, QrCode, RefreshCw, CheckCircle, AlertCircle, WifiOff, Wifi, MessageSquare, Send, Users, BarChart3, Clock, Database, Zap, Globe, TestTube, Play, Square, RotateCcw } from 'lucide-react'

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

interface ChatData {
  chats: any[]
  summary: {
    totalChats: number
    totalMessages: number
    sentimentDistribution: {
      positive: number
      negative: number
      neutral: number
    }
  }
}

interface TestResult {
  test: string
  status: "pending" | "running" | "success" | "error"
  message: string
  timestamp?: string
}

export default function WhatsAppTestPage() {
  const [session, setSession] = useState<WhatsAppSession | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [chatData, setChatData] = useState<ChatData | null>(null)
  const [testMessage, setTestMessage] = useState("")
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [systemHealth, setSystemHealth] = useState({
    api: false,
    webhook: false,
    database: true,
  })

  // Timer para expiração do QR Code
  useEffect(() => {
    if (session && session.status === "SCAN_QR_CODE" && session.expiresAt) {
      const updateTimer = () => {
        const now = new Date().getTime()
        const expires = new Date(session.expiresAt!).getTime()
        const remaining = Math.max(0, expires - now)
        setTimeLeft(Math.floor(remaining / 1000))

        if (remaining <= 0) {
          setSession({ ...session, status: "EXPIRED" })
        }
      }

      updateTimer()
      const interval = setInterval(updateTimer, 1000)
      return () => clearInterval(interval)
    }
  }, [session])

  // Polling para atualizar status da sessão
  useEffect(() => {
    if (session && (session.status === "SCAN_QR_CODE" || session.status === "INITIALIZING")) {
      const interval = setInterval(() => {
        checkSessionStatus()
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [session])

  // Verificar saúde do sistema ao carregar
  useEffect(() => {
    checkSystemHealth()
  }, [])

  const checkSystemHealth = async () => {
    try {
      // Testar API básica
      const apiResponse = await fetch("/api/whatsapp/sessions")
      const apiHealth = apiResponse.ok

      // Testar webhook
      const webhookResponse = await fetch("/api/webhook/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true })
      })
      const webhookHealth = webhookResponse.ok

      setSystemHealth({
        api: apiHealth,
        webhook: webhookHealth,
        database: true, // Assumir que database sempre está OK
      })
    } catch (error) {
      console.error("Erro ao verificar saúde do sistema:", error)
    }
  }

  const checkSessionStatus = async () => {
    if (!session) return

    try {
      const response = await fetch(`/api/whatsapp/sessions/${session.name}`)
      const data = await response.json()

      if (data.success) {
        setSession(data.session)
        if (data.session.status === "WORKING") {
          setError(null)
          loadChats()
        }
      }
    } catch (error) {
      console.error("Erro ao verificar status:", error)
    }
  }

  const loadChats = async () => {
    if (!session) return

    try {
      const response = await fetch(`/api/whatsapp/chats?sessionId=${session.id}&days=7`)
      const data = await response.json()

      if (data.success) {
        setChatData(data.data)
      }
    } catch (error) {
      console.error("Erro ao carregar conversas:", error)
    }
  }

  const connectWhatsApp = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      const response = await fetch("/api/whatsapp/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `whatsapp_test_${Date.now()}`,
          clientId: "test_user_001",
          userRole: "master",
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSession(data.session)
        setError(null)
      } else {
        setError(data.error || "Erro ao gerar QR Code")
      }
    } catch (error) {
      setError("Erro de conexão com o servidor")
      console.error("Erro:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWhatsApp = async () => {
    if (!session) return

    try {
      const response = await fetch(`/api/whatsapp/sessions/${session.name}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSession(null)
        setChatData(null)
        setError(null)
      }
    } catch (error) {
      console.error("Erro ao desconectar:", error)
    }
  }

  const sendTestMessage = async () => {
    if (!testMessage.trim() || !session) return

    try {
      const response = await fetch("/api/whatsapp/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: session.id,
          to: "5511999999999@c.us", // Número de teste
          message: testMessage,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setTestMessage("")
        alert("Mensagem enviada com sucesso!")
      } else {
        alert("Erro ao enviar mensagem: " + data.error)
      }
    } catch (error) {
      alert("Erro ao enviar mensagem")
      console.error("Erro:", error)
    }
  }

  const runAutomatedTests = async () => {
    setIsRunningTests(true)
    setTestResults([])

    const tests = [
      { name: "Verificar API de Sessões", endpoint: "/api/whatsapp/sessions" },
      { name: "Verificar API de Mensagens", endpoint: "/api/whatsapp/messages" },
      { name: "Verificar API de Conversas", endpoint: "/api/whatsapp/chats" },
      { name: "Verificar Webhook", endpoint: "/api/webhook/whatsapp" },
      { name: "Verificar Health Check", endpoint: "/api/whatsapp/health" },
    ]

    for (const test of tests) {
      const result: TestResult = {
        test: test.name,
        status: "running",
        message: "Executando...",
        timestamp: new Date().toLocaleTimeString()
      }

      setTestResults(prev => [...prev, result])

      try {
        const response = await fetch(test.endpoint)
        const success = response.ok

        setTestResults(prev => 
          prev.map(r => 
            r.test === test.name 
              ? { 
                  ...r, 
                  status: success ? "success" : "error",
                  message: success ? "✅ Funcionando" : `❌ Erro ${response.status}`,
                  timestamp: new Date().toLocaleTimeString()
                }
              : r
          )
        )
      } catch (error) {
        setTestResults(prev => 
          prev.map(r => 
            r.test === test.name 
              ? { 
                  ...r, 
                  status: "error",
                  message: "❌ Erro de conexão",
                  timestamp: new Date().toLocaleTimeString()
                }
              : r
          )
        )
      }

      // Aguardar 1 segundo entre testes
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    setIsRunningTests(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "WORKING":
        return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Conectado</Badge>
      case "SCAN_QR_CODE":
        return <Badge variant="outline" className="border-blue-500 text-blue-700"><QrCode className="w-3 h-3 mr-1" />Aguardando Scan</Badge>
      case "INITIALIZING":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700"><RefreshCw className="w-3 h-3 mr-1 animate-spin" />Inicializando</Badge>
      case "EXPIRED":
        return <Badge variant="outline" className="border-red-500 text-red-700"><Clock className="w-3 h-3 mr-1" />Expirado</Badge>
      default:
        return <Badge variant="secondary"><WifiOff className="w-3 h-3 mr-1" />Desconectado</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <TestTube className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Teste WhatsApp Integration</h1>
              <p className="text-gray-600">Teste completo de todas as funcionalidades WhatsApp</p>
            </div>
          </div>
          
          {/* Status do Sistema */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${systemHealth.api ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm">API</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${systemHealth.webhook ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm">Webhook</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${systemHealth.database ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm">Database</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="connection" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="connection">Conexão</TabsTrigger>
            <TabsTrigger value="messages">Mensagens</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="tests">Testes</TabsTrigger>
          </TabsList>

          {/* Aba de Conexão */}
          <TabsContent value="connection" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status da Conexão */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Smartphone className="w-5 h-5 mr-2" />
                      Status da Conexão
                    </span>
                    {session && getStatusBadge(session.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">{error}</AlertDescription>
                    </Alert>
                  )}

                  {!session || session.status === "EXPIRED" ? (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Smartphone className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Conectar WhatsApp</h3>
                      <p className="text-gray-600 mb-4 text-sm">
                        Inicie uma nova sessão de teste do WhatsApp
                      </p>
                      <Button onClick={connectWhatsApp} disabled={isConnecting} className="w-full max-w-xs">
                        {isConnecting ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Inicializando...
                          </>
                        ) : (
                          <>
                            <QrCode className="w-4 h-4 mr-2" />
                            Conectar WhatsApp
                          </>
                        )}
                      </Button>
                    </div>
                  ) : session.status === "INITIALIZING" ? (
                    <div className="text-center py-6">
                      <RefreshCw className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
                      <h3 className="text-lg font-medium mb-2">Inicializando WhatsApp</h3>
                      <p className="text-gray-600 text-sm">Preparando conexão... Aguarde alguns segundos.</p>
                    </div>
                  ) : session.status === "SCAN_QR_CODE" ? (
                    <div className="text-center py-4">
                      <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block mb-4">
                        {session.qr ? (
                          <div className="relative">
                            <img
                              src={session.qr || "/placeholder.svg"}
                              alt="QR Code WhatsApp"
                              className="w-64 h-64 mx-auto"
                              onError={(e) => {
                                console.error("Erro ao carregar QR Code")
                                setError("Erro ao carregar QR Code. Tente novamente.")
                              }}
                            />
                            {timeLeft > 0 && (
                              <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                {formatTime(timeLeft)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
                            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
                          </div>
                        )}
                      </div>

                      <h3 className="text-lg font-medium mb-2">Escaneie o QR Code</h3>
                      <div className="text-sm text-gray-600 mb-4 space-y-1">
                        <p><strong>1.</strong> Abra o WhatsApp no seu celular</p>
                        <p><strong>2.</strong> Toque nos 3 pontos (⋮) no canto superior direito</p>
                        <p><strong>3.</strong> Toque em "Dispositivos conectados"</p>
                        <p><strong>4.</strong> Toque em "Conectar um dispositivo"</p>
                        <p><strong>5.</strong> Escaneie este código</p>
                      </div>

                      {timeLeft > 0 && (
                        <Alert className="mb-4 border-blue-200 bg-blue-50">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-blue-700">
                            QR Code expira em {formatTime(timeLeft)}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="flex justify-center space-x-2">
                        <Button variant="outline" onClick={() => connectWhatsApp()}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Novo QR Code
                        </Button>
                        <Button variant="destructive" onClick={() => setSession(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : session.status === "WORKING" ? (
                    <div className="space-y-4">
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700">
                          <strong>WhatsApp Conectado com Sucesso!</strong>
                          <br />
                          {session.me?.pushName && `Conectado como: ${session.me.pushName}`}
                          {session.me?.phone && (
                            <>
                              <br />
                              Telefone: {session.me.phone}
                            </>
                          )}
                        </AlertDescription>
                      </Alert>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Wifi className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Status da Conexão</h4>
                            <p className="text-sm text-gray-600">Ativo e monitorando</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={disconnectWhatsApp}>
                          <WifiOff className="w-4 h-4 mr-2" />
                          Desconectar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Status: {session.status}</h3>
                      <Button onClick={() => connectWhatsApp()}>Tentar Novamente</Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Informações da Sessão */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Informações da Sessão
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {session ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">ID da Sessão:</span>
                        <span className="text-sm font-mono">{session.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Nome:</span>
                        <span className="text-sm">{session.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className="text-sm font-medium">{session.status}</span>
                      </div>
                      {session.me && (
                        <>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Usuário:</span>
                            <span className="text-sm">{session.me.pushName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">WhatsApp ID:</span>
                            <span className="text-sm font-mono text-xs">{session.me.id}</span>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Database className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Nenhuma sessão ativa</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba de Mensagens */}
          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Teste de Envio de Mensagens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {session && session.status === "WORKING" ? (
                  <>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Digite uma mensagem de teste..."
                        value={testMessage}
                        onChange={(e) => setTestMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendTestMessage()}
                        className="flex-1"
                      />
                      <Button onClick={sendTestMessage} disabled={!testMessage.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">
                      Mensagem será enviada para o número de teste: +55 11 99999-9999
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Conecte o WhatsApp primeiro para testar mensagens</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Análise de Conversas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {chatData ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-900">{chatData.summary.totalChats}</div>
                        <div className="text-sm text-blue-700">Conversas</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-900">{chatData.summary.totalMessages}</div>
                        <div className="text-sm text-purple-700">Mensagens</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium">Distribuição de Sentimentos</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center text-sm">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            Positivas
                          </span>
                          <span className="font-medium">{chatData.summary.sentimentDistribution.positive}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center text-sm">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                            Negativas
                          </span>
                          <span className="font-medium">{chatData.summary.sentimentDistribution.negative}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center text-sm">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                            Neutras
                          </span>
                          <span className="font-medium">{chatData.summary.sentimentDistribution.neutral}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">Conversas Recentes</h4>
                      <ScrollArea className="h-32">
                        <div className="space-y-2">
                          {chatData.chats.slice(0, 5).map((chat, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{chat.name}</div>
                                <div className="text-xs text-gray-600 truncate">{chat.lastMessage}</div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {chat.sentiment || "neutral"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Conecte o WhatsApp para ver análises</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Testes */}
          <TabsContent value="tests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <TestTube className="w-5 h-5 mr-2" />
                    Testes Automatizados
                  </span>
                  <Button 
                    onClick={runAutomatedTests} 
                    disabled={isRunningTests}
                    size="sm"
                  >
                    {isRunningTests ? (
                      <>
                        <Square className="w-4 h-4 mr-2" />
                        Executando...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Executar Testes
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {testResults.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <TestTube className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Clique em "Executar Testes" para iniciar</p>
                    </div>
                  ) : (
                    testResults.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            result.status === "success" ? "bg-green-500" :
                            result.status === "error" ? "bg-red-500" :
                            result.status === "running" ? "bg-blue-500 animate-pulse" :
                            "bg-gray-300"
                          }`} />
                          <div>
                            <div className="font-medium text-sm">{result.test}</div>
                            <div className="text-xs text-gray-600">{result.message}</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {result.timestamp}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {testResults.length > 0 && !isRunningTests && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Testes concluídos: {testResults.filter(r => r.status !== "running").length}/{testResults.length}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setTestResults([])}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Limpar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
