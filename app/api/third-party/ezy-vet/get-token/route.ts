import axios from "axios";
import querystring from "querystring";

const API_URL: string | undefined = process.env.EZY_API_URL;

export async function POST(request: Request) {
  try {
    const { partnerId, clientId, clientSecret, grantType, scope } =
      await request.json();

    let clientData = {
      partner_id: partnerId,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: grantType,
      scope: scope,
    };

    const response = await axios.post(
      `${API_URL}/v1/oauth/access_token`,
      querystring.stringify(clientData),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return Response.json({ ...response.data });
  } catch (error) {
    console.log("error-ezy-vet toke");
    return Response.json({ error }, { status: 400, statusText: "" });
  }
}
