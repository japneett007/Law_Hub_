import { MessageSquare, FileText, Shield, Search, Mic, Globe } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: MessageSquare,
    title: "AI Legal Chatbot",
    description: "Ask legal questions and get instant answers tailored to your location",
    color: "text-orange-500",
    href: "/chat",
  },
  {
    icon: FileText,
    title: "Document OCR Analysis",
    description: "Upload legal documents and get them analyzed and explained",
    color: "text-blue-400",
    href: "/ocr",
  },
  {
    icon: Search,
    title: "Legal Database Explorer",
    description: "Browse comprehensive legal information by country and topic",
    color: "text-green-400",
    href: "/laws",
  },
  {
    icon: Shield,
    title: "Emergency Assistance",
    description: "Get immediate help with embassy contacts and local emergency services",
    color: "text-red-400",
    href: "/emergency",
  },
  {
    icon: Mic,
    title: "Voice & TTS Support",
    description: "Speak your questions and listen to responses in multiple languages",
    color: "text-purple-400",
    href: "/voice",
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description: "Access legal guidance in English, Arabic, French, Chinese, and more",
    color: "text-cyan-400",
    href: "/multilang",
  },
]

export function FeatureCards() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          Everything You Need for <span className="text-orange-500">Legal Guidance</span>
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Comprehensive legal assistance tools designed for travelers, expats, and anyone needing legal guidance abroad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Link key={index} href={feature.href}>
            <div className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors border border-gray-800 hover:border-orange-500/30 cursor-pointer group">
              <div className="flex items-center gap-3 mb-4">
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                <h3 className="text-xl font-semibold group-hover:text-orange-500 transition-colors">{feature.title}</h3>
              </div>
              <p className="text-gray-300">{feature.description}</p>
              <div className="mt-4 text-orange-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Click to explore →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
