import {
  FILTER_BY_DATE_ALL,
  PULSE_ENP_CLIENTS,
  PULSE_ENP_CODES,
  PULSE_ENP_ClientPatientRelationships,
  PULSE_ENP_INVOICES,
  PULSE_ENP_PATIENTS,
  PULSE_ENP_SITES,
  PULSE_ENP_TRANSACTIONS,
} from "@/utils/constants";
import { getConnection } from "@/utils/server/db_pulse";
import { getNextDay, setTimeToMidnight } from "@/utils/utils";
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
    const pool = await getConnection(config, useLocalEvn);

    let tableName;

    if (endpoint === PULSE_ENP_INVOICES) {
      tableName = `${prefix}invoices`;
    }

    if (endpoint === PULSE_ENP_TRANSACTIONS) {
      tableName = `${prefix}transactions`;
    }

    if (endpoint === PULSE_ENP_CLIENTS) {
      tableName = `${prefix}clients`;
    }

    if (endpoint === PULSE_ENP_CODES) {
      tableName = `${prefix}codes`;
    }

    if (endpoint === PULSE_ENP_PATIENTS) {
      tableName = `${prefix}patients`;
    }

    if (endpoint === PULSE_ENP_SITES) {
      tableName = `${prefix}sites`;
    }

    if (endpoint === PULSE_ENP_ClientPatientRelationships) {
      tableName = `${prefix}client_patient_relationships`;
    }

    const start = setTimeToMidnight(fromDate);
    const end = setTimeToMidnight(getNextDay(toDate));

    let query: any;

    if (byDate === FILTER_BY_DATE_ALL) {
      query = `SELECT pulse_id FROM ${tableName} WHERE account_id = '${accountId}';`;
    } else {
      if (endpoint === PULSE_ENP_INVOICES) {
        query = `SELECT pulse_id FROM ${tableName} WHERE account_id = '${accountId}' AND [date] >= '${start}' AND [date] < '${end}';`;
      } else if (endpoint === PULSE_ENP_TRANSACTIONS) {
        query = `SELECT pulse_id FROM ${tableName} WHERE account_id = '${accountId}' AND [transaction_date] >= '${start}' AND [transaction_date] < '${end}';`;
      } else if (endpoint === PULSE_ENP_CLIENTS) {
        query = `SELECT pulse_id FROM ${tableName} WHERE account_id = '${accountId}' AND [entered_date] >= '${start}' AND [entered_date] < '${end}';`;
      } else if (endpoint === PULSE_ENP_CODES) {
        query = `SELECT pulse_id FROM ${tableName} WHERE account_id = '${accountId}' AND [api_create_date] >= '${start}' AND [api_create_date] < '${end}';`;
      } else if (endpoint === PULSE_ENP_PATIENTS) {
        query = `SELECT pulse_id FROM ${tableName} WHERE account_id = '${accountId}' AND [entered_date] >= '${start}' AND [entered_date] < '${end}';`;
      } else if (endpoint === PULSE_ENP_SITES) {
        query = `SELECT pulse_id FROM ${tableName} WHERE account_id = '${accountId}' AND [api_create_date] >= '${start}' AND [api_create_date] < '${end}';`;
      } else if (endpoint === PULSE_ENP_ClientPatientRelationships) {
        query = `SELECT pulse_id FROM ${tableName} WHERE account_id = '${accountId}' AND [start_date] >= '${start}' AND [start_date] < '${end}';`;
      }
    }

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
