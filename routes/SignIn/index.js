import React from 'react';
import { Button, Divider, Form, Input } from 'antd';
import Link from 'next/link';
import { LoginOutlined } from '@ant-design/icons';

// Utils
import IntlMessages from '../../util/IntlMessages';
import { useAuth } from '../../contexts/use-auth';

// Components
import CircularProgress from '../../app/components/CircularProgress';
import Aside from '../../app/components/Aside';
import Footer from '../../app/components/Footer';

// Styles
import '../../styles/form-page.css';
import { errorNotification } from '../../util/util';

const SignIn = props => {
  const { isLoading, userLogin } = useAuth();

  const onFinishFailed = errorInfo => {};

  const onFinish = values => {
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
                <h1>
                  <IntlMessages id="app.userAuth.login.page_title" />
                </h1>
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
                  name="emailId"
                  label={<IntlMessages id="app.userAuth.login.field.emailId" />}
                  rules={[
                    {
                      required: true,
                      type: 'email',
                      message: (
                        <IntlMessages id="app.userAuth.login.field.emailId.error.required" />
                      ),
                    },
                  ]}
                >
                  <Input className="gx-input-lineheight" placeholder="Email" /> 
                </Form.Item>
                <Form.Item
                  label={<IntlMessages id="app.userAuth.login.field.password" />}
                  rules={[
                    {
                      required: true,
                      message: (
                        <IntlMessages id="app.userAuth.login.field.password.error.required" />
                      ),
                    },
                  ]}
                  name="password"
                >
                  <Input.Password className="gx-input-lineheight" placeholder="Contraseña" />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    className="gx-mb-0"
                    htmlType="submit"
                    size="large"
                    icon={<LoginOutlined style={{ fontSize: '18px', marginRight: '5px' }} />}
                  >
                    <IntlMessages id="app.userAuth.login" />
                  </Button>
                  <Divider>
                    <IntlMessages id="app.userAuth.or" />
                  </Divider>
                  <div style={{ textAlign: 'center' }}>
                    <Link href="/buyer-registration">
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
