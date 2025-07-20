"use client"

import { useState } from "react"
import { Globe, Languages } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

const countries = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "IN", name: "India", flag: "🇮🇳" },
]

const languages = [
  { code: "en", name: "English" },
  { code: "ar", name: "العربية" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
  { code: "hi", name: "हिन्दी" },
  { code: "ru", name: "Русский" },
]

export function CountryLanguageSelector() {
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("")

  return (
    <div className="bg-gray-900 rounded-lg p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-center">Select Your Location & Language</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Globe className="inline w-4 h-4 mr-1" />
            Country/Region
          </label>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="bg-black border-gray-700 text-white">
              <SelectValue placeholder="Choose your country" />
            </SelectTrigger>
            <SelectContent className="bg-black border-gray-700">
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code} className="text-white hover:bg-gray-800">
                  <span className="flex items-center gap-2">
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Languages className="inline w-4 h-4 mr-1" />
            Language
          </label>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="bg-black border-gray-700 text-white">
              <SelectValue placeholder="Choose your language" />
            </SelectTrigger>
            <SelectContent className="bg-black border-gray-700">
              {languages.map((language) => (
                <SelectItem key={language.code} value={language.code} className="text-white hover:bg-gray-800">
                  {language.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Link href="/chat">
          <button
            className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            disabled={!selectedCountry || !selectedLanguage}
          >
            Continue to LawHub
          </button>
        </Link>
      </div>
    </div>
  )
}
