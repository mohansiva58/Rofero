import { MongoClient } from "mongodb"
import { NextRequest } from "next/server"

const uri = process.env.MONGODB_URI || "mongodb+srv://rarerabbit:r@rer@bbit@rarerabbit.uyfrgct.mongodb.net/thehouseofrare?retryWrites=true&w=majority&appName=rarerabbit"

export async function GET(request: NextRequest) {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db("thehouseofrare")
    
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const limit = searchParams.get("limit")
    
    // Build query filter
    const query: any = {}
    if (category) {
      query.category = category.toLowerCase()
    }
    
    // Fetch products with optional filtering
    let productsQuery = db.collection("products").find(query)
    
    // Apply limit if specified
    if (limit) {
      productsQuery = productsQuery.limit(parseInt(limit))
    }
    
    const products = await productsQuery.toArray()

    return Response.json({ success: true, products: products })
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
    const db = client.db("thehouseofrare")

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
