"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart, Users, TrendingUp, Heart, Star } from "lucide-react"

export default function AdminDashboard() {
  // Mock data - in a real app, this would come from your API
  const stats = {
    totalProducts: 10,
    totalOrders: 47,
    totalCustomers: 156,
    revenue: 1138799.6, // Updated to Nigerian Naira equivalent
  }

  const recentOrders = [
    { id: "ORD001", customer: "Emma S.", total: 35996.0, status: "completed" }, // Updated to Naira
    { id: "ORD002", customer: "Sophie M.", total: 18200.0, status: "pending" }, // Updated to Naira
    { id: "ORD003", customer: "Chloe R.", total: 51196.0, status: "shipped" }, // Updated to Naira
  ]

  const topProducts = [
    { name: "Pink Sparkle Lip Gloss", sales: 23, revenue: 119908.0 }, // Updated to Naira
    { name: "Rose Gold Phone Case", sales: 18, revenue: 179928.0 }, // Updated to Naira
    { name: "Unicorn Hair Clips Set", sales: 15, revenue: 53940.0 }, // Updated to Naira
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening at Thee Girlies Hub.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="futuristic-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active products in catalog</p>
          </CardContent>
        </Card>

        <Card className="futuristic-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Orders this month</p>
          </CardContent>
        </Card>

        <Card className="futuristic-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Registered customers</p>
          </CardContent>
        </Card>

        <Card className="futuristic-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₦{stats.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This month's revenue</p>
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
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.customer}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-semibold text-primary">₦{order.total.toFixed(2)}</p>
                  <Badge
                    className={
                      order.status === "completed"
                        ? "bg-green-500 text-white"
                        : order.status === "shipped"
                          ? "bg-blue-500 text-white"
                          : "bg-yellow-500 text-white"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
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
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
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
                  <p className="font-semibold text-primary">₦{product.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
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
