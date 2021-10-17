import React from "react";
import asyncComponent from "../../util/asyncComponent";
import {RegistrationProvider} from "../../util/business-registration";

const BuyerRegistration = asyncComponent(() =>
  import("../../routes/userAuth/BuyerRegistration")
);

const BuyerRegistrationPage = () => (
  <RegistrationProvider>
    <BuyerRegistration />
  </RegistrationProvider>
);

export default BuyerRegistrationPage;
