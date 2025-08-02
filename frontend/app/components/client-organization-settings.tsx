"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { 
  Building2, Users, Bell, Shield, Palette, FileText, Plus, Trash, Save, 
  Settings, Lock, Unlock, Eye, EyeOff, Key, Globe, Mail, Phone,
  AlertTriangle, CheckCircle, Clock, Upload, Download, Copy,
  Database, Server, Activity, BarChart3, UserPlus, UserX,
  Crown, Star, Zap, Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Enhanced interfaces for enterprise features
interface Role {
  id: string
  name: string
  description: string
  level: 'admin' | 'manager' | 'user' | 'viewer'
  permissions: Permission[]
  userCount: number
  isCustom: boolean
}

interface Permission {
  id: string
  name: string
  category: 'users' | 'candidates' | 'jobs' | 'interviews' | 'reports' | 'settings' | 'billing'
  description: string
  level: 'read' | 'write' | 'admin'
}

interface OrganizationSettings {
  general: {
    name: string
    domain: string
    industry: string
    size: string
    website: string
    address: string
    contactEmail: string
    phone: string
    timezone: string
    locale: string
  }
  security: {
    mfaRequired: boolean
    ssoEnabled: boolean
    ssoProvider: string
    ssoSettings: any
    passwordPolicy: {
      minLength: number
      requireUppercase: boolean
      requireNumbers: boolean
      requireSymbols: boolean
      maxAge: number
    }
    sessionTimeout: number
    ipWhitelist: string[]
    auditLogging: boolean
  }
  features: {
    aiMatching: boolean
    videoInterviews: boolean
    customBranding: boolean
    apiAccess: boolean
    dataExport: boolean
    advancedReporting: boolean
    webhooks: boolean
    slackIntegration: boolean
  }
  notifications: {
    email: boolean
    inApp: boolean
    slack: boolean
    webhooks: boolean
    slackWebhook: string
    emailTemplates: any[]
  }
  branding: {
    logo: string
    primaryColor: string
    secondaryColor: string
    accentColor: string
    customCss: string
    favicon: string
  }
  integrations: {
    slack: boolean
    gsuite: boolean
    office365: boolean
    ats: boolean
    hris: boolean
    background_check: boolean
  }
}

interface ComplianceSettings {
  gdprCompliant: boolean
  ccpaCompliant: boolean
  dataRetentionDays: number
  dataProcessingAgreement: boolean
  privacyPolicyUrl: string
  termsOfServiceUrl: string
  cookieConsent: boolean
}

export default function ClientOrganizationSettings() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("general")
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Predefined permissions
  const [allPermissions] = useState<Permission[]>([
    { id: 'users_read', name: 'View Users', category: 'users', description: 'View user profiles and list', level: 'read' },
    { id: 'users_write', name: 'Manage Users', category: 'users', description: 'Create, edit, and delete users', level: 'write' },
    { id: 'users_admin', name: 'Admin Users', category: 'users', description: 'Full user administration including permissions', level: 'admin' },
    
    { id: 'candidates_read', name: 'View Candidates', category: 'candidates', description: 'View candidate profiles and applications', level: 'read' },
    { id: 'candidates_write', name: 'Manage Candidates', category: 'candidates', description: 'Create, edit, and manage candidates', level: 'write' },
    { id: 'candidates_admin', name: 'Admin Candidates', category: 'candidates', description: 'Full candidate administration and bulk operations', level: 'admin' },
    
    { id: 'jobs_read', name: 'View Jobs', category: 'jobs', description: 'View job postings and details', level: 'read' },
    { id: 'jobs_write', name: 'Manage Jobs', category: 'jobs', description: 'Create, edit, and publish jobs', level: 'write' },
    { id: 'jobs_admin', name: 'Admin Jobs', category: 'jobs', description: 'Full job administration and approval workflows', level: 'admin' },
    
    { id: 'interviews_read', name: 'View Interviews', category: 'interviews', description: 'View interview schedules and details', level: 'read' },
    { id: 'interviews_write', name: 'Conduct Interviews', category: 'interviews', description: 'Schedule and conduct interviews', level: 'write' },
    { id: 'interviews_admin', name: 'Admin Interviews', category: 'interviews', description: 'Full interview administration and platform settings', level: 'admin' },
    
    { id: 'reports_read', name: 'View Reports', category: 'reports', description: 'Access basic reporting and analytics', level: 'read' },
    { id: 'reports_write', name: 'Create Reports', category: 'reports', description: 'Create and customize reports', level: 'write' },
    { id: 'reports_admin', name: 'Admin Reports', category: 'reports', description: 'Full reporting access and export capabilities', level: 'admin' },
    
    { id: 'settings_read', name: 'View Settings', category: 'settings', description: 'View organization settings', level: 'read' },
    { id: 'settings_write', name: 'Manage Settings', category: 'settings', description: 'Modify organization settings', level: 'write' },
    { id: 'settings_admin', name: 'Admin Settings', category: 'settings', description: 'Full settings administration including security', level: 'admin' },
    
    { id: 'billing_read', name: 'View Billing', category: 'billing', description: 'View billing information and invoices', level: 'read' },
    { id: 'billing_write', name: 'Manage Billing', category: 'billing', description: 'Update payment methods and billing details', level: 'write' },
    { id: 'billing_admin', name: 'Admin Billing', category: 'billing', description: 'Full billing administration and plan management', level: 'admin' }
  ])

  // Role management
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'super_admin',
      name: 'Super Administrator',
      description: 'Full system access with all permissions',
      level: 'admin',
      permissions: allPermissions,
      userCount: 2,
      isCustom: false
    },
    {
      id: 'org_admin',
      name: 'Organization Administrator',
      description: 'Organization-wide administrative access',
      level: 'admin',
      permissions: allPermissions.filter(p => p.category !== 'billing' || p.level !== 'admin'),
      userCount: 3,
      isCustom: false
    },
    {
      id: 'hiring_manager',
      name: 'Hiring Manager',
      description: 'Manage jobs and candidates for their departments',
      level: 'manager',
      permissions: allPermissions.filter(p => 
        ['candidates_read', 'candidates_write', 'jobs_read', 'jobs_write', 'interviews_read', 'interviews_write', 'reports_read'].includes(p.id)
      ),
      userCount: 8,
      isCustom: false
    },
    {
      id: 'recruiter',
      name: 'Recruiter',
      description: 'Full recruitment workflow access',
      level: 'user',
      permissions: allPermissions.filter(p => 
        ['candidates_read', 'candidates_write', 'jobs_read', 'interviews_read', 'interviews_write', 'reports_read'].includes(p.id)
      ),
      userCount: 15,
      isCustom: false
    },
    {
      id: 'interviewer',
      name: 'Interviewer',
      description: 'Conduct interviews and provide feedback',
      level: 'user',
      permissions: allPermissions.filter(p => 
        ['candidates_read', 'interviews_read', 'interviews_write'].includes(p.id)
      ),
      userCount: 25,
      isCustom: false
    },
    {
      id: 'observer',
      name: 'Observer',
      description: 'Read-only access to recruitment data',
      level: 'viewer',
      permissions: allPermissions.filter(p => p.level === 'read'),
      userCount: 5,
      isCustom: false
    }
  ])

  // Organization settings
  const [orgSettings, setOrgSettings] = useState<OrganizationSettings>({
    general: {
      name: "Acme Corporation",
      domain: "acmecorp.com",
      industry: "Technology",
      size: "201-500",
      website: "https://www.acmecorp.com",
      address: "123 Innovation Drive, San Francisco, CA 94105",
      contactEmail: "hr@acmecorp.com",
      phone: "+1 (555) 123-4567",
      timezone: "America/Los_Angeles",
      locale: "en-US"
    },
    security: {
      mfaRequired: true,
      ssoEnabled: true,
      ssoProvider: "google",
      ssoSettings: {},
      passwordPolicy: {
        minLength: 12,
        requireUppercase: true,
        requireNumbers: true,
        requireSymbols: true,
        maxAge: 90
      },
      sessionTimeout: 480, // 8 hours
      ipWhitelist: [],
      auditLogging: true
    },
    features: {
      aiMatching: true,
      videoInterviews: true,
      customBranding: true,
      apiAccess: true,
      dataExport: true,
      advancedReporting: true,
      webhooks: true,
      slackIntegration: true
    },
    notifications: {
      email: true,
      inApp: true,
      slack: true,
      webhooks: true,
      slackWebhook: "https://hooks.slack.com/services/...",
      emailTemplates: []
    },
    branding: {
      logo: "/placeholder.svg?height=64&width=64&text=Acme+Logo",
      primaryColor: "#2563eb",
      secondaryColor: "#6b7280",
      accentColor: "#dc2626",
      customCss: "",
      favicon: "/favicon.ico"
    },
    integrations: {
      slack: true,
      gsuite: true,
      office365: false,
      ats: false,
      hris: false,
      background_check: true
    }
  })

  // Compliance settings
  const [complianceSettings, setComplianceSettings] = useState<ComplianceSettings>({
    gdprCompliant: true,
    ccpaCompliant: true,
    dataRetentionDays: 365,
    dataProcessingAgreement: true,
    privacyPolicyUrl: "https://acmecorp.com/privacy",
    termsOfServiceUrl: "https://acmecorp.com/terms",
    cookieConsent: true
  })

  // Modal states
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isEditingRole, setIsEditingRole] = useState(false)

  // Handle settings changes
  const handleSettingsChange = (section: keyof OrganizationSettings, field: string, value: any) => {
    setOrgSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    setHasUnsavedChanges(true)
  }

  // Handle role permissions
  const handlePermissionToggle = (roleId: string, permissionId: string, enabled: boolean) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const newPermissions = enabled
          ? [...role.permissions, allPermissions.find(p => p.id === permissionId)!]
          : role.permissions.filter(p => p.id !== permissionId)
        return { ...role, permissions: newPermissions }
      }
      return role
    }))
    setHasUnsavedChanges(true)
  }

  // Save settings
  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setHasUnsavedChanges(false)
      toast({
        title: "Settings Saved",
        description: "Organization settings have been updated successfully.",
        variant: "default"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Get permission badge color
  const getPermissionBadgeColor = (level: string) => {
    switch (level) {
      case 'admin': return 'bg-red-100 text-red-700'
      case 'write': return 'bg-blue-100 text-blue-700'
      case 'read': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  // Get role badge color
  const getRoleBadgeColor = (level: string) => {
    switch (level) {
      case 'admin': return 'bg-purple-100 text-purple-700'
      case 'manager': return 'bg-blue-100 text-blue-700'
      case 'user': return 'bg-green-100 text-green-700'
      case 'viewer': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  // Group permissions by category
  const permissionsByCategory = allPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = []
    }
    acc[permission.category].push(permission)
    return acc
  }, {} as Record<string, Permission[]>)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Organization Settings</h1>
          <p className="text-muted-foreground">Configure your organization's settings, security, and permissions</p>
        </div>
        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
              <Clock className="h-3 w-3 mr-1" />
              Unsaved Changes
            </Badge>
          )}
          <Button onClick={handleSaveSettings} disabled={isLoading || !hasUnsavedChanges}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Organization Details
                </CardTitle>
                <CardDescription>Basic information about your organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    value={orgSettings.general.name}
                    onChange={(e) => handleSettingsChange('general', 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    value={orgSettings.general.domain}
                    onChange={(e) => handleSettingsChange('general', 'domain', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Select
                      value={orgSettings.general.industry}
                      onValueChange={(value) => handleSettingsChange('general', 'industry', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Company Size</Label>
                    <Select
                      value={orgSettings.general.size}
                      onValueChange={(value) => handleSettingsChange('general', 'size', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="501-1000">501-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={orgSettings.general.website}
                    onChange={(e) => handleSettingsChange('general', 'website', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Information
                </CardTitle>
                <CardDescription>Contact details and regional settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={orgSettings.general.address}
                    onChange={(e) => handleSettingsChange('general', 'address', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={orgSettings.general.contactEmail}
                    onChange={(e) => handleSettingsChange('general', 'contactEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={orgSettings.general.phone}
                    onChange={(e) => handleSettingsChange('general', 'phone', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select
                      value={orgSettings.general.timezone}
                      onValueChange={(value) => handleSettingsChange('general', 'timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="Europe/London">GMT</SelectItem>
                        <SelectItem value="Europe/Paris">CET</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Locale</Label>
                    <Select
                      value={orgSettings.general.locale}
                      onValueChange={(value) => handleSettingsChange('general', 'locale', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select locale" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="en-GB">English (UK)</SelectItem>
                        <SelectItem value="es-ES">Spanish</SelectItem>
                        <SelectItem value="fr-FR">French</SelectItem>
                        <SelectItem value="de-DE">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Authentication & Access
                </CardTitle>
                <CardDescription>Configure authentication and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Multi-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require MFA for all users</p>
                  </div>
                  <Switch
                    checked={orgSettings.security.mfaRequired}
                    onCheckedChange={(checked) => handleSettingsChange('security', 'mfaRequired', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Single Sign-On (SSO)</Label>
                    <p className="text-sm text-muted-foreground">Enable SSO authentication</p>
                  </div>
                  <Switch
                    checked={orgSettings.security.ssoEnabled}
                    onCheckedChange={(checked) => handleSettingsChange('security', 'ssoEnabled', checked)}
                  />
                </div>

                {orgSettings.security.ssoEnabled && (
                  <div className="space-y-2">
                    <Label>SSO Provider</Label>
                    <Select
                      value={orgSettings.security.ssoProvider}
                      onValueChange={(value) => handleSettingsChange('security', 'ssoProvider', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select SSO provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google">Google Workspace</SelectItem>
                        <SelectItem value="microsoft">Microsoft 365</SelectItem>
                        <SelectItem value="okta">Okta</SelectItem>
                        <SelectItem value="saml">Custom SAML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={orgSettings.security.sessionTimeout}
                    onChange={(e) => handleSettingsChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">Track all user actions</p>
                  </div>
                  <Switch
                    checked={orgSettings.security.auditLogging}
                    onCheckedChange={(checked) => handleSettingsChange('security', 'auditLogging', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Password Policy
                </CardTitle>
                <CardDescription>Define password requirements for users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Minimum Length</Label>
                  <Input
                    type="number"
                    value={orgSettings.security.passwordPolicy.minLength}
                    onChange={(e) => handleSettingsChange('security', 'passwordPolicy', {
                      ...orgSettings.security.passwordPolicy,
                      minLength: parseInt(e.target.value)
                    })}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Require Uppercase Letters</Label>
                    <Switch
                      checked={orgSettings.security.passwordPolicy.requireUppercase}
                      onCheckedChange={(checked) => handleSettingsChange('security', 'passwordPolicy', {
                        ...orgSettings.security.passwordPolicy,
                        requireUppercase: checked
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Require Numbers</Label>
                    <Switch
                      checked={orgSettings.security.passwordPolicy.requireNumbers}
                      onCheckedChange={(checked) => handleSettingsChange('security', 'passwordPolicy', {
                        ...orgSettings.security.passwordPolicy,
                        requireNumbers: checked
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Require Special Characters</Label>
                    <Switch
                      checked={orgSettings.security.passwordPolicy.requireSymbols}
                      onCheckedChange={(checked) => handleSettingsChange('security', 'passwordPolicy', {
                        ...orgSettings.security.passwordPolicy,
                        requireSymbols: checked
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Password Expiry (days)</Label>
                  <Input
                    type="number"
                    value={orgSettings.security.passwordPolicy.maxAge}
                    onChange={(e) => handleSettingsChange('security', 'passwordPolicy', {
                      ...orgSettings.security.passwordPolicy,
                      maxAge: parseInt(e.target.value)
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Role-Based Permissions */}
        <TabsContent value="permissions" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Role Management</h3>
                <p className="text-sm text-muted-foreground">Configure roles and permissions for your organization</p>
              </div>
              <Button onClick={() => setIsRoleModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Custom Role
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {roles.map((role) => (
                <Card key={role.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={getRoleBadgeColor(role.level)}>
                          {role.level.charAt(0).toUpperCase() + role.level.slice(1)}
                        </Badge>
                        {!role.isCustom && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            <Crown className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedRole(role)
                          setIsEditingRole(true)
                          setIsRoleModalOpen(true)
                        }}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                    <CardTitle className="text-base">{role.name}</CardTitle>
                    <CardDescription className="text-sm">{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Users with this role:</span>
                        <span className="font-medium">{role.userCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Permissions:</span>
                        <span className="font-medium">{role.permissions.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {Object.keys(permissionsByCategory).map((category) => {
                          const categoryPermissions = role.permissions.filter(p => p.category === category)
                          if (categoryPermissions.length === 0) return null
                          
                          return (
                            <Badge
                              key={category}
                              variant="outline"
                              className="text-xs"
                            >
                              {category} ({categoryPermissions.length})
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Platform Features
                </CardTitle>
                <CardDescription>Enable or disable advanced features for your organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>AI-Powered Candidate Matching</Label>
                    <p className="text-sm text-muted-foreground">Intelligent candidate recommendations</p>
                  </div>
                  <Switch
                    checked={orgSettings.features.aiMatching}
                    onCheckedChange={(checked) => handleSettingsChange('features', 'aiMatching', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Video Interview Platform</Label>
                    <p className="text-sm text-muted-foreground">Built-in video conferencing</p>
                  </div>
                  <Switch
                    checked={orgSettings.features.videoInterviews}
                    onCheckedChange={(checked) => handleSettingsChange('features', 'videoInterviews', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>API Access</Label>
                    <p className="text-sm text-muted-foreground">REST API for integrations</p>
                  </div>
                  <Switch
                    checked={orgSettings.features.apiAccess}
                    onCheckedChange={(checked) => handleSettingsChange('features', 'apiAccess', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Advanced Reporting</Label>
                    <p className="text-sm text-muted-foreground">Custom reports and analytics</p>
                  </div>
                  <Switch
                    checked={orgSettings.features.advancedReporting}
                    onCheckedChange={(checked) => handleSettingsChange('features', 'advancedReporting', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Webhooks</Label>
                    <p className="text-sm text-muted-foreground">Real-time event notifications</p>
                  </div>
                  <Switch
                    checked={orgSettings.features.webhooks}
                    onCheckedChange={(checked) => handleSettingsChange('features', 'webhooks', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Integrations
                </CardTitle>
                <CardDescription>Connect with external services and platforms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Slack Integration</Label>
                    <p className="text-sm text-muted-foreground">Notifications and updates</p>
                  </div>
                  <Switch
                    checked={orgSettings.integrations.slack}
                    onCheckedChange={(checked) => handleSettingsChange('integrations', 'slack', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Google Workspace</Label>
                    <p className="text-sm text-muted-foreground">Calendar and email integration</p>
                  </div>
                  <Switch
                    checked={orgSettings.integrations.gsuite}
                    onCheckedChange={(checked) => handleSettingsChange('integrations', 'gsuite', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Microsoft 365</Label>
                    <p className="text-sm text-muted-foreground">Office suite integration</p>
                  </div>
                  <Switch
                    checked={orgSettings.integrations.office365}
                    onCheckedChange={(checked) => handleSettingsChange('integrations', 'office365', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Background Check Services</Label>
                    <p className="text-sm text-muted-foreground">Automated screening</p>
                  </div>
                  <Switch
                    checked={orgSettings.integrations.background_check}
                    onCheckedChange={(checked) => handleSettingsChange('integrations', 'background_check', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Custom Branding
              </CardTitle>
              <CardDescription>Customize the look and feel of your recruitment platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Company Logo</Label>
                    <div className="flex items-center space-x-4">
                      <img
                        src={orgSettings.branding.logo}
                        alt="Company Logo"
                        className="w-16 h-16 rounded border"
                      />
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={orgSettings.branding.primaryColor}
                        onChange={(e) => handleSettingsChange('branding', 'primaryColor', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={orgSettings.branding.primaryColor}
                        onChange={(e) => handleSettingsChange('branding', 'primaryColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={orgSettings.branding.secondaryColor}
                        onChange={(e) => handleSettingsChange('branding', 'secondaryColor', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={orgSettings.branding.secondaryColor}
                        onChange={(e) => handleSettingsChange('branding', 'secondaryColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accent-color">Accent Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="accent-color"
                        type="color"
                        value={orgSettings.branding.accentColor}
                        onChange={(e) => handleSettingsChange('branding', 'accentColor', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={orgSettings.branding.accentColor}
                        onChange={(e) => handleSettingsChange('branding', 'accentColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Brand Preview</Label>
                    <Card className="p-4" style={{ backgroundColor: `${orgSettings.branding.primaryColor}10` }}>
                      <div className="flex items-center space-x-3 mb-4">
                        <div 
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: orgSettings.branding.primaryColor }}
                        ></div>
                        <div>
                          <h4 className="font-semibold" style={{ color: orgSettings.branding.primaryColor }}>
                            {orgSettings.general.name}
                          </h4>
                          <p className="text-sm" style={{ color: orgSettings.branding.secondaryColor }}>
                            Recruitment Platform
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        style={{ 
                          backgroundColor: orgSettings.branding.accentColor,
                          borderColor: orgSettings.branding.accentColor
                        }}
                      >
                        Sample Button
                      </Button>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-css">Custom CSS</Label>
                    <Textarea
                      id="custom-css"
                      placeholder="/* Add your custom CSS here */"
                      value={orgSettings.branding.customCss}
                      onChange={(e) => handleSettingsChange('branding', 'customCss', e.target.value)}
                      rows={6}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Data Protection
                </CardTitle>
                <CardDescription>Configure data protection and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>GDPR Compliance</Label>
                    <p className="text-sm text-muted-foreground">European data protection compliance</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={complianceSettings.gdprCompliant}
                      onCheckedChange={(checked) => setComplianceSettings(prev => ({ ...prev, gdprCompliant: checked }))}
                    />
                    {complianceSettings.gdprCompliant && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>CCPA Compliance</Label>
                    <p className="text-sm text-muted-foreground">California privacy rights compliance</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={complianceSettings.ccpaCompliant}
                      onCheckedChange={(checked) => setComplianceSettings(prev => ({ ...prev, ccpaCompliant: checked }))}
                    />
                    {complianceSettings.ccpaCompliant && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Data Retention Period (days)</Label>
                  <Input
                    type="number"
                    value={complianceSettings.dataRetentionDays}
                    onChange={(e) => setComplianceSettings(prev => ({ 
                      ...prev, 
                      dataRetentionDays: parseInt(e.target.value) 
                    }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    How long to retain candidate data after job closure
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cookie Consent</Label>
                    <p className="text-sm text-muted-foreground">Show cookie consent banner</p>
                  </div>
                  <Switch
                    checked={complianceSettings.cookieConsent}
                    onCheckedChange={(checked) => setComplianceSettings(prev => ({ ...prev, cookieConsent: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Legal Documents
                </CardTitle>
                <CardDescription>Manage privacy policies and terms of service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Privacy Policy URL</Label>
                  <Input
                    value={complianceSettings.privacyPolicyUrl}
                    onChange={(e) => setComplianceSettings(prev => ({ 
                      ...prev, 
                      privacyPolicyUrl: e.target.value 
                    }))}
                    placeholder="https://yourcompany.com/privacy"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Terms of Service URL</Label>
                  <Input
                    value={complianceSettings.termsOfServiceUrl}
                    onChange={(e) => setComplianceSettings(prev => ({ 
                      ...prev, 
                      termsOfServiceUrl: e.target.value 
                    }))}
                    placeholder="https://yourcompany.com/terms"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Data Processing Agreement</Label>
                    <p className="text-sm text-muted-foreground">DPA signed and in place</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={complianceSettings.dataProcessingAgreement}
                      onCheckedChange={(checked) => setComplianceSettings(prev => ({ 
                        ...prev, 
                        dataProcessingAgreement: checked 
                      }))}
                    />
                    {complianceSettings.dataProcessingAgreement && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900">Compliance Status</h4>
                      <p className="text-sm text-blue-700">
                        Your organization meets {
                          [complianceSettings.gdprCompliant, complianceSettings.ccpaCompliant, 
                           complianceSettings.dataProcessingAgreement].filter(Boolean).length
                        } of 3 major compliance requirements.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Role Modal */}
      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditingRole ? `Edit Role: ${selectedRole?.name}` : 'Create Custom Role'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedRole && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Role Name</Label>
                  <Input value={selectedRole.name} readOnly={!selectedRole.isCustom} />
                </div>
                <div className="space-y-2">
                  <Label>Role Level</Label>
                  <Select value={selectedRole.level} disabled={!selectedRole.isCustom}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Permissions</h4>
                <div className="space-y-6">
                  {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                    <div key={category} className="space-y-3">
                      <h5 className="font-medium capitalize text-sm">
                        {category.replace('_', ' ')} Permissions
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-3 p-3 border rounded">
                            <Checkbox
                              checked={selectedRole.permissions.some(p => p.id === permission.id)}
                              onCheckedChange={(checked) => 
                                handlePermissionToggle(selectedRole.id, permission.id, !!checked)
                              }
                              disabled={!selectedRole.isCustom}
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">{permission.name}</span>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getPermissionBadgeColor(permission.level)}`}
                                >
                                  {permission.level}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}