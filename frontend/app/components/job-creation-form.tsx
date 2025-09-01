// import React, { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Sparkles, RefreshCw, Hash, Trash, Upload, CheckCircle, AlertCircle } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import { apiClient } from "@/lib/api/client"

// interface JobDetails {
//   title: string
//   department: string
//   level: string
//   location: string
//   workType: string
//   minSalary: string
//   maxSalary: string
//   experienceRange: string
// }

// interface Department {
//   id: number
//   name: string
// }

// interface JobCreateRequest {
//   jobdetails: {
//     "Job Title": string
//     "Department": string
//     "Experience Level": string
//     "location": string
//     "Work Type": string
//   }
//   "job description": {
//     "job description": string
//   }
// }

// interface ApiResponse {
//   success: boolean
//   message?: string
//   data?: any
// }

// export default function JobCreationForm() {
//   const [activeTab, setActiveTab] = useState("details")
//   const [jobDetails, setJobDetails] = useState<JobDetails>({
//     title: "",
//     department: "",
//     level: "",
//     location: "",
//     workType: "",
//     minSalary: "",
//     maxSalary: "",
//     experienceRange: "",
//   })
//   const [jobDescription, setJobDescription] = useState("")
//   const [requirements, setRequirements] = useState("")
//   const [keywords, setKeywords] = useState<string[]>([])
//   const [departments, setDepartments] = useState<Department[]>([
//     { id: 1, name: "Engineering" },
//     { id: 2, name: "Marketing" },
//     { id: 3, name: "Sales" },
//     { id: 4, name: "HR" },
//     { id: 5, name: "Finance" },
//     { id: 6, name: "Design" },
//   ])
//   const [isLoading, setIsLoading] = useState(false)
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [validationErrors, setValidationErrors] = useState<string[]>([])
//   const { toast } = useToast()

//   const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target
//     setJobDetails((prev) => ({ ...prev, [id]: value }))
//     if (validationErrors.length > 0) {
//       setValidationErrors([])
//     }
//   }

//   const handleSelectChange = (id: string, value: string) => {
//     setJobDetails((prev) => ({ ...prev, [id]: value }))
//     if (validationErrors.length > 0) {
//       setValidationErrors([])
//     }
//   }

//   const validateForm = (): boolean => {
//     const errors: string[] = []
    
//     if (!jobDetails.title.trim()) {
//       errors.push("Job Title is required")
//     }
    
//     if (!jobDetails.department) {
//       errors.push("Department is required")
//     }
    
//     if (!jobDetails.level) {
//       errors.push("Experience Level is required")
//     }
    
//     if (!jobDetails.location.trim()) {
//       errors.push("Location is required")
//     }
    
//     if (!jobDetails.workType) {
//       errors.push("Work Type is required")
//     }

//     if (!jobDescription.trim()) {
//       errors.push("Job Description is required")
//     }

//     setValidationErrors(errors)
//     return errors.length === 0
//   }

//   const addKeyword = (keyword: string) => {
//     if (keyword && !keywords.includes(keyword)) {
//       setKeywords([...keywords, keyword])
//     }
//   }

//   const removeKeyword = (keyword: string) => {
//     setKeywords(keywords.filter((k) => k !== keyword))
//   }

//   // AI Generation Function
//   const generateJobDescription = async () => {
//     if (!jobDetails.title || !jobDetails.department || !jobDetails.level) {
//       alert("Please fill in at least the Job Title, Department, and Experience Level before generating.")
//       return
//     }

//     setIsGenerating(true)

//     try {
//       // Simulate AI generation with realistic content
//       await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call

//       const departmentName = departments.find(d => d.id.toString() === jobDetails.department)?.name || jobDetails.department
//       const levelText = jobDetails.level.charAt(0).toUpperCase() + jobDetails.level.slice(1)
      
//       const generatedDescription = generateDescriptionText(jobDetails, departmentName, levelText)
//       const generatedRequirements = generateRequirementsText(jobDetails, levelText)
//       const generatedKeywords = generateKeywords(jobDetails, departmentName)

//       setJobDescription(generatedDescription)
//       setRequirements(generatedRequirements)
//       setKeywords(generatedKeywords)

//     } catch (error) {
//       console.error("Error generating job description:", error)
//       alert("Failed to generate job description. Please try again.")
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const generateDescriptionText = (details: JobDetails, departmentName: string, levelText: string): string => {
//     const { title, location, workType } = details
//     const locationText = location || "flexible location"
//     const workTypeText = workType ? ` in a ${workType} environment` : ""

//     return `We are seeking a talented ${levelText} ${title} to join our dynamic ${departmentName} team${locationText !== "flexible location" ? ` in ${locationText}` : ""}${workTypeText}. In this role, you will play a crucial part in driving innovation and delivering high-quality solutions that make a real impact on our organization and customers.

// As a ${title}, you will collaborate with cross-functional teams to design, develop, and implement strategic initiatives that align with our company's goals. You'll have the opportunity to work on challenging projects, mentor team members, and contribute to the continuous improvement of our processes and technologies.

// We offer a collaborative work environment where creativity and innovation are encouraged, along with opportunities for professional growth and development. Join us in shaping the future of our industry while building a rewarding career with a company that values your expertise and contributions.`
//   }

//   const generateRequirementsText = (details: JobDetails, levelText: string): string => {
//     const { title } = details
//     const experience = levelText === "Entry" ? "1-2 years" : 
//                      levelText === "Mid" ? "3-5 years" : 
//                      levelText === "Senior" ? "5+ years" : "7+ years"

//     return `• ${experience} of relevant experience in ${title.toLowerCase() || "related field"}
// • Strong problem-solving skills and attention to detail
// • Excellent communication and collaboration abilities
// • Proven track record of delivering high-quality results
// • Bachelor's degree in relevant field or equivalent experience
// • Experience with modern tools and technologies in the field
// • Ability to work independently and manage multiple priorities
// • Strong analytical and critical thinking skills
// • Commitment to continuous learning and professional development`
//   }

//   const generateKeywords = (details: JobDetails, departmentName: string): string[] => {
//     const baseKeywords: string[] = []
    
//     if (departmentName === "Engineering") {
//       baseKeywords.push("JavaScript", "React", "Node.js", "Python", "Git", "API Development")
//     } else if (departmentName === "Marketing") {
//       baseKeywords.push("Digital Marketing", "SEO", "Content Strategy", "Analytics", "Social Media")
//     } else if (departmentName === "Sales") {
//       baseKeywords.push("CRM", "Lead Generation", "Account Management", "Sales Strategy", "Negotiation")
//     } else if (departmentName === "Design") {
//       baseKeywords.push("UI/UX", "Figma", "Adobe Creative Suite", "Prototyping", "User Research")
//     } else {
//       baseKeywords.push("Project Management", "Communication", "Leadership", "Analysis", "Strategy")
//     }

//     if (details.level === "senior" || details.level === "lead") {
//       baseKeywords.push("Leadership", "Mentoring", "Strategic Planning")
//     }

//     return baseKeywords.slice(0, 6) // Limit to 6 keywords
//   }

//   const createJob = async (): Promise<void> => {
//     if (!validateForm()) {
//       toast({
//         title: "Validation Error",
//         description: "Please fix the following errors: " + validationErrors.join(", "),
//         variant: "destructive",
//       })
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       const departmentName = departments.find(d => d.id.toString() === jobDetails.department)?.name || jobDetails.department

//       const requestData: JobCreateRequest = {
//         jobdetails: {
//           "Job Title": jobDetails.title,
//           "Department": departmentName,
//           "Experience Level": jobDetails.level,
//           "location": jobDetails.location,
//           "Work Type": jobDetails.workType
//         },
//         "job description": {
//           "job description": jobDescription
//         }
//       }

//       const result = await apiClient.post('/jobs/', requestData)

//       toast({
//         title: "Success!",
//         description: "Job posting has been created successfully.",
//         variant: "default",
//       })

//       setJobDetails({
//         title: "",
//         department: "",
//         level: "",
//         location: "",
//         workType: "",
//         minSalary: "",
//         maxSalary: "",
//         experienceRange: "",
//       })
//       setJobDescription("")
//       setRequirements("")
//       setKeywords([])
//       setActiveTab("details")

//     } catch (error) {
//       console.error('Error creating job:', error)
//       const errorMessage = (error as any)?.detail || (error as any)?.message || 'Failed to create job posting'

//       toast({
//         title: "Error",
//         description: errorMessage,
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="p-6 space-y-6 max-w-4xl mx-auto">
//       <div className="text-center space-y-2">
//         <h2 className="text-3xl font-bold text-gray-900">Create New Job Posting</h2>
//         <p className="text-gray-600">
//           Define the details and description for your new job posting
//         </p>
//         {validationErrors.length > 0 && (
//           <div className="mt-4 p-4 border border-red-300 rounded-md bg-red-50">
//             <div className="flex items-start">
//               <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
//               <div>
//                 <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
//                 <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
//                   {validationErrors.map((error, index) => (
//                     <li key={index}>{error}</li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="details" className="flex items-center space-x-2">
//             <span>1. Job Details</span>
//           </TabsTrigger>
//           <TabsTrigger value="description" className="flex items-center space-x-2">
//             <span>2. Job Description</span>
//           </TabsTrigger>
//         </TabsList>

//         {/* Job Details Tab */}
//         <TabsContent value="details" className="mt-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Job Details</CardTitle>
//               <CardDescription>Enter the basic information for your job posting</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="space-y-2">
//                 <Label htmlFor="title" className="text-sm font-medium">Job Title *</Label>
//                 <Input
//                   id="title"
//                   value={jobDetails.title}
//                   onChange={handleDetailChange}
//                   placeholder="e.g., Senior Software Engineer"
//                   className="text-sm"
//                 />
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="department" className="text-sm font-medium">Department *</Label>
//                   <Select value={jobDetails.department} onValueChange={(val) => handleSelectChange("department", val)}>
//                     <SelectTrigger id="department">
//                       <SelectValue placeholder="Select department" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {departments.map((dept) => (
//                         <SelectItem key={dept.id} value={dept.id.toString()}>
//                           {dept.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="level" className="text-sm font-medium">Experience Level *</Label>
//                   <Select value={jobDetails.level} onValueChange={(val) => handleSelectChange("level", val)}>
//                     <SelectTrigger id="level">
//                       <SelectValue placeholder="Select level" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="entry">Entry Level</SelectItem>
//                       <SelectItem value="mid">Mid Level</SelectItem>
//                       <SelectItem value="senior">Senior Level</SelectItem>
//                       <SelectItem value="lead">Lead/Principal</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="location" className="text-sm font-medium">Location</Label>
//                   <Input
//                     id="location"
//                     value={jobDetails.location}
//                     onChange={handleDetailChange}
//                     placeholder="e.g., Remote, New York, NY"
//                     className="text-sm"
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="workType" className="text-sm font-medium">Work Type</Label>
//                   <Select value={jobDetails.workType} onValueChange={(val) => handleSelectChange("workType", val)}>
//                     <SelectTrigger id="workType">
//                       <SelectValue placeholder="Select work type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="remote">Remote</SelectItem>
//                       <SelectItem value="onsite">On-site</SelectItem>
//                       <SelectItem value="hybrid">Hybrid</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="flex justify-end pt-4">
//                 <Button 
//                   onClick={() => setActiveTab("description")}
//                   className="bg-blue-600 hover:bg-blue-700"
//                 >
//                   Next: Job Description →
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Job Description Tab */}
//         <TabsContent value="description" className="mt-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2">
//                 <Sparkles className="h-5 w-5 text-blue-600" />
//                 <span>Job Description</span>
//               </CardTitle>
//               <CardDescription>Create a comprehensive job description using AI or upload your own</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="flex space-x-3 mb-6">
//                 <label htmlFor="jd-upload" className="flex-1">
//                   <Button variant="outline" className="w-full" asChild>
//                     <span className="flex items-center justify-center">
//                       <Upload className="h-4 w-4 mr-2" />
//                       Upload JD
//                     </span>
//                   </Button>
//                   <input
//                     id="jd-upload"
//                     type="file"
//                     accept=".txt,.pdf,.doc,.docx"
//                     className="hidden"
//                   />
//                 </label>
                
//                 <Button 
//                   onClick={generateJobDescription}
//                   disabled={isGenerating}
//                   className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
//                 >
//                   {isGenerating ? (
//                     <>
//                       <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                       Generating...
//                     </>
//                   ) : (
//                     <>
//                       <Sparkles className="h-4 w-4 mr-2" />
//                       Generate with AI
//                     </>
//                   )}
//                 </Button>
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-sm font-medium">Job Description</Label>
//                 <Textarea
//                   value={jobDescription}
//                   onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDescription(e.target.value)}
//                   rows={10}
//                   className="text-sm resize-none"
//                   placeholder="Enter job description or click 'Generate with AI' to create one based on your job details..."
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-sm font-medium">Requirements</Label>
//                 <Textarea
//                   value={requirements}
//                   onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRequirements(e.target.value)}
//                   rows={8}
//                   className="text-sm resize-none"
//                   placeholder="List the required qualifications, skills, and experience..."
//                 />
//               </div>

//               <div className="space-y-3">
//                 <Label className="flex items-center text-sm font-medium">
//                   <Hash className="h-4 w-4 mr-2" />
//                   Keywords/Skills
//                 </Label>
                
//                 {keywords.length > 0 && (
//                   <div className="flex flex-wrap gap-2 mb-3">
//                     {keywords.map((keyword) => (
//                       <div key={keyword} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center text-sm">
//                         {keyword}
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="h-4 w-4 p-0 ml-2 hover:bg-blue-200 rounded-full"
//                           onClick={() => removeKeyword(keyword)}
//                         >
//                           <Trash className="h-3 w-3" />
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
                
//                 <div className="flex space-x-2">
//                   <Input
//                     placeholder="Add keyword or skill"
//                     id="keyword"
//                     className="text-sm"
//                     onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
//                       if (e.key === "Enter") {
//                         e.preventDefault()
//                         const target = e.target as HTMLInputElement
//                         addKeyword(target.value)
//                         target.value = ""
//                       }
//                     }}
//                   />
//                   <Button
//                     variant="outline"
//                     onClick={() => {
//                       const input = document.getElementById("keyword") as HTMLInputElement
//                       if (input) {
//                         addKeyword(input.value)
//                         input.value = ""
//                       }
//                     }}
//                   >
//                     Add
//                   </Button>
//                 </div>
//               </div>

//               <div className="flex justify-between pt-6 border-t">
//                 <Button 
//                   variant="outline" 
//                   onClick={() => setActiveTab("details")}
//                 >
//                   ← Previous
//                 </Button>
//                 <Button 
//                   onClick={createJob}
//                   disabled={isSubmitting}
//                   className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                       Creating Job...
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle className="h-4 w-4 mr-2" />
//                       Create Job Posting
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, RefreshCw, Hash, Trash, Upload } from "lucide-react"

interface JobDetails {
  title: string
  department: string
  level: string
  location: string
  workType: string
  minSalary: string
  maxSalary: string
  experienceRange: string
}

interface Department {
  id: number
  name: string
}

export default function JobCreationForm() {
  const [activeTab, setActiveTab] = useState("details")
  const [showForm, setShowForm] = useState(false)

  const [jobDetails, setJobDetails] = useState<JobDetails>({
    title: "",
    department: "",
    level: "",
    location: "",
    workType: "",
    minSalary: "",
    maxSalary: "",
    experienceRange: "",
  })
  const [jobDescription, setJobDescription] = useState("")
  const [requirements, setRequirements] = useState("")
  const [keywords, setKeywords] = useState<string[]>([])
  const [departments] = useState<Department[]>([
    { id: 1, name: "Engineering" },
    { id: 2, name: "Marketing" },
    { id: 3, name: "Sales" },
    { id: 4, name: "HR" },
    { id: 5, name: "Finance" },
    { id: 6, name: "Design" },
  ])
  const [isGenerating, setIsGenerating] = useState(false)

  // Reset form
  const resetForm = () => {
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
    setActiveTab("details")
  }

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setJobDetails((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setJobDetails((prev) => ({ ...prev, [id]: value }))
  }

  const addKeyword = (keyword: string) => {
    if (keyword && !keywords.includes(keyword)) {
      setKeywords([...keywords, keyword])
    }
  }

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword))
  }

  // AI Generation Function
  const generateJobDescription = async () => {
    if (!jobDetails.title || !jobDetails.department || !jobDetails.level) {
      alert("Please fill in at least the Job Title, Department, and Experience Level before generating.")
      return
    }

    setIsGenerating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)) // simulate API call

      const departmentName = departments.find(d => d.id.toString() === jobDetails.department)?.name || jobDetails.department
      const levelText = jobDetails.level.charAt(0).toUpperCase() + jobDetails.level.slice(1)

      const generatedDescription = generateDescriptionText(jobDetails, departmentName, levelText)
      const generatedRequirements = generateRequirementsText(jobDetails, levelText)
      const generatedKeywords = generateKeywords(jobDetails, departmentName)

      setJobDescription(generatedDescription)
      setRequirements(generatedRequirements)
      setKeywords(generatedKeywords)
    } catch (error) {
      console.error("Error generating job description:", error)
      alert("Failed to generate job description. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const generateDescriptionText = (details: JobDetails, departmentName: string, levelText: string): string => {
    const { title, location, workType } = details
    const locationText = location || "flexible location"
    const workTypeText = workType ? ` in a ${workType} environment` : ""

    return `We are seeking a talented ${levelText} ${title} to join our dynamic ${departmentName} team${locationText !== "flexible location" ? ` in ${locationText}` : ""}${workTypeText}. In this role, you will play a crucial part in driving innovation and delivering high-quality solutions.`
  }

  const generateRequirementsText = (details: JobDetails, levelText: string): string => {
    const { title } = details
    const experience = levelText === "Entry" ? "1-2 years" : 
                     levelText === "Mid" ? "3-5 years" : 
                     levelText === "Senior" ? "5+ years" : "7+ years"

    return `• ${experience} of relevant experience in ${title.toLowerCase() || "related field"}
• Strong problem-solving skills
• Excellent communication and collaboration abilities
• Bachelor's degree or equivalent experience`
  }

  const generateKeywords = (details: JobDetails, departmentName: string): string[] => {
    const baseKeywords: string[] = []

    if (departmentName === "Engineering") {
      baseKeywords.push("JavaScript", "React", "Node.js", "Python", "Git", "API Development")
    } else if (departmentName === "Marketing") {
      baseKeywords.push("Digital Marketing", "SEO", "Content Strategy", "Analytics", "Social Media")
    } else if (departmentName === "Sales") {
      baseKeywords.push("CRM", "Lead Generation", "Account Management", "Sales Strategy", "Negotiation")
    } else if (departmentName === "Design") {
      baseKeywords.push("UI/UX", "Figma", "Adobe Creative Suite", "Prototyping", "User Research")
    } else {
      baseKeywords.push("Project Management", "Communication", "Leadership", "Analysis", "Strategy")
    }

    if (details.level === "senior" || details.level === "lead") {
      baseKeywords.push("Leadership", "Mentoring", "Strategic Planning")
    }

    return baseKeywords.slice(0, 6)
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header with + Job button */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Create New Job Posting</h2>
        <p className="text-gray-600">Define the details and description for your new job posting</p>
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300"
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
          >
            + Job
          </Button>
        </div>
      </div>

      {/* Render form only when +Job clicked */}
      {showForm && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">1. Job Details</TabsTrigger>
            <TabsTrigger value="description">2. Job Description</TabsTrigger>
          </TabsList>

          {/* Job Details */}
          <TabsContent value="details" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>Enter the basic information for your job posting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input id="title" value={jobDetails.title} onChange={handleDetailChange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select value={jobDetails.department} onValueChange={(val) => handleSelectChange("department", val)}>
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Experience Level *</Label>
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
                    <Input id="location" value={jobDetails.location} onChange={handleDetailChange} />
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

                <div className="flex justify-end pt-4">
                  <Button onClick={() => setActiveTab("description")} className="bg-blue-600 hover:bg-blue-700">
                    Next: Job Description →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Job Description */}
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <span>Job Description</span>
                </CardTitle>
                <CardDescription>Create a comprehensive job description</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex space-x-3 mb-6">
                  <label htmlFor="jd-upload" className="flex-1">
                    <Button variant="outline" className="w-full" asChild>
                      <span className="flex items-center justify-center">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload JD
                      </span>
                    </Button>
                    <input id="jd-upload" type="file" accept=".txt,.pdf,.doc,.docx" className="hidden" />
                  </label>

                  <Button
                    onClick={generateJobDescription}
                    disabled={isGenerating}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                  >
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
                  <Textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={10} />
                </div>

                <div className="space-y-2">
                  <Label>Requirements</Label>
                  <Textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={8} />
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center">
                    <Hash className="h-4 w-4 mr-2" />
                    Keywords/Skills
                  </Label>
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {keywords.map((keyword) => (
                        <div
                          key={keyword}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center text-sm"
                        >
                          {keyword}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-2 hover:bg-blue-200 rounded-full"
                            onClick={() => removeKeyword(keyword)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add keyword or skill"
                      id="keyword"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          const target = e.target as HTMLInputElement
                          addKeyword(target.value)
                          target.value = ""
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        const input = document.getElementById("keyword") as HTMLInputElement
                        if (input) {
                          addKeyword(input.value)
                          input.value = ""
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t">
                  <Button variant="outline" onClick={() => setActiveTab("details")}>
                    ← Previous
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Create Job Posting
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
