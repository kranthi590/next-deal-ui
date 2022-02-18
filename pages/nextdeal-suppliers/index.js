import React from 'react';
import { RegistrationProvider } from '../../contexts/business-registration';
import NextDealSuppliers from '../../routes/NextDealSuppliers';

const NextDealSuppliersPage = () => (
    <RegistrationProvider>
        <NextDealSuppliers />
    </RegistrationProvider>
);

export default NextDealSuppliersPage;
