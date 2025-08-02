"use client"

import { Checkbox } from "@/components/ui/checkbox"

import { Badge } from "@/components/ui/badge"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link, Settings, RefreshCw, Mail, Calendar, Cloud, Bot, Database } from "lucide-react"
import { useState } from "react"

export default function IntegrationsPanel() {
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

  const handleConnectToggle = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? {
              ...integration,
              status: integration.status === "connected" ? "disconnected" : "connected",
              config:
                integration.id === "linkedin"
                  ? { ...integration.config, apiKey: integration.status === "connected" ? "" : "**********" }
                  : integration.id === "google-calendar"
                    ? { ...integration.config, account: integration.status === "connected" ? "" : "admin@example.com" }
                    : integration.config,
            }
          : integration,
      ),
    )
  }

  const handleConfigChange = (id: string, key: string, value: string | boolean) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id ? { ...integration, config: { ...integration.config, [key]: value } } : integration,
      ),
    )
  }

  const handleSaveConfig = (id: string) => {
    console.log("Saving configuration for", id, integrations.find((i) => i.id === id)?.config)
    alert(`Configuration for ${integrations.find((i) => i.id === id)?.name} saved!`)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">Connect with third-party services to enhance your recruitment workflow.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                {integration.icon}
                <CardTitle className="text-lg font-semibold">{integration.name}</CardTitle>
              </div>
              <Badge
                variant="outline"
                className={`px-2 py-0.5 text-xs font-medium ${
                  integration.status === "connected"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-red-100 text-red-700 border-red-200"
                }`}
              >
                {integration.status === "connected" ? "Connected" : "Disconnected"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-sm text-muted-foreground">{integration.description}</CardDescription>
              <div className="flex items-center justify-between">
                <Label htmlFor={`toggle-${integration.id}`}>
                  {integration.status === "connected" ? "Disable" : "Enable"}
                </Label>
                <Switch
                  id={`toggle-${integration.id}`}
                  checked={integration.status === "connected"}
                  onCheckedChange={() => handleConnectToggle(integration.id)}
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
                        <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                          <RefreshCw className="h-4 w-4 mr-2" /> Re-authenticate
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
                  <Button onClick={() => handleSaveConfig(integration.id)} className="w-full">
                    Save Configuration
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
