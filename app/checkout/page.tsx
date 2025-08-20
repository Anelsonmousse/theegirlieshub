import Header from "@/components/header"
import CheckoutForm from "@/components/checkout-form"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Checkout
            </h1>
            <p className="text-muted-foreground">Complete your order and get ready to sparkle! ✨</p>
          </div>
          <CheckoutForm />
        </div>
      </main>
    </div>
  )
}
