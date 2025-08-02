"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash, CheckCircle, XCircle, Building2, DollarSign } from "lucide-react"

interface PlatformUser {
  id: string
  name: string
  email: string
  role: string
  organization: string
  status: "active" | "inactive"
}

interface Organization {
  id: string
  name: string
  plan: string
  users: number
  activeJobs: number
  status: "active" | "suspended"
}

export default function SaaSPlatformAdmin() {
  const [activeTab, setActiveTab] = useState("users")
  const [users, setUsers] = useState<PlatformUser[]>([
    {
      id: "u1",
      name: "John Doe",
      email: "john.doe@org1.com",
      role: "Recruiter",
      organization: "Acme Corp",
      status: "active",
    },
    {
      id: "u2",
      name: "Jane Smith",
      email: "jane.smith@org2.com",
      role: "Hiring Manager",
      organization: "Globex Inc",
      status: "active",
    },
    {
      id: "u3",
      name: "Peter Jones",
      email: "peter.jones@org1.com",
      role: "Admin",
      organization: "Acme Corp",
      status: "inactive",
    },
    {
      id: "u4",
      name: "Alice Brown",
      email: "alice.brown@org3.com",
      role: "Recruiter",
      organization: "Innovate LLC",
      status: "active",
    },
  ])
  const [organizations, setOrganizations] = useState<Organization[]>([
    { id: "o1", name: "Acme Corp", plan: "Enterprise", users: 35, activeJobs: 12, status: "active" },
    { id: "o2", name: "Globex Inc", plan: "Pro", users: 15, activeJobs: 5, status: "active" },
    { id: "o3", name: "Innovate LLC", plan: "Basic", users: 5, activeJobs: 2, status: "active" },
    { id: "o4", name: "Future Solutions", plan: "Pro", users: 0, activeJobs: 0, status: "suspended" },
  ])

  // State for adding/editing
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<PlatformUser | null>(null)
  const [newUser, setNewUser] = useState<Omit<PlatformUser, "id" | "status">>({
    name: "",
    email: "",
    role: "",
    organization: "",
  })

  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false)
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null)
  const [newOrg, setNewOrg] = useState<Omit<Organization, "id" | "users" | "activeJobs" | "status">>({
    name: "",
    plan: "",
  })

  const handleAddUser = () => {
    setEditingUser(null)
    setNewUser({ name: "", email: "", role: "", organization: "" })
    setIsUserModalOpen(true)
  }

  const handleEditUser = (user: PlatformUser) => {
    setEditingUser(user)
    setNewUser({ name: user.name, email: user.email, role: user.role, organization: user.organization })
    setIsUserModalOpen(true)
  }

  const handleSaveUser = () => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...editingUser, ...newUser } : u)))
    } else {
      setUsers([...users, { ...newUser, id: `u${users.length + 1}`, status: "active" }])
    }
    setIsUserModalOpen(false)
  }

  const handleDeleteUser = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== id))
    }
  }

  const handleAddOrg = () => {
    setEditingOrg(null)
    setNewOrg({ name: "", plan: "" })
    setIsOrgModalOpen(true)
  }

  const handleEditOrg = (org: Organization) => {
    setEditingOrg(org)
    setNewOrg({ name: org.name, plan: org.plan })
    setIsOrgModalOpen(true)
  }

  const handleSaveOrg = () => {
    if (editingOrg) {
      setOrganizations(organizations.map((o) => (o.id === editingOrg.id ? { ...editingOrg, ...newOrg } : o)))
    } else {
      setOrganizations([
        ...organizations,
        { ...newOrg, id: `o${organizations.length + 1}`, users: 0, activeJobs: 0, status: "active" },
      ])
    }
    setIsOrgModalOpen(false)
  }

  const handleDeleteOrg = (id: string) => {
    if (confirm("Are you sure you want to delete this organization?")) {
      setOrganizations(organizations.filter((o) => o.id !== id))
    }
  }

  const handleToggleOrgStatus = (id: string) => {
    setOrganizations(
      organizations.map((o) => (o.id === id ? { ...o, status: o.status === "active" ? "suspended" : "active" } : o)),
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform Administration</h1>
        <p className="text-muted-foreground">Manage users, organizations, and overall platform settings.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">
            <Building2 className="h-4 w-4 mr-2" /> Users
          </TabsTrigger>
          <TabsTrigger value="organizations">
            <Building2 className="h-4 w-4 mr-2" /> Organizations
          </TabsTrigger>
          <TabsTrigger value="billing">
            <DollarSign className="h-4 w-4 mr-2" /> Billing & Usage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Platform Users</CardTitle>
              <Button onClick={handleAddUser}>
                <Plus className="h-4 w-4 mr-2" /> Add User
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.organization}</TableCell>
                      <TableCell>
                        {user.status === "active" ? (
                          <div className="bg-green-100 text-green-700 px-2 py-1 rounded">Active</div>
                        ) : (
                          <div className="bg-red-100 text-red-700 px-2 py-1 rounded">Inactive</div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                          <Trash className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organizations" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Managed Organizations</CardTitle>
              <Button onClick={handleAddOrg}>
                <Plus className="h-4 w-4 mr-2" /> Add Organization
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Active Jobs</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizations.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell className="font-medium">{org.name}</TableCell>
                      <TableCell>{org.plan}</TableCell>
                      <TableCell>{org.users}</TableCell>
                      <TableCell>{org.activeJobs}</TableCell>
                      <TableCell>
                        {org.status === "active" ? (
                          <div className="bg-green-100 text-green-700 px-2 py-1 rounded">Active</div>
                        ) : (
                          <div className="bg-red-100 text-red-700 px-2 py-1 rounded">Suspended</div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEditOrg(org)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleToggleOrgStatus(org.id)}>
                          {org.status === "active" ? (
                            <XCircle className="h-4 w-4 text-red-600" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteOrg(org.id)}>
                          <Trash className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Usage Overview</CardTitle>
              <CardDescription>Monitor subscription plans, usage, and billing details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue (MRR)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$15,400</div>
                    <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">42</div>
                    <p className="text-xs text-muted-foreground">+3 new this month</p>
                  </CardContent>
                </Card>
              </div>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Plan Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src="/placeholder.svg?height=200&width=400&text=Pie+Chart+Placeholder"
                    alt="Plan Distribution Pie Chart"
                    className="w-full h-auto"
                  />
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Usage Trends (Applications Processed)</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src="/placeholder.svg?height=200&width=400&text=Line+Chart+Placeholder"
                    alt="Usage Trends Line Chart"
                    className="w-full h-auto"
                  />
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <CardTitle className="mb-4">{editingUser ? "Edit User" : "Add New User"}</CardTitle>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSaveUser()
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="userName">Name</Label>
                <Input
                  id="userName"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userEmail">Email</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userRole">Role</Label>
                <Select value={newUser.role} onValueChange={(val) => setNewUser({ ...newUser, role: val })}>
                  <SelectTrigger id="userRole">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Recruiter">Recruiter</SelectItem>
                    <SelectItem value="Hiring Manager">Hiring Manager</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Platform Admin">Platform Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="userOrganization">Organization</Label>
                <Select
                  value={newUser.organization}
                  onValueChange={(val) => setNewUser({ ...newUser, organization: val })}
                >
                  <SelectTrigger id="userOrganization">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.name}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsUserModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save User</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Organization Modal */}
      {isOrgModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <CardTitle className="mb-4">{editingOrg ? "Edit Organization" : "Add New Organization"}</CardTitle>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSaveOrg()
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  value={newOrg.name}
                  onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgPlan">Subscription Plan</Label>
                <Select value={newOrg.plan} onValueChange={(val) => setNewOrg({ ...newOrg, plan: val })}>
                  <SelectTrigger id="orgPlan">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Pro">Pro</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsOrgModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Organization</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
