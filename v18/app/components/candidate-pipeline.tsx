"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"
import CandidateCard from "./candidate-card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import InterviewScheduler from "./interview-scheduler"
import BulkCandidateUpload from "./bulk-candidate-upload"
import { UploadCloud } from "lucide-react"
import { Loader2 } from "lucide-react" // Import Loader2 for loading state

interface Candidate {
  id: number
  name: string
  jobTitle: string
  stage: string
  rating: number
  lastActivity: string
  avatar?: string
  email: string
  phone: string
  location: string
  totalExperience: number
  relevantExperience: number
  skillExperience: { skill: string; years: number }[]
  expectedSalary: string
  noticePeriod: string
  resumeLink: string
  linkedinProfile: string
  notes: string
  interviewHistory: { date: string; type: string; outcome: string }[]
  feedbackSummary: string
  progress: number
}

interface Job {
  id: number
  title: string
  department: string
}

interface CandidatePipelineProps {
  selectedJobId?: number | null
}

export default function CandidatePipeline({ selectedJobId = null }: CandidatePipelineProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]) // Initialize as empty array
  const [loading, setLoading] = useState(true) // Add loading state
  const [error, setError] = useState<string | null>(null) // Add error state

  const [searchTerm, setSearchTerm] = useState("")
  const [filterJob, setFilterJob] = useState<string | null>(selectedJobId ? String(selectedJobId) : null)
  const [filterStage, setFilterStage] = useState<string | null>(null)
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false)
  const [selectedCandidateForSchedule, setSelectedCandidateForSchedule] = useState<Candidate | null>(null)
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false)

  // Mock jobs for filtering (these would also ideally come from an API)
  const mockJobs: Job[] = [
    { id: 1, title: "Senior Frontend Developer", department: "Engineering" },
    { id: 2, title: "Product Manager", department: "Product" },
    { id: 3, title: "UX Designer", department: "Design" },
    { id: 4, title: "Backend Engineer", department: "Engineering" },
    { id: 5, title: "DevOps Engineer", department: "Engineering" },
  ]

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/candidates") // Fetch from our new API route
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: Candidate[] = await response.json()
        setCandidates(data)
      } catch (e: any) {
        setError(e.message)
        console.error("Failed to fetch candidates:", e)
      } finally {
        setLoading(false)
      }
    }

    fetchCandidates()
  }, []) // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (selectedJobId) {
      setFilterJob(String(selectedJobId))
    }
  }, [selectedJobId])

  const stages = ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"]

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch = searchTerm
      ? candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    const matchesJob = filterJob
      ? candidate.jobTitle === mockJobs.find((job) => String(job.id) === filterJob)?.title
      : true
    const matchesStage = filterStage ? candidate.stage === filterStage : true
    return matchesSearch && matchesJob && matchesStage
  })

  const handleAdvanceStage = (candidateId: number) => {
    setCandidates((prevCandidates) =>
      prevCandidates.map((candidate) => {
        if (candidate.id === candidateId) {
          const currentIndex = stages.indexOf(candidate.stage)
          if (currentIndex < stages.length - 2) {
            // Don't advance past 'Offer' automatically
            const nextStage = stages[currentIndex + 1]
            alert(`Candidate ${candidate.name} advanced to ${nextStage}! (Simulated)`)
            return { ...candidate, stage: nextStage, progress: candidate.progress + 20 }
          } else if (candidate.stage === "Offer") {
            alert(`Candidate ${candidate.name} moved to Hired! (Simulated)`)
            return { ...candidate, stage: "Hired", progress: 100 }
          }
        }
        return candidate
      }),
    )
  }

  const handleRejectCandidate = (candidateId: number) => {
    setCandidates((prevCandidates) =>
      prevCandidates.map((candidate) => {
        if (candidate.id === candidateId) {
          alert(`Candidate ${candidate.name} rejected! (Simulated)`)
          return { ...candidate, stage: "Rejected", progress: 0 }
        }
        return candidate
      }),
    )
  }

  const handleViewDetails = (candidateId: number) => {
    // In a real app, this would navigate to a detailed candidate profile page
    alert(`Viewing details for candidate ID: ${candidateId} (Simulated)`)
    console.log(
      "Candidate details:",
      candidates.find((c) => c.id === candidateId),
    )
  }

  const handleScheduleInterviewClick = (candidate: Candidate) => {
    setSelectedCandidateForSchedule(candidate)
    setIsSchedulerOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Candidate Pipeline</h1>
        <p className="text-muted-foreground">Manage and track candidates through your hiring process.</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Filter Candidates</CardTitle>
          <CardDescription>Narrow down candidates by search term, job, or stage.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name, job title, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-[200px]">
            <Select value={filterJob || ""} onValueChange={setFilterJob}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by Job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {mockJobs.map((job) => (
                  <SelectItem key={job.id} value={String(job.id)}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-[200px]">
            <Select value={filterStage || ""} onValueChange={setFilterStage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {stages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            className="w-full md:w-auto bg-transparent"
            onClick={() => {
              setSearchTerm("")
              setFilterJob(null)
              setFilterStage(null)
            }}
          >
            <Filter className="mr-2 h-4 w-4" /> Reset Filters
          </Button>
          <Button
            variant="default" // Changed to default for prominence
            className="w-full md:w-auto"
            onClick={() => setIsBulkUploadOpen(true)}
          >
            <UploadCloud className="mr-2 h-4 w-4" /> Bulk Upload
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="ml-4 text-lg text-muted-foreground">Loading candidates...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">
          <p>Error loading candidates: {error}</p>
          <p>Please try refreshing the page.</p>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="col-span-full text-center text-muted-foreground py-8">
          No candidates found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onViewDetails={handleViewDetails}
              onAdvanceStage={handleAdvanceStage}
              onRejectCandidate={handleRejectCandidate}
            />
          ))}
        </div>
      )}

      <Dialog open={isSchedulerOpen} onOpenChange={setIsSchedulerOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
          </DialogHeader>
          {selectedCandidateForSchedule && (
            <InterviewScheduler
              candidateName={selectedCandidateForSchedule.name}
              jobTitle={selectedCandidateForSchedule.jobTitle}
              onScheduleSuccess={() => {
                setIsSchedulerOpen(false)
                setSelectedCandidateForSchedule(null)
              }}
              onClose={() => setIsSchedulerOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
        <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Candidate Upload</DialogTitle>
          </DialogHeader>
          <BulkCandidateUpload onClose={() => setIsBulkUploadOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
