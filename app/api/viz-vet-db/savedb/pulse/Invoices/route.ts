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

  const updateContent = content.map((item) => ({
    ...item,
    CustomDate: item.Date,
  }));

  const tableName = `${prefix}invoices`;

  try {
    closeConnection();
    const pool = await getConnection(config, useLocalEvn);

    //Batching Inserts
    const values = updateContent
      .map((item) => {
        const {
          Id,
          Number,
          CustomDate,
          ClientId,
          ClientPmsId,
          EnteredById,
          Amount,
          DiscountAmount,
          AdjustmentAmount,
          TotalTaxAmount,
          PmsStatus,
          IsComplete,
          IsPaid,
          SiteId,
          DBID,
          APICreateDate,
          APILastChangeDate,
          APIRemovedDate,
          InstallationId,
        } = item;
        return `('${Id}', '${Number}', '${CustomDate}', '${ClientId}', '${escapeSQL(ClientPmsId)}', '${EnteredById}', '${Amount}', '${DiscountAmount}', '${AdjustmentAmount}', '${TotalTaxAmount}', '${PmsStatus}', '${IsComplete}', '${IsPaid}', '${SiteId}', '${DBID}', '${APICreateDate}', '${APILastChangeDate}', '${APIRemovedDate}', '${escapeSQL(InstallationId)}', '${escapeSQL(accountId)}', '${new Date().toISOString().slice(0, 19).replace("T", " ")}')`;
      })
      .join(",");

    let query = `INSERT INTO ${tableName} (pulse_id, number, date, client_id, client_pms_id, entered_by_id, amount, discount_amount, adjustment_amount, total_tax_amount, pms_status, is_complete, is_paid, site_id, dbid, api_create_date, api_last_change_date, api_removed_date, installation_id, account_id, inserted_at) VALUES ${values}`;
    // console.log('query', query)
    const result = await pool.request().query(query);
    // console.log("result", result);
    // console.log("Data inserted successfully");

    return Response.json({ message: "Data inserted successfully" });
  } catch (err) {
    console.log("err", err);
    return Response.json({ error: "Error inserting users" }, { status: 500 });
  }
}
