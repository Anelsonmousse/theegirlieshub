export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category: string | null
  stock_quantity: number
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  session_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  product?: Product
}

export interface Order {
  id: string
  customer_email: string
  customer_name: string
  customer_address: string
  total_amount: number
  status: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  created_at: string
  product?: Product
}

export interface AdminUser {
  id: string
  username: string
  password_hash: string
  created_at: string
}
