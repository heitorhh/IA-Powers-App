"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Bell, BellOff, Settings, MessageSquare, CheckCircle, Clock, AlertTriangle, Trash2, BookMarkedIcon as MarkAsRead, Volume2, VolumeX, Smartphone, Moon, Check, X } from 'lucide-react'
import { useNotifications, type NotificationData } from '@/hooks/use-notifications'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface NotificationCenterProps {
  userId?: string
}

export default function NotificationCenter({ userId = 'user_1' }: NotificationCenterProps) {
  const {
    notifications,
    settings,
    permission,
    isSupported,
    unreadCount,
    updateSettings,
    requestPermission,
    registerServiceWorker,
    showNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  } = useNotifications()

  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('notifications')

  // Initialize service worker on mount
  useEffect(() => {
    if (isSupported) {
      registerServiceWorker()
    }
  }, [isSupported, registerServiceWorker])

  // Test notification function
  const sendTestNotification = async () => {
    await showNotification({
      title: 'Notificação de Teste',
      body: 'Esta é uma notificação de teste do sistema IA Powers!',
      type: 'system',
      priority: 'medium'
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-4 h-4 text-blue-600" />
      case 'task':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'reminder':
        return <Clock className="w-4 h-4 text-orange-600" />
      case 'system':
        return <AlertTriangle className="w-4 h-4 text-purple-600" />
      default:
        return <Bell className="w-4 h-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500'
      case 'medium':
        return 'border-l-yellow-500'
      case 'low':
        return 'border-l-green-500'
      default:
        return 'border-l-gray-300'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'message':
        return 'Mensagem'
      case 'task':
        return 'Tarefa'
      case 'reminder':
        return 'Lembrete'
      case 'system':
        return 'Sistema'
      default:
        return 'Notificação'
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        {settings.enabled ? (
          <Bell className="w-5 h-5" />
        ) : (
          <BellOff className="w-5 h-5 text-gray-400" />
        )}
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between p-4 border-b">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="notifications" className="text-xs">
                  Notificações {unreadCount > 0 && `(${unreadCount})`}
                </TabsTrigger>
                <TabsTrigger value="settings" className="text-xs">
                  <Settings className="w-3 h-3 mr-1" />
                  Configurações
                </TabsTrigger>
              </TabsList>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <TabsContent value="notifications" className="m-0">
              <div className="p-4">
                {/* Actions */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-sm">Notificações</h3>
                  <div className="flex space-x-1">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs"
                      >
                        <MarkAsRead className="w-3 h-3 mr-1" />
                        Marcar todas
                      </Button>
                    )}
                    {notifications.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAll}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Limpar
                      </Button>
                    )}
                  </div>
                </div>

                {/* Notifications List */}
                <ScrollArea className="h-80">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">Nenhuma notificação</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={sendTestNotification}
                        className="mt-2"
                      >
                        Enviar teste
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border rounded-lg border-l-4 ${getPriorityColor(notification.priority)} ${
                            !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-2 flex-1">
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-medium text-sm truncate">
                                    {notification.title}
                                  </h4>
                                  <Badge variant="outline" className="text-xs ml-2">
                                    {getTypeLabel(notification.type)}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">
                                  {notification.body}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(new Date(notification.timestamp), {
                                      addSuffix: true,
                                      locale: ptBR
                                    })}
                                  </span>
                                  <div className="flex space-x-1">
                                    {!notification.read && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => markAsRead(notification.id)}
                                        className="h-6 px-2 text-xs"
                                      >
                                        <Check className="w-3 h-3" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeNotification(notification.id)}
                                      className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="m-0">
              <div className="p-4 space-y-4">
                <h3 className="font-medium text-sm mb-4">Configurações de Notificação</h3>

                {/* Permission Status */}
                {!isSupported ? (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Notificações não são suportadas neste navegador.
                    </AlertDescription>
                  </Alert>
                ) : permission !== 'granted' ? (
                  <Alert>
                    <Bell className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <div className="flex items-center justify-between">
                        <span>Permissão necessária para notificações</span>
                        <Button
                          size="sm"
                          onClick={requestPermission}
                          className="ml-2"
                        >
                          Permitir
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-green-200 bg-green-50">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-xs text-green-700">
                      Notificações ativadas e funcionando!
                    </AlertDescription>
                  </Alert>
                )}

                {/* General Settings */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications-enabled" className="text-sm">
                      Ativar notificações
                    </Label>
                    <Switch
                      id="notifications-enabled"
                      checked={settings.enabled}
                      onCheckedChange={(enabled) => updateSettings({ enabled })}
                    />
                  </div>

                  <Separator />

                  {/* Type Settings */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-700">Tipos de Notificação</Label>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <Label htmlFor="whatsapp" className="text-sm">WhatsApp</Label>
                      </div>
                      <Switch
                        id="whatsapp"
                        checked={settings.whatsapp}
                        onCheckedChange={(whatsapp) => updateSettings({ whatsapp })}
                        disabled={!settings.enabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <Label htmlFor="tasks" className="text-sm">Tarefas</Label>
                      </div>
                      <Switch
                        id="tasks"
                        checked={settings.tasks}
                        onCheckedChange={(tasks) => updateSettings({ tasks })}
                        disabled={!settings.enabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <Label htmlFor="reminders" className="text-sm">Lembretes</Label>
                      </div>
                      <Switch
                        id="reminders"
                        checked={settings.reminders}
                        onCheckedChange={(reminders) => updateSettings({ reminders })}
                        disabled={!settings.enabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-purple-600" />
                        <Label htmlFor="system" className="text-sm">Sistema</Label>
                      </div>
                      <Switch
                        id="system"
                        checked={settings.system}
                        onCheckedChange={(system) => updateSettings({ system })}
                        disabled={!settings.enabled}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Behavior Settings */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-700">Comportamento</Label>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Volume2 className="w-4 h-4" />
                        <Label htmlFor="sound" className="text-sm">Som</Label>
                      </div>
                      <Switch
                        id="sound"
                        checked={settings.sound}
                        onCheckedChange={(sound) => updateSettings({ sound })}
                        disabled={!settings.enabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="w-4 h-4" />
                        <Label htmlFor="vibration" className="text-sm">Vibração</Label>
                      </div>
                      <Switch
                        id="vibration"
                        checked={settings.vibration}
                        onCheckedChange={(vibration) => updateSettings({ vibration })}
                        disabled={!settings.enabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4" />
                        <Label htmlFor="desktop" className="text-sm">Desktop</Label>
                      </div>
                      <Switch
                        id="desktop"
                        checked={settings.desktop}
                        onCheckedChange={(desktop) => updateSettings({ desktop })}
                        disabled={!settings.enabled}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Quiet Hours */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Moon className="w-4 h-4" />
                        <Label htmlFor="quiet-hours" className="text-sm">Horário silencioso</Label>
                      </div>
                      <Switch
                        id="quiet-hours"
                        checked={settings.quietHours.enabled}
                        onCheckedChange={(enabled) => 
                          updateSettings({ 
                            quietHours: { ...settings.quietHours, enabled } 
                          })
                        }
                        disabled={!settings.enabled}
                      />
                    </div>

                    {settings.quietHours.enabled && (
                      <div className="grid grid-cols-2 gap-2 ml-6">
                        <div>
                          <Label htmlFor="quiet-start" className="text-xs">Início</Label>
                          <Input
                            id="quiet-start"
                            type="time"
                            value={settings.quietHours.start}
                            onChange={(e) =>
                              updateSettings({
                                quietHours: { ...settings.quietHours, start: e.target.value }
                              })
                            }
                            className="text-xs"
                          />
                        </div>
                        <div>
                          <Label htmlFor="quiet-end" className="text-xs">Fim</Label>
                          <Input
                            id="quiet-end"
                            type="time"
                            value={settings.quietHours.end}
                            onChange={(e) =>
                              updateSettings({
                                quietHours: { ...settings.quietHours, end: e.target.value }
                              })
                            }
                            className="text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Test Button */}
                <div className="pt-4 border-t">
                  <Button
                    onClick={sendTestNotification}
                    disabled={!settings.enabled}
                    className="w-full"
                    size="sm"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Enviar Notificação de Teste
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
