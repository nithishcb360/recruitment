"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Send, Trash, Edit, Save, XCircle, MessageSquareText, Star, ListChecks } from "lucide-react"

interface Question {
  id: number
  text: string
  type: "text" | "number" | "rating" | "yes/no" | "multiple-choice" | "textarea"
  options?: string[] // For multiple-choice
  required: boolean
}

interface FeedbackForm {
  id: string
  name: string
  description: string
  questions: Question[]
  status: "draft" | "published"
}

export default function FeedbackFormBuilder() {
  const [activeTab, setActiveTab] = useState("forms")
  const [forms, setForms] = useState<FeedbackForm[]>([
    {
      id: "form-1",
      name: "Technical Interview Feedback",
      description: "Standard feedback form for technical interviews.",
      questions: [
        { id: 1, text: "Overall technical ability (1-5)", type: "rating", required: true },
        { id: 2, text: "Problem-solving skills", type: "textarea", required: false },
        { id: 3, text: "Code quality and maintainability", type: "textarea", required: false },
        { id: 4, text: "Familiarity with React/Next.js", type: "rating", required: true },
        {
          id: 5,
          text: "Recommendation (Hire/No Hire)",
          type: "multiple-choice",
          options: ["Strong Hire", "Hire", "Lean Hire", "No Hire"],
          required: true,
        },
      ],
      status: "published",
    },
    {
      id: "form-2",
      name: "Cultural Fit Assessment",
      description: "Assess candidate's alignment with company values.",
      questions: [
        { id: 1, text: "Teamwork and collaboration (1-5)", type: "rating", required: true },
        { id: 2, text: "Communication style", type: "textarea", required: false },
        { id: 3, text: "Adaptability to change", type: "yes/no", required: true },
      ],
      status: "draft",
    },
  ])
  const [editingForm, setEditingForm] = useState<FeedbackForm | null>(null)
  const [newQuestionText, setNewQuestionText] = useState("")
  const [newQuestionType, setNewQuestionType] = useState<Question["type"]>("text")
  const [newQuestionOptions, setNewQuestionOptions] = useState("")
  const [newQuestionRequired, setNewQuestionRequired] = useState(false)

  const handleCreateNewForm = () => {
    setEditingForm({
      id: `new-form-${Date.now()}`,
      name: "New Feedback Form",
      description: "",
      questions: [],
      status: "draft",
    })
    setActiveTab("builder")
  }

  const handleEditForm = (form: FeedbackForm) => {
    setEditingForm({ ...form })
    setActiveTab("builder")
  }

  const handleSaveForm = () => {
    if (!editingForm) return

    if (forms.find((f) => f.id === editingForm.id)) {
      setForms(forms.map((f) => (f.id === editingForm.id ? editingForm : f)))
    } else {
      setForms([...forms, editingForm])
    }
    setEditingForm(null)
    setActiveTab("forms")
    alert("Feedback form saved! (Simulated)")
  }

  const handleDeleteForm = (id: string) => {
    if (confirm("Are you sure you want to delete this form?")) {
      setForms(forms.filter((form) => form.id !== id))
      alert("Feedback form deleted! (Simulated)")
    }
  }

  const handlePublishForm = (id: string) => {
    setForms(forms.map((form) => (form.id === id ? { ...form, status: "published" } : form)))
    alert("Feedback form published! (Simulated)")
  }

  const handleUnpublishForm = (id: string) => {
    setForms(forms.map((form) => (form.id === id ? { ...form, status: "draft" } : form)))
    alert("Feedback form unpublished! (Simulated)")
  }

  const handleAddQuestion = () => {
    if (!editingForm || !newQuestionText) return

    const newQ: Question = {
      id: editingForm.questions.length ? Math.max(...editingForm.questions.map((q) => q.id)) + 1 : 1,
      text: newQuestionText,
      type: newQuestionType,
      required: newQuestionRequired,
    }
    if (newQuestionType === "multiple-choice") {
      newQ.options = newQuestionOptions
        .split(",")
        .map((opt) => opt.trim())
        .filter(Boolean)
    }

    setEditingForm((prev) => (prev ? { ...prev, questions: [...prev.questions, newQ] } : null))
    setNewQuestionText("")
    setNewQuestionType("text")
    setNewQuestionOptions("")
    setNewQuestionRequired(false)
  }

  const handleRemoveQuestion = (id: number) => {
    setEditingForm((prev) => (prev ? { ...prev, questions: prev.questions.filter((q) => q.id !== id) } : null))
  }

  const handleQuestionPropertyChange = (questionId: number, field: keyof Question, value: any) => {
    setEditingForm((prev) =>
      prev
        ? {
            ...prev,
            questions: prev.questions.map((q) => (q.id === questionId ? { ...q, [field]: value } : q)),
          }
        : null,
    )
  }

  const getQuestionIcon = (type: Question["type"]) => {
    switch (type) {
      case "text":
      case "textarea":
        return <MessageSquareText className="h-4 w-4" />
      case "number":
      case "rating":
        return <Star className="h-4 w-4" />
      case "yes/no":
      case "multiple-choice":
        return <ListChecks className="h-4 w-4" />
      default:
        return <MessageSquareText className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Feedback Form Builder</h1>
        <p className="text-muted-foreground">Create and manage custom feedback forms for interviews and assessments.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="forms">Your Forms</TabsTrigger>
          <TabsTrigger value="builder" disabled={!editingForm}>
            Form Builder
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Existing Feedback Forms</CardTitle>
              <Button onClick={handleCreateNewForm}>
                <Plus className="h-4 w-4 mr-2" /> Create New Form
              </Button>
            </CardHeader>
            <CardContent>
              {forms.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No feedback forms created yet.</div>
              ) : (
                <div className="space-y-4">
                  {forms.map((form) => (
                    <div key={form.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{form.name}</h3>
                        <p className="text-sm text-muted-foreground">{form.description}</p>
                        <Badge
                          variant="outline"
                          className={`mt-1 text-xs ${form.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                        >
                          {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditForm(form)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {form.status === "draft" ? (
                          <Button size="sm" onClick={() => handlePublishForm(form.id)}>
                            <Send className="h-4 w-4" /> Publish
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => handleUnpublishForm(form.id)}>
                            <XCircle className="h-4 w-4" /> Unpublish
                          </Button>
                        )}
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteForm(form.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder" className="mt-4">
          {editingForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingForm.name}</CardTitle>
                <CardDescription>Design your feedback form by adding questions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="form-name">Form Name</Label>
                  <Input
                    id="form-name"
                    value={editingForm.name}
                    onChange={(e) => setEditingForm({ ...editingForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="form-description">Description</Label>
                  <Textarea
                    id="form-description"
                    value={editingForm.description}
                    onChange={(e) => setEditingForm({ ...editingForm, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <h3 className="text-lg font-semibold">Questions</h3>
                <div className="space-y-4">
                  {editingForm.questions.length === 0 ? (
                    <p className="text-muted-foreground">No questions added yet. Start by adding one below!</p>
                  ) : (
                    editingForm.questions.map((q, index) => (
                      <div key={q.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getQuestionIcon(q.type)}
                            <span className="font-medium">Question {index + 1}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveQuestion(q.id)}>
                              <Trash className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`q-text-${q.id}`}>Question Text</Label>
                          <Input
                            id={`q-text-${q.id}`}
                            value={q.text}
                            onChange={(e) => handleQuestionPropertyChange(q.id, "text", e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`q-type-${q.id}`}>Type</Label>
                            <Select
                              value={q.type}
                              onValueChange={(val) => handleQuestionPropertyChange(q.id, "type", val)}
                            >
                              <SelectTrigger id={`q-type-${q.id}`}>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Short Text</SelectItem>
                                <SelectItem value="textarea">Long Text</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="rating">Rating (1-5)</SelectItem>
                                <SelectItem value="yes/no">Yes/No</SelectItem>
                                <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {q.type === "multiple-choice" && (
                            <div className="space-y-2">
                              <Label htmlFor={`q-options-${q.id}`}>Options (comma-separated)</Label>
                              <Input
                                id={`q-options-${q.id}`}
                                value={q.options?.join(", ") || ""}
                                onChange={(e) =>
                                  handleQuestionPropertyChange(
                                    q.id,
                                    "options",
                                    e.target.value.split(",").map((opt) => opt.trim()),
                                  )
                                }
                                placeholder="Option 1, Option 2, Option 3"
                              />
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`q-required-${q.id}`}
                              checked={q.required}
                              onCheckedChange={(checked) =>
                                handleQuestionPropertyChange(q.id, "required", Boolean(checked))
                              }
                            />
                            <Label htmlFor={`q-required-${q.id}`}>Required</Label>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t pt-4 mt-4 space-y-4">
                  <h3 className="text-lg font-semibold">Add New Question</h3>
                  <div className="space-y-2">
                    <Label htmlFor="new-q-text">Question Text</Label>
                    <Input
                      id="new-q-text"
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      placeholder="Enter new question text"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-q-type">Type</Label>
                      <Select value={newQuestionType} onValueChange={setNewQuestionType}>
                        <SelectTrigger id="new-q-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Short Text</SelectItem>
                          <SelectItem value="textarea">Long Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="rating">Rating (1-5)</SelectItem>
                          <SelectItem value="yes/no">Yes/No</SelectItem>
                          <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {newQuestionType === "multiple-choice" && (
                      <div className="space-y-2">
                        <Label htmlFor="new-q-options">Options (comma-separated)</Label>
                        <Input
                          id="new-q-options"
                          value={newQuestionOptions}
                          onChange={(e) => setNewQuestionOptions(e.target.value)}
                          placeholder="Option 1, Option 2, Option 3"
                        />
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="new-q-required"
                        checked={newQuestionRequired}
                        onCheckedChange={(checked) => setNewQuestionRequired(Boolean(checked))}
                      />
                      <Label htmlFor="new-q-required">Required</Label>
                    </div>
                  </div>
                  <Button onClick={handleAddQuestion} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Question
                  </Button>
                </div>

                <div className="flex justify-end space-x-2 border-t pt-4 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingForm(null)
                      setActiveTab("forms")
                    }}
                    className="bg-transparent"
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button onClick={handleSaveForm}>
                    <Save className="mr-2 h-4 w-4" /> Save Form
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
