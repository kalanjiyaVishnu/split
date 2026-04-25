import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { customAlphabet } from 'nanoid';

export const dynamic = 'force-dynamic';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { leftContent, rightContent, fileType, label, commentsEnabled } = body;

    const shortId = nanoid();

    const diff = await prisma.diff.create({
      data: {
        shortId,
        leftContent,
        rightContent,
        fileType: fileType || 'text',
        label,
        commentsEnabled: commentsEnabled ?? true,
      },
    });

    return NextResponse.json({ shortId: diff.shortId });
  } catch (error) {
    console.error('Error saving diff:', error);
    return NextResponse.json({ error: 'Failed to save diff' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const diffs = await prisma.diff.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        shortId: true,
        label: true,
        fileType: true,
        createdAt: true,
      }
    });
    return NextResponse.json(diffs);
  } catch (error) {
    console.error('Error listing diffs:', error);
    return NextResponse.json({ error: 'Failed to fetch diffs' }, { status: 500 });
  }
}
