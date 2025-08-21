"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ShoppingBag, Package, X } from "lucide-react"
import type { Product } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showVariantDialog, setShowVariantDialog] = useState(false)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedDesign, setSelectedDesign] = useState("")
  const { addToCart } = useCart()

  // Check if product has variants
  const hasVariants = (product.sizes && product.sizes.length > 0) || 
                     (product.colors && product.colors.length > 0) || 
                     (product.designs && product.designs.length > 0)

  const handleAddToCart = async () => {
    // If product has variants, show selection dialog
    if (hasVariants) {
      setShowVariantDialog(true)
      return
    }

    // If no variants, add directly to cart
    setIsLoading(true)
    addToCart(product, 1)
    setTimeout(() => setIsLoading(false), 500)
  }

  const handleConfirmAddToCart = async () => {
    // Validate required variants
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
    
    addToCart(productWithVariants, 1)
    
    // Reset selections and close dialog
    setTimeout(() => {
      setIsLoading(false)
      setShowVariantDialog(false)
      setSelectedSize("")
      setSelectedColor("")
      setSelectedDesign("")
    }, 500)
  }

  const handleCloseDialog = () => {
    setShowVariantDialog(false)
    setSelectedSize("")
    setSelectedColor("")
    setSelectedDesign("")
  }

  return (
    <>
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 futuristic-border sparkle-effect flex flex-col h-full">
        {product.is_featured && (
          <Badge className="absolute top-3 left-3 z-10 bg-accent text-white shadow-md">
            ✨ Featured
          </Badge>
        )}

        {/* Variant indicator */}
        {hasVariants && (
          <Badge className="absolute top-3 right-3 z-10 bg-primary/80 text-white text-xs">
            <Package className="h-3 w-3 mr-1" />
            Options
          </Badge>
        )}

        <Link href={`/products/${product.id}`} className="block">
          <div className="aspect-square overflow-hidden -mt-[15px]">
            <Image
              src={product.image_url || "/placeholder.svg?height=300&width=300&query=girly product"}
              alt={product.name}
              width={300}
              height={300}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </Link>

        <CardContent className="p-2 flex-1 flex flex-col justify-between -mt-[20px]">
          <div className="space-y-2">
            <Badge variant="secondary" className="text-[10px] w-fit">
              {product.category}
            </Badge>

            <Link href={`/products/${product.id}`}>
              <h3 className="font-semibold text-base line-clamp-2 hover:text-primary transition-colors leading-tight">
                {product.name}
              </h3>
            </Link>

            <p className="text-sm text-muted-foreground truncate leading-relaxed">
              {product.description}
            </p>

            {/* Quick variant preview */}
            {hasVariants && (
              <div className="flex flex-wrap gap-1">
                {product.sizes && product.sizes.length > 0 && (
                  <span className="text-xs bg-primary/10 text-primary px-1 py-0.5 rounded">
                    {product.sizes.length} size{product.sizes.length > 1 ? 's' : ''}
                  </span>
                )}
                {product.colors && product.colors.length > 0 && (
                  <span className="text-xs bg-accent/10 text-accent px-1 py-0.5 rounded">
                    {product.colors.length} color{product.colors.length > 1 ? 's' : ''}
                  </span>
                )}
                {product.designs && product.designs.length > 0 && (
                  <span className="text-xs bg-muted text-muted-foreground px-1 py-0.5 rounded">
                    {product.designs.length} design{product.designs.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            )}

            <div className="space-y-1">
              <span className="text-xl font-bold text-primary block">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-muted-foreground">
                {product.stock_quantity} in stock
              </span>
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={isLoading || product.stock_quantity === 0}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 h-10 font-medium"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <ShoppingBag className="h-4 w-4 mr-2" />
                {hasVariants ? "Add to Cart" : "Add to Cart"}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Variant Selection Dialog */}
      <Dialog open={showVariantDialog} onOpenChange={setShowVariantDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Choose Your Style</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Product Info */}
            <div className="flex space-x-3">
              <div className="relative w-16 h-16 rounded-md overflow-hidden">
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm line-clamp-2">{product.name}</h4>
                <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Size *</Label>
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
                <Label className="text-sm font-medium">Color *</Label>
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
                <Label className="text-sm font-medium">Design *</Label>
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

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmAddToCart}
              disabled={isLoading}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add to Cart
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}