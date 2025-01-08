import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("user_id");

    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing user_id" }), {
        status: 400,
      });
    }

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
      GROUP BY todo_lists.id
      ORDER BY todo_lists.created DESC;
    `;

    // Use the second overload of `sql` for a string query
    const rows = await sql(query, [userId]); // Pass parameters as an array

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
  try {
    const { todoListId, userId } = await request.json();

    if (!todoListId || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing todoListId or userId" }),
        { status: 400 }
      );
    }

    // Update the `user_id` column in the `todo_lists` table
    const result = await sql`
        UPDATE todo_lists
        SET user_id = ${userId}
        WHERE id = ${todoListId}
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
  try {
    const { todoListId } = await request.json();

    if (!todoListId) {
      return new Response(JSON.stringify({ error: "Missing todoListId" }), {
        status: 400,
      });
    }

    // Set user_id = NULL for the specified list
    const result = await sql`
      UPDATE todo_lists
      SET user_id = NULL
      WHERE id = ${todoListId}
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
