import cookie from "cookie";
import { httpClient } from "../util/Api";

import DashboardPage from "./dashboard";

const setApiContent = (req, res, query) => {
  const browsersHeaders = req.headers;
  const cookies = cookie.parse(browsersHeaders.cookie || "");
  const headers = {
    "Content-Type": "application/json",
    authorization: cookies.token || query.token,
    origin: req.headers.host,
  };
  if (query.token) {
    res.setHeader("set-cookie", [`token=${query.token}`]);
  }
  return headers;
};
export async function getServerSideProps({ req, res, query }) {
  let userProfile = null;
  try {
    const headers = setApiContent(req, res, query);
    const apiResponse = await httpClient.get("user/profile", {
      headers,
    });
    userProfile = apiResponse.data;
    if (query.token) {
      res.writeHead(301, {
        Location: "/",
      });
      res.end();
    }
  } catch (error) {
    console.error(error);
  }
  return {
    props: {
      userProfile,
    },
  };
}

export default DashboardPage;
