import { MongoClient } from "mongodb"

const uri =
  process.env.MONGODB_URI || "mongodb+srv://rarerabbit:r@rer@bbit@rarerabbit.uyfrgct.mongodb.net/?appName=rarerabbit"

export async function GET() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db("rarerabbit")
    const orders = await db.collection("orders").find({}).toArray()

    console.log("[v0] Orders fetched from MongoDB")
    return Response.json({ success: true, data: orders })
  } catch (error) {
    console.error("[v0] MongoDB error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        data: [], // Return empty array as fallback
      },
      { status: 500 },
    )
  } finally {
    await client.close()
  }
}

export async function POST(request: Request) {
  const client = new MongoClient(uri)

  try {
    const body = await request.json()
    await client.connect()
    const db = client.db("rarerabbit")

    const result = await db.collection("orders").insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log("[v0] Order created:", result.insertedId)
    return Response.json({ success: true, data: result })
  } catch (error) {
    console.error("[v0] MongoDB error:", error)
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  } finally {
    await client.close()
  }
}
