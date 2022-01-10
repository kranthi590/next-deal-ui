import React from 'react';
import { RegistrationProvider } from '../../contexts/business-registration';
import SupplierRegistration from '../../routes/SupplierRegistration';

const SupplierRegistrationPage = props => (
  <RegistrationProvider>
    <SupplierRegistration {...props} />
  </RegistrationProvider>
);

export default SupplierRegistrationPage;
