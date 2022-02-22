import { IdcardOutlined } from '@ant-design/icons';
import { Avatar, Row, Col, Card } from 'antd';
import React, { useState, useEffect } from 'react';
import { useRegistration } from '../../../../contexts/business-registration';
import IntlMessages from '../../../../util/IntlMessages';
import { getAvatar } from '../../../../util/util';
import { format } from 'rut.js';

const SupplierDetails = props => {
  const {
    logoUrl,
    legalName,
    fantasyName,
    businessAddress,
    webSiteUrl,
    rut,
    type,
    categories,
    inchargeFullName,
    emailId,
    inchargeRole,
    isShared,
    serviceLocations,
    logo,
    comments,
  } = props.supplierDetails;
  const billingAddress = props.supplierDetails.billingAddress
    ? props.supplierDetails.billingAddress
    : {};

  let categoriesList = [
    { value: 6, text: 'Alimentación' },
    { value: 19, text: 'Artículos de oficina' },
    { value: 10, text: 'Bodegaje' },
    { value: 13, text: 'Capacitación' },
    { value: 14, text: 'Contabilidad' },
    { value: 5, text: 'Diseño web y logo' },
    { value: 4, text: 'E-commerce' },
    { value: 16, text: 'Entretenimiento' },
    { value: 18, text: 'Eventos' },
    { value: 27, text: 'Fotografía' },
    { value: 21, text: 'Imprenta y gráficas' },
    { value: 26, text: 'Ingeniería' },
    { value: 15, text: 'Legal' },
    { value: 30, text: 'Limpieza y aseo' },
    { value: 28, text: 'Maquinaria y construcción' },
    { value: 1, text: 'Marketing digital' },
    { value: 3, text: 'Packaging' },
    { value: 17, text: 'Productos y regalos corporativos' },
    { value: 29, text: 'Salud y belleza' },
    { value: 20, text: 'PackaServicios de importación y exportaciónging' },
    { value: 8, text: 'Software y programación' },
    { value: 25, text: 'Textil y calzado' },
  ];
  const { fetchRegions, fetchCommune } = useRegistration();
  let selectedCategories = '',
    categorieslength = 0,
    serviceLocationsLength = 0;
  const [businessRegion, setBusinessRegion] = useState('');
  const [businessRegionBilling, setBusinessRegionBilling] = useState('');
  const [communesBusiness, setCommunesBusiness] = useState('');
  const [communesBilling, setCommunesBilling] = useState('');
  const [serviceLocation, setServiceLocation] = useState('');
  let serviceLocationString = '';
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
        if (serviceLocations.some(sl => sl.region_id === item.id)) {
          serviceLocationsLength++;
          if (serviceLocationsLength < serviceLocations.length && serviceLocationsLength > 1) {
            serviceLocationString += ', ' + item.name;
          } else {
            serviceLocationString += item.name;
          }
        }
        setServiceLocation(serviceLocationString);
      });
    });
    fetchCommune({ regionId: businessAddress.regionId }, data => {
      const communes = data && data.length > 0 ? data[0] : [];
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
    if (categories.some(categorie => categorie.category_id === item.value)) {
      categorieslength++;
      selectedCategories +=
        categorieslength < categories.length && categorieslength !== 1
          ? ', ' + item.text
          : item.text;
    }
  });
  useEffect(() => {
    loadRegionsAndComuna();
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
              <div className="gx-profile-banner-avatar-info">
                <h2 className="gx-mb-2 gx-mb-sm-3 gx-fs-xxl gx-font-weight-light">{legalName}</h2>
                {fantasyName ? <p className="gx-mb-0 gx-fs-lg">{fantasyName}</p> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="gx-profile-content">
        <Row>
          <Col xl={16} lg={14} md={14} sm={24} xs={24}>
            <Card
              title={<IntlMessages id="app.supplierregistration.form_title" />}
              className="gx-card-widget gx-card-tabs gx-card-profile"
            >
              <Row>
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
                <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                  <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                    <div className="gx-mr-3">
                      <i className={`icon icon-important-o gx-fs-xxl gx-text-grey`} />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">
                        {<IntlMessages id="app.supplierregistration.field.business_fantasyName" />}
                      </h6>
                      <p className="gx-mb-0">{fantasyName ? fantasyName : '-'}</p>
                    </div>
                  </div>
                </Col>
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
                <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                  <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                    <div className="gx-mr-3">
                      <i className={`icon icon-location gx-fs-xxl gx-text-grey`} />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">
                        {<IntlMessages id="app.supplierregistration.field.business_addressLine1" />}
                      </h6>
                      <p className="gx-mb-0">
                        {businessAddress.addressLine1 ? businessAddress.addressLine1 : '-'}
                      </p>
                    </div>
                  </div>
                </Col>
                <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                  <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                    <div className="gx-mr-3">
                      <i className={`icon icon-location gx-fs-xxl gx-text-grey`} />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">
                        {<IntlMessages id="app.supplierregistration.field.business_addressLine2" />}
                      </h6>
                      <p className="gx-mb-0">
                        {businessAddress.addressLine2 ? businessAddress.addressLine2 : '-'}
                      </p>
                    </div>
                  </div>
                </Col>
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
                <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                  <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                    <div className="gx-mr-3">
                      <i className={`icon icon-forward-o gx-fs-xxl gx-text-grey`} />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">
                        <IntlMessages id="app.supplierregistration.field.isshared" />
                      </h6>
                      <p className="gx-mb-0">
                        {isShared ? (
                          <IntlMessages id="app.common.text.yes" />
                        ) : (
                          <IntlMessages id="app.common.text.no" />
                        )}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
            <Card
              title={<IntlMessages id="app.supplierregistration.billing_title" />}
              className="gx-card-widget gx-card-tabs gx-card-profile"
            >
              <Row>
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
                        {billingAddress.addressLine1 ? billingAddress.addressLine1 : '-'}
                      </p>
                    </div>
                  </div>
                </Col>
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
                        {billingAddress.addressLine2 ? billingAddress.addressLine2 : '-'}
                      </p>
                    </div>
                  </div>
                </Col>
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
                        {businessAddress.phoneNumber1 ? (
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
                </Col>
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
                        {businessAddress.phoneNumber2 ? (
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
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xl={8} lg={10} md={10} sm={24} xs={24}>
            <Card
              title={<IntlMessages id="app.common.text.contact" />}
              className="gx-card-widget gx-card-profile-sm"
            >
              <div className="gx-media gx-align-items-center gx-flex-nowrap gx-pro-contact-list">
                <div className="gx-mr-3">
                  <i className={`icon icon-email gx-fs-xxl gx-text-grey`} />
                </div>
                <div className="gx-media-body">
                  <span className="gx-mb-0 gx-text-grey gx-fs-sm">
                    <IntlMessages id="app.supplierregistration.field.business_emailId" />
                  </span>
                  <p className="gx-mb-0">
                    {businessAddress.emailId ? (
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
              <div className="gx-media gx-align-items-center gx-flex-nowrap gx-pro-contact-list">
                <div className="gx-mr-3">
                  <i className={`icon icon-phone gx-fs-xxl gx-text-grey`} />
                </div>
                <div className="gx-media-body">
                  <span className="gx-mb-0 gx-text-grey gx-fs-sm">
                    <IntlMessages id="app.supplierregistration.field.business_phoneNumber1" />
                  </span>
                  <p className="gx-mb-0">
                    {businessAddress.phoneNumber1 ? (
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
              <div className="gx-media gx-align-items-center gx-flex-nowrap gx-pro-contact-list">
                <div className="gx-mr-3">
                  <i className={`icon icon-phone gx-fs-xxl gx-text-grey`} />
                </div>
                <div className="gx-media-body">
                  <span className="gx-mb-0 gx-text-grey gx-fs-sm">
                    <IntlMessages id="app.supplierregistration.field.business_phoneNumber2" />
                  </span>
                  <p className="gx-mb-0">
                    {businessAddress.phoneNumber2 ? (
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
            </Card>

            <Card
              title={<IntlMessages id="app.supplierregistration.business_contact_title" />}
              className="gx-card-widget gx-card-profile-sm"
            >
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
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SupplierDetails;
