import axios from "axios";

const API_URL: string | undefined = process.env.EZY_API_URL;

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    const bearer_token: string = `Bearer ${token}`;

    const response = await axios.get(`${API_URL}/v1/systemsetting`, {
      headers: {
        Authorization: bearer_token,
      },
    });

    return Response.json({ ...response.data });
  } catch (error) {
    console.log("error");
    return Response.json({ error }, { status: 400, statusText: "" });
  }
}
