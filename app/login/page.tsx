"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain, User, Users, Crown } from "lucide-react"

const userTypes = [
  {
    type: "simple",
    name: "Usuário Simples",
    description: "Acesso a tarefas e sugestões da IA",
    icon: User,
    mockUser: {
      id: "1",
      name: "Ana Silva",
      email: "ana.silva@empresa.com",
      role: "simple",
      position: "Analista de Marketing",
      department: "Marketing",
      discProfile: "I",
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
  },
  {
    type: "leader",
    name: "Líder",
    description: "Gerenciamento de equipe e dashboards",
    icon: Users,
    mockUser: {
      id: "2",
      name: "Carlos Mendes",
      email: "carlos.mendes@empresa.com",
      role: "leader",
      position: "Gerente de Vendas",
      department: "Comercial",
      discProfile: "D",
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
  },
  {
    type: "master",
    name: "Master",
    description: "Controle total do sistema e configurações",
    icon: Crown,
    mockUser: {
      id: "3",
      name: "Maria Santos",
      email: "maria.santos@empresa.com",
      role: "master",
      position: "CEO",
      department: "Diretoria",
      discProfile: "C",
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
  },
]

export default function LoginPage() {
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (userType: string) => {
    setLoading(true)

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const selectedType = userTypes.find((type) => type.type === userType)
    if (selectedType) {
      localStorage.setItem("user", JSON.stringify(selectedType.mockUser))
      router.push("/")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">IA Powers</h1>
              <p className="text-gray-600">AI Companion System</p>
            </div>
          </div>
          <p className="text-lg text-gray-700">Escolha seu tipo de acesso</p>
        </div>

        {/* User Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {userTypes.map((userType) => {
            const IconComponent = userType.icon
            return (
              <Card
                key={userType.type}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedUserType === userType.type ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedUserType(userType.type)}
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-3">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        userType.type === "simple"
                          ? "bg-green-100"
                          : userType.type === "leader"
                            ? "bg-blue-100"
                            : "bg-purple-100"
                      }`}
                    >
                      <IconComponent
                        className={`h-8 w-8 ${
                          userType.type === "simple"
                            ? "text-green-600"
                            : userType.type === "leader"
                              ? "text-blue-600"
                              : "text-purple-600"
                        }`}
                      />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{userType.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600 mb-4">{userType.description}</p>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleLogin(userType.type)
                    }}
                    disabled={loading}
                    className="w-full"
                    variant={selectedUserType === userType.type ? "default" : "outline"}
                  >
                    {loading ? "Entrando..." : "Entrar como " + userType.name}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Traditional Login Form (Optional) */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Login Tradicional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button onClick={() => handleLogin("simple")} disabled={loading || !email || !password} className="w-full">
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
