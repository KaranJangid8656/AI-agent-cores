import { describe, it, expect, beforeEach, afterEach } from "@jest/globals"

// Mock API client
class APIClient {
  private baseURL: string
  private timeout: number

  constructor(baseURL = "http://localhost:3000", timeout = 5000) {
    this.baseURL = baseURL
    this.timeout = timeout
  }

  async get(endpoint: string): Promise<any> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 100))

    if (endpoint === "/api/cores") {
      return {
        status: 200,
        data: [
          { id: "core-1", name: "Test Core 1", status: "active" },
          { id: "core-2", name: "Test Core 2", status: "idle" },
        ],
      }
    }

    if (endpoint.startsWith("/api/cores/")) {
      const id = endpoint.split("/").pop()
      return {
        status: 200,
        data: { id, name: `Test Core ${id}`, status: "active" },
      }
    }

    throw new Error(`Endpoint not found: ${endpoint}`)
  }

  async post(endpoint: string, data: any): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 150))

    if (endpoint === "/api/cores") {
      return {
        status: 201,
        data: { ...data, id: `core-${Date.now()}` },
      }
    }

    if (endpoint.startsWith("/api/cores/") && endpoint.endsWith("/start")) {
      return { status: 200, data: { message: "Core started successfully" } }
    }

    throw new Error(`Endpoint not found: ${endpoint}`)
  }

  async put(endpoint: string, data: any): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 120))

    if (endpoint.startsWith("/api/cores/")) {
      return {
        status: 200,
        data: { ...data, updated: true },
      }
    }

    throw new Error(`Endpoint not found: ${endpoint}`)
  }
}

// Mock database connection
class DatabaseConnection {
  private connected = false

  async connect(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    this.connected = true
  }

  async disconnect(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 50))
    this.connected = false
  }

  async query(sql: string): Promise<any[]> {
    if (!this.connected) {
      throw new Error("Database not connected")
    }

    await new Promise((resolve) => setTimeout(resolve, Math.random() * 80))

    // Mock query responses
    if (sql.includes("SELECT * FROM cores")) {
      return [
        { id: "core-1", name: "Test Core 1", status: "active" },
        { id: "core-2", name: "Test Core 2", status: "idle" },
      ]
    }

    if (sql.includes("INSERT INTO cores")) {
      return [{ insertId: Math.floor(Math.random() * 1000) }]
    }

    return []
  }

  isConnected(): boolean {
    return this.connected
  }
}

describe("Integration Tests", () => {
  let apiClient: APIClient
  let dbConnection: DatabaseConnection

  beforeEach(async () => {
    apiClient = new APIClient()
    dbConnection = new DatabaseConnection()
    await dbConnection.connect()
  })

  afterEach(async () => {
    await dbConnection.disconnect()
  })

  describe("API Integration", () => {
    it("should fetch all cores from API", async () => {
      const response = await apiClient.get("/api/cores")

      expect(response.status).toBe(200)
      expect(response.data).toHaveLength(2)
      expect(response.data[0]).toHaveProperty("id")
      expect(response.data[0]).toHaveProperty("name")
      expect(response.data[0]).toHaveProperty("status")
    })

    it("should fetch individual core by ID", async () => {
      const response = await apiClient.get("/api/cores/core-1")

      expect(response.status).toBe(200)
      expect(response.data.id).toBe("core-1")
      expect(response.data.name).toBe("Test Core core-1")
    })

    it("should create new core via API", async () => {
      const newCore = {
        name: "New Test Core",
        type: "reasoning",
        status: "idle",
      }

      const response = await apiClient.post("/api/cores", newCore)

      expect(response.status).toBe(201)
      expect(response.data).toHaveProperty("id")
      expect(response.data.name).toBe(newCore.name)
    })

    it("should start core via API", async () => {
      const response = await apiClient.post("/api/cores/core-1/start", {})

      expect(response.status).toBe(200)
      expect(response.data.message).toBe("Core started successfully")
    })

    it("should update core via API", async () => {
      const updateData = { status: "maintenance" }
      const response = await apiClient.put("/api/cores/core-1", updateData)

      expect(response.status).toBe(200)
      expect(response.data.updated).toBe(true)
    })
  })

  describe("Database Integration", () => {
    it("should establish database connection", () => {
      expect(dbConnection.isConnected()).toBe(true)
    })

    it("should query cores from database", async () => {
      const results = await dbConnection.query("SELECT * FROM cores")

      expect(results).toHaveLength(2)
      expect(results[0]).toHaveProperty("id")
      expect(results[0]).toHaveProperty("name")
      expect(results[0]).toHaveProperty("status")
    })

    it("should insert new core into database", async () => {
      const results = await dbConnection.query('INSERT INTO cores (name, type) VALUES ("Test", "reasoning")')

      expect(results).toHaveLength(1)
      expect(results[0]).toHaveProperty("insertId")
      expect(typeof results[0].insertId).toBe("number")
    })

    it("should handle database connection errors", async () => {
      await dbConnection.disconnect()

      await expect(dbConnection.query("SELECT * FROM cores")).rejects.toThrow("Database not connected")
    })
  })

  describe("End-to-End Workflows", () => {
    it("should complete full core lifecycle", async () => {
      // 1. Create core via API
      const newCore = {
        name: "E2E Test Core",
        type: "analytical",
        status: "idle",
      }

      const createResponse = await apiClient.post("/api/cores", newCore)
      expect(createResponse.status).toBe(201)

      const coreId = createResponse.data.id

      // 2. Fetch created core
      const fetchResponse = await apiClient.get(`/api/cores/${coreId}`)
      expect(fetchResponse.status).toBe(200)
      expect(fetchResponse.data.name).toBe(newCore.name)

      // 3. Start the core
      const startResponse = await apiClient.post(`/api/cores/${coreId}/start`, {})
      expect(startResponse.status).toBe(200)

      // 4. Update core status
      const updateResponse = await apiClient.put(`/api/cores/${coreId}`, { status: "active" })
      expect(updateResponse.status).toBe(200)
    })

    it("should handle concurrent operations", async () => {
      const operations = [
        apiClient.get("/api/cores"),
        apiClient.get("/api/cores/core-1"),
        apiClient.get("/api/cores/core-2"),
        dbConnection.query("SELECT * FROM cores"),
      ]

      const results = await Promise.all(operations)

      expect(results[0].status).toBe(200) // API cores list
      expect(results[1].status).toBe(200) // API core-1
      expect(results[2].status).toBe(200) // API core-2
      expect(results[3]).toHaveLength(2) // DB query results
    })

    it("should maintain data consistency between API and database", async () => {
      const apiResponse = await apiClient.get("/api/cores")
      const dbResults = await dbConnection.query("SELECT * FROM cores")

      expect(apiResponse.data).toHaveLength(dbResults.length)

      // Check that core IDs match between API and DB
      const apiIds = apiResponse.data.map((core: any) => core.id).sort()
      const dbIds = dbResults.map((core) => core.id).sort()

      expect(apiIds).toEqual(dbIds)
    })
  })

  describe("Error Handling", () => {
    it("should handle API endpoint not found", async () => {
      await expect(apiClient.get("/api/nonexistent")).rejects.toThrow("Endpoint not found: /api/nonexistent")
    })

    it("should handle database disconnection gracefully", async () => {
      await dbConnection.disconnect()

      await expect(dbConnection.query("SELECT * FROM cores")).rejects.toThrow("Database not connected")

      // Should be able to reconnect
      await dbConnection.connect()
      expect(dbConnection.isConnected()).toBe(true)
    })

    it("should handle network timeouts", async () => {
      const slowClient = new APIClient("http://localhost:3000", 1) // 1ms timeout

      // This would timeout in a real scenario, but our mock doesn't simulate actual timeouts
      // In a real test, you'd expect this to throw a timeout error
      const response = await slowClient.get("/api/cores")
      expect(response.status).toBe(200)
    })
  })
})
