import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const statuses = await prisma.lineResolved.findMany({
      where: { diffId: params.id },
    });
    return NextResponse.json(statuses);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch line statuses' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { lineNumber, side, isResolved } = body;

    const status = await prisma.lineResolved.upsert({
      where: {
        diffId_lineNumber_side: {
          diffId: params.id,
          lineNumber,
          side,
        },
      },
      update: { isResolved },
      create: {
        diffId: params.id,
        lineNumber,
        side,
        isResolved,
      },
    });

    return NextResponse.json(status);
  } catch (error) {
    console.error('Error updating line status:', error);
    return NextResponse.json({ error: 'Failed to update line status' }, { status: 500 });
  }
}
