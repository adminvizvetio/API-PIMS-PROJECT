import { getConnection } from "@/utils/server/db_ezyvet";
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

  const tableName = `${prefix}animals`;

  try {
    const pool = await getConnection(config, useLocalEvn);

    //Batching Inserts
    const values = content
      .map((item) => {
        const {
          id,
          active,
          code,
          sex_id,
          species_id,
          modified_at,
          name,
          is_hostile,
          breed_id,
          date_of_rabies_vaccination,
          contact_id,
          date_of_birth,
          date_of_death,
          referring_clinic_id,
          referring_vet_id,
          residence_contact_id,
          weight,
          weight_unit,
          guid,
        } = item.animal;
        return `('${id}', '${active}', '${escapeSQL(code)}', '${sex_id}', '${species_id}', '${modified_at}', '${escapeSQL(name)}', '${is_hostile}', '${breed_id}', '${date_of_rabies_vaccination}', '${contact_id}', '${date_of_birth}', '${date_of_death}', '${referring_clinic_id}', '${referring_vet_id}', '${residence_contact_id}', '${weight}', '${weight_unit}', '${escapeSQL(guid)}', '${escapeSQL(accountId)}', '${new Date().toISOString().slice(0, 19).replace("T", " ")}')`;
      })
      .join(",");

    let query = `INSERT INTO ${tableName} (ezyvet_id, active, code, sex_id, species_id, updated_at, name, is_hostile, breed_id, date_of_rabies_vaccination, contact_id, date_of_birth, date_of_death, referring_clinic_id, referring_vet_id, residence_contact_id, weight, weight_unit, guid, account_id, inserted_at) VALUES ${values}`;
    // console.log('query', query)
    const result = await pool.request().query(query);
    // console.log("result", result);
    console.log("Data inserted successfully");

    return Response.json({ message: "Data inserted successfully" });
  } catch (err) {
    console.log(err);
    return Response.json({ error: "Error inserting users" }, { status: 500 });
  }
}
