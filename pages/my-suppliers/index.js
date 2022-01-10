import React from 'react';
import MySuppliers from '../../routes/MySuppliers';
import { RegistrationProvider } from '../../contexts/business-registration';

const MySuppliersPage = () => (
  <RegistrationProvider>
    <MySuppliers />
  </RegistrationProvider>
);

export default MySuppliersPage;
