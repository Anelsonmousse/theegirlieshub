import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { AdminProvider } from "@/lib/admin-context"
import WhatsAppSupport from "@/components/whatsapp-support"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Thee Girlies Hub - Your Ultimate Girly Shopping Destination",
  description:
    "Discover the cutest and trendiest girly products at Thee Girlies Hub. From beauty essentials to kawaii accessories.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <AdminProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <WhatsAppSupport />
          </CartProvider>
        </AdminProvider>
      </body>
    </html>
  )
}