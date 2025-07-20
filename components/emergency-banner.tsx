"use client"

import { useState } from "react"
import { AlertTriangle, X } from "lucide-react"
import Link from "next/link"

export function EmergencyBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-red-600 text-white px-4 py-3 relative">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">Emergency Legal Situation? Get immediate assistance →</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/emergency">
            <button className="bg-white text-red-600 px-4 py-1 rounded font-semibold hover:bg-gray-100 transition-colors">
              Get Help Now
            </button>
          </Link>
          <button onClick={() => setIsVisible(false)} className="hover:bg-red-700 p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
