import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // 1. Delete the post
    await sql`DELETE FROM posts WHERE id = ${postId}`;

    // Note: You might want to update thread/board counts here as well
    // but for a simple moderator tool, this removes the content immediately.

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (err: any) {
    console.error('Admin Delete Error:', err.message);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
