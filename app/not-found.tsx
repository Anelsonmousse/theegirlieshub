import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 max-w-md mx-auto">
          <div className="space-y-4">
            <div className="text-8xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              404
            </div>
            <h1 className="text-2xl font-bold">Oops! Page Not Found</h1>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist. Maybe it went shopping for some cute accessories? 💕
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/">
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">Or continue browsing our girly collection below! ✨</p>
          </div>
        </div>
      </main>
    </div>
  )
}
