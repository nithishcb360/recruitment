"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Users, Briefcase, DollarSign, Clock, CheckCircle } from "lucide-react"

export default function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState("last-30-days")
  const [reportType, setReportType] = useState("overview")

  // Mock data for charts and metrics
  const metrics = {
    "last-30-days": {
      hires: 15,
      applications: 320,
      timeToFill: 28, // days
      costPerHire: 3100, // USD
      offerAcceptanceRate: 75, // %
    },
    "last-90-days": {
      hires: 45,
      applications: 950,
      timeToFill: 30,
      costPerHire: 3050,
      offerAcceptanceRate: 72,
    },
    "this-year": {
      hires: 180,
      applications: 3800,
      timeToFill: 29,
      costPerHire: 2950,
      offerAcceptanceRate: 78,
    },
  }

  const currentMetrics = metrics[timeframe as keyof typeof metrics]

  const pipelineData = [
    { stage: "Applied", count: 150 },
    { stage: "Screening", count: 80 },
    { stage: "Interview", count: 40 },
    { stage: "Offer", count: 15 },
    { stage: "Hired", count: 10 },
  ]

  const sourcePerformance = [
    { source: "LinkedIn", hires: 5, cost: 2500, conversion: 8.5 },
    { source: "Referrals", hires: 3, cost: 1000, conversion: 15.2 },
    { source: "Indeed", hires: 4, cost: 2000, conversion: 7.8 },
    { source: "Company Website", hires: 2, cost: 0, conversion: 10.1 },
  ]

  const timeToFillByDepartment = [
    { department: "Engineering", days: 35 },
    { department: "Product", days: 28 },
    { department: "Marketing", days: 22 },
    { department: "Sales", days: 25 },
  ]

  const renderMetricCard = (
    title: string,
    value: string | number,
    icon: React.ReactNode,
    trend?: "up" | "down",
    change?: number,
  ) => (
    <Card className="shadow-sm">
      <CardContent className="p-4 flex items-center space-x-4">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600">{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            {trend && change !== undefined && (
              <div className={`flex items-center text-xs ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {trend === "up" ? (
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-0.5" />
                )}
                {change > 0 ? "+" : ""}
                {change}%
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Recruitment Analytics</h1>
        <p className="text-muted-foreground">Gain insights into your hiring performance.</p>
      </div>

      <div className="flex items-center space-x-4">
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-30-days">Last 30 Days</SelectItem>
            <SelectItem value="last-90-days">Last 90 Days</SelectItem>
            <SelectItem value="this-year">This Year</SelectItem>
          </SelectContent>
        </Select>
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Report Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overview">Overview</SelectItem>
            <SelectItem value="pipeline">Pipeline Analysis</SelectItem>
            <SelectItem value="sources">Source Performance</SelectItem>
            <SelectItem value="time-to-fill">Time to Fill</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="bg-transparent">
          Export Report
        </Button>
      </div>

      {reportType === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {renderMetricCard("Total Hires", currentMetrics.hires, <Users />, "up", 10)}
            {renderMetricCard("Total Applications", currentMetrics.applications, <Briefcase />, "up", 5)}
            {renderMetricCard("Avg. Time to Fill", `${currentMetrics.timeToFill} days`, <Clock />, "down", 8)}
            {renderMetricCard("Avg. Cost Per Hire", `$${currentMetrics.costPerHire}`, <DollarSign />, "down", 12)}
            {renderMetricCard(
              "Offer Acceptance Rate",
              `${currentMetrics.offerAcceptanceRate}%`,
              <CheckCircle />,
              "up",
              3,
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Application Trend</CardTitle>
                <CardDescription>Number of applications over time.</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/placeholder.svg?height=200&width=400&text=Line+Chart+Placeholder"
                  alt="Application Trend Line Chart"
                  className="w-full h-auto"
                />
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Hiring Funnel</CardTitle>
                <CardDescription>Candidates progressing through stages.</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="/placeholder.svg?height=200&width=400&text=Bar+Chart+Placeholder"
                  alt="Hiring Funnel Bar Chart"
                  className="w-full h-auto"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {reportType === "pipeline" && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Candidate Pipeline Analysis</CardTitle>
            <CardDescription>Distribution of candidates across different stages.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src="/placeholder.svg?height=300&width=500&text=Pipeline+Bar+Chart"
                  alt="Pipeline Bar Chart"
                  className="w-full h-auto"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Stage Breakdown</h3>
                {pipelineData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{data.stage}</span>
                    <span className="text-sm text-gray-700">{data.count} candidates</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {reportType === "sources" && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Source Performance</CardTitle>
            <CardDescription>Effectiveness of different recruitment sources.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src="/placeholder.svg?height=300&width=500&text=Source+Performance+Chart"
                  alt="Source Performance Chart"
                  className="w-full h-auto"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Source Metrics</h3>
                {sourcePerformance.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{data.source}</span>
                    <span className="text-sm text-gray-700">
                      {data.hires} Hires • ${data.cost}/hire • {data.conversion}% Conversion
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {reportType === "time-to-fill" && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Time to Fill by Department</CardTitle>
            <CardDescription>Average days to fill positions across departments.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src="/placeholder.svg?height=300&width=500&text=Time+to+Fill+Chart"
                  alt="Time to Fill Chart"
                  className="w-full h-auto"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Department Breakdown</h3>
                {timeToFillByDepartment.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{data.department}</span>
                    <span className="text-sm text-gray-700">{data.days} days</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
