"use client"

import { useState } from "react"
import { Play, Square, CheckCircle, XCircle, Clock, AlertTriangle, Activity, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface TestCase {
  id: string
  name: string
  description: string
  category: "unit" | "integration" | "performance" | "security"
  status: "pending" | "running" | "passed" | "failed" | "skipped"
  duration: number
  error?: string
  logs: string[]
}

interface TestSuite {
  id: string
  name: string
  description: string
  tests: TestCase[]
  status: "idle" | "running" | "completed"
  progress: number
}

const mockTestSuites: TestSuite[] = [
  {
    id: "core-functionality",
    name: "Core Functionality Tests",
    description: "Basic functionality and API tests for agent cores",
    status: "idle",
    progress: 0,
    tests: [
      {
        id: "test-001",
        name: "Core Initialization",
        description: "Test agent core initialization and startup",
        category: "unit",
        status: "pending",
        duration: 0,
        logs: [],
      },
      {
        id: "test-002",
        name: "Memory Management",
        description: "Test memory allocation and cleanup",
        category: "unit",
        status: "pending",
        duration: 0,
        logs: [],
      },
      {
        id: "test-003",
        name: "Task Processing",
        description: "Test basic task processing capabilities",
        category: "integration",
        status: "pending",
        duration: 0,
        logs: [],
      },
      {
        id: "test-004",
        name: "Error Handling",
        description: "Test error handling and recovery mechanisms",
        category: "unit",
        status: "pending",
        duration: 0,
        logs: [],
      },
    ],
  },
  {
    id: "performance-tests",
    name: "Performance Tests",
    description: "Load testing and performance benchmarks",
    status: "idle",
    progress: 0,
    tests: [
      {
        id: "perf-001",
        name: "Load Test - 1000 concurrent tasks",
        description: "Test system under high concurrent load",
        category: "performance",
        status: "pending",
        duration: 0,
        logs: [],
      },
      {
        id: "perf-002",
        name: "Memory Stress Test",
        description: "Test memory usage under stress conditions",
        category: "performance",
        status: "pending",
        duration: 0,
        logs: [],
      },
      {
        id: "perf-003",
        name: "Response Time Benchmark",
        description: "Measure average response times",
        category: "performance",
        status: "pending",
        duration: 0,
        logs: [],
      },
    ],
  },
  {
    id: "security-tests",
    name: "Security Tests",
    description: "Security vulnerability and penetration tests",
    status: "idle",
    progress: 0,
    tests: [
      {
        id: "sec-001",
        name: "Authentication Test",
        description: "Test authentication mechanisms",
        category: "security",
        status: "pending",
        duration: 0,
        logs: [],
      },
      {
        id: "sec-002",
        name: "Input Validation",
        description: "Test input sanitization and validation",
        category: "security",
        status: "pending",
        duration: 0,
        logs: [],
      },
      {
        id: "sec-003",
        name: "Access Control",
        description: "Test role-based access control",
        category: "security",
        status: "pending",
        duration: 0,
        logs: [],
      },
    ],
  },
  {
    id: "stress-tests",
    name: "Stress Testing Suite",
    description: "High-load stress tests and endurance testing",
    status: "idle",
    progress: 0,
    tests: [
      {
        id: "stress-001",
        name: "Memory Leak Detection",
        description: "Test for memory leaks under extended operation",
        category: "performance",
        status: "pending",
        duration: 0,
        logs: [],
      },
      {
        id: "stress-002",
        name: "Concurrent User Load",
        description: "Test system with 10,000 concurrent users",
        category: "performance",
        status: "pending",
        duration: 0,
        logs: [],
      },
      {
        id: "stress-003",
        name: "Database Connection Pool",
        description: "Test database connection limits",
        category: "performance",
        status: "pending",
        duration: 0,
        logs: [],
      },
    ],
  },
  {
    id: "ai-model-tests",
    name: "AI Model Validation",
    description: "AI model accuracy and performance validation",
    status: "idle",
    progress: 0,
    tests: [
      {
        id: "ai-001",
        name: "Model Accuracy Test",
        description: "Validate AI model prediction accuracy",
        category: "unit",
        status: "pending",
        duration: 0,
        logs: [],
      },
      {
        id: "ai-002",
        name: "Inference Speed Test",
        description: "Measure model inference performance",
        category: "performance",
        status: "pending",
        duration: 0,
        logs: [],
      },
      {
        id: "ai-003",
        name: "Model Bias Detection",
        description: "Test for algorithmic bias in predictions",
        category: "security",
        status: "pending",
        duration: 0,
        logs: [],
      },
    ],
  },
  {
    id: "api-tests",
    name: "API Integration Tests",
    description: "Comprehensive API endpoint testing",
    status: "idle",
    progress: 0,
    tests: [
      {
        id: "api-001",
        name: "REST API Endpoints",
        description: "Test all REST API endpoints",
        category: "integration",
        status: "pending",
        duration: 0,
        logs: [],
      },
      {
        id: "api-002",
        name: "GraphQL Queries",
        description: "Test GraphQL query performance",
        category: "integration",
        status: "pending",
        duration: 0,
        logs: [],
      },
      {
        id: "api-003",
        name: "WebSocket Connections",
        description: "Test real-time WebSocket connections",
        category: "integration",
        status: "pending",
        duration: 0,
        logs: [],
      },
      {
        id: "api-004",
        name: "Rate Limiting",
        description: "Test API rate limiting functionality",
        category: "security",
        status: "pending",
        duration: 0,
        logs: [],
      },
    ],
  },
]

export function TestRunner() {
  const [testSuites, setTestSuites] = useState<TestSuite[]>(mockTestSuites)
  const [selectedSuite, setSelectedSuite] = useState<string>("")
  const [isRunning, setIsRunning] = useState(false)

  const runTestSuite = async (suiteId: string) => {
    setIsRunning(true)
    setSelectedSuite(suiteId)

    setTestSuites((prev) =>
      prev.map((suite) => (suite.id === suiteId ? { ...suite, status: "running", progress: 0 } : suite)),
    )

    const suite = testSuites.find((s) => s.id === suiteId)
    if (!suite) return

    for (let i = 0; i < suite.tests.length; i++) {
      const test = suite.tests[i]

      // Update test status to running
      setTestSuites((prev) =>
        prev.map((suite) =>
          suite.id === suiteId
            ? {
                ...suite,
                tests: suite.tests.map((t) =>
                  t.id === test.id ? { ...t, status: "running", logs: ["Starting test..."] } : t,
                ),
                progress: (i / suite.tests.length) * 100,
              }
            : suite,
        ),
      )

      // Simulate test execution
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

      // Simulate test result
      const passed = Math.random() > 0.2 // 80% pass rate
      const duration = Math.round(500 + Math.random() * 2000)

      setTestSuites((prev) =>
        prev.map((suite) =>
          suite.id === suiteId
            ? {
                ...suite,
                tests: suite.tests.map((t) =>
                  t.id === test.id
                    ? {
                        ...t,
                        status: passed ? "passed" : "failed",
                        duration,
                        error: passed ? undefined : "Test assertion failed: Expected value to be truthy",
                        logs: [
                          "Starting test...",
                          "Initializing test environment...",
                          "Running test assertions...",
                          passed ? "Test completed successfully" : "Test failed with assertion error",
                          `Test duration: ${duration}ms`,
                        ],
                      }
                    : t,
                ),
                progress: ((i + 1) / suite.tests.length) * 100,
              }
            : suite,
        ),
      )
    }

    // Mark suite as completed
    setTestSuites((prev) =>
      prev.map((suite) => (suite.id === suiteId ? { ...suite, status: "completed", progress: 100 } : suite)),
    )

    setIsRunning(false)
  }

  const runAllTests = async () => {
    for (const suite of testSuites) {
      await runTestSuite(suite.id)
    }
  }

  const getTestStats = (suite: TestSuite) => {
    const passed = suite.tests.filter((t) => t.status === "passed").length
    const failed = suite.tests.filter((t) => t.status === "failed").length
    const total = suite.tests.length
    return { passed, failed, total }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "running":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
      case "skipped":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "unit":
        return "bg-blue-100 text-blue-800 dark:bg-black dark:text-blue-300"
      case "integration":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "performance":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "security":
        return "bg-red-200 text-red-700 dark:bg-red-700 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-black dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Test Runner Controls */}
      <Card className="bg-white dark:bg-black border-slate-200 dark:border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Advanced Test Suite Runner
              </CardTitle>
              <CardDescription>Comprehensive testing framework for AI agent cores</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={runAllTests} disabled={isRunning} className="flex items-center gap-2" variant="default">
                {isRunning ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isRunning ? "Stop All Tests" : "Run All Test Suites"}
              </Button>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Settings className="h-4 w-4" />
                Configure
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-slate-50 dark:bg-black rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {testSuites.reduce((acc, suite) => acc + suite.tests.filter((t) => t.status === "passed").length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Tests Passed</div>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-black rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {testSuites.reduce((acc, suite) => acc + suite.tests.filter((t) => t.status === "failed").length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Tests Failed</div>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-black rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {testSuites.reduce((acc, suite) => acc + suite.tests.filter((t) => t.status === "running").length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Running</div>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-black rounded-lg">
              <div className="text-2xl font-bold text-slate-600 dark:text-slate-300">
                {testSuites.reduce((acc, suite) => acc + suite.tests.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Tests</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Suites Grid - Enhanced */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {testSuites.map((suite) => {
          const stats = getTestStats(suite)
          return (
            <Card key={suite.id} className="relative bg-white dark:bg-black border-slate-200 dark:border-gray-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {suite.status === "running" ? (
                        <Clock className="h-4 w-4 animate-spin text-blue-500" />
                      ) : suite.status === "completed" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Play className="h-4 w-4 text-gray-400" />
                      )}
                      {suite.name}
                    </CardTitle>
                    <CardDescription className="mt-1">{suite.description}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runTestSuite(suite.id)}
                      disabled={isRunning}
                      className="flex items-center gap-1"
                    >
                      {suite.status === "running" ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      {suite.status === "running" ? "Stop" : "Run"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {suite.status === "running" && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{Math.round(suite.progress)}%</span>
                    </div>
                    <Progress value={suite.progress} className="h-2" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>Total Tests</span>
                    <Badge variant="outline">{stats.total}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span className="text-muted-foreground">
                      {suite.tests.reduce((acc, test) => acc + test.duration, 0)}ms
                    </span>
                  </div>
                </div>

                {suite.status === "completed" && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-600">Passed</span>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      >
                        {stats.passed}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-600">Failed</span>
                      <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                        {stats.failed}
                      </Badge>
                    </div>
                  </div>
                )}

                <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin">
                  {suite.tests.slice(0, 4).map((test) => (
                    <div
                      key={test.id}
                      className="flex items-center justify-between text-sm p-2 bg-slate-50 dark:bg-black rounded"
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(test.status)}
                        <span className="truncate flex-1">{test.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(test.category)}>
                          {test.category}
                        </Badge>
                        {test.duration > 0 && <span className="text-xs text-muted-foreground">{test.duration}ms</span>}
                      </div>
                    </div>
                  ))}
                  {suite.tests.length > 4 && (
                    <div className="text-xs text-muted-foreground text-center py-1">
                      +{suite.tests.length - 4} more tests
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
