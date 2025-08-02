"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Users, Briefcase, DollarSign, Clock, CheckCircle, Loader2 } from "lucide-react"
import { getDashboardMetrics, getSourcePerformance, getJobsAnalytics, type DashboardMetrics, type SourcePerformance, type JobAnalytics } from "@/lib/api/analytics"
import { useToast } from "@/hooks/use-toast"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import ExportDialog from "./export-dialog"
import type { ExportData } from "@/lib/utils/export"

export default function AnalyticsDashboard() {
  const { toast } = useToast()
  const [timeframe, setTimeframe] = useState("last-30-days")
  const [reportType, setReportType] = useState("overview")
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [sourcePerformance, setSourcePerformance] = useState<SourcePerformance[]>([])
  const [jobsAnalytics, setJobsAnalytics] = useState<JobAnalytics[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)

  // Load analytics data on component mount
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true)
        const [metricsData, sourcesData, jobsData] = await Promise.all([
          getDashboardMetrics(),
          getSourcePerformance(),
          getJobsAnalytics()
        ])
        
        setMetrics(metricsData)
        setSourcePerformance(sourcesData)
        setJobsAnalytics(jobsData)
      } catch (error) {
        console.error('Error fetching analytics data:', error)
        toast({
          title: "Error",
          description: "Failed to load analytics data. Please refresh the page.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [toast])

  // Transform pipeline data from metrics
  const pipelineData = metrics ? Object.entries(metrics.candidates_by_stage).map(([stage, count]) => ({
    stage: stage.charAt(0).toUpperCase() + stage.slice(1),
    count
  })) : []

  // Transform jobs data for time to fill by department
  const timeToFillByDepartment = jobsAnalytics.reduce((acc, job) => {
    const existing = acc.find(item => item.department === job.department_name)
    if (existing) {
      existing.days = Math.round((existing.days + job.days_open) / 2)
    } else {
      acc.push({ department: job.department_name, days: job.days_open })
    }
    return acc
  }, [] as { department: string; days: number }[])

  // Mock data for charts when no real data is available
  const applicationTrendData = [
    { month: 'Jan', applications: 45 },
    { month: 'Feb', applications: 52 },
    { month: 'Mar', applications: 61 },
    { month: 'Apr', applications: 58 },
    { month: 'May', applications: 67 },
    { month: 'Jun', applications: 73 },
  ]

  const hiringFunnelData = pipelineData.length > 0 ? pipelineData : [
    { stage: 'Applied', count: 120 },
    { stage: 'Screening', count: 85 },
    { stage: 'Interview', count: 45 },
    { stage: 'Offer', count: 15 },
    { stage: 'Hired', count: 12 },
  ]

  const sourcePerformanceChartData = sourcePerformance.length > 0 ? sourcePerformance.map(source => ({
    name: source.source_name,
    applications: source.total_applications,
    hires: source.hires_made,
    cost: source.cost_per_hire
  })) : [
    { name: 'LinkedIn', applications: 45, hires: 8, cost: 1200 },
    { name: 'Indeed', applications: 38, hires: 5, cost: 900 },
    { name: 'Company Website', applications: 32, hires: 6, cost: 400 },
    { name: 'Referrals', applications: 28, hires: 12, cost: 300 },
    { name: 'Job Boards', applications: 22, hires: 3, cost: 800 },
  ]

  const timeToFillChartData = timeToFillByDepartment.length > 0 ? timeToFillByDepartment : [
    { department: 'Engineering', days: 32 },
    { department: 'Product', days: 28 },
    { department: 'Design', days: 25 },
    { department: 'Marketing', days: 21 },
    { department: 'Sales', days: 18 },
  ]

  // Chart colors
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316']

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

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading analytics...</span>
        </div>
      ) : metrics ? (
        <div>

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
        <Button 
          variant="outline" 
          className="bg-transparent"
          onClick={() => setIsExportDialogOpen(true)}
        >
          Export Report
        </Button>
      </div>

      {reportType === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {renderMetricCard(
              "Active Jobs",
              metrics.active_jobs,
              <Briefcase className="h-5 w-5" />,
              metrics.active_jobs_change > 0 ? "up" : "down",
              metrics.active_jobs_change,
            )}
            {renderMetricCard(
              "Total Candidates",
              metrics.total_candidates.toLocaleString(),
              <Users className="h-5 w-5" />,
              "up",
              0,
            )}
            {renderMetricCard(
              "Avg. Time to Fill",
              `${metrics.time_to_fill} days`,
              <Clock className="h-5 w-5" />,
              metrics.time_to_fill_change > 0 ? "up" : "down",
              metrics.time_to_fill_change,
            )}
            {renderMetricCard(
              "Cost per Hire",
              `$${metrics.cost_per_hire.toLocaleString()}`,
              <DollarSign className="h-5 w-5" />,
              metrics.cost_per_hire_change > 0 ? "up" : "down",
              metrics.cost_per_hire_change,
            )}
            {renderMetricCard(
              "Offer Rate",
              `${metrics.offer_rate}%`,
              <CheckCircle className="h-5 w-5" />,
              metrics.offer_rate_change > 0 ? "up" : "down",
              metrics.offer_rate_change,
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Application Trend</CardTitle>
                <CardDescription>Number of applications over the last 6 months.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={applicationTrendData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="month" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="applications" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#1D4ED8' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Hiring Funnel</CardTitle>
                <CardDescription>Candidates progressing through stages.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={hiringFunnelData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="stage" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
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
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={hiringFunnelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ stage, percent }) => `${stage}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {hiringFunnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
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
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sourcePerformanceChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="name" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="applications" fill="#3B82F6" name="Applications" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="hires" fill="#10B981" name="Hires" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Source Metrics</h3>
                {sourcePerformance.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{data.source_name}</span>
                    <span className="text-sm text-gray-700">
                      {data.hires_made} Hires • ${data.cost_per_hire}/hire • {data.conversion_rate.toFixed(1)}% Conversion
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
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timeToFillChartData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      type="number"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      dataKey="department" 
                      type="category"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      width={80}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      formatter={(value) => [`${value} days`, 'Time to Fill']}
                    />
                    <Bar 
                      dataKey="days" 
                      fill="#F59E0B"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
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
      ) : (
        <div className="text-center text-muted-foreground py-8">
          No analytics data available.
        </div>
      )}
      
      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        data={{
          overview: metrics ? {
            activeJobs: metrics.active_jobs,
            totalCandidates: metrics.total_candidates,
            timeToFill: metrics.time_to_fill,
            costPerHire: metrics.cost_per_hire,
            offerRate: metrics.offer_rate
          } : undefined,
          applicationTrend: applicationTrendData,
          hiringFunnel: hiringFunnelData,
          sourcePerformance: sourcePerformanceChartData.map(source => ({
            ...source,
            conversionRate: (source.hires / source.applications) * 100
          })),
          timeToFill: timeToFillChartData
        }}
        reportType={reportType}
      />
    </div>
  )
}
