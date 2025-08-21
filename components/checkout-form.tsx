"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/lib/cart-context"
import { ShoppingBag, CreditCard, Truck, Shield, Heart, MapPin, Clock } from "lucide-react"
import Image from "next/image"

interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
  shippingLocation: string
}

interface ShippingOption {
  id: string
  name: string
  description: string
  areas: string
  deliveryTime: string
  fee: number
}

export default function CheckoutForm() {
  const { state, clearCart } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingShipping, setLoadingShipping] = useState(true)
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    shippingLocation: "",
  })

  // Fetch shipping options when component mounts
  useEffect(() => {
    const fetchShippingOptions = async () => {
      try {
        setLoadingShipping(true)
        const response = await fetch("/api/shipping-options")
        
        if (!response.ok) {
          throw new Error("Failed to fetch shipping options")
        }
        
        const data = await response.json()
        setShippingOptions(data.shippingOptions)
      } catch (error) {
        console.error("Error fetching shipping options:", error)
        // Fallback options if API fails
        setShippingOptions([
          { id: "pickup", name: "Pick Up", description: "Pick up from our store", areas: "Store Location", deliveryTime: "Immediate", fee: 0 },
          { id: "lagos-island", name: "Lagos Island", description: "Covering Chevron, Orchid, Ikorodu, Ikate, New Road, Ajah", areas: "Island Areas", deliveryTime: "24 - 48 hours", fee: 5000 },
          { id: "lagos-mainland", name: "Lagos Mainland", description: "Covering Ikeja, Orile, Yaba, Surulere, Ikotun, Lasu, Egbeda, Magodo, Igando, Ayobo and others", areas: "Mainland Areas", deliveryTime: "24 - 48 hours", fee: 3500 },
          { id: "inter-state", name: "Inter State", description: "Covering Benin, Abuja, Delta, Port Harcourt, Abia, Enugu, Imo, Calabar", areas: "Other States", deliveryTime: "24 - 48 hours", fee: 4500 },
          { id: "western-states", name: "Western States", description: "Covering Ibadan, Ilorin, Ondo, Ekiti, Osun, Ogun", areas: "Western Nigeria", deliveryTime: "24 - 48 hours", fee: 4000 }
        ])
      } finally {
        setLoadingShipping(false)
      }
    }

    fetchShippingOptions()
  }, [])

  const shippingCost = selectedShipping?.fee || 0
  const finalTotal = state.total + shippingCost

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleShippingChange = (shippingId: string) => {
    const selected = shippingOptions.find(option => option.id === shippingId)
    setSelectedShipping(selected || null)
    setCustomerInfo(prev => ({ ...prev, shippingLocation: shippingId }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedShipping) {
      alert("Please select a shipping option")
      return
    }
    
    setIsLoading(true)

    try {
      const orderData = {
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        customer_address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.postalCode}, ${customerInfo.country}`,
        shipping_location: customerInfo.shippingLocation,
        shipping_fee: shippingCost,
        total_amount: finalTotal,
        items: state.items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          selected_variants: item.product.selectedVariants || {},
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

            {/* Phone Number Field */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+234 (0) 123 456 7890"
                required
                className="futuristic-border"
              />
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

            {/* Shipping Options */}
            <div className="space-y-4">
              <Label className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Shipping Location *</span>
              </Label>
              
              {loadingShipping ? (
                <div className="flex items-center justify-center p-4 border rounded-lg">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2">Loading shipping options...</span>
                </div>
              ) : (
                <Select onValueChange={handleShippingChange} required>
                  <SelectTrigger className="futuristic-border h-auto">
                    <SelectValue placeholder="Select your delivery location" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {shippingOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id} className="p-4 hover:bg-muted cursor-pointer">
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-base">{option.name}</span>
                            <span className="text-primary font-bold text-lg">
                              {option.fee === 0 ? "FREE" : `₦${option.fee.toLocaleString()}`}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-2">{option.description}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Delivery: {option.deliveryTime}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Selected shipping details */}
              {selectedShipping && (
                <div className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{selectedShipping.name}</h4>
                        <p className="text-sm text-muted-foreground">Selected shipping method</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-xl text-primary">
                        {selectedShipping.fee === 0 ? "FREE" : `₦${selectedShipping.fee.toLocaleString()}`}
                      </span>
                      <p className="text-xs text-muted-foreground">Shipping fee</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-primary/10 pt-3">
                    <p className="text-sm text-muted-foreground mb-2">{selectedShipping.description}</p>
                    <div className="flex items-center space-x-2 text-sm font-medium">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>Delivery time: {selectedShipping.deliveryTime}</span>
                    </div>
                  </div>
                </div>
              )}
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
                disabled={isLoading || !selectedShipping}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 py-6 text-lg font-semibold sparkle-effect disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-5 w-5" />
                    Complete Order (₦{finalTotal.toLocaleString()})
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
                  
                  {/* Display selected variants */}
                  {item.product.selectedVariants && (
                    <div className="flex flex-wrap gap-1 mb-1">
                      {item.product.selectedVariants.size && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {item.product.selectedVariants.size}
                        </span>
                      )}
                      {item.product.selectedVariants.color && (
                        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                          {item.product.selectedVariants.color}
                        </span>
                      )}
                      {item.product.selectedVariants.design && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          {item.product.selectedVariants.design}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                    <span className="font-semibold text-primary">
                      ₦{(item.product.price * item.quantity).toLocaleString()}
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
              <span>₦{state.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center space-x-2">
                <Truck className="h-4 w-4" />
                <span>Shipping {selectedShipping && `(${selectedShipping.name})`}</span>
              </span>
              <span>
                {shippingCost === 0 ? (
                  <Badge className="bg-green-500 text-white">FREE</Badge>
                ) : (
                  `₦${shippingCost.toLocaleString()}`
                )}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-primary">₦{finalTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Shipping Information</span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Pick up available at our store for free</p>
              <p>• Lagos delivery: 24-48 hours</p>
              <p>• Inter-state delivery: 2-3 business days</p>
              <p>• All deliveries include tracking</p>
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
              <p className="text-xs font-medium">2 weeks Returns</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}