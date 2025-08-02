"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  GitBranch, Plus, Play, Pause, CheckCircle, XCircle, 
  Clock, Zap, Settings, Save, Trash2, Edit, Copy,
  AlertCircle, Users, Mail, MessageSquare, Calendar,
  FileText, BarChart, Target, ArrowRight, MoreVertical,
  Activity, Filter, Search, Download, Upload, RefreshCw
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface WorkflowStep {
  id: string
  type: 'trigger' | 'condition' | 'action' | 'delay' | 'approval'
  name: string
  description: string
  config: any
  status?: 'pending' | 'running' | 'completed' | 'failed'
  nextSteps: string[]
}

interface Workflow {
  id: string
  name: string
  description: string
  category: 'recruitment' | 'onboarding' | 'offboarding' | 'general'
  status: 'active' | 'inactive' | 'draft'
  createdAt: Date
  updatedAt: Date
  steps: WorkflowStep[]
  executions: number
  lastRun?: Date
}

interface WorkflowExecution {
  id: string
  workflowId: string
  startedAt: Date
  completedAt?: Date
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  currentStep: string
  logs: ExecutionLog[]
}

interface ExecutionLog {
  timestamp: Date
  stepId: string
  action: string
  details: string
  status: 'info' | 'success' | 'warning' | 'error'
}

export default function AutomatedWorkflows() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("workflows")
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [showExecutionDialog, setShowExecutionDialog] = useState(false)
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null)

  // Mock data
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "1",
      name: "New Candidate Application",
      description: "Automatically process new candidate applications",
      category: "recruitment",
      status: "active",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      steps: [
        {
          id: "trigger-1",
          type: "trigger",
          name: "New Application Received",
          description: "Triggered when a candidate submits an application",
          config: { event: "application.created" },
          nextSteps: ["condition-1"]
        },
        {
          id: "condition-1",
          type: "condition",
          name: "Check Requirements",
          description: "Verify minimum requirements are met",
          config: { 
            conditions: [
              { field: "experience", operator: ">=", value: 3 },
              { field: "skills", operator: "contains", value: ["React", "TypeScript"] }
            ]
          },
          nextSteps: ["action-1", "action-2"]
        },
        {
          id: "action-1",
          type: "action",
          name: "Send Acknowledgment",
          description: "Send email confirmation to candidate",
          config: { 
            template: "application_received",
            to: "{{candidate.email}}"
          },
          nextSteps: ["action-3"]
        },
        {
          id: "action-2",
          type: "action",
          name: "Notify Hiring Manager",
          description: "Alert relevant hiring manager",
          config: { 
            method: "email",
            template: "new_qualified_candidate"
          },
          nextSteps: ["approval-1"]
        },
        {
          id: "action-3",
          type: "action",
          name: "Update ATS",
          description: "Update application tracking system",
          config: { 
            status: "under_review",
            priority: "high"
          },
          nextSteps: []
        },
        {
          id: "approval-1",
          type: "approval",
          name: "Manager Approval",
          description: "Require hiring manager approval to proceed",
          config: { 
            approvers: ["hiring_manager"],
            timeout: 48
          },
          nextSteps: ["action-4"]
        },
        {
          id: "action-4",
          type: "action",
          name: "Schedule Screening",
          description: "Auto-schedule initial screening call",
          config: { 
            calendar: "recruiter",
            duration: 30,
            availableSlots: 5
          },
          nextSteps: []
        }
      ],
      executions: 156,
      lastRun: new Date(Date.now() - 3 * 60 * 60 * 1000)
    },
    {
      id: "2",
      name: "Employee Onboarding",
      description: "Automated onboarding process for new hires",
      category: "onboarding",
      status: "active",
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      steps: [
        {
          id: "trigger-2",
          type: "trigger",
          name: "Offer Accepted",
          description: "Triggered when candidate accepts job offer",
          config: { event: "offer.accepted" },
          nextSteps: ["action-5"]
        },
        {
          id: "action-5",
          type: "action",
          name: "Create Employee Record",
          description: "Create new employee in HRIS",
          config: { system: "hris", action: "create_employee" },
          nextSteps: ["action-6", "action-7"]
        },
        {
          id: "action-6",
          type: "action",
          name: "Send Welcome Email",
          description: "Send onboarding welcome package",
          config: { template: "welcome_package" },
          nextSteps: ["delay-1"]
        },
        {
          id: "action-7",
          type: "action",
          name: "IT Setup Request",
          description: "Request equipment and access setup",
          config: { 
            equipment: ["laptop", "monitor", "accessories"],
            access: ["email", "slack", "github"]
          },
          nextSteps: ["approval-2"]
        },
        {
          id: "delay-1",
          type: "delay",
          name: "Wait 7 Days",
          description: "Wait one week before start date",
          config: { duration: 7, unit: "days" },
          nextSteps: ["action-8"]
        },
        {
          id: "action-8",
          type: "action",
          name: "Send Reminder",
          description: "Send first day reminder and instructions",
          config: { template: "first_day_reminder" },
          nextSteps: []
        },
        {
          id: "approval-2",
          type: "approval",
          name: "IT Manager Approval",
          description: "Approve equipment and access requests",
          config: { approvers: ["it_manager"], timeout: 24 },
          nextSteps: []
        }
      ],
      executions: 89,
      lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: "3",
      name: "Interview Feedback Collection",
      description: "Collect and process interview feedback",
      category: "recruitment",
      status: "active",
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      steps: [
        {
          id: "trigger-3",
          type: "trigger",
          name: "Interview Completed",
          description: "Triggered when interview status changes to completed",
          config: { event: "interview.completed" },
          nextSteps: ["delay-2"]
        },
        {
          id: "delay-2",
          type: "delay",
          name: "Wait 30 Minutes",
          description: "Give interviewers time to complete initial notes",
          config: { duration: 30, unit: "minutes" },
          nextSteps: ["action-9"]
        },
        {
          id: "action-9",
          type: "action",
          name: "Send Feedback Forms",
          description: "Send feedback forms to all interviewers",
          config: { 
            template: "interview_feedback",
            deadline: 24
          },
          nextSteps: ["condition-2"]
        },
        {
          id: "condition-2",
          type: "condition",
          name: "Check Submission",
          description: "Check if all feedback submitted within deadline",
          config: { 
            condition: "all_feedback_received",
            timeout: 24
          },
          nextSteps: ["action-10", "action-11"]
        },
        {
          id: "action-10",
          type: "action",
          name: "Compile Feedback",
          description: "Aggregate all feedback into report",
          config: { format: "pdf", includeScores: true },
          nextSteps: ["action-12"]
        },
        {
          id: "action-11",
          type: "action",
          name: "Send Reminder",
          description: "Remind pending interviewers",
          config: { template: "feedback_reminder" },
          nextSteps: []
        },
        {
          id: "action-12",
          type: "action",
          name: "Update Candidate Status",
          description: "Update candidate pipeline based on feedback",
          config: { 
            scoreThreshold: 7,
            passStatus: "next_round",
            failStatus: "rejected"
          },
          nextSteps: []
        }
      ],
      executions: 234,
      lastRun: new Date(Date.now() - 5 * 60 * 60 * 1000)
    }
  ])

  const [executions, setExecutions] = useState<WorkflowExecution[]>([
    {
      id: "exec-1",
      workflowId: "1",
      startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      status: "completed",
      currentStep: "action-4",
      logs: [
        {
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          stepId: "trigger-1",
          action: "Workflow triggered",
          details: "New application received from Sarah Chen",
          status: "info"
        },
        {
          timestamp: new Date(Date.now() - 119 * 60 * 1000),
          stepId: "condition-1",
          action: "Condition evaluated",
          details: "Requirements met: 6 years experience, has React and TypeScript",
          status: "success"
        },
        {
          timestamp: new Date(Date.now() - 118 * 60 * 1000),
          stepId: "action-1",
          action: "Email sent",
          details: "Acknowledgment sent to sarah.chen@email.com",
          status: "success"
        }
      ]
    },
    {
      id: "exec-2",
      workflowId: "1",
      startedAt: new Date(Date.now() - 30 * 60 * 1000),
      status: "running",
      currentStep: "approval-1",
      logs: [
        {
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          stepId: "trigger-1",
          action: "Workflow triggered",
          details: "New application received from Marcus Johnson",
          status: "info"
        },
        {
          timestamp: new Date(Date.now() - 29 * 60 * 1000),
          stepId: "approval-1",
          action: "Awaiting approval",
          details: "Waiting for hiring manager approval",
          status: "warning"
        }
      ]
    }
  ])

  // Workflow builder state
  const [builderSteps, setBuilderSteps] = useState<WorkflowStep[]>([])
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null)

  const stepTypes = [
    { type: 'trigger', label: 'Trigger', icon: <Zap className="h-4 w-4" />, color: 'bg-blue-500' },
    { type: 'condition', label: 'Condition', icon: <GitBranch className="h-4 w-4" />, color: 'bg-yellow-500' },
    { type: 'action', label: 'Action', icon: <Play className="h-4 w-4" />, color: 'bg-green-500' },
    { type: 'delay', label: 'Delay', icon: <Clock className="h-4 w-4" />, color: 'bg-gray-500' },
    { type: 'approval', label: 'Approval', icon: <Users className="h-4 w-4" />, color: 'bg-purple-500' }
  ]

  const triggerEvents = [
    "application.created",
    "application.updated", 
    "interview.scheduled",
    "interview.completed",
    "offer.sent",
    "offer.accepted",
    "offer.rejected",
    "employee.started",
    "employee.terminated"
  ]

  const actionTypes = [
    { value: "send_email", label: "Send Email" },
    { value: "update_status", label: "Update Status" },
    { value: "create_task", label: "Create Task" },
    { value: "send_notification", label: "Send Notification" },
    { value: "update_ats", label: "Update ATS" },
    { value: "schedule_meeting", label: "Schedule Meeting" },
    { value: "generate_report", label: "Generate Report" },
    { value: "webhook", label: "Call Webhook" }
  ]

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || workflow.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleCreateWorkflow = () => {
    setIsCreating(true)
    setSelectedWorkflow(null)
    setBuilderSteps([
      {
        id: `trigger-${Date.now()}`,
        type: 'trigger',
        name: 'New Trigger',
        description: 'Configure trigger event',
        config: {},
        nextSteps: []
      }
    ])
  }

  const handleAddStep = (type: WorkflowStep['type']) => {
    const newStep: WorkflowStep = {
      id: `${type}-${Date.now()}`,
      type,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      description: `Configure ${type}`,
      config: {},
      nextSteps: []
    }
    setBuilderSteps([...builderSteps, newStep])
  }

  const handleSaveWorkflow = () => {
    toast({
      title: "Workflow Saved",
      description: "Your workflow has been saved successfully.",
      variant: "default"
    })
    setIsCreating(false)
  }

  const handleToggleWorkflow = (workflowId: string) => {
    setWorkflows(workflows.map(wf => {
      if (wf.id === workflowId) {
        const newStatus = wf.status === 'active' ? 'inactive' : 'active'
        toast({
          title: `Workflow ${newStatus === 'active' ? 'Activated' : 'Deactivated'}`,
          description: `${wf.name} is now ${newStatus}.`,
          variant: "default"
        })
        return { ...wf, status: newStatus }
      }
      return wf
    }))
  }

  const handleDeleteWorkflow = (workflowId: string) => {
    setWorkflows(workflows.filter(wf => wf.id !== workflowId))
    toast({
      title: "Workflow Deleted",
      description: "The workflow has been deleted successfully.",
      variant: "default"
    })
  }

  const handleViewExecution = (execution: WorkflowExecution) => {
    setSelectedExecution(execution)
    setShowExecutionDialog(true)
  }

  const getStepIcon = (type: WorkflowStep['type']) => {
    const stepType = stepTypes.find(st => st.type === type)
    return stepType ? stepType.icon : null
  }

  const getStepColor = (type: WorkflowStep['type']) => {
    const stepType = stepTypes.find(st => st.type === type)
    return stepType ? stepType.color : 'bg-gray-500'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'running':
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
      case 'draft':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Automated Workflows</h1>
          <p className="text-muted-foreground">
            Create and manage automated recruitment and HR workflows
          </p>
        </div>
        <Button onClick={handleCreateWorkflow}>
          <Plus className="mr-2 h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      {isCreating ? (
        // Workflow Builder
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Workflow Builder</h2>
              <p className="text-sm text-muted-foreground">
                Design your automated workflow by adding and connecting steps
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveWorkflow}>
                <Save className="mr-2 h-4 w-4" />
                Save Workflow
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Step Types Panel */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add Steps</CardTitle>
                  <CardDescription>Drag or click to add steps to your workflow</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stepTypes.map((stepType) => (
                    <Button
                      key={stepType.type}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAddStep(stepType.type as WorkflowStep['type'])}
                    >
                      <div className={`p-1 rounded mr-2 ${stepType.color}`}>
                        {stepType.icon}
                      </div>
                      {stepType.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Workflow Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Workflow Name</Label>
                    <Input placeholder="Enter workflow name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Describe what this workflow does" rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select defaultValue="recruitment">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recruitment">Recruitment</SelectItem>
                        <SelectItem value="onboarding">Onboarding</SelectItem>
                        <SelectItem value="offboarding">Offboarding</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Workflow Canvas */}
            <div className="lg:col-span-3">
              <Card className="h-[600px]">
                <CardHeader>
                  <CardTitle>Workflow Steps</CardTitle>
                  <CardDescription>Configure each step and connect them to create your workflow</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-4">
                      {builderSteps.map((step, index) => (
                        <div key={step.id} className="relative">
                          <Card 
                            className={`cursor-pointer transition-all ${
                              selectedStep?.id === step.id ? 'ring-2 ring-blue-500' : ''
                            }`}
                            onClick={() => setSelectedStep(step)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                  <div className={`p-2 rounded ${getStepColor(step.type)}`}>
                                    {getStepIcon(step.type)}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{step.name}</h4>
                                    <p className="text-sm text-muted-foreground">{step.description}</p>
                                    {step.type === 'trigger' && step.config.event && (
                                      <Badge variant="outline" className="mt-1">{step.config.event}</Badge>
                                    )}
                                    {step.type === 'action' && step.config.template && (
                                      <Badge variant="outline" className="mt-1">{step.config.template}</Badge>
                                    )}
                                  </div>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit Step
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Copy className="mr-2 h-4 w-4" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>

                              {/* Step Configuration based on type */}
                              {selectedStep?.id === step.id && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                                  {step.type === 'trigger' && (
                                    <div className="space-y-2">
                                      <Label>Trigger Event</Label>
                                      <Select defaultValue={step.config.event}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select trigger event" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {triggerEvents.map(event => (
                                            <SelectItem key={event} value={event}>{event}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}
                                  {step.type === 'action' && (
                                    <>
                                      <div className="space-y-2">
                                        <Label>Action Type</Label>
                                        <Select>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select action" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {actionTypes.map(action => (
                                              <SelectItem key={action.value} value={action.value}>
                                                {action.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Configuration</Label>
                                        <Textarea placeholder="Enter action configuration (JSON)" rows={3} />
                                      </div>
                                    </>
                                  )}
                                  {step.type === 'condition' && (
                                    <div className="space-y-2">
                                      <Label>Condition Logic</Label>
                                      <Textarea placeholder="Define condition rules" rows={3} />
                                    </div>
                                  )}
                                  {step.type === 'delay' && (
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label>Duration</Label>
                                        <Input type="number" placeholder="Duration" />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Unit</Label>
                                        <Select>
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="minutes">Minutes</SelectItem>
                                            <SelectItem value="hours">Hours</SelectItem>
                                            <SelectItem value="days">Days</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  )}
                                  {step.type === 'approval' && (
                                    <>
                                      <div className="space-y-2">
                                        <Label>Approvers</Label>
                                        <Input placeholder="Enter approver roles or emails" />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Timeout (hours)</Label>
                                        <Input type="number" placeholder="Timeout in hours" />
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                          {index < builderSteps.length - 1 && (
                            <div className="flex justify-center my-2">
                              <ArrowRight className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        // Workflow List and Management
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="executions">Executions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="workflows" className="mt-6">
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search workflows..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="recruitment">Recruitment</SelectItem>
                      <SelectItem value="onboarding">Onboarding</SelectItem>
                      <SelectItem value="offboarding">Offboarding</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Workflow List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWorkflows.map((workflow) => (
                  <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{workflow.name}</CardTitle>
                          <CardDescription>{workflow.description}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(workflow.status)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedWorkflow(workflow)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Workflow
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleWorkflow(workflow.id)}>
                                {workflow.status === 'active' ? (
                                  <>
                                    <Pause className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Play className="mr-2 h-4 w-4" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteWorkflow(workflow.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Category</span>
                          <Badge variant="outline" className="capitalize">{workflow.category}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Steps</span>
                          <span className="font-medium">{workflow.steps.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Executions</span>
                          <span className="font-medium">{workflow.executions}</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Last run</span>
                          <span>{workflow.lastRun ? workflow.lastRun.toLocaleString() : 'Never'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="executions" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Workflow Executions</CardTitle>
                    <CardDescription>Monitor and manage running workflows</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {executions.map((execution) => {
                    const workflow = workflows.find(wf => wf.id === execution.workflowId)
                    return (
                      <Card key={execution.id} className="cursor-pointer" onClick={() => handleViewExecution(execution)}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div>{getStatusIcon(execution.status)}</div>
                              <div>
                                <h4 className="font-medium">{workflow?.name || 'Unknown Workflow'}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Started {execution.startedAt.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={execution.status === 'completed' ? 'default' : 'secondary'}>
                                {execution.status}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                Current: {execution.currentStep}
                              </p>
                            </div>
                          </div>
                          {execution.status === 'running' && (
                            <Progress value={60} className="mt-3 h-1" />
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Workflows</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {workflows.filter(wf => wf.status === 'active').length}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Successful Runs</p>
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Execution Time</p>
                    <p className="text-2xl font-bold text-gray-900">4.5m</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Time Saved</p>
                    <p className="text-2xl font-bold text-gray-900">312h</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Workflow Performance</CardTitle>
                <CardDescription>Execution metrics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Most Used Workflows</h4>
                    <div className="space-y-2">
                      {workflows.slice(0, 5).map((workflow) => (
                        <div key={workflow.id} className="flex items-center justify-between">
                          <span className="text-sm">{workflow.name}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={(workflow.executions / 300) * 100} className="w-32 h-2" />
                            <span className="text-sm text-muted-foreground w-12 text-right">
                              {workflow.executions}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Execution Status Distribution</h4>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">78%</div>
                        <div className="text-xs text-muted-foreground">Success Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">12%</div>
                        <div className="text-xs text-muted-foreground">Failure Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">8%</div>
                        <div className="text-xs text-muted-foreground">Cancelled</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">2%</div>
                        <div className="text-xs text-muted-foreground">Running</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Execution Details Dialog */}
      <Dialog open={showExecutionDialog} onOpenChange={setShowExecutionDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Execution Details</DialogTitle>
            <DialogDescription>
              View detailed logs and status of this workflow execution
            </DialogDescription>
          </DialogHeader>
          {selectedExecution && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Workflow</Label>
                  <p className="font-medium">
                    {workflows.find(wf => wf.id === selectedExecution.workflowId)?.name}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedExecution.status)}
                    <span className="font-medium capitalize">{selectedExecution.status}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Started</Label>
                  <p className="font-medium">{selectedExecution.startedAt.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Duration</Label>
                  <p className="font-medium">
                    {selectedExecution.completedAt 
                      ? `${Math.round((selectedExecution.completedAt.getTime() - selectedExecution.startedAt.getTime()) / 1000 / 60)} minutes`
                      : 'Running...'
                    }
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm text-muted-foreground mb-2">Execution Logs</Label>
                <ScrollArea className="h-64 border rounded-lg p-4 bg-gray-50">
                  <div className="space-y-2">
                    {selectedExecution.logs.map((log, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm">
                        <span className="text-muted-foreground font-mono text-xs">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                        <Badge 
                          variant={
                            log.status === 'success' ? 'default' :
                            log.status === 'error' ? 'destructive' :
                            log.status === 'warning' ? 'secondary' : 'outline'
                          }
                          className="text-xs"
                        >
                          {log.stepId}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-medium">{log.action}</p>
                          <p className="text-muted-foreground">{log.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExecutionDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}