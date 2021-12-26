import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Select, Col, Row, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { isEmpty } from "lodash";
import SweetAlert from "react-bootstrap-sweetalert";

// Utils
import IntlMessages from "../../util/IntlMessages";
import { useAuth } from "../../contexts/use-auth";
import { useRegistration } from "../../contexts/business-registration";
import {
  errorNotification,
  NOTIFICATION_TIMEOUT,
  successNotification,
  getPhonePrefix, sanitizeString,
} from "../../util/util";
import urlRegx from 'url-regex'

// Components
import CircularProgress from "../../app/components/CircularProgress";
import WidgetHeader from "../../app/components/WidgetHeader";
import Aside from "../../app/components/Aside";
import Footer from "../../app/components/Footer";

// Styles
import "../../styles/form-page.css";
import Rut from "../../shared/Rut";
import {clean, validate} from "rut.js";

const FormItem = Form.Item;
const {Option} = Select;

const BuyerRegistration = (props) => {
  const router = useRouter();
  const {isLoading} = useAuth();
  const {fetchRegions, fetchCommune, registerBuyer, error} =
    useRegistration();

  const [form] = Form.useForm();

  const [regions, setRegions] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [iAccept, setIAccept] = useState(false);
  const [domainName, setDomainName] = useState('');
  const [rut, setRut] = useState(null)
  const [newSubDomain,setNewSubDomain] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchRegions(({regions}) => {
      setRegions(regions);
    });
  }, []);

  const regionChangeHandler = (value) => {
    form.setFieldsValue({
      communeId: "",
    });
    setCommunes([]);
    fetchCommune({regionId: value}, (data) => {
      const communes = data && data.length > 0 ? data[0] : [];
      setCommunes(communes);
    });
  };

  const getFormData = (data) => {
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
      additionalData: "none",
      iAccept,
      rut: rut ? clean(rut): rut,
    };

    if (!isEmpty(webSiteUrl)) {
      formData.webSiteUrl = webSiteUrl;
    }
    if (!isEmpty(phoneNumber2)) {
      formData.phoneNumber2 = `${getPhonePrefix(phone2_prefix)}${phoneNumber2}`;
    }

    return formData;
  };

  const addProdocol = (url) => {
    if (url.indexOf("http://") == 0 || url.indexOf("https://") == 0) {
      return url
    } else {
      return ("https://" + url)
    }
  }
  const onFinishFailed = (errorInfo) => {
  };
  const onAlertConfirmed = () => {
    window.location.href = `https://${newSubDomain}${process.env.NEXT_PUBLIC_APP_HOST}/app/signup`;
  }

  const onFinish = (values) => {
    registerBuyer(getFormData(values), (data) => {
      successNotification("app.registration.detailsSaveSuccessMessage");
      debugger
        if (data) {
        setNewSubDomain(data.subDomainName);
        setShowAlert(true);
        }
    });
  };

  const prefixSelector = (name) => (
    <Form.Item name={name} noStyle>
      <Select
        style={{width: 70}}
        defaultValue={process.env.NEXT_PUBLIC_DEFAULT_LOCALE_PREFIX}
      >
        <Option value="56">+56</Option>
      </Select>
    </Form.Item>
  );

  const onChange = async (value) => {
    setRut(value);
  }

  return (
    <div className="gx-app-login-wrap registration-container">
      <Aside heading="app.userAuth.welcome" content="app.userAuth.getAccount"/>
      <div className="right-aside">
        <div className="form-container">
          <div className="gx-app-login-content registration-form">
            <div className="heading-wrapper">
              <h1>Business Registration</h1>
              <p>
                <Link href="/signin">
                  <a>
                    <IntlMessages id="app.userAuth.login"/>
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
                  name: ["subDomainName"],
                  value: domainName,
                },
              ]}
            >
              <Row gutter={24} className="bottom-divider">
                <Col xs={24}>
                  <WidgetHeader title="Business Information"/>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="fantasyName"
                    label="Fantasy Name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your fantasy name !",
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Fantasy Name"
                      onChange={(e) => setDomainName(sanitizeString(e.target.value))}
                    />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="subDomainName"
                    id="subDomainName"
                    label={
                      <span>
                        Domain Name&nbsp;
                        <Tooltip title="Domain name should be alpha numeric">
                          <QuestionCircleOutlined/>
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
                              "Please input your domain name!"
                            );
                          } else if (!/^[a-z0-9]+$/i.test(value)) {
                            return Promise.reject(
                              "Domain name should be alpha numeric"
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
                      onChange={(e) => setDomainName(e.target.value)}
                    />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="legalName"
                    label="Business Name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your business name !",
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Business Name"/>
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="rut"
                    label="RUT"
                    rules={[
                      {
                        required: true,
                        validator: (_, value) => {
                          if (!validate(value)) {
                            return Promise.reject(
                              "Please input your valid rut!"
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
                      placeholder="RUT"/>
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="addressLine1"
                    label="Address 1"
                    rules={[
                      {
                        required: true,
                        message: "Please input your business address!",
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="san pascual"
                    />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="addressLine2"
                    label="Address 2"
                    rules={[
                      {
                        required: true,
                        message: "Please input your business address!",
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="las condes"
                    />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    label="Region"
                    name="regionId"
                    rules={[
                      {
                        required: true,
                        message: "Please input your region!",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      placeholder="Please select Region"
                      onChange={regionChangeHandler}
                    >
                      {regions &&
                      regions.map((region) => (
                        <Option
                          key={region.id + region.name}
                          value={region.id}
                        >
                          {region.name}
                        </Option>
                      ))}
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    label="Commune"
                    name="communeId"
                    rules={[
                      {
                        required: true,
                        message: "Please input your commune!",
                      },
                    ]}
                  >
                    <Select size="large" placeholder="Please select Commune">
                      {communes &&
                      communes.map((commune) => (
                        <Option
                          key={commune.id + commune.name}
                          value={commune.id}
                        >
                          {commune.name}
                        </Option>
                      ))}
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="webSiteUrl"
                    label="Web URL"
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
                            return Promise.reject(new Error('Please input valid URL!'));
                          }
                        }
                      }
                    ]}
                  >
                    <Input
                      addonBefore="https://"
                      size="large" placeholder="nextdeal.cl"/>
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    label="Business Email"
                    name="emailId"
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message: "The input is not valid E-mail!",
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Email"/>
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <Form.Item
                    label="Phone"
                    name="phoneNumber1"
                    rules={[
                      {
                        required: true,
                        message: "Please input your phone number!",
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Phone number"
                      addonBefore={prefixSelector("phone1_prefix")}
                      style={{width: "100%"}}
                    />
                  </Form.Item>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem label="Phone 2" name="phoneNumber2">
                    <Input
                      size="large"
                      placeholder="Phone number"
                      addonBefore={prefixSelector("phone2_prefix")}
                      style={{width: "100%"}}
                    />
                  </FormItem>
                </Col>
              </Row>
              <Row style={{width: "100%", justifyContent: "right"}}>
                <Col>
                  <Form.Item
                    name="iAccept"
                    rules={[
                      {required: !iAccept && true, message: "Please accept!"},
                    ]}
                  >
                    <Checkbox onChange={() => setIAccept(!iAccept)}>
                      <IntlMessages id="appModule.iAccept"/>
                    </Checkbox>
                    <span className="gx-signup-form-forgot gx-link">
                  <IntlMessages id="appModule.termAndCondition"/>
                </span>
                  </Form.Item>
                </Col>
                <Col>
                  <FormItem>
                    <div>
                      <Button
                        type="primary"
                        className="gx-mb-0"
                        htmlType="submit"
                      >
                        <IntlMessages id="app.userAuth.signUp"/>
                      </Button>
                    </div>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <Footer/>
      </div>
      {isLoading && (
        <div className="gx-loader-view">
          <CircularProgress/>
        </div>
      )}
      <SweetAlert
        confirmBtnText="OK"
        show={showAlert}
        success
        title={"Welcome To Next Deal!!"}
        onConfirm={onAlertConfirmed}
      >
        <div>
          Thank you for signing up. This welcome email lines up with the company’s brand image and inspires you to the next trip.
        </div>
      </SweetAlert>
    </div>
  );
};

export default BuyerRegistration;
