"use client"

import { Heart, Search, Menu, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import CartDrawer from "./cart-drawer"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent">
              <Heart className="h-6 w-6 text-white" fill="currentColor" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Thee Girlies Hub
              </h1>
              <p className="text-xs text-muted-foreground">Your girly paradise</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search for cute products..." className="pl-10 futuristic-border" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="hidden sm:flex" title="Admin Panel">
                <Shield className="h-5 w-5" />
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="hidden md:flex sm:hidden">
              <Search className="h-5 w-5" />
            </Button>

            <CartDrawer />

            <div className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="md:hidden pb-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search for cute products..." className="pl-10 futuristic-border" />
          </div>
        </div>
      </div>
    </header>
  )
}
