import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerClient()

    console.log("🚀 Fetching dashboard data from server...")

    // Fetch all data in parallel for better performance
    const [
      productsResult,
      ordersResult,
      recentOrdersResult,
      orderItemsResult
    ] = await Promise.all([
      // Total products count
      supabase
        .from("products")
        .select("*", { count: "exact", head: true }),

      // All orders for stats and revenue calculation
      supabase
        .from("orders")
        .select("total_amount, status, created_at, customer_name"),

      // Recent orders (last 5) with full details
      supabase
        .from("orders")
        .select("id, customer_name, total_amount, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5),

      // Order items for top products calculation
      supabase
        .from("order_items")
        .select(`
          quantity,
          price,
          products (id, name)
        `)
    ])

    // Check for errors
    if (productsResult.error) {
      console.error("Products query error:", productsResult.error)
      throw productsResult.error
    }
    if (ordersResult.error) {
      console.error("Orders query error:", ordersResult.error)
      throw ordersResult.error
    }
    if (recentOrdersResult.error) {
      console.error("Recent orders query error:", recentOrdersResult.error)
      throw recentOrdersResult.error
    }
    if (orderItemsResult.error) {
      console.error("Order items query error:", orderItemsResult.error)
      throw orderItemsResult.error
    }

    // Calculate dashboard statistics
    const totalProducts = productsResult.count || 0
    const orders = ordersResult.data || []
    const totalOrders = orders.length

    // Calculate unique customers based on customer_name
    const uniqueCustomers = new Set(
      orders.map(order => order.customer_name).filter(Boolean)
    ).size

    // Calculate total revenue
    const revenue = orders.reduce((sum, order) => {
      return sum + (order.total_amount || 0)
    }, 0)

    const stats = {
      totalProducts,
      totalOrders,
      totalCustomers: uniqueCustomers,
      revenue,
    }

    // Process recent orders
    const recentOrders = recentOrdersResult.data || []

    // Calculate top products from order items
    const productSales: Record<string, { 
      name: string
      sales: number
      revenue: number
      id: string 
    }> = {}

    orderItemsResult.data?.forEach((item: any) => {
      const productId = item.products?.id
      const productName = item.products?.name || "Unknown Product"
      const quantity = item.quantity || 0
      const itemRevenue = (item.quantity || 0) * (item.price || 0)

      if (productId) {
        if (!productSales[productId]) {
          productSales[productId] = {
            id: productId,
            name: productName,
            sales: 0,
            revenue: 0,
          }
        }
        productSales[productId].sales += quantity
        productSales[productId].revenue += itemRevenue
      }
    })

    // Sort products by sales and take top 3
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 3)

    console.log("✅ Dashboard data calculated:", {
      stats,
      recentOrdersCount: recentOrders.length,
      topProductsCount: topProducts.length
    })

    return NextResponse.json({
      stats,
      recentOrders,
      topProducts,
      success: true
    })

  } catch (error) {
    console.error("💥 Dashboard API error:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch dashboard data",
        message: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    )
  }
}