import React, { useState } from "react";
import { Button, Checkbox, Form, Input, Select, Divider } from "antd";
import Link from "next/link";

// Utils
import IntlMessages from "../../../util/IntlMessages";
import { useAuth } from "../../../util/use-auth";

// Components
import CircularProgress from "../../../app/components/CircularProgress";
import Aside from "../../../app/components/Aside";
import Footer from "../../../app/components/Footer";

// Styles
import "../../../styles/form-page.css";

const FormItem = Form.Item;
const { Option } = Select;

const SignUp = (props) => {
  const { isLoading, userSignup, getAuthUser } = useAuth();

  const [iAccept, setIAccept] = useState(false);

  const getFormData = (data) => {
    return {
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      emailId: data.email,
      additionalData: "none",
      type: "buyer",
      buyerId: 1,
      iAccept,
      contactInfo: {
        addressLine1: "Dept: 34",
        addressLine2: "Del Inca 4421",
        communeId: 1,
        regionId: 1,
        countryId: 1,
        phoneNumber1: "+56 935234098",
        emailId: data.email,
      },
    };
  };

  const onFinishFailed = (errorInfo) => {};

  const onFinish = (values) => {
    console.log(getFormData(values));
    userSignup(getFormData(values), () => {
      getAuthUser();
    });
  };

  return (
    <div className="gx-app-login-wrap registration-container">
      <Aside heading="app.userAuth.welcome" content="app.userAuth.getAccount" />
      <div className="right-aside sign-in">
        <div className="form-container">
          <div className="gx-app-login-content registration-form">
            <div className="form-wrapper-login">
              <div className="heading-wrapper">
                <h1>Sign Up to Next Deal</h1>
                <p>
                  <Link href="/signin">
                    <a>
                      <IntlMessages id="app.userAuth.login" />
                    </a>
                  </Link>
                </p>
              </div>
              <Form
                initialValues={{ remember: true }}
                layout="vertical"
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                className="gx-signin-form gx-form-row0"
              >
                <FormItem
                  label="First Name"
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                  name="firstName"
                >
                  <Input
                    className="gx-input-lineheight"
                    placeholder="First Name"
                  />
                </FormItem>
                <FormItem
                  label="Last Name"
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                  name="lastName"
                >
                  <Input
                    className="gx-input-lineheight"
                    placeholder="Last Name"
                  />
                </FormItem>

                <FormItem
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "The input is not valid E-mail!",
                    },
                  ]}
                  help="This email will be your login id"
                >
                  <Input className="gx-input-lineheight" placeholder="Email" />
                </FormItem>
                <Form.Item
                  label="Password"
                  name="password"
                  allowClear
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    className="gx-input-lineheight"
                    placeholder="password"
                  />
                </Form.Item>

                <Form.Item
                  label="Confirm"
                  name="confirm"
                  dependencies={["password"]}
                  hasFeedback
                  allowClear
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "The two passwords that you entered do not match!"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    className="gx-input-lineheight"
                    placeholder="re enter password"
                  />
                </Form.Item>

                <Form.Item
                  name="iAccept"
                  rules={[
                    {
                      required: !iAccept,
                      message: "Please accept!",
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
                <FormItem>
                  <Button type="primary" className="gx-mb-0" htmlType="submit">
                    <IntlMessages id="app.userAuth.signUp" />
                  </Button>
                  <Divider>
                    <IntlMessages id="app.userAuth.or" />
                  </Divider>
                  <div style={{ textAlign: "center" }}>
                    <Link href="/signin">
                      <a>
                        <IntlMessages id="app.userAuth.login" />
                      </a>
                    </Link>
                  </div>
                </FormItem>
              </Form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      {isLoading && (
        <div className="gx-loader-view">
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default SignUp;
