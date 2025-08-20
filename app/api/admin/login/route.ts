import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    // Simple password check - you can replace this with database lookup
    const ADMIN_PASSWORD = "admin123" // In production, use environment variables

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    // Alternative: Check against database
    const supabase = createServerClient()
    const { data: adminUsers, error } = await supabase.from("admin_users").select("*").limit(1)

    if (!error && adminUsers && adminUsers.length > 0) {
      const isValidPassword = await bcrypt.compare(password, adminUsers[0].password_hash)
      if (isValidPassword) {
        return NextResponse.json({ success: true }, { status: 200 })
      }
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
