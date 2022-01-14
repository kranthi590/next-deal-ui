import { Avatar, Row, Col, Card } from 'antd';
import React from 'react';
import IntlMessages from '../../../util/IntlMessages';

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
    billingAddress,
    inchargeFullName,
    emailId,
    inchargeRole,
    isShared,
  } = props.supplierDetails;
  let categoriesList = [
    { value: '6', text: 'Alimentación' },
    { value: '19', text: 'Artículos de oficina' },
    { value: '10', text: 'Bodegaje' },
    { value: '13', text: 'Capacitación' },
    { value: '14', text: 'Contabilidad' },
    { value: '5', text: 'Diseño web y logo' },
    { value: '4', text: 'E-commerce' },
    { value: '16', text: 'Entretenimiento' },
    { value: '18', text: 'Eventos' },
    { value: '27', text: 'Fotografía' },
    { value: '21', text: 'Imprenta y gráficas' },
    { value: '26', text: 'Ingeniería' },
    { value: '15', text: 'Legal' },
    { value: '30', text: 'Limpieza y aseo' },
    { value: '28', text: 'Maquinaria y construcción' },
    { value: '1', text: 'Marketing digital' },
    { value: '3', text: 'Packaging' },
    { value: '17', text: 'Productos y regalos corporativos' },
    { value: '29', text: 'Salud y belleza' },
    { value: '20', text: 'PackaServicios de importación y exportaciónging' },
    { value: '8', text: 'Software y programación' },
    { value: '25', text: 'Textil y calzado' },
  ];
  // const categoriesString = categoriesList.map(item=>categories.includes(item.))

  return (
    <div>
      <div className="gx-profile-banner">
        <div className="gx-profile-container">
          <div className="gx-profile-banner-top">
            <div className="gx-profile-banner-top-left">
              <div className="gx-profile-banner-avatar">
                <Avatar className="gx-size-90" alt="..." src={logoUrl} />
              </div>
              <div className="gx-profile-banner-avatar-info">
                <h2 className="gx-mb-2 gx-mb-sm-3 gx-fs-xxl gx-font-weight-light">{legalName}</h2>
                <p className="gx-mb-0 gx-fs-lg">{businessAddress.addressLine1}</p>
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
                      <i className={`icon icon-company gx-fs-xlxl gx-text-orange`} />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">
                        <IntlMessages id="app.supplierregistration.field.business_legalName" />
                      </h6>
                      <p className="gx-mb-0">{legalName}</p>
                    </div>
                  </div>
                </Col>
                <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                  <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                    <div className="gx-mr-3">
                      <i className={`icon icon-company gx-fs-xlxl gx-text-orange`} />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">
                        {<IntlMessages id="app.supplierregistration.field.business_fantasyName" />}
                      </h6>
                      <p className="gx-mb-0">{fantasyName}</p>
                    </div>
                  </div>
                </Col>
                <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                  <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                    <div className="gx-mr-3">
                      <i className={`icon icon-company gx-fs-xlxl gx-text-orange`} />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">
                        {<IntlMessages id="app.supplierregistration.field.business_rut" />}
                      </h6>
                      <p className="gx-mb-0">{rut}</p>
                    </div>
                  </div>
                </Col>
                <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                  <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                    <div className="gx-mr-3">
                      <i className={`icon icon-geo-location gx-fs-xlxl gx-text-orange`} />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">
                        {<IntlMessages id="app.supplierregistration.field.business_addressLine1" />}
                      </h6>
                      <p className="gx-mb-0">{businessAddress.addressLine1}</p>
                    </div>
                  </div>
                </Col>
                <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                  <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                    <div className="gx-mr-3">
                      <i className={`icon icon-geo-location gx-fs-xlxl gx-text-orange`} />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">
                        {<IntlMessages id="app.supplierregistration.field.business_addressLine2" />}
                      </h6>
                      <p className="gx-mb-0">{businessAddress.addressLine2}</p>
                    </div>
                  </div>
                </Col>
                <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                  <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                    <div className="gx-mr-3">
                      <i className={`icon icon-company gx-fs-xlxl gx-text-orange`} />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">
                        {<IntlMessages id="app.supplierregistration.field.business_regionId" />}
                      </h6>
                      <p className="gx-mb-0">{}</p>
                    </div>
                  </div>
                </Col>
                <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                  <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                    <div className="gx-mr-3">
                      <i className={`icon icon-company gx-fs-xlxl gx-text-orange`} />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">
                        {<IntlMessages id="app.supplierregistration.field.serviceLocations" />}
                      </h6>
                      <p className="gx-mb-0">{}</p>
                    </div>
                  </div>
                </Col>
                <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                  <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                    <div className="gx-mr-3">
                      <i className={`icon icon-company gx-fs-xlxl gx-text-orange`} />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">
                        {<IntlMessages id="app.supplierregistration.field.business_communeId" />}
                      </h6>
                      <p className="gx-mb-0">{}</p>
                    </div>
                  </div>
                </Col>
                <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                  <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                    <div className="gx-mr-3">
                      <i className={`icon icon-company gx-fs-xlxl gx-text-orange`} />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">
                        {<IntlMessages id="app.supplierregistration.field.business_type" />}
                      </h6>
                      <p className="gx-mb-0">{type === 'supplier' ? 'Emprendedor' : 'Pyme'}</p>
                    </div>
                  </div>
                </Col>
                <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                  <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                    <div className="gx-mr-3">
                      <i className={`icon icon-feedback gx-fs-xlxl gx-text-orange`} />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">
                        {
                          <IntlMessages id="app.supplierregistration.field.business_supplier_info" />
                        }
                      </h6>
                      <p className="gx-mb-0">{businessAddress.additionalData}</p>
                    </div>
                  </div>
                </Col>
                <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                  <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                    <div className="gx-mr-3">
                      <i className={`icon icon-forward-o gx-fs-xlxl gx-text-orange`} />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">Share supplier info</h6>
                      <p className="gx-mb-0">{isShared ? 'Yes' : 'No'}</p>
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
                      <i className={`icon icon-geo-location gx-fs-xlxl gx-text-orange`} />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">
                        <IntlMessages id="app.supplierregistration.field.billing_addressLine1" />
                      </h6>
                      <p className="gx-mb-0">{billingAddress.addressLine1}</p>
                    </div>
                  </div>
                </Col>
                <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                  <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                    <div className="gx-mr-3">
                      <i className={`icon icon-geo-location gx-fs-xlxl gx-text-orange`} />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">
                        <IntlMessages id="app.supplierregistration.field.billing_addressLine2" />
                      </h6>
                      <p className="gx-mb-0">{billingAddress.addressLine2}</p>
                    </div>
                  </div>
                </Col>
                <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                  <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                    <div className="gx-mr-3">
                      <i className={`icon icon-company gx-fs-xlxl gx-text-orange`} />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">
                        <IntlMessages id="app.supplierregistration.field.billing_regionId" />
                      </h6>
                      <p className="gx-mb-0">{billingAddress.regionId}</p>
                    </div>
                  </div>
                </Col>
                <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                  <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                    <div className="gx-mr-3">
                      <i className={`icon icon-company gx-fs-xlxl gx-text-orange`} />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">
                        <IntlMessages id="app.supplierregistration.field.billing_communeId" />
                      </h6>
                      <p className="gx-mb-0">{billingAddress.communeId}</p>
                    </div>
                  </div>
                </Col>
                <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                  <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                    <div className="gx-mr-3">
                      <i className={`icon icon-phone gx-fs-xlxl gx-text-orange`} />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">
                        <IntlMessages id="app.supplierregistration.field.billing_phoneNumber1" />
                      </h6>
                      <p className="gx-mb-0">{billingAddress.phoneNumber1}</p>
                    </div>
                  </div>
                </Col>
                <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                  <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
                    <div className="gx-mr-3">
                      <i className={`icon icon-phone gx-fs-xlxl gx-text-orange`} />
                    </div>
                    <div className="gx-media-body">
                      <h6 className="gx-mb-1 gx-text-grey">
                        <IntlMessages id="app.supplierregistration.field.billing_phoneNumber2" />
                      </h6>
                      <p className="gx-mb-0">{billingAddress.phoneNumber2}</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xl={8} lg={10} md={10} sm={24} xs={24}>
            <Card title={'Contact'} className="gx-card-widget gx-card-profile-sm">
              <div className="gx-media gx-align-items-center gx-flex-nowrap gx-pro-contact-list">
                <div className="gx-mr-3">
                  <i className={`icon icon-email gx-fs-xxl gx-text-grey`} />
                </div>
                <div className="gx-media-body">
                  <span className="gx-mb-0 gx-text-grey gx-fs-sm">
                    <IntlMessages id="app.supplierregistration.field.business_emailId" />
                  </span>
                  <p className="gx-mb-0">
                    <a className="gx-link" href={`mailto:${businessAddress.emailId}`}>
                      {businessAddress.emailId}
                    </a>
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
                      <a className="gx-link" href={webSiteUrl} target="_blank">
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
                      <a className="gx-link" href={`tel:${businessAddress.phoneNumber1}`}>
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
                      <a className="gx-link" href={`tel:${businessAddress.phoneNumber2}`}>
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
                  <p className="gx-mb-0">{inchargeFullName}</p>
                </div>
              </div>
              <div className="gx-media gx-align-items-center gx-flex-nowrap gx-pro-contact-list">
                <div className="gx-mr-3">
                  <i className={`icon icon-wall gx-fs-xxl gx-text-grey`} />
                </div>
                <div className="gx-media-body">
                  <span className="gx-mb-0 gx-text-grey gx-fs-sm">
                    <IntlMessages id="app.supplierregistration.field.bcontact_surname" />
                  </span>
                  <p className="gx-mb-0">{}</p>
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
                    <a className="gx-link" href={`mailto:${emailId}`}>
                      {emailId}
                    </a>
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
                  <p className="gx-mb-0">{inchargeRole}</p>
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
