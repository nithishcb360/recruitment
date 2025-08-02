"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  Bell, 
  Plus, 
  Edit, 
  Trash, 
  Save,
  X,
  Loader2
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  getCandidateTimeline, 
  createCandidateNote, 
  updateCandidateNote, 
  deleteCandidateNote,
  type CandidateNote, 
  type CandidateNoteCreateData 
} from "@/lib/api/candidate-notes"
import { useToast } from "@/hooks/use-toast"

interface CandidateNotesProps {
  candidateId: number
  candidateName: string
  isOpen: boolean
  onClose: () => void
}

export default function CandidateNotes({ candidateId, candidateName, isOpen, onClose }: CandidateNotesProps) {
  const { toast } = useToast()
  const [notes, setNotes] = useState<CandidateNote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)
  
  // New note form state
  const [newNote, setNewNote] = useState<Partial<CandidateNoteCreateData>>({
    candidate: candidateId,
    note_type: 'general',
    title: '',
    content: '',
    is_private: false,
    visible_to_candidate: false
  })

  // Load notes when component mounts or candidateId changes
  useEffect(() => {
    if (isOpen && candidateId) {
      fetchNotes()
    }
  }, [isOpen, candidateId])

  const fetchNotes = async () => {
    try {
      setIsLoading(true)
      const timeline = await getCandidateTimeline(candidateId)
      setNotes(timeline)
    } catch (error) {
      console.error('Error fetching candidate timeline:', error)
      toast({
        title: "Error",
        description: "Failed to load candidate notes. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNote = async () => {
    if (!newNote.content?.trim()) {
      toast({
        title: "Validation Error",
        description: "Note content is required.",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSubmitting(true)
      const noteData: CandidateNoteCreateData = {
        candidate: candidateId,
        note_type: newNote.note_type || 'general',
        title: newNote.title || '',
        content: newNote.content,
        is_private: newNote.is_private || false,
        visible_to_candidate: newNote.visible_to_candidate || false
      }

      const createdNote = await createCandidateNote(noteData)
      setNotes(prev => [createdNote, ...prev])
      
      // Reset form
      setNewNote({
        candidate: candidateId,
        note_type: 'general',
        title: '',
        content: '',
        is_private: false,
        visible_to_candidate: false
      })
      setIsAddingNote(false)
      
      toast({
        title: "Success!",
        description: "Note added successfully.",
        variant: "default"
      })
    } catch (error: any) {
      console.error('Error creating note:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create note. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm("Are you sure you want to delete this note?")) return

    try {
      await deleteCandidateNote(noteId)
      setNotes(prev => prev.filter(note => note.id !== noteId))
      toast({
        title: "Success!",
        description: "Note deleted successfully.",
        variant: "default"
      })
    } catch (error: any) {
      console.error('Error deleting note:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete note. Please try again.",
        variant: "destructive"
      })
    }
  }

  const getNoteIcon = (noteType: string) => {
    switch (noteType) {
      case 'interview':
        return <Calendar className="h-4 w-4 text-purple-500" />
      case 'phone_call':
        return <Phone className="h-4 w-4 text-blue-500" />
      case 'email':
        return <Mail className="h-4 w-4 text-green-500" />
      case 'feedback':
        return <FileText className="h-4 w-4 text-orange-500" />
      case 'reminder':
        return <Bell className="h-4 w-4 text-yellow-500" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />
    }
  }

  const getNoteTypeLabel = (noteType: string) => {
    switch (noteType) {
      case 'interview':
        return 'Interview'
      case 'phone_call':
        return 'Phone Call'
      case 'email':
        return 'Email'
      case 'feedback':
        return 'Feedback'
      case 'reminder':
        return 'Reminder'
      default:
        return 'General'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Notes & Timeline - {candidateName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Add Note Button */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Track interactions, feedback, and important information about this candidate.
            </p>
            <Button 
              onClick={() => setIsAddingNote(true)}
              disabled={isAddingNote}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Note
            </Button>
          </div>

          {/* Add Note Form */}
          {isAddingNote && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add New Note</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Note Type</Label>
                    <Select 
                      value={newNote.note_type} 
                      onValueChange={(value) => setNewNote(prev => ({ ...prev, note_type: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="phone_call">Phone Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Title (Optional)</Label>
                    <Input
                      value={newNote.title || ''}
                      onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Follow-up call scheduled"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    value={newNote.content || ''}
                    onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter your note here..."
                    rows={4}
                  />
                </div>

                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_private"
                      checked={newNote.is_private || false}
                      onCheckedChange={(checked) => 
                        setNewNote(prev => ({ ...prev, is_private: Boolean(checked) }))
                      }
                    />
                    <Label htmlFor="is_private">Private Note</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="visible_to_candidate"
                      checked={newNote.visible_to_candidate || false}
                      onCheckedChange={(checked) => 
                        setNewNote(prev => ({ ...prev, visible_to_candidate: Boolean(checked) }))
                      }
                    />
                    <Label htmlFor="visible_to_candidate">Visible to Candidate</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddingNote(false)}
                    disabled={isSubmitting}
                  >
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateNote}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Note
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Timeline</h3>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading timeline...</span>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No notes found. Add the first note to start tracking interactions.
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <Card key={note.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {getNoteIcon(note.note_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">
                                {getNoteTypeLabel(note.note_type)}
                              </Badge>
                              {note.title && (
                                <span className="font-medium text-sm">{note.title}</span>
                              )}
                              {note.is_private && (
                                <Badge variant="secondary" className="text-xs">Private</Badge>
                              )}
                              {note.visible_to_candidate && (
                                <Badge variant="default" className="text-xs">Visible to Candidate</Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteNote(note.id)}
                              >
                                <Trash className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-700 whitespace-pre-wrap mb-3">
                            {note.content}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {note.created_by_details ? 
                                    getInitials(note.created_by_details.full_name) : 
                                    '??'
                                  }
                                </AvatarFallback>
                              </Avatar>
                              <span>
                                {note.created_by_details?.full_name || 'Unknown User'}
                              </span>
                            </div>
                            <span>•</span>
                            <span>{formatDate(note.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}