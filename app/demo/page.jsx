"use client"

import { useEffect, useRef, useState } from "react"
import { CalendarDays, Mic, MicOff, Volume2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
// Fix the import to handle both named and default export
import {useMobile} from "@/hooks/use-mobile"

// Define the conversation flow
const conversationFlow = [
  {
    question: "Hello! I'm calling about the software developer position you applied for. Is this a good time to talk?",
    options: ["Yes", "No"],
    field: "goodTime",
  },
  {
    question: "Are you interested in this role?",
    options: ["Yes", "No"],
    field: "interested",
  },
  {
    question: "What is your current notice period?",
    field: "noticePeriod",
  },
  {
    question: "Can you share your current and expected CTC?",
    field: "ctc",
  },
  {
    question: "When are you available for an interview next week?",
    options: ["Monday at 10 AM", "Wednesday at 2 PM"],
    field: "interviewSlot",
  },
  {
    question:
      "Excellent! I've scheduled your interview for {interviewSlot}. You'll receive a confirmation email shortly with all the details. Is there anything else you'd like to know about the interview process?",
    options: ["Yes", "No"],
    field: "moreQuestions",
  },
  {
    question:
      "Thank you for your time. We look forward to speaking with you at your scheduled interview. Have a great day!",
    final: true,
  },
]

export default function DemoPage() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [currentStep, setCurrentStep] = useState(0)
  const [candidateData, setCandidateData] = useState({})
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [progress, setProgress] = useState(0)
  const [speechSupported, setSpeechSupported] = useState(true)
  const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState(true)
  const recognitionRef = useRef(null)
  // We'll make this optional to avoid errors during server-side rendering
  const mobile = useMobile()
  const [isMobile, setIsMobile] = useState(mobile)

  useEffect(() => {
    setIsMobile(mobile)
  }, [mobile])

  // Initialize speech recognition with better error handling
  useEffect(() => {
    // Check if browser supports speech recognition
    const hasSpeechRecognition =
      typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)

    if (!hasSpeechRecognition) {
      console.log("Speech recognition not supported in this browser")
      setSpeechSupported(false)
      return
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("")

        setTranscript(transcript)
      }

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        if (isListening) {
          try {
            recognitionRef.current.start()
          } catch (error) {
            console.error("Error restarting speech recognition:", error)
            setIsListening(false)
          }
        }
      }
    } catch (error) {
      console.error("Error initializing speech recognition:", error)
      setSpeechSupported(false)
    }

    // Check if speech synthesis is supported
    if (typeof window !== "undefined") {
      setSpeechSynthesisSupported("speechSynthesis" in window)
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (error) {
          console.error("Error stopping speech recognition:", error)
        }
      }
    }
  }, [isListening])

  // Calculate progress
  useEffect(() => {
    const newProgress = (currentStep / (conversationFlow.length - 1)) * 100
    setProgress(newProgress)
  }, [currentStep])

  // Move to next question after a delay (used as fallback when speech synthesis fails)
  const moveToNextQuestionAfterDelay = () => {
    setTimeout(() => {
      setIsSpeaking(false)
      if (!conversationFlow[currentStep].final) {
        setIsListening(true)
      }
    }, 2000)
  }

  // Text-to-speech function with better error handling and fallback
  const speak = (text) => {
    // If speech synthesis is not supported, just show the text and move on
    if (!speechSynthesisSupported) {
      console.log("Speech synthesis not supported, using fallback")
      setIsSpeaking(true)
      moveToNextQuestionAfterDelay()
      return
    }

    try {
      setIsSpeaking(true)

      // Replace placeholders with actual data
      let processedText = text
      Object.entries(candidateData).forEach(([key, value]) => {
        processedText = processedText.replace(`{${key}}`, value)
      })

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(processedText)

      utterance.onend = () => {
        setIsSpeaking(false)
        if (!conversationFlow[currentStep].final) {
          setIsListening(true)
        }
      }

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event)
        setSpeechSynthesisSupported(false)
        setIsSpeaking(false)

        // Use fallback - just show the text and move on after a delay
        moveToNextQuestionAfterDelay()
      }

      // Set a timeout in case the speech synthesis hangs
      const timeoutId = setTimeout(() => {
        console.log("Speech synthesis timeout - using fallback")
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
        if (!conversationFlow[currentStep].final) {
          setIsListening(true)
        }
      }, 5000)

      utterance.onstart = () => {
        clearTimeout(timeoutId)
      }

      window.speechSynthesis.speak(utterance)
    } catch (error) {
      console.error("Error with speech synthesis:", error)
      setSpeechSynthesisSupported(false)
      setIsSpeaking(false)

      // Use fallback - just show the text and move on after a delay
      moveToNextQuestionAfterDelay()
    }
  }

  // Start/stop listening with better error handling
  const toggleListening = () => {
    if (!speechSupported) {
      alert("Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.")
      return
    }

    if (isListening) {
      setIsListening(false)
      try {
        recognitionRef.current?.stop()
      } catch (error) {
        console.error("Error stopping speech recognition:", error)
      }
    } else {
      setIsListening(true)
      try {
        recognitionRef.current?.start()
      } catch (error) {
        console.error("Error starting speech recognition:", error)
        setIsListening(false)
      }
    }
  }

  // Process user response and move to next step
  const processResponse = () => {
    const currentQuestion = conversationFlow[currentStep]

    // Save the response to the appropriate field
    setCandidateData((prev) => ({
      ...prev,
      [currentQuestion.field]: transcript,
    }))

    // Clear transcript and stop listening
    setTranscript("")
    setIsListening(false)
    try {
      recognitionRef.current?.stop()
    } catch (error) {
      console.error("Error stopping speech recognition:", error)
    }

    // Move to next step
    if (currentStep < conversationFlow.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  // Speak the current question when step changes
  useEffect(() => {
    if (conversationFlow[currentStep]) {
      speak(conversationFlow[currentStep].question)
    }
  }, [currentStep])

  // Handle manual option selection
  const selectOption = (option) => {
    setTranscript(option)
    setTimeout(processResponse, 500)
  }

  return (
    <div className="container max-w-4xl py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Interview Scheduling Demo</CardTitle>
          <CardDescription>
            Experience our voice-driven interview scheduling assistant. Speak naturally or use the buttons to respond.
            {!speechSupported && (
              <div className="mt-2 text-amber-500">
                Note: Speech recognition is not supported in your browser. Please use the buttons to respond.
              </div>
            )}
            {!speechSynthesisSupported && (
              <div className="mt-2 text-amber-500">
                Note: Text-to-speech is not available in your browser. Please read the assistant's messages.
              </div>
            )}
          </CardDescription>
          <Progress value={progress} className="h-2 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <h3 className="font-medium mb-2">Assistant:</h3>
            <p>
              {conversationFlow[currentStep]?.question.replace(
                /\{(\w+)\}/g,
                (_, key) => candidateData[key] || `{${key}}`,
              )}
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Your Response:</h3>
            <div className="min-h-[100px] rounded-lg bg-muted p-4">
              {transcript || (isListening ? "Listening..." : "Click the microphone to speak or use the buttons below")}
            </div>
          </div>

          {conversationFlow[currentStep]?.options && (
            <div className="space-y-2">
              <h3 className="font-medium">Quick Responses:</h3>
              <div className="flex flex-wrap gap-2">
                {conversationFlow[currentStep].options.map((option, index) => (
                  <Button key={index} variant="outline" onClick={() => selectOption(option)}>
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {!conversationFlow[currentStep]?.options && !conversationFlow[currentStep]?.final && (
            <div className="space-y-2">
              <h3 className="font-medium">Sample Responses:</h3>
              <div className="flex flex-wrap gap-2">
                {currentStep === 2 && (
                  <>
                    <Button variant="outline" onClick={() => selectOption("30 days")}>
                      30 days
                    </Button>
                    <Button variant="outline" onClick={() => selectOption("60 days")}>
                      60 days
                    </Button>
                    <Button variant="outline" onClick={() => selectOption("90 days")}>
                      90 days
                    </Button>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <Button variant="outline" onClick={() => selectOption("Current: 10L, Expected: 15L")}>
                      Current: 10L, Expected: 15L
                    </Button>
                    <Button variant="outline" onClick={() => selectOption("Current: 15L, Expected: 20L")}>
                      Current: 15L, Expected: 20L
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className={isSpeaking ? "text-primary" : ""}
              disabled={isListening || !speechSynthesisSupported}
              onClick={() => {
                if (conversationFlow[currentStep]) {
                  speak(conversationFlow[currentStep].question)
                }
              }}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {isSpeaking ? "Speaking..." : speechSynthesisSupported ? "Click to repeat" : "Text-to-speech unavailable"}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className={isListening ? "bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600" : ""}
              onClick={toggleListening}
              disabled={isSpeaking || conversationFlow[currentStep]?.final || !speechSupported}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              onClick={processResponse}
              disabled={!transcript || isSpeaking || conversationFlow[currentStep]?.final}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      {currentStep === conversationFlow.length - 1 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Interview Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-1">
                <p className="text-sm font-medium">Interview Slot:</p>
                <p className="text-sm">{candidateData.interviewSlot || "Not provided"}</p>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <p className="text-sm font-medium">Notice Period:</p>
                <p className="text-sm">{candidateData.noticePeriod || "Not provided"}</p>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <p className="text-sm font-medium">CTC Details:</p>
                <p className="text-sm">{candidateData.ctc || "Not provided"}</p>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <p className="text-sm font-medium">Interested:</p>
                <p className="text-sm">{candidateData.interested || "Yes"}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => (window.location.href = "/")}>
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
