"use server";

import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function markAsSold(threadId: number, currentUserId: number) {
  try {
    // The "AND user_id = currentUserId" part is the security lock!
    // It guarantees that even if someone hacks the button, the database 
    // will refuse to update it unless they are the true owner.
    await sql`
      UPDATE threads 
      SET is_sold = TRUE 
      WHERE id = ${threadId} AND user_id = ${currentUserId}
    `;

    // Refresh the pages so the "SOLD" badge appears instantly
    revalidatePath(`/threads/${threadId}`);
    revalidatePath('/'); // Add your specific board paths here if needed
    
    return { success: true };
  } catch (error) {
    console.error("Failed to mark as sold:", error);
    return { success: false };
  }
}
