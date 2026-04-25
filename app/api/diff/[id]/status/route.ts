import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const statuses = await prisma.lineResolved.findMany({
      where: { 
        diff: { shortId: params.id }
      },
    });
    return NextResponse.json(statuses);
  } catch (error) {
    console.error('Error fetching line statuses:', error);
    return NextResponse.json({ error: 'Failed to fetch line statuses' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { lineNumber, side, isResolved } = body;

    const diff = await prisma.diff.findUnique({
      where: { shortId: params.id }
    });

    if (!diff) {
      return NextResponse.json({ error: 'Diff not found' }, { status: 404 });
    }

    const status = await prisma.lineResolved.upsert({
      where: {
        diffId_lineNumber_side: {
          diffId: diff.id,
          lineNumber,
          side,
        },
      },
      update: { isResolved },
      create: {
        diffId: diff.id,
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
