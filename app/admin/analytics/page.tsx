"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, DollarSign, Package, Users, ShoppingCart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { createServerClient } from "@/lib/supabase/server"

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  revenueGrowth: number
  orderGrowth: number
  topProducts: Array<{
    name: string
    sales: number
    revenue: number
  }>
  salesByMonth: Array<{
    month: string
    revenue: number
    orders: number
  }>
  categoryBreakdown: Array<{
    name: string
    value: number
    color: string
  }>
}

const COLORS = ["#FF69B4", "#FFB6C1", "#FFC0CB", "#DDA0DD", "#DA70D6"]

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
    topProducts: [],
    salesByMonth: [],
    categoryBreakdown: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const supabase = createServerClient()

      // Fetch basic metrics
      const [ordersResult, productsResult] = await Promise.all([
        supabase.from("orders").select("total_amount, created_at, customer_email"),
        supabase.from("products").select("id, name, category"),
      ])

      const orders = ordersResult.data || []
      const products = productsResult.data || []

      // Calculate metrics
      const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0)
      const totalOrders = orders.length
      const totalProducts = products.length
      const uniqueCustomers = new Set(orders.map((order) => order.customer_email)).size

      // Mock growth data (in real app, compare with previous period)
      const revenueGrowth = 12.5
      const orderGrowth = 8.3

      // Generate mock data for charts
      const salesByMonth = [
        { month: "Jan", revenue: 45000, orders: 23 },
        { month: "Feb", revenue: 52000, orders: 28 },
        { month: "Mar", revenue: 48000, orders: 25 },
        { month: "Apr", revenue: 61000, orders: 32 },
        { month: "May", revenue: 55000, orders: 29 },
        { month: "Jun", revenue: 67000, orders: 35 },
      ]

      const topProducts = [
        { name: "Pink Phone Case", sales: 45, revenue: 67500 },
        { name: "Unicorn Plushie", sales: 38, revenue: 57000 },
        { name: "Holographic Makeup Bag", sales: 32, revenue: 48000 },
        { name: "Rose Gold Earrings", sales: 28, revenue: 42000 },
        { name: "Glitter Nail Polish Set", sales: 25, revenue: 37500 },
      ]

      const categoryBreakdown = [
        { name: "Beauty", value: 35, color: COLORS[0] },
        { name: "Accessories", value: 40, color: COLORS[1] },
        { name: "Fashion", value: 25, color: COLORS[2] },
      ]

      setAnalytics({
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers: uniqueCustomers,
        revenueGrowth,
        orderGrowth,
        topProducts,
        salesByMonth,
        categoryBreakdown,
      })
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">Track your business performance and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="futuristic-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{analytics.revenueGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="futuristic-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalOrders}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{analytics.orderGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="futuristic-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active products</p>
          </CardContent>
        </Card>

        <Card className="futuristic-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Unique customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="futuristic-border">
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line type="monotone" dataKey="revenue" stroke="#FF69B4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="futuristic-border">
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="futuristic-border">
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    #{index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(product.revenue)}</p>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
