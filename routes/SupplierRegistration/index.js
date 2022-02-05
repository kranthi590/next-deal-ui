import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, Select, Col, Row, Upload } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SweetAlert from 'react-bootstrap-sweetalert';
// Utils
import IntlMessages from '../../util/IntlMessages';
import { useAuth } from '../../contexts/use-auth';
import { useRegistration } from '../../contexts/business-registration';
import { extractData, isValidObject, getPhonePrefix, errorNotification } from '../../util/util';
import { validate, clean } from 'rut.js';
import FilesManager from '../../app/common/FileManager';
import { uploadFiles } from '../../util/Api';
import urlRegx from 'url-regex';

// Components
import CircularProgress from '../../app/components/CircularProgress';
import WidgetHeader from '../../app/components/WidgetHeader';
import Aside from '../../app/components/Aside';
import Footer from '../../app/components/Footer';
import Rut from '../../shared/Rut';
import { isEmpty } from 'lodash';

// Styles
import '../../styles/form-page.css';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const SupplierRegistration = props => {
  const router = useRouter();
  const { isLoading } = useAuth();
  const { isAuthenticated, onAletSuccess } = props;
  const { fetchRegions, fetchCommune, registerSupplier, error, uploadSupplierLogo } =
    useRegistration();

  const [form] = Form.useForm();

  const [sameAsBusiness, setSameAsBusiness] = useState(false);
  const [regions, setRegions] = useState([]);
  const [communes1, setCommunes1] = useState([]);
  const [communes2, setCommunes2] = useState([]);
  const [iAccept, setIAccept] = useState(false);
  const [isSupplierInfoShareable, setSupplierInfoShareable] = useState(false);
  const [rut, setRut] = useState(null);
  const [isLogoUploaded, setLogoUploaded] = useState(false);
  const [files, setFiles] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchRegions(({ regions }) => {
      setRegions(regions);
    });
  }, []);

  const businessRegionChangeHandler = value => {
    form.setFieldsValue({
      business_communeId: '',
    });
    setCommunes1([]);
    fetchCommune({ regionId: value }, data => {
      const communes = data && data.length > 0 ? data[0] : [];
      setCommunes1(communes);
    });
  };

  const billingRegionChangeHandler = value => {
    form.setFieldsValue({
      billing_communeId: '',
    });
    setCommunes2([]);
    fetchCommune({ regionId: value }, data => {
      const communes = data && data.length > 0 ? data[0] : [];
      setCommunes2(communes);
    });
  };

  const businessAddressHandler = () => {
    setSameAsBusiness(!sameAsBusiness);
  };

  const prefixSelector = name => (
    <Form.Item name={name} noStyle>
      <Select style={{ width: 70 }} defaultValue={process.env.NEXT_PUBLIC_DEFAULT_LOCALE_PREFIX}>
        <Option value="56">+56</Option>
      </Select>
    </Form.Item>
  );

  const getFormData = data => {
    const business = extractData('business_', data);
    const billing = extractData('billing_', data);
    const contact = extractData('bcontact_', data);

    const businessAddress = {
      addressLine1: business.addressLine1,
      addressLine2: business.addressLine2,
      communeId: business.communeId,
      regionId: business.regionId,
      emailId: business.emailId,
      phoneNumber1: getPhonePrefix(business.telephone1) + business.phoneNumber1,
      countryId: 1,
    };

    const billingAddress = {
      addressLine1: billing.addressLine1,
      addressLine2: billing.addressLine2,
      communeId: billing.communeId,
      regionId: billing.regionId,
      emailId: billing.emailId,
      phoneNumber1: getPhonePrefix(billing.telephone1) + billing.phoneNumber1,
      countryId: 1,
    };

    let formData = {
      businessAddress: businessAddress,
      legalName: business.legalName,
      fantasyName: business.fantasyName,
      rut: business.rut ? clean(business.rut) : business.rut,
      emailId: business.emailId,
      categories: business.categories,
      serviceLocations: data.serviceLocations,
      type: business.type,

      isShared: props.isBuyer ? isSupplierInfoShareable : props.isShared,
      inchargeRole: 'Owner',
      logoUrl:
        'https://previews.123rf.com/images/trustle/trustle1509/trustle150900041/45658560-abstract-web-icon-and-logo-sample-vector-illusration.jpg',
    };

    if (!isEmpty(business.webSiteUrl)) {
      formData.webSiteUrl = addProdocol(business.webSiteUrl);
    }

    if (sameAsBusiness) {
      formData.billingAddress = businessAddress;
    } else if (isValidObject(billing)) {
      formData.billingAddress = billingAddress;
    }

    if (isValidObject(contact)) {
      formData.inchargeFullName = `${contact.name} ${contact.surname}`;
    }

    return formData;
  };
  const onAlertConfirmed = () => {
    setShowAlert(false);
    if (!isAuthenticated) {
      router.push(`https://${process.env.NEXT_PUBLIC_WEB_HOST}`);
    }
    if (onAletSuccess) {
      onAletSuccess();
    }
  };
  const addProdocol = url => {
    if (url.indexOf('http://') == 0 || url.indexOf('https://') == 0) {
      return url;
    } else {
      return 'https://' + url;
    }
  };
  const onFinishFailed = errorInfo => {};

  const onFinish = async values => {
    getFormData(values);
    registerSupplier(getFormData(values), isAuthenticated, async data => {
      try {
        if (files.length > 0) {
          await uploadFiles(
            files,
            {
              assetRelation: 'supplier_logo',
              assetRelationId: data.id,
            },
            false,
          );
          setShowAlert(true);
        } else {
          setShowAlert(true);
        }
      } catch (error) {
        errorNotification(error.message, 'app.registration.errorMessageTitle');
      }
    });
  };
  const onChange = async value => {
    setRut(value);
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  const handleFileUpload = () => {
    setLogoUploaded(true);
  };

  return (
    <div className="gx-app-login-wrap registration-container">
      <Aside
        heading="app.userAuth.welcome"
        content="app.userAuth.getAccount"
        url={`https://${process.env.NEXT_PUBLIC_WEB_HOST}`}
      />
      <div className="right-aside">
        <div className="form-container">
          <div className="gx-app-login-content registration-form">
            <div className="heading-wrapper">
              <h1>
                <IntlMessages id="app.supplierregistration.page_title" />
              </h1>
            </div>
            <Form
              layout="inline"
              form={form}
              initialValues={{ remember: true }}
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="gx-signin-form gx-form-row0"
            >
              <Row gutter={24} className="bottom-divider">
                <Col xs={24}>
                  <WidgetHeader title={<IntlMessages id="app.supplierregistration.form_title" />} />
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="business_fantasyName"
                    label={
                      <IntlMessages id="app.supplierregistration.field.business_fantasyName" />
                    }
                    rules={[
                      {
                        required: true,
                        message: (
                          <IntlMessages id="app.supplierregistration.field.business_fantasyName.error.required" />
                        ),
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Fantasy Name" />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="business_legalName"
                    label={<IntlMessages id="app.supplierregistration.field.business_legalName" />}
                    rules={[
                      {
                        required: true,
                        message: (
                          <IntlMessages id="app.supplierregistration.field.business_legalName.error.required" />
                        ),
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Business Name" />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="business_rut"
                    label={<IntlMessages id="app.supplierregistration.field.business_rut" />}
                    rules={[
                      {
                        required: true,
                        validator: (_, value) => {
                          if (!validate(value)) {
                            return Promise.reject(
                              <IntlMessages id="app.supplierregistration.field.business_rut.error.valid" />,
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Rut
                      {...props}
                      className="gx-w-100"
                      value={rut}
                      size="large"
                      onChange={onChange}
                      placeholder="RUT"
                    />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="business_addressLine1"
                    label={
                      <IntlMessages id="app.supplierregistration.field.business_addressLine1" />
                    }
                    rules={[
                      {
                        required: true,
                        message: (
                          <IntlMessages id="app.supplierregistration.field.business_addressLine1.error.required" />
                        ),
                      },
                    ]}
                  >
                    <Input size="large" placeholder="san pascual" />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="business_addressLine2"
                    label={
                      <IntlMessages id="app.supplierregistration.field.business_addressLine2" />
                    }
                    rules={[
                      {
                        required: true,
                        message: (
                          <IntlMessages id="app.supplierregistration.field.business_addressLine2.error.required" />
                        ),
                      },
                    ]}
                  >
                    <Input size="large" placeholder="las condes" />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    label={<IntlMessages id="app.supplierregistration.field.business_regionId" />}
                    name="business_regionId"
                    rules={[
                      {
                        required: true,
                        message: (
                          <IntlMessages id="app.supplierregistration.field.business_regionId.error.required" />
                        ),
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      size="large"
                      placeholder="Please select Region"
                      onChange={businessRegionChangeHandler}
                      filterOption={(input, option) => {
                        return (
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {regions &&
                        regions.map(region => (
                          <Option key={region.id + region.name} value={region.id}>
                            {region.name}
                          </Option>
                        ))}
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    label={<IntlMessages id="app.supplierregistration.field.serviceLocations" />}
                    name="serviceLocations"
                    rules={[
                      {
                        required: true,
                        message: (
                          <IntlMessages id="app.supplierregistration.field.serviceLocations.error.required" />
                        ),
                        type: 'array',
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      size="large"
                      placeholder="Select your service locations"
                      mode="multiple"
                      filterOption={(input, option) => {
                        return (
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {regions &&
                        regions.map(region => (
                          <Option key={region.id + region.name} value={region.id}>
                            {region.name}
                          </Option>
                        ))}
                    </Select>
                  </FormItem>
                </Col>

                <Col sm={12} xs={24}>
                  <FormItem
                    label={<IntlMessages id="app.supplierregistration.field.business_communeId" />}
                    name="business_communeId"
                    rules={[
                      {
                        required: true,
                        message: (
                          <IntlMessages id="app.supplierregistration.field.business_communeId.error.required" />
                        ),
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      size="large"
                      placeholder="Please select Commune"
                      filterOption={(input, option) => {
                        return (
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {communes1 &&
                        communes1.map(commune => (
                          <Option key={commune.id + commune.name} value={commune.id}>
                            {commune.name}
                          </Option>
                        ))}
                    </Select>
                  </FormItem>
                </Col>

                <Col sm={12} xs={24}>
                  <FormItem
                    name="business_webSiteUrl"
                    label={<IntlMessages id="app.supplierregistration.field.business_webSiteUrl" />}
                    rules={[
                      { required: false },
                      {
                        validator(_, value, cb) {
                          if (!value) {
                            return Promise.resolve();
                          }
                          let tempUrl = addProdocol(value);
                          if (urlRegx().test(tempUrl)) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject(
                              <IntlMessages id="app.supplierregistration.field.business_webSiteUrl.error.required" />,
                            );
                          }
                        },
                      },
                    ]}
                  >
                    <Input addonBefore="https://" size="large" placeholder="nextdeal.cl" />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="business_type"
                    label={<IntlMessages id="app.supplierregistration.field.business_type" />}
                    rules={[
                      {
                        required: true,
                        message: (
                          <IntlMessages id="app.supplierregistration.field.business_type.error.required" />
                        ),
                      },
                    ]}
                  >
                    <Select size="large" placeholder="Please select type">
                      <Option value="Emprendedor">Emprendedor</Option>
                      <Option value="Pyme">Pyme</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    label={
                      <IntlMessages id="app.supplierregistration.field.business_phoneNumber1" />
                    }
                    name="business_phoneNumber1"
                    rules={[
                      {
                        required: true,
                        validator: (_, value) => {
                          if (!value) {
                            return Promise.reject(
                              <IntlMessages id="app.supplierregistration.field.business_phoneNumber1.error.required" />,
                            );
                          } else if (isNaN(value)) {
                            return Promise.reject(
                              <IntlMessages id="app.supplierregistration.field.business_phoneNumber1.error.required" />,
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      addonBefore={prefixSelector('business_telephone1')}
                      placeholder="Telephone1"
                    />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    label={
                      <IntlMessages id="app.supplierregistration.field.business_phoneNumber2" />
                    }
                    name="business_phoneNumber2"
                  >
                    <Input
                      placeholder="Telephone2"
                      addonBefore={prefixSelector('business_telephone2')}
                    />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    label={<IntlMessages id="app.supplierregistration.field.business_emailId" />}
                    name="business_emailId"
                    rules={[
                      {
                        required: true,
                        type: 'email',
                        message: (
                          <IntlMessages id="app.supplierregistration.field.business_emailId.error.email" />
                        ),
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Email" />
                  </FormItem>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    label={<IntlMessages id="app.supplierregistration.field.business_categories" />}
                    name="business_categories"
                    rules={[
                      {
                        required: true,
                        message: (
                          <IntlMessages id="app.supplierregistration.field.business_categories.error.required" />
                        ),
                        type: 'array',
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      mode="multiple"
                      placeholder="Please select your categories"
                    >
                      <Option value="6">Alimentación</Option>
                      <Option value="19">Artículos de oficina</Option>
                      <Option value="10">Bodegaje</Option>
                      <Option value="13">Capacitación</Option>
                      <Option value="14">Contabilidad</Option>
                      <Option value="2">Delivery</Option>
                      <Option value="5">Diseño web y logo</Option>
                      <Option value="4">E-commerce</Option>
                      <Option value="16">Entretenimiento</Option>
                      <Option value="18">Eventos</Option>
                      <Option value="27">Fotografía</Option>
                      <Option value="21">Imprenta y gráficas</Option>
                      <Option value="26">Ingeniería</Option>
                      <Option value="15">Legal</Option>
                      <Option value="30">Limpieza y aseo</Option>
                      <Option value="9">Manufactura y decoración</Option>
                      <Option value="28">Maquinaria y construcción</Option>
                      <Option value="1">Marketing digital</Option>
                      <Option value="3">Packaging</Option>
                      <Option value="17">Productos y regalos corporativos</Option>
                      <Option value="29">Salud y belleza</Option>
                      <Option value="20">Servicios de importación y exportación</Option>
                      <Option value="8">Software y programación</Option>
                      <Option value="25">Textil y calzado</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <FormItem
                    label={
                      <IntlMessages id="app.supplierregistration.field.business_supplier_info" />
                    }
                    name="business_supplier_info"
                  >
                    <TextArea placeholder="services offer" autosize />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <Form.Item>
                    <Checkbox onChange={businessAddressHandler} checked={sameAsBusiness}>
                      <IntlMessages id="app.supplierregistration.field.samebilling_address" />
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>

              {!sameAsBusiness && (
                <Row gutter={24} className="bottom-divider">
                  <Col xs={24}>
                    <WidgetHeader
                      title={<IntlMessages id="app.supplierregistration.billing_title" />}
                    />
                  </Col>
                  <Col sm={12} xs={24}>
                    <FormItem
                      label={
                        <IntlMessages id="app.supplierregistration.field.billing_addressLine1" />
                      }
                      name="billing_addressLine1"
                    >
                      <Input size="large" placeholder="san pascual" />
                    </FormItem>
                  </Col>
                  <Col sm={12} xs={24}>
                    <FormItem
                      label={
                        <IntlMessages id="app.supplierregistration.field.billing_addressLine2" />
                      }
                      name="billing_addressLine2"
                    >
                      <Input size="large" placeholder="las condes" />
                    </FormItem>
                  </Col>
                  <Col sm={12} xs={24}>
                    <FormItem
                      label={<IntlMessages id="app.supplierregistration.field.billing_regionId" />}
                      name="billing_regionId"
                    >
                      <Select
                        size="large"
                        placeholder="Please select Region"
                        onChange={billingRegionChangeHandler}
                      >
                        {regions &&
                          regions.map(region => (
                            <Option key={region.id + region.name} value={region.id}>
                              {region.name}
                            </Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col sm={12} xs={24}>
                    <FormItem
                      label={<IntlMessages id="app.supplierregistration.field.billing_communeId" />}
                      name="billing_communeId"
                    >
                      <Select size="large" placeholder="Please select Commune">
                        {communes2 &&
                          communes2.map(commune => (
                            <Option key={commune.id + commune.name} value={commune.id}>
                              {commune.name}
                            </Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col sm={12} xs={24}>
                    <FormItem
                      label={
                        <IntlMessages id="app.supplierregistration.field.billing_phoneNumber1" />
                      }
                      name="billing_phoneNumber1"
                    >
                      <Input
                        size="large"
                        placeholder="Telephone1"
                        addonBefore={prefixSelector('billing_telephone1')}
                      />
                    </FormItem>
                  </Col>
                  <Col sm={12} xs={24}>
                    <FormItem
                      label={
                        <IntlMessages id="app.supplierregistration.field.billing_phoneNumber2" />
                      }
                      name="billing_phoneNumber2"
                    >
                      <Input
                        size="large"
                        placeholder="Telephone2"
                        addonBefore={prefixSelector('billing_telephone2')}
                      />
                    </FormItem>
                  </Col>
                </Row>
              )}

              <Row gutter={24} style={{ marginBottom: 20 }}>
                <Col xs={24}>
                  <WidgetHeader
                    title={<IntlMessages id="app.supplierregistration.business_contact_title" />}
                  />
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    label={<IntlMessages id="app.supplierregistration.field.bcontact_name" />}
                    name="bcontact_name"
                  >
                    <Input size="large" placeholder="Name" />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    label={<IntlMessages id="app.supplierregistration.field.bcontact_surname" />}
                    name="bcontact_surname"
                  >
                    <Input size="large" placeholder="Surname" />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    label={<IntlMessages id="app.supplierregistration.field.bcontact_email" />}
                    name="bcontact_email"
                    rules={[
                      {
                        required: false,
                        type: 'email',
                        warningOnly: true,
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Email" />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    label={<IntlMessages id="app.supplierregistration.field.bcontact_charge" />}
                    name="bcontact_charge"
                  >
                    <Input size="large" placeholder="Charge" />
                  </FormItem>
                </Col>
              </Row>
              {props.isBuyer && (
                <Row
                  style={{ width: '100%', justifyContent: 'right' }}
                  gutter={24}
                  className="bottom-divider"
                >
                  <Col>
                    <Form.Item name="supplierInfoSharing">
                      <Checkbox onChange={() => setSupplierInfoShareable(!isSupplierInfoShareable)}>
                        <IntlMessages id="app.supplierregistration.shareinfo_message" />
                      </Checkbox>
                      <span className="gx-signup-form-forgot gx-link"></span>
                    </Form.Item>
                  </Col>
                </Row>
              )}
              <Row gutter={24} style={{ marginBottom: 20 }}>
                <Col xs={24}>
                  <WidgetHeader
                    title={<IntlMessages id="app.supplierregistration.business_logo_title" />}
                  />
                </Col>
                <Col
                  xs={24}
                  style={{
                    height: '150px',
                    overflow: 'scroll',
                  }}
                >
                  <FilesManager
                    files={files}
                    context={{
                      assetRelation: 'supplier_logo',
                      //  assetRelationId: quotationData.id
                    }}
                    maxCount={1}
                    customSubmitHandler={({ fileList }) => {
                      setFiles(fileList);
                    }}
                    accept={["image/*"]}
                  />
                </Col>
              </Row>
              <Row style={{ width: '100%', justifyContent: 'right' }}>
                <Col>
                  <Form.Item
                    name="iAccept"
                    rules={[
                      {
                        required: !iAccept && true,
                        message: (
                          <IntlMessages id="app.supplierregistration.field.iAccept.error.required" />
                        ),
                      },
                    ]}
                  >
                    <Checkbox onChange={() => setIAccept(!iAccept)}>
                      <IntlMessages id="appModule.iAccept" />
                    </Checkbox>
                    <span className="gx-signup-form-forgot gx-link">
                      <Link href={`https://${process.env.NEXT_PUBLIC_WEB_HOST + '/terms-of-use'}`}>
                        <a target="_blank">
                          <IntlMessages id="appModule.termAndCondition" />
                        </a>
                      </Link>
                    </span>
                  </Form.Item>
                </Col>
                <Col>
                  <FormItem>
                    <div>
                      <Button type="primary" className="gx-mb-0" htmlType="submit">
                        <IntlMessages id="app.supplierregistration.field.register.button" />
                      </Button>
                    </div>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <Footer />
      </div>
      {isLoading && (
        <div className="gx-loader-view">
          <CircularProgress />
        </div>
      )}
      <SweetAlert
        confirmBtnText={<IntlMessages id="button.ok" />}
        show={showAlert}
        success
        title={<IntlMessages id="app.supplierregistration.successmessage.title" />}
        onConfirm={onAlertConfirmed}
      >
        <div>
          <IntlMessages id="app.supplierregistration.successmessage.content" />
        </div>
      </SweetAlert>
    </div>
  );
};

SupplierRegistration.defaultProps = {
  showLoginLink: true,
  isShared: true,
};
export default SupplierRegistration;
