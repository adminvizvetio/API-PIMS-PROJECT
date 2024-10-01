import { getConnection } from "@/utils/server/db_ezyvet";
import { closeConnection } from "@/utils/server/db_pulse";
import { escapeSQL } from "@/utils/utils";

export const maxDuration = 300; // pro version in vercel

export async function POST(request: Request) {
  const { content, config, useLocalEvn, prefix, accountId } =
    await request.json();

  if (!Array.isArray(content) || content.length === 0) {
    return Response.json(
      { error: "Invalid or empty data array" },
      { status: 400 }
    );
  }

  const tableName = `${prefix}separations`;

  try {
    closeConnection();
    const pool = await getConnection(config, useLocalEvn);

    //Batching Inserts
    const values = content
      .map((item) => {
        const {
          id,
          name,
          active,
          type,
          created_at,
          modified_at,
          parent,
          contact_id,
        } = item.separation;
        return `('${id}', '${escapeSQL(name)}', '${active}', '${type}', '${created_at}', '${modified_at}', '${escapeSQL(parent)}', '${contact_id}', '${escapeSQL(accountId)}', '${new Date().toISOString().slice(0, 19).replace("T", " ")}')`;
      })
      .join(",");

    let query = `INSERT INTO ${tableName} (ezyvet_id, name, active, type, created_at, updated_at, parent, contact_id, account_id, inserted_at) VALUES ${values}`;
    // console.log('query', query)
    const result = await pool.request().query(query);
    // console.log("result", result);
    console.log("Data inserted successfully");

    return Response.json({ message: "Data inserted successfully" });
  } catch (err) {
    return Response.json({ error: "Error inserting users" }, { status: 500 });
  }
}
