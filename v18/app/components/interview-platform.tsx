"use client"

import { SelectItem } from "@/components/ui/select"
import { SelectContent } from "@/components/ui/select"
import { SelectValue } from "@/components/ui/select"
import { SelectTrigger } from "@/components/ui/select"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Mic, Video, PhoneOff, Play, Square } from "lucide-react"

export default function InterviewPlatform() {
  const [activeTab, setActiveTab] = useState("interview")
  const [interviewNotes, setInterviewNotes] = useState("")
  const [isRecording, setIsRecording] = useState(false)

  // Mock interview data
  const candidate = {
    name: "Sarah Johnson",
    jobTitle: "Senior Frontend Developer",
    interviewType: "Technical Interview",
    date: "March 10, 2024",
    time: "10:00 AM PST",
    meetingLink: "#", // Placeholder for actual meeting link
  }

  const interviewQuestions = [
    {
      id: 1,
      category: "Technical",
      question: "Explain the difference between `useState` and `useReducer` in React.",
    },
    {
      id: 2,
      category: "Technical",
      question: "Describe a challenging bug you've faced and how you debugged it.",
    },
    {
      id: 3,
      category: "Behavioral",
      question: "Tell me about a time you had to work with a difficult team member.",
    },
    {
      id: 4,
      category: "System Design",
      question: "Design a scalable notification system for a social media application.",
    },
  ]

  const mockTranscript = `
  [00:00:05] Interviewer: Welcome, Sarah. Thanks for joining. Let's start with a technical question. Can you explain the difference between useState and useReducer in React?
  [00:00:15] Candidate: Sure. useState is a basic hook for managing simple state in functional components. It returns a stateful value and a function to update it. It's great for primitive values or simple objects.
  [00:00:30] Candidate: useReducer, on the other hand, is more suitable for complex state logic, especially when the next state depends on the previous one, or when you have multiple sub-values. It's similar to Redux, where you have a reducer function that takes the current state and an action, and returns the new state.
  [00:00:50] Interviewer: Excellent explanation. When would you choose one over the other?
  [00:00:55] Candidate: I'd typically use useState for simple toggles, counters, or form inputs. For more complex scenarios, like managing a shopping cart, or when state transitions are more intricate, useReducer provides a more predictable and testable pattern. It also helps avoid prop drilling for deeply nested components by centralizing state logic.
  [00:01:20] Interviewer: That makes sense. Now, let's move on to a behavioral question...
  `

  const handleStartRecording = () => {
    setIsRecording(true)
    console.log("Recording started... (Simulated)")
    // In a real app, this would initiate actual audio/video capture and streaming to a backend service.
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    console.log("Recording stopped. (Simulated)")
    // In a real app, this would stop recording, process the streams, and save the recording.
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Interview Platform</h1>
        <p className="text-muted-foreground">Conduct and manage live candidate interviews.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interview Session: {candidate.name}</CardTitle>
          <CardDescription>
            {candidate.jobTitle} • {candidate.interviewType} • {candidate.date} at {candidate.time}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="interview">Interview</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
            </TabsList>

            <TabsContent value="interview" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Video Call Area */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-muted-foreground text-lg relative overflow-hidden">
                    <img
                      src="/placeholder.svg?height=400&width=600&text=Video+Call+Area"
                      alt="Video Call Placeholder"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-4">
                      <Button size="icon" className="rounded-full bg-red-500 hover:bg-red-600">
                        <PhoneOff className="h-5 w-5" />
                      </Button>
                      <Button size="icon" className="rounded-full">
                        <Mic className="h-5 w-5" />
                      </Button>
                      <Button size="icon" className="rounded-full">
                        <Video className="h-5 w-5" />
                      </Button>
                      {isRecording ? (
                        <Button
                          size="icon"
                          className="rounded-full bg-red-500 hover:bg-red-600"
                          onClick={handleStopRecording}
                        >
                          <Square className="h-5 w-5" />
                        </Button>
                      ) : (
                        <Button
                          size="icon"
                          className="rounded-full bg-green-500 hover:bg-green-600"
                          onClick={handleStartRecording}
                        >
                          <Play className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => window.open(candidate.meetingLink, "_blank")}>
                    Join Meeting (External Link)
                  </Button>
                </div>

                {/* Questions & Notes Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border p-3 font-semibold text-left">
                      Interview Questions
                      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 space-y-2 rounded-md border p-3">
                      {interviewQuestions.map((q) => (
                        <div key={q.id} className="text-sm">
                          <p className="font-medium">{q.question}</p>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {q.category}
                          </Badge>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border p-3 font-semibold text-left">
                      Interview Notes
                      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <Textarea
                        placeholder="Type your notes here..."
                        value={interviewNotes}
                        onChange={(e) => setInterviewNotes(e.target.value)}
                        rows={8}
                        className="w-full"
                      />
                      <Button className="mt-2 w-full">Save Notes</Button>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="feedback" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Submit Feedback</CardTitle>
                  <CardDescription>Provide your assessment for {candidate.name}.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="overall-rating">Overall Rating (1-5)</Label>
                    <Select>
                      <SelectTrigger id="overall-rating">
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Poor</SelectItem>
                        <SelectItem value="2">2 - Below Average</SelectItem>
                        <SelectItem value="3">3 - Average</SelectItem>
                        <SelectItem value="4">4 - Good</SelectItem>
                        <SelectItem value="5">5 - Excellent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="strengths">Strengths</Label>
                    <Textarea id="strengths" placeholder="Candidate's key strengths..." rows={4} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weaknesses">Areas for Improvement</Label>
                    <Textarea id="weaknesses" placeholder="Areas where the candidate could improve..." rows={4} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recommendation">Recommendation</Label>
                    <Select>
                      <SelectTrigger id="recommendation">
                        <SelectValue placeholder="Select recommendation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hire">Strong Hire</SelectItem>
                        <SelectItem value="consider">Consider for next round</SelectItem>
                        <SelectItem value="no-hire">No Hire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">Submit Feedback</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transcript" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Interview Transcript</CardTitle>
                  <CardDescription>AI-generated transcript of the interview.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-md text-sm max-h-[500px] overflow-y-auto whitespace-pre-wrap">
                    {mockTranscript}
                  </div>
                  <Button variant="outline" className="mt-4 w-full bg-transparent">
                    Download Transcript
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
