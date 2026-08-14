import { neon } from "@neondatabase/serverless";

import { requireLocalUser } from "@/lib/requireAuth";

const sql = neon(process.env.DATABASE_URL || "");

export async function GET(request: Request) {
  const user = await requireLocalUser(request);
  if (!user.ok) return user.response;

  try {
    const query = `
      SELECT
        todo_lists.id,
        todo_lists.name,
        todo_lists.description,
        todo_lists.belongs_to,
        todo_lists.created,
        COALESCE(
          json_agg(
            json_build_object(
              'id', todos.id,
              'text', todos.text,
              'completed', todos.completed
            )
          ) FILTER (WHERE todos.id IS NOT NULL),
          '[]'
        ) AS todos
      FROM todo_lists
      LEFT JOIN todos ON todo_lists.id = todos.todolist_id
      WHERE todo_lists.user_id = $1
        AND COALESCE(todo_lists.is_history, FALSE) = FALSE
      GROUP BY todo_lists.id
      ORDER BY todo_lists.created DESC;
    `;

    const rows = await sql(query, [user.userId]);

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching assigned to-do lists:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: (error as Error).message || "Unknown error",
      }),
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await requireLocalUser(request);
  if (!user.ok) return user.response;

  try {
    const { todoListId } = await request.json();

    if (!todoListId) {
      return new Response(JSON.stringify({ error: "Missing todoListId" }), {
        status: 400,
      });
    }

    const result = await sql`
        UPDATE todo_lists
        SET user_id = ${user.userId}
        WHERE id = ${todoListId} AND user_id IS NULL
        RETURNING id, name, user_id;
      `;

    if (result.length === 0) {
      return new Response(
        JSON.stringify({ error: "Todo List not found or already assigned" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Todo List assigned successfully",
        assignedTodoList: result[0],
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error assigning todo list:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: (error as Error).message || "Unknown error",
      }),
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const user = await requireLocalUser(request);
  if (!user.ok) return user.response;

  try {
    const { todoListId } = await request.json();

    if (!todoListId) {
      return new Response(JSON.stringify({ error: "Missing todoListId" }), {
        status: 400,
      });
    }

    const result = await sql`
      UPDATE todo_lists
      SET user_id = NULL
      WHERE id = ${todoListId} AND user_id = ${user.userId}
      RETURNING id, user_id, name;
    `;

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Todo list not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Todo list unassigned successfully",
        unassignedList: result[0],
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error unassigning todo list:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: (error as Error).message || "Unknown error",
      }),
      { status: 500 }
    );
  }
}
