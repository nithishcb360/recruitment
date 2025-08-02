"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UploadCloud, FileText, X, Check, Edit, Save, Trash, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { createCandidate, type Candidate } from "@/lib/api/candidates"
import { getJobs, type JobListItem } from "@/lib/api/jobs"
import { useToast } from "@/hooks/use-toast"

interface UploadedFile {
  id: string
  name: string
  size: number
  file: File // Store the actual File object
  status: "pending" | "parsing" | "review" | "completed" | "error"
  progress: number // 0-100 for parsing
  data: CandidateData[] // Parsed data from the file
  errors: string[] // Errors during parsing
}

interface CandidateData {
  id: string
  name: string
  email: string
  phone: string
  position: string
  totalExperience: string // e.g., "5 years"
  relevantExperience: string // e.g., "3 years"
  skills: string // comma-separated
  jobMatch: number | null // Selected job ID
  jobMatchTitle: string // Display title for job match
  editable: boolean // For inline editing
}

interface BulkCandidateUploadProps {
  onClose: () => void
}

export default function BulkCandidateUpload({ onClose }: BulkCandidateUploadProps) {
  const { toast } = useToast()
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [currentEditingCandidateId, setCurrentEditingCandidateId] = useState<string | null>(null)
  const [editedCandidateData, setEditedCandidateData] = useState<Partial<CandidateData>>({})
  const [availableJobs, setAvailableJobs] = useState<JobListItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Load available jobs for matching
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true)
        const jobsResponse = await getJobs()
        setAvailableJobs(jobsResponse.results)
      } catch (error) {
        console.error('Error fetching jobs:', error)
        toast({
          title: "Error",
          description: "Failed to load available jobs. Please refresh the page.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [toast])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files)
      const newFiles: UploadedFile[] = selectedFiles.map((file) => ({
        id: `${file.name}-${Date.now()}`,
        name: file.name,
        size: file.size,
        file: file,
        status: "pending",
        progress: 0,
        data: [],
        errors: [],
      }))
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const startParsing = async (fileId: string) => {
    const file = files.find(f => f.id === fileId)
    if (!file) return

    setFiles((prevFiles) =>
      prevFiles.map((f) => (f.id === fileId ? { ...f, status: "parsing", progress: 0 } : f)),
    )

    try {
      const parsedData = await parseFile(file, fileId)
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === fileId ? { ...f, status: "review", data: parsedData, progress: 100 } : f,
        ),
      )
    } catch (error) {
      console.error('Error parsing file:', error)
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === fileId ? { ...f, status: "error", errors: [(error as Error).message] } : f,
        ),
      )
      toast({
        title: "Parse Error",
        description: `Failed to parse ${file.name}. Please check the file format.`,
        variant: "destructive"
      })
    }
  }

  // Real file parsing function
  const parseFile = async (file: UploadedFile, fileId: string): Promise<CandidateData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          
          if (file.name.endsWith('.csv')) {
            const parsedData = parseCSV(content, fileId)
            resolve(parsedData)
          } else {
            reject(new Error('Unsupported file format. Please use CSV files.'))
          }
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      
      // Use the stored File object
      reader.readAsText(file.file)
    })
  }

  // CSV parsing function
  const parseCSV = (content: string, fileId: string): CandidateData[] => {
    const lines = content.split('\n').filter(line => line.trim())
    if (lines.length < 2) throw new Error('CSV file must have at least a header and one data row')
    
    const headers = lines[0].toLowerCase().split(',').map(h => h.trim())
    const candidates: CandidateData[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      if (values.length !== headers.length) continue // Skip malformed rows
      
      const candidate: CandidateData = {
        id: `cand-${fileId}-${i}`,
        name: getValueByHeader(headers, values, ['name', 'full name', 'candidate name']) || `Candidate ${i}`,
        email: getValueByHeader(headers, values, ['email', 'email address', 'e-mail']) || '',
        phone: getValueByHeader(headers, values, ['phone', 'phone number', 'mobile', 'contact']) || '',
        position: getValueByHeader(headers, values, ['position', 'role', 'title', 'job title']) || '',
        totalExperience: getValueByHeader(headers, values, ['total experience', 'experience', 'years experience']) || '0 years',
        relevantExperience: getValueByHeader(headers, values, ['relevant experience', 'relevant exp']) || '0 years',
        skills: getValueByHeader(headers, values, ['skills', 'technologies', 'expertise']) || '',
        jobMatch: null,
        jobMatchTitle: 'No Match',
        editable: false,
      }
      
      candidates.push(candidate)
    }
    
    return candidates
  }

  // Helper function to get value by header variations
  const getValueByHeader = (headers: string[], values: string[], possibleHeaders: string[]): string => {
    for (const possible of possibleHeaders) {
      const index = headers.findIndex(h => h.includes(possible))
      if (index !== -1 && values[index]) {
        return values[index]
      }
    }
    return ''
  }

  const handleEditClick = (candidate: CandidateData) => {
    setCurrentEditingCandidateId(candidate.id)
    setEditedCandidateData({ ...candidate })
  }

  const handleSaveEdit = (fileId: string, candidateId: string) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === fileId
          ? {
              ...file,
              data: file.data.map((candidate) =>
                candidate.id === candidateId
                  ? {
                      ...candidate,
                      ...editedCandidateData,
                      editable: false,
                    }
                  : candidate,
              ),
            }
          : file,
      ),
    )
    setCurrentEditingCandidateId(null)
    setEditedCandidateData({})
  }

  const handleCancelEdit = () => {
    setCurrentEditingCandidateId(null)
    setEditedCandidateData({})
  }

  const handleCandidateDataChange = (field: keyof CandidateData, value: string) => {
    setEditedCandidateData((prev) => ({ ...prev, [field]: value }))
  }

  const handleConfirmUpload = async (fileId: string) => {
    const fileToUpload = files.find((f) => f.id === fileId)
    if (!fileToUpload) return

    try {
      setIsUploading(true)
      setFiles((prevFiles) => prevFiles.map((file) => (file.id === fileId ? { ...file, status: "parsing" } : file)))
      
      const successfulUploads: string[] = []
      const failedUploads: string[] = []
      
      // Upload each candidate individually
      for (const candidateData of fileToUpload.data) {
        try {
          const candidatePayload: Partial<Candidate> = {
            first_name: candidateData.name.split(' ')[0] || candidateData.name,
            last_name: candidateData.name.split(' ').slice(1).join(' ') || '',
            email: candidateData.email,
            phone: candidateData.phone,
            current_title: candidateData.position,
            skills: candidateData.skills ? candidateData.skills.split(',').map(s => s.trim()) : [],
            years_of_experience: parseInt(candidateData.totalExperience) || 0,
            tags: ['bulk-upload']
          }
          
          await createCandidate(candidatePayload)
          successfulUploads.push(candidateData.name)
        } catch (error) {
          console.error(`Failed to upload ${candidateData.name}:`, error)
          failedUploads.push(candidateData.name)
        }
      }
      
      setFiles((prevFiles) => prevFiles.map((file) => (file.id === fileId ? { ...file, status: "completed" } : file)))
      
      if (successfulUploads.length > 0) {
        toast({
          title: "Upload Successful!",
          description: `${successfulUploads.length} candidates uploaded successfully from ${fileToUpload.name}.`,
          variant: "default"
        })
      }
      
      if (failedUploads.length > 0) {
        toast({
          title: "Partial Upload",
          description: `${failedUploads.length} out of ${fileToUpload.data.length} candidates failed to upload.`,
          variant: "destructive"
        })
      }
      
    } catch (error: any) {
      console.error('Error uploading candidates:', error)
      setFiles((prevFiles) => prevFiles.map((file) => (file.id === fileId ? { ...file, status: "error" } : file)))
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload candidates. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
        <input
          id="file-upload"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept=".csv, .xlsx, .xls, .pdf, .doc, .docx"
        />
        <Label htmlFor="file-upload" className="flex flex-col items-center justify-center space-y-2 cursor-pointer">
          <UploadCloud className="h-12 w-12 text-gray-400" />
          <p className="text-lg font-medium text-gray-700">Drag & Drop or Click to Upload Files</p>
          <p className="text-sm text-gray-500">CSV, Excel, PDF, Word documents supported</p>
        </Label>
      </div>

      {files.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>Review the status of your uploaded files.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {files.map((file) => (
              <div key={file.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {file.status === "pending" && (
                      <Button size="sm" onClick={() => startParsing(file.id)}>
                        Start Parsing
                      </Button>
                    )}
                    {file.status === "parsing" && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Parsing...
                      </Badge>
                    )}
                    {file.status === "review" && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-600">
                        Review Needed
                      </Badge>
                    )}
                    {file.status === "completed" && (
                      <Badge variant="outline" className="bg-green-50 text-green-600">
                        <Check className="h-3 w-3 mr-1" /> Completed
                      </Badge>
                    )}
                    {file.status === "error" && (
                      <Badge variant="outline" className="bg-red-50 text-red-600">
                        <X className="h-3 w-3 mr-1" /> Error
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(file.id)}>
                      <Trash className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
                {file.status === "parsing" && <Progress value={file.progress} className="w-full" />}

                {file.status === "review" && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Review and edit the extracted candidate data and suggested job matches.
                    </p>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Total Exp.</TableHead>
                            <TableHead>Relevant Exp.</TableHead>
                            <TableHead>Skills</TableHead>
                            <TableHead>Suggested Job Match</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {file.data.map((candidate) => (
                            <TableRow key={candidate.id}>
                              <TableCell>
                                {currentEditingCandidateId === candidate.id ? (
                                  <Input
                                    value={editedCandidateData.name || ""}
                                    onChange={(e) => handleCandidateDataChange("name", e.target.value)}
                                  />
                                ) : (
                                  candidate.name
                                )}
                              </TableCell>
                              <TableCell>
                                {currentEditingCandidateId === candidate.id ? (
                                  <Input
                                    value={editedCandidateData.email || ""}
                                    onChange={(e) => handleCandidateDataChange("email", e.target.value)}
                                  />
                                ) : (
                                  candidate.email
                                )}
                              </TableCell>
                              <TableCell>
                                {currentEditingCandidateId === candidate.id ? (
                                  <Input
                                    value={editedCandidateData.phone || ""}
                                    onChange={(e) => handleCandidateDataChange("phone", e.target.value)}
                                  />
                                ) : (
                                  candidate.phone
                                )}
                              </TableCell>
                              <TableCell>
                                {currentEditingCandidateId === candidate.id ? (
                                  <Input
                                    value={editedCandidateData.position || ""}
                                    onChange={(e) => handleCandidateDataChange("position", e.target.value)}
                                  />
                                ) : (
                                  candidate.position
                                )}
                              </TableCell>
                              <TableCell>
                                {currentEditingCandidateId === candidate.id ? (
                                  <Input
                                    value={editedCandidateData.totalExperience || ""}
                                    onChange={(e) => handleCandidateDataChange("totalExperience", e.target.value)}
                                  />
                                ) : (
                                  candidate.totalExperience
                                )}
                              </TableCell>
                              <TableCell>
                                {currentEditingCandidateId === candidate.id ? (
                                  <Input
                                    value={editedCandidateData.relevantExperience || ""}
                                    onChange={(e) => handleCandidateDataChange("relevantExperience", e.target.value)}
                                  />
                                ) : (
                                  candidate.relevantExperience
                                )}
                              </TableCell>
                              <TableCell>
                                {currentEditingCandidateId === candidate.id ? (
                                  <Input
                                    value={editedCandidateData.skills || ""}
                                    onChange={(e) => handleCandidateDataChange("skills", e.target.value)}
                                  />
                                ) : (
                                  candidate.skills
                                )}
                              </TableCell>
                              <TableCell>
                                {currentEditingCandidateId === candidate.id ? (
                                  <Select
                                    value={editedCandidateData.jobMatch?.toString() || ""}
                                    onValueChange={(value) => {
                                      const jobId = parseInt(value)
                                      const job = availableJobs.find(j => j.id === jobId)
                                      handleCandidateDataChange("jobMatch", jobId)
                                      if (job) {
                                        handleCandidateDataChange("jobMatchTitle", job.title)
                                      }
                                    }}
                                  >
                                    <SelectTrigger className="w-[180px]">
                                      <SelectValue placeholder="Select Job" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {isLoading ? (
                                        <SelectItem value="" disabled>Loading jobs...</SelectItem>
                                      ) : (
                                        availableJobs.map((job) => (
                                          <SelectItem key={job.id} value={job.id.toString()}>
                                            {job.title}
                                          </SelectItem>
                                        ))
                                      )}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <Badge variant={candidate.jobMatch ? "default" : "secondary"}>
                                    {candidate.jobMatchTitle || "No Match"}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                {currentEditingCandidateId === candidate.id ? (
                                  <div className="flex space-x-1">
                                    <Button size="sm" onClick={() => handleSaveEdit(file.id, candidate.id)}>
                                      <Save className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button size="sm" variant="outline" onClick={() => handleEditClick(candidate)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => handleRemoveFile(file.id)} className="bg-transparent">
                        Cancel Review
                      </Button>
                      <Button 
                        onClick={() => handleConfirmUpload(file.id)} 
                        disabled={isUploading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          "Confirm & Add Candidates"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose} className="bg-transparent">
          Close Panel
        </Button>
      </div>
    </div>
  )
}
