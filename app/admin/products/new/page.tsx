"use client"

import ProductForm from "@/components/admin-product-form"

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Add New Product
        </h1>
        <p className="text-muted-foreground">Create a new girly product for your catalog</p>
      </div>

      <ProductForm />
    </div>
  )
}
