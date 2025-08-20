"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminProvider, useAdmin } from "@/lib/admin-context"
import AdminSidebar from "@/components/admin-sidebar"
import AdminHeader from "@/components/admin-header"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdmin()
  const router = useRouter()
  const pathname = usePathname()

  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, isLoading, router, isLoginPage])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-100 border-4 border-red-500">
        <div className="text-center space-y-4 p-8 bg-white border-2 border-blue-500 rounded-lg">
          <div className="w-12 h-12 mx-auto animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />
          <p className="text-gray-800 font-bold">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-100 border-4 border-orange-500">
        <div className="text-center p-8 bg-white border-2 border-red-500 rounded-lg">
          <p className="text-gray-800 font-bold">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  if (isLoginPage) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#FCDAF2" }}>
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProvider>
  )
}
