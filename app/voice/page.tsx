"use client"

import { useState } from "react"
import { Mic, MicOff, Volume2, VolumeX, Languages, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
]

interface VoiceSession {
  id: number
  text: string
  language: string
  timestamp: Date
  isPlaying: boolean
}

export default function VoicePage() {
  const [isListening, setIsListening] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [currentText, setCurrentText] = useState("")
  const [voiceSessions, setVoiceSessions] = useState<VoiceSession[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleStartListening = () => {
    setIsListening(true)
    setIsProcessing(true)

    // Simulate voice recognition
    setTimeout(() => {
      const mockTexts = [
        "What are the traffic laws in Dubai?",
        "Can I drink alcohol in public in UAE?",
        "What should I do if I lose my passport?",
        "How do I report a crime to the police?",
      ]
      const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)]
      setCurrentText(randomText)
      setIsListening(false)
      setIsProcessing(false)

      // Add to sessions
      const newSession: VoiceSession = {
        id: Date.now(),
        text: randomText,
        language: selectedLanguage,
        timestamp: new Date(),
        isPlaying: false,
      }
      setVoiceSessions((prev) => [newSession, ...prev])
    }, 3000)
  }

  const handleStopListening = () => {
    setIsListening(false)
    setIsProcessing(false)
  }

  const handleTextToSpeech = (text: string, sessionId?: number) => {
    if (sessionId) {
      setVoiceSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId ? { ...session, isPlaying: !session.isPlaying } : { ...session, isPlaying: false },
        ),
      )

      // Simulate speech duration
      setTimeout(() => {
        setVoiceSessions((prev) => prev.map((session) => ({ ...session, isPlaying: false })))
      }, 3000)
    }

    console.log(`Speaking in ${selectedLanguage}:`, text)
  }

  const getLanguageName = (code: string) => {
    return languages.find((lang) => lang.code === code)?.name || "English"
  }

  const getLanguageFlag = (code: string) => {
    return languages.find((lang) => lang.code === code)?.flag || "🇺🇸"
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-800 px-4 bg-gray-900">
        <SidebarTrigger className="-ml-1 text-white hover:bg-gray-800" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎤</span>
          <h1 className="text-lg font-semibold text-purple-400">Voice & TTS Support</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Language Selection */}
        <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Languages className="w-5 h-5 text-cyan-400" />
            Language Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Voice Input Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {languages.map((language) => (
                    <SelectItem key={language.code} value={language.code} className="text-white hover:bg-gray-700">
                      <span className="flex items-center gap-2">
                        <span>{language.flag}</span>
                        <span>{language.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                variant="outline"
                className={`border-gray-600 ${voiceEnabled ? "text-green-400" : "text-red-400"}`}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
                {voiceEnabled ? "Voice Enabled" : "Voice Disabled"}
              </Button>
            </div>
          </div>
        </div>

        {/* Voice Input Section */}
        <div className="mb-8 bg-gray-900 rounded-lg p-8 border border-gray-800 text-center">
          <h2 className="text-2xl font-semibold mb-6">Voice Input</h2>

          <div className="mb-6">
            <div
              className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center transition-all ${
                isListening ? "border-red-500 bg-red-500/20 animate-pulse" : "border-gray-600 hover:border-orange-500"
              }`}
            >
              <Button
                onClick={isListening ? handleStopListening : handleStartListening}
                disabled={isProcessing}
                className={`w-20 h-20 rounded-full ${
                  isListening ? "bg-red-600 hover:bg-red-700" : "bg-orange-500 hover:bg-orange-600"
                } text-white`}
              >
                {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </Button>
            </div>
          </div>

          <div className="mb-4">
            {isListening && (
              <p className="text-red-400 font-semibold animate-pulse">
                🎤 Listening... Speak now in {getLanguageName(selectedLanguage)}
              </p>
            )}
            {isProcessing && !isListening && <p className="text-orange-400 font-semibold">Processing your speech...</p>}
            {!isListening && !isProcessing && (
              <p className="text-gray-400">Click the microphone to start voice input</p>
            )}
          </div>

          {currentText && (
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <p className="text-lg">{currentText}</p>
              <div className="flex justify-center gap-2 mt-3">
                <Button
                  onClick={() => handleTextToSpeech(currentText)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Volume2 className="w-4 h-4 mr-1" />
                  Listen
                </Button>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-black">
                  Ask LawBot
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Voice History */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Voice Session History</h2>
          {voiceSessions.length === 0 ? (
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 text-center">
              <Mic className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">No voice sessions yet. Start speaking to see your history here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {voiceSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-orange-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{getLanguageFlag(session.language)}</span>
                        <span className="text-sm text-gray-400">
                          {getLanguageName(session.language)} • {session.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-lg mb-3">{session.text}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleTextToSpeech(session.text, session.id)}
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300"
                    >
                      {session.isPlaying ? (
                        <>
                          <Pause className="w-4 h-4 mr-1" />
                          Playing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-1" />
                          Listen
                        </>
                      )}
                    </Button>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-black">
                      Ask LawBot
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features Info */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-cyan-400">Voice & TTS Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Voice Input
              </h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Multi-language speech recognition</li>
                <li>• Real-time voice processing</li>
                <li>• Automatic language detection</li>
                <li>• Noise cancellation support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Text-to-Speech
              </h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Natural voice synthesis</li>
                <li>• Multiple language support</li>
                <li>• Adjustable speech speed</li>
                <li>• Offline capability</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
