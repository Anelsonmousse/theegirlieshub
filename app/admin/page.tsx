"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart, Users, TrendingUp, Heart, Star, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalCustomers: number
  revenue: number
}

interface RecentOrder {
  id: string
  customer_name: string
  total_amount: number
  status: string
  created_at: string
}

interface TopProduct {
  name: string
  sales: number
  revenue: number
  id: string
}

interface DashboardData {
  stats: DashboardStats
  recentOrders: RecentOrder[]
  topProducts: TopProduct[]
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalProducts: 0,
      totalOrders: 0,
      totalCustomers: 0,
      revenue: 0,
    },
    recentOrders: [],
    topProducts: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🚀 Fetching dashboard data from API...")

      const response = await fetch('/api/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add cache control for fresh data
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      console.log("📊 Dashboard API response:", result)

      if (result.error) {
        throw new Error(result.message || result.error)
      }

      setData({
        stats: result.stats,
        recentOrders: result.recentOrders,
        topProducts: result.topProducts,
      })

      console.log("✅ Dashboard data updated successfully")

    } catch (error) {
      console.error("💥 Error fetching dashboard data:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return "bg-green-500 text-white"
      case "shipped":
      case "processing":
        return "bg-blue-500 text-white"
      case "pending":
        return "bg-yellow-500 text-white"
      case "cancelled":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4 text-lg font-semibold">Error loading dashboard</div>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button 
            onClick={fetchDashboardData}
            className="bg-primary hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening at Thee Girlies Hub.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchDashboardData}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="futuristic-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active products in catalog</p>
          </CardContent>
        </Card>

        <Card className="futuristic-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>

        <Card className="futuristic-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Unique customers</p>
          </CardContent>
        </Card>

        <Card className="futuristic-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(data.stats.revenue)}</div>
            <p className="text-xs text-muted-foreground">Total revenue</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="futuristic-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Recent Orders</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.recentOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No orders yet</p>
              </div>
            ) : (
              data.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-1">
                    <p className="font-medium">#{order.id.slice(-8)}</p>
                    <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-semibold text-primary">{formatCurrency(order.total_amount)}</p>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="futuristic-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Top Products</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.topProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No sales data yet</p>
              </div>
            ) : (
              data.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Welcome Message */}
      <Card className="text-center p-8 girly-gradient">
        <div className="space-y-4">
          <Heart className="h-12 w-12 mx-auto text-primary" fill="currentColor" />
          <h3 className="text-2xl font-bold text-primary">Welcome to Your Admin Panel!</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Manage your girly ecommerce empire from here! Add new products, track orders, and keep your customers happy
            with the cutest items. Remember, every product should sparkle with girly magic! ✨
          </p>
        </div>
      </Card>
    </div>
  )
}