"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Users, Smile, Frown, Meh } from "lucide-react"
import type { User } from "@/types/user"
import ThreeColumnWorkspace from "./three-column-workspace"

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
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Painel do Líder</h1>
                <p className="text-xs text-gray-500">Helena está aqui para ajudar sua liderança</p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800" variant="outline">
              Líder - Equipe Ativa
            </Badge>
          </div>
        </div>
      </header>

      <ThreeColumnWorkspace userRole="leader" userProfile={userProfile} />
    </div>
  )
}
