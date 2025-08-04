"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || "http://localhost:8080"
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || "B6D711FCDE4D4FD5936544120E713976"

const EvolutionWhatsApp = () => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${EVOLUTION_API_URL}/messages`, {
          headers: {
            Authorization: `Bearer ${EVOLUTION_API_KEY}`,
          },
        })
        setMessages(response.data)
      } catch (error) {
        console.error("Error fetching messages:", error)
      }
    }

    fetchMessages()
  }, [])

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return

    try {
      const response = await axios.post(
        `${EVOLUTION_API_URL}/messages`,
        {
          message: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${EVOLUTION_API_KEY}`,
          },
        },
      )
      setMessages([...messages, response.data])
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  return (
    <div>
      <h1>Evolution WhatsApp</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg.message}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  )
}

export default EvolutionWhatsApp
