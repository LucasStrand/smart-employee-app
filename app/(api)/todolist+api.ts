import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);
// POST: Create ToDo lists for active workorders
export async function POST(request: Request) {
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

      // Check if ToDo list already exists
      const [existingList] = await sql`
          SELECT id FROM todo_lists WHERE workorder_id = ${workorder_id};
        `;
      if (existingList) continue;

      // Create ToDo list
      const [newList] = await sql`
          INSERT INTO todo_lists (workorder_id, name, description, belongs_to, created)
          VALUES (${workorder_id}, ${name}, ${description}, ${projectnumber + " - " + projectname}, NOW())
          RETURNING id;
        `;

      // Insert default tasks
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

// GET: Search all ToDo lists
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("query") || "";
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    const results = await sql`
        SELECT * FROM todo_lists
        WHERE
          belongs_to ILIKE ${"%" + searchQuery + "%"} OR
          name ILIKE ${"%" + searchQuery + "%"} OR
          description ${"%" + searchQuery + "%"}
        LIMIT ${limit}; 
      `;

    return Response.json(results);
  } catch (error) {
    console.error("Error searching todolists:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: Update a single todo's completed status
export async function PATCH(request: Request) {
  try {
    // Extract the ID and completed status from the request body
    const { id, completed } = await request.json();

    if (!id || typeof completed !== "boolean") {
      return Response.json({ error: "Invalid data" }, { status: 400 });
    }

    // Update the todo in the database
    const updated = await sql`
        UPDATE todos
        SET completed = ${completed}
        WHERE id = ${id}
        RETURNING id, completed;
      `;

    // Handle cases where the todo is not found
    if (updated.length === 0) {
      return Response.json({ error: "Todo not found" }, { status: 404 });
    }

    // Return success response
    return Response.json({
      message: "Todo updated successfully",
      todo: updated[0],
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
