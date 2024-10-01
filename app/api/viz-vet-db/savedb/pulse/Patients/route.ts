import { getConnection } from "@/utils/server/db_pulse";
import { closeConnection } from "@/utils/server/db_ezyvet";
import { escapeSQL, escapeSQLWithLimitLength } from "@/utils/utils";

export async function POST(request: Request) {
  const { content, config, useLocalEvn, prefix, accountId } =
    await request.json();

  if (!Array.isArray(content) || content.length === 0) {
    return Response.json(
      { error: "Invalid or empty data array" },
      { status: 400 }
    );
  }

  const tableName = `${prefix}patients`;

  try {
    closeConnection();
    const pool = await getConnection(config, useLocalEvn);

    //Batching Inserts
    const values = content
      .map((item) => {
        const {
          Id,
          PmsId,
          Name,
          Species,
          SpeciesDescription,
          Breed,
          BreedDescription,
          Color,
          ColorDescription,
          Gender,
          GenderDescription,
          DateOfBirth,
          DateOfDeath,
          EnteredDate,
          FirstVisitDate,
          Deleted,
          IsDeceased,
          Inactive,
          CurrentWeight,
          CurrentWeightUnit,
          LastTransactionDate,
          Image,
          SiteId,
          SuspendReminders,
          PatientNotesString,
          DBID,
          APICreateDate,
          APILastChangeDate,
          APIRemovedDate,
          InstallationId,
        } = item;
        return `('${Id}', '${escapeSQL(PmsId)}', '${escapeSQL(Name)}', '${Species}', '${escapeSQLWithLimitLength(SpeciesDescription)}', '${Breed}', '${escapeSQLWithLimitLength(BreedDescription)}', '${Color}', '${escapeSQLWithLimitLength(ColorDescription)}', '${Gender}', '${escapeSQLWithLimitLength(GenderDescription)}', '${DateOfBirth}', '${DateOfDeath}', '${EnteredDate}', '${FirstVisitDate}', '${Deleted}', '${IsDeceased}', '${Inactive}', '${CurrentWeight}', '${CurrentWeightUnit}', '${LastTransactionDate}', '${Image}', '${SiteId}', '${SuspendReminders}', '${escapeSQL(PatientNotesString)}', '${DBID}', '${APICreateDate}', '${APILastChangeDate}', '${APIRemovedDate}', '${escapeSQL(InstallationId)}', '${escapeSQL(accountId)}', '${new Date().toISOString().slice(0, 19).replace("T", " ")}')`;
      })
      .join(",");

    let query = `INSERT INTO ${tableName} (pulse_id, pms_id, name, species, species_description, breed, breed_description, color, color_description, gender, gender_description, date_of_birth, date_of_death, entered_date, first_visit_date, deleted, is_deceased, in_active, current_weight, current_weight_unit, last_transaction_date, image, site_id, suspend_reminders, patient_notes_string, dbid, api_create_date, api_last_change_date, api_removed_date, installation_id, account_id, inserted_at) VALUES ${values}`;
    // console.log('query', query)
    const result = await pool.request().query(query);
    // console.log("result", result);
    // console.log("Data inserted successfully");

    return Response.json({ message: "Data inserted successfully" });
  } catch (err) {
    console.error("Transaction Error:", err);
    return Response.json({ error: "Error inserting users" }, { status: 500 });
  }
}
