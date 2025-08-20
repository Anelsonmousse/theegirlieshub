"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Heart, Star } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden girly-gradient">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 animate-bounce">
        <Heart className="h-8 w-8 text-primary/30" fill="currentColor" />
      </div>
      <div className="absolute top-20 right-20 animate-pulse">
        <Star className="h-6 w-6 text-accent/40" fill="currentColor" />
      </div>
      <div className="absolute bottom-20 left-20 animate-bounce delay-1000">
        <Sparkles className="h-10 w-10 text-primary/20" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <Badge className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 text-sm font-medium">
              ✨ New Collection Available
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Thee Girlies Hub
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Discover the cutest, comfiest , and most adorable items provided just for you. From thee.girlies.hub - we've got essential for every girlies journey🎀🍒
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#products">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-6 text-lg font-semibold sparkle-effect"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Shop Now
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span>Free Shipping Over ₦50,000</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-500" />
              <span>2 weeks Returns</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-1000" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
