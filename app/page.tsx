"use client"

import { useState } from "react"
import {
  Search,
  Grid3X3,
  List,
  Play,
  Pause,
  Settings,
  Activity,
  Zap,
  Brain,
  Shield,
  TrendingUp,
  Globe,
  Eye,
  Volume2,
  Calendar,
  Database,
  Network,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TestRunner } from "@/components/test-runner"
import { CoreMetrics } from "@/components/core-metrics"
import { ThemeToggle } from "@/components/theme-toggle"

interface AgentCore {
  id: string
  name: string
  type:
    | "reasoning"
    | "creative"
    | "analytical"
    | "conversational"
    | "optimization"
    | "monitoring"
    | "translation"
    | "vision"
    | "audio"
    | "planning"
    | "memory"
    | "coordination"
  status: "active" | "idle" | "maintenance" | "error"
  version: string
  performance: number
  memory: number
  tasks: number
  uptime: string
  description: string
  capabilities: string[]
  lastUpdated: string
}

const mockCores: AgentCore[] = [
  {
    id: "core-001",
    name: "Reasoning Engine Alpha",
    type: "reasoning",
    status: "active",
    version: "2.1.4",
    performance: 94,
    memory: 67,
    tasks: 1247,
    uptime: "15d 7h 23m",
    description: "Advanced logical reasoning and problem-solving capabilities",
    capabilities: ["Logic Processing", "Pattern Recognition", "Decision Trees", "Inference"],
    lastUpdated: "2024-01-15T10:30:00Z",
  },
  {
    id: "core-002",
    name: "Creative Synthesis Beta",
    type: "creative",
    status: "active",
    version: "1.8.2",
    performance: 87,
    memory: 45,
    tasks: 892,
    uptime: "8d 14h 12m",
    description: "Creative content generation and artistic synthesis",
    capabilities: ["Content Generation", "Style Transfer", "Ideation", "Artistic Rendering"],
    lastUpdated: "2024-01-14T16:45:00Z",
  },
  {
    id: "core-003",
    name: "Analytics Processor Gamma",
    type: "analytical",
    status: "idle",
    version: "3.0.1",
    performance: 91,
    memory: 23,
    tasks: 2156,
    uptime: "22d 3h 45m",
    description: "Data analysis and statistical processing engine",
    capabilities: ["Data Mining", "Statistical Analysis", "Predictive Modeling", "Visualization"],
    lastUpdated: "2024-01-13T09:15:00Z",
  },
  {
    id: "core-004",
    name: "Conversation Handler Delta",
    type: "conversational",
    status: "maintenance",
    version: "1.9.7",
    performance: 82,
    memory: 78,
    tasks: 3421,
    uptime: "0d 2h 15m",
    description: "Natural language processing and dialogue management",
    capabilities: ["NLP", "Dialogue Management", "Context Awareness", "Sentiment Analysis"],
    lastUpdated: "2024-01-15T14:20:00Z",
  },
  {
    id: "core-005",
    name: "Security Monitor Epsilon",
    type: "monitoring",
    status: "error",
    version: "2.3.1",
    performance: 45,
    memory: 89,
    tasks: 567,
    uptime: "1d 8h 32m",
    description: "Security analysis and threat detection system",
    capabilities: ["Threat Detection", "Anomaly Analysis", "Risk Assessment", "Compliance"],
    lastUpdated: "2024-01-15T11:10:00Z",
  },
  {
    id: "core-006",
    name: "Learning Optimizer Zeta",
    type: "optimization",
    status: "active",
    version: "1.5.3",
    performance: 96,
    memory: 34,
    tasks: 1789,
    uptime: "12d 19h 8m",
    description: "Machine learning optimization and model training",
    capabilities: ["Model Training", "Hyperparameter Tuning", "Performance Optimization", "AutoML"],
    lastUpdated: "2024-01-14T20:30:00Z",
  },
  {
    id: "core-007",
    name: "Translation Engine Eta",
    type: "translation",
    status: "active",
    version: "2.7.1",
    performance: 89,
    memory: 52,
    tasks: 4523,
    uptime: "18d 11h 45m",
    description: "Multi-language translation and localization system",
    capabilities: ["Real-time Translation", "Language Detection", "Cultural Adaptation", "Voice Translation"],
    lastUpdated: "2024-01-14T08:15:00Z",
  },
  {
    id: "core-008",
    name: "Vision Processor Theta",
    type: "vision",
    status: "active",
    version: "3.2.0",
    performance: 93,
    memory: 71,
    tasks: 2847,
    uptime: "9d 16h 22m",
    description: "Computer vision and image processing capabilities",
    capabilities: ["Object Detection", "Image Classification", "OCR", "Facial Recognition"],
    lastUpdated: "2024-01-15T12:30:00Z",
  },
  {
    id: "core-009",
    name: "Audio Intelligence Iota",
    type: "audio",
    status: "idle",
    version: "1.4.8",
    performance: 76,
    memory: 38,
    tasks: 1634,
    uptime: "25d 4h 18m",
    description: "Audio processing and speech recognition system",
    capabilities: ["Speech Recognition", "Audio Classification", "Noise Reduction", "Voice Synthesis"],
    lastUpdated: "2024-01-13T15:45:00Z",
  },
  {
    id: "core-010",
    name: "Planning Coordinator Kappa",
    type: "planning",
    status: "active",
    version: "2.0.5",
    performance: 88,
    memory: 43,
    tasks: 956,
    uptime: "6d 9h 33m",
    description: "Strategic planning and task coordination engine",
    capabilities: ["Task Scheduling", "Resource Allocation", "Goal Planning", "Workflow Optimization"],
    lastUpdated: "2024-01-15T09:20:00Z",
  },
  {
    id: "core-011",
    name: "Memory Manager Lambda",
    type: "memory",
    status: "active",
    version: "1.7.2",
    performance: 91,
    memory: 29,
    tasks: 3782,
    uptime: "31d 2h 14m",
    description: "Distributed memory management and caching system",
    capabilities: ["Memory Optimization", "Data Caching", "Storage Management", "Retrieval Systems"],
    lastUpdated: "2024-01-14T17:10:00Z",
  },
  {
    id: "core-012",
    name: "System Coordinator Mu",
    type: "coordination",
    status: "maintenance",
    version: "2.4.3",
    performance: 85,
    memory: 56,
    tasks: 2193,
    uptime: "0d 1h 47m",
    description: "Multi-agent coordination and orchestration system",
    capabilities: ["Agent Coordination", "Load Balancing", "Task Distribution", "Conflict Resolution"],
    lastUpdated: "2024-01-15T13:25:00Z",
  },
  {
    id: "core-013",
    name: "Performance Monitor Nu",
    type: "monitoring",
    status: "active",
    version: "1.9.1",
    performance: 97,
    memory: 31,
    tasks: 5647,
    uptime: "42d 8h 56m",
    description: "System performance monitoring and alerting",
    capabilities: ["Performance Tracking", "Alert Management", "Metric Collection", "Health Monitoring"],
    lastUpdated: "2024-01-15T11:40:00Z",
  },
  {
    id: "core-014",
    name: "Code Optimizer Xi",
    type: "optimization",
    status: "active",
    version: "3.1.7",
    performance: 92,
    memory: 48,
    tasks: 1456,
    uptime: "14d 21h 12m",
    description: "Code analysis and optimization engine",
    capabilities: ["Code Analysis", "Performance Optimization", "Refactoring", "Bug Detection"],
    lastUpdated: "2024-01-14T14:55:00Z",
  },
  {
    id: "core-015",
    name: "Multilingual Assistant Omicron",
    type: "translation",
    status: "idle",
    version: "2.2.4",
    performance: 84,
    memory: 62,
    tasks: 3298,
    uptime: "19d 13h 28m",
    description: "Advanced multilingual communication assistant",
    capabilities: ["Cross-language Communication", "Cultural Context", "Dialect Recognition", "Sign Language"],
    lastUpdated: "2024-01-13T19:30:00Z",
  },
  {
    id: "core-016",
    name: "Visual Analytics Pi",
    type: "vision",
    status: "error",
    version: "2.8.9",
    performance: 67,
    memory: 84,
    tasks: 892,
    uptime: "2d 5h 41m",
    description: "Advanced visual data analysis and pattern recognition",
    capabilities: ["Pattern Recognition", "Visual Analytics", "3D Processing", "Medical Imaging"],
    lastUpdated: "2024-01-15T16:15:00Z",
  },
  {
    id: "core-017",
    name: "Audio Synthesis Rho",
    type: "audio",
    status: "active",
    version: "1.6.3",
    performance: 79,
    memory: 41,
    tasks: 2134,
    uptime: "11d 7h 19m",
    description: "Advanced audio synthesis and music generation",
    capabilities: ["Music Generation", "Sound Design", "Audio Effects", "Voice Cloning"],
    lastUpdated: "2024-01-14T21:45:00Z",
  },
  {
    id: "core-018",
    name: "Strategic Planner Sigma",
    type: "planning",
    status: "active",
    version: "1.3.6",
    performance: 86,
    memory: 37,
    tasks: 1567,
    uptime: "8d 14h 52m",
    description: "Long-term strategic planning and decision support",
    capabilities: ["Strategic Analysis", "Risk Assessment", "Scenario Planning", "Decision Trees"],
    lastUpdated: "2024-01-15T07:25:00Z",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500"
    case "idle":
      return "bg-yellow-500"
    case "maintenance":
      return "bg-blue-500"
    case "error":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "reasoning":
      return <Brain className="h-5 w-5" />
    case "creative":
      return <Zap className="h-5 w-5" />
    case "analytical":
      return <Activity className="h-5 w-5" />
    case "conversational":
      return <Settings className="h-5 w-5" />
    case "optimization":
      return <TrendingUp className="h-5 w-5" />
    case "monitoring":
      return <Shield className="h-5 w-5" />
    case "translation":
      return <Globe className="h-5 w-5" />
    case "vision":
      return <Eye className="h-5 w-5" />
    case "audio":
      return <Volume2 className="h-5 w-5" />
    case "planning":
      return <Calendar className="h-5 w-5" />
    case "memory":
      return <Database className="h-5 w-5" />
    case "coordination":
      return <Network className="h-5 w-5" />
    default:
      return <Shield className="h-5 w-5" />
  }
}

export default function AIAgentCoresPage() {
  const [cores, setCores] = useState<AgentCore[]>(mockCores)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCore, setSelectedCore] = useState<AgentCore | null>(null)
  const [activeTab, setActiveTab] = useState<string>("metrics")

  const filteredCores = cores.filter((core) => {
    const matchesSearch =
      core.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      core.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || core.type === filterType
    const matchesStatus = filterStatus === "all" || core.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const toggleCoreStatus = (coreId: string) => {
    setCores((prev) =>
      prev.map((core) =>
        core.id === coreId ? { ...core, status: core.status === "active" ? "idle" : ("active" as any) } : core,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-black dark:to-black transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">AI Agent Cores</h1>
              <p className="text-slate-600 dark:text-gray-300 text-lg">Monitor and manage your AI agent core systems</p>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search cores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="reasoning">Reasoning</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="analytical">Analytical</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                  <SelectItem value="optimization">Optimization</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="translation">Translation</SelectItem>
                  <SelectItem value="vision">Vision</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="memory">Memory</SelectItem>
                  <SelectItem value="coordination">Coordination</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="idle">Idle</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {activeTab === "cores" && (
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="metrics" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-black border border-slate-200 dark:border-gray-800 p-1 rounded-lg">
            <TabsTrigger
              value="cores"
              className="data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black font-medium"
            >
              Agent Cores
            </TabsTrigger>
            <TabsTrigger
              value="metrics"
              className="data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black font-medium"
            >
              System Metrics
            </TabsTrigger>
            <TabsTrigger
              value="tests"
              className="data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black font-medium"
            >
              Test Suite
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cores">
            {/* Cores Grid/List */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredCores.map((core) => (
                <Card
                  key={core.id}
                  className="hover:shadow-lg transition-all duration-200 card-hover border-slate-200 dark:border-gray-800 bg-white dark:bg-black"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-gray-800">{getTypeIcon(core.type)}</div>
                        <div>
                          <CardTitle className="text-lg text-slate-900 dark:text-white">{core.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1 text-slate-600 dark:text-gray-300">
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusColor(core.status)} ${core.status === "active" ? "status-active" : core.status === "error" ? "status-error" : ""}`}
                            />
                            {core.status} • v{core.version}
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCoreStatus(core.id)}
                        disabled={core.status === "maintenance" || core.status === "error"}
                      >
                        {core.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600 dark:text-gray-300">{core.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-500 dark:text-gray-400">Performance</div>
                        <div className="flex items-center gap-2">
                          <Progress value={core.performance} className="flex-1" />
                          <span className="font-medium text-slate-900 dark:text-white">{core.performance}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500 dark:text-gray-400">Memory</div>
                        <div className="flex items-center gap-2">
                          <Progress value={core.memory} className="flex-1" />
                          <span className="font-medium text-slate-900 dark:text-white">{core.memory}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {core.capabilities.slice(0, 3).map((capability) => (
                        <Badge key={capability} variant="secondary" className="text-xs">
                          {capability}
                        </Badge>
                      ))}
                      {core.capabilities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{core.capabilities.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-gray-800">
                      <div className="text-sm text-slate-500 dark:text-gray-400">
                        {core.tasks} tasks • {core.uptime}
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedCore(core)}>
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-white dark:bg-black border-slate-200 dark:border-gray-800">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-3 text-slate-900 dark:text-white">
                              <div className="p-2 rounded-lg bg-slate-100 dark:bg-gray-800">
                                {getTypeIcon(core.type)}
                              </div>
                              {core.name}
                            </DialogTitle>
                            <DialogDescription className="text-slate-600 dark:text-gray-300">
                              Detailed information about this AI agent core
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2 text-slate-900 dark:text-white">Status</h4>
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${getStatusColor(core.status)}`} />
                                  <span className="capitalize text-slate-700 dark:text-gray-300">{core.status}</span>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2 text-slate-900 dark:text-white">Version</h4>
                                <p className="text-slate-700 dark:text-gray-300">{core.version}</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2 text-slate-900 dark:text-white">Type</h4>
                                <p className="capitalize text-slate-700 dark:text-gray-300">{core.type}</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2 text-slate-900 dark:text-white">Uptime</h4>
                                <p className="text-slate-700 dark:text-gray-300">{core.uptime}</p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2 text-slate-900 dark:text-white">Performance Metrics</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-700 dark:text-gray-300">Performance</span>
                                  <span className="text-slate-900 dark:text-white">{core.performance}%</span>
                                </div>
                                <Progress value={core.performance} />
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-700 dark:text-gray-300">Memory Usage</span>
                                  <span className="text-slate-900 dark:text-white">{core.memory}%</span>
                                </div>
                                <Progress value={core.memory} />
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2 text-slate-900 dark:text-white">Capabilities</h4>
                              <div className="flex flex-wrap gap-2">
                                {core.capabilities.map((capability) => (
                                  <Badge key={capability} variant="secondary">
                                    {capability}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2 text-slate-900 dark:text-white">Description</h4>
                              <p className="text-slate-600 dark:text-gray-300">{core.description}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCores.length === 0 && (
              <div className="text-center py-12">
                <div className="text-slate-400 dark:text-gray-400 mb-2">No cores found</div>
                <p className="text-sm text-slate-500 dark:text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="metrics">
            <CoreMetrics cores={cores} />
          </TabsContent>

          <TabsContent value="tests">
            <TestRunner />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
