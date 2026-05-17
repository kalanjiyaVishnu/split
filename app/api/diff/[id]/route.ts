import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const diff = await prisma.diff.findUnique({
      where: { shortId: id },
    });

    if (!diff) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(diff);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch diff' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { isResolved, label } = body;

    const diff = await prisma.diff.update({
      where: { shortId: id },
      data: {
        ...(isResolved !== undefined && { isResolved }),
        ...(label !== undefined && { label }),
      },
    });

    return NextResponse.json(diff);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update diff' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.comment.deleteMany({
      where: { diff: { shortId: id } }
    });
    
    await prisma.diff.delete({
      where: { shortId: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete diff' }, { status: 500 });
  }
}
