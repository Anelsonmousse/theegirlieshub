import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { getShippingFee } from "../shipping-options/route"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      customer_name, 
      customer_email, 
      customer_phone, 
      customer_address, 
      shipping_location,
      shipping_fee,
      total_amount, 
      items 
    } = body

    // Validate required fields
    if (!customer_name || !customer_email || !customer_phone || !customer_address || !shipping_location || !total_amount || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Security: Validate shipping fee on backend
    const validShippingFee = getShippingFee(shipping_location)
    if (shipping_fee !== validShippingFee) {
      return NextResponse.json({ 
        error: "Invalid shipping fee. Please refresh and try again." 
      }, { status: 400 })
    }

    const supabase = createServerClient()

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        shipping_location,
        shipping_fee: validShippingFee, // Use validated fee
        total_amount,
        status: "pending",
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Create order items with selected variants
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      selected_variants: item.selected_variants || {}, // Add selected variants
    }))

    console.log('Creating order items with variants:', orderItems) // Debug log

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      // Try to delete the order if items creation failed
      await supabase.from("orders").delete().eq("id", order.id)
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 })
    }

    // Update product stock quantities
    for (const item of items) {
      const { error: stockError } = await supabase.rpc("update_product_stock", {
        product_id: item.product_id,
        quantity_sold: item.quantity,
      })

      if (stockError) {
        console.error("Error updating stock:", stockError)
        // Continue with other items even if one fails
      }
    }

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}