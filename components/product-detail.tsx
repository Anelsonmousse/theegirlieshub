"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ShoppingBag, Plus, Minus, Share2, Package } from "lucide-react"
import type { Product } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import ProductCard from "./product-card"

interface ProductDetailProps {
  product: Product
  relatedProducts: Product[]
}

export default function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedDesign, setSelectedDesign] = useState("")
  const { addToCart } = useCart()

  // Use product images or fallback to single image
  const images = product.image_urls && product.image_urls.length > 0 
    ? product.image_urls 
    : [product.image_url || "/placeholder.svg?height=600&width=600"]

  // Ensure we have at least one image
  const productImages = images.length > 0 ? images : ["/placeholder.svg?height=600&width=600"]

  const handleAddToCart = async () => {
    // Check if variants are required but not selected
    const hasVariants = (product.sizes && product.sizes.length > 0) || 
                       (product.colors && product.colors.length > 0) || 
                       (product.designs && product.designs.length > 0)
    
    if (hasVariants) {
      if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        alert("Please select a size")
        return
      }
      if (product.colors && product.colors.length > 0 && !selectedColor) {
        alert("Please select a color")
        return
      }
      if (product.designs && product.designs.length > 0 && !selectedDesign) {
        alert("Please select a design")
        return
      }
    }

    setIsLoading(true)
    
    // Add product with selected variants
    const productWithVariants = {
      ...product,
      selectedVariants: {
        size: selectedSize,
        color: selectedColor,
        design: selectedDesign
      }
    }
    
    addToCart(productWithVariants, quantity)
    setTimeout(() => setIsLoading(false), 500)
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stock_quantity) {
      setQuantity(newQuantity)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description || "",
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const hasVariants = (product.sizes && product.sizes.length > 0) || 
                     (product.colors && product.colors.length > 0) || 
                     (product.designs && product.designs.length > 0)

  return (
    <div className="space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/" className="hover:text-primary transition-colors">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg futuristic-border">
            <Image
              src={productImages[selectedImageIndex] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.is_featured && <Badge className="absolute top-4 left-4 bg-accent text-white">✨ Featured</Badge>}
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-4 right-4 transition-colors ${
                isLiked ? "text-red-500" : "text-white hover:text-red-500"
              }`}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
            </Button>
          </div>

          {/* Image Gallery - Only show if multiple images */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all ${
                    selectedImageIndex === index ? "border-primary" : "border-transparent hover:border-muted"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-sm">
                {product.category}
              </Badge>
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{product.name}</h1>

            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">₦{product.price.toLocaleString()}</div>
              <div className="flex items-center space-x-2 text-sm">
                <span className={`${product.stock_quantity > 10 ? "text-green-600" : "text-orange-600"} font-medium`}>
                  {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
                </span>
                {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    Only {product.stock_quantity} left!
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Product Variants */}
            {hasVariants && (
              <div className="space-y-6 p-4 bg-muted/20 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">Choose Your Style</span>
                </div>

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Size</Label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <Button
                          key={size}
                          variant={selectedSize === size ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedSize(size)}
                          className={`${
                            selectedSize === size 
                              ? "bg-primary text-white" 
                              : "hover:bg-primary/10"
                          }`}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Color</Label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <Button
                          key={color}
                          variant={selectedColor === color ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedColor(color)}
                          className={`${
                            selectedColor === color 
                              ? "bg-accent text-white" 
                              : "hover:bg-accent/10"
                          }`}
                        >
                          {color}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Design Selection */}
                {product.designs && product.designs.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Design</Label>
                    <div className="flex flex-wrap gap-2">
                      {product.designs.map((design) => (
                        <Button
                          key={design}
                          variant={selectedDesign === design ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedDesign(design)}
                          className={`${
                            selectedDesign === design 
                              ? "bg-muted-foreground text-white" 
                              : "hover:bg-muted"
                          }`}
                        >
                          {design}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock_quantity}
                    className="h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Selected Variants Summary */}
              {hasVariants && (selectedSize || selectedColor || selectedDesign) && (
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm font-medium text-primary mb-2">Your Selection:</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {selectedSize && (
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                        Size: {selectedSize}
                      </span>
                    )}
                    {selectedColor && (
                      <span className="bg-accent/10 text-accent px-2 py-1 rounded">
                        Color: {selectedColor}
                      </span>
                    )}
                    {selectedDesign && (
                      <span className="bg-muted text-muted-foreground px-2 py-1 rounded">
                        Design: {selectedDesign}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={isLoading || product.stock_quantity === 0}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 py-6 text-lg font-semibold sparkle-effect"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Add to Cart • ₦{(product.price * quantity).toLocaleString()}
                  </>
                )}
              </Button>
            </div>
          </div>

          <Separator />
        </div>
      </div>

      {/* Product Details Tabs */}
      <Card className="futuristic-border">
        <CardContent className="p-6">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6 space-y-4">
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold mb-3">Product Details</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Product Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium">{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stock:</span>
                      <span className="font-medium">{product.stock_quantity} units</span>
                    </div>
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Available Sizes:</span>
                        <span className="font-medium">{product.sizes.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Available Options</h3>
                  <div className="space-y-2 text-sm">
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Colors:</span>
                        <span className="font-medium">{product.colors.join(", ")}</span>
                      </div>
                    )}
                    {product.designs && product.designs.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Designs:</span>
                        <span className="font-medium">{product.designs.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Shipping Information</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Pick up available at our store for free</li>
                    <li>• Lagos delivery: 24-48 hours</li>
                    <li>• Inter-state delivery: 2-3 business days</li>
                    <li>• All deliveries include tracking</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Returns & Exchanges</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• 2 weeks return policy</li>
                    <li>• Items must be in original condition</li>
                    <li>• Free return shipping for defective items</li>
                    <li>• Easy online return process</li>
                    <li>• Refunds processed within 5-7 business days</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              You Might Also Love
            </h2>
            <p className="text-muted-foreground">More cute items from the same category</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Add Label component if not imported
function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}