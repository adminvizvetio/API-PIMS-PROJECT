import { getConnection } from "@/utils/server/db_pulse";
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

  const tableName = `${prefix}transactions`;

  try {
    const pool = await getConnection(config, useLocalEvn);

    //Batching Inserts
    const values = content
      .map((item) => {
        const {
          Id,
          Type,
          ClientId,
          ClientPmsId,
          PatientId,
          PatientPmsId,
          TransactionDate,
          Sequence,
          Code,
          CodeId,
          Description,
          Quantity,
          Amount,
          DiscountAmount,
          ProviderID,
          ProviderName,
          EnteredById,
          IsPayment,
          IsPosted,
          IsVoided,
          IsDepletionOnly,
          IsHiddenOnInvoice,
          Comments,
          InvoiceId,
          InvoiceNumber,
          SiteId,
          DBID,
          APICreateDate,
          APILastChangeDate,
          APIRemovedDate,
          InstallationId,
        } = item;
        return `('${Id}', '${Type}', '${escapeSQL(ClientId)}', '${escapeSQL(ClientPmsId)}', '${escapeSQL(PatientId)}', '${escapeSQL(PatientPmsId)}', '${TransactionDate}', '${Sequence}', '${Code}', '${CodeId}', '${escapeSQLWithLimitLength(Description)}', '${Quantity}', '${Amount}', '${DiscountAmount}', '${escapeSQL(ProviderID)}', '${escapeSQL(ProviderName)}', '${EnteredById}', '${IsPayment}', '${IsPosted}', '${IsVoided}', '${IsDepletionOnly}', '${IsHiddenOnInvoice}', '${escapeSQL(Comments)}', '${InvoiceId}', '${InvoiceNumber}', '${SiteId}', '${DBID}', '${APICreateDate}', '${APILastChangeDate}', '${APIRemovedDate}', '${escapeSQL(InstallationId)}', '${escapeSQL(accountId)}', '${new Date().toISOString().slice(0, 19).replace("T", " ")}')`;
      })
      .join(",");

    let query = `INSERT INTO ${tableName} (pulse_id, type, client_id, client_pms_id, patient_id, patient_pms_id, transaction_date, sequence, code, code_id, description, quantity, amount, discount_amount, provider_id, provider_name, entered_by_id, is_payment, is_posted, is_voided, is_depletion_only, is_hidden_on_invoice, comments, invoice_id, invoice_number, site_id, dbid, api_create_date, api_last_change_date, api_removed_date, installation_id, account_id, inserted_at) VALUES ${values}`;
    console.log('query', query)
    const result = await pool.request().query(query);
    // console.log("result", result);
    // console.log("Data inserted successfully");

    return Response.json({ message: "Data inserted successfully" });
  } catch (err) {
    console.error("Transaction Error:", err);
    return Response.json({ error: "Error inserting users" }, { status: 500 });
  }
}
