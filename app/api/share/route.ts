import { NextRequest, NextResponse } from "next/server"

// In production, this would be stored in a database
// For now, we use a simple in-memory store with token-based access
const shareTokens = new Map<string, {
  customerId: string
  customerName: string
  shellyDeviceId: string
  createdAt: Date
  expiresAt: Date
}>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId, customerName, shellyDeviceId } = body

    if (!customerId || !customerName || !shellyDeviceId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Generate a secure token
    const token = generateSecureToken()
    
    // Store token with 30-day expiry
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    shareTokens.set(token, {
      customerId,
      customerName,
      shellyDeviceId,
      createdAt: new Date(),
      expiresAt
    })

    // Generate the shareable URL
    const baseUrl = request.nextUrl.origin
    const shareUrl = `${baseUrl}/view/${token}`

    return NextResponse.json({
      success: true,
      shareUrl,
      token,
      expiresAt: expiresAt.toISOString()
    })
  } catch (error) {
    console.error("[v0] Error creating share link:", error)
    return NextResponse.json(
      { error: "Failed to create share link" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")
  
  if (!token) {
    return NextResponse.json(
      { error: "Token required" },
      { status: 400 }
    )
  }

  const shareData = shareTokens.get(token)
  
  if (!shareData) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 404 }
    )
  }

  // Check expiry
  if (new Date() > shareData.expiresAt) {
    shareTokens.delete(token)
    return NextResponse.json(
      { error: "Token expired" },
      { status: 410 }
    )
  }

  return NextResponse.json({
    customerId: shareData.customerId,
    customerName: shareData.customerName,
    shellyDeviceId: shareData.shellyDeviceId,
    expiresAt: shareData.expiresAt.toISOString()
  })
}

function generateSecureToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}
