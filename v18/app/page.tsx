"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Search,
  FileText,
  Settings,
  TrendingUp,
  TrendingDown,
  Plus,
  User,
  ChevronDown,
  Target,
  Globe,
  Bell,
  Calendar,
  Video,
  UserCheck,
  AlertTriangle,
  Award,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import JobCreationForm from "./components/job-creation-form"
import CandidatePipeline from "./components/candidate-pipeline"
import IntegrationsPanel from "./components/integrations-panel"
import AnalyticsDashboard from "./components/analytics-dashboard"
import SaaSPlatformAdmin from "./components/saas-platform-admin"
import ClientOrganizationSettings from "./components/client-organization-settings"
import InterviewPlatform from "./components/interview-platform"
import FeedbackFormBuilder from "./components/feedback-form-builder"

export default function RecruitmentDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [userRole, setUserRole] = useState("platform-admin") // Changed from "admin" to "platform-admin"
  const [selectedJob, setSelectedJob] = useState<number | null>(null)

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "feedback", label: "Feedback Forms", icon: FileText }, // Moved up
    { id: "jobs", label: "Jobs", icon: Briefcase }, // Moved down
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "screening", label: "AI/HR Screening", icon: Search },
    { id: "interviews", label: "Interviews", icon: Video },
    { id: "integrations", label: "Integrations", icon: Globe },
    { id: "analytics", label: "Analytics", icon: FileText }, // Renamed from Reports
    { id: "settings", label: "Settings", icon: Settings },
    ...(userRole === "platform-admin" ? [{ id: "platform", label: "Platform", icon: Target }] : []),
  ]

  // Compact business metrics
  const businessMetrics = [
    { title: "Active Jobs", current: 12, previous: 15, change: -20, trend: "down", subtitle: "3 filled" },
    { title: "Time to Fill", current: 18, previous: 22, change: -18, trend: "down", subtitle: "days avg" },
    { title: "Offer Rate", current: 78, previous: 72, change: 8, trend: "up", subtitle: "9/12 accepted" },
    { title: "Cost/Hire", current: 3200, previous: 3800, change: -16, trend: "down", subtitle: "15% below target" },
  ]

  // Next actions for immediate attention
  const nextActions = [
    {
      id: 1,
      type: "interview",
      title: "Interview in 30min",
      candidate: "Sarah Johnson",
      job: "Frontend Dev",
      action: "Join",
      priority: "critical",
      icon: Video,
    },
    {
      id: 2,
      type: "feedback",
      title: "Feedback overdue",
      candidate: "Michael Chen",
      job: "Product Manager",
      action: "Submit",
      priority: "high",
      icon: FileText,
    },
    {
      id: 3,
      type: "offer",
      title: "Offer expires today",
      candidate: "Emily Rodriguez",
      job: "UX Designer",
      action: "Follow Up",
      priority: "critical",
      icon: UserCheck,
    },
    {
      id: 4,
      type: "schedule",
      title: "Schedule final round",
      candidate: "David Kim",
      job: "Backend Eng",
      action: "Schedule",
      priority: "medium",
      icon: Calendar,
    },
  ]

  // Compact job data
  const activeJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      candidates: { applied: 8, screening: 4, interview: 6, offer: 2, hired: 1 },
      total: 21,
      daysOpen: 18,
      sla: 21,
      urgency: "high",
      nextAction: "Schedule 3 interviews",
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      candidates: { applied: 5, screening: 3, interview: 4, offer: 2, hired: 1 },
      total: 15,
      daysOpen: 12,
      sla: 21,
      urgency: "medium",
      nextAction: "Conduct 2 final rounds",
    },
    {
      id: 3,
      title: "UX Designer",
      department: "Design",
      candidates: { applied: 3, screening: 2, interview: 3, offer: 2, hired: 2 },
      total: 12,
      daysOpen: 8,
      sla: 21,
      urgency: "low",
      nextAction: "Prepare offer",
    },
    {
      id: 4,
      title: "DevOps Engineer",
      department: "Engineering",
      candidates: { applied: 12, screening: 6, interview: 2, offer: 0, hired: 0 },
      total: 20,
      daysOpen: 25,
      sla: 21,
      urgency: "critical",
      nextAction: "Review 6 candidates",
    },
  ]

  // Recent candidates needing attention
  const recentCandidates = [
    {
      id: 1,
      name: "Sarah Johnson",
      job: "Frontend Dev",
      stage: "Technical Interview",
      rating: 4.5,
      nextAction: "Schedule final round",
      urgency: "high",
      lastActivity: "2h ago",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      name: "Michael Chen",
      job: "Product Manager",
      stage: "Final Interview",
      rating: 4.8,
      nextAction: "Submit feedback",
      urgency: "high",
      lastActivity: "1d ago",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      job: "UX Designer",
      stage: "Offer",
      rating: 4.2,
      nextAction: "Follow up on offer",
      urgency: "critical",
      lastActivity: "3h ago",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 4,
      name: "David Kim",
      job: "Backend Eng",
      stage: "Screening",
      rating: 4.7,
      nextAction: "Schedule phone screen",
      urgency: "medium",
      lastActivity: "5h ago",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 5,
      name: "Lisa Wang",
      job: "DevOps Eng",
      stage: "Applied",
      rating: 4.1,
      nextAction: "Review application",
      urgency: "low",
      lastActivity: "1d ago",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  // Mock source performance data
  const topSources = [
    { name: "LinkedIn", hires: 12, costPerHire: 2400, conversion: 8.3 },
    { name: "Referrals", hires: 6, costPerHire: 1200, conversion: 17.6 },
    { name: "Indeed", hires: 8, costPerHire: 1800, conversion: 9.0 },
  ]

  const handleJobClick = (jobId: number) => {
    setSelectedJob(jobId)
    setActiveTab("candidates")
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-50"
      case "high":
        return "text-orange-600 bg-orange-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getUrgencyIndicator = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "border-l-red-500"
      case "high":
        return "border-l-orange-500"
      case "medium":
        return "border-l-yellow-500"
      default:
        return "border-l-green-500"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-900">
              Recruitment
              <br />
              Management
            </h1>
          </div>
          <nav className="px-4 space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Compact Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "jobs" && "Jobs"}
                {activeTab === "candidates" && "Candidates"}
                {activeTab === "screening" && "Screening"}
                {activeTab === "interviews" && "Interview Platform"}
                {activeTab === "feedback" && "Feedback Forms"}
                {activeTab === "integrations" && "Integrations"}
                {activeTab === "analytics" && "Analytics"}
                {activeTab === "settings" && "Settings"}
                {activeTab === "platform" && "Platform Admin"}
              </h1>
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs flex items-center justify-center">
                    3
                  </Badge>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Admin</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("settings")}>Organization Settings</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Sign Out</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setUserRole(userRole === "admin" ? "platform-admin" : "admin")}>
                      Switch to {userRole === "admin" ? "Platform Admin" : "Regular Admin"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setActiveTab("jobs")}>
                  <Plus className="h-4 w-4 mr-1" />
                  Job
                </Button>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          {activeTab === "dashboard" && (
            <div className="p-4 space-y-4">
              {/* Compact Business Metrics */}
              <div className="grid grid-cols-4 gap-3">
                {businessMetrics.map((metric, index) => (
                  <Card key={index} className="border-0 shadow-sm">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-600 font-medium">{metric.title}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-lg font-bold text-gray-900">
                              {metric.title.includes("Cost") ? `$${metric.current.toLocaleString()}` : metric.current}
                              {metric.title.includes("Rate") ? "%" : ""}
                            </span>
                            <div className="flex items-center space-x-1">
                              {metric.trend === "up" ? (
                                <TrendingUp className="h-3 w-3 text-green-500" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-500" />
                              )}
                              <span className={`text-xs ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                                {metric.change > 0 ? "+" : ""}
                                {metric.change}%
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{metric.subtitle}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Active Jobs & Next Actions - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Active Jobs */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-gray-900 flex items-center">
                      <Briefcase className="h-4 w-4 text-blue-500 mr-2" />
                      Active Jobs ({activeJobs.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 pt-0">
                    {" "}
                    {/* Reduced padding */}
                    <div className="space-y-1">
                      {" "}
                      {/* Reduced spacing */}
                      {activeJobs.map((job) => (
                        <div
                          key={job.id}
                          className={`p-2 border-l-2 border rounded-lg cursor-pointer hover:shadow-sm transition-shadow ${getUrgencyIndicator(
                            job.urgency,
                          )}`}
                          onClick={() => handleJobClick(job.id)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-sm text-gray-900 truncate">{job.title}</h3>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                job.urgency === "critical"
                                  ? "border-red-200 text-red-700"
                                  : job.urgency === "high"
                                    ? "border-orange-200 text-orange-700"
                                    : job.urgency === "medium"
                                      ? "border-yellow-200 text-yellow-700"
                                      : "border-green-200 text-green-700"
                              }`}
                            >
                              {job.daysOpen}d
                            </Badge>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>{job.department}</span>
                            <span>{job.total} candidates</span>
                          </div>
                          <div className="grid grid-cols-5 gap-0.5 mb-1 text-xs">
                            {" "}
                            {/* More compact stages */}
                            <div className="text-center">
                              <div className="font-medium text-blue-600">{job.candidates.applied}</div>
                              <div className="text-gray-500">App</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-yellow-600">{job.candidates.screening}</div>
                              <div className="text-gray-500">AI/HR</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-purple-600">{job.candidates.interview}</div>
                              <div className="text-gray-500">Tech</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-green-600">{job.candidates.offer}</div>
                              <div className="text-gray-500">Off</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-emerald-600">{job.candidates.hired}</div>
                              <div className="text-gray-500">Hir</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">{job.nextAction}</span>
                            <Progress value={(job.daysOpen / job.sla) * 100} className="w-12 h-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Next Actions */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-gray-900 flex items-center">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                      Next Actions ({nextActions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="grid grid-cols-1 gap-2">
                      {" "}
                      {/* Changed to single column for better fit */}
                      {nextActions.map((action) => (
                        <div
                          key={action.id}
                          className={`p-2 rounded-lg border flex items-center justify-between text-xs ${getPriorityColor(
                            action.priority,
                          )}`}
                        >
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <action.icon className="h-3 w-3 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">{action.title}</p>
                              <p className="text-gray-600 truncate">
                                {action.candidate} • {action.job}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-xs ml-2 flex-shrink-0 bg-transparent"
                          >
                            {action.action}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Candidates Table */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-900 flex items-center">
                    <Users className="h-4 w-4 text-green-500 mr-2" />
                    Recent Candidates ({recentCandidates.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-2 font-medium text-gray-600">Candidate</th>
                          <th className="pb-2 font-medium text-gray-600">Job</th>
                          <th className="pb-2 font-medium text-gray-600">Stage</th>
                          <th className="pb-2 font-medium text-gray-600">Rating</th>
                          <th className="pb-2 font-medium text-gray-600">Next Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentCandidates.map((candidate) => (
                          <tr key={candidate.id} className="border-b hover:bg-gray-50">
                            <td className="py-2">
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-xs">
                                    {candidate.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-gray-900">{candidate.name}</span>
                              </div>
                            </td>
                            <td className="py-2 text-gray-600">{candidate.job}</td>
                            <td className="py-2">
                              <Badge variant="outline" className="text-xs">
                                {candidate.stage}
                              </Badge>
                            </td>
                            <td className="py-2 text-yellow-600">★{candidate.rating}</td>
                            <td className="py-2">
                              <Button size="sm" variant="outline" className="h-5 px-2 text-xs bg-transparent">
                                {candidate.nextAction}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Sources - Moved to bottom */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-900 flex items-center">
                    <Award className="h-4 w-4 text-purple-500 mr-2" />
                    Top Performing Sources
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {topSources.map((source) => (
                      <div key={source.name} className="flex items-center justify-between p-2 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{source.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600">
                            {source.hires} Hires • ${source.costPerHire}/hire
                          </p>
                          <p className="text-xs font-medium text-green-600">{source.conversion}% Conversion</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other tabs remain the same */}
          {activeTab === "jobs" && <JobCreationForm />}
          {activeTab === "candidates" && <CandidatePipeline selectedJobId={selectedJob} />}
          {activeTab === "integrations" && <IntegrationsPanel />}
          {activeTab === "screening" && (
            <div className="p-6 text-center space-y-4">
              <Search className="h-16 w-16 mx-auto text-muted-foreground" />
              <h2 className="text-xl font-bold">AI/HR Screening Management</h2>
              <p className="text-muted-foreground">
                This section will provide advanced tools for automated candidate assessment. Future features include:
                AI-powered resume parsing and skill extraction, automated initial screening calls/chats, sentiment
                analysis of candidate responses, and automated scoring based on job requirements.
              </p>
            </div>
          )}
          {activeTab === "analytics" && <AnalyticsDashboard />}
          {activeTab === "settings" && <ClientOrganizationSettings />}
          {activeTab === "platform" && userRole === "platform-admin" && <SaaSPlatformAdmin />}
          {activeTab === "interviews" && <InterviewPlatform />}
          {activeTab === "feedback" && <FeedbackFormBuilder />}
        </main>
      </div>
    </div>
  )
}
