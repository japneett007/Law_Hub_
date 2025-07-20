"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SearchPreview() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Quick Legal Search</h2>
          <p className="text-gray-400 text-lg">Find specific legal information for your country and situation</p>
        </div>

        {/* Search Preview Card */}
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 text-center">
          <Search className="w-16 h-16 mx-auto mb-6 text-orange-500" />
          <h3 className="text-xl font-semibold mb-4">Search Legal Database</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Browse comprehensive legal information by country and topic. Get instant access to laws, regulations,
            penalties, and recent updates.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-2xl mb-2">🌍</div>
              <h4 className="font-semibold mb-1">50+ Countries</h4>
              <p className="text-sm text-gray-400">Legal information worldwide</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-2xl mb-2">📚</div>
              <h4 className="font-semibold mb-1">10,000+ Laws</h4>
              <p className="text-sm text-gray-400">Comprehensive database</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-2xl mb-2">🔄</div>
              <h4 className="font-semibold mb-1">Daily Updates</h4>
              <p className="text-sm text-gray-400">Always current information</p>
            </div>
          </div>

          <Link href="/laws">
            <Button className="bg-orange-500 hover:bg-orange-600 text-black font-semibold px-8 py-3">
              <Search className="w-5 h-5 mr-2" />
              Start Searching
            </Button>
          </Link>
        </div>

        {/* Popular Topics */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-center">Popular Legal Topics</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Traffic Laws",
              "Immigration",
              "Employment Rights",
              "Criminal Law",
              "Business Regulations",
              "Property Law",
              "Consumer Rights",
              "Tax Law",
            ].map((topic) => (
              <Link key={topic} href="/laws">
                <span className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm cursor-pointer transition-colors">
                  {topic}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
