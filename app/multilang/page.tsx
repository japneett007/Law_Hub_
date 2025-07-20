"use client"

import { useState } from "react"
import { Globe, Languages, Download, BookOpen, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

const supportedLanguages = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    coverage: 100,
    legalDocs: 15420,
    countries: ["US", "UK", "AU", "CA", "NZ"],
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦",
    coverage: 95,
    legalDocs: 8750,
    countries: ["UAE", "SA", "EG", "JO", "LB"],
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    coverage: 90,
    legalDocs: 6200,
    countries: ["FR", "BE", "CH", "CA", "MA"],
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    coverage: 85,
    legalDocs: 5100,
    countries: ["DE", "AT", "CH"],
  },
  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    flag: "🇨🇳",
    coverage: 80,
    legalDocs: 4800,
    countries: ["CN", "TW", "HK", "SG"],
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    coverage: 75,
    legalDocs: 3200,
    countries: ["JP"],
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    coverage: 70,
    legalDocs: 2900,
    countries: ["IN"],
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    flag: "🇷🇺",
    coverage: 65,
    legalDocs: 2100,
    countries: ["RU", "BY", "KZ"],
  },
]

const sampleContent = {
  en: {
    title: "Traffic Violation Notice",
    content:
      "You have been issued a traffic violation for exceeding the speed limit. The fine amount is $200 and must be paid within 30 days to avoid additional penalties.",
  },
  ar: {
    title: "إشعار مخالفة مرورية",
    content:
      "لقد تم إصدار مخالفة مرورية لك بسبب تجاوز حد السرعة المسموح. مبلغ الغرامة هو 200 دولار ويجب دفعها خلال 30 يوماً لتجنب العقوبات الإضافية.",
  },
  fr: {
    title: "Avis d'infraction routière",
    content:
      "Vous avez reçu une contravention pour excès de vitesse. Le montant de l'amende est de 200 $ et doit être payé dans les 30 jours pour éviter des pénalités supplémentaires.",
  },
}

export default function MultiLanguagePage() {
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [translationDemo, setTranslationDemo] = useState("en")

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode)
  }

  const handleTranslationDemo = (langCode: string) => {
    setTranslationDemo(langCode)
  }

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 90) return "text-green-400"
    if (coverage >= 75) return "text-yellow-400"
    return "text-orange-400"
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-800 px-4 bg-gray-900">
        <SidebarTrigger className="-ml-1 text-white hover:bg-gray-800" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          <h1 className="text-lg font-semibold text-cyan-400">Multi-Language Support</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Language Overview */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Legal Guidance in <span className="text-cyan-400">8+ Languages</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Access comprehensive legal information, chat with our AI assistant, and get emergency help in your preferred
            language
          </p>
        </div>

        {/* Language Selection */}
        <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Languages className="w-5 h-5 text-cyan-400" />
            Select Your Language
          </h3>
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white max-w-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {supportedLanguages.map((language) => (
                <SelectItem key={language.code} value={language.code} className="text-white hover:bg-gray-700">
                  <span className="flex items-center gap-3">
                    <span className="text-lg">{language.flag}</span>
                    <span>{language.name}</span>
                    <span className="text-gray-400">({language.nativeName})</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Language Coverage Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Language Coverage & Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {supportedLanguages.map((language) => (
              <div
                key={language.code}
                className={`bg-gray-900 rounded-lg p-4 border transition-colors ${
                  selectedLanguage === language.code ? "border-cyan-500" : "border-gray-800 hover:border-gray-700"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{language.flag}</span>
                  <div>
                    <h4 className="font-semibold">{language.name}</h4>
                    <p className="text-sm text-gray-400">{language.nativeName}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Coverage:</span>
                    <span className={getCoverageColor(language.coverage)}>{language.coverage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Legal Docs:</span>
                    <span>{language.legalDocs.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Countries:</span>
                    <span>{language.countries.length}</span>
                  </div>
                </div>

                <div className="mt-3 bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-cyan-500 h-2 rounded-full transition-all"
                    style={{ width: `${language.coverage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Translation Demo */}
        <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-xl font-semibold mb-4">Live Translation Demo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {Object.keys(sampleContent).map((langCode) => (
              <Button
                key={langCode}
                onClick={() => handleTranslationDemo(langCode)}
                variant={translationDemo === langCode ? "default" : "outline"}
                className={translationDemo === langCode ? "bg-cyan-500 text-black" : "border-gray-600 text-gray-300"}
              >
                {supportedLanguages.find((l) => l.code === langCode)?.flag}{" "}
                {supportedLanguages.find((l) => l.code === langCode)?.name}
              </Button>
            ))}
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-3">
              {sampleContent[translationDemo as keyof typeof sampleContent].title}
            </h4>
            <p className="text-gray-300 mb-4 leading-relaxed">
              {sampleContent[translationDemo as keyof typeof sampleContent].content}
            </p>
            <div className="flex gap-2">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                <Volume2 className="w-4 h-4 mr-1" />
                Listen
              </Button>
              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </div>

        {/* Features by Language */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Available Features by Language</h3>
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="text-left p-4">Language</th>
                    <th className="text-center p-4">AI Chat</th>
                    <th className="text-center p-4">Voice Input</th>
                    <th className="text-center p-4">Text-to-Speech</th>
                    <th className="text-center p-4">Legal Database</th>
                    <th className="text-center p-4">OCR Analysis</th>
                  </tr>
                </thead>
                <tbody>
                  {supportedLanguages.slice(0, 5).map((language, index) => (
                    <tr key={language.code} className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800/50"}>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span>{language.flag}</span>
                          <span>{language.name}</span>
                        </div>
                      </td>
                      <td className="text-center p-4">
                        <span className="text-green-400">✓</span>
                      </td>
                      <td className="text-center p-4">
                        <span className={language.coverage >= 80 ? "text-green-400" : "text-yellow-400"}>
                          {language.coverage >= 80 ? "✓" : "~"}
                        </span>
                      </td>
                      <td className="text-center p-4">
                        <span className="text-green-400">✓</span>
                      </td>
                      <td className="text-center p-4">
                        <span className={language.coverage >= 90 ? "text-green-400" : "text-yellow-400"}>
                          {language.coverage >= 90 ? "✓" : "~"}
                        </span>
                      </td>
                      <td className="text-center p-4">
                        <span className={language.coverage >= 85 ? "text-green-400" : "text-yellow-400"}>
                          {language.coverage >= 85 ? "✓" : "~"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            <p>✓ = Fully Supported | ~ = Partially Supported | ✗ = Not Available</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-orange-500 hover:bg-orange-600 text-black p-6 h-auto flex-col">
              <Globe className="w-8 h-8 mb-2" />
              <span className="font-semibold">Change App Language</span>
              <span className="text-sm opacity-80">Switch interface language</span>
            </Button>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-black p-6 h-auto flex-col">
              <BookOpen className="w-8 h-8 mb-2" />
              <span className="font-semibold">Browse Legal Content</span>
              <span className="text-sm opacity-80">In your preferred language</span>
            </Button>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white p-6 h-auto flex-col">
              <Volume2 className="w-8 h-8 mb-2" />
              <span className="font-semibold">Voice Assistant</span>
              <span className="text-sm opacity-80">Speak in any language</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
