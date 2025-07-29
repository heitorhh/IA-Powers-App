"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, Send, Bot, User, Globe, Brain, Zap, RefreshCw, Copy, ThumbsUp, ThumbsDown } from "lucide-react"
import type { ChatMessage } from "@/types/user"

interface AIChatProps {
  userRole: "simple" | "leader" | "master"
  clientId: string
  hasInternetAccess?: boolean
  availableModels?: string[]
}

export default function AIChat({ userRole, clientId, hasInternetAccess = false, availableModels = [] }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Olá! Sou sua assistente IA. Como posso ajudá-lo hoje? Posso responder perguntas, fazer análises, pesquisar na internet e muito mais!",
      timestamp: new Date().toISOString(),
      model: "gpt-4",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState("gpt-4")
  const [tokenCount, setTokenCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simular resposta da IA
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateAIResponse(inputMessage),
        timestamp: new Date().toISOString(),
        tokens: Math.floor(Math.random() * 500) + 100,
        model: selectedModel,
      }

      setMessages((prev) => [...prev, aiResponse])
      setTokenCount((prev) => prev + (aiResponse.tokens || 0))
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("whatsapp")) {
      return "📱 Sobre WhatsApp: Posso ajudá-lo a configurar e monitorar suas conexões WhatsApp. Você pode conectar múltiplos dispositivos, analisar sentimentos das mensagens e receber alertas automáticos. Gostaria de saber mais sobre alguma funcionalidade específica?"
    }

    if (lowerInput.includes("relatório") || lowerInput.includes("report")) {
      return "📊 Para relatórios: Posso gerar análises detalhadas sobre:\n\n• Sentimentos da equipe\n• Produtividade individual\n• Métricas de comunicação\n• Insights de perfil DISC\n• Tendências temporais\n\nQual tipo de relatório você precisa?"
    }

    if (lowerInput.includes("disc") || lowerInput.includes("perfil")) {
      return "🎯 Análise DISC: Baseado nas interações, posso identificar perfis comportamentais:\n\n• **D** (Dominante): Direto, orientado a resultados\n• **I** (Influente): Comunicativo, otimista\n• **S** (Estável): Colaborativo, paciente\n• **C** (Consciente): Analítico, preciso\n\nQuer que eu analise o perfil de alguém específico?"
    }

    if (lowerInput.includes("pesquisar") || lowerInput.includes("buscar") || lowerInput.includes("internet")) {
      if (hasInternetAccess) {
        return "🌐 Pesquisa na Internet: Posso buscar informações atualizadas sobre qualquer tópico. Tenho acesso a:\n\n• Notícias recentes\n• Dados de mercado\n• Informações técnicas\n• Tendências do setor\n\nSobre o que gostaria que eu pesquise?"
      } else {
        return "🚫 Acesso à internet não está disponível no seu plano atual. Entre em contato com o administrador para ativar esta funcionalidade."
      }
    }

    if (lowerInput.includes("clima") || lowerInput.includes("sentimento")) {
      return "😊 Análise de Clima: Monitoro constantemente o sentimento da equipe através das comunicações. Posso identificar:\n\n• Níveis de estresse\n• Satisfação geral\n• Pontos de atenção\n• Tendências de humor\n\nGostaria de ver uma análise específica?"
    }

    // Resposta padrão baseada no papel do usuário
    if (userRole === "simple") {
      return "Como sua assistente pessoal, posso ajudá-lo com tarefas, sugestões de produtividade, análise de comunicação e dicas baseadas no seu perfil DISC. O que você gostaria de fazer hoje?"
    }

    if (userRole === "leader") {
      return "Como líder, posso ajudá-lo a gerenciar sua equipe de forma mais eficaz. Posso analisar o clima da equipe, sugerir estratégias de comunicação baseadas nos perfis DISC dos membros, e fornecer insights sobre produtividade. Como posso apoiar sua liderança hoje?"
    }

    return "Como administrador master, tenho acesso completo a todas as funcionalidades. Posso ajudá-lo com configurações do sistema, análises avançadas, relatórios personalizados e gestão de clientes. Qual aspecto do sistema você gostaria de explorar?"
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Chat com IA</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              {hasInternetAccess && (
                <Badge variant="outline" className="text-green-600">
                  <Globe className="h-3 w-3 mr-1" />
                  Internet
                </Badge>
              )}
              <Badge variant="outline">
                <Zap className="h-3 w-3 mr-1" />
                {tokenCount} tokens
              </Badge>
            </div>
          </div>

          {availableModels.length > 0 && (
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Modelo:</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                {availableModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          )}
        </CardHeader>

        <Separator />

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900 border"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0 mt-1">
                        {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                        <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                          <span>{new Date(message.timestamp).toLocaleTimeString("pt-BR")}</span>
                          <div className="flex items-center space-x-2">
                            {message.tokens && (
                              <span className="flex items-center space-x-1">
                                <Brain className="h-3 w-3" />
                                <span>{message.tokens}</span>
                              </span>
                            )}
                            {message.model && (
                              <Badge variant="outline" className="text-xs">
                                {message.model}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {message.role === "assistant" && (
                          <div className="flex items-center space-x-2 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyMessage(message.content)}
                              className="h-6 px-2 text-xs"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 border">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          <Separator />

          <div className="p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <div className="text-xs text-gray-500 mt-2">Pressione Enter para enviar, Shift+Enter para nova linha</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
