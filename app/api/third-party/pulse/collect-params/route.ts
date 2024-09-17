import {
  EZY_ENP_PRODUCT_V2,
  FILTER_BY_DATE_DAY,
  FILTER_BY_DATE_MONTH,
  FILTER_BY_DATE_QUARTER,
  FILTER_BY_DATE_RANGE,
  FILTER_BY_DATE_WEEK,
  FILTER_BY_DATE_YEAR,
  ITEM_MAX_LIMIT,
  PULSE_API,
  PULSE_API_VERSION,
  PULSE_CLIENTS_FILTER_FIELD,
  PULSE_CODES_FILTER_FIELD,
  PULSE_ENP_CLIENTS,
  PULSE_ENP_CODES,
  PULSE_ENP_INVOICES,
  PULSE_ENP_PATIENTS,
  PULSE_ENP_SITES,
  PULSE_ENP_TRANSACTIONS,
  PULSE_INVOICE_FILTER_FIELD,
  PULSE_PATIENTS_FILTER_FIELD,
  PULSE_SITES_FILTER_FIELD,
  PULSE_TRANSACTION_FILTER_FIELD,
  SELECT_PAGE_NUMBER,
  SELECT_PAGE_RANGE,
} from "@/utils/constants";
import { getNextDay, setTimeToMidnight } from "@/utils/utils";
import axios from "axios";

const API_URL: string | undefined = process.env.PULSE_API_URL;
export const maxDuration = 300; // pro version in vercel

export async function POST(request: Request) {
  try {
    const {
      token,
      installation,
      startDate,
      endDate,
      byDate,
      byPage,
      pageSize,
      pageStart,
      pageEnd,
      endpoint,
    } = await request.json();

    const version = PULSE_API_VERSION;
    const bearer_token: string = `Bearer ${token}`;

    let $filter;

    if (
      byDate === FILTER_BY_DATE_DAY ||
      byDate === FILTER_BY_DATE_WEEK ||
      byDate === FILTER_BY_DATE_MONTH ||
      byDate === FILTER_BY_DATE_QUARTER ||
      byDate === FILTER_BY_DATE_YEAR ||
      byDate === FILTER_BY_DATE_RANGE
    ) {
      const start = setTimeToMidnight(startDate);
      const end = setTimeToMidnight(getNextDay(endDate));

      if (endpoint === PULSE_ENP_INVOICES) {
        $filter = `${PULSE_INVOICE_FILTER_FIELD} ge datetime'${start}' and ${PULSE_INVOICE_FILTER_FIELD} lt datetime'${end}'`;
      }

      if (endpoint === PULSE_ENP_TRANSACTIONS) {
        $filter = `${PULSE_TRANSACTION_FILTER_FIELD} ge datetime'${start}' and ${PULSE_TRANSACTION_FILTER_FIELD} lt datetime'${end}'`;
      }

      if (endpoint === PULSE_ENP_CLIENTS) {
        $filter = `${PULSE_CLIENTS_FILTER_FIELD} ge datetime'${start}' and ${PULSE_CLIENTS_FILTER_FIELD} lt datetime'${end}'`;
      }

      if (endpoint === PULSE_ENP_CODES) {
        $filter = `${PULSE_CODES_FILTER_FIELD} ge datetime'${start}' and ${PULSE_CODES_FILTER_FIELD} lt datetime'${end}'`;
      }

      if (endpoint === PULSE_ENP_PATIENTS) {
        $filter = `${PULSE_PATIENTS_FILTER_FIELD} ge datetime'${start}' and ${PULSE_PATIENTS_FILTER_FIELD} lt datetime'${end}'`;
      }

      if (endpoint === PULSE_ENP_SITES) {
        $filter = `${PULSE_SITES_FILTER_FIELD} ge datetime'${start}' and ${PULSE_SITES_FILTER_FIELD} lt datetime'${end}'`;
      }
    }

    let $top = ITEM_MAX_LIMIT; // limit
    let $skip = $top * (Number(1) - 1); // page

    let params;
    if (byPage === SELECT_PAGE_NUMBER || byPage === SELECT_PAGE_RANGE) {
      $top = Number(pageSize);

      params = {
        $top,
        $skip: $top * (Number(pageStart) - 1),
        $inlinecount: "allpages",
        $filter,
      };
    } else {
      params = {
        $top,
        $skip,
        $inlinecount: "allpages",
        $filter,
      };
    }

    // console.log("params", params);
    console.log(
      "`${API_URL}/${version}/${endpoint}`",
      `${API_URL}/${version}/${endpoint}`
    );

    const response = await axios.get(`${API_URL}/${version}/${endpoint}`, {
      params,
      headers: {
        Authorization: bearer_token,
        Accept: "application/json",
        Installation: installation,
      },
    });

    const totalPageCount =
      Math.floor((Number(response.data["odata.count"]) - 1) / Number($top)) + 1;
    let paramsList = [];
    if (byPage === SELECT_PAGE_NUMBER || byPage === SELECT_PAGE_RANGE) {
      for (let page = Number(pageStart); page <= Number(pageEnd); page++) {
        paramsList.push({
          $top,
          $skip: $top * (Number(page) - 1),
          $filter,
        });
      }
    } else {
      for (let i = 0; i < totalPageCount; i++) {
        paramsList.push({
          $top,
          $skip: Number($top) * (Number(i + 1) - 1),
          $filter,
        });
      }
    }

    return Response.json({
      paramsList,
      items_page_total: totalPageCount,
      items_total: Number(response.data["odata.count"]),
    });
  } catch (error: any) {
    if (error.response && error.response.status === 429) {
      console.error("429 Error fetching data:", error);

      return Response.json(
        // { error: error.response.data },
        { error: "429 Error fetching data" },
        { status: 429, statusText: error.response.statusText }
      );
    } else {
      console.error("Error fetching data:", error);
      return Response.json(
        { error: "Error fetching data" },
        { status: 400, statusText: "" }
      );
    }
  }
}
