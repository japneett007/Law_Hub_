"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, MicOff, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm LawBot, your AI legal assistant. I can help you understand laws, regulations, and legal procedures in different countries. What legal question can I help you with today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: generateBotResponse(inputMessage),
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 2000)
  }

  const generateBotResponse = (userInput: string): string => {
    const responses = [
      "Based on the legal framework in your jurisdiction, here's what you need to know: This matter typically falls under civil law provisions. I recommend consulting with a local attorney for specific guidance.",
      "According to international legal standards, this situation requires careful consideration of local regulations. The penalties can vary significantly depending on your location.",
      "This is an important legal question. The answer depends on several factors including your location, the specific circumstances, and applicable local laws. Would you like me to provide more specific information if you share your country?",
      "Legal procedures for this matter typically involve several steps. First, you should gather all relevant documentation. Second, understand your rights under local law. Third, consider seeking professional legal advice.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleVoiceInput = () => {
    setIsListening(!isListening)
    // Voice recognition would be implemented here
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false)
        setInputMessage("Can you help me understand traffic laws in Dubai?")
      }, 3000)
    }
  }

  const handleTextToSpeech = (text: string) => {
    // Text-to-speech would be implemented here
    console.log("Speaking:", text)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-800 px-4 bg-gray-900">
        <SidebarTrigger className="-ml-1 text-white hover:bg-gray-800" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <span className="text-2xl">💬</span>
          <h1 className="text-lg font-semibold text-orange-500">AI Legal Chatbot</h1>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[70%] rounded-lg p-4 ${
                message.sender === "user" ? "bg-orange-500 text-black" : "bg-gray-800 text-white border border-gray-700"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
                {message.sender === "bot" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleTextToSpeech(message.text)}
                    className="h-6 w-6 p-0 hover:bg-gray-700"
                  >
                    <Volume2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 p-4 bg-gray-900">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleVoiceInput}
            className={`${isListening ? "bg-red-500 hover:bg-red-600" : "bg-gray-700 hover:bg-gray-600"} text-white`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask me any legal question..."
            className="flex-1 bg-gray-800 border-gray-700 text-white"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-black"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          {isListening ? "Listening... Speak now" : "Type your question or click the mic to speak"}
        </p>
      </div>
    </div>
  )
}
