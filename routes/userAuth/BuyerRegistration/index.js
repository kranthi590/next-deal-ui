import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Select, Col, Row, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { isEmpty } from "lodash";

// Utils
import IntlMessages from "../../../util/IntlMessages";
import { useAuth } from "../../../util/use-auth";
import { useRegistration } from "../../../util/business-registration";
import {
  errorNotification,
  NOTIFICATION_TIMEOUT,
  successNotification,
  getPhonePrefix,
} from "../../../util/util";

// Components
import CircularProgress from "../../../app/components/CircularProgress";
import WidgetHeader from "../../../app/components/WidgetHeader";
import Aside from "../../../app/components/Aside";
import Footer from "../../../app/components/Footer";

// Styles
import "../../../styles/form-page.css";

const FormItem = Form.Item;
const { Option } = Select;

const BuyerRegistration = (props) => {
  const router = useRouter();
  const { isLoading } = useAuth();
  const { fetchRegions, fetchCommune, registerBuyer, error } =
    useRegistration();

  const [form] = Form.useForm();

  const [regions, setRegions] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [iAccept, setIAccept] = useState(false);
  const [domainName, setDomainName] = useState(false);

  useEffect(() => {
    fetchRegions(({ regions }) => {
      setRegions(regions);
    });
  }, []);

  const regionChangeHandler = (value) => {
    form.setFieldsValue({
      communeId: "",
    });
    setCommunes([]);
    fetchCommune({ regionId: value }, (data) => {
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
    };

    if (!isEmpty(webSiteUrl)) {
      formData.webSiteUrl = webSiteUrl;
    }
    if (!isEmpty(phoneNumber2)) {
      formData.phoneNumber2 = `${getPhonePrefix(phone2_prefix)}${phoneNumber2}`;
    }

    return formData;
  };

  const onFinishFailed = (errorInfo) => {};

  const onFinish = (values) => {
    console.log(getFormData(values));

     registerBuyer(getFormData(values), (data) => {
       console.log(data);
       successNotification("app.registration.detailsSaveSuccessMessage");
       setTimeout(() => {
         router.push("/signup");
       }, NOTIFICATION_TIMEOUT);
     });
  };

  const prefixSelector = (name) => (
    <Form.Item name={name} noStyle>
      <Select
        style={{ width: 70 }}
        defaultValue={process.env.NEXT_PUBLIC_DEFAULT_LOCALE_PREFIX}
      >
        <Option value="56" >+56</Option>
      </Select>
    </Form.Item>
  );

  return (
    <div className="gx-app-login-wrap registration-container">
      <Aside heading="app.userAuth.welcome" content="app.userAuth.getAccount" />
      <div className="right-aside">
        <div className="form-container">
          <div className="gx-app-login-content registration-form">
            <div className="heading-wrapper">
              <h1>Buyer Registration</h1>
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
              initialValues={{ remember: true }}
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="gx-signin-form gx-form-row0"
            >
              <Row gutter={24} className="bottom-divider">
                <Col xs={24}>
                  <WidgetHeader title="Business Information" />
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
                    <Input size="large" placeholder="Fantasy Name" />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="subDomainName"
                    label={
                      <span>
                        Domain Name&nbsp;
                        <Tooltip title="Domain name should be alpha numeric">
                          <QuestionCircleOutlined />
                        </Tooltip>
                        &nbsp;
                        {!!domainName && `${domainName}.nextdeal.cl`}
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
                      addonAfter=".nextdeal.cl"
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
                    <Input size="large" placeholder="Business Name" />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="rut"
                    label="RUT"
                    rules={[
                      { required: true, message: "Please input your rut!" },
                    ]}
                  >
                    <Input size="large" placeholder="RUT" />
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
                      placeholder="san pascual 101, las condes, chile"
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
                      placeholder="san pascual 101, las condes, chile"
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
                      <Option value=""></Option>
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
                      <Option value=""></Option>
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
                      { required: false },
                      { type: "url", warningOnly: true },
                    ]}
                  >
                    <Input size="large" placeholder="https://example.com" />
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
                    <Input size="large" placeholder="Email" />
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
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem label="Phone 2" name="phoneNumber2">
                    <Input
                      size="large"
                      placeholder="Phone number"
                      addonBefore={prefixSelector("phone2_prefix")}
                      style={{ width: "100%" }}
                    />
                  </FormItem>
                </Col>
              </Row>
              <Form.Item
                name="iAccept"
                rules={[
                  { required: !iAccept && true, message: "Please accept!" },
                ]}
              >
                <Checkbox onChange={() => setIAccept(!iAccept)}>
                  <IntlMessages id="appModule.iAccept" />
                </Checkbox>
                <span className="gx-signup-form-forgot gx-link">
                  <IntlMessages id="appModule.termAndCondition" />
                </span>
              </Form.Item>
              <FormItem>
                <div>
                  <Button type="primary" className="gx-mb-0" htmlType="submit">
                    <IntlMessages id="app.userAuth.signUp" />
                  </Button>
                </div>
              </FormItem>
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
      {error && errorNotification(error, "app.registration.errorMessageTitle")}
    </div>
  );
};

export default BuyerRegistration;
