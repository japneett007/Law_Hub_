"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const countries = [
  { code: "US", name: "United States" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
]

const topics = [
  { code: "traffic", name: "Traffic Laws" },
  { code: "criminal", name: "Criminal Law" },
  { code: "civil", name: "Civil Rights" },
  { code: "immigration", name: "Immigration" },
  { code: "employment", name: "Employment Law" },
  { code: "property", name: "Property Law" },
  { code: "family", name: "Family Law" },
  { code: "business", name: "Business Law" },
  { code: "tax", name: "Tax Law" },
  { code: "consumer", name: "Consumer Rights" },
]

export function LegalSearch() {
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!selectedCountry || !selectedTopic) {
      alert("Please select both country and topic")
      return
    }

    setIsSearching(true)

    // Simulate API call
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          title: `${topics.find((t) => t.code === selectedTopic)?.name} in ${countries.find((c) => c.code === selectedCountry)?.name}`,
          summary: "Overview of relevant laws and regulations",
          lawCode: "Section 123.45",
          penalties: "Fine: $100-500, Points: 2-4",
        },
        {
          id: 2,
          title: "Recent Updates and Amendments",
          summary: "Latest changes to the legislation",
          lawCode: "Amendment 2024.1",
          penalties: "Updated penalty structure",
        },
      ]
      setSearchResults(mockResults)
      setIsSearching(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Find Legal Information</h1>

        {/* Search Form */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-800">
          <div className="space-y-4">
            <div>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-12">
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
            </div>

            <div>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-12">
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

            <Button
              onClick={handleSearch}
              disabled={isSearching || !selectedCountry || !selectedTopic}
              className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold h-12 text-lg"
            >
              <Search className="w-5 h-5 mr-2" />
              {isSearching ? "Searching..." : "Search Laws"}
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Search Results</h2>
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-orange-500/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-orange-500">{result.title}</h3>
                  <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded">{result.lawCode}</span>
                </div>
                <p className="text-gray-300 mb-3">{result.summary}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Penalties: {result.penalties}</span>
                  <div className="space-x-2">
                    <Link href="/laws">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                      >
                        Read More
                      </Button>
                    </Link>
                    <Link href="/chat">
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-black">
                        Ask in Chat
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isSearching && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p className="mt-2 text-gray-400">Searching legal database...</p>
          </div>
        )}
      </div>
    </div>
  )
}
