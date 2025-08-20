"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { ShoppingBag, CreditCard, Truck, Shield, Heart } from "lucide-react"
import Image from "next/image"

interface CustomerInfo {
  name: string
  email: string
  address: string
  city: string
  postalCode: string
  country: string
}

export default function CheckoutForm() {
  const { state, clearCart } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  })

  const shippingCost = state.total >= 20000 ? 0 : 3000 // Free shipping over ₦20,000
  const tax = state.total * 0.08 // 8% tax
  const finalTotal = state.total + shippingCost + tax

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const orderData = {
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.postalCode}, ${customerInfo.country}`,
        total_amount: finalTotal,
        items: state.items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error("Failed to create order")
      }

      const { order } = await response.json()
      clearCart()
      router.push(`/order-confirmation/${order.id}`)
    } catch (error) {
      console.error("Error creating order:", error)
      alert("Failed to create order. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="text-center space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Your cart is empty</h2>
          <p className="text-muted-foreground">Add some cute items before checking out!</p>
        </div>
        <Button
          onClick={() => router.push("/")}
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
        >
          <Heart className="mr-2 h-4 w-4" />
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Customer Information Form */}
      <Card className="futuristic-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Customer Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  className="futuristic-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="futuristic-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Textarea
                id="address"
                value={customerInfo.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                required
                className="futuristic-border"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={customerInfo.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  required
                  className="futuristic-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input
                  id="postalCode"
                  value={customerInfo.postalCode}
                  onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  required
                  className="futuristic-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={customerInfo.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  required
                  className="futuristic-border"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <p className="font-medium">Secure Checkout</p>
                  <p className="text-muted-foreground">Your information is protected with SSL encryption</p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 py-6 text-lg font-semibold sparkle-effect"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-5 w-5" />
                    Complete Order (₦{finalTotal.toFixed(2)})
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="futuristic-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5" />
            <span>Order Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Items */}
          <div className="space-y-4">
            {state.items.map((item) => (
              <div key={item.id} className="flex space-x-4">
                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                  <Image
                    src={item.product.image_url || "/placeholder.svg?height=64&width=64&query=girly product"}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                    <span className="font-semibold text-primary">
                      ₦{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Pricing Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₦{state.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center space-x-2">
                <Truck className="h-4 w-4" />
                <span>Shipping</span>
              </span>
              <span>
                {shippingCost === 0 ? (
                  <Badge className="bg-green-500 text-white">FREE</Badge>
                ) : (
                  `₦${shippingCost.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₦{tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-primary">₦{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Shipping Information</span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Free shipping on orders over ₦20,000</p>
              <p>• Standard delivery: 3-5 business days</p>
              <p>• Express delivery available at checkout</p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-muted/30 rounded-lg">
              <Shield className="h-6 w-6 mx-auto text-primary mb-2" />
              <p className="text-xs font-medium">Secure Payment</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <Heart className="h-6 w-6 mx-auto text-accent mb-2" />
              <p className="text-xs font-medium">30-Day Returns</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
