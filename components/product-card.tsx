"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag } from "lucide-react"
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
  const { addToCart } = useCart()

  const handleAddToCart = async () => {
    setIsLoading(true)
    addToCart(product, 1)
    setTimeout(() => setIsLoading(false), 500)
  }

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 futuristic-border sparkle-effect flex flex-col h-full">
      {product.is_featured && (
        <Badge className="absolute top-3 left-3 z-10 bg-accent text-white shadow-md">
          ✨ Featured
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
          className="w-full  bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 h-10 font-medium"
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}