"use client"

import { useState } from "react"
import { Search, Filter, BookOpen, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

interface LawArticle {
  id: number
  title: string
  country: string
  topic: string
  summary: string
  lawCode: string
  penalties: string
  lastUpdated: string
  urgency: "low" | "medium" | "high"
}

const mockLaws: LawArticle[] = [
  {
    id: 1,
    title: "Speed Limit Violations",
    country: "UAE",
    topic: "Traffic Laws",
    summary: "Regulations regarding speed limits on highways and city roads in the UAE",
    lawCode: "Federal Traffic Law Article 49",
    penalties: "Fine: AED 300-3000, Points: 4-12",
    lastUpdated: "2024-01-15",
    urgency: "medium",
  },
  {
    id: 2,
    title: "Public Intoxication Laws",
    country: "UAE",
    topic: "Criminal Law",
    summary: "Laws regarding alcohol consumption and public behavior in the UAE",
    lawCode: "Federal Penal Code Article 313",
    penalties: "Fine: AED 2000-10000, Imprisonment: 6 months",
    lastUpdated: "2024-02-01",
    urgency: "high",
  },
  {
    id: 3,
    title: "Employment Contract Termination",
    country: "UAE",
    topic: "Employment Law",
    summary: "Procedures and rights regarding employment termination in the UAE",
    lawCode: "UAE Labour Law Article 120",
    penalties: "Compensation varies by contract terms",
    lastUpdated: "2024-01-20",
    urgency: "low",
  },
]

const countries = [
  { code: "all", name: "All Countries" },
  { code: "UAE", name: "United Arab Emirates" },
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
]

const topics = [
  { code: "all", name: "All Topics" },
  { code: "Traffic Laws", name: "Traffic Laws" },
  { code: "Criminal Law", name: "Criminal Law" },
  { code: "Employment Law", name: "Employment Law" },
  { code: "Immigration", name: "Immigration" },
  { code: "Business Law", name: "Business Law" },
]

export default function LegalExplorerPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [selectedTopic, setSelectedTopic] = useState("all")
  const [filteredLaws, setFilteredLaws] = useState<LawArticle[]>(mockLaws)

  const handleSearch = () => {
    let filtered = mockLaws

    if (searchQuery) {
      filtered = filtered.filter(
        (law) =>
          law.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          law.summary.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCountry !== "all") {
      filtered = filtered.filter((law) => law.country === selectedCountry)
    }

    if (selectedTopic !== "all") {
      filtered = filtered.filter((law) => law.topic === selectedTopic)
    }

    setFilteredLaws(filtered)
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-800 px-4 bg-gray-900">
        <SidebarTrigger className="-ml-1 text-white hover:bg-gray-800" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔍</span>
          <h1 className="text-lg font-semibold text-green-400">Legal Database Explorer</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Search and Filters */}
        <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-2xl font-bold mb-6">Browse Legal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search laws, regulations, penalties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code} className="text-white hover:bg-gray-700">
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select Topic" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {topics.map((topic) => (
                  <SelectItem key={topic.code} value={topic.code} className="text-white hover:bg-gray-700">
                    {topic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSearch} className="bg-orange-500 hover:bg-orange-600 text-black">
              <Search className="w-4 h-4 mr-2" />
              Search Laws
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Search Results ({filteredLaws.length} found)</h3>
            <Select defaultValue="relevance">
              <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="relevance" className="text-white">
                  Sort by Relevance
                </SelectItem>
                <SelectItem value="date" className="text-white">
                  Sort by Date
                </SelectItem>
                <SelectItem value="country" className="text-white">
                  Sort by Country
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredLaws.map((law) => (
            <div
              key={law.id}
              className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-orange-500/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-semibold text-orange-500">{law.title}</h4>
                    <div className={`w-3 h-3 rounded-full ${getUrgencyColor(law.urgency)}`}></div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <span>📍 {law.country}</span>
                    <span>📚 {law.topic}</span>
                    <span>📅 Updated: {law.lastUpdated}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-gray-800 px-3 py-1 rounded text-sm font-mono">{law.lawCode}</div>
                </div>
              </div>

              <p className="text-gray-300 mb-4">{law.summary}</p>

              <div className="bg-gray-800 rounded p-3 mb-4">
                <span className="text-sm text-gray-400">Penalties: </span>
                <span className="text-red-400">{law.penalties}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-black">
                    <BookOpen className="w-4 h-4 mr-1" />
                    Read Full Law
                  </Button>
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                    Ask in Chat
                  </Button>
                </div>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Official Source
                </Button>
              </div>
            </div>
          ))}

          {filteredLaws.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
              <p className="text-gray-400">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
