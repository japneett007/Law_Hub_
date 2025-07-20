import { CountryLanguageSelector } from "@/components/country-language-selector"
import { FeatureCards } from "@/components/feature-cards"
import { EmergencyBanner } from "@/components/emergency-banner"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { SearchPreview } from "@/components/search-preview"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <EmergencyBanner />

      {/* Header with Sidebar Trigger */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-800 px-4">
        <SidebarTrigger className="-ml-1 text-white hover:bg-gray-800" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">LawHub</h1>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="bg-black px-4 py-2 rounded-lg border border-gray-700">
              <span className="text-4xl font-bold">
                <span className="text-white">Law</span>
                <span className="bg-orange-500 text-black px-3 py-2 rounded-md ml-2">Hub</span>
              </span>
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">
              Legal Guidance. <span className="text-orange-500">Anywhere.</span> Instantly.
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get instant legal assistance, understand local laws, and access emergency help wherever you are in the
              world.
            </p>
          </div>

          <CountryLanguageSelector />

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <Link href="/laws" className="w-full sm:w-auto">
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold px-8 py-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                🔍 Explore Legal Info
              </button>
            </Link>
            <Link href="/chat" className="w-full sm:w-auto">
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold px-8 py-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                🤖 Chat with LawBot
              </button>
            </Link>
            <Link href="/emergency" className="w-full sm:w-auto">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                🚨 Emergency Help
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Search Preview Section */}
      <SearchPreview />

      <FeatureCards />

      <footer className="border-t border-gray-800 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <a href="/privacy" className="hover:text-orange-500 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-orange-500 transition-colors">
              Terms of Service
            </a>
            <a href="/about" className="hover:text-orange-500 transition-colors">
              About
            </a>
            <a href="/contact" className="hover:text-orange-500 transition-colors">
              Contact
            </a>
          </div>
          <p>&copy; 2024 LawHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
