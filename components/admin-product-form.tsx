"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Package, Upload, ImageIcon, X, Plus } from "lucide-react"
import type { Product } from "@/lib/types"
import Link from "next/link"
import { uploadImageToSanity, getSanityImageUrl } from "@/lib/sanity"
import Image from "next/image"

interface ProductFormProps {
  product?: Product
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    image_urls: product?.image_urls || [product?.image_url].filter(Boolean) || [],
    category: product?.category || "",
    stock_quantity: product?.stock_quantity?.toString() || "0",
    is_featured: product?.is_featured || false,
    sizes: product?.sizes?.join(", ") || "",
    colors: product?.colors?.join(", ") || "",
    designs: product?.designs?.join(", ") || "",
  })

  const categories = ["Beauty", "Accessories", "Fashion"]

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (formData.image_urls.length >= 4) {
      alert("Maximum 4 images allowed")
      return
    }

    setImageUploading(true)
    try {
      const assetId = await uploadImageToSanity(file)
      const imageUrl = getSanityImageUrl(assetId, 800, 800)
      
      const newImageUrls = [...formData.image_urls, imageUrl]
      handleInputChange("image_urls", newImageUrls)
      
      // Reset file input
      e.target.value = ""
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setImageUploading(false)
    }
  }

  const removeImage = (indexToRemove: number) => {
    const newImageUrls = formData.image_urls.filter((_, index) => index !== indexToRemove)
    handleInputChange("image_urls", newImageUrls)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Process variant data
      const processedData = {
        ...formData,
        image_url: formData.image_urls[0] || "", // Keep primary image for backward compatibility
        image_urls: formData.image_urls,
        sizes: formData.sizes ? formData.sizes.split(",").map(s => s.trim()).filter(Boolean) : [],
        colors: formData.colors ? formData.colors.split(",").map(c => c.trim()).filter(Boolean) : [],
        designs: formData.designs ? formData.designs.split(",").map(d => d.trim()).filter(Boolean) : [],
      }

      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products"
      const method = product ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedData),
      })

      if (response.ok) {
        router.push("/admin/products")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to save product")
      }
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Error saving product")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div className="flex items-center space-x-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <Card className="futuristic-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>{product ? "Edit Product" : "New Product"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter product name"
                    required
                    className="futuristic-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="futuristic-border">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₦) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="1"
                      min="0"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="0"
                      required
                      className="futuristic-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock_quantity">Stock Quantity</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      min="0"
                      value={formData.stock_quantity}
                      onChange={(e) => handleInputChange("stock_quantity", e.target.value)}
                      placeholder="0"
                      className="futuristic-border"
                    />
                  </div>
                </div>

                {/* Product Images Section */}
                <div className="space-y-3">
                  <Label>Product Images (Max 4)</Label>
                  
                  {/* Upload Button */}
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={imageUploading || formData.image_urls.length >= 4}
                      className="futuristic-border"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={imageUploading || formData.image_urls.length >= 4}
                      className="whitespace-nowrap bg-transparent"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      {imageUploading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Image ({formData.image_urls.length}/4)
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Image Preview Grid */}
                  {formData.image_urls.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {formData.image_urls.map((url, index) => (
                        <div key={index} className="relative group">
                          <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border">
                            <Image
                              src={url}
                              alt={`Product image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeImage(index)}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="absolute top-1 left-1 bg-primary text-white text-xs px-2 py-1 rounded">
                            {index === 0 ? "Main" : `${index + 1}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Variants Section */}
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-sm flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>Product Variants</span>
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="sizes" className="text-sm">Available Sizes</Label>
                      <Input
                        id="sizes"
                        value={formData.sizes}
                        onChange={(e) => handleInputChange("sizes", e.target.value)}
                        placeholder="e.g., XS, S, M, L, XL"
                        className="futuristic-border text-sm"
                      />
                      <p className="text-xs text-muted-foreground">Separate multiple sizes with commas</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="colors" className="text-sm">Available Colors</Label>
                      <Input
                        id="colors"
                        value={formData.colors}
                        onChange={(e) => handleInputChange("colors", e.target.value)}
                        placeholder="e.g., Pink, Purple, Blue, White"
                        className="futuristic-border text-sm"
                      />
                      <p className="text-xs text-muted-foreground">Separate multiple colors with commas</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="designs" className="text-sm">Available Designs</Label>
                      <Input
                        id="designs"
                        value={formData.designs}
                        onChange={(e) => handleInputChange("designs", e.target.value)}
                        placeholder="e.g., Floral, Polka Dots, Stripes, Plain"
                        className="futuristic-border text-sm"
                      />
                      <p className="text-xs text-muted-foreground">Separate multiple designs with commas</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your girly product..."
                    rows={12}
                    className="futuristic-border"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => handleInputChange("is_featured", Boolean(checked))}
                  />
                  <Label htmlFor="is_featured" className="text-sm font-medium">
                    Featured Product
                  </Label>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <h4 className="font-medium text-sm">Product Tips</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Upload up to 4 high-quality images</li>
                    <li>• First image will be the main product image</li>
                    <li>• Add sizes, colors, and designs for variants</li>
                    <li>• Write engaging descriptions with girly language</li>
                    <li>• Set competitive prices in Nigerian Naira (₦)</li>
                    <li>• Mark popular items as featured</li>
                    <li>• Keep stock quantities updated</li>
                  </ul>
                </div>

                {/* Variant Preview */}
                {(formData.sizes || formData.colors || formData.designs) && (
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
                    <h4 className="font-medium text-sm text-primary">Variant Preview</h4>
                    
                    {formData.sizes && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Sizes:</p>
                        <div className="flex flex-wrap gap-1">
                          {formData.sizes.split(",").map((size, index) => (
                            <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {size.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.colors && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Colors:</p>
                        <div className="flex flex-wrap gap-1">
                          {formData.colors.split(",").map((color, index) => (
                            <span key={index} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                              {color.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.designs && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Designs:</p>
                        <div className="flex flex-wrap gap-1">
                          {formData.designs.split(",").map((design, index) => (
                            <span key={index} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                              {design.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-6 border-t">
              <Link href="/admin/products" className="w-full sm:w-auto">
                <Button variant="outline" type="button" className="w-full sm:w-auto bg-transparent">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {product ? "Update Product" : "Create Product"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}