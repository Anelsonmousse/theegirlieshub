import { NextResponse } from "next/server"

// Centralized shipping options with pricing
const SHIPPING_OPTIONS = [
  {
    id: "pickup",
    name: "Pick Up",
    description: "Pick up from our store location",
    areas: "Store Location",
    deliveryTime: "Immediate",
    fee: 0
  },
  {
    id: "lagos-island",
    name: "Lagos Island",
    description: "Covering Chevron, Orchid, Ikorodu, Ikate, New Road, Ajah",
    areas: "Island Areas",
    deliveryTime: "24 - 48 hours",
    fee: 5000
  },
  {
    id: "lagos-mainland",
    name: "Lagos Mainland", 
    description: "Covering Ikeja, Orile, Yaba, Surulere, Ikotun, Lasu, Egbeda, Magodo, Igando, Ayobo and others",
    areas: "Mainland Areas",
    deliveryTime: "24 - 48 hours",
    fee: 3500
  },
  {
    id: "inter-state",
    name: "Inter State",
    description: "Covering Benin, Abuja, Delta, Port Harcourt, Abia, Enugu, Imo, Calabar",
    areas: "Other States", 
    deliveryTime: "2 - 3 business days",
    fee: 4500
  },
  {
    id: "western-states",
    name: "Western States",
    description: "Covering Ibadan, Ilorin, Ondo, Ekiti, Osun, Ogun",
    areas: "Western Nigeria",
    deliveryTime: "2 - 3 business days", 
    fee: 4000
  }
]

export async function GET() {
  try {
    return NextResponse.json({ 
      shippingOptions: SHIPPING_OPTIONS 
    }, { status: 200 })
  } catch (error) {
    console.error("Error fetching shipping options:", error)
    return NextResponse.json(
      { error: "Failed to fetch shipping options" },
      { status: 500 }
    )
  }
}

// Function to validate shipping and get fee (used by orders API)
export function getShippingFee(shippingLocationId: string): number {
  const option = SHIPPING_OPTIONS.find(opt => opt.id === shippingLocationId)
  return option?.fee || 0
}

// Function to get shipping option details
export function getShippingOption(shippingLocationId: string) {
  return SHIPPING_OPTIONS.find(opt => opt.id === shippingLocationId)
}