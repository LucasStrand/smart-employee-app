import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { azureAdId, name, email, role } = await request.json();

    // Validate required fields
    if (!azureAdId || !name || !email) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert or update the user (to handle re-authentication)
    const result = await sql`
      INSERT INTO users (azure_ad_id, name, email, role, created_datetime, last_login_datetime)
      VALUES (${azureAdId}, ${name}, ${email}, ${role || "employee"}, NOW(), NOW())
      ON CONFLICT (azure_ad_id) 
      DO UPDATE SET 
        last_login_datetime = NOW();
    `;

    return Response.json(
      { message: "User saved successfully", result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving user:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
