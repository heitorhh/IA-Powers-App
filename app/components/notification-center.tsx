'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, Settings, Trash2, Check, CheckCheck, MessageSquare, CheckSquare, Calendar, Cog, Clock, Volume2, VolumeX, Smartphone } from 'lucide-react'
import { useNotifications } from '@/hooks/use-notifications'

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const {
    notifications,
    settings,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    updateSettings,
    requestPermission,
    permission
  } = useNotifications()

  const [activeTab, setActiveTab] = useState('notifications')

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'whatsapp': return <MessageSquare className="h-4 w-4 text-green-600" />
      case 'tasks': return <CheckSquare className="h-4 w-4 text-blue-600" />
      case 'meetings': return <Calendar className="h-4 w-4 text-purple-600" />
      case 'system': return <Cog className="h-4 w-4 text-gray-600" />
      case 'reminder': return <Clock className="h-4 w-4 text-orange-600" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50'
      case 'low': return 'border-l-green-500 bg-green-50'
      default: return 'border-l-gray-300'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d atrás`
    if (hours > 0) return `${hours}h atrás`
    if (minutes > 0) return `${minutes}min atrás`
    return 'Agora'
  }

  const handlePermissionRequest = async () => {
    await requestPermission()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Central de Notificações
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications">
              Notificações
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-1" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="mt-4">
            <div className="space-y-4">
              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    <CheckCheck className="h-4 w-4 mr-1" />
                    Marcar todas como lidas
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllNotifications}
                    disabled={notifications.length === 0}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Limpar todas
                  </Button>
                </div>
              </div>

              {/* Notifications List */}
              <ScrollArea className="h-[400px]">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma notificação</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <Card 
                        key={notification.id} 
                        className={`border-l-4 ${getPriorityColor(notification.priority)} ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className={`font-medium text-sm ${
                                    !notification.read ? 'font-semibold' : ''
                                  }`}>
                                    {notification.title}
                                  </h4>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {notification.type}
                                  </Badge>
                                  <Badge 
                                    variant={
                                      notification.priority === 'high' ? 'destructive' :
                                      notification.priority === 'medium' ? 'default' :
                                      'secondary'
                                    }
                                    className="text-xs"
                                  >
                                    {notification.priority}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {formatTime(notification.timestamp)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1 ml-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeNotification(notification.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-6">
                {/* Permission Status */}
                {permission !== 'granted' && (
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-yellow-800">
                            Permissão de Notificações
                          </h4>
                          <p className="text-sm text-yellow-700">
                            Permita notificações para receber alertas importantes
                          </p>
                        </div>
                        <Button onClick={handlePermissionRequest}>
                          Permitir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* General Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Configurações Gerais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notifications-enabled">Notificações Ativadas</Label>
                        <p className="text-sm text-gray-500">
                          Ativar/desativar todas as notificações
                        </p>
                      </div>
                      <Switch
                        id="notifications-enabled"
                        checked={settings.enabled}
                        onCheckedChange={(checked) => 
                          updateSettings({ enabled: checked })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {settings.sound ? (
                          <Volume2 className="h-4 w-4" />
                        ) : (
                          <VolumeX className="h-4 w-4" />
                        )}
                        <div>
                          <Label htmlFor="sound-enabled">Som</Label>
                          <p className="text-sm text-gray-500">
                            Reproduzir som nas notificações
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="sound-enabled"
                        checked={settings.sound}
                        onCheckedChange={(checked) => 
                          updateSettings({ sound: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        <div>
                          <Label htmlFor="vibration-enabled">Vibração</Label>
                          <p className="text-sm text-gray-500">
                            Vibrar dispositivo nas notificações
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="vibration-enabled"
                        checked={settings.vibration}
                        onCheckedChange={(checked) => 
                          updateSettings({ vibration: checked })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Quiet Hours */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Horário Silencioso
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="quiet-hours-enabled">Ativar Horário Silencioso</Label>
                        <p className="text-sm text-gray-500">
                          Silenciar notificações em horários específicos
                        </p>
                      </div>
                      <Switch
                        id="quiet-hours-enabled"
                        checked={settings.quietHours.enabled}
                        onCheckedChange={(checked) => 
                          updateSettings({ 
                            quietHours: { ...settings.quietHours, enabled: checked }
                          })
                        }
                      />
                    </div>

                    {settings.quietHours.enabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="quiet-start">Início</Label>
                          <input
                            id="quiet-start"
                            type="time"
                            value={settings.quietHours.start}
                            onChange={(e) => 
                              updateSettings({
                                quietHours: { 
                                  ...settings.quietHours, 
                                  start: e.target.value 
                                }
                              })
                            }
                            className="w-full mt-1 px-3 py-2 border rounded-md"
                          />
                        </div>
                        <div>
                          <Label htmlFor="quiet-end">Fim</Label>
                          <input
                            id="quiet-end"
                            type="time"
                            value={settings.quietHours.end}
                            onChange={(e) => 
                              updateSettings({
                                quietHours: { 
                                  ...settings.quietHours, 
                                  end: e.target.value 
                                }
                              })
                            }
                            className="w-full mt-1 px-3 py-2 border rounded-md"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Notification Types */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Tipos de Notificação</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(settings.types).map(([type, enabled]) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getNotificationIcon(type)}
                          <div>
                            <Label htmlFor={`type-${type}`} className="capitalize">
                              {type === 'whatsapp' ? 'WhatsApp' :
                               type === 'tasks' ? 'Tarefas' :
                               type === 'meetings' ? 'Reuniões' :
                               type === 'system' ? 'Sistema' :
                               type === 'reminder' ? 'Lembretes' : type}
                            </Label>
                          </div>
                        </div>
                        <Switch
                          id={`type-${type}`}
                          checked={enabled}
                          onCheckedChange={(checked) => 
                            updateSettings({ 
                              types: { ...settings.types, [type]: checked }
                            })
                          }
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
