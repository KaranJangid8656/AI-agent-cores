import { describe, it, expect, beforeEach } from "@jest/globals"

// Mock agent core functionality
interface AgentCore {
  id: string
  name: string
  type: "reasoning" | "creative" | "analytical" | "conversational"
  status: "active" | "idle" | "maintenance" | "error"
  performance: number
  memory: number
}

class AgentCoreManager {
  private cores: AgentCore[] = []

  addCore(core: AgentCore): void {
    this.cores.push(core)
  }

  getCoreById(id: string): AgentCore | undefined {
    return this.cores.find((core) => core.id === id)
  }

  getActivecores(): AgentCore[] {
    return this.cores.filter((core) => core.status === "active")
  }

  updateCoreStatus(id: string, status: AgentCore["status"]): boolean {
    const core = this.getCoreById(id)
    if (core) {
      core.status = status
      return true
    }
    return false
  }

  getAveragePerformance(): number {
    if (this.cores.length === 0) return 0
    const total = this.cores.reduce((sum, core) => sum + core.performance, 0)
    return Math.round(total / this.cores.length)
  }

  getCoresByType(type: AgentCore["type"]): AgentCore[] {
    return this.cores.filter((core) => core.type === type)
  }
}

describe("AgentCoreManager", () => {
  let manager: AgentCoreManager

  beforeEach(() => {
    manager = new AgentCoreManager()
  })

  describe("Core Management", () => {
    it("should add a new core successfully", () => {
      const core: AgentCore = {
        id: "test-001",
        name: "Test Core",
        type: "reasoning",
        status: "active",
        performance: 85,
        memory: 45,
      }

      manager.addCore(core)
      const retrievedCore = manager.getCoreById("test-001")

      expect(retrievedCore).toBeDefined()
      expect(retrievedCore?.name).toBe("Test Core")
      expect(retrievedCore?.type).toBe("reasoning")
    })

    it("should return undefined for non-existent core", () => {
      const core = manager.getCoreById("non-existent")
      expect(core).toBeUndefined()
    })

    it("should update core status successfully", () => {
      const core: AgentCore = {
        id: "test-002",
        name: "Test Core 2",
        type: "creative",
        status: "active",
        performance: 90,
        memory: 30,
      }

      manager.addCore(core)
      const updated = manager.updateCoreStatus("test-002", "idle")

      expect(updated).toBe(true)
      expect(manager.getCoreById("test-002")?.status).toBe("idle")
    })

    it("should fail to update non-existent core status", () => {
      const updated = manager.updateCoreStatus("non-existent", "idle")
      expect(updated).toBe(false)
    })
  })

  describe("Core Filtering", () => {
    beforeEach(() => {
      const cores: AgentCore[] = [
        {
          id: "core-1",
          name: "Reasoning Core 1",
          type: "reasoning",
          status: "active",
          performance: 85,
          memory: 45,
        },
        {
          id: "core-2",
          name: "Creative Core 1",
          type: "creative",
          status: "idle",
          performance: 78,
          memory: 60,
        },
        {
          id: "core-3",
          name: "Reasoning Core 2",
          type: "reasoning",
          status: "active",
          performance: 92,
          memory: 35,
        },
      ]

      cores.forEach((core) => manager.addCore(core))
    })

    it("should return only active cores", () => {
      const activeCores = manager.getActiveCore()
      expect(activeCores).toHaveLength(2)
      expect(activeCores.every((core) => core.status === "active")).toBe(true)
    })

    it("should return cores by type", () => {
      const reasoningCores = manager.getCoresByType("reasoning")
      expect(reasoningCores).toHaveLength(2)
      expect(reasoningCores.every((core) => core.type === "reasoning")).toBe(true)
    })

    it("should calculate average performance correctly", () => {
      const avgPerformance = manager.getAveragePerformance()
      expect(avgPerformance).toBe(85) // (85 + 78 + 92) / 3 = 85
    })
  })

  describe("Edge Cases", () => {
    it("should handle empty core list for average performance", () => {
      const avgPerformance = manager.getAveragePerformance()
      expect(avgPerformance).toBe(0)
    })

    it("should return empty array for non-existent type", () => {
      const cores = manager.getCoresByType("analytical")
      expect(cores).toHaveLength(0)
    })
  })
})
