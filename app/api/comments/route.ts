import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { diffId, lineNumber, side, content, author, authorHandle, isLineStatus } = body;

    const comment = await prisma.comment.create({
      data: {
        diffId,
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
