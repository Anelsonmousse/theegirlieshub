"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Package, Eye, X, User, Mail, MapPin, Calendar, ShoppingCart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { createClient } from "@supabase/supabase-js"

interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_address: string
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
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
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Orders Management
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage customer orders and track fulfillment</p>
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
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
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
                      <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewOrder(order)}>
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
                          <Button variant="ghost" size="sm" onClick={(e) => {
                            e.stopPropagation()
                            handleViewOrder(order)
                          }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleViewOrder(order)}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm font-medium">#{order.id.slice(-8)}</span>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                        
                        <div>
                          <div className="font-medium">{order.customer_name}</div>
                          <div className="text-sm text-muted-foreground">{order.customer_email}</div>
                        </div>

                        <div className="text-sm">
                          <div className="font-medium text-primary">{formatCurrency(order.total_amount)}</div>
                          <div className="text-muted-foreground">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{new Date(order.created_at).toLocaleDateString()}</span>
                          <Eye className="h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Order Details</span>
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" />
                        <span className="font-medium">Order Information</span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-muted-foreground">Order ID</span>
                          <div className="font-mono">#{selectedOrder.id}</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Status</span>
                          <div>
                            <Badge className={getStatusColor(selectedOrder.status)}>
                              {selectedOrder.status}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Order Date</span>
                          <div>{new Date(selectedOrder.created_at).toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Total Amount</span>
                          <div className="text-lg font-bold text-primary">
                            {formatCurrency(selectedOrder.total_amount)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <span className="font-medium">Customer Information</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span>{selectedOrder.customer_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{selectedOrder.customer_email}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground mt-1" />
                          <span className="text-sm">{selectedOrder.customer_address}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-primary" />
                      <span className="font-medium">Order Items ({selectedOrder.items.length})</span>
                    </div>
                    
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{item.product_name}</div>
                            <div className="text-sm text-muted-foreground">
                              Quantity: {item.quantity} × {formatCurrency(item.price)}
                            </div>
                          </div>
                          <div className="font-medium">
                            {formatCurrency(item.quantity * item.price)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">{formatCurrency(selectedOrder.total_amount)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}