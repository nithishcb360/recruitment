"use client"

import { Checkbox } from "@/components/ui/checkbox"

import { Badge } from "@/components/ui/badge"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link, Settings, RefreshCw, Mail, Calendar, Cloud, Bot, Database, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function IntegrationsPanel() {
  const { toast } = useToast()
  const [integrations, setIntegrations] = useState([
    {
      id: "linkedin",
      name: "LinkedIn Recruiter",
      description: "Sync job postings and import candidates from LinkedIn.",
      status: "connected",
      config: { apiKey: "**********", autoSync: true },
      icon: <Link className="h-5 w-5 text-blue-600" />,
    },
    {
      id: "indeed",
      name: "Indeed Employer",
      description: "Post jobs directly and manage applications.",
      status: "disconnected",
      config: { apiKey: "" },
      icon: <Link className="h-5 w-5 text-green-600" />,
    },
    {
      id: "google-calendar",
      name: "Google Calendar",
      description: "Schedule interviews and send invites directly to candidate calendars.",
      status: "connected",
      config: { account: "admin@example.com" },
      icon: <Calendar className="h-5 w-5 text-red-600" />,
    },
    {
      id: "outlook-calendar",
      name: "Outlook Calendar",
      description: "Integrate with Microsoft Outlook for scheduling.",
      status: "disconnected",
      config: { account: "" },
      icon: <Calendar className="h-5 w-5 text-blue-600" />,
    },
    {
      id: "email-service",
      name: "Email Automation (SendGrid)",
      description: "Automate candidate communications and notifications.",
      status: "connected",
      config: { provider: "SendGrid", apiKey: "**********" },
      icon: <Mail className="h-5 w-5 text-purple-600" />,
    },
    {
      id: "ai-resume-parser",
      name: "AI Resume Parser",
      description: "Automatically extract data from resumes using AI.",
      status: "connected",
      config: { model: "v0-parser-v2" },
      icon: <Bot className="h-5 w-5 text-gray-600" />,
    },
    {
      id: "cloud-storage",
      name: "Cloud Storage (Vercel Blob)",
      description: "Securely store resumes, interview recordings, and documents.",
      status: "connected",
      config: { bucket: "recruitment-assets" },
      icon: <Cloud className="h-5 w-5 text-blue-400" />,
    },
    {
      id: "supabase",
      name: "Supabase Database",
      description: "Backend database for all application data.",
      status: "connected",
      config: { projectRef: "xyz123abc" },
      icon: <Database className="h-5 w-5 text-green-500" />,
    },
  ])

  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [testingConnection, setTestingConnection] = useState<Record<string, boolean>>({})

  const handleConnectToggle = async (id: string) => {
    const integration = integrations.find(i => i.id === id)
    if (!integration) return

    try {
      setLoadingStates(prev => ({ ...prev, [id]: true }))
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newStatus = integration.status === "connected" ? "disconnected" : "connected"
      
      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === id
            ? {
                ...integration,
                status: newStatus,
                config:
                  integration.id === "linkedin"
                    ? { ...integration.config, apiKey: newStatus === "connected" ? "**********" : "" }
                    : integration.id === "google-calendar"
                      ? { ...integration.config, account: newStatus === "connected" ? "admin@example.com" : "" }
                      : integration.config,
              }
            : integration,
        ),
      )
      
      toast({
        title: newStatus === "connected" ? "Integration Connected" : "Integration Disconnected",
        description: `${integration.name} has been ${newStatus} successfully.`,
        variant: "default"
      })
      
    } catch (error: any) {
      console.error('Error toggling integration:', error)
      toast({
        title: "Connection Failed",
        description: error.message || `Failed to ${integration.status === "connected" ? "disconnect" : "connect"} ${integration.name}.`,
        variant: "destructive"
      })
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }))
    }
  }

  const handleConfigChange = (id: string, key: string, value: string | boolean) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id ? { ...integration, config: { ...integration.config, [key]: value } } : integration,
      ),
    )
  }

  const handleSaveConfig = async (id: string) => {
    const integration = integrations.find((i) => i.id === id)
    if (!integration) return

    try {
      setLoadingStates(prev => ({ ...prev, [`save-${id}`]: true }))
      
      // Validate configuration based on integration type
      if (integration.id === 'linkedin' && !integration.config.apiKey) {
        throw new Error('API Key is required for LinkedIn integration')
      }
      if (integration.id === 'indeed' && !integration.config.apiKey) {
        throw new Error('API Key is required for Indeed integration')
      }
      if ((integration.id === 'google-calendar' || integration.id === 'outlook-calendar') && !integration.config.account) {
        throw new Error('Account email is required for calendar integration')
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Configuration Saved",
        description: `Settings for ${integration.name} have been saved successfully.`,
        variant: "default"
      })
      
    } catch (error: any) {
      console.error('Error saving configuration:', error)
      toast({
        title: "Save Failed",
        description: error.message || `Failed to save configuration for ${integration.name}.`,
        variant: "destructive"
      })
    } finally {
      setLoadingStates(prev => ({ ...prev, [`save-${id}`]: false }))
    }
  }
  
  const handleTestConnection = async (id: string) => {
    const integration = integrations.find((i) => i.id === id)
    if (!integration) return

    try {
      setTestingConnection(prev => ({ ...prev, [id]: true }))
      
      // Simulate API connection test
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Randomly succeed or fail for demo purposes
      const success = Math.random() > 0.3
      
      if (success) {
        toast({
          title: "Connection Test Successful",
          description: `Successfully connected to ${integration.name}.`,
          variant: "default"
        })
      } else {
        throw new Error('Connection test failed - please check your credentials')
      }
      
    } catch (error: any) {
      console.error('Error testing connection:', error)
      toast({
        title: "Connection Test Failed",
        description: error.message || `Failed to connect to ${integration.name}.`,
        variant: "destructive"
      })
    } finally {
      setTestingConnection(prev => ({ ...prev, [id]: false }))
    }
  }

  const connectedCount = integrations.filter(i => i.status === 'connected').length
  const totalCount = integrations.length

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">Connect with third-party services to enhance your recruitment workflow.</p>
      </div>
      
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Integration Status</h3>
              <p className="text-sm text-blue-700">
                {connectedCount} of {totalCount} integrations active
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{connectedCount}</div>
                <div className="text-xs text-muted-foreground">Connected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{totalCount - connectedCount}</div>
                <div className="text-xs text-muted-foreground">Disconnected</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                {integration.icon}
                <CardTitle className="text-lg font-semibold">{integration.name}</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                {loadingStates[integration.id] ? (
                  <Badge variant="outline" className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 border-blue-200">
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Connecting...
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className={`px-2 py-0.5 text-xs font-medium flex items-center ${
                      integration.status === "connected"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-red-100 text-red-700 border-red-200"
                    }`}
                  >
                    {integration.status === "connected" ? (
                      <>
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Connected
                      </>
                    ) : (
                      <>
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Disconnected
                      </>
                    )}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-sm text-muted-foreground">{integration.description}</CardDescription>
              
              {/* Connection Health Indicator */}
              {integration.status === "connected" && (
                <div className="flex items-center space-x-2 text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live connection</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <Label htmlFor={`toggle-${integration.id}`} className="flex items-center space-x-2">
                  <span>{integration.status === "connected" ? "Disable" : "Enable"}</span>
                  {loadingStates[integration.id] && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </Label>
                <Switch
                  id={`toggle-${integration.id}`}
                  checked={integration.status === "connected"}
                  onCheckedChange={() => handleConnectToggle(integration.id)}
                  disabled={loadingStates[integration.id]}
                />
              </div>

              {integration.status === "connected" && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-semibold flex items-center">
                    <Settings className="h-4 w-4 mr-1.5" /> Configuration
                  </h3>
                  {integration.id === "linkedin" && (
                    <div className="space-y-2">
                      <Label htmlFor="linkedin-api-key">API Key</Label>
                      <Input
                        id="linkedin-api-key"
                        type="password"
                        value={integration.config.apiKey as string}
                        onChange={(e) => handleConfigChange(integration.id, "apiKey", e.target.value)}
                        placeholder="Enter LinkedIn API Key"
                      />
                      <div className="flex items-center space-x-2 mt-2">
                        <Checkbox
                          id="linkedin-auto-sync"
                          checked={integration.config.autoSync as boolean}
                          onCheckedChange={(checked) =>
                            handleConfigChange(integration.id, "autoSync", Boolean(checked))
                          }
                        />
                        <Label htmlFor="linkedin-auto-sync">Enable Auto-Sync</Label>
                      </div>
                    </div>
                  )}
                  {integration.id === "indeed" && (
                    <div className="space-y-2">
                      <Label htmlFor="indeed-api-key">API Key</Label>
                      <Input
                        id="indeed-api-key"
                        type="password"
                        value={integration.config.apiKey as string}
                        onChange={(e) => handleConfigChange(integration.id, "apiKey", e.target.value)}
                        placeholder="Enter Indeed API Key"
                      />
                    </div>
                  )}
                  {(integration.id === "google-calendar" || integration.id === "outlook-calendar") && (
                    <div className="space-y-2">
                      <Label htmlFor={`${integration.id}-account`}>Connected Account</Label>
                      <Input
                        id={`${integration.id}-account`}
                        value={integration.config.account as string}
                        onChange={(e) => handleConfigChange(integration.id, "account", e.target.value)}
                        placeholder="e.g., your-email@example.com"
                        disabled={integration.id === "google-calendar"} // Simulate read-only for connected
                      />
                      {integration.id === "google-calendar" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2 bg-transparent"
                          onClick={() => handleTestConnection(integration.id)}
                          disabled={testingConnection[integration.id]}
                        >
                          {testingConnection[integration.id] ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Re-authenticating...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2" /> 
                              Re-authenticate
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                  {integration.id === "email-service" && (
                    <div className="space-y-2">
                      <Label htmlFor="email-provider">Provider</Label>
                      <Select
                        value={integration.config.provider as string}
                        onValueChange={(val) => handleConfigChange(integration.id, "provider", val)}
                      >
                        <SelectTrigger id="email-provider">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SendGrid">SendGrid</SelectItem>
                          <SelectItem value="Mailgun">Mailgun</SelectItem>
                          <SelectItem value="Resend">Resend</SelectItem>
                        </SelectContent>
                      </Select>
                      <Label htmlFor="email-api-key">API Key</Label>
                      <Input
                        id="email-api-key"
                        type="password"
                        value={integration.config.apiKey as string}
                        onChange={(e) => handleConfigChange(integration.id, "apiKey", e.target.value)}
                        placeholder="Enter API Key"
                      />
                    </div>
                  )}
                  {integration.id === "ai-resume-parser" && (
                    <div className="space-y-2">
                      <Label htmlFor="ai-parser-model">AI Model</Label>
                      <Select
                        value={integration.config.model as string}
                        onValueChange={(val) => handleConfigChange(integration.id, "model", val)}
                      >
                        <SelectTrigger id="ai-parser-model">
                          <SelectValue placeholder="Select AI Model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="v0-parser-v1">v0 Parser v1 (Basic)</SelectItem>
                          <SelectItem value="v0-parser-v2">v0 Parser v2 (Advanced)</SelectItem>
                          <SelectItem value="custom-ml-model">Custom ML Model</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {integration.id === "cloud-storage" && (
                    <div className="space-y-2">
                      <Label htmlFor="storage-bucket">Bucket Name</Label>
                      <Input
                        id="storage-bucket"
                        value={integration.config.bucket as string}
                        onChange={(e) => handleConfigChange(integration.id, "bucket", e.target.value)}
                        placeholder="e.g., recruitment-assets"
                      />
                    </div>
                  )}
                  {integration.id === "supabase" && (
                    <div className="space-y-2">
                      <Label htmlFor="supabase-project-ref">Project Reference</Label>
                      <Input
                        id="supabase-project-ref"
                        value={integration.config.projectRef as string}
                        onChange={(e) => handleConfigChange(integration.id, "projectRef", e.target.value)}
                        placeholder="e.g., xyz123abc"
                      />
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleTestConnection(integration.id)} 
                      variant="outline" 
                      className="flex-1"
                      disabled={testingConnection[integration.id] || loadingStates[`save-${integration.id}`]}
                    >
                      {testingConnection[integration.id] ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Test
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={() => handleSaveConfig(integration.id)} 
                      className="flex-1"
                      disabled={loadingStates[`save-${integration.id}`] || testingConnection[integration.id]}
                    >
                      {loadingStates[`save-${integration.id}`] ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Settings className="mr-2 h-4 w-4" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
