"use client"

import type React from "react"
import { Upload } from "lucide-react" // New: Import Upload component

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Send, Trash, Sparkles, RefreshCw, Hash, MessageSquareText, Loader2 } from "lucide-react"
import { getDepartments, createJob, type Department, type JobCreateData } from "@/lib/api/jobs"
import { getFeedbackTemplates, type FeedbackTemplate } from "@/lib/api/feedback-templates"
import { useToast } from "@/hooks/use-toast"

export default function JobCreationForm() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("details")
  const [jobDetails, setJobDetails] = useState({
    title: "",
    department: "",
    level: "", // Experience Level
    location: "",
    workType: "", // Work Type
    minSalary: "",
    maxSalary: "",
    experienceRange: "", // Experience Range
  })
  const [jobDescription, setJobDescription] = useState("")
  const [requirements, setRequirements] = useState("")
  const [keywords, setKeywords] = useState<string[]>([])
  const [screeningQuestions, setScreeningQuestions] = useState([
    { id: 1, question: "How many years of experience do you have with React?", type: "text" },
    { id: 2, question: "Are you willing to relocate to San Francisco?", type: "yes/no" },
  ])
  const [selectedFeedbackForm, setSelectedFeedbackForm] = useState("")
  const [publishOptions, setPublishOptions] = useState({
    internal: true,
    externalPortals: false,
    companyWebsite: true,
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // API Data
  const [departments, setDepartments] = useState<Department[]>([])
  const [feedbackTemplates, setFeedbackTemplates] = useState<FeedbackTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch departments and feedback templates on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [departmentsResponse, templatesResponse] = await Promise.all([
          getDepartments(),
          getFeedbackTemplates()
        ])
        setDepartments(departmentsResponse.results)
        setFeedbackTemplates(templatesResponse.results)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: "Error",
          description: "Failed to load form data. Please refresh the page.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setJobDetails((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setJobDetails((prev) => ({ ...prev, [id]: value }))
  }

  const handleQuestionChange = (id: number, field: string, value: string) => {
    setScreeningQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  const addQuestion = () => {
    setScreeningQuestions((prev) => [
      ...prev,
      { id: prev.length ? Math.max(...prev.map((q) => q.id)) + 1 : 1, question: "", type: "text" },
    ])
  }

  const removeQuestion = (id: number) => {
    setScreeningQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const addKeyword = (keyword: string) => {
    if (keyword && !keywords.includes(keyword)) {
      setKeywords([...keywords, keyword])
    }
  }

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword))
  }

  const generateJobDescription = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setJobDescription(`We are seeking a highly skilled Senior Frontend Developer to join our dynamic engineering team. In this role, you will be responsible for developing and maintaining cutting-edge web applications using modern JavaScript frameworks.

Key Responsibilities:
• Develop responsive and performant web applications using React, TypeScript, and Next.js
• Collaborate with UX/UI designers to implement pixel-perfect designs
• Optimize applications for maximum speed and scalability
• Write clean, maintainable, and well-documented code
• Participate in code reviews and mentor junior developers
• Stay up-to-date with the latest frontend technologies and best practices

Required Qualifications:
• 5+ years of experience in frontend development
• Expert knowledge of React, TypeScript, and modern JavaScript (ES6+)
• Experience with state management libraries (Redux, Zustand, or similar)
• Proficiency in CSS-in-JS solutions and responsive design
• Experience with testing frameworks (Jest, React Testing Library)
• Strong understanding of web performance optimization
• Bachelor's degree in Computer Science or equivalent experience

Preferred Qualifications:
• Experience with Next.js and server-side rendering
• Knowledge of GraphQL and modern API integration
• Experience with CI/CD pipelines and deployment processes
• Familiarity with design systems and component libraries
• Previous experience in a fast-paced startup environment.`)
      setIsGenerating(false)
    }, 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!jobDetails.title || !jobDetails.department || !jobDescription) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Title, Department, Description).",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      const jobData: JobCreateData = {
        title: jobDetails.title,
        department: parseInt(jobDetails.department),
        description: jobDescription,
        requirements: requirements || "Requirements to be updated",
        responsibilities: "Responsibilities to be updated",
        job_type: "full_time",
        experience_level: jobDetails.level || "mid",
        location: jobDetails.location || "Remote",
        work_type: jobDetails.workType || "remote",
        is_remote: jobDetails.workType === "remote",
        salary_min: jobDetails.minSalary ? parseFloat(jobDetails.minSalary) : undefined,
        salary_max: jobDetails.maxSalary ? parseFloat(jobDetails.maxSalary) : undefined,
        salary_currency: "USD",
        show_salary: !!(jobDetails.minSalary || jobDetails.maxSalary),
        required_skills: keywords,
        preferred_skills: [],
        urgency: "medium",
        openings: 1,
        sla_days: 21,
        screening_questions: screeningQuestions,
        feedback_template: selectedFeedbackForm ? parseInt(selectedFeedbackForm) : undefined,
        publish_internal: publishOptions.internal,
        publish_external: publishOptions.externalPortals,
        publish_company_website: publishOptions.companyWebsite,
      }

      const createdJob = await createJob(jobData)
      
      toast({
        title: "Success!",
        description: `Job "${createdJob.title}" has been created successfully.`,
        variant: "default"
      })

      // Reset form
      setJobDetails({
        title: "",
        department: "",
        level: "",
        location: "",
        workType: "",
        minSalary: "",
        maxSalary: "",
        experienceRange: "",
      })
      setJobDescription("")
      setRequirements("")
      setKeywords([])
      setScreeningQuestions([])
      setSelectedFeedbackForm("")
      setActiveTab("details")
      
    } catch (error: any) {
      console.error('Error creating job:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create job. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Create New Job Posting</h2>
      <p className="text-gray-600">
        Define the details, description, screening questions, and publishing options for your new job.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">1. Job Details</TabsTrigger>
          <TabsTrigger value="description">2. Job Description</TabsTrigger>
          <TabsTrigger value="screening">3. Screening</TabsTrigger>
          <TabsTrigger value="publish">4. Publish</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>Enter the basic information for your job posting.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={jobDetails.title}
                  onChange={handleDetailChange}
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={jobDetails.department} onValueChange={(val) => handleSelectChange("department", val)}>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem value="loading" disabled>Loading departments...</SelectItem>
                      ) : (
                        departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Experience Level</Label>
                  <Select value={jobDetails.level} onValueChange={(val) => handleSelectChange("level", val)}>
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                      <SelectItem value="lead">Lead/Principal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={jobDetails.location}
                    onChange={handleDetailChange}
                    placeholder="e.g., Remote, New York, NY"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workType">Work Type</Label>
                  <Select value={jobDetails.workType} onValueChange={(val) => handleSelectChange("workType", val)}>
                    <SelectTrigger id="workType">
                      <SelectValue placeholder="Select work type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minSalary">Min Salary</Label>
                  <Input
                    id="minSalary"
                    type="number"
                    value={jobDetails.minSalary}
                    onChange={handleDetailChange}
                    placeholder="80000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxSalary">Max Salary</Label>
                  <Input
                    id="maxSalary"
                    type="number"
                    value={jobDetails.maxSalary}
                    onChange={handleDetailChange}
                    placeholder="120000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experienceRange">Experience Range</Label>
                <Select
                  value={jobDetails.experienceRange}
                  onValueChange={(val) => handleSelectChange("experienceRange", val)}
                >
                  <SelectTrigger id="experienceRange">
                    <SelectValue placeholder="Select experience range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 Years</SelectItem>
                    <SelectItem value="1-3">1-3 Years</SelectItem>
                    <SelectItem value="3-5">3-5 Years</SelectItem>
                    <SelectItem value="5-8">5-8 Years</SelectItem>
                    <SelectItem value="8-10">8-10 Years</SelectItem>
                    <SelectItem value="10+">10+ Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setActiveTab("description")}>Next: Job Description</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="description" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>Job Description</span>
              </CardTitle>
              <CardDescription>Create or generate a comprehensive job description.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4 mb-4">
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload JD
                </Button>
                <Button onClick={generateJobDescription} disabled={isGenerating} className="flex-1">
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Job Description</Label>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  className="text-sm"
                  placeholder="Enter job description or generate with AI..."
                />
              </div>

              <div className="space-y-2">
                <Label>Requirements</Label>
                <Textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  rows={6}
                  className="text-sm"
                  placeholder="List the required qualifications, skills, and experience..."
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center">
                  <Hash className="h-4 w-4 mr-2" />
                  Keywords/Skills
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {keywords.map((keyword) => (
                    <div key={keyword} className="px-2 py-1 bg-secondary text-white rounded flex items-center">
                      {keyword}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => removeKeyword(keyword)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add keyword or skill"
                    id="keyword"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addKeyword((e.target as HTMLInputElement).value)
                        ;(e.target as HTMLInputElement).value = ""
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      const input = document.getElementById("keyword") as HTMLInputElement
                      addKeyword(input.value)
                      input.value = ""
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("details")}>
                  Previous
                </Button>
                <Button onClick={() => setActiveTab("screening")}>Next: Screening</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="screening" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquareText className="h-5 w-5 text-primary" />
                <span>Screening & Feedback</span>
              </CardTitle>
              <CardDescription>Add questions for initial candidate screening and link feedback forms.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-md font-semibold">Automated Screening Questions</h3>
                {screeningQuestions.map((q, index) => (
                  <div key={q.id} className="flex items-end gap-2 p-3 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`question-${q.id}`}>Question {index + 1}</Label>
                      <Input
                        id={`question-${q.id}`}
                        value={q.question}
                        onChange={(e) => handleQuestionChange(q.id, "question", e.target.value)}
                        placeholder="e.g., What is your experience with React?"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`type-${q.id}`}>Type</Label>
                      <Select value={q.type} onValueChange={(val) => handleQuestionChange(q.id, "type", val)}>
                        <SelectTrigger id={`type-${q.id}`} className="w-[120px]">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="yes/no">Yes/No</SelectItem>
                          <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                          <SelectItem value="audio">Audio Response</SelectItem>
                          <SelectItem value="video">Video Response</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeQuestion(q.id)}>
                      <Trash className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" onClick={addQuestion} className="w-full bg-transparent">
                <Plus className="mr-2 h-4 w-4" /> Add Question
              </Button>

              <div className="space-y-2 pt-4">
                <h3 className="text-md font-semibold">Link Feedback Form</h3>
                <Label htmlFor="feedback-form">Select Feedback Form Template</Label>
                <Select value={selectedFeedbackForm} onValueChange={setSelectedFeedbackForm}>
                  <SelectTrigger id="feedback-form">
                    <SelectValue placeholder="Choose a feedback form" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>Loading templates...</SelectItem>
                    ) : (
                      feedbackTemplates
                        .filter(template => template.status === 'published')
                        .map((template) => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.name}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  This form will be used by interviewers to submit feedback for candidates applying to this job.
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setActiveTab("description")}>
                  Previous
                </Button>
                <Button onClick={() => setActiveTab("publish")}>Next: Publish</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="publish" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Publish Options</CardTitle>
              <CardDescription>Choose where and how to publish your job posting.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Publish To:</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="internal"
                    checked={publishOptions.internal}
                    onCheckedChange={(checked) =>
                      setPublishOptions((prev) => ({ ...prev, internal: Boolean(checked) }))
                    }
                  />
                  <Label htmlFor="internal">Internal Job Board</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="externalPortals"
                    checked={publishOptions.externalPortals}
                    onCheckedChange={(checked) =>
                      setPublishOptions((prev) => ({ ...prev, externalPortals: Boolean(checked) }))
                    }
                  />
                  <Label htmlFor="externalPortals">External Job Portals (e.g., Indeed, LinkedIn)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="companyWebsite"
                    checked={publishOptions.companyWebsite}
                    onCheckedChange={(checked) =>
                      setPublishOptions((prev) => ({ ...prev, companyWebsite: Boolean(checked) }))
                    }
                  />
                  <Label htmlFor="companyWebsite">Company Website Careers Page</Label>
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setActiveTab("screening")}>
                  Previous
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting || isLoading}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Job...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Create Job
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
