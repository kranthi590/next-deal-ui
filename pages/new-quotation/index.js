import React from 'react';
import NewQuotation from '../../routes/NewQuotation';
import { RegistrationProvider } from '../../contexts/business-registration';

const NewNewQuotation = () => (
  <RegistrationProvider>
    <NewQuotation />
  </RegistrationProvider>
);

export default NewNewQuotation;
