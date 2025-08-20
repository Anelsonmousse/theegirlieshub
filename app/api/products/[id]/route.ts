import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  if (!id) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
  }

  const supabase = createServerClient()

  try {
    // Get the specific product
    const { data: product, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching product:", error)
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Get related products (same category, excluding current product)
    const { data: relatedProducts } = await supabase
      .from("products")
      .select("*")
      .eq("category", product.category)
      .neq("id", id)
      .limit(4)

    return NextResponse.json({
      product,
      relatedProducts: relatedProducts || [],
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
