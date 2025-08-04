"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Smartphone, MessageCircle, Users, QrCode } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import QRCode from "qrcode"

interface WhatsAppStatus {
  connected: boolean
  qrCode?: string
}

interface Chat {
  id: string
  name: string
  isGroup: boolean
  unreadCount: number
  lastMessage?: any
}

export default function SimpleWhatsAppConnection() {
  const [status, setStatus] = useState<WhatsAppStatus>({ connected: false })
  const [loading, setLoading] = useState(false)
  const [chats, setChats] = useState<Chat[]>([])
  const [qrCodeImage, setQrCodeImage] = useState<string>("")
  const [message, setMessage] = useState("")
  const [selectedChat, setSelectedChat] = useState<string>("")

  useEffect(() => {
    checkStatus()
    const interval = setInterval(checkStatus, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (status.qrCode) {
      generateQRCodeImage(status.qrCode)
    }
  }, [status.qrCode])

  const generateQRCodeImage = async (qrText: string) => {
    try {
      const qrImage = await QRCode.toDataURL(qrText, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
      setQrCodeImage(qrImage)
    } catch (error) {
      console.error("Error generating QR code:", error)
    }
  }

  const checkStatus = async () => {
    try {
      const response = await fetch("/api/whatsapp-simple/connect")
      const data = await response.json()
      setStatus(data)

      if (data.connected) {
        loadChats()
      }
    } catch (error) {
      console.error("Error checking status:", error)
    }
  }

  const connectWhatsApp = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/whatsapp-simple/connect", {
        method: "POST",
      })
      const data = await response.json()

      if (data.success) {
        setMessage("WhatsApp connection initiated. Please scan the QR code.")
      } else {
        setMessage("Failed to connect WhatsApp: " + data.error)
      }
    } catch (error) {
      setMessage("Error connecting WhatsApp: " + error)
    } finally {
      setLoading(false)
    }
  }

  const loadChats = async () => {
    try {
      const response = await fetch("/api/whatsapp-simple/messages")
      const data = await response.json()

      if (data.success) {
        setChats(data.data)
      }
    } catch (error) {
      console.error("Error loading chats:", error)
    }
  }

  const sendMessage = async () => {
    if (!selectedChat || !message.trim()) return

    try {
      const response = await fetch("/api/whatsapp-simple/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: selectedChat,
          message: message.trim(),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage("")
        setMessage("Message sent successfully!")
      } else {
        setMessage("Failed to send message: " + data.error)
      }
    } catch (error) {
      setMessage("Error sending message: " + error)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Simple WhatsApp Connection
          </CardTitle>
          <CardDescription>Connect WhatsApp using whatsapp-web.js (no Docker required)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Status:</span>
              <Badge variant={status.connected ? "default" : "secondary"}>
                {status.connected ? "Connected" : "Disconnected"}
              </Badge>
            </div>

            <Button
              onClick={connectWhatsApp}
              disabled={loading || status.connected}
              className="flex items-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {status.connected ? "Connected" : "Connect WhatsApp"}
            </Button>
          </div>

          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status.qrCode && !status.connected && (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                <span className="font-medium">Scan QR Code with WhatsApp</span>
              </div>
              {qrCodeImage && (
                <img src={qrCodeImage || "/placeholder.svg"} alt="WhatsApp QR Code" className="border rounded-lg" />
              )}
              <p className="text-sm text-muted-foreground text-center">
                Open WhatsApp on your phone → Settings → Linked Devices → Link a Device
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {status.connected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Send Message
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Chat:</label>
              <select
                value={selectedChat}
                onChange={(e) => setSelectedChat(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select a chat...</option>
                {chats.map((chat) => (
                  <option key={chat.id} value={chat.id}>
                    {chat.name} {chat.isGroup ? "(Group)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message:</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-2 border rounded-md h-24"
              />
            </div>

            <Button onClick={sendMessage} disabled={!selectedChat || !message.trim()}>
              Send Message
            </Button>
          </CardContent>
        </Card>
      )}

      {status.connected && chats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Chats ({chats.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {chats.slice(0, 10).map((chat) => (
                <div key={chat.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="font-medium">{chat.name}</span>
                    {chat.isGroup && (
                      <Badge variant="outline" className="ml-2">
                        Group
                      </Badge>
                    )}
                  </div>
                  {chat.unreadCount > 0 && <Badge variant="destructive">{chat.unreadCount}</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
