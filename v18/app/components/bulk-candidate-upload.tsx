"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UploadCloud, FileText, X, Check, Edit, Save, Trash, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface UploadedFile {
  id: string
  name: string
  size: number
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
  jobMatch: string // Suggested job match title
  editable: boolean // For inline editing
}

interface BulkCandidateUploadProps {
  onClose: () => void
}

export default function BulkCandidateUpload({ onClose }: BulkCandidateUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [currentEditingCandidateId, setCurrentEditingCandidateId] = useState<string | null>(null)
  const [editedCandidateData, setEditedCandidateData] = useState<Partial<CandidateData>>({})

  // Mock job data for matching
  const mockJobTitles = [
    "Senior Frontend Developer",
    "Product Manager",
    "UX Designer",
    "Backend Engineer",
    "DevOps Engineer",
    "Data Scientist",
  ]

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files)
      const newFiles: UploadedFile[] = selectedFiles.map((file) => ({
        id: `${file.name}-${Date.now()}`,
        name: file.name,
        size: file.size,
        status: "pending",
        progress: 0,
        data: [],
        errors: [],
      }))
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const startParsing = (fileId: string) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) => (file.id === fileId ? { ...file, status: "parsing", progress: 0 } : file)),
    )

    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setFiles((prevFiles) => prevFiles.map((file) => (file.id === fileId ? { ...file, progress: progress } : file)))

      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          const mockParsedData: CandidateData[] = [
            {
              id: `cand-${fileId}-1`,
              name: `Candidate A from ${fileId.substring(0, 5)}`,
              email: `candA.${fileId.substring(0, 5)}@example.com`,
              phone: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`,
              position: "Software Engineer",
              totalExperience: `${Math.floor(Math.random() * 10) + 2} years`,
              relevantExperience: `${Math.floor(Math.random() * 5) + 1} years`,
              skills: "React, Node.js, AWS, SQL",
              jobMatch: mockJobTitles[Math.floor(Math.random() * mockJobTitles.length)],
              editable: false,
            },
            {
              id: `cand-${fileId}-2`,
              name: `Candidate B from ${fileId.substring(0, 5)}`,
              email: `candB.${fileId.substring(0, 5)}@example.com`,
              phone: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`,
              position: "Product Manager",
              totalExperience: `${Math.floor(Math.random() * 12) + 3} years`,
              relevantExperience: `${Math.floor(Math.random() * 7) + 2} years`,
              skills: "Agile, Scrum, JIRA, UX",
              jobMatch: mockJobTitles[Math.floor(Math.random() * mockJobTitles.length)],
              editable: false,
            },
          ]
          setFiles((prevFiles) =>
            prevFiles.map((file) =>
              file.id === fileId ? { ...file, status: "review", data: mockParsedData, progress: 100 } : file,
            ),
          )
        }, 500) // Small delay after progress completes
      }
    }, 100) // Update progress every 100ms
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

  const handleConfirmUpload = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.map((file) => (file.id === fileId ? { ...file, status: "completed" } : file)))
    const fileToUpload = files.find((f) => f.id === fileId)
    console.log(`Simulating API call to upload candidates from ${fileToUpload?.name}:`, fileToUpload?.data)
    alert(`Candidates from ${fileToUpload?.name} uploaded successfully! (Simulated)`)
    // In a real app, send fileToUpload.data to your backend API
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
                                    value={editedCandidateData.jobMatch || ""}
                                    onValueChange={(value) => handleCandidateDataChange("jobMatch", value)}
                                  >
                                    <SelectTrigger className="w-[180px]">
                                      <SelectValue placeholder="Select Job" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {mockJobTitles.map((job) => (
                                        <SelectItem key={job} value={job}>
                                          {job}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <Badge variant={candidate.jobMatch ? "default" : "secondary"}>
                                    {candidate.jobMatch || "No Match"}
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
                      <Button onClick={() => handleConfirmUpload(file.id)} className="bg-blue-600 hover:bg-blue-700">
                        Confirm & Add Candidates
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
