import axios from "axios";
import {
  EZY_ENP_INVOICE,
  EZY_ENP_INVOICELINE,
  EZY_ENP_PRODUCT_V2,
  FILTER_BY_DATE_RANGE,
  FILTER_BY_DATE_DAY,
  FILTER_BY_DATE_MONTH,
  FILTER_BY_DATE_QUARTER,
  FILTER_BY_DATE_YEAR,
  FILTER_BY_DATE_WEEK,
  ITEM_MAX_LIMIT,
  SELECT_PAGE_NUMBER,
  SELECT_PAGE_RANGE,
} from "@/utils/constants";
import { getNextDay, dateToSQLTime, setTimeToMidnight } from "@/utils/utils";
export const maxDuration = 300; // pro version in vercel

const API_URL: string | undefined = process.env.EZY_API_URL;

export async function POST(request: Request) {
  try {
    const {
      token,
      startDate,
      endDate,
      byDate,
      byPage,
      pageSize,
      pageStart,
      pageEnd,
      endpoint,
    } = await request.json();

    const bearer_token: string = `Bearer ${token}`;

    let created_at;
    if (
      byDate === FILTER_BY_DATE_DAY ||
      byDate === FILTER_BY_DATE_WEEK ||
      byDate === FILTER_BY_DATE_MONTH ||
      byDate === FILTER_BY_DATE_QUARTER ||
      byDate === FILTER_BY_DATE_YEAR ||
      byDate === FILTER_BY_DATE_RANGE
    ) {
      const start: number = dateToSQLTime(setTimeToMidnight(startDate));
      const end: number = dateToSQLTime(getNextDay(setTimeToMidnight(endDate)));

      created_at = encodeURIComponent(
        JSON.stringify({ ">=": start, "<": end })
      );
    }

    // console.log("created at", created_at);
    const version = endpoint === EZY_ENP_PRODUCT_V2 ? "v2" : "v1";
    const page = 1;
    const limit = ITEM_MAX_LIMIT;
    let selectPageNumberParams, params;
    if (byPage === SELECT_PAGE_NUMBER || byPage === SELECT_PAGE_RANGE) {
      if (endpoint === EZY_ENP_INVOICE) {
        selectPageNumberParams = {
          limit: Number(pageSize),
          page: Number(pageStart),
          date: created_at,
        };
      } else {
        selectPageNumberParams = {
          limit: Number(pageSize),
          page: Number(pageStart),
          created_at,
        };
      }
      params = selectPageNumberParams;
    } else {
      if (endpoint === EZY_ENP_INVOICE) {
        params = {
          limit,
          page,
          date: created_at,
        };
      } else {
        params = {
          limit,
          page,
          created_at,
        };
      }
    }

    const response = await axios.get(`${API_URL}/${version}/${endpoint}`, {
      params,
      headers: {
        Authorization: bearer_token,
      },
    });

    let paramsList = [];
    if (byPage === SELECT_PAGE_NUMBER || byPage === SELECT_PAGE_RANGE) {
      paramsList.push(selectPageNumberParams);
      for (let page = Number(pageStart) + 1; page <= Number(pageEnd); page++) {
        if (endpoint === EZY_ENP_INVOICE) {
          paramsList.push({
            limit: Number(pageSize),
            page,
            date: created_at,
          });
        } else {
          paramsList.push({
            limit: Number(pageSize),
            page,
            created_at,
          });
        }
      }
    } else {
      for (let i = 0; i < response.data.meta.items_page_total; i++) {
        if (endpoint === EZY_ENP_INVOICE) {
          paramsList.push({ limit, page: i + 1, date: created_at });
        } else {
          paramsList.push({ limit, page: i + 1, created_at });
        }
      }
    }
    return Response.json({
      paramsList,
      items_page_total: response.data.meta.items_page_total,
      items_total: response.data.meta.items_total,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return Response.json(
      { error: "Error fetching data" },
      { status: 400, statusText: "" }
    );
  }
}
