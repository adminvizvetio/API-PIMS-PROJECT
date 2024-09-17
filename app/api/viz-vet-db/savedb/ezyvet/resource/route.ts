import { getConnection } from "@/utils/server/db_ezyvet";

export const maxDuration = 300; // pro version in vercel
import { escapeSQL } from "@/utils/utils";
export async function POST(request: Request) {
  const { content, config, useLocalEvn, prefix, accountId } =
    await request.json();

  if (!Array.isArray(content) || content.length === 0) {
    return Response.json(
      { error: "Invalid or empty data array" },
      { status: 400 }
    );
  }

  const tableName = `${prefix}resources`;

  try {
    const pool = await getConnection(config, useLocalEvn);

    //Batching Inserts
    const values = content
      .map((item) => {
        const {
          id,
          active,
          name,
          type,
          access,
          ownership_id,
          created_at,
          modified_at,
        } = item.resource;
        return `('${id}', '${active}', '${escapeSQL(name)}', '${type}', '${access}', '${ownership_id}', '${created_at}', '${modified_at}', '${escapeSQL(accountId)}', '${new Date().toISOString().slice(0, 19).replace("T", " ")}')`;
      })
      .join(",");

    let query = `INSERT INTO ${tableName} (ezyvet_id, active, name, type, access, ownership_id, created_at, updated_at, account_id, inserted_at) VALUES ${values}`;
    // console.log('query', query)
    const result = await pool.request().query(query);
    // console.log("result", result);
    console.log("Data inserted successfully");

    return Response.json({ message: "Data inserted successfully" });
  } catch (err) {
    return Response.json({ error: "Error inserting users" }, { status: 500 });
  }
}
