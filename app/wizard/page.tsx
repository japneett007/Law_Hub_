"use client"

import { useState } from "react"
import { ArrowRight, ArrowLeft, HelpCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

interface Scenario {
  id: string
  title: string
  icon: string
  description: string
}

interface Step {
  id: number
  question: string
  options: string[]
  nextStep?: { [key: string]: number }
}

interface Solution {
  title: string
  steps: string[]
  urgency: "low" | "medium" | "high"
  contacts: string[]
}

const scenarios: Scenario[] = [
  {
    id: "arrested",
    title: "Arrested or Detained",
    icon: "🔒",
    description: "You've been arrested or detained by authorities",
  },
  {
    id: "passport",
    title: "Lost Passport",
    icon: "🛄",
    description: "Your passport has been lost or stolen",
  },
  {
    id: "visa",
    title: "Visa Issues",
    icon: "📋",
    description: "Problems with visa overstay or violations",
  },
  {
    id: "fine",
    title: "Received a Fine",
    icon: "🚓",
    description: "You've received a traffic or legal fine",
  },
  {
    id: "behavior",
    title: "Public Behavior Issue",
    icon: "🚫",
    description: "Concerns about public behavior or cultural violations",
  },
  {
    id: "accident",
    title: "Traffic Accident",
    icon: "🚗",
    description: "Involved in a vehicle accident",
  },
]

// Complete wizard steps for all scenarios
const wizardSteps: { [key: string]: Step[] } = {
  arrested: [
    {
      id: 1,
      question: "Where are you currently located?",
      options: ["Police Station", "Court", "Detention Center", "Other Location"],
    },
    {
      id: 2,
      question: "Have you been formally charged?",
      options: ["Yes, I've been charged", "No, just detained", "I'm not sure"],
    },
    {
      id: 3,
      question: "Do you have legal representation?",
      options: ["Yes, I have a lawyer", "No, I need a lawyer", "I want to represent myself"],
    },
  ],
  passport: [
    {
      id: 1,
      question: "Where did you lose your passport?",
      options: ["Hotel/Accommodation", "Airport", "Public Transport", "Stolen", "Other"],
    },
    {
      id: 2,
      question: "Have you reported it to the police?",
      options: ["Yes, I have a police report", "No, not yet", "I don't know how"],
    },
    {
      id: 3,
      question: "Do you have backup identification?",
      options: ["Yes, I have copies", "No backup documents", "Only digital copies"],
    },
  ],
  visa: [
    {
      id: 1,
      question: "What type of visa issue are you facing?",
      options: ["Overstay", "Expired visa", "Wrong visa type", "Visa rejection"],
    },
    {
      id: 2,
      question: "How long has your visa been expired/invalid?",
      options: ["Less than 30 days", "1-3 months", "More than 3 months", "Not sure"],
    },
    {
      id: 3,
      question: "Have you contacted immigration authorities?",
      options: ["Yes, already contacted", "No, haven't contacted", "Tried but no response"],
    },
  ],
  fine: [
    {
      id: 1,
      question: "What type of fine did you receive?",
      options: ["Traffic violation", "Parking fine", "Public behavior", "Other violation"],
    },
    {
      id: 2,
      question: "Do you understand the reason for the fine?",
      options: ["Yes, I understand", "Partially understand", "No, unclear", "Language barrier"],
    },
    {
      id: 3,
      question: "When is the payment deadline?",
      options: ["Within 7 days", "Within 30 days", "More than 30 days", "Not specified"],
    },
  ],
  behavior: [
    {
      id: 1,
      question: "What type of behavior issue occurred?",
      options: ["Dress code violation", "Public display of affection", "Alcohol related", "Cultural misunderstanding"],
    },
    {
      id: 2,
      question: "Were you warned by authorities?",
      options: ["Yes, received warning", "No warning given", "Immediate action taken", "Not sure"],
    },
    {
      id: 3,
      question: "Are you currently in custody or detained?",
      options: ["Yes, currently detained", "No, but summoned", "Released with warning", "No action taken"],
    },
  ],
  accident: [
    {
      id: 1,
      question: "What type of accident occurred?",
      options: ["Car collision", "Pedestrian involved", "Property damage only", "Hit and run"],
    },
    {
      id: 2,
      question: "Were there any injuries?",
      options: ["No injuries", "Minor injuries", "Serious injuries", "Fatalities"],
    },
    {
      id: 3,
      question: "Have police been contacted?",
      options: ["Yes, police on scene", "Police report filed", "No police involved", "Waiting for police"],
    },
  ],
}

export default function WizardPage() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showSolution, setShowSolution] = useState(false)

  const handleScenarioSelect = (scenarioId: string) => {
    setSelectedScenario(scenarioId)
    setCurrentStep(0)
    setAnswers([])
    setShowSolution(false)
  }

  const handleAnswer = (answer: string) => {
    if (!selectedScenario) return

    const steps = wizardSteps[selectedScenario]
    if (!steps || !steps[currentStep]) return

    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)

    const currentStepData = steps[currentStep]

    if (currentStepData.nextStep && currentStepData.nextStep[answer]) {
      const nextStepIndex = currentStepData.nextStep[answer] - 1
      if (nextStepIndex < steps.length) {
        setCurrentStep(nextStepIndex)
      } else {
        setShowSolution(true)
      }
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowSolution(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setAnswers(answers.slice(0, -1))
    } else {
      setSelectedScenario(null)
      setAnswers([])
      setShowSolution(false)
    }
  }

  const getSolution = (): Solution => {
    const solutions: { [key: string]: Solution } = {
      arrested: {
        title: "Immediate Actions for Arrest Situation",
        steps: [
          "Remain calm and cooperate with authorities",
          "Exercise your right to remain silent",
          "Request to contact your embassy immediately",
          "Ask for legal representation",
          "Do not sign any documents without a lawyer present",
        ],
        urgency: "high",
        contacts: ["Embassy: +971-4-309-4000", "Legal Aid: +971-4-606-6666"],
      },
      passport: {
        title: "Lost Passport Recovery Process",
        steps: [
          "Report the loss to local police immediately",
          "Contact your embassy or consulate",
          "Gather required documents (photos, ID copies)",
          "Apply for emergency travel document",
          "Update immigration authorities if required",
        ],
        urgency: "medium",
        contacts: ["Embassy: +971-4-309-4000", "Police: 999"],
      },
      visa: {
        title: "Visa Issue Resolution Steps",
        steps: [
          "Contact immigration authorities immediately",
          "Gather all visa-related documents",
          "Prepare explanation for the violation",
          "Consider hiring an immigration lawyer",
          "Apply for visa extension or renewal if possible",
        ],
        urgency: "high",
        contacts: ["Immigration: +971-4-313-9999", "Legal Aid: +971-4-606-6666"],
      },
      fine: {
        title: "Fine Payment and Appeal Process",
        steps: [
          "Read the fine notice carefully",
          "Understand the violation and penalty",
          "Pay within the specified deadline",
          "Consider appealing if you believe it's unjust",
          "Keep all payment receipts",
        ],
        urgency: "medium",
        contacts: ["Traffic Department: +971-4-609-9999", "Legal Aid: +971-4-606-6666"],
      },
      behavior: {
        title: "Cultural Violation Response",
        steps: [
          "Apologize and show respect for local customs",
          "Comply with any immediate requests",
          "Learn about local cultural norms",
          "Seek legal advice if charges are filed",
          "Contact your embassy if detained",
        ],
        urgency: "medium",
        contacts: ["Embassy: +971-4-309-4000", "Cultural Center: +971-4-123-4567"],
      },
      accident: {
        title: "Traffic Accident Procedures",
        steps: [
          "Ensure safety and call emergency services",
          "Do not move vehicles unless instructed",
          "Exchange information with other parties",
          "Take photos of the scene and damage",
          "File a police report",
          "Contact your insurance company",
        ],
        urgency: "high",
        contacts: ["Emergency: 999", "Police: 901", "Insurance: Check your policy"],
      },
    }

    return solutions[selectedScenario!] || solutions.arrested
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

  // Get current steps safely
  const currentSteps = selectedScenario ? wizardSteps[selectedScenario] || [] : []
  const totalSteps = currentSteps.length
  const currentStepData = currentSteps[currentStep]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-800 px-4 bg-gray-900">
        <SidebarTrigger className="-ml-1 text-white hover:bg-gray-800" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <span className="text-2xl">❓</span>
          <h1 className="text-lg font-semibold text-purple-400">Situation Wizard</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Scenario Selection */}
        {!selectedScenario && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">What's Your Situation?</h2>
              <p className="text-gray-400 text-lg">
                Select the scenario that best describes your current legal situation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  onClick={() => handleScenarioSelect(scenario.id)}
                  className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-orange-500 cursor-pointer transition-all hover:scale-105"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">{scenario.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{scenario.title}</h3>
                    <p className="text-gray-400 text-sm">{scenario.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wizard Steps */}
        {selectedScenario && !showSolution && currentStepData && (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                <span className="text-gray-400">
                  Step {currentStep + 1} of {totalSteps}
                </span>
              </div>

              <div className="bg-gray-800 rounded-full h-2 mb-6">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-orange-500" />
                {currentStepData.question}
              </h3>

              <div className="space-y-3">
                {currentStepData.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    variant="outline"
                    className="w-full text-left justify-start p-4 h-auto border-gray-600 text-gray-300 hover:border-orange-500 hover:bg-gray-800"
                  >
                    <ArrowRight className="w-4 h-4 mr-3 flex-shrink-0" />
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            {answers.length > 0 && (
              <div className="mt-6 bg-gray-900 rounded-lg p-4 border border-gray-800">
                <h4 className="font-semibold mb-2">Your Answers:</h4>
                <div className="flex flex-wrap gap-2">
                  {answers.map((answer, index) => (
                    <span key={index} className="bg-orange-500 text-black px-3 py-1 rounded-full text-sm">
                      {answer}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Solution Display */}
        {showSolution && (
          <div>
            <div className="mb-6">
              <Button
                onClick={() => setSelectedScenario(null)}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Start Over
              </Button>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    {getSolution().title}
                  </h3>
                  <div
                    className={`px-3 py-1 rounded-full border text-sm font-medium ${getUrgencyColor(getSolution().urgency)}`}
                  >
                    {getSolution().urgency.toUpperCase()} PRIORITY
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Immediate Action Steps:</h4>
                  <ol className="space-y-2">
                    {getSolution().steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="bg-orange-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Emergency Contacts:</h4>
                  <div className="space-y-2">
                    {getSolution().contacts.map((contact, index) => (
                      <div key={index} className="bg-gray-800 rounded p-3 font-mono text-sm">
                        {contact}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button asChild className="bg-orange-500 hover:bg-orange-600 text-black">
                    <a href="/chat">Chat with LawBot</a>
                  </Button>
                  <Button asChild variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                    <a href="/emergency">Find Legal Help</a>
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                    Save Solution
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
