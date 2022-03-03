import React from 'react';
import MySuppliers from '../../routes/MySuppliers';
import { RegistrationProvider } from '../../contexts/business-registration';
import { handleApiErrors, httpClient, setApiContext } from '../../util/Api';

const MySuppliersPage = () => (
  <RegistrationProvider>
    <MySuppliers />
  </RegistrationProvider>
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
        destination: '/',
        permanent: false,
      },
    },
  };
}

export default MySuppliersPage;
