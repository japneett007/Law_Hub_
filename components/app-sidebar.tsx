"use client"

import { MessageSquare, FileText, Search, Shield, HelpCircle, Home, LogIn, LogOut, Globe, Mic } from "lucide-react"
import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")

  const handleLogin = () => {
    // Simulate login
    setIsLoggedIn(true)
    setUserName("John Doe")
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserName("")
  }

  const menuItems = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "AI Chatbot",
      url: "/chat",
      icon: MessageSquare,
    },
    {
      title: "Document OCR",
      url: "/ocr",
      icon: FileText,
    },
    {
      title: "Legal Explorer",
      url: "/laws",
      icon: Search,
    },
    {
      title: "Emergency Help",
      url: "/emergency",
      icon: Shield,
    },
    {
      title: "Situation Wizard",
      url: "/wizard",
      icon: HelpCircle,
    },
  ]

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-gray-800">
      <SidebarHeader className="border-b border-gray-800 p-6 bg-black">
        <div className="flex items-center justify-center">
          <div className="bg-black px-3 py-2 rounded-lg border border-gray-700">
            <span className="text-xl font-bold">
              <span className="text-white">Law</span>
              <span className="bg-orange-500 text-black px-2 py-1 rounded-md ml-1 text-sm">Hub</span>
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-gray-900">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-sm font-medium px-4 py-2">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-gray-800 text-white">
                    <a href={item.url} className="flex items-center gap-3 px-4 py-3">
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-sm font-medium px-4 py-2">Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-orange-500 hover:bg-gray-800 px-4 py-3">
                  <a href="/multilang">
                    <Globe className="w-5 h-5" />
                    <span className="text-sm">Change Language</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-purple-500 hover:bg-gray-800 px-4 py-3">
                  <a href="/voice">
                    <Mic className="w-5 h-5" />
                    <span className="text-sm">Voice Assistant</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-red-500 hover:bg-gray-800 px-4 py-3">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">Emergency SOS</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-800 p-4 bg-gray-900">
        <SidebarMenu>
          {isLoggedIn ? (
            <>
              <SidebarMenuItem>
                <div className="px-4 py-2 text-sm text-gray-300">Welcome, {userName}</div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="hover:bg-gray-800 text-red-400 hover:text-red-300 px-4 py-3"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm">Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogin}
                className="hover:bg-gray-800 text-green-400 hover:text-green-300 px-4 py-3"
              >
                <LogIn className="w-5 h-5" />
                <span className="text-sm">Login</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
