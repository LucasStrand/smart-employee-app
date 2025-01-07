import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { azureAdId, name, email, role } = await request.json();

    if (!azureAdId || !name || !email) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Postgres trick: RETURNING id after ON CONFLICT
    const [userRow] = await sql`
      INSERT INTO users (
        azure_ad_id,
        name,
        email,
        role,
        created_datetime,
        last_login_datetime
      ) VALUES (
        ${azureAdId},
        ${name},
        ${email},
        ${role || "employee"},
        NOW(),
        NOW()
      )
      ON CONFLICT (azure_ad_id)
      DO UPDATE SET
        last_login_datetime = NOW()
      RETURNING id, azure_ad_id, name, email, role;
    `;

    // userRow might look like { id: 3, azure_ad_id: "...", name: "...", ... }
    return Response.json(
      {
        message: "User saved successfully",
        userId: userRow.id, // We explicitly return the user's numeric ID
        userRow,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving user:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
