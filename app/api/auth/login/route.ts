import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { login } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const { handle, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { handle }
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await login({ id: user.id, handle: user.handle, name: user.name || user.handle });

    return NextResponse.json({ success: true, user: { handle: user.handle, name: user.name } });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
