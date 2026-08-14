import { neon } from "@neondatabase/serverless";

import { requireLocalUser } from "@/lib/requireAuth";

const sql = neon(process.env.DATABASE_URL || "");

export async function PATCH(request: Request) {
  const user = await requireLocalUser(request);
  if (!user.ok) return user.response;

  try {
    const { todoListId } = await request.json();

    if (!todoListId) {
      return Response.json({ error: "Missing todoListId" }, { status: 400 });
    }

    const result = await sql`
      UPDATE todo_lists
      SET is_history = TRUE
      WHERE id = ${todoListId} AND user_id = ${user.userId}
      RETURNING id, is_history;
    `;

    if (result.length === 0) {
      return Response.json({ error: "To-do list not found" }, { status: 404 });
    }

    return Response.json({
      message: "To-Do list archived successfully",
      archivedList: result[0],
    });
  } catch (error) {
    console.error("Error archiving todo list:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
