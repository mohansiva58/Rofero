import { MongoClient } from "mongodb"

const uri =
  process.env.MONGODB_URI || "mongodb+srv://rarerabbit:r@rer@bbit@rarerabbit.uyfrgct.mongodb.net/?appName=rarerabbit"

export async function GET() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db("rarerabbit")
    const products = await db.collection("products").find({}).toArray()

    return Response.json({ success: true, data: products })
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

export async function POST(request: Request) {
  const client = new MongoClient(uri)

  try {
    const body = await request.json()
    await client.connect()
    const db = client.db("rarerabbit")

    const result = await db.collection("products").insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

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
