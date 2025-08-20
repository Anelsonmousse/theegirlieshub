"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Package, Eye } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { createClient } from "@supabase/supabase-js"

interface Order {
  id: string
  customer_name: string
  customer_email: string
  total_amount: number
  status: string
  created_at: string
  items: Array<{
    product_name: string
    quantity: number
    price: number
  }>
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      console.log("🚀 Starting to fetch orders...")
      console.log("Environment variables check:")
      console.log("- SUPABASE_URL exists:", !!process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log("- SUPABASE_ANON_KEY exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      console.log("- SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)

      // Create client-side Supabase client
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      console.log("✅ Supabase client created successfully")

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            quantity,
            price,
            products (name)
          )
        `)
        .order("created_at", { ascending: false })

      console.log("📡 Raw Supabase response:")
      console.log("- Data:", data)
      console.log("- Error:", error)
      console.log("- Data type:", typeof data)
      console.log("- Data length:", data?.length)

      if (error) {
        console.error("❌ Supabase error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      if (data) {
        console.log("🔍 Examining first order (if exists):")
        if (data[0]) {
          console.log("- Order structure:", Object.keys(data[0]))
          console.log("- First order:", data[0])
          console.log("- Order items:", data[0].order_items)
          if (data[0].order_items?.[0]) {
            console.log("- First order item:", data[0].order_items[0])
            console.log("- Product in first item:", data[0].order_items[0].products)
          }
        }
      }

      const formattedOrders =
        data?.map((order: any) => {
          console.log(`🔄 Processing order ${order.id}:`)
          console.log("- Original order:", order)
          console.log("- Order items count:", order.order_items?.length || 0)
          
          const items = order.order_items?.map((item: any) => {
            console.log("- Processing item:", item)
            console.log("- Product data:", item.products)
            return {
              product_name: item.products?.name || "Unknown Product",
              quantity: item.quantity,
              price: item.price,
            }
          }) || []

          console.log("- Formatted items:", items)

          return {
            ...order,
            items
          }
        }) || []

      console.log("✅ Final formatted orders:")
      console.log("- Count:", formattedOrders.length)
      console.log("- Orders:", formattedOrders)

      setOrders(formattedOrders)
    } catch (error) {
      console.error("💥 Error fetching orders:", error)
      console.error("Error type:", typeof error)
      console.error("Error message:", error instanceof Error ? error.message : 'Unknown error')
      console.error("Full error object:", error)
    } finally {
      console.log("🏁 Fetch orders completed, setting loading to false")
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Orders Management
          </h1>
          <p className="text-muted-foreground">Manage customer orders and track fulfillment</p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {filteredOrders.length} Orders
        </Badge>
      </div>

      <Card className="futuristic-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders by customer name, email, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 futuristic-border"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md futuristic-border bg-background"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No orders found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Orders will appear here once customers start purchasing"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">#{order.id.slice(-8)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer_name}</div>
                          <div className="text-sm text-muted-foreground">{order.customer_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {order.items.slice(0, 2).map((item, index) => (
                            <div key={index}>
                              {item.quantity}x {item.product_name}
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-muted-foreground">+{order.items.length - 2} more items</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(order.total_amount)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}