import Header from "@/components/header"
import ProductDetail from "@/components/product-detail"
import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface ProductPageProps {
  params: {
    id: string
  }
}

async function getProduct(id: string) {
  const supabase = createServerClient()

  try {
    const { data: product, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching product:", error)
      return null
    }

    // Get related products
    const { data: relatedProducts } = await supabase
      .from("products")
      .select("*")
      .eq("category", product.category)
      .neq("id", id)
      .limit(4)

    return {
      product,
      relatedProducts: relatedProducts || [],
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    return null
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const data = await getProduct(params.id)

  if (!data?.product) {
    return {
      title: "Product Not Found - Thee Girlies Hub",
    }
  }

  return {
    title: `${data.product.name} - Thee Girlies Hub`,
    description: data.product.description || `Shop ${data.product.name} at Thee Girlies Hub`,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const data = await getProduct(params.id)

  if (!data?.product) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetail product={data.product} relatedProducts={data.relatedProducts} />
      </main>
    </div>
  )
}
