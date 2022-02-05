import React from 'react';
import { RegistrationProvider } from '../../contexts/business-registration';

import BuyerRegistration from '../../routes/BuyerRegistration';

const BuyerRegistrationPage = () => (
  <RegistrationProvider>
    <BuyerRegistration />
  </RegistrationProvider>
);

export default BuyerRegistrationPage;
