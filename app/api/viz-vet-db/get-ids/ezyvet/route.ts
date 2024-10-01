import {
  EZY_ENP_ANIMAL,
  EZY_ENP_CONTACT,
  EZY_ENP_INVOICE,
  EZY_ENP_INVOICELINE,
  EZY_ENP_PRODUCT_V2,
  EZY_ENP_PRODUCTGROUP,
  EZY_ENP_RESOURCE,
  EZY_ENP_SEPARATION,
  EZY_ENP_SEX,
  EZY_ENP_SPECIES,
  FILTER_BY_DATE_ALL,
} from "@/utils/constants";
import { closeConnection } from "@/utils/server/db_pulse";
import { getConnection } from "@/utils/server/db_ezyvet";
import { getNextDay, dateToSQLTime, setTimeToMidnight } from "@/utils/utils";
export const maxDuration = 300; // pro version in vercel

export async function POST(request: Request) {
  const {
    config,
    useLocalEvn,
    endpoint,
    accountId,
    fromDate,
    toDate,
    prefix,
    byDate,
  } = await request.json();

  try {
    closeConnection();
    const pool = await getConnection(config, useLocalEvn);

    let tableName;

    if (endpoint === EZY_ENP_ANIMAL) {
      tableName = `${prefix}animals`;
    }
    if (endpoint === EZY_ENP_CONTACT) {
      tableName = `${prefix}contacts`;
    }
    if (endpoint === EZY_ENP_INVOICE) {
      tableName = `${prefix}invoices`;
    }
    if (endpoint === EZY_ENP_INVOICELINE) {
      tableName = `${prefix}invoice_lines`;
    }
    if (endpoint === EZY_ENP_RESOURCE) {
      tableName = `${prefix}resources`;
    }
    if (endpoint === EZY_ENP_PRODUCT_V2) {
      tableName = `${prefix}products_v2`;
    }
    if (endpoint === EZY_ENP_PRODUCTGROUP) {
      tableName = `${prefix}product_groups`;
    }
    if (endpoint === EZY_ENP_SEPARATION) {
      tableName = `${prefix}separations`;
    }
    if (endpoint === EZY_ENP_SEX) {
      tableName = `${prefix}sexs`;
    }
    if (endpoint === EZY_ENP_SPECIES) {
      tableName = `${prefix}species`;
    }

    /* console.log(
      "tablename, accountId, start, end",
      tableName,
      accountId,
      fromDate,
      toDate
    ); */
    let query;

    if (byDate === FILTER_BY_DATE_ALL) {
      query = `SELECT ezyvet_id FROM ${tableName} WHERE account_id = '${accountId}';`;
    } else {
      if (endpoint === EZY_ENP_ANIMAL) {
        query = `SELECT ezyvet_id FROM ${tableName} WHERE account_id = '${accountId}' AND updated_at >= '${dateToSQLTime(setTimeToMidnight(fromDate))}' AND updated_at < '${dateToSQLTime(getNextDay(setTimeToMidnight(toDate)))}';`;
      } else {
        query = `SELECT ezyvet_id FROM ${tableName} WHERE account_id = '${accountId}' AND created_at >= '${dateToSQLTime(setTimeToMidnight(fromDate))}' AND created_at < '${dateToSQLTime(getNextDay(setTimeToMidnight(toDate)))}';`;
      }
    }

    // console.log("query", query);

    const result = await pool.request().query(query);

    // console.log("result", result);
    return Response.json(result.recordset);
  } catch (err) {
    console.log("err", err);
    return Response.json(
      { error: "Database connection failed:" },
      { status: 500 }
    );
  }
}
