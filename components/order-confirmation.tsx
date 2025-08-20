"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Package, Truck, Heart, Star, Download } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface OrderConfirmationProps {
  order: any
}

export default function OrderConfirmation({ order }: OrderConfirmationProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Success Header */}
      <div className="text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Order Confirmed!
          </h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your order! Your girly goodies are on their way! ✨
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 text-sm font-medium">
          Order #{order.id.slice(0, 8).toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Details */}
        <Card className="futuristic-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Order Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span className="font-medium">{formatDate(order.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge className="bg-yellow-500 text-white capitalize">{order.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-semibold text-primary text-lg">₦{order.total_amount.toFixed(2)}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-semibold">Shipping Address:</h4>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{order.customer_name}</p>
                <p>{order.customer_address}</p>
                <p>{order.customer_email}</p>
              </div>
            </div>

            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Shipping Information</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Estimated delivery: 3-5 business days</p>
                <p>• You'll receive tracking information via email</p>
                <p>• Free shipping applied to this order</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="futuristic-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Your Items ({order.order_items?.length || 0})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.order_items?.map((item: any) => (
              <div key={item.id} className="flex space-x-4 p-4 border rounded-lg">
                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                  <Image
                    src={item.product?.image_url || "/placeholder.svg?height=64&width=64&query=girly product"}
                    alt={item.product?.name || "Product"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-sm line-clamp-2">{item.product?.name}</h4>
                      <p className="text-sm text-muted-foreground">₦{item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">4.8</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Quantity: {item.quantity}</span>
                    <span className="font-semibold text-primary">₦{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button variant="outline" className="bg-transparent futuristic-border" onClick={() => window.print()}>
          <Download className="mr-2 h-4 w-4" />
          Download Receipt
        </Button>
        <Link href="/">
          <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
            <Heart className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </Link>
      </div>

      {/* Thank You Message */}
      <Card className="text-center p-8 girly-gradient">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-primary">Thank You for Shopping with Us!</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're so excited to be part of your girly journey! Your order will be carefully packed with love and shipped
            to you soon. Don't forget to share your unboxing experience with us on social media! 💕
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>Follow @thegirlieshub</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-500" />
              <span>Use #GirliesHubUnboxing</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
