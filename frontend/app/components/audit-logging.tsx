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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Shield, Search, Download, Filter, Calendar as CalendarIcon,
  FileText, AlertTriangle, CheckCircle, XCircle, Clock,
  User, Settings, Database, Lock, Key, Globe, Mail,
  CreditCard, Users, Building, Briefcase, UserCheck,
  Eye, Edit, Trash2, LogOut, LogIn, RefreshCw, Activity
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface AuditLog {
  id: string
  timestamp: Date
  user: {
    id: string
    name: string
    email: string
    avatar?: string
    role: string
  }
  action: string
  resource: string
  resourceId: string
  details: any
  ipAddress: string
  userAgent: string
  location?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'auth' | 'data' | 'system' | 'compliance' | 'security'
  status: 'success' | 'failed' | 'warning'
}

interface ComplianceReport {
  id: string
  name: string
  type: 'gdpr' | 'ccpa' | 'hipaa' | 'sox' | 'custom'
  generatedAt: Date
  generatedBy: string
  period: {
    start: Date
    end: Date
  }
  status: 'completed' | 'pending' | 'failed'
  findings: number
  violations: number
}

interface DataRetentionPolicy {
  id: string
  dataType: string
  retentionPeriod: number
  unit: 'days' | 'months' | 'years'
  action: 'archive' | 'delete' | 'anonymize'
  isActive: boolean
  lastRun?: Date
  nextRun?: Date
}

interface SecurityAlert {
  id: string
  type: 'suspicious_login' | 'permission_change' | 'data_export' | 'failed_auth' | 'policy_violation'
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: Date
  description: string
  user?: string
  resolved: boolean
  resolvedBy?: string
  resolvedAt?: Date
}

export default function AuditLogging() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("logs")
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date()
  })
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<string>("all")
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [showLogDetails, setShowLogDetails] = useState(false)

  // Mock data
  const [auditLogs] = useState<AuditLog[]>([
    {
      id: "1",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      user: {
        id: "user-1",
        name: "Sarah Chen",
        email: "sarah.chen@company.com",
        role: "Admin"
      },
      action: "UPDATE_USER_PERMISSIONS",
      resource: "User",
      resourceId: "user-123",
      details: {
        changes: {
          permissions: {
            added: ["candidates.delete", "reports.export"],
            removed: ["settings.modify"]
          }
        },
        reason: "Role change from Manager to Admin"
      },
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      location: "San Francisco, CA",
      severity: "high",
      category: "security",
      status: "success"
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      user: {
        id: "user-2",
        name: "Marcus Johnson",
        email: "marcus.j@company.com",
        role: "Recruiter"
      },
      action: "EXPORT_CANDIDATE_DATA",
      resource: "Candidates",
      resourceId: "export-456",
      details: {
        recordCount: 150,
        format: "CSV",
        filters: {
          status: "active",
          dateRange: "last_30_days"
        }
      },
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      location: "Austin, TX",
      severity: "medium",
      category: "data",
      status: "success"
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      user: {
        id: "user-3",
        name: "Emily Rodriguez",
        email: "emily.r@company.com",
        role: "HR Manager"
      },
      action: "FAILED_LOGIN_ATTEMPT",
      resource: "Authentication",
      resourceId: "auth-789",
      details: {
        reason: "Invalid password",
        attemptCount: 3,
        accountLocked: false
      },
      ipAddress: "203.0.113.45",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)",
      location: "Unknown Location",
      severity: "high",
      category: "auth",
      status: "failed"
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      user: {
        id: "user-1",
        name: "Sarah Chen",
        email: "sarah.chen@company.com",
        role: "Admin"
      },
      action: "DELETE_CANDIDATE",
      resource: "Candidate",
      resourceId: "candidate-101",
      details: {
        candidateName: "John Doe",
        reason: "GDPR data removal request",
        backupCreated: true
      },
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      location: "San Francisco, CA",
      severity: "high",
      category: "compliance",
      status: "success"
    },
    {
      id: "5",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      user: {
        id: "system",
        name: "System",
        email: "system@company.com",
        role: "System"
      },
      action: "AUTOMATIC_BACKUP",
      resource: "Database",
      resourceId: "backup-202",
      details: {
        type: "Full backup",
        size: "2.5GB",
        duration: "15 minutes",
        destination: "AWS S3"
      },
      ipAddress: "10.0.0.1",
      userAgent: "System Process",
      severity: "low",
      category: "system",
      status: "success"
    }
  ])

  const [complianceReports] = useState<ComplianceReport[]>([
    {
      id: "report-1",
      name: "GDPR Compliance Report Q1 2024",
      type: "gdpr",
      generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      generatedBy: "Sarah Chen",
      period: {
        start: new Date("2024-01-01"),
        end: new Date("2024-03-31")
      },
      status: "completed",
      findings: 12,
      violations: 2
    },
    {
      id: "report-2",
      name: "CCPA Data Privacy Audit",
      type: "ccpa",
      generatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      generatedBy: "Compliance Team",
      period: {
        start: new Date("2024-02-01"),
        end: new Date("2024-02-29")
      },
      status: "completed",
      findings: 8,
      violations: 0
    }
  ])

  const [retentionPolicies] = useState<DataRetentionPolicy[]>([
    {
      id: "policy-1",
      dataType: "Candidate Applications",
      retentionPeriod: 2,
      unit: "years",
      action: "archive",
      isActive: true,
      lastRun: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: "policy-2",
      dataType: "Interview Recordings",
      retentionPeriod: 6,
      unit: "months",
      action: "delete",
      isActive: true,
      lastRun: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    },
    {
      id: "policy-3",
      dataType: "Rejected Candidates",
      retentionPeriod: 1,
      unit: "years",
      action: "anonymize",
      isActive: true,
      lastRun: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    }
  ])

  const [securityAlerts] = useState<SecurityAlert[]>([
    {
      id: "alert-1",
      type: "suspicious_login",
      severity: "high",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      description: "Multiple failed login attempts from unusual location",
      user: "emily.r@company.com",
      resolved: false
    },
    {
      id: "alert-2",
      type: "data_export",
      severity: "medium",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      description: "Large data export (>1000 records) detected",
      user: "marcus.j@company.com",
      resolved: true,
      resolvedBy: "sarah.chen@company.com",
      resolvedAt: new Date(Date.now() - 10 * 60 * 60 * 1000)
    },
    {
      id: "alert-3",
      type: "permission_change",
      severity: "critical",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      description: "Admin privileges granted to non-admin user",
      user: "john.doe@company.com",
      resolved: true,
      resolvedBy: "system",
      resolvedAt: new Date(Date.now() - 23 * 60 * 60 * 1000)
    }
  ])

  // Filtering logic
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = searchTerm === "" || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(log.category)
    const matchesSeverity = selectedSeverity === "all" || log.severity === selectedSeverity
    const matchesUser = selectedUser === "all" || log.user.id === selectedUser
    
    const matchesDateRange = (!dateRange.from || log.timestamp >= dateRange.from) &&
                            (!dateRange.to || log.timestamp <= dateRange.to)
    
    return matchesSearch && matchesCategory && matchesSeverity && matchesUser && matchesDateRange
  })

  const getActionIcon = (action: string) => {
    if (action.includes('LOGIN')) return <LogIn className="h-4 w-4" />
    if (action.includes('LOGOUT')) return <LogOut className="h-4 w-4" />
    if (action.includes('UPDATE') || action.includes('EDIT')) return <Edit className="h-4 w-4" />
    if (action.includes('DELETE')) return <Trash2 className="h-4 w-4" />
    if (action.includes('EXPORT')) return <Download className="h-4 w-4" />
    if (action.includes('PERMISSION')) return <Key className="h-4 w-4" />
    if (action.includes('BACKUP')) return <Database className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const handleExportLogs = () => {
    toast({
      title: "Export Started",
      description: "Your audit logs are being exported. You'll receive a download link shortly.",
      variant: "default"
    })
    setShowExportDialog(false)
  }

  const handleViewLogDetails = (log: AuditLog) => {
    setSelectedLog(log)
    setShowLogDetails(true)
  }

  const handleResolveAlert = (alertId: string) => {
    toast({
      title: "Alert Resolved",
      description: "The security alert has been marked as resolved.",
      variant: "default"
    })
  }

  const handleGenerateReport = (type: string) => {
    toast({
      title: "Report Generation Started",
      description: `Your ${type} compliance report is being generated.`,
      variant: "default"
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Shield className="mr-3 h-7 w-7 text-blue-600" />
            Audit Logging & Compliance
          </h1>
          <p className="text-muted-foreground">
            Monitor system activity, ensure compliance, and maintain security
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Compliant
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="retention">Data Retention</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Audit Log History</CardTitle>
                  <CardDescription>
                    Comprehensive record of all system activities and changes
                  </CardDescription>
                </div>
                <Button onClick={() => setShowExportDialog(true)}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Logs
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="min-w-[200px] justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from && dateRange.to ? (
                        `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d")}`
                      ) : (
                        "Select date range"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range: any) => setDateRange(range || { from: undefined, to: undefined })}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>

                <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="user-1">Sarah Chen</SelectItem>
                    <SelectItem value="user-2">Marcus Johnson</SelectItem>
                    <SelectItem value="user-3">Emily Rodriguez</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      Categories ({selectedCategories.length})
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56">
                    <div className="space-y-2">
                      {['auth', 'data', 'system', 'compliance', 'security'].map(category => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCategories([...selectedCategories, category])
                              } else {
                                setSelectedCategories(selectedCategories.filter(c => c !== category))
                              }
                            }}
                          />
                          <Label htmlFor={category} className="text-sm capitalize">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Logs Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id} className="cursor-pointer hover:bg-gray-50">
                        <TableCell className="text-sm">
                          {format(log.timestamp, "MMM d, HH:mm:ss")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={log.user.avatar} />
                              <AvatarFallback className="text-xs">
                                {log.user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{log.user.name}</p>
                              <p className="text-xs text-muted-foreground">{log.user.role}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getActionIcon(log.action)}
                            <span className="text-sm">{log.action.replace(/_/g, ' ')}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {log.resource}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {log.location || log.ipAddress}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getSeverityColor(log.severity)}>
                            {log.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusIcon(log.status)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewLogDetails(log)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-4 gap-4 pt-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{filteredLogs.length}</div>
                    <p className="text-xs text-muted-foreground">Total Events</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {filteredLogs.filter(l => l.status === 'success').length}
                    </div>
                    <p className="text-xs text-muted-foreground">Successful</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-red-600">
                      {filteredLogs.filter(l => l.status === 'failed').length}
                    </div>
                    <p className="text-xs text-muted-foreground">Failed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-orange-600">
                      {filteredLogs.filter(l => l.severity === 'high' || l.severity === 'critical').length}
                    </div>
                    <p className="text-xs text-muted-foreground">High Priority</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Security Alerts</CardTitle>
                  <CardDescription>
                    Monitor and respond to security events and anomalies
                  </CardDescription>
                </div>
                <Badge variant="destructive">
                  {securityAlerts.filter(a => !a.resolved).length} Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityAlerts.map((alert) => (
                  <Card key={alert.id} className={`border-l-4 ${
                    alert.severity === 'critical' ? 'border-l-red-500' :
                    alert.severity === 'high' ? 'border-l-orange-500' :
                    alert.severity === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle className={`h-5 w-5 ${
                              alert.severity === 'critical' ? 'text-red-500' :
                              alert.severity === 'high' ? 'text-orange-500' :
                              alert.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'
                            }`} />
                            <h4 className="font-semibold">
                              {alert.type.replace(/_/g, ' ').charAt(0).toUpperCase() + 
                               alert.type.replace(/_/g, ' ').slice(1)}
                            </h4>
                            <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                            {alert.resolved && (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                Resolved
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>
                              {format(alert.timestamp, "MMM d, yyyy HH:mm")}
                            </span>
                            {alert.user && (
                              <span>User: {alert.user}</span>
                            )}
                            {alert.resolved && alert.resolvedBy && (
                              <span>Resolved by: {alert.resolvedBy}</span>
                            )}
                          </div>
                        </div>
                        {!alert.resolved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResolveAlert(alert.id)}
                          >
                            Mark Resolved
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <div className="space-y-6">
            {/* Compliance Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">GDPR</p>
                    <p className="text-2xl font-bold text-gray-900">Compliant</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">CCPA</p>
                    <p className="text-2xl font-bold text-gray-900">Compliant</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">HIPAA</p>
                    <p className="text-2xl font-bold text-gray-900">Review</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">SOX</p>
                    <p className="text-2xl font-bold text-gray-900">Compliant</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Reports */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Compliance Reports</CardTitle>
                    <CardDescription>
                      Generated compliance reports and audits
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleGenerateReport('GDPR')}>
                      Generate GDPR Report
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleGenerateReport('CCPA')}>
                      Generate CCPA Report
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-medium">{report.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Generated by {report.generatedBy} on {format(report.generatedAt, "MMM d, yyyy")}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <Badge variant="outline">{report.type.toUpperCase()}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {report.findings} findings • {report.violations} violations
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Compliance Checklist */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Checklist</CardTitle>
                <CardDescription>Key compliance requirements and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { item: "Data encryption at rest and in transit", status: true },
                    { item: "User consent management system", status: true },
                    { item: "Data portability features", status: true },
                    { item: "Right to erasure (GDPR Article 17)", status: true },
                    { item: "Privacy policy updated within 30 days", status: true },
                    { item: "Data breach notification process", status: true },
                    { item: "Regular security audits", status: false },
                    { item: "Employee privacy training", status: true }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.item}</span>
                      {item.status ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="retention" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Data Retention Policies</CardTitle>
                  <CardDescription>
                    Automated data retention and deletion policies
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Policy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {retentionPolicies.map((policy) => (
                  <Card key={policy.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Database className="h-5 w-5 text-blue-600" />
                            <h4 className="font-semibold">{policy.dataType}</h4>
                            <Badge variant={policy.isActive ? "default" : "secondary"}>
                              {policy.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Retention Period</p>
                              <p className="font-medium">{policy.retentionPeriod} {policy.unit}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Action</p>
                              <p className="font-medium capitalize">{policy.action}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Last Run</p>
                              <p className="font-medium">
                                {policy.lastRun ? format(policy.lastRun, "MMM d, yyyy") : "Never"}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Next Run</p>
                              <p className="font-medium">
                                {policy.nextRun ? format(policy.nextRun, "MMM d, yyyy") : "Not scheduled"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch checked={policy.isActive} />
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Log Settings</CardTitle>
                <CardDescription>Configure audit logging preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Audit Logging</Label>
                    <p className="text-xs text-muted-foreground">Log all system activities</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Log Authentication Events</Label>
                    <p className="text-xs text-muted-foreground">Track login/logout activities</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Log Data Access</Label>
                    <p className="text-xs text-muted-foreground">Track data viewing and exports</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Log Configuration Changes</Label>
                    <p className="text-xs text-muted-foreground">Track system settings modifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Log Retention Period</Label>
                  <Select defaultValue="90">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="730">2 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Configuration</CardTitle>
                <CardDescription>Set up security alert thresholds and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Failed Login Attempts Threshold</Label>
                  <Select defaultValue="3">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                      <SelectItem value="10">10 attempts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Large Data Export Threshold</Label>
                  <Select defaultValue="1000">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="500">500 records</SelectItem>
                      <SelectItem value="1000">1,000 records</SelectItem>
                      <SelectItem value="5000">5,000 records</SelectItem>
                      <SelectItem value="10000">10,000 records</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Send alerts via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>In-App Notifications</Label>
                    <p className="text-xs text-muted-foreground">Show alerts in notification panel</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Alert Recipients</Label>
                  <Input placeholder="admin@company.com, security@company.com" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Audit Logs</DialogTitle>
            <DialogDescription>
              Choose export format and filters for your audit log export
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select defaultValue="csv">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Include</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-details" defaultChecked />
                  <Label htmlFor="include-details" className="text-sm">Full event details</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-ip" defaultChecked />
                  <Label htmlFor="include-ip" className="text-sm">IP addresses and locations</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-user" defaultChecked />
                  <Label htmlFor="include-user" className="text-sm">User information</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleExportLogs}>
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Log Details Dialog */}
      <Dialog open={showLogDetails} onOpenChange={setShowLogDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Complete information about this system event
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Event ID</Label>
                  <p className="font-mono text-sm">{selectedLog.id}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Timestamp</Label>
                  <p className="text-sm">{format(selectedLog.timestamp, "PPpp")}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">User</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedLog.user.avatar} />
                      <AvatarFallback className="text-xs">
                        {selectedLog.user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{selectedLog.user.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedLog.user.email}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Action</Label>
                  <p className="text-sm font-medium">{selectedLog.action.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Resource</Label>
                  <p className="text-sm">{selectedLog.resource} ({selectedLog.resourceId})</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedLog.status)}
                    <span className="text-sm capitalize">{selectedLog.status}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm text-muted-foreground">Details</Label>
                <pre className="mt-2 p-4 bg-gray-50 rounded-lg text-xs overflow-auto">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">IP Address</Label>
                  <p className="text-sm font-mono">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Location</Label>
                  <p className="text-sm">{selectedLog.location || 'Unknown'}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">User Agent</Label>
                <p className="text-sm font-mono text-xs">{selectedLog.userAgent}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogDetails(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}