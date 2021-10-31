import React from "react";
import asyncComponent from "../../util/asyncComponent";
import {RegistrationProvider} from "../../contexts/business-registration";

const BuyerRegistration = asyncComponent(() =>
  import("../../routes/BuyerRegistration")
);

const BuyerRegistrationPage = () => (
  <RegistrationProvider>
    <BuyerRegistration />
  </RegistrationProvider>
);

export default BuyerRegistrationPage;
