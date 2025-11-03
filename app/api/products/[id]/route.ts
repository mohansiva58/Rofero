import { MongoClient, ObjectId } from "mongodb"

const uri =
  process.env.MONGODB_URI || "mongodb+srv://rarerabbit:r@rer@bbit@rarerabbit.uyfrgct.mongodb.net/?appName=rarerabbit"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const client = new MongoClient(uri)
  const { id } = await params

  try {
    await client.connect()
    const db = client.db("rarerabbit")

    const product = await db.collection("products").findOne({
      _id: new ObjectId(id),
    })

    if (!product) {
      return Response.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return Response.json({ success: true, data: product })
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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const client = new MongoClient(uri)
  const { id } = await params

  try {
    const body = await request.json()
    await client.connect()
    const db = client.db("rarerabbit")

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return Response.json({ success: false, error: "Product not found" }, { status: 404 })
    }

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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const client = new MongoClient(uri)
  const { id } = await params

  try {
    await client.connect()
    const db = client.db("rarerabbit")

    const result = await db.collection("products").deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return Response.json({ success: false, error: "Product not found" }, { status: 404 })
    }

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
