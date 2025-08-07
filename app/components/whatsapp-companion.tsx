'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Bot, Power, PowerOff, MessageCircle, Sparkles, User, Briefcase, Heart, Settings, Key } from 'lucide-react'
import { COMPANION_PERSONALITIES, type CompanionPersonality } from '@/lib/whatsapp-ai-companion'

interface WhatsAppCompanionProps {
  onStatusChange?: (isActive: boolean) => void
}

export default function WhatsAppCompanion({ onStatusChange }: WhatsAppCompanionProps) {
  const [isActive, setIsActive] = useState(false)
  const [currentPersonality, setCurrentPersonality] = useState<CompanionPersonality | null>(null)
  const [selectedPersonalityId, setSelectedPersonalityId] = useState('luzia')
  const [apiKey, setApiKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [testMessage, setTestMessage] = useState('')
  const [testResponse, setTestResponse] = useState('')

  useEffect(() => {
    checkCompanionStatus()
  }, [])

  const checkCompanionStatus = async () => {
    try {
      const response = await fetch('/api/whatsapp-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status' })
      })
      
      const data = await response.json()
      setIsActive(data.isActive)
      setCurrentPersonality(data.personality)
      
      if (data.personality) {
        setSelectedPersonalityId(data.personality.id)
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error)
    }
  }

  const handleActivate = async () => {
    if (!apiKey.trim()) {
      alert('Por favor, insira sua API key da OpenAI')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/whatsapp-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'activate',
          personalityId: selectedPersonalityId,
          apiKey: apiKey.trim()
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setIsActive(true)
        setCurrentPersonality(data.personality)
        onStatusChange?.(true)
        alert(`Companion ativado! 🎉\n\n"${data.greeting}"`)
      } else {
        alert(`Erro: ${data.error}`)
      }
    } catch (error) {
      console.error('Erro ao ativar companion:', error)
      alert('Erro ao ativar companion')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeactivate = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/whatsapp-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deactivate' })
      })

      const data = await response.json()
      
      if (data.success) {
        setIsActive(false)
        setCurrentPersonality(null)
        onStatusChange?.(false)
        alert('Companion desativado')
      }
    } catch (error) {
      console.error('Erro ao desativar companion:', error)
      alert('Erro ao desativar companion')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePersonality = async () => {
    if (!isActive) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/whatsapp-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change-personality',
          personalityId: selectedPersonalityId
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setCurrentPersonality(data.personality)
        alert('Personalidade alterada com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao alterar personalidade:', error)
      alert('Erro ao alterar personalidade')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestMessage = async () => {
    if (!testMessage.trim() || !isActive) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/whatsapp-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'process-message',
          message: testMessage,
          senderName: 'Teste',
          isGroup: false
        })
      })

      const data = await response.json()
      setTestResponse(data.response || 'Sem resposta')
    } catch (error) {
      console.error('Erro ao testar mensagem:', error)
      setTestResponse('Erro ao processar mensagem')
    } finally {
      setIsLoading(false)
    }
  }

  const getPersonalityIcon = (personalityId: string) => {
    switch (personalityId) {
      case 'luzia': return <Sparkles className="w-4 h-4" />
      case 'professional': return <Briefcase className="w-4 h-4" />
      case 'casual': return <Heart className="w-4 h-4" />
      default: return <Bot className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            WhatsApp AI Companion
            <Badge className={isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
              {isActive ? 'Ativo' : 'Inativo'}
            </Badge>
          </CardTitle>
          <CardDescription>
            Assistente de IA que responde automaticamente no WhatsApp, como a Luzia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentPersonality && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                {getPersonalityIcon(currentPersonality.id)}
                <span className="font-medium">{currentPersonality.name}</span>
              </div>
              <p className="text-sm text-gray-600">{currentPersonality.description}</p>
            </div>
          )}

          <div className="flex gap-2">
            {!isActive ? (
              <Button 
                onClick={handleActivate} 
                disabled={isLoading}
                className="flex-1"
              >
                <Power className="w-4 h-4 mr-2" />
                {isLoading ? 'Ativando...' : 'Ativar Companion'}
              </Button>
            ) : (
              <Button 
                onClick={handleDeactivate} 
                disabled={isLoading}
                variant="destructive"
                className="flex-1"
              >
                <PowerOff className="w-4 h-4 mr-2" />
                {isLoading ? 'Desativando...' : 'Desativar'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* API Key */}
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              OpenAI API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={isActive}
            />
            <p className="text-xs text-gray-500">
              Necessária para gerar respostas inteligentes
            </p>
          </div>

          {/* Personality Selection */}
          <div className="space-y-2">
            <Label>Personalidade</Label>
            <Select 
              value={selectedPersonalityId} 
              onValueChange={setSelectedPersonalityId}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COMPANION_PERSONALITIES.map((personality) => (
                  <SelectItem key={personality.id} value={personality.id}>
                    <div className="flex items-center gap-2">
                      {getPersonalityIcon(personality.id)}
                      <div>
                        <div className="font-medium">{personality.name}</div>
                        <div className="text-xs text-gray-500">{personality.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {isActive && currentPersonality?.id !== selectedPersonalityId && (
              <Button 
                onClick={handleChangePersonality}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                Alterar Personalidade
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Card */}
      {isActive && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Teste de Resposta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Mensagem de Teste</Label>
              <Input
                placeholder="Digite uma mensagem para testar..."
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTestMessage()}
              />
            </div>
            
            <Button 
              onClick={handleTestMessage}
              disabled={isLoading || !testMessage.trim()}
              className="w-full"
            >
              {isLoading ? 'Processando...' : 'Testar Resposta'}
            </Button>

            {testResponse && (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <Label className="text-sm font-medium">Resposta:</Label>
                <p className="text-sm mt-1">{testResponse}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Como Usar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="font-medium text-blue-600">1.</span>
              <span>Insira sua API key da OpenAI</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium text-blue-600">2.</span>
              <span>Escolha uma personalidade (Luzia, Profissional ou Casual)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium text-blue-600">3.</span>
              <span>Ative o Companion</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium text-blue-600">4.</span>
              <span>Conecte seu WhatsApp na aba correspondente</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium text-blue-600">5.</span>
              <span>O Companion responderá automaticamente todas as mensagens!</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="text-xs text-gray-500">
            <p><strong>Dica:</strong> Em grupos, o Companion só responde quando mencionado pelo nome.</p>
            <p><strong>Privacidade:</strong> Todas as conversas ficam no seu servidor, não compartilhamos dados.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
