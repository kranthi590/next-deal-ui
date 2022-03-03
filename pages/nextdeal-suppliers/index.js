import React from 'react';
import { RegistrationProvider } from '../../contexts/business-registration';
import NextDealSuppliers from '../../routes/NextDealSuppliers';
import { handleApiErrors, httpClient, setApiContext } from '../../util/Api';

const NextDealSuppliersPage = () => (
  <RegistrationProvider>
    <NextDealSuppliers />
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

export default NextDealSuppliersPage;
