import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { 
      name, 
      description, 
      price, 
      image_url, 
      image_urls,
      category, 
      stock_quantity, 
      is_featured,
      sizes,
      colors,
      designs
    } = body

    // Validate required fields
    if (!name || !price || !category) {
      return NextResponse.json({ error: "Name, price, and category are required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Prepare the update data with all new fields
    const updateData = {
      name,
      description,
      price: Number.parseFloat(price),
      image_url,
      image_urls: image_urls || [],
      category,
      stock_quantity: Number.parseInt(stock_quantity) || 0,
      is_featured: Boolean(is_featured),
      sizes: sizes || [],
      colors: colors || [],
      designs: designs || [],
      updated_at: new Date().toISOString(),
    }

    console.log('Updating product with ID:', id) // Debug log
    console.log('Update data:', updateData) // Debug log

    const { data: product, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating product:", error)
      return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const supabase = createServerClient()

    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("Error deleting product:", error)
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}