import axios from "axios";
import querystring from "querystring";

const API_URL: string | undefined = process.env.PULSE_AUTH_API_URL;

export async function POST(request: Request) {
  try {
    const { userName, password } = await request.json();

    let clientData = {
      grant_type: process.env.PULSE_GRANT_TYPE,
      client_id: process.env.PULSE_CLIENT_ID,
      audience: process.env.PULSE_AUDIENCE,
      username: userName,
      password: password,
      realm: process.env.PULSE_REALM,
    };

    // console.log("clientData", clientData);

    const response = await axios.post(
      `${API_URL}/oauth/token`,
      querystring.stringify(clientData),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return Response.json({ ...response.data });
  } catch (error) {
    console.log("error pulse token");
    return Response.json({ error }, { status: 400, statusText: "" });
  }
}
