import { neon } from "@neondatabase/serverless";

import { requireAuth, requireLocalUser } from "@/lib/requireAuth";

const sql = neon(`${process.env.DATABASE_URL}`);

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  try {
    const { workorders } = await request.json();

    if (!workorders || !Array.isArray(workorders)) {
      return Response.json(
        { error: "Invalid workorders data" },
        { status: 400 }
      );
    }

    const defaultTodos = await sql`SELECT text FROM default_todos;`;

    for (const workorder of workorders) {
      const {
        id: workorder_id,
        name,
        description,
        projectnumber,
        projectname,
      } = workorder;

      const [existingList] = await sql`
          SELECT id FROM todo_lists WHERE workorder_id = ${workorder_id};
        `;
      if (existingList) continue;

      const [newList] = await sql`
          INSERT INTO todo_lists (workorder_id, name, description, belongs_to, created)
          VALUES (${workorder_id}, ${name}, ${description}, ${projectnumber + " - " + projectname}, NOW())
          RETURNING id;
        `;

      for (const todo of defaultTodos) {
        await sql`
            INSERT INTO todos (todolist_id, text, completed)
            VALUES (${newList.id}, ${todo.text}, FALSE);
          `;
      }
    }

    return Response.json({ message: "ToDo lists created successfully" });
  } catch (error) {
    console.error("Error syncing work orders:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  try {
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("query") || "";
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    const results = await sql`
        SELECT * FROM todo_lists
        WHERE
          belongs_to ILIKE ${"%" + searchQuery + "%"} OR
          name ILIKE ${"%" + searchQuery + "%"} OR
          description ILIKE ${"%" + searchQuery + "%"}
        LIMIT ${limit}; 
      `;

    return Response.json(results);
  } catch (error) {
    console.error("Error searching todolists:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await requireLocalUser(request);
  if (!user.ok) return user.response;

  try {
    const { id, completed } = await request.json();

    if (!id || typeof completed !== "boolean") {
      return Response.json({ error: "Invalid data" }, { status: 400 });
    }

    const [owned] = await sql`
        SELECT todos.id
        FROM todos
        JOIN todo_lists ON todos.todolist_id = todo_lists.id
        WHERE todos.id = ${id} AND todo_lists.user_id = ${user.userId}
        LIMIT 1
      `;

    if (!owned) {
      return Response.json({ error: "Todo not found" }, { status: 404 });
    }

    const updated = await sql`
        UPDATE todos
        SET completed = ${completed}
        WHERE id = ${id}
        RETURNING id, completed;
      `;

    return Response.json({
      message: "Todo updated successfully",
      todo: updated[0],
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
