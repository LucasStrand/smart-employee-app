import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

// POST: Create ToDo lists for workorders
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
      const { id: workorder_id, name, description } = workorder;

      // Check if ToDo list already exists
      const [existingList] = await sql`
        SELECT id FROM todo_lists WHERE workorder_id = ${workorder_id};
      `;
      if (existingList) continue;

      // Create ToDo list
      const [newList] = await sql`
        INSERT INTO todo_lists (workorder_id, name, description, created)
        VALUES (${workorder_id}, ${name}, ${description || ""}, NOW())
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
    console.error("Error creating ToDo lists:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET: Retrieve all ToDo lists with their tasks
export async function GET() {
  try {
    const todolists = await sql`
      SELECT 
        todo_lists.id AS todolist_id, 
        todo_lists.name AS todolist_name, 
        todo_lists.description AS todolist_description,
        todos.id AS todo_id,
        todos.text AS todo_text,
        todos.completed AS todo_completed
      FROM todo_lists
      LEFT JOIN todos ON todo_lists.id = todos.todolist_id;
    `;

    // Group todos under their respective to-do lists
    const groupedData: Record<number, any> = {};

    todolists.forEach((row) => {
      const {
        todolist_id,
        todolist_name,
        todolist_description,
        todo_id,
        todo_text,
        todo_completed,
      } = row;

      if (!groupedData[todolist_id]) {
        groupedData[todolist_id] = {
          id: todolist_id,
          name: todolist_name,
          description: todolist_description,
          todos: [],
        };
      }

      if (todo_id) {
        groupedData[todolist_id].todos.push({
          id: todo_id,
          text: todo_text,
          completed: todo_completed,
        });
      }
    });

    return Response.json(Object.values(groupedData));
  } catch (error) {
    console.error("Error fetching ToDo lists:", error);
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
