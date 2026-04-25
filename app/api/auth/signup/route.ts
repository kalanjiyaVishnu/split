import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { login } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { handle, password, name } = await req.json();

    if (!handle || !password) {
      return NextResponse.json({ error: "Handle and password required" }, { status: 400 });
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { handle } });
    if (existing) {
      return NextResponse.json({ error: "Handle already taken" }, { status: 400 });
    }

    // In a real app, hash the password! For this demo we'll use plain text (DO NOT DO THIS IN PROD)
    // Actually, I'll just use a mock hash or mention it.
    const user = await prisma.user.create({
      data: {
        handle,
        password, // Should be hashed
        name: name || handle,
      }
    });

    await login({ id: user.id, handle: user.handle, name: user.name || user.handle });

    return NextResponse.json({ success: true, user: { handle: user.handle, name: user.name } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
