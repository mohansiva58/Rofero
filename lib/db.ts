import { MongoClient } from "mongodb"

const uri =
  process.env.MONGODB_URI || "mongodb+srv://rarerabbit:r@rer@bbit@rarerabbit.uyfrgct.mongodb.net/?appName=rarerabbit"
const client = new MongoClient(uri)

export async function connectDB() {
  try {
    await client.connect()
    console.log("[v0] MongoDB connected successfully")
    return client.db("rarerabbit")
  } catch (error) {
    console.error("[v0] MongoDB connection error:", error)
    throw error
  }
}

export async function closeDB() {
  try {
    await client.close()
    console.log("[v0] MongoDB disconnected")
  } catch (error) {
    console.error("[v0] Error closing MongoDB:", error)
  }
}

export default client
