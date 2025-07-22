"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Activity, Cpu, HardDrive, Zap, TrendingUp, TrendingDown } from "lucide-react"

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

interface CoreMetricsProps {
  cores: AgentCore[]
}

export function CoreMetrics({ cores }: CoreMetricsProps) {
  const [systemMetrics, setSystemMetrics] = useState({
    totalCores: cores.length,
    activeCores: cores.filter((c) => c.status === "active").length,
    avgPerformance: Math.round(cores.reduce((acc, c) => acc + c.performance, 0) / cores.length),
    avgMemory: Math.round(cores.reduce((acc, c) => acc + c.memory, 0) / cores.length),
    totalTasks: cores.reduce((acc, c) => acc + c.tasks, 0),
    cpuUsage: 0,
    networkLatency: 0,
    diskUsage: 0,
  })

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics((prev) => ({
        ...prev,
        cpuUsage: Math.max(10, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        networkLatency: Math.max(5, Math.min(100, prev.networkLatency + (Math.random() - 0.5) * 20)),
        diskUsage: Math.max(20, Math.min(85, prev.diskUsage + (Math.random() - 0.5) * 5)),
      }))
    }, 2000)

    // Initialize with random values
    setSystemMetrics((prev) => ({
      ...prev,
      cpuUsage: 45 + Math.random() * 20,
      networkLatency: 15 + Math.random() * 30,
      diskUsage: 35 + Math.random() * 25,
    }))

    return () => clearInterval(interval)
  }, [])

  const getStatusCounts = () => {
    const counts = { active: 0, idle: 0, maintenance: 0, error: 0 }
    cores.forEach((core) => {
      counts[core.status]++
    })
    return counts
  }

  const getTypeCounts = () => {
    const counts = {
      reasoning: 0,
      creative: 0,
      analytical: 0,
      conversational: 0,
      optimization: 0,
      monitoring: 0,
      translation: 0,
      vision: 0,
      audio: 0,
      planning: 0,
      memory: 0,
      coordination: 0,
    }
    cores.forEach((core) => {
      counts[core.type]++
    })
    return counts
  }

  const statusCounts = getStatusCounts()
  const typeCounts = getTypeCounts()

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-black border-slate-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-900 dark:text-white">Total Cores</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.totalCores}</div>
            <p className="text-xs text-muted-foreground">{systemMetrics.activeCores} active</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-black border-slate-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-900 dark:text-white">Avg Performance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.avgPerformance}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +2.1% from last hour
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-black border-slate-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-900 dark:text-white">Memory Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.avgMemory}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              -1.2% from last hour
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-black border-slate-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-900 dark:text-white">Total Tasks</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.totalTasks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Processed today</p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time System Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-black border-slate-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">System Resources</CardTitle>
            <CardDescription>Real-time resource utilization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className="text-sm text-muted-foreground">{Math.round(systemMetrics.cpuUsage)}%</span>
              </div>
              <Progress value={systemMetrics.cpuUsage} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Disk Usage</span>
                <span className="text-sm text-muted-foreground">{Math.round(systemMetrics.diskUsage)}%</span>
              </div>
              <Progress value={systemMetrics.diskUsage} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Network Latency</span>
                <span className="text-sm text-muted-foreground">{Math.round(systemMetrics.networkLatency)}ms</span>
              </div>
              <Progress value={systemMetrics.networkLatency} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-black border-slate-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">Core Status Distribution</CardTitle>
            <CardDescription>Current status of all cores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Active</span>
              </div>
              <Badge variant="secondary">{statusCounts.active}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm">Idle</span>
              </div>
              <Badge variant="secondary">{statusCounts.idle}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm">Maintenance</span>
              </div>
              <Badge variant="secondary">{statusCounts.maintenance}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm">Error</span>
              </div>
              <Badge variant="secondary">{statusCounts.error}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-black border-slate-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">Core Type Distribution</CardTitle>
            <CardDescription>Breakdown by core functionality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-64 overflow-y-auto">
            <div className="flex justify-between items-center">
              <span className="text-sm">Reasoning</span>
              <Badge variant="outline">{typeCounts.reasoning}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Creative</span>
              <Badge variant="outline">{typeCounts.creative}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Analytical</span>
              <Badge variant="outline">{typeCounts.analytical}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Conversational</span>
              <Badge variant="outline">{typeCounts.conversational}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Optimization</span>
              <Badge variant="outline">{typeCounts.optimization}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Monitoring</span>
              <Badge variant="outline">{typeCounts.monitoring}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Translation</span>
              <Badge variant="outline">{typeCounts.translation}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Vision</span>
              <Badge variant="outline">{typeCounts.vision}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Audio</span>
              <Badge variant="outline">{typeCounts.audio}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Planning</span>
              <Badge variant="outline">{typeCounts.planning}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Memory</span>
              <Badge variant="outline">{typeCounts.memory}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Coordination</span>
              <Badge variant="outline">{typeCounts.coordination}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <Card className="bg-white dark:bg-black border-slate-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Performance Overview</CardTitle>
          <CardDescription>Individual core performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cores.map((core) => (
              <div
                key={core.id}
                className="flex items-center justify-between p-3 border rounded-lg border-slate-200 dark:border-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      core.status === "active"
                        ? "bg-green-500"
                        : core.status === "idle"
                          ? "bg-yellow-500"
                          : core.status === "maintenance"
                            ? "bg-blue-500"
                            : "bg-red-500"
                    }`}
                  />
                  <div>
                    <div className="font-medium">{core.name}</div>
                    <div className="text-sm text-muted-foreground">{core.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{core.performance}%</div>
                    <div className="text-xs text-muted-foreground">Performance</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{core.memory}%</div>
                    <div className="text-xs text-muted-foreground">Memory</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{core.tasks}</div>
                    <div className="text-xs text-muted-foreground">Tasks</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
