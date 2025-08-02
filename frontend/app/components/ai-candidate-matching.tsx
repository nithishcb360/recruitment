"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Brain, Users, Zap, Target, Star, Filter, 
  TrendingUp, CheckCircle, AlertCircle, Settings,
  Search, Sparkles, Cpu, BarChart3, Lightbulb,
  ThumbsUp, ThumbsDown, RefreshCw, Download
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Job {
  id: string
  title: string
  department: string
  location: string
  type: 'full-time' | 'part-time' | 'contract'
  requirements: string[]
  priorities: {
    experience: number
    skills: number
    culture: number
    location: number
  }
}

interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  title: string
  location: string
  experience: number
  skills: string[]
  education: string
  summary: string
  aiScore: number
  matchReasons: string[]
}

interface MatchResult {
  candidate: Candidate
  score: number
  breakdown: {
    skills: number
    experience: number
    location: number
    culture: number
  }
  recommendations: string[]
  status: 'perfect' | 'excellent' | 'good' | 'fair'
}

export default function AICandidateMatching() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("matching")
  const [selectedJob, setSelectedJob] = useState<string>("")
  const [matchThreshold, setMatchThreshold] = useState([75])
  const [isMatching, setIsMatching] = useState(false)
  const [matchResults, setMatchResults] = useState<MatchResult[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<'score' | 'experience' | 'location'>('score')
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(true)

  // Mock data
  const availableJobs: Job[] = [
    {
      id: "1",
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "full-time",
      requirements: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
      priorities: { experience: 80, skills: 90, culture: 70, location: 60 }
    },
    {
      id: "2", 
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "full-time",
      requirements: ["Product Strategy", "Analytics", "Leadership", "Agile", "User Research"],
      priorities: { experience: 85, skills: 75, culture: 90, location: 40 }
    },
    {
      id: "3",
      title: "UX Designer",
      department: "Design",
      location: "New York, NY", 
      type: "full-time",
      requirements: ["Figma", "User Research", "Prototyping", "Design Systems", "Usability Testing"],
      priorities: { experience: 70, skills: 85, culture: 80, location: 65 }
    }
  ]

  const mockCandidates: Candidate[] = [
    {
      id: "1",
      name: "Sarah Chen",
      email: "sarah.chen@email.com",
      phone: "+1 (555) 123-4567",
      title: "Senior Frontend Engineer",
      location: "San Francisco, CA",
      experience: 6,
      skills: ["React", "TypeScript", "Next.js", "GraphQL", "AWS", "Node.js", "Python"],
      education: "BS Computer Science - Stanford University",
      summary: "Passionate full-stack developer with 6+ years building scalable web applications",
      aiScore: 94,
      matchReasons: [
        "Perfect skill alignment with React and TypeScript expertise",
        "Located in target area (San Francisco)",
        "Strong backend experience complements role requirements"
      ]
    },
    {
      id: "2",
      name: "Marcus Johnson",
      email: "marcus.j@email.com", 
      phone: "+1 (555) 234-5678",
      title: "Frontend Developer",
      location: "Austin, TX",
      experience: 4,
      skills: ["React", "JavaScript", "CSS", "HTML", "Git", "Webpack"],
      education: "MS Software Engineering - UT Austin",
      summary: "Creative frontend developer focused on user experience and performance optimization",
      aiScore: 82,
      matchReasons: [
        "Strong React foundation matches core requirements",
        "Open to relocation based on profile preferences",
        "Portfolio demonstrates excellent UI/UX sensibilities"
      ]
    },
    {
      id: "3",
      name: "Emily Rodriguez", 
      email: "emily.r@email.com",
      phone: "+1 (555) 345-6789",
      title: "Full Stack Developer",
      location: "Remote",
      experience: 8,
      skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "PostgreSQL"],
      education: "BS Computer Engineering - MIT",
      summary: "Experienced full-stack engineer with expertise in modern web technologies and cloud architecture",
      aiScore: 91,
      matchReasons: [
        "Exceeds experience requirements with 8+ years",
        "Complete technology stack alignment",
        "Remote work experience matches flexible work options"
      ]
    }
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoRefresh && selectedJob) {
      interval = setInterval(() => {
        runMatching()
      }, 30000) // Refresh every 30 seconds
    }
    return () => clearInterval(interval)
  }, [autoRefresh, selectedJob])

  const runMatching = async () => {
    if (!selectedJob) {
      toast({
        title: "Select a Job",
        description: "Please select a job position to find matching candidates.",
        variant: "destructive"
      })
      return
    }

    setIsMatching(true)
    
    try {
      // Simulate AI matching process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const job = availableJobs.find(j => j.id === selectedJob)!
      const threshold = matchThreshold[0]
      
      // Generate match results with AI scoring
      const results: MatchResult[] = mockCandidates
        .map(candidate => {
          const skillsMatch = calculateSkillsMatch(candidate.skills, job.requirements)
          const experienceMatch = calculateExperienceMatch(candidate.experience, job)
          const locationMatch = calculateLocationMatch(candidate.location, job.location)
          const cultureMatch = Math.floor(Math.random() * 30) + 70 // Simulated culture fit
          
          const weightedScore = Math.round(
            (skillsMatch * job.priorities.skills + 
             experienceMatch * job.priorities.experience + 
             locationMatch * job.priorities.location + 
             cultureMatch * job.priorities.culture) / 400 * 100
          )
          
          return {
            candidate,
            score: weightedScore,
            breakdown: {
              skills: skillsMatch,
              experience: experienceMatch, 
              location: locationMatch,
              culture: cultureMatch
            },
            recommendations: generateRecommendations(candidate, job, skillsMatch, experienceMatch),
            status: weightedScore >= 90 ? 'perfect' : 
                   weightedScore >= 80 ? 'excellent' :
                   weightedScore >= 70 ? 'good' : 'fair'
          }
        })
        .filter(result => result.score >= threshold)
        .sort((a, b) => b.score - a.score)
      
      setMatchResults(results)
      
      toast({
        title: "Matching Complete",
        description: `Found ${results.length} candidates matching your criteria.`,
        variant: "default"
      })
      
    } catch (error) {
      console.error('Matching failed:', error)
      toast({
        title: "Matching Failed", 
        description: "Failed to run AI matching. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsMatching(false)
    }
  }

  const calculateSkillsMatch = (candidateSkills: string[], requiredSkills: string[]): number => {
    const matches = requiredSkills.filter(skill => 
      candidateSkills.some(cs => cs.toLowerCase().includes(skill.toLowerCase()))
    ).length
    return Math.round((matches / requiredSkills.length) * 100)
  }

  const calculateExperienceMatch = (candidateExp: number, job: Job): number => {
    const requiredExp = job.title.includes('Senior') ? 5 : job.title.includes('Lead') ? 7 : 2
    if (candidateExp >= requiredExp) return 100
    return Math.round((candidateExp / requiredExp) * 100)
  }

  const calculateLocationMatch = (candidateLocation: string, jobLocation: string): number => {
    if (jobLocation.toLowerCase().includes('remote')) return 100
    if (candidateLocation.toLowerCase().includes(jobLocation.toLowerCase().split(',')[0])) return 100
    return 60 // Assume willing to relocate
  }

  const generateRecommendations = (candidate: Candidate, job: Job, skillsMatch: number, expMatch: number): string[] => {
    const recommendations: string[] = []
    
    if (skillsMatch < 80) {
      recommendations.push("Consider skills assessment to validate technical capabilities")
    }
    if (expMatch < 90) {
      recommendations.push("Evaluate project complexity alignment with experience level")
    }
    if (candidate.location !== job.location && !job.location.includes('Remote')) {
      recommendations.push("Discuss relocation timeline and support during interview")
    }
    if (candidate.aiScore > 90) {
      recommendations.push("Fast-track to final interview round - exceptional match")
    }
    
    return recommendations
  }

  const filteredResults = matchResults.filter(result =>
    result.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => {
    switch (sortBy) {
      case 'experience':
        return b.candidate.experience - a.candidate.experience
      case 'location':
        return a.candidate.location.localeCompare(b.candidate.location)
      default:
        return b.score - a.score
    }
  })

  const getStatusColor = (status: MatchResult['status']) => {
    switch (status) {
      case 'perfect': return 'bg-green-500'
      case 'excellent': return 'bg-blue-500'
      case 'good': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusLabel = (status: MatchResult['status']) => {
    switch (status) {
      case 'perfect': return 'Perfect Match'
      case 'excellent': return 'Excellent Match'
      case 'good': return 'Good Match'
      default: return 'Fair Match'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Brain className="mr-3 h-7 w-7 text-blue-600" />
            AI Candidate Matching
          </h1>
          <p className="text-muted-foreground">
            Leverage AI to find the perfect candidates for your open positions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Sparkles className="mr-1 h-3 w-3" />
            AI Powered
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="matching" className="flex items-center">
            <Target className="mr-2 h-4 w-4" />
            Smart Matching
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            AI Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matching" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Matching Controls */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Job Selection</CardTitle>
                  <CardDescription>Choose a position to find matching candidates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Job</Label>
                    <Select value={selectedJob} onValueChange={setSelectedJob}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a job..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableJobs.map(job => (
                          <SelectItem key={job.id} value={job.id}>
                            <div>
                              <div className="font-medium">{job.title}</div>
                              <div className="text-xs text-muted-foreground">{job.department} • {job.location}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Minimum Match Score: {matchThreshold[0]}%</Label>
                    <Slider
                      value={matchThreshold}
                      onValueChange={setMatchThreshold}
                      max={100}
                      min={50}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-refresh" className="text-sm">Auto Refresh</Label>
                    <Switch
                      id="auto-refresh"
                      checked={autoRefresh}
                      onCheckedChange={setAutoRefresh}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-recommendations" className="text-sm">Show AI Recommendations</Label>
                    <Switch
                      id="show-recommendations"
                      checked={showRecommendations}
                      onCheckedChange={setShowRecommendations}
                    />
                  </div>

                  <Button 
                    onClick={runMatching} 
                    disabled={!selectedJob || isMatching}
                    className="w-full"
                  >
                    {isMatching ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Run AI Matching
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {selectedJob && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Job Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {availableJobs.find(j => j.id === selectedJob)?.requirements.map(req => (
                        <Badge key={req} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Match Results */} 
            <div className="lg:col-span-3 space-y-4">
              {matchResults.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Match Results</CardTitle>
                        <CardDescription>
                          Found {filteredResults.length} candidates above {matchThreshold[0]}% match threshold
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search candidates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 w-48"
                          />
                        </div>
                        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="score">Match Score</SelectItem>
                            <SelectItem value="experience">Experience</SelectItem>
                            <SelectItem value="location">Location</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-4">
                        {filteredResults.map((result) => (
                          <Card key={result.candidate.id} className="border-l-4 border-l-blue-500">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage src={result.candidate.avatar} />
                                    <AvatarFallback>
                                      {result.candidate.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <h3 className="font-semibold">{result.candidate.name}</h3>
                                      <Badge className={getStatusColor(result.status)}>
                                        {getStatusLabel(result.status)}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{result.candidate.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {result.candidate.location} • {result.candidate.experience} years experience
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-blue-600">{result.score}%</div>
                                  <p className="text-xs text-muted-foreground">Match Score</p>
                                </div>
                              </div>

                              <div className="mt-4 space-y-3">
                                {/* Skills Match */}
                                <div className="flex items-center space-x-2">
                                  <div className="text-xs font-medium w-20">Skills:</div>
                                  <Progress value={result.breakdown.skills} className="flex-1 h-2" />
                                  <div className="text-xs w-10 text-right">{result.breakdown.skills}%</div>
                                </div>

                                {/* Experience Match */}
                                <div className="flex items-center space-x-2">
                                  <div className="text-xs font-medium w-20">Experience:</div>
                                  <Progress value={result.breakdown.experience} className="flex-1 h-2" />
                                  <div className="text-xs w-10 text-right">{result.breakdown.experience}%</div>
                                </div>

                                {/* Location Match */}
                                <div className="flex items-center space-x-2">
                                  <div className="text-xs font-medium w-20">Location:</div>
                                  <Progress value={result.breakdown.location} className="flex-1 h-2" />
                                  <div className="text-xs w-10 text-right">{result.breakdown.location}%</div>
                                </div>

                                {/* Culture Match */}
                                <div className="flex items-center space-x-2">
                                  <div className="text-xs font-medium w-20">Culture:</div>
                                  <Progress value={result.breakdown.culture} className="flex-1 h-2" />
                                  <div className="text-xs w-10 text-right">{result.breakdown.culture}%</div>
                                </div>
                              </div>

                              {/* Skills Tags */}
                              <div className="mt-3">
                                <div className="flex flex-wrap gap-1">
                                  {result.candidate.skills.slice(0, 6).map(skill => (
                                    <Badge key={skill} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                  {result.candidate.skills.length > 6 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{result.candidate.skills.length - 6} more
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {/* AI Recommendations */}
                              {showRecommendations && result.recommendations.length > 0 && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                  <div className="flex items-center mb-2">
                                    <Lightbulb className="h-4 w-4 text-blue-600 mr-1" />
                                    <span className="text-sm font-medium text-blue-800">AI Recommendations</span>
                                  </div>
                                  <ul className="space-y-1">
                                    {result.recommendations.map((rec, index) => (
                                      <li key={index} className="text-xs text-blue-700 flex items-start">
                                        <span className="mr-2">•</span>
                                        {rec}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Actions */}
                              <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Button size="sm" variant="outline">
                                    View Profile
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    Schedule Interview
                                  </Button>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <ThumbsUp className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <ThumbsDown className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}

              {matchResults.length === 0 && !isMatching && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Ready to Find Perfect Matches</h3>
                    <p className="text-muted-foreground mb-4">
                      Select a job position and click "Run AI Matching" to discover the best candidates using our advanced AI algorithms.
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        Skills Analysis
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        Experience Matching
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        Cultural Fit
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Matches Run</p>
                  <p className="text-2xl font-bold text-gray-900">247</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Match Score</p>
                  <p className="text-2xl font-bold text-gray-900">78%</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Placement Rate</p>
                  <p className="text-2xl font-bold text-gray-900">34%</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Accuracy</p>
                  <p className="text-2xl font-bold text-gray-900">92%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Matching Performance Insights</CardTitle>
              <CardDescription>AI-powered analysis of your recruitment matching effectiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Top Performing Skills Matches</h4>
                  <div className="space-y-2">
                    {["React", "TypeScript", "Python", "AWS", "Node.js"].map((skill, index) => (
                      <div key={skill} className="flex items-center justify-between">
                        <span className="text-sm">{skill}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={95 - index * 8} className="w-32 h-2" />
                          <span className="text-sm text-muted-foreground w-10">{95 - index * 8}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Department Match Success Rates</h4>
                  <div className="space-y-2">
                    {[
                      { dept: "Engineering", rate: 89 },
                      { dept: "Product", rate: 76 },
                      { dept: "Design", rate: 82 },
                      { dept: "Marketing", rate: 71 },
                      { dept: "Sales", rate: 68 }
                    ].map((item) => (
                      <div key={item.dept} className="flex items-center justify-between">
                        <span className="text-sm">{item.dept}</span>  
                        <div className="flex items-center space-x-2">
                          <Progress value={item.rate} className="w-32 h-2" />
                          <span className="text-sm text-muted-foreground w-10">{item.rate}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Model Configuration</CardTitle>
                <CardDescription>Adjust AI matching parameters and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Skills Weight</Label>
                  <Slider defaultValue={[80]} max={100} min={0} step={5} />
                  <p className="text-xs text-muted-foreground">How important are technical skills in matching</p>
                </div>

                <div className="space-y-2">
                  <Label>Experience Weight</Label>
                  <Slider defaultValue={[70]} max={100} min={0} step={5} />
                  <p className="text-xs text-muted-foreground">How important is years of experience</p>
                </div>

                <div className="space-y-2">
                  <Label>Location Weight</Label>
                  <Slider defaultValue={[60]} max={100} min={0} step={5} />
                  <p className="text-xs text-muted-foreground">How important is geographic location</p>
                </div>

                <div className="space-y-2">
                  <Label>Culture Fit Weight</Label>
                  <Slider defaultValue={[75]} max={100} min={0} step={5} />
                  <p className="text-xs text-muted-foreground">How important is cultural alignment</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Machine Learning</Label>
                    <p className="text-xs text-muted-foreground">Learn from hiring decisions to improve matches</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Bias Detection</Label>
                    <p className="text-xs text-muted-foreground">Monitor and prevent algorithmic bias</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>AI model performance and accuracy metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Model Accuracy</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">92.4%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Prediction Confidence</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">87.1%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">False Positive Rate</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">8.3%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Training Data Size</span>
                  <Badge variant="outline">12,847 samples</Badge>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium">Last Model Update</Label>
                  <p className="text-xs text-muted-foreground">March 15, 2024 - Performance improved by 3.2%</p>
                </div>

                <Button variant="outline" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retrain Model
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}