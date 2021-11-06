import React from "react";
import {RegistrationProvider} from "../../contexts/business-registration";
import SupplierRegistration from '../../routes/SupplierRegistration'


const SupplierRegistrationPage = () => (
  <RegistrationProvider>
    <SupplierRegistration />
  </RegistrationProvider>
);

export default SupplierRegistrationPage;
