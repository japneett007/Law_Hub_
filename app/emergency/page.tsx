"use client"

import { useState, useEffect } from "react"
import { Phone, MapPin, AlertTriangle, Clock, Globe, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

interface EmergencyContact {
  type: string
  name: string
  phone: string
  address: string
  available: string
}

interface LegalAlert {
  id: number
  type: "warning" | "info" | "critical"
  title: string
  description: string
  location: string
  timestamp: string
}

export default function EmergencyPage() {
  const [userLocation, setUserLocation] = useState("Dubai, UAE")
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([])
  const [legalAlerts, setLegalAlerts] = useState<LegalAlert[]>([])
  const [isLocating, setIsLocating] = useState(false)

  useEffect(() => {
    // Mock emergency contacts for Dubai
    setEmergencyContacts([
      {
        type: "Embassy",
        name: "US Consulate General Dubai",
        phone: "+971-4-309-4000",
        address: "World Trade Centre, Dubai",
        available: "24/7 Emergency Line",
      },
      {
        type: "Police",
        name: "Dubai Police Emergency",
        phone: "999",
        address: "Multiple Locations",
        available: "24/7",
      },
      {
        type: "Legal Aid",
        name: "Dubai Legal Affairs Department",
        phone: "+971-4-606-6666",
        address: "Government of Dubai Legal Affairs",
        available: "Sun-Thu: 7:30 AM - 2:30 PM",
      },
    ])

    // Mock legal alerts
    setLegalAlerts([
      {
        id: 1,
        type: "warning",
        title: "Ramadan Regulations in Effect",
        description: "Special regulations regarding public eating and drinking during daylight hours",
        location: "UAE",
        timestamp: "2024-03-10",
      },
      {
        id: 2,
        type: "info",
        title: "New Traffic Fines Implementation",
        description: "Updated penalty structure for traffic violations effective immediately",
        location: "Dubai",
        timestamp: "2024-03-08",
      },
    ])
  }, [])

  const handleLocationUpdate = () => {
    setIsLocating(true)
    // Simulate location detection
    setTimeout(() => {
      setUserLocation("Abu Dhabi, UAE")
      setIsLocating(false)
    }, 2000)
  }

  const handleEmergencyCall = (phone: string) => {
    window.open(`tel:${phone}`)
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-red-500 bg-red-900/20"
      case "warning":
        return "border-yellow-500 bg-yellow-900/20"
      case "info":
        return "border-blue-500 bg-blue-900/20"
      default:
        return "border-gray-500 bg-gray-900/20"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return "🚨"
      case "warning":
        return "⚠️"
      case "info":
        return "ℹ️"
      default:
        return "📢"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-800 px-4 bg-gray-900">
        <SidebarTrigger className="-ml-1 text-white hover:bg-gray-800" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛡️</span>
          <h1 className="text-lg font-semibold text-red-400">Emergency Assistance</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Emergency SOS Button */}
        <div className="mb-8 text-center">
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white text-xl px-12 py-6 rounded-full shadow-lg"
          >
            <Shield className="w-8 h-8 mr-3" />
            EMERGENCY SOS
          </Button>
          <p className="text-gray-400 mt-2">Press for immediate emergency assistance</p>
        </div>

        {/* Location Section */}
        <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-500" />
              Current Location
            </h2>
            <Button
              onClick={handleLocationUpdate}
              disabled={isLocating}
              variant="outline"
              className="border-gray-600 text-gray-300 bg-transparent"
            >
              <Globe className="w-4 h-4 mr-2" />
              {isLocating ? "Locating..." : "Update Location"}
            </Button>
          </div>
          <p className="text-lg">{userLocation}</p>
          <p className="text-gray-400 text-sm mt-1">Emergency services and contacts are customized for your location</p>
        </div>

        {/* Legal Alerts */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Active Legal Alerts
          </h2>
          <div className="space-y-3">
            {legalAlerts.map((alert) => (
              <div key={alert.id} className={`rounded-lg p-4 border ${getAlertColor(alert.type)}`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getAlertIcon(alert.type)}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{alert.title}</h3>
                    <p className="text-gray-300 text-sm mb-2">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>📍 {alert.location}</span>
                      <span>📅 {alert.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-green-500" />
            Emergency Contacts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emergencyContacts.map((contact, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-orange-500/30 transition-colors"
              >
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">
                      {contact.type === "Embassy" ? "🏛️" : contact.type === "Police" ? "👮" : "⚖️"}
                    </span>
                    <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded">{contact.type}</span>
                  </div>
                  <h3 className="font-semibold text-lg">{contact.name}</h3>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-green-400" />
                    <span className="font-mono">{contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{contact.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{contact.available}</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleEmergencyCall(contact.phone)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Know Your Rights */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-orange-500">Know Your Rights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">If Arrested:</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Right to remain silent</li>
                <li>• Right to legal representation</li>
                <li>• Right to contact your embassy</li>
                <li>• Right to an interpreter</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Important Laws:</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• No public intoxication</li>
                <li>• Respect local customs</li>
                <li>• No photography of government buildings</li>
                <li>• Dress code requirements</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800">
            <Button className="bg-orange-500 hover:bg-orange-600 text-black">Learn More About Local Laws</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
