"use client"

import React from "react"
import ReactDOM from "react-dom"

const { useState, useEffect } = React

// Sidebar Component
function Sidebar({ isOpen, onClose, activeSection, onSectionChange }) {
  const menuItems = [
    { id: "home", title: "Home", icon: "🏠" },
    { id: "chat", title: "AI Chatbot", icon: "💬" },
    { id: "ocr", title: "Document OCR", icon: "📄" },
    { id: "laws", title: "Legal Explorer", icon: "🔍" },
    { id: "emergency", title: "Emergency Help", icon: "🛡️", isEmergency: true },
    { id: "wizard", title: "Situation Wizard", icon: "❓" },
  ]

  const quickActions = [
    { id: "location", title: "Change Location", icon: "🌍" },
    { id: "sos", title: "Emergency SOS", icon: "🚨", isEmergency: true },
  ]

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? "show" : ""}`} onClick={onClose}></div>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-text">
              <span className="logo-law">Law</span>
              <span className="logo-hub">Hub</span>
            </span>
          </div>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-group">
            <div className="sidebar-group-label">Navigation</div>
            <ul className="sidebar-menu">
              {menuItems.map((item) => (
                <li key={item.id} className="sidebar-menu-item">
                  <button
                    className={`sidebar-menu-button ${activeSection === item.id ? "active" : ""} ${item.isEmergency ? "emergency" : ""}`}
                    onClick={() => {
                      onSectionChange(item.id)
                      onClose()
                    }}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span>{item.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-group">
            <div className="sidebar-group-label">Quick Actions</div>
            <ul className="sidebar-menu">
              {quickActions.map((action) => (
                <li key={action.id} className="sidebar-menu-item">
                  <button
                    className={`sidebar-menu-button ${action.isEmergency ? "emergency" : ""}`}
                    onClick={() => {
                      console.log(`Quick action: ${action.title}`)
                      onClose()
                    }}
                  >
                    <span className="menu-icon">{action.icon}</span>
                    <span>{action.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

// Emergency Banner Component
function EmergencyBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="emergency-banner">
      <div className="emergency-content">
        <span>⚠️</span>
        <span>Emergency Legal Situation? Get immediate assistance →</span>
      </div>
      <div className="emergency-actions">
        <button className="emergency-btn">Get Help Now</button>
        <button className="close-banner" onClick={() => setIsVisible(false)}>
          ×
        </button>
      </div>
    </div>
  )
}

// Country Language Selector Component
function CountryLanguageSelector() {
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("")

  const countries = [
    { code: "US", name: "United States" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "GB", name: "United Kingdom" },
    { code: "FR", name: "France" },
    { code: "DE", name: "Germany" },
    { code: "JP", name: "Japan" },
    { code: "CN", name: "China" },
    { code: "IN", name: "India" },
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

  return (
    <div className="country-language-selector">
      <h3 className="selector-title">Select Your Location & Language</h3>

      <div className="selector-group">
        <label className="selector-label">🌍 Country/Region</label>
        <select className="selector-input" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
          <option value="">Choose your country</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className="selector-group">
        <label className="selector-label">🗣️ Language</label>
        <select
          className="selector-input"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="">Choose your language</option>
          {languages.map((language) => (
            <option key={language.code} value={language.code}>
              {language.name}
            </option>
          ))}
        </select>
      </div>

      <button
        className="continue-btn"
        disabled={!selectedCountry || !selectedLanguage}
        onClick={() => alert("Welcome to LawHub!")}
      >
        Continue to LawHub
      </button>
    </div>
  )
}

// Feature Cards Component
function FeatureCards() {
  const features = [
    {
      icon: "💬",
      title: "AI Legal Chatbot",
      description: "Ask legal questions and get instant answers tailored to your location",
      color: "orange",
    },
    {
      icon: "📄",
      title: "Document OCR Analysis",
      description: "Upload legal documents and get them analyzed and explained",
      color: "blue",
    },
    {
      icon: "🔍",
      title: "Legal Database Explorer",
      description: "Browse comprehensive legal information by country and topic",
      color: "green",
    },
    {
      icon: "🛡️",
      title: "Emergency Assistance",
      description: "Get immediate help with embassy contacts and local emergency services",
      color: "red",
    },
    {
      icon: "🎤",
      title: "Voice & TTS Support",
      description: "Speak your questions and listen to responses in multiple languages",
      color: "purple",
    },
    {
      icon: "🌍",
      title: "Multi-Language Support",
      description: "Access legal guidance in English, Arabic, French, Chinese, and more",
      color: "cyan",
    },
  ]

  return (
    <div className="features-section">
      <h2 className="features-title">
        Everything You Need for <span style={{ color: "#FF9900" }}>Legal Guidance</span>
      </h2>
      <p className="features-subtitle">
        Comprehensive legal assistance tools designed for travelers, expats, and anyone needing legal guidance abroad.
      </p>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-header">
              <span className={`feature-icon ${feature.color}`}>{feature.icon}</span>
              <h3 className="feature-title">{feature.title}</h3>
            </div>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Main App Component
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const handleSectionChange = (section) => {
    setActiveSection(section)
  }

  return (
    <div className="app">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <div className="main-content">
        <EmergencyBanner />

        <div className="header">
          <button className="menu-toggle" onClick={toggleSidebar}>
            ☰
          </button>
          <h1 className="header-title">LawHub - Legal Guidance Platform</h1>
        </div>

        <div className="hero-section">
          <div className="hero-logo">
            <div className="logo">
              <span className="logo-text">
                <span className="logo-law">Law</span>
                <span className="logo-hub">Hub</span>
              </span>
            </div>
          </div>

          <h1 className="hero-title">
            Legal Guidance. <span className="highlight">Anywhere.</span> Instantly.
          </h1>

          <p className="hero-subtitle">
            Get instant legal assistance, understand local laws, and access emergency help wherever you are in the
            world.
          </p>

          <CountryLanguageSelector />

          <div className="cta-buttons">
            <button className="cta-btn primary" onClick={() => handleSectionChange("laws")}>
              🔍 Explore Legal Info
            </button>
            <button className="cta-btn primary" onClick={() => handleSectionChange("chat")}>
              🤖 Chat with LawBot
            </button>
            <button className="cta-btn emergency" onClick={() => handleSectionChange("emergency")}>
              🚨 Emergency Help
            </button>
          </div>
        </div>

        <FeatureCards />

        <footer className="footer">
          <div className="footer-links">
            <a href="#" className="footer-link">
              Privacy Policy
            </a>
            <a href="#" className="footer-link">
              Terms of Service
            </a>
            <a href="#" className="footer-link">
              About
            </a>
            <a href="#" className="footer-link">
              Contact
            </a>
          </div>
          <p className="footer-copyright">&copy; 2024 LawHub. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}

// Render the App
ReactDOM.render(<App />, document.getElementById("root"))
