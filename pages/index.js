import { handleApiErrors, httpClient, setApiContext } from "../util/Api";

import DashboardPage from "./dashboard";

export async function getServerSideProps({ req, res, query }) {
  let userProfile = null;
  try {
    const headers = setApiContext(req, res, query);
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
    handleApiErrors(req, res, query, error);
  }
  return {
    props: {
      userProfile,
    },
  };
}

export default DashboardPage;
