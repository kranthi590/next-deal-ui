import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, Select, Col, Row, Tooltip } from 'antd';
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
import { TODO_CHILE } from '../../util/appConstants';
import { useIntl } from 'react-intl';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const SupplierRegistration = props => {
  const router = useRouter();
  const { isLoading } = useAuth();
  const { isAuthenticated, onAletSuccess, onSupplierCreated } = props;
  const {
    fetchRegions,
    fetchCommune,
    registerSupplier,
    error,
    uploadSupplierLogo,
    fetchCategories,
  } = useRegistration();

  const [form] = Form.useForm();

  const [sameAsBusiness, setSameAsBusiness] = useState(false);
  const [regions, setRegions] = useState([]);
  const [communes1, setCommunes1] = useState([]);
  const [communes2, setCommunes2] = useState([]);
  const [supplierCategories, setSupplierCategories] = useState([]);
  const [iAccept, setIAccept] = useState(false);
  const [isSupplierInfoShareable, setSupplierInfoShareable] = useState(false);
  const [rut, setRut] = useState(null);
  const [isLogoUploaded, setLogoUploaded] = useState(false);
  const [files, setFiles] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const intl = useIntl();
  const [newSupplierName, setNewSupplierName] = useState('');
  useEffect(() => {
    fetchRegions(({ regions }) => {
      setRegions(regions);
    });
    loadCategories();
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

  const loadCategories = () => {
    fetchCategories(data => {
      setSupplierCategories(data);
    });
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
      phoneNumber1: business.phoneNumber1
        ? getPhonePrefix(business.telephone1) + business.phoneNumber1
        : undefined,
      // phoneNumber2: business.phoneNumber2 ? getPhonePrefix(business.telephone2) + business.phoneNumber2 : undefined,
      countryId: isAuthenticated ? undefined : 1,
      // referencia: business.referencia
    };

    const billingAddress = {
      addressLine1: billing.addressLine1,
      addressLine2: billing.addressLine2,
      communeId: billing.communeId,
      regionId: billing.regionId,
      emailId: billing.emailId,
      phoneNumber1: billing.phoneNumber1
        ? getPhonePrefix(billing.telephone1) + billing.phoneNumber1
        : undefined,
      phoneNumber2: billing.phoneNumber2
        ? getPhonePrefix(billing.telephone2) + billing.phoneNumber2
        : undefined,
      countryId: 1,
    };

    let formData = {
      // businessAddress: businessAddress,
      legalName: business.legalName,
      // fantasyName: business.fantasyName,
      rut: business.rut ? clean(business.rut) : business.rut,
      emailId: business.emailId,
      categories: business.categories,
      // serviceLocations: data.serviceLocations,
      // type: business.type,

      isShared: props.isBuyer ? isSupplierInfoShareable : props.isShared,
      inchargeRole: contact.charge,
    };
    if (isValidObject(businessAddress)) {
      formData.businessAddress = businessAddress;
    }
    if (business.supplier_info) {
      formData.comments = business.supplier_info;
    }

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
    registerSupplier(getFormData(values), isAuthenticated, async data => {
      setNewSupplierName(data.legalName);
      if (onSupplierCreated) {
        onSupplierCreated(data.id);
      }
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
      {props.isBannerShown && (
        <Aside
          heading="app.userAuth.welcome"
          content="app.userAuth.getAccount"
          url={`https://${process.env.NEXT_PUBLIC_WEB_HOST}`}
        />
      )}
      <div className="right-aside">
        <div className="form-container">
          <div className="gx-app-login-content registration-form">
            <div className="heading-wrapper">
              <h1>
                <IntlMessages id="app.supplierregistration.page_title" />
              </h1>
            </div>
            {isAuthenticated ? (
              <>
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
                      <WidgetHeader
                        title={<IntlMessages id="app.supplierregistration.form_title" />}
                      />
                    </Col>
                    <Col sm={12} xs={24}>
                      <FormItem
                        name="business_legalName"
                        label={
                          <IntlMessages id="app.supplierregistration.field.business_legalName" />
                        }
                        rules={[
                          {
                            required: true,
                            message: (
                              <IntlMessages id="app.supplierregistration.field.business_legalName.error.required" />
                            ),
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          placeholder={intl.formatMessage({
                            id: 'app.supplierregistration.field.business_legalName',
                          })}
                        />
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
                          placeholder={intl.formatMessage({
                            id: 'app.supplierregistration.field.business_rut',
                          })}
                        />
                      </FormItem>
                    </Col>
                    <Col xs={24}>
                      <Form.Item
                        label={
                          <span>
                            <IntlMessages id="app.supplierregistration.field.business_categories" />
                            &nbsp;
                            <Tooltip
                              title={
                                <IntlMessages id="app.supplierregistration.field.business_categories.tooltip" />
                              }
                            >
                              <ExclamationCircleOutlined />
                            </Tooltip>
                            &nbsp;
                          </span>
                        }
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
                          placeholder={intl.formatMessage({
                            id: 'app.supplierregistration.field.business_categories.pleaseSelectYourCategories',
                          })}
                          filterOption={(input, option) => {
                            return (
                              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                        >
                          {supplierCategories &&
                            supplierCategories.map(category => (
                              <Option key={category.id + category.name} value={category.id}>
                                {category.name}
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col sm={12} xs={24}>
                      <FormItem
                        label={
                          <IntlMessages id="app.supplierregistration.field.business_emailId" />
                        }
                        name="business_emailId"
                        rules={[
                          {
                            required: false,
                            type: 'email',
                            message: (
                              <IntlMessages id="app.supplierregistration.field.business_emailId.error.email" />
                            ),
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          placeholder={intl.formatMessage({
                            id: 'app.supplierregistration.field.business_emailId',
                          })}
                        />
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
                            required: false,
                            validator: (_, value) => {
                              if (value && isNaN(value)) {
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
                          placeholder={intl.formatMessage({
                            id: 'app.supplierregistration.field.business_phoneNumber1',
                          })}
                        />
                      </FormItem>
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
                          <Link
                            href={`https://${process.env.NEXT_PUBLIC_WEB_HOST + '/terms-of-use'}`}
                          >
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
              </>
            ) : (
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
                    <WidgetHeader
                      title={<IntlMessages id="app.supplierregistration.form_title" />}
                    />
                  </Col>
                  {/* <Col sm={12} xs={24}>
                  <FormItem
                    name="business_fantasyName"
                    label={
                      <IntlMessages id="app.supplierregistration.field.business_fantasyName" />
                    }
                  >
                    <Input
                      size="large"
                      placeholder={intl.formatMessage({
                        id: 'app.supplierregistration.field.business_fantasyName',
                      })}
                    />
                  </FormItem>
                </Col> */}
                  <Col sm={12} xs={24}>
                    <FormItem
                      name="business_legalName"
                      label={
                        <IntlMessages id="app.supplierregistration.field.business_legalName" />
                      }
                      rules={[
                        {
                          required: true,
                          message: (
                            <IntlMessages id="app.supplierregistration.field.business_legalName.error.required" />
                          ),
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder={intl.formatMessage({
                          id: 'app.supplierregistration.field.business_legalName',
                        })}
                      />
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
                        placeholder={intl.formatMessage({
                          id: 'app.supplierregistration.field.business_rut',
                        })}
                      />
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
                        placeholder={intl.formatMessage({
                          id: 'app.supplierregistration.field.business_regionId.PleaseSelectRegion',
                        })}
                        onChange={businessRegionChangeHandler}
                        filterOption={(input, option) => {
                          return (
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          );
                        }}
                      >
                        {regions &&
                          regions
                            .filter(r => r.name !== TODO_CHILE)
                            .map(region => (
                              <Option key={region.id + region.name} value={region.id}>
                                {region.name}
                              </Option>
                            ))}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col sm={12} xs={24}>
                    <FormItem
                      label={
                        <IntlMessages id="app.supplierregistration.field.business_communeId" />
                      }
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
                        placeholder={intl.formatMessage({
                          id: 'app.supplierregistration.field.business_communeId.pleaseSelectCommune',
                        })}
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

                  <Col sm={6} xs={24}>
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
                      <Input
                        size="large"
                        placeholder={intl.formatMessage({
                          id: 'app.supplierregistration.field.business_addressLine1',
                        })}
                      />
                    </FormItem>
                  </Col>
                  <Col sm={6} xs={24}>
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
                      <Input
                        size="large"
                        placeholder={intl.formatMessage({
                          id: 'app.supplierregistration.field.business_addressLine2_placeholder',
                        })}
                      />
                    </FormItem>
                  </Col>
                  <Col sm={12} xs={24}>
                    <FormItem
                      name="business_referencia"
                      label={
                        <IntlMessages id="app.supplierregistration.field.business_referencia" />
                      }
                    >
                      <Input
                        size="large"
                        placeholder={intl.formatMessage({
                          id: 'app.supplierregistration.field.business_referencia_placeholder',
                        })}
                      />
                    </FormItem>
                  </Col>
                  {/* <Col sm={12} xs={24}>
                  <FormItem
                    label={<IntlMessages id="app.supplierregistration.field.serviceLocations" />}
                    name="serviceLocations"
                  >
                    <Select
                      showSearch
                      size="large"
                      placeholder={intl.formatMessage({
                        id: 'app.supplierregistration.field.serviceLocations.selectYourServiceLocation',
                      })}
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
                </Col> */}
                  <Col xs={24}>
                    <Form.Item
                      label={
                        <span>
                          <IntlMessages id="app.supplierregistration.field.business_categories" />
                          &nbsp;
                          <Tooltip
                            title={
                              <IntlMessages id="app.supplierregistration.field.business_categories.tooltip" />
                            }
                          >
                            <ExclamationCircleOutlined />
                          </Tooltip>
                          &nbsp;
                        </span>
                      }
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
                        placeholder={intl.formatMessage({
                          id: 'app.supplierregistration.field.business_categories.pleaseSelectYourCategories',
                        })}
                        filterOption={(input, option) => {
                          return (
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          );
                        }}
                      >
                        {supplierCategories &&
                          supplierCategories.map(category => (
                            <Option key={category.id + category.name} value={category.id}>
                              {category.name}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col sm={12} xs={24}>
                    <FormItem
                      name="business_webSiteUrl"
                      label={
                        <IntlMessages id="app.supplierregistration.field.business_webSiteUrl" />
                      }
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
                      <Input
                        size="large"
                        placeholder={intl.formatMessage({
                          id: 'app.supplierregistration.field.business_emailId',
                        })}
                      />
                    </FormItem>
                  </Col>
                  {/* <Col sm={12} xs={24}>
                  <FormItem
                    name="business_type"
                    label={<IntlMessages id="app.supplierregistration.field.business_type" />}
                  >
                    <Select
                      size="large"
                      placeholder={intl.formatMessage({
                        id: 'app.supplierregistration.field.business_type.pleaseSelectType',
                      })}
                      showSearch
                      filterOption={(input, option) => {
                        return (
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      <Option value="Emprendedor">Emprendedor</Option>
                      <Option value="Pyme">Pyme</Option>
                    </Select>
                  </FormItem>
                </Col> */}
                  <Col sm={12} xs={24}>
                    <FormItem
                      label={
                        <IntlMessages id="app.supplierregistration.field.business_phoneNumber1" />
                      }
                      name="business_phoneNumber1"
                      rules={[
                        {
                          required: false,
                          validator: (_, value) => {
                            if (value && isNaN(value)) {
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
                        placeholder={intl.formatMessage({
                          id: 'app.supplierregistration.field.business_phoneNumber1',
                        })}
                      />
                    </FormItem>
                  </Col>
                  {/* <Col sm={12} xs={24}>
                  <FormItem
                    label={
                      <IntlMessages id="app.supplierregistration.field.business_phoneNumber2" />
                    }
                    name="business_phoneNumber2"
                    rules={[
                      {
                        required: false,
                        validator: (_, value) => {
                          if (value && isNaN(value)) {
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
                      placeholder={intl.formatMessage({
                        id: 'app.supplierregistration.field.business_phoneNumber2',
                      })}
                      addonBefore={prefixSelector('business_telephone2')}
                    />
                  </FormItem>
                </Col> */}
                  <Col xs={24}>
                    <FormItem
                      label={
                        <IntlMessages id="app.supplierregistration.field.business_supplier_info" />
                      }
                      name="business_supplier_info"
                    >
                      <TextArea
                        placeholder={intl.formatMessage({
                          id: 'app.supplierregistration.field.business_supplier_info',
                        })}
                        autosize
                      />
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
                        <Input
                          size="large"
                          placeholder={intl.formatMessage({
                            id: 'app.supplierregistration.field.billing_addressLine1',
                          })}
                        />
                      </FormItem>
                    </Col>
                    <Col sm={12} xs={24}>
                      <FormItem
                        label={
                          <IntlMessages id="app.supplierregistration.field.billing_addressLine2" />
                        }
                        name="billing_addressLine2"
                      >
                        <Input
                          size="large"
                          placeholder={intl.formatMessage({
                            id: 'app.supplierregistration.field.billing_addressLine2_placeholder',
                          })}
                        />
                      </FormItem>
                    </Col>
                    <Col sm={12} xs={24}>
                      <FormItem
                        label={
                          <IntlMessages id="app.supplierregistration.field.billing_regionId" />
                        }
                        name="billing_regionId"
                      >
                        <Select
                          size="large"
                          placeholder={intl.formatMessage({
                            id: 'app.supplierregistration.field.business_regionId.PleaseSelectRegion',
                          })}
                          onChange={billingRegionChangeHandler}
                          showSearch
                          filterOption={(input, option) => {
                            return (
                              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                        >
                          {regions &&
                            regions
                              .filter(r => r.name !== TODO_CHILE)
                              .map(region => (
                                <Option key={region.id + region.name} value={region.id}>
                                  {region.name}
                                </Option>
                              ))}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col sm={12} xs={24}>
                      <FormItem
                        label={
                          <IntlMessages id="app.supplierregistration.field.billing_communeId" />
                        }
                        name="billing_communeId"
                      >
                        <Select
                          size="large"
                          placeholder={intl.formatMessage({
                            id: 'app.supplierregistration.field.business_communeId.pleaseSelectCommune',
                          })}
                          showSearch
                          filterOption={(input, option) => {
                            return (
                              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                        >
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
                        rules={[
                          {
                            required: false,
                            validator: (_, value) => {
                              if (value && isNaN(value)) {
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
                          placeholder={intl.formatMessage({
                            id: 'app.supplierregistration.field.billing_phoneNumber1',
                          })}
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
                        rules={[
                          {
                            required: false,
                            validator: (_, value) => {
                              if (value && isNaN(value)) {
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
                          placeholder={intl.formatMessage({
                            id: 'app.supplierregistration.field.billing_phoneNumber2',
                          })}
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
                      <Input
                        size="large"
                        placeholder={intl.formatMessage({
                          id: 'app.supplierregistration.field.bcontact_name',
                        })}
                      />
                    </FormItem>
                  </Col>
                  <Col sm={12} xs={24}>
                    <FormItem
                      label={<IntlMessages id="app.supplierregistration.field.bcontact_surname" />}
                      name="bcontact_surname"
                    >
                      <Input
                        size="large"
                        placeholder={intl.formatMessage({
                          id: 'app.supplierregistration.field.bcontact_surname',
                        })}
                      />
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
                          message: (
                            <IntlMessages id="app.supplierregistration.field.business_emailId.error.email" />
                          ),
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder={intl.formatMessage({
                          id: 'app.supplierregistration.field.bcontact_email',
                        })}
                      />
                    </FormItem>
                  </Col>
                  <Col sm={12} xs={24}>
                    <FormItem
                      label={<IntlMessages id="app.supplierregistration.field.bcontact_charge" />}
                      name="bcontact_charge"
                    >
                      <Input
                        size="large"
                        placeholder={intl.formatMessage({
                          id: 'app.supplierregistration.field.bcontact_charge',
                        })}
                      />
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
                        <Checkbox
                          onChange={() => setSupplierInfoShareable(!isSupplierInfoShareable)}
                        >
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
                      overflowX: 'auto',
                    }}
                  >
                    <FilesManager
                      files={files}
                      context={{
                        assetRelation: 'supplier_logo',
                      }}
                      maxCount={1}
                      customSubmitHandler={({ fileList }) => {
                        setFiles(fileList);
                      }}
                      accept={['image/*']}
                      allowDelete={true}
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
                        <Link
                          href={`https://${process.env.NEXT_PUBLIC_WEB_HOST + '/terms-of-use'}`}
                        >
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
            )}
          </div>
        </div>
        {!isAuthenticated ? <Footer /> : <></>}
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
        title={
          isAuthenticated ? null : (
            <IntlMessages id="app.supplierregistration.successmessage.title" />
          )
        }
        onConfirm={onAlertConfirmed}
      >
        <div>
          {isAuthenticated ? (
            <>{`El proveedor ${newSupplierName} fue registrado con éxito`}</>
          ) : (
            <IntlMessages id="app.supplierregistration.successmessage.content" />
          )}
        </div>
      </SweetAlert>
    </div>
  );
};

SupplierRegistration.defaultProps = {
  showLoginLink: true,
  isShared: false,
  isBannerShown: true,
};
export default SupplierRegistration;
