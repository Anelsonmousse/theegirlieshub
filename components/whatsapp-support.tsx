"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WhatsAppSupport() {
  const handleWhatsAppClick = () => {
    const phoneNumber = "2347041604897" // Nigerian format without +
    const message = "Hi! I need help with my order from Thee Girlies Hub 💕"
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg animate-bounce"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">WhatsApp Support</span>
      </Button>
    </div>
  )
}
