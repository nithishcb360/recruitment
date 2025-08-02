"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, Link, Plus, Trash } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"

interface InterviewSchedulerProps {
  candidateName?: string
  jobTitle?: string
  onScheduleSuccess?: () => void
  onClose?: () => void
}

export default function InterviewScheduler({
  candidateName = "New Candidate",
  jobTitle = "General Role",
  onScheduleSuccess,
  onClose,
}: InterviewSchedulerProps) {
  const [interviewDetails, setInterviewDetails] = useState({
    candidate: candidateName,
    job: jobTitle,
    type: "",
    date: new Date(),
    time: "",
    duration: "60", // minutes
    interviewers: [{ id: 1, email: "" }],
    notes: "",
    sendCalendarInvite: true,
    sendConfirmationEmail: true,
  })

  // Mock data for interviewers
  const mockInterviewers = [
    { id: "int1", name: "Alice Smith", email: "alice.smith@example.com" },
    { id: "int2", name: "Bob Johnson", email: "bob.johnson@example.com" },
    { id: "int3", name: "Charlie Brown", email: "charlie.brown@example.com" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setInterviewDetails((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setInterviewDetails((prev) => ({ ...prev, [id]: value }))
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setInterviewDetails((prev) => ({ ...prev, date }))
    }
  }

  const handleInterviewerChange = (id: number, email: string) => {
    setInterviewDetails((prev) => ({
      ...prev,
      interviewers: prev.interviewers.map((interviewer) =>
        interviewer.id === id ? { ...interviewer, email } : interviewer,
      ),
    }))
  }

  const addInterviewer = () => {
    setInterviewDetails((prev) => ({
      ...prev,
      interviewers: [
        ...prev.interviewers,
        { id: prev.interviewers.length ? Math.max(...prev.interviewers.map((i) => i.id)) + 1 : 1, email: "" },
      ],
    }))
  }

  const removeInterviewer = (id: number) => {
    setInterviewDetails((prev) => ({
      ...prev,
      interviewers: prev.interviewers.filter((interviewer) => interviewer.id !== id),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Scheduling Interview:", interviewDetails)
    alert("Interview scheduled successfully! (Simulated)")
    onScheduleSuccess?.()
    onClose?.()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>Schedule Interview</CardTitle>
        <CardDescription>
          Set up an interview for {candidateName} for the {jobTitle} role.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="candidate">Candidate</Label>
              <Input id="candidate" value={interviewDetails.candidate} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job">Job Role</Label>
              <Input id="job" value={interviewDetails.job} disabled />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Interview Type</Label>
            <Select value={interviewDetails.type} onValueChange={(val) => handleSelectChange("type", val)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select interview type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone-screen">Phone Screen</SelectItem>
                <SelectItem value="technical">Technical Interview</SelectItem>
                <SelectItem value="behavioral">Behavioral Interview</SelectItem>
                <SelectItem value="final-round">Final Round Interview</SelectItem>
                <SelectItem value="cultural-fit">Cultural Fit Interview</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${
                      !interviewDetails.date && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {interviewDetails.date ? format(interviewDetails.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={interviewDetails.date} onSelect={handleDateSelect} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" value={interviewDetails.time} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select value={interviewDetails.duration} onValueChange={(val) => handleSelectChange("duration", val)}>
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">120 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Interviewers</Label>
            {interviewDetails.interviewers.map((interviewer, index) => (
              <div key={interviewer.id} className="flex items-center gap-2">
                <Select value={interviewer.email} onValueChange={(val) => handleInterviewerChange(interviewer.id, val)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select interviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockInterviewers.map((mockInterviewer) => (
                      <SelectItem key={mockInterviewer.id} value={mockInterviewer.email}>
                        {mockInterviewer.name} ({mockInterviewer.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {interviewDetails.interviewers.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removeInterviewer(interviewer.id)}>
                    <Trash className="h-4 w-4 text-red-600" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addInterviewer} className="w-full mt-2 bg-transparent">
              <Plus className="mr-2 h-4 w-4" /> Add Interviewer
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea
              id="notes"
              value={interviewDetails.notes}
              onChange={handleInputChange}
              placeholder="Add any internal notes for the interviewers..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendCalendarInvite"
                checked={interviewDetails.sendCalendarInvite}
                onCheckedChange={(checked) =>
                  setInterviewDetails((prev) => ({ ...prev, sendCalendarInvite: Boolean(checked) }))
                }
              />
              <Label htmlFor="sendCalendarInvite">Send Calendar Invite to Candidate & Interviewers</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendConfirmationEmail"
                checked={interviewDetails.sendConfirmationEmail}
                onCheckedChange={(checked) =>
                  setInterviewDetails((prev) => ({ ...prev, sendConfirmationEmail: Boolean(checked) }))
                }
              />
              <Label htmlFor="sendConfirmationEmail">Send Confirmation Email to Candidate</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} className="bg-transparent">
              Cancel
            </Button>
            <Button type="submit">
              <Link className="mr-2 h-4 w-4" /> Schedule Interview
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
