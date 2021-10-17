import React from "react";
import { Button, Divider, Form, Input } from "antd";
import Link from "next/link";
import { LoginOutlined } from "@ant-design/icons";

// Utils
import IntlMessages from "../../../util/IntlMessages";
import { useAuth } from "../../../util/use-auth";

// Components
import CircularProgress from "../../../app/components/CircularProgress";
import Aside from "../../../app/components/Aside";
import Footer from "../../../app/components/Footer";

// Styles
import "../../../styles/form-page.css";

const SignIn = (props) => {
  const { isLoading, userLogin } = useAuth();

  const onFinishFailed = (errorInfo) => {};

  const onFinish = (values) => {
    userLogin(values);
  };

  return (
    <div className="gx-app-login-wrap registration-container">
      <Aside heading="app.userAuth.welcome" content="app.userAuth.login" />
      <div className="right-aside sign-in">
        <div className="form-container">
          <div className="gx-app-login-content registration-form">
            <div className="form-wrapper-login">
              <div className="heading-wrapper">
                <h1>Sign in to Next Deal</h1>
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
                <Form.Item
                  name="email"
                  label="Email"
                  initialValue="demo@example.com"
                  rules={[
                    {
                      required: true,
                      message: "The input is not valid E-mail!",
                    },
                  ]}
                >
                  <Input className="gx-input-lineheight" placeholder="Email" />
                </Form.Item>
                <Form.Item
                  label="Password"
                  initialValue="demo#123"
                  rules={[
                    { required: true, message: "Please input your Password!" },
                  ]}
                  name="password"
                >
                  <Input
                    className="gx-input-lineheight"
                    type="password"
                    placeholder="Password"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    className="gx-mb-0"
                    htmlType="submit"
                    size="large"
                    icon={
                      <LoginOutlined
                        style={{ fontSize: "18px", marginRight: "5px" }}
                      />
                    }
                  >
                    <IntlMessages id="app.userAuth.login" />
                  </Button>
                  <Divider>
                    <IntlMessages id="app.userAuth.or" />
                  </Divider>
                  <div style={{ textAlign: "center" }}>
                    <Link href="/signup">
                      <a>
                        <IntlMessages id="app.userAuth.signUp" />
                      </a>
                    </Link>
                  </div>
                </Form.Item>
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

export default SignIn;
