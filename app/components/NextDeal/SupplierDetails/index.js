import { IdcardOutlined } from '@ant-design/icons';
import { Avatar, Row, Col, Card } from 'antd';
import React, { useState, useEffect } from 'react';
import { useRegistration } from '../../../../contexts/business-registration';
import IntlMessages from '../../../../util/IntlMessages';
import { getAvatar } from '../../../../util/util';
import { format } from 'rut.js';

const SupplierDetails = props => {
  const {
    legalName,
    businessAddress,
    webSiteUrl,
    rut,
    type,
    categories,
    inchargeFullName,
    emailId,
    inchargeRole,
    isShared,
    logo,
    comments,
  } = props.supplierDetails;

  const categoriesList = props.categoriesList;

  const billingAddress = props.supplierDetails.billingAddress
    ? props.supplierDetails.billingAddress
    : null;

  let billingaddressExists = false,
    contact1Exists = false,
    contact2Exists = false;

  if (
    billingAddress &&
    (billingAddress.addressLine1 ||
      billingAddress.addressLine2 ||
      billingAddress.phoneNumber1 ||
      billingAddress.phoneNumber2 ||
      billingAddress.regionId ||
      billingAddress.communeId)
  ) {
    billingaddressExists = true;
  }

  if (
    (businessAddress &&
      (businessAddress.emailId || businessAddress.phoneNumber1 || businessAddress.phoneNumber2)) ||
    webSiteUrl
  ) {
    contact1Exists = true;
  }
  if (inchargeFullName || emailId || inchargeRole) {
    contact2Exists = true;
  }

  const { fetchRegions, fetchCommune } = useRegistration();
  let selectedCategories = '';
  let categorieslength = 0;
  const [businessRegion, setBusinessRegion] = useState('');
  const [businessRegionBilling, setBusinessRegionBilling] = useState('');
  const [communesBusiness, setCommunesBusiness] = useState('');
  const [communesBilling, setCommunesBilling] = useState('');

  const loadRegionsAndComuna = () => {
    fetchRegions(({ regions }) => {
      regions.map(item => {
        if (item.id === businessAddress.regionId) {
          setBusinessRegion(item.name);
        }
        if (billingAddress && billingAddress.regionId) {
          if (item.id === billingAddress.regionId) {
            setBusinessRegionBilling(item.name);
          }
        }
      });
    });
    fetchCommune({ regionId: businessAddress.regionId }, data => {
      const communes = data && data.length > 0 ? data[0] : [];
      communes &&
        communes.some(com => {
          if (com.id === businessAddress.communeId) {
            setCommunesBusiness(com.name);
            return true;
          }
        });
    });
    if (billingAddress && billingAddress.regionId) {
      fetchCommune({ regionId: billingAddress.regionId }, data => {
        const communes = data && data.length > 0 ? data[0] : [];
        communes &&
          communes.some(com => {
            if (com.id === billingAddress.communeId) {
              setCommunesBilling(com.name);
              return true;
            }
          });
      });
    }
  };

  categoriesList.forEach(item => {
    if (categories && categories.some(categorie => categorie.category_id === item.id)) {
      categorieslength++;

      selectedCategories +=
        categorieslength <= categories.length && categorieslength !== 1
          ? ', ' + item.name
          : item.name;
    }
  });

  useEffect(() => {
    if (businessAddress && businessAddress.regionId) {
      loadRegionsAndComuna();
    }
  }, []);
  return (
    <div>
      <div className="gx-profile-banner gx-bg-light-blue">
        <div className="gx-profile-container">
          <div className="gx-profile-banner-top">
            <div className="gx-profile-banner-top-left">
              <div className="gx-profile-banner-avatar">
                <Avatar
                  className="gx-size-100"
                  alt={legalName}
                  src={logo && logo[0] ? logo[0].fileUrl : ''}
                  style={{ color: '#f56a00', backgroundColor: '#fde3cf', fontSize: '2rem' }}
                >
                  {getAvatar(legalName)}
                </Avatar>
              </div>
              {legalName ? (
                <div className="gx-profile-banner-avatar-info">
                  <h2 className="gx-mb-2 gx-mb-sm-3 gx-fs-xxl gx-font-weight-light">{legalName}</h2>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="gx-profile-content">
        <Row>
          <Col
            // xl={contact1Exists || contact1Exists ? 16 : 24}
            // lg={contact1Exists || contact1Exists ? 14 : 24}
            // md={contact1Exists || contact1Exists ? 14 : 24}
            xl={16}
            lg={14}
            md={14}
            sm={24}
            xs={24}
          >
            <Card
              title={<IntlMessages id="app.supplierregistration.form_title" />}
              className="gx-card-widget gx-card-tabs gx-card-profile"
            >
              <Row>
                {/* {legalName ? ( */}
                <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                  <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                    <div className="gx-mr-3">
                      <i className={`icon icon-company gx-fs-xxl gx-text-grey`} />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">
                        <IntlMessages id="app.supplierregistration.field.business_legalName" />
                      </h6>
                      <p className="gx-mb-0">{legalName ? legalName : '-'}</p>
                    </div>
                  </div>
                </Col>
                {/*  ) : null} */}

                {/* {rut ? ( */}
                <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                  <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                    <div className="gx-mr-3">
                      <IdcardOutlined className="gx-fs-xxl gx-text-grey" />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">
                        {<IntlMessages id="app.supplierregistration.field.business_rut" />}
                      </h6>
                      <p className="gx-mb-0">{rut ? format(rut) : '-'}</p>
                    </div>
                  </div>
                </Col>
                {/*  ) : null} */}
                {/* {businessAddress && businessAddress.addressLine1 ? (
                  <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                    <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                      <div className="gx-mr-3">
                        <i className={`icon icon-location gx-fs-xxl gx-text-grey`} />
                      </div>
                      <div className="gx-media-body">
                        <h6 className="gx-mb-1 gx-text-grey">
                          {
                            <IntlMessages id="app.supplierregistration.field.business_addressLine1" />
                          }
                        </h6>
                        <p className="gx-mb-0">
                          {businessAddress && businessAddress.addressLine1
                            ? businessAddress.addressLine1
                            : '-'}
                        </p>
                      </div>
                    </div>
                  </Col>
                ) : null} */}
                {/* {businessAddress && businessAddress.addressLine2 ? (
                  <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                    <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                      <div className="gx-mr-3">
                        <i className={`icon icon-location gx-fs-xxl gx-text-grey`} />
                      </div>
                      <div className="gx-media-body">
                        <h6 className="gx-mb-1 gx-text-grey">
                          {
                            <IntlMessages id="app.supplierregistration.field.business_addressLine2" />
                          }
                        </h6>
                        <p className="gx-mb-0">
                          {businessAddress && businessAddress.addressLine2
                            ? businessAddress.addressLine2
                            : '-'}
                        </p>
                      </div>
                    </div>
                  </Col>
                ) : null}
                {businessRegion ? (
                  <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                    <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                      <div className="gx-mr-3">
                        <i className={`icon icon-map-drawing gx-fs-xxl gx-text-grey`} />
                      </div>
                      <div className="gx-media-body">
                        <h6 className="gx-mb-1 gx-text-grey">
                          {<IntlMessages id="app.supplierregistration.field.business_regionId" />}
                        </h6>
                        <p className="gx-mb-0">{businessRegion}</p>
                      </div>
                    </div>
                  </Col>
                ) : null} */}
                {/* {
                  serviceLocation ?
                  <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                    <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                      <div className="gx-mr-3">
                        <i className={`icon icon-map-directions gx-fs-xxl gx-text-grey`} />
                      </div>
                      <div className="gx-media-body">
                        <h6 className="gx-mb-1 gx-text-grey">
                          {<IntlMessages id="app.supplierregistration.field.serviceLocations" />}
                        </h6>
                        <p className="gx-mb-0">{serviceLocation}</p>
                      </div>
                    </div>
                  </Col>
                    : null
                } */}
                {/* {communesBusiness ? (
                  <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                    <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                      <div className="gx-mr-3">
                        <i className={`icon icon-social gx-fs-xxl gx-text-grey`} />
                      </div>
                      <div className="gx-media-body">
                        <h6 className="gx-mb-1 gx-text-grey">
                          {<IntlMessages id="app.supplierregistration.field.business_communeId" />}
                        </h6>
                        <p className="gx-mb-0">{communesBusiness}</p>
                      </div>
                    </div>
                  </Col>
                ) : null}
                {type ? (
                  <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                    <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                      <div className="gx-mr-3">
                        <i className={`icon icon-company gx-fs-xxl gx-text-grey`} />
                      </div>
                      <div className="gx-media-body">
                        <h6 className="gx-mb-1 gx-text-grey">
                          {<IntlMessages id="app.supplierregistration.field.business_type" />}
                        </h6>
                        <p className="gx-mb-0">{type}</p>
                      </div>
                    </div>
                  </Col>
                ) : null}
                {comments ? (
                  <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                    <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                      <div className="gx-mr-3">
                        <i className={`icon icon-feedback gx-fs-xxl gx-text-grey`} />
                      </div>
                      <div className="gx-media-body">
                        <h6 className="gx-mb-1 gx-text-grey">
                          {
                            <IntlMessages id="app.supplierregistration.field.business_supplier_info" />
                          }
                        </h6>
                        <p className="gx-mb-0">{comments ? comments : '-'}</p>
                      </div>
                    </div>
                  </Col>
                ) : null} */}
                {/* {categories && categories.length ? ( */}
                <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                  <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                    <div className="gx-mr-3">
                      <i className={`icon icon-select gx-fs-xxl gx-text-grey`} />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">
                        {<IntlMessages id="app.supplierregistration.field.business_categories" />}
                      </h6>
                      <p className="gx-mb-0">
                        {selectedCategories.length ? selectedCategories : '-'}
                      </p>
                    </div>
                  </div>
                </Col>
                {/* ) : null} */}
              </Row>
            </Card>
            {/* {billingaddressExists ? (
              <Card
                title={<IntlMessages id="app.supplierregistration.billing_title" />}
                className="gx-card-widget gx-card-tabs gx-card-profile"
              >
                <Row>
                  {billingAddress && billingAddress.addressLine1 ? (
                    <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                      <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                        <div className="gx-mr-3">
                          <i className={`icon icon-location gx-fs-xxl gx-text-grey`} />
                        </div>
                        <div className="gx-media-body">
                          <h6 className="gx-mb-1 gx-text-grey">
                            <IntlMessages id="app.supplierregistration.field.billing_addressLine1" />
                          </h6>
                          <p className="gx-mb-0">
                            {billingAddress && billingAddress.addressLine1
                              ? billingAddress.addressLine1
                              : '-'}
                          </p>
                        </div>
                      </div>
                    </Col>
                  ) : null}
                  {billingAddress && billingAddress.addressLine2 ? (
                    <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                      <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                        <div className="gx-mr-3">
                          <i className={`icon icon-location gx-fs-xxl gx-text-grey`} />
                        </div>
                        <div className="gx-media-body">
                          <h6 className="gx-mb-1 gx-text-grey">
                            <IntlMessages id="app.supplierregistration.field.billing_addressLine2" />
                          </h6>
                          <p className="gx-mb-0">
                            {billingAddress && billingAddress.addressLine2
                              ? billingAddress.addressLine2
                              : '-'}
                          </p>
                        </div>
                      </div>
                    </Col>
                  ) : null}
                  {businessRegionBilling ? (
                    <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                      <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                        <div className="gx-mr-3">
                          <i className={`icon icon-map-drawing gx-fs-xxl gx-text-grey`} />
                        </div>
                        <div className="gx-media-body">
                          <h6 className="gx-mb-1 gx-text-grey">
                            <IntlMessages id="app.supplierregistration.field.billing_regionId" />
                          </h6>
                          <p className="gx-mb-0">
                            {businessRegionBilling ? businessRegionBilling : '-'}
                          </p>
                        </div>
                      </div>
                    </Col>
                  ) : null}
                  {communesBilling ? (
                    <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                      <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                        <div className="gx-mr-3">
                          <i className={`icon icon-social gx-fs-xxl gx-text-grey`} />
                        </div>
                        <div className="gx-media-body">
                          <h6 className="gx-mb-1 gx-text-grey">
                            <IntlMessages id="app.supplierregistration.field.billing_communeId" />
                          </h6>
                          <p className="gx-mb-0">{communesBilling ? communesBilling : '-'}</p>
                        </div>
                      </div>
                    </Col>
                  ) : null}
                  {billingAddress && billingAddress.phoneNumber1 ? (
                    <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                      <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                        <div className="gx-mr-3">
                          <i className={`icon icon-phone gx-fs-xxl gx-text-grey`} />
                        </div>
                        <div className="gx-media-body">
                          <h6 className="gx-mb-1 gx-text-grey">
                            <IntlMessages id="app.supplierregistration.field.billing_phoneNumber1" />
                          </h6>
                          <p className="gx-mb-0">
                            {billingAddress && billingAddress.phoneNumber1 ? (
                              <a
                                className="gx-link gx-text-break"
                                href={`tel:${billingAddress.phoneNumber1}`}
                              >
                                {billingAddress.phoneNumber1}
                              </a>
                            ) : (
                              '-'
                            )}
                          </p>
                        </div>
                      </div>
                    </Col>
                  ) : null}
                  {billingAddress && billingAddress.phoneNumber2 ? (
                    <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                      <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                        <div className="gx-mr-3">
                          <i className={`icon icon-phone gx-fs-xxl gx-text-grey`} />
                        </div>
                        <div className="gx-media-body">
                          <h6 className="gx-mb-1 gx-text-grey">
                            <IntlMessages id="app.supplierregistration.field.billing_phoneNumber2" />
                          </h6>
                          <p className="gx-mb-0">
                            {billingAddress && billingAddress.phoneNumber2 ? (
                              <a
                                className="gx-link gx-text-break"
                                href={`tel:${billingAddress.phoneNumber2}`}
                              >
                                {billingAddress.phoneNumber2}
                              </a>
                            ) : (
                              '-'
                            )}
                          </p>
                        </div>
                      </div>
                    </Col>
                  ) : null}
                </Row>
              </Card>
            ) : null} */}
          </Col>
          {/* {contact1Exists || contact1Exists ? ( */}
          <Col xl={8} lg={10} md={10} sm={24} xs={24}>
            {/* {contact1Exists ? ( */}
            <Card
              title={<IntlMessages id="app.common.text.contact" />}
              className="gx-card-widget gx-card-profile-sm"
            >
              {/* {businessAddress && businessAddress.emailId ? ( */}
              <div className="gx-media gx-align-items-center gx-flex-nowrap gx-pro-contact-list">
                <div className="gx-mr-3">
                  <i className={`icon icon-email gx-fs-xxl gx-text-grey`} />
                </div>
                <div className="gx-media-body">
                  <span className="gx-mb-0 gx-text-grey gx-fs-sm">
                    <IntlMessages id="app.supplierregistration.field.business_emailId" />
                  </span>
                  <p className="gx-mb-0">
                    {businessAddress && businessAddress.emailId ? (
                      <a
                        className="gx-link gx-text-break"
                        href={`mailto:${businessAddress.emailId}`}
                      >
                        {businessAddress.emailId}
                      </a>
                    ) : (
                      '-'
                    )}
                  </p>
                </div>
              </div>
              {/* // ) : null} */}
              {/* {webSiteUrl ? (
                    <div className="gx-media gx-align-items-center gx-flex-nowrap gx-pro-contact-list">
                      <div className="gx-mr-3">
                        <i className={`icon icon-link gx-fs-xxl gx-text-grey`} />
                      </div>
                      <div className="gx-media-body">
                        <span className="gx-mb-0 gx-text-grey gx-fs-sm">
                          <IntlMessages id="app.supplierregistration.field.business_webSiteUrl" />
                        </span>
                        <p className="gx-mb-0">
                          {webSiteUrl ? (
                            <a className="gx-link gx-text-break" href={webSiteUrl} target="_blank">
                              {webSiteUrl}
                            </a>
                          ) : (
                            '-'
                          )}
                        </p>
                      </div>
                    </div>
                  ) : null} */}
              {/* {businessAddress && businessAddress.phoneNumber1 ? ( */}
              <div className="gx-media gx-align-items-center gx-flex-nowrap gx-pro-contact-list">
                <div className="gx-mr-3">
                  <i className={`icon icon-phone gx-fs-xxl gx-text-grey`} />
                </div>
                <div className="gx-media-body">
                  <span className="gx-mb-0 gx-text-grey gx-fs-sm">
                    <IntlMessages id="app.supplierregistration.field.business_phoneNumber1" />
                  </span>
                  <p className="gx-mb-0">
                    {businessAddress && businessAddress.phoneNumber1 ? (
                      <a
                        className="gx-link gx-text-break"
                        href={`tel:${businessAddress.phoneNumber1}`}
                      >
                        {businessAddress.phoneNumber1}
                      </a>
                    ) : (
                      '-'
                    )}
                  </p>
                </div>
              </div>
              {/* ) : null} */}
              {/* {businessAddress && businessAddress.phoneNumber2 ? (
                    <div className="gx-media gx-align-items-center gx-flex-nowrap gx-pro-contact-list">
                      <div className="gx-mr-3">
                        <i className={`icon icon-phone gx-fs-xxl gx-text-grey`} />
                      </div>
                      <div className="gx-media-body">
                        <span className="gx-mb-0 gx-text-grey gx-fs-sm">
                          <IntlMessages id="app.supplierregistration.field.business_phoneNumber2" />
                        </span>
                        <p className="gx-mb-0">
                          {businessAddress && businessAddress.phoneNumber2 ? (
                            <a
                              className="gx-link gx-text-break"
                              href={`tel:${businessAddress.phoneNumber2}`}
                            >
                              {businessAddress.phoneNumber2}
                            </a>
                          ) : (
                            '-'
                          )}
                        </p>
                      </div>
                    </div>
                  ) : null} */}
            </Card>
            {/* ) : null} */}
            {/* {contact2Exists ? (
                <Card
                  title={<IntlMessages id="app.supplierregistration.business_contact_title" />}
                  className="gx-card-widget gx-card-profile-sm"
                >
                  {inchargeFullName ? (
                    <div className="gx-media gx-align-items-center gx-flex-nowrap gx-pro-contact-list">
                      <div className="gx-mr-3">
                        <i className={`icon icon-wall gx-fs-xxl gx-text-grey`} />
                      </div>
                      <div className="gx-media-body">
                        <span className="gx-mb-0 gx-text-grey gx-fs-sm">
                          <IntlMessages id="app.supplierregistration.field.bcontact_name" />
                        </span>
                        <p className="gx-mb-0">{inchargeFullName ? inchargeFullName : '-'}</p>
                      </div>
                    </div>
                  ) : null}
                  {emailId ? (
                    <div className="gx-media gx-align-items-center gx-flex-nowrap gx-pro-contact-list">
                      <div className="gx-mr-3">
                        <i className={`icon icon-email gx-fs-xxl gx-text-grey`} />
                      </div>
                      <div className="gx-media-body">
                        <span className="gx-mb-0 gx-text-grey gx-fs-sm">
                          <IntlMessages id="app.supplierregistration.field.bcontact_email" />
                        </span>
                        <p className="gx-mb-0">
                          {emailId ? (
                            <a className="gx-link gx-text-break" href={`mailto:${emailId}`}>
                              {emailId}
                            </a>
                          ) : (
                            '-'
                          )}
                        </p>
                      </div>
                    </div>
                  ) : null}
                  {inchargeRole ? (
                    <div className="gx-media gx-align-items-center gx-flex-nowrap gx-pro-contact-list">
                      <div className="gx-mr-3">
                        <i className={`icon icon-profile gx-fs-xxl gx-text-grey`} />
                      </div>
                      <div className="gx-media-body">
                        <span className="gx-mb-0 gx-text-grey gx-fs-sm">
                          <IntlMessages id="app.supplierregistration.field.bcontact_charge" />
                        </span>
                        <p className="gx-mb-0">{inchargeRole ? inchargeRole : '-'}</p>
                      </div>
                    </div>
                  ) : null}
                </Card>
              ) : null} */}
          </Col>
          {/* ) : null} */}
        </Row>
      </div>
    </div>
  );
};

export default SupplierDetails;
