"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users, Bell, Shield, Palette, FileText, Plus, Trash, Save } from "lucide-react"

export default function ClientOrganizationSettings() {
  const [activeTab, setActiveTab] = useState("general")
  const [generalSettings, setGeneralSettings] = useState({
    orgName: "Acme Corp",
    industry: "Software",
    website: "https://www.acmecorp.com",
    address: "123 Tech Lane, Innovation City, CA 90210",
    contactEmail: "hr@acmecorp.com",
    phone: "+1 (555) 123-4567",
  })
  const [userManagementSettings, setUserManagementSettings] = useState({
    defaultRole: "Recruiter",
    enableSSO: false,
    ssoProvider: "",
  })
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    inAppNotifications: true,
    slackIntegration: false,
    slackWebhookUrl: "",
  })
  const [securitySettings, setSecuritySettings] = useState({
    mfaRequired: true,
    passwordPolicy: "strong",
    sessionTimeout: "60", // minutes
  })
  const [brandingSettings, setBrandingSettings] = useState({
    logoUrl: "/placeholder.svg?height=64&width=64&text=Acme+Logo",
    primaryColor: "#2563eb", // blue-600
    secondaryColor: "#6b7280", // gray-500
  })
  const [customFields, setCustomFields] = useState([
    { id: 1, name: "Candidate Source Detail", type: "text", appliesTo: "Candidate" },
    { id: 2, name: "Hiring Manager Approval", type: "boolean", appliesTo: "Job" },
  ])

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [id]: value }))
  }

  const handleUserManagementChange = (id: string, value: string | boolean) => {
    setUserManagementSettings((prev) => ({ ...prev, [id]: value }))
  }

  const handleNotificationChange = (id: string, value: string | boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [id]: value }))
  }

  const handleSecurityChange = (id: string, value: string | boolean) => {
    setSecuritySettings((prev) => ({ ...prev, [id]: value }))
  }

  const handleBrandingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setBrandingSettings((prev) => ({ ...prev, [id]: value }))
  }

  const addCustomField = () => {
    setCustomFields((prev) => [
      ...prev,
      { id: prev.length ? Math.max(...prev.map((f) => f.id)) + 1 : 1, name: "", type: "text", appliesTo: "Candidate" },
    ])
  }

  const handleCustomFieldChange = (id: number, field: string, value: string) => {
    setCustomFields((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)))
  }

  const removeCustomField = (id: number) => {
    setCustomFields((prev) => prev.filter((f) => f.id !== id))
  }

  const handleSaveSettings = (settingsType: string) => {
    console.log(`Saving ${settingsType} settings:`, {
      generalSettings,
      userManagementSettings,
      notificationSettings,
      securitySettings,
      brandingSettings,
      customFields,
    })
    alert(`${settingsType} settings saved successfully! (Simulated)`)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Organization Settings</h1>
        <p className="text-muted-foreground">Manage your organization's profile, users, and platform configurations.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="general">
            <Building2 className="h-4 w-4 mr-2" /> General
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" /> Users
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" /> Security
          </TabsTrigger>
          <TabsTrigger value="branding">
            <Palette className="h-4 w-4 mr-2" /> Branding
          </TabsTrigger>
          <TabsTrigger value="custom-fields">
            <FileText className="h-4 w-4 mr-2" /> Custom Fields
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Update your organization's basic details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input id="orgName" value={generalSettings.orgName} onChange={handleGeneralChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" value={generalSettings.industry} onChange={handleGeneralChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" value={generalSettings.website} onChange={handleGeneralChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" value={generalSettings.address} onChange={handleGeneralChange} rows={3} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={generalSettings.phone} onChange={handleGeneralChange} />
                </div>
              </div>
              <Button onClick={() => handleSaveSettings("General")}>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Configure default roles and authentication settings for your team.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultRole">Default User Role</Label>
                <Select
                  value={userManagementSettings.defaultRole}
                  onValueChange={(val) => handleUserManagementChange("defaultRole", val)}
                >
                  <SelectTrigger id="defaultRole">
                    <SelectValue placeholder="Select default role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Recruiter">Recruiter</SelectItem>
                    <SelectItem value="Hiring Manager">Hiring Manager</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">This role will be assigned to new users by default.</p>
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="enableSSO">Enable Single Sign-On (SSO)</Label>
                <Switch
                  id="enableSSO"
                  checked={userManagementSettings.enableSSO}
                  onCheckedChange={(checked) => handleUserManagementChange("enableSSO", Boolean(checked))}
                />
              </div>
              {userManagementSettings.enableSSO && (
                <div className="space-y-2">
                  <Label htmlFor="ssoProvider">SSO Provider</Label>
                  <Select
                    value={userManagementSettings.ssoProvider}
                    onValueChange={(val) => handleUserManagementChange("ssoProvider", val)}
                  >
                    <SelectTrigger id="ssoProvider">
                      <SelectValue placeholder="Select SSO provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Workspace</SelectItem>
                      <SelectItem value="okta">Okta</SelectItem>
                      <SelectItem value="azure">Azure AD</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Contact support to configure your SSO integration.</p>
                </div>
              )}
              <Button onClick={() => handleSaveSettings("User Management")}>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how your team receives alerts and updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <Switch
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("emailNotifications", Boolean(checked))}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="inAppNotifications">In-App Notifications</Label>
                <Switch
                  id="inAppNotifications"
                  checked={notificationSettings.inAppNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("inAppNotifications", Boolean(checked))}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="slackIntegration">Enable Slack Integration</Label>
                <Switch
                  id="slackIntegration"
                  checked={notificationSettings.slackIntegration}
                  onCheckedChange={(checked) => handleNotificationChange("slackIntegration", Boolean(checked))}
                />
              </div>
              {notificationSettings.slackIntegration && (
                <div className="space-y-2">
                  <Label htmlFor="slackWebhookUrl">Slack Webhook URL</Label>
                  <Input
                    id="slackWebhookUrl"
                    type="url"
                    value={notificationSettings.slackWebhookUrl}
                    onChange={(e) => handleNotificationChange("slackWebhookUrl", e.target.value)}
                    placeholder="https://hooks.slack.com/services/..."
                  />
                  <p className="text-sm text-muted-foreground">Notifications will be sent to this Slack channel.</p>
                </div>
              )}
              <Button onClick={() => handleSaveSettings("Notification")}>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security policies for your organization.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="mfaRequired">Require Multi-Factor Authentication (MFA)</Label>
                <Switch
                  id="mfaRequired"
                  checked={securitySettings.mfaRequired}
                  onCheckedChange={(checked) => handleSecurityChange("mfaRequired", Boolean(checked))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordPolicy">Password Policy</Label>
                <Select
                  value={securitySettings.passwordPolicy}
                  onValueChange={(val) => handleSecurityChange("passwordPolicy", val)}
                >
                  <SelectTrigger id="passwordPolicy">
                    <SelectValue placeholder="Select policy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weak">Weak (Min 6 chars)</SelectItem>
                    <SelectItem value="medium">Medium (Min 8 chars, mixed case, number)</SelectItem>
                    <SelectItem value="strong">Strong (Min 12 chars, mixed case, number, symbol)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Select
                  value={securitySettings.sessionTimeout}
                  onValueChange={(val) => handleSecurityChange("sessionTimeout", val)}
                >
                  <SelectTrigger id="sessionTimeout">
                    <SelectValue placeholder="Select timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                    <SelectItem value="240">240 minutes</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Users will be automatically logged out after this period of inactivity.
                </p>
              </div>
              <Button onClick={() => handleSaveSettings("Security")}>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Branding & Customization</CardTitle>
              <CardDescription>Customize the platform's appearance to match your brand.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Company Logo URL</Label>
                <Input id="logoUrl" type="url" value={brandingSettings.logoUrl} onChange={handleBrandingChange} />
                <div className="mt-2">
                  <img
                    src={brandingSettings.logoUrl || "/placeholder.svg"}
                    alt="Company Logo Preview"
                    className="h-16 w-auto object-contain"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <Input
                    id="primaryColor"
                    type="color"
                    value={brandingSettings.primaryColor}
                    onChange={handleBrandingChange}
                  />
                  <div className="h-8 w-full rounded" style={{ backgroundColor: brandingSettings.primaryColor }}></div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={brandingSettings.secondaryColor}
                    onChange={handleBrandingChange}
                  />
                  <div
                    className="h-8 w-full rounded"
                    style={{ backgroundColor: brandingSettings.secondaryColor }}
                  ></div>
                </div>
              </div>
              <Button onClick={() => handleSaveSettings("Branding")}>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom-fields" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Fields</CardTitle>
              <CardDescription>Define custom fields to capture additional data for candidates or jobs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {customFields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-2 p-3 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`field-name-${field.id}`}>Field Name</Label>
                      <Input
                        id={`field-name-${field.id}`}
                        value={field.name}
                        onChange={(e) => handleCustomFieldChange(field.id, "name", e.target.value)}
                        placeholder="e.g., Preferred Start Date"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`field-type-${field.id}`}>Type</Label>
                      <Select
                        value={field.type}
                        onValueChange={(val) => handleCustomFieldChange(field.id, "type", val)}
                      >
                        <SelectTrigger id={`field-type-${field.id}`} className="w-[120px]">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="select">Select</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`field-appliesTo-${field.id}`}>Applies To</Label>
                      <Select
                        value={field.appliesTo}
                        onValueChange={(val) => handleCustomFieldChange(field.id, "appliesTo", val)}
                      >
                        <SelectTrigger id={`field-appliesTo-${field.id}`} className="w-[120px]">
                          <SelectValue placeholder="Applies To" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Candidate">Candidate</SelectItem>
                          <SelectItem value="Job">Job</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeCustomField(field.id)}>
                      <Trash className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" onClick={addCustomField} className="w-full bg-transparent">
                <Plus className="mr-2 h-4 w-4" /> Add Custom Field
              </Button>
              <Button onClick={() => handleSaveSettings("Custom Fields")}>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
