import { neon } from "@neondatabase/serverless";

import { requireAuth } from "@/lib/requireAuth";

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const body = await request.json().catch(() => ({}));
    const name =
      (typeof body.name === "string" && body.name) ||
      (typeof auth.payload.name === "string" && auth.payload.name) ||
      "Unknown User";
    const email =
      (typeof body.email === "string" && body.email) ||
      (typeof auth.payload.email === "string" && auth.payload.email) ||
      (typeof auth.payload.preferred_username === "string" &&
        auth.payload.preferred_username) ||
      "No Email";
    const role =
      (typeof body.role === "string" && body.role) || "employee";

    const oid = auth.oid ?? auth.azureAdId;
    const sub = auth.sub ?? auth.azureAdId;

    const [existing] = await sql`
      SELECT id, azure_ad_id FROM users
      WHERE azure_ad_id = ${oid} OR azure_ad_id = ${sub}
      LIMIT 1
    `;

    const canonicalId = auth.azureAdId;

    if (existing) {
      const [userRow] = await sql`
        UPDATE users
        SET
          name = ${name},
          email = ${email},
          azure_ad_id = ${canonicalId},
          last_login_datetime = NOW()
        WHERE id = ${existing.id}
        RETURNING id, azure_ad_id, name, email, role
      `;
      return Response.json(
        {
          message: "User saved successfully",
          userId: userRow.id,
          userRow,
        },
        { status: 200 }
      );
    }

    const [userRow] = await sql`
      INSERT INTO users (
        azure_ad_id,
        name,
        email,
        role,
        created_datetime,
        last_login_datetime
      ) VALUES (
        ${canonicalId},
        ${name},
        ${email},
        ${role},
        NOW(),
        NOW()
      )
      RETURNING id, azure_ad_id, name, email, role
    `;

    return Response.json(
      {
        message: "User saved successfully",
        userId: userRow.id,
        userRow,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving user:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
