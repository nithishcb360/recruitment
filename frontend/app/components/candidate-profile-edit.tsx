"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, X, Save, User, MapPin, Phone, Mail, Briefcase, GraduationCap, Star, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Candidate {
  id: number
  name: string
  email: string
  phone: string
  location: string
  jobTitle: string
  totalExperience: number
  relevantExperience: number
  skillExperience: { skill: string; years: number }[]
  expectedSalary: string
  noticePeriod: string
  resumeLink: string
  linkedinProfile: string
  notes: string
  stage: string
  rating: number
}

interface CandidateProfileEditProps {
  candidate: Candidate
  isOpen: boolean
  onClose: () => void
  onSave: (updatedCandidate: Candidate) => void
}

export default function CandidateProfileEdit({
  candidate,
  isOpen,
  onClose,
  onSave,
}: CandidateProfileEditProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("personal")
  const [isLoading, setIsLoading] = useState(false)
  const [editedCandidate, setEditedCandidate] = useState<Candidate>(candidate)
  const [newSkill, setNewSkill] = useState("")
  const [newSkillYears, setNewSkillYears] = useState("")

  // Reset form when candidate changes
  useEffect(() => {
    setEditedCandidate(candidate)
  }, [candidate])

  const handleInputChange = (field: keyof Candidate, value: any) => {
    setEditedCandidate(prev => ({ ...prev, [field]: value }))
  }

  const handleAddSkill = () => {
    if (!newSkill.trim() || !newSkillYears) return
    
    const skill = { skill: newSkill.trim(), years: parseInt(newSkillYears) }
    setEditedCandidate(prev => ({
      ...prev,
      skillExperience: [...prev.skillExperience, skill]
    }))
    setNewSkill("")
    setNewSkillYears("")
  }

  const handleRemoveSkill = (index: number) => {
    setEditedCandidate(prev => ({
      ...prev,
      skillExperience: prev.skillExperience.filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      
      // Validate required fields
      if (!editedCandidate.name.trim() || !editedCandidate.email.trim()) {
        toast({
          title: "Validation Error",
          description: "Name and email are required fields.",
          variant: "destructive"
        })
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSave(editedCandidate)
      
      toast({
        title: "Success!",
        description: "Candidate profile has been updated successfully.",
        variant: "default"
      })
      
      onClose()
    } catch (error: any) {
      console.error('Error updating candidate:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update candidate profile.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Edit Candidate Profile
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="skills">Skills & Experience</TabsTrigger>
            <TabsTrigger value="notes">Notes & Rating</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={editedCandidate.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={editedCandidate.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter email address"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={editedCandidate.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter phone number"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        value={editedCandidate.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Enter location"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="resumeLink">Resume Link</Label>
                    <Input
                      id="resumeLink"
                      value={editedCandidate.resumeLink}
                      onChange={(e) => handleInputChange('resumeLink', e.target.value)}
                      placeholder="Enter resume URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedinProfile">LinkedIn Profile</Label>
                    <Input
                      id="linkedinProfile"
                      value={editedCandidate.linkedinProfile}
                      onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
                      placeholder="Enter LinkedIn URL"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professional" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Professional Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Current/Desired Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={editedCandidate.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    placeholder="Enter job title"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalExperience">Total Experience (Years)</Label>
                    <Input
                      id="totalExperience"
                      type="number"
                      value={editedCandidate.totalExperience}
                      onChange={(e) => handleInputChange('totalExperience', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      max="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relevantExperience">Relevant Experience (Years)</Label>
                    <Input
                      id="relevantExperience"
                      type="number"
                      value={editedCandidate.relevantExperience}
                      onChange={(e) => handleInputChange('relevantExperience', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      max="50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expectedSalary">Expected Salary</Label>
                    <Input
                      id="expectedSalary"
                      value={editedCandidate.expectedSalary}
                      onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                      placeholder="e.g., $80,000 - $100,000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="noticePeriod">Notice Period</Label>
                    <Select
                      value={editedCandidate.noticePeriod}
                      onValueChange={(value) => handleInputChange('noticePeriod', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select notice period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Immediate">Immediate</SelectItem>
                        <SelectItem value="1 week">1 Week</SelectItem>
                        <SelectItem value="2 weeks">2 Weeks</SelectItem>
                        <SelectItem value="1 month">1 Month</SelectItem>
                        <SelectItem value="2 months">2 Months</SelectItem>
                        <SelectItem value="3 months">3 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Skills & Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {editedCandidate.skillExperience.map((skill, index) => (
                      <Badge key={index} variant="outline" className="flex items-center space-x-1">
                        <span>{skill.skill} ({skill.years} yrs)</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => handleRemoveSkill(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="text-sm font-medium mb-3 block">Add New Skill</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Skill name (e.g., React)"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Years"
                      value={newSkillYears}
                      onChange={(e) => setNewSkillYears(e.target.value)}
                      className="w-20"
                      min="0"
                      max="20"
                    />
                    <Button onClick={handleAddSkill} disabled={!newSkill.trim() || !newSkillYears}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-5 w-5" />
                  Notes & Rating
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Overall Rating</Label>
                  <Select
                    value={editedCandidate.rating.toString()}
                    onValueChange={(value) => handleInputChange('rating', parseFloat(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 - Excellent</SelectItem>
                      <SelectItem value="4">4 - Very Good</SelectItem>
                      <SelectItem value="3">3 - Good</SelectItem>
                      <SelectItem value="2">2 - Fair</SelectItem>
                      <SelectItem value="1">1 - Poor</SelectItem>
                      <SelectItem value="0">0 - Not Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={editedCandidate.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={6}
                    placeholder="Add notes about the candidate..."
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}