import Header from "@/components/header"
import OrderConfirmation from "@/components/order-confirmation"
import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

interface OrderConfirmationPageProps {
  params: {
    orderId: string
  }
}

async function getOrder(orderId: string) {
  const supabase = createServerClient()

  try {
    const { data: order, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          product:products (*)
        )
      `,
      )
      .eq("id", orderId)
      .single()

    if (error) {
      console.error("Error fetching order:", error)
      return null
    }

    return order
  } catch (error) {
    console.error("Unexpected error:", error)
    return null
  }
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const order = await getOrder(params.orderId)

  if (!order) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrderConfirmation order={order} />
      </main>
    </div>
  )
}
