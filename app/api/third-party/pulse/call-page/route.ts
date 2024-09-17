import {
  EZY_ENP_INVOICELINE,
  EZY_ENP_PRODUCT_V2,
  INVOICELINE_STATUS_FILALISED,
  PULSE_API_VERSION,
  PULSE_ENP_INVOICES,
} from "@/utils/constants";
import axios from "axios";

const API_URL: string | undefined = process.env.PULSE_API_URL;
export const maxDuration = 300; // pro version in vercel

export async function POST(request: Request) {
  try {
    const { token, installation, endpoint, params } = await request.json();

    const version = PULSE_API_VERSION;
    const bearer_token: string = `Bearer ${token}`;

    let response = await axios.get(`${API_URL}/${version}/${endpoint}`, {
      params,
      headers: {
        Authorization: bearer_token,
        Accept: "application/json",
        Installation: installation,
      },
    });

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
