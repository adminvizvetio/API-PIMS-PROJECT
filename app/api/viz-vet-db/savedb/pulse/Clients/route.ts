import { getConnection } from "@/utils/server/db_pulse";
import { closeConnection } from "@/utils/server/db_ezyvet";
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

  const tableName = `${prefix}clients`;

  try {
    closeConnection();
    const pool = await getConnection(config, useLocalEvn);

    //Batching Inserts
    const values = content
      .map((item) => {
        const {
          Id,
          PmsId,
          LastName,
          FirstName,
          Title,
          SignificantOther,
          EnteredDate,
          FirstVisitDate,
          Deleted,
          Inactive,
          SuspendReminders,
          EmailReminders,
          SiteId,
          DBID,
          APICreateDate,
          APILastChangeDate,
          APIRemovedDate,
          InstallationId,
        } = item;
        return `('${Id}', '${PmsId}', '${escapeSQL(LastName)}', '${escapeSQL(FirstName)}', '${escapeSQL(Title)}', '${escapeSQL(SignificantOther)}', '${EnteredDate}', '${FirstVisitDate}', '${Deleted}', '${Inactive}', '${escapeSQL(SuspendReminders)}', '${escapeSQL(EmailReminders)}', '${SiteId}', '${DBID}', '${APICreateDate}', '${APILastChangeDate}', '${APIRemovedDate}', '${escapeSQL(InstallationId)}', '${escapeSQL(accountId)}', '${new Date().toISOString().slice(0, 19).replace("T", " ")}')`;
      })
      .join(",");

    let query = `INSERT INTO ${tableName} (pulse_id, pms_id, last_name, first_name, title, significant_other, entered_date, first_visit_date, deleted, inactive, suspend_reminders, email_reminders, site_id, dbid, api_create_date, api_last_change_date, api_removed_date, installation_id, account_id, inserted_at) VALUES ${values}`;
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
