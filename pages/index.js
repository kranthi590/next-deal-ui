import React from 'react';
import ProjectsCalendar from '../routes/ProjectsCalendar';
import { handleApiErrors, httpClient, setApiContext } from '../util/Api';
const CalendarPage = () => <ProjectsCalendar />;

export default CalendarPage;

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
        destination: '/',
        permanent: false,
      },
    },
  };
}
