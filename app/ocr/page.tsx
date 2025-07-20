"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, FileText, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

interface AnalysisResult {
  extractedText: string
  lawTopic: string
  explanation: string
  recommendations: string[]
  urgency: "low" | "medium" | "high"
}

export default function OCRPage() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a JPG, PNG, or PDF file")
      return
    }
    setUploadedFile(file)
  }

  const analyzeDocument = async () => {
    if (!uploadedFile) return

    setIsAnalyzing(true)

    // Simulate OCR and analysis
    setTimeout(() => {
      const mockResult: AnalysisResult = {
        extractedText:
          "TRAFFIC VIOLATION NOTICE\n\nViolation: Speeding\nSpeed Limit: 60 km/h\nRecorded Speed: 85 km/h\nFine Amount: $200\nDue Date: 30 days from issue date\nLocation: Sheikh Zayed Road, Dubai",
        lawTopic: "Traffic Violations",
        explanation:
          "This is a speeding violation notice issued in Dubai, UAE. The violation occurred on Sheikh Zayed Road where you exceeded the speed limit by 25 km/h.",
        recommendations: [
          "Pay the fine within 30 days to avoid additional penalties",
          "Consider attending a traffic awareness course to reduce points",
          "Check if you're eligible for early payment discount",
          "Ensure your driving license is valid and up to date",
        ],
        urgency: "medium",
      }
      setAnalysisResult(mockResult)
      setIsAnalyzing(false)
    }, 3000)
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-400 bg-red-900/20 border-red-500"
      case "medium":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-500"
      case "low":
        return "text-green-400 bg-green-900/20 border-green-500"
      default:
        return "text-gray-400 bg-gray-900/20 border-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-800 px-4 bg-gray-900">
        <SidebarTrigger className="-ml-1 text-white hover:bg-gray-800" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <span className="text-2xl">📄</span>
          <h1 className="text-lg font-semibold text-blue-400">Document OCR Analysis</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Upload Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Upload Legal Document</h2>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-orange-500 bg-orange-500/10" : "border-gray-600 hover:border-gray-500"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg mb-2">Drag and drop your document here</p>
            <p className="text-gray-400 mb-4">or</p>
            <label className="cursor-pointer">
              <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileInput} />
              <Button className="bg-orange-500 hover:bg-orange-600 text-black">Browse Files</Button>
            </label>
            <p className="text-sm text-gray-400 mt-4">Supported formats: JPG, PNG, PDF (Max size: 10MB)</p>
          </div>
        </div>

        {/* File Preview */}
        {uploadedFile && (
          <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="font-semibold">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-400">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent">
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
                <Button
                  onClick={analyzeDocument}
                  disabled={isAnalyzing}
                  className="bg-orange-500 hover:bg-orange-600 text-black"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Document"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Progress */}
        {isAnalyzing && (
          <div className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-lg font-semibold mb-2">Analyzing Document...</p>
            <p className="text-gray-400">Processing OCR and legal analysis</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Analysis Results</h2>
              <div
                className={`px-3 py-1 rounded-full border text-sm font-medium ${getUrgencyColor(analysisResult.urgency)}`}
              >
                {analysisResult.urgency.toUpperCase()} PRIORITY
              </div>
            </div>

            {/* Extracted Text */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Extracted Text
              </h3>
              <div className="bg-black rounded p-4 font-mono text-sm whitespace-pre-wrap">
                {analysisResult.extractedText}
              </div>
              <Button variant="outline" size="sm" className="mt-3 border-gray-600 text-gray-300 bg-transparent">
                <Download className="w-4 h-4 mr-1" />
                Download Text
              </Button>
            </div>

            {/* Legal Analysis */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-3 text-orange-500">Legal Analysis</h3>
              <div className="mb-4">
                <span className="text-sm text-gray-400">Topic Classification:</span>
                <p className="text-lg font-medium">{analysisResult.lawTopic}</p>
              </div>
              <div className="mb-4">
                <span className="text-sm text-gray-400">Explanation:</span>
                <p className="mt-1">{analysisResult.explanation}</p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-3 text-green-400">Recommendations</h3>
              <ul className="space-y-2">
                {analysisResult.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button className="bg-orange-500 hover:bg-orange-600 text-black">Ask LawBot About This</Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                Save Analysis
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                Share Results
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
