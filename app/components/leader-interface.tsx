"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  Phone,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Smile,
  Frown,
  Meh,
  Plus,
} from "lucide-react"
import WhatsAppUniversal from "./whatsapp-universal"
import type { User } from "@/types/user"

interface LeaderInterfaceProps {
  userProfile?: User
}

export default function LeaderInterface({ userProfile }: LeaderInterfaceProps) {
  const [contacts, setContacts] = useState([
    { id: "1", name: "Ana Silva", phone: "+5511999999999", department: "Marketing", sentiment: 0.8 },
    { id: "2", name: "João Santos", phone: "+5511888888888", department: "Vendas", sentiment: 0.3 },
    { id: "3", name: "Maria Costa", phone: "+5511777777777", department: "Marketing", sentiment: 0.6 },
  ])

  const [newContact, setNewContact] = useState({ name: "", phone: "", department: "" })

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      setContacts([
        ...contacts,
        {
          id: Date.now().toString(),
          ...newContact,
          sentiment: 0.5,
        },
      ])
      setNewContact({ name: "", phone: "", department: "" })
    }
  }

  const getSentimentIcon = (sentiment: number) => {
    if (sentiment > 0.6) return <Smile className="h-4 w-4 text-green-500" />
    if (sentiment < 0.4) return <Frown className="h-4 w-4 text-red-500" />
    return <Meh className="h-4 w-4 text-yellow-500" />
  }

  const teamStats = {
    totalMembers: contacts.length,
    avgSentiment: contacts.reduce((acc, c) => acc + c.sentiment, 0) / contacts.length,
    tasksCompleted: 47,
    pendingTasks: 12,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Painel do Líder</h1>
                <p className="text-xs text-gray-500">Gerencie sua equipe</p>
              </div>
            </div>

            <Badge className="bg-blue-100 text-blue-800" variant="outline">
              Líder - {teamStats.totalMembers} membros
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{teamStats.totalMembers}</p>
                  <p className="text-sm text-gray-600">Membros da Equipe</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{Math.round(teamStats.avgSentiment * 100)}%</p>
                  <p className="text-sm text-gray-600">Clima da Equipe</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{teamStats.tasksCompleted}</p>
                  <p className="text-sm text-gray-600">Tarefas Concluídas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{teamStats.pendingTasks}</p>
                  <p className="text-sm text-gray-600">Tarefas Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="team" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="team">Equipe</TabsTrigger>
            <TabsTrigger value="contacts">Contatos</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="team">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Membros da Equipe</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {contacts.map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              {contact.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              <p className="text-sm text-gray-600">{contact.department}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getSentimentIcon(contact.sentiment)}
                            <span className="text-sm">{Math.round(contact.sentiment * 100)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Clima da Equipe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {Math.round(teamStats.avgSentiment * 100)}%
                      </div>
                      <p className="text-gray-600">Satisfação Geral</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Muito Positivo</span>
                        <span className="text-sm font-medium">{contacts.filter((c) => c.sentiment > 0.7).length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Neutro</span>
                        <span className="text-sm font-medium">
                          {contacts.filter((c) => c.sentiment >= 0.4 && c.sentiment <= 0.7).length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Precisa Atenção</span>
                        <span className="text-sm font-medium text-red-600">
                          {contacts.filter((c) => c.sentiment < 0.4).length}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contacts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Adicionar Contato</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      placeholder="Nome completo"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      placeholder="+5511999999999"
                    />
                  </div>

                  <div>
                    <Label htmlFor="department">Departamento</Label>
                    <Input
                      id="department"
                      value={newContact.department}
                      onChange={(e) => setNewContact({ ...newContact, department: e.target.value })}
                      placeholder="Ex: Marketing, Vendas"
                    />
                  </div>

                  <Button onClick={addContact} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Contato
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lista de Contatos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {contacts.map((contact) => (
                        <div key={contact.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{contact.name}</h4>
                            {getSentimentIcon(contact.sentiment)}
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center space-x-2">
                              <Phone className="h-3 w-3" />
                              <span>{contact.phone}</span>
                            </div>
                            <p>{contact.department}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="whatsapp">
            <WhatsAppUniversal userRole="leader" clientId="1" canConnect={true} />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Métricas da Equipe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Produtividade</span>
                        <span className="text-sm">87%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "87%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Engajamento</span>
                        <span className="text-sm">72%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "72%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Satisfação</span>
                        <span className="text-sm">{Math.round(teamStats.avgSentiment * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${teamStats.avgSentiment * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alertas e Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-red-800">Atenção Necessária</h4>
                          <p className="text-xs text-red-700">
                            João Santos apresenta baixo sentimento (30%). Considere uma conversa individual.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-green-800">Boa Performance</h4>
                          <p className="text-xs text-green-700">
                            Ana Silva está com excelente engajamento (80%). Continue o bom trabalho!
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-blue-800">Sugestão de Comunicação</h4>
                          <p className="text-xs text-blue-700">
                            Baseado nos perfis DISC, agende reuniões individuais semanais.
                          </p>
                        </div>
                      </div>
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
