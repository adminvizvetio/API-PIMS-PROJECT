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

  const tableName = `${prefix}codes`;

  try {
    closeConnection();
    const pool = await getConnection(config, useLocalEvn);

    //Batching Inserts
    const values = content
      .map((item) => {
        const {
          Id,
          CodeType,
          Code,
          CodeDescription,
          CodeCategory,
          CodeCategoryDescription,
          BasePrice,
          Cost,
          MinimumPrice,
          MarkupType,
          MarkupValue,
          DispensingFee,
          DispensingFeeType,
          UnitOfMeasure,
          MaximumPrice,
          HasAssociations,
          Inactive,
          SiteId,
          DBID,
          APICreateDate,
          APILastChangeDate,
          APIRemovedDate,
          InstallationId,
          IsTaxable,
        } = item;
        return `('${Id}', '${CodeType}', '${Code}', '${escapeSQLWithLimitLength(CodeDescription)}', '${CodeCategory}', '${escapeSQLWithLimitLength(CodeCategoryDescription)}', '${BasePrice}', '${Cost}', '${MinimumPrice}', '${MarkupType}', '${MarkupValue}', '${DispensingFee}', '${DispensingFeeType}', '${UnitOfMeasure}', '${MaximumPrice}', '${HasAssociations}', '${Inactive}', '${SiteId}', '${DBID}', '${APICreateDate}', '${APILastChangeDate}', '${APIRemovedDate}', '${escapeSQL(InstallationId)}', '${IsTaxable}', '${escapeSQL(accountId)}', '${new Date().toISOString().slice(0, 19).replace("T", " ")}')`;
      })
      .join(",");

    let query = `INSERT INTO ${tableName} (pulse_id, code_type, code, code_description, code_category, code_category_description, base_price, cost, minimum_price, markup_type, markup_value, dispensing_fee, dispensing_fee_type, unit_of_measure, maximum_price, has_associations, inactive, site_id, dbid, api_create_date, api_last_change_date, api_removed_date, installation_id, is_taxable, account_id, inserted_at) VALUES ${values}`;
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
