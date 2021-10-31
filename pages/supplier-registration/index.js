import React from "react";
import asyncComponent from "../../util/asyncComponent";
import {RegistrationProvider} from "../../contexts/business-registration";

const SupplierRegistration = asyncComponent(() =>
  import("../../routes/SupplierRegistration")
);

const SupplierRegistrationPage = () => (
  <RegistrationProvider>
    <SupplierRegistration />
  </RegistrationProvider>
);

export default SupplierRegistrationPage;
