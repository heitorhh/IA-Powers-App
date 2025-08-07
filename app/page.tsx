"use client"

import { useState, useEffect } from "react"
import SimpleUserInterface from "./components/simple-user-interface"
import LeaderInterface from "./components/leader-interface"
import MasterControlPanel from "./components/master-control-panel"
import ThreeColumnWorkspace from "./components/three-column-workspace"

// Mock users for demo
const mockUsers = {
  simple: {
    id: "1",
    name: "Ana Silva",
    email: "ana.silva@empresa.com",
    role: "simple" as const,
    position: "Analista de Marketing",
    department: "Marketing",
    discProfile: "I" as const,
    secretaryName: "Sofia",
    avatar: "/placeholder.svg?height=40&width=40",
    preferences: {
      communicationStyle: "friendly",
      workingHours: "09:00-18:00",
      timezone: "America/Sao_Paulo",
    },
    stats: {
      tasksCompleted: 47,
      avgResponseTime: "2.3h",
      satisfactionScore: 4.2,
      collaborations: 23,
    },
  },
  leader: {
    id: "2",
    name: "Carlos Mendes",
    email: "carlos.mendes@empresa.com",
    role: "leader" as const,
    position: "Gerente de Vendas",
    department: "Comercial",
    discProfile: "D" as const,
    secretaryName: "Helena",
    avatar: "/placeholder.svg?height=40&width=40",
    teamSize: 8,
    preferences: {
      communicationStyle: "direct",
      workingHours: "08:00-19:00",
      timezone: "America/Sao_Paulo",
    },
    stats: {
      teamPerformance: 87,
      tasksCompleted: 156,
      avgResponseTime: "1.1h",
      satisfactionScore: 4.5,
      teamSatisfaction: 4.1,
    },
  },
  master: {
    id: "3",
    name: "Maria Santos",
    email: "maria.santos@empresa.com",
    role: "master" as const,
    position: "CEO",
    department: "Diretoria",
    discProfile: "C" as const,
    secretaryName: "Valentina",
    avatar: "/placeholder.svg?height=40&width=40",
    organizationSize: 150,
    preferences: {
      communicationStyle: "analytical",
      workingHours: "07:00-20:00",
      timezone: "America/Sao_Paulo",
    },
    stats: {
      organizationHealth: 92,
      tasksCompleted: 234,
      avgResponseTime: "0.8h",
      satisfactionScore: 4.7,
      leadershipScore: 4.6,
    },
  },
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"default" | "workspace">("default")

  useEffect(() => {
    // For demo purposes, default to simple user
    const defaultUser = mockUsers.simple
    setUser(defaultUser)
    setLoading(false)
  }, [])

  // Demo function to switch user types
  const switchUserType = (type: "simple" | "leader" | "master") => {
    const newUser = mockUsers[type]
    setUser(newUser)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Demo switcher
  const DemoSwitcher = () => (
    <div className="fixed top-4 right-4 z-50 bg-white p-2 rounded-lg shadow-lg border">
      <div className="text-xs text-gray-600 mb-2">Demo - Switch User Type:</div>
      <div className="flex space-x-1">
        <button
          onClick={() => switchUserType("simple")}
          className={`px-2 py-1 text-xs rounded ${user.role === "simple" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
        >
          Simple
        </button>
        <button
          onClick={() => switchUserType("leader")}
          className={`px-2 py-1 text-xs rounded ${user.role === "leader" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
        >
          Leader
        </button>
        <button
          onClick={() => switchUserType("master")}
          className={`px-2 py-1 text-xs rounded ${user.role === "master" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
        >
          Master
        </button>
      </div>
      <div className="mt-2 pt-2 border-t">
        <button
          onClick={() => setViewMode(viewMode === "workspace" ? "default" : "workspace")}
          className={`px-2 py-1 text-xs rounded w-full ${viewMode === "workspace" ? "bg-green-500 text-white" : "bg-gray-100"}`}
        >
          {viewMode === "workspace" ? "Interface Padrão" : "Workspace 3 Colunas"}
        </button>
      </div>
    </div>
  )

  // Render interface based on user role
  return (
    <>
      <DemoSwitcher />
      {viewMode === "workspace" ? (
        <ThreeColumnWorkspace user={user} />
      ) : (
        <>
          {user.role === "simple" && <SimpleUserInterface />}
          {user.role === "leader" && <LeaderInterface userProfile={user} />}
          {user.role === "master" && <MasterControlPanel />}
        </>
      )}
    </>
  )
}
