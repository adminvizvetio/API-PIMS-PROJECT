import {
  EZY_ENP_INVOICELINE,
  EZY_ENP_PRODUCT_V2,
  INVOICELINE_STATUS_ALL,
  INVOICELINE_STATUS_FILALISED,
  INVOICELINE_STATUS_NONE_FILALISED,
} from "@/utils/constants";
import axios from "axios";

const API_URL: string | undefined = process.env.EZY_API_URL;
export const maxDuration = 300; // pro version in vercel

export async function POST(request: Request) {
  try {
    const { token, endpoint, params, filterInvoiceLines } =
      await request.json();

    const bearer_token: string = `Bearer ${token}`;
    const version = endpoint === EZY_ENP_PRODUCT_V2 ? "v2" : "v1";

    let response = await axios.get(`${API_URL}/${version}/${endpoint}`, {
      params,
      headers: {
        Authorization: bearer_token,
      },
    });

    // console.log("response", response);

    if (endpoint === EZY_ENP_INVOICELINE) {
      let filterItems;

      if (filterInvoiceLines === INVOICELINE_STATUS_FILALISED) {
        filterItems = response.data.items.filter((item: any) => {
          if (
            item.invoiceline.total !== 0 &&
            item.invoiceline.status === INVOICELINE_STATUS_FILALISED
          ) {
            return true;
          } else {
            return false;
          }
        });
      }

      if (filterInvoiceLines === INVOICELINE_STATUS_NONE_FILALISED) {
        filterItems = response.data.items.filter((item: any) => {
          if (
            item.invoiceline.total !== 0 &&
            item.invoiceline.status !== INVOICELINE_STATUS_FILALISED
          ) {
            return true;
          } else {
            return false;
          }
        });
      }

      if (filterInvoiceLines === INVOICELINE_STATUS_ALL) {
        filterItems = response.data.items.filter((item: any) => {
          if (item.invoiceline.total !== 0) {
            return true;
          } else {
            return false;
          }
        });
      }

      response.data.items = filterItems;
    }

    return Response.json({ ...response.data });
  } catch (error: any) {
    if (error.response && error.response.status === 429) {
      console.error("429 Error fetching data:", error);

      return Response.json(
        { error: error.response.data },
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
