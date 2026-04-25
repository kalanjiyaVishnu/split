import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const diffId = searchParams.get('diffId');

    if (!diffId) {
      return NextResponse.json({ error: 'diffId is required' }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: { 
        diff: { shortId: diffId }
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { diffId, lineNumber, side, content, author, authorHandle, isLineStatus } = body;

    const diff = await prisma.diff.findUnique({
      where: { shortId: diffId }
    });

    if (!diff) {
       return NextResponse.json({ error: 'Diff not found' }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        diffId: diff.id,
        lineNumber,
        side,
        content,
        author: author || 'Anonymous',
        authorHandle,
        isLineStatus: isLineStatus || false,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error saving comment:', error);
    return NextResponse.json({ error: 'Failed to save comment' }, { status: 500 });
  }
}
