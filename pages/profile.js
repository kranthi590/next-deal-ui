import React from "react";
import { handleApiErrors, httpClient, setApiContext } from "../util/Api";

const Card = ({ userProfile }) => (
  <div>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    />
    <div className="card">
      <img src="img.jpg" alt="John" style={{ width: "100%" }} />
      <h1>
        {userProfile.firstName} {userProfile.lastName}
      </h1>
      <p className="title">CEO &amp; Founder, Example</p>
    </div>
  </div>
);

export async function getServerSideProps({ req, res, query }) {
  let userProfile = null;
  try {
    const headers = setApiContext(req, res, query);
    const apiResponse = await httpClient.get(`users/${headers[`user-id`]}`, {
      headers,
    });
    userProfile = apiResponse.data.data;
  } catch (error) {
    handleApiErrors(req, res, query, error);
  }
  return {
    props: {
      userProfile,
      redirect: {
        destination: "/",
        permanent: false,
      },
    },
  };
}

export default Card;
