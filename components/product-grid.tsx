"use client"

import { useState } from "react"
import type { Product } from "@/lib/types"
import ProductCard from "./product-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Filter } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductGridProps {
  initialProducts?: Product[]
  initialPagination?: any
}

export default function ProductGrid({ initialProducts = [], initialPagination }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [pagination, setPagination] = useState(initialPagination)
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = ["Beauty", "Accessories", "Fashion", "Girly Essentials", "Cup", "Phone Accessories", "Lingering", "Pyjamas", "Mat"]

  const fetchProducts = async (page = 1, category?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12", // Updated to 12 products per page
      })

      if (category) params.append("category", category)

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()

      setProducts(data.products)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category)
    fetchProducts(1, category || undefined)
  }

  const handlePageChange = (page: number) => {
    fetchProducts(page, selectedCategory || undefined)
  }

  return (
    <div id="products" className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Categories:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryFilter(null)}
            className={selectedCategory === null ? "bg-gradient-to-r from-primary to-accent" : ""}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryFilter(category)}
              className={selectedCategory === category ? "bg-gradient-to-r from-primary to-accent" : ""}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Mobile Next Button */}
      <div className="block sm:hidden">
        {pagination && pagination.hasNext && (
          <div className="flex justify-center">
            <Button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={loading}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-3"
            >
              <ChevronRight className="h-4 w-4 mr-2" />
              Load More
            </Button>
          </div>
        )}
      </div>

      {/* Desktop Pagination */}
      <div className="hidden sm:block">
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-4 pt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev || loading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === pagination.page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  disabled={loading}
                  className={page === pagination.page ? "bg-gradient-to-r from-primary to-accent" : ""}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNext || loading}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>

      {/* Results Info */}
      {pagination && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
        </div>
      )}
    </div>
  )
}
