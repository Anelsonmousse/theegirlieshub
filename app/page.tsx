import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import ProductGrid from "@/components/product-grid"
import { createServerClient } from "@/lib/supabase/server"

async function getInitialProducts() {
  const supabase = createServerClient()

  try {
    const {
      data: products,
      error,
      count,
    } = await supabase
      .from("products")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(0, 11) // First 12 products for better mobile grid layout

    if (error) {
      console.error("Error fetching products:", error)
      return { products: [], pagination: null }
    }

    const totalPages = Math.ceil((count || 0) / 12) // Updated to 12 products per page

    return {
      products: products || [],
      pagination: {
        page: 1,
        limit: 12, // Updated limit to 12
        total: count || 0,
        totalPages,
        hasNext: totalPages > 1,
        hasPrev: false,
      },
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { products: [], pagination: null }
  }
}

export default async function HomePage() {
  const { products, pagination } = await getInitialProducts()

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Our Products
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our amazing collection of girly essentials and trending items!
            </p>
          </div>

          <ProductGrid initialProducts={products} initialPagination={pagination} />
        </div>
      </main>
    </div>
  )
}
