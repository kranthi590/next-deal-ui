import React from 'react';
import { NotificationManager } from 'react-notifications';
import { isEmpty } from 'lodash';
import IntlMessages from './IntlMessages';
import moment from 'moment';
import { getData } from './localStorage';

export const NOTIFICATION_TIMEOUT = 6000;

const validationErrors = [
  'INVALID_PROJECT_ID',
  'INVALID_QUOTATION_STATUS',
  'INVALID_QUOTATION_ID',
  'QUOTATION_ALREADY_AWARDED',
  'ANOTHER_QUOTATION_ALREADY_AWARDED',
  'QUOTATION_NOT_AWARDED',
  'QUOTATION_ALREADY_COMPLETED',
  'INVALID_FILE',
  'INVALID_ASSET_RELATION',
  'INVALID_ASSET_RELATION_ID',
  'INVALID_USER_ACCOUNT',
  'ER_DUP_ENTRY',
  'ER_DUP_ENTRY_RUT',
  'ER_DUP_ENTRY_SUB_DOMAIN',
  'ER_DUP_ENTRY_EMAIL_ID',
  'INVALID_BUYER_ID',
  'INVALID_SUPPLIER_ID',
  'INVALID_BUYER',
  'INVALID_DOMAIN',
  'INVALID_JWT_TOKEN',
  'ER_DUP_ENTRY_PROJECT_CODE',
  'ER_DUP_ENTRY_QUOTATION_CODE',
  'INVALID_FILE_TYPE',
  'IMAGES_EXTENSIONS',
  'INVALID_PROJECT_ID',
  'INVALID_QUOTATION_STATUS',
  'INVALID_QUOTATION_RESPONSE_ID',
  'INVALID_QUOTATION_ID',
  'QUOTATION_ALREADY_AWARDED',
  'ANOTHER_QUOTATION_ALREADY_AWARDED',
  'QUOTATION_NOT_AWARDED',
  'QUOTATION_ALREADY_COMPLETED',
  'INVALID_ASSET_RELATION',
  'INVALID_ASSET_RELATION_ID',
  'BUYERS_USERS_LIMIT_EXCEEDED',
  'PURCHASE_ORDER_NUMBER_NOT_FOUND',
  'ACCOUNT_LICENSE_EXPIRED',
  'QUOTATION_NOT_FOUND',
  'INVALID_ACCOUNT_CREDENTIALS',
  'SUPPLIER_ALREADY_ADDED_TO_QUOTATION',
];

export const successNotification = messageId => {
  NotificationManager.success(<IntlMessages id={messageId} />, '', NOTIFICATION_TIMEOUT);
};

export const errorNotification = (message = '', titleId) => {
  NotificationManager.error(
    message,
    titleId ? <IntlMessages id={titleId} /> : '',
    NOTIFICATION_TIMEOUT,
  );
};

export const handleErrorNotification = error => {
  if (
    error.response &&
    error.response.data &&
    error.response.data.errors &&
    error.response.data.errors.length
  ) {
    error.response.data.errors.map(err => {
      const errorExists = validationErrors.includes(err.errorCode);
      console.log('INVALID_ACCOUNT_CREDENTIALS', errorExists);
      NotificationManager.error(
        <IntlMessages
          id={errorExists ? err.errorCode.toLowerCase() : 'app.registration.errorMessageTitle'}
        />,
        '',
        NOTIFICATION_TIMEOUT,
      );
    });
  } else {
    let notificationMsg = '';
    switch (error.response.status) {
      case 500:
        notificationMsg = <IntlMessages id="app.api.error.500Msg" />;
        break;
      case 400:
        notificationMsg = <IntlMessages id="app.api.error.400Msg" />;
        break;
      default:
        notificationMsg = error.message;
        break;
    }
    NotificationManager.error(notificationMsg, '', NOTIFICATION_TIMEOUT);
  }
};

export const extractData = (key, data) => {
  const obj = {};
  data &&
    Object.keys(data).forEach(fk => {
      if (fk.includes(key) && !!data[fk]) {
        obj[fk.split(key)[1]] = data[fk];
      }
    });
  return obj;
};

export const isValidObject = obj => {
  return !isEmpty(Object.values(obj).filter(val => !isEmpty(val)));
};

export const getPhonePrefix = prefix => {
  return prefix || process.env.NEXT_PUBLIC_DEFAULT_LOCALE_PREFIX;
};

export const isClient = typeof window !== 'undefined';

export const getDateInMilliseconds = date => {
  return date && moment(date).format('MM/DD/YYYY');
};

export const getBuyerId = () => {
  if (isClient) {
    const buyerInfo = getData('user');
    return buyerInfo && JSON.parse(buyerInfo.buyerId);
  }
};

export const getSubDomain = (url = '') => {
  const domain = isClient ? window.location.hostname.replace('www.', '').split('.') : '';
  return domain[0];
};

export const sanitizeString = string => {
  if (!string) {
    return;
  }
  return string.replace(/[^a-zA-Z0-9]/g, '');
};

export const formatAmount = amount => amount && amount.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const getAvatar = str => {
  if (!str) return;
  const stringInfo = str.match(/\b(\w)/g);
  const splitString = stringInfo.splice(0, 2);
  return splitString.join('').toUpperCase();
};

export function numberToClp(amount, separator = '.', symbol = '$') {
  let cleanValue = amount.toString().replace(/\D/g, '');
  let valueConverted = cleanValue ? cleanValue.split('').reverse() : '';
  if (!cleanValue) return '';
  const length = valueConverted.length;
  const divs = length / 3;
  const sobr = length % 3;
  let finalValue;
  let array = [];
  valueConverted.reduce((previus, current, index) => {
    if (index % 3 == 0) {
      array.push(previus.split('').reverse().join(''));
      return current;
    }
    return previus + current;
  });
  if (sobr) {
    let valSobr = valueConverted.reverse().slice(0, sobr);
    let point = length < 3 ? '' : separator;
    finalValue = valSobr.join('') + point;
  } else {
    array.push(valueConverted.reverse().slice(0, 3).join(''));
  }
  return `${symbol}${finalValue ? finalValue : ''}${array.reverse().join(separator)}`;
}

export function clpToNumber(amountStr) {
  return parseInt(amountStr.replace(/\$|\./g, ''));
}
