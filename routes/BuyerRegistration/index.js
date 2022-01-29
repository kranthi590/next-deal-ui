import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, Select, Col, Row, Tooltip, Modal } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import SweetAlert from 'react-bootstrap-sweetalert';

// Utils
import IntlMessages from '../../util/IntlMessages';
import { useAuth } from '../../contexts/use-auth';
import { useRegistration } from '../../contexts/business-registration';
import {
  errorNotification,
  NOTIFICATION_TIMEOUT,
  successNotification,
  getPhonePrefix,
  sanitizeString,
} from '../../util/util';
import urlRegx from 'url-regex';

// Components
import CircularProgress from '../../app/components/CircularProgress';
import WidgetHeader from '../../app/components/WidgetHeader';
import Aside from '../../app/components/Aside';
import Footer from '../../app/components/Footer';

// Styles
import '../../styles/form-page.css';
import Rut from '../../shared/Rut';
import { clean, validate } from 'rut.js';

const FormItem = Form.Item;
const { Option } = Select;

const BuyerRegistration = props => {
  const router = useRouter();
  const { isLoading } = useAuth();
  const { fetchRegions, fetchCommune, registerBuyer, error } = useRegistration();

  const [form] = Form.useForm();

  const [regions, setRegions] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [iAccept, setIAccept] = useState(false);
  const [domainName, setDomainName] = useState('');
  const [rut, setRut] = useState(null);
  const [newSubDomain, setNewSubDomain] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchRegions(({ regions }) => {
      setRegions(regions);
    });
  }, []);

  const regionChangeHandler = value => {
    form.setFieldsValue({
      communeId: '',
    });
    setCommunes([]);
    fetchCommune({ regionId: value }, data => {
      const communes = data && data.length > 0 ? data[0] : [];
      setCommunes(communes);
    });
  };

  const getFormData = data => {
    const {
      addressLine1,
      addressLine2,
      communeId,
      regionId,
      emailId,
      phoneNumber1,
      phoneNumber2,
      phone1_prefix,
      phone2_prefix,
      webSiteUrl,
      ...rest
    } = data;

    let formData = {
      businessAddress: {
        addressLine1,
        addressLine2,
        communeId,
        regionId,
        emailId,
        phoneNumber1: `${getPhonePrefix(phone1_prefix)}${phoneNumber1}`,
        countryId: 1,
      },
      ...rest,
      emailId,
      additionalData: 'none',
      iAccept,
      rut: rut ? clean(rut) : rut,
    };

    if (!isEmpty(webSiteUrl)) {
      formData.webSiteUrl = webSiteUrl;
    }
    if (!isEmpty(phoneNumber2)) {
      formData.phoneNumber2 = `${getPhonePrefix(phone2_prefix)}${phoneNumber2}`;
    }

    return formData;
  };

  const addProdocol = url => {
    if (url.indexOf('http://') == 0 || url.indexOf('https://') == 0) {
      return url;
    } else {
      return 'https://' + url;
    }
  };
  const onFinishFailed = errorInfo => {};
  const onAlertConfirmed = () => {
    window.location.href = `https://${newSubDomain}${process.env.NEXT_PUBLIC_APP_HOST}/app/signup`;
  };

  const onFinish = values => {
    registerBuyer(getFormData(values), data => {
      if (data) {
        setNewSubDomain(data.subDomainName);
        setShowAlert(true);
      }
    });
  };

  const prefixSelector = name => (
    <Form.Item name={name} noStyle>
      <Select style={{ width: 70 }} defaultValue={process.env.NEXT_PUBLIC_DEFAULT_LOCALE_PREFIX}>
        <Option value="56">+56</Option>
      </Select>
    </Form.Item>
  );

  const onChange = async value => {
    setRut(value);
  };

  return (
    <div className="gx-app-login-wrap registration-container">
      <Aside heading="app.userAuth.welcome" content="app.userAuth.getAccount" />
      <div className="right-aside">
        <div className="form-container">
          <div className="gx-app-login-content registration-form">
            <div className="heading-wrapper">
              <h1>
                <IntlMessages id="app.buyerregistration.page_title" />
              </h1>
              <p>
                <Link href="/signin">
                  <a>
                    <IntlMessages id="app.userAuth.login" />
                  </a>
                </Link>
              </p>
            </div>
            <Form
              layout="inline"
              form={form}
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="gx-signin-form gx-form-row0"
              fields={[
                {
                  name: ['subDomainName'],
                  value: domainName,
                },
              ]}
            >
              <Row gutter={24} className="bottom-divider">
                <Col xs={24}>
                  <WidgetHeader title={<IntlMessages id="app.buyerregistration.form_title" />} />
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="fantasyName"
                    label={<IntlMessages id="app.buyerregistration.field.fantasyName" />}
                    rules={[
                      {
                        required: true,
                        message: (
                          <IntlMessages id="app.buyerregistration.field.fantasyName.error.required" />
                        ),
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Fantasy Name"
                      onChange={e => setDomainName(sanitizeString(e.target.value))}
                    />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="subDomainName"
                    id="subDomainName"
                    label={
                      <span>
                        <IntlMessages id="app.buyerregistration.field.fantasyName" />
                        &nbsp;
                        <Tooltip
                          title={
                            <IntlMessages id="app.buyerregistration.field.subDomainName.tooltip" />
                          }
                        >
                          <QuestionCircleOutlined />
                        </Tooltip>
                        &nbsp;
                        {!!domainName && `${domainName}${process.env.NEXT_PUBLIC_APP_HOST}`}
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        validator: (_, value) => {
                          if (!value) {
                            return Promise.reject(
                              <IntlMessages id="app.buyerregistration.field.subDomainName.error.required" />,
                            );
                          } else if (!/^[a-z0-9]+$/i.test(value)) {
                            return Promise.reject(
                              <IntlMessages id="app.buyerregistration.field.subDomainName.error.srtingtype" />,
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Domain Name"
                      addonBefore="https://"
                      addonAfter={process.env.NEXT_PUBLIC_APP_HOST}
                      onChange={e => setDomainName(e.target.value)}
                    />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="legalName"
                    label={<IntlMessages id="app.buyerregistration.field.legalName" />}
                    rules={[
                      {
                        required: true,
                        message: (
                          <IntlMessages id="app.buyerregistration.field.legalName.error.required" />
                        ),
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Business Name" />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="rut"
                    label={<IntlMessages id="app.buyerregistration.field.rut" />}
                    rules={[
                      {
                        required: true,
                        validator: (_, value) => {
                          if (!validate(value)) {
                            return Promise.reject(
                              <IntlMessages id="app.buyerregistration.field.rut.error.valid" />,
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
                    name="addressLine1"
                    label={<IntlMessages id="app.buyerregistration.field.addressLine1" />}
                    rules={[
                      {
                        required: true,
                        message: (
                          <IntlMessages id="app.buyerregistration.field.addressLine1.error.required" />
                        ),
                      },
                    ]}
                  >
                    <Input size="large" placeholder="san pascual" />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="addressLine2"
                    label={<IntlMessages id="app.buyerregistration.field.addressLine2" />}
                    rules={[
                      {
                        required: true,
                        message: (
                          <IntlMessages id="app.buyerregistration.field.addressLine2.error.required" />
                        ),
                      },
                    ]}
                  >
                    <Input size="large" placeholder="las condes" />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    label={<IntlMessages id="app.buyerregistration.field.regionId" />}
                    name="regionId"
                    rules={[
                      {
                        required: true,
                        message: (
                          <IntlMessages id="app.buyerregistration.field.regionId.error.required" />
                        ),
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      placeholder="Please select Region"
                      onChange={regionChangeHandler}
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
                    label={<IntlMessages id="app.buyerregistration.field.communeId" />}
                    name="communeId"
                    rules={[
                      {
                        required: true,
                        message: (
                          <IntlMessages id="app.buyerregistration.field.communeId.error.required" />
                        ),
                      },
                    ]}
                  >
                    <Select size="large" placeholder="Please select Commune">
                      {communes &&
                        communes.map(commune => (
                          <Option key={commune.id + commune.name} value={commune.id}>
                            {commune.name}
                          </Option>
                        ))}
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="webSiteUrl"
                    label={<IntlMessages id="app.buyerregistration.field.webSiteUrl" />}
                    rules={[
                      {
                        required: false,
                      },
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
                              <IntlMessages id="app.buyerregistration.field.webSiteUrl.error.valid" />,
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
                    label={<IntlMessages id="app.buyerregistration.field.emailId" />}
                    name="emailId"
                    rules={[
                      {
                        required: true,
                        type: 'email',
                        message: (
                          <IntlMessages id="app.buyerregistration.field.emailId.error.email" />
                        ),
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Email" />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <Form.Item
                    label={<IntlMessages id="app.buyerregistration.field.phoneNumber1" />}
                    name="phoneNumber1"
                    rules={[
                      {
                        required: true,
                        message: (
                          <IntlMessages id="app.buyerregistration.field.phoneNumber1.error.required" />
                        ),
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Phone number"
                      addonBefore={prefixSelector('phone1_prefix')}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    label={<IntlMessages id="app.buyerregistration.field.phoneNumber2" />}
                    name="phoneNumber2"
                  >
                    <Input
                      size="large"
                      placeholder="Phone number"
                      addonBefore={prefixSelector('phone2_prefix')}
                      style={{ width: '100%' }}
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
                          <IntlMessages id="app.buyerregistration.field.iAccept.error.required" />
                        ),
                      },
                    ]}
                  >
                    <Checkbox onChange={() => setIAccept(!iAccept)}>
                      <IntlMessages id="appModule.iAccept" />
                    </Checkbox>
                    <span className="gx-signup-form-forgot gx-link">
                      <IntlMessages id="appModule.termAndCondition" />
                    </span>
                  </Form.Item>
                </Col>
                <Col>
                  <FormItem>
                    <div>
                      <Button type="primary" className="gx-mb-0" htmlType="submit">
                        <IntlMessages id="app.userAuth.signUp" />
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
        title={<IntlMessages id="app.buyerregistration.successmessage.title" />}
        onConfirm={onAlertConfirmed}
      >
        <div>
          <IntlMessages id="app.buyerregistration.successmessage.content" />
        </div>
      </SweetAlert>
    </div>
  );
};

export default BuyerRegistration;
