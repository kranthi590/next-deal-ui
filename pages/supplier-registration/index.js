import React from "react";
import asyncComponent from "../../util/asyncComponent";
import {RegistrationProvider} from "../../util/business-registration";

const SupplierRegistration = asyncComponent(() =>
  import("../../routes/userAuth/SupplierRegistration")
);

const SupplierRegistrationPage = () => (
  <RegistrationProvider>
    <SupplierRegistration />
  </RegistrationProvider>
);

export default SupplierRegistrationPage;
