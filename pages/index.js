import cookie from "cookie";
import { httpClient } from "../util/Api";

import DashboardPage from "./dashboard";

export async function getServerSideProps(context) {
  try {
    const headers = context.req.headers;
    console.log(headers);
    const cookies = cookie.parse(headers.cookie || '');
    headers.authorization = cookies.token;
    const apiResponse = await httpClient.get("user/profile", {
      headers: {
        "Content-Type": "application/json",
        authorization: cookies.token,
        origin: "https://housestarcks11.nextdeal.dev",
      },
    });
    console.log("data::", apiResponse.data);
  } catch (error) {
    console.error(error);
  }
  return { props: {} };
}

export default DashboardPage;
