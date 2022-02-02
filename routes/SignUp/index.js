import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Select, Divider } from 'antd';
import Link from 'next/link';

// Utils
import IntlMessages from '../../util/IntlMessages';
import { useAuth } from '../../contexts/use-auth';

// Components
import CircularProgress from '../../app/components/CircularProgress';
import Aside from '../../app/components/Aside';
import Footer from '../../app/components/Footer';

// Styles
import '../../styles/form-page.css';
import {
  errorNotification,
  getSubDomain,
  isClient,
  NOTIFICATION_TIMEOUT,
  successNotification,
} from '../../util/util';
import { useRouter } from 'next/router';

const FormItem = Form.Item;
const { Option } = Select;

const SignUp = props => {
  const router = useRouter();
  const { isLoading, userSignup, getAuthUser, error } = useAuth();

  const [iAccept, setIAccept] = useState(false);

  const getFormData = data => {
    return {
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      emailId: data.email,
      additionalData: 'none',
      type: 'buyer',
      buyerId: 1,
      iAccept,
      contactInfo: {
        addressLine1: 'Dept: 34',
        addressLine2: 'Del Inca 4421',
        communeId: 1,
        regionId: 1,
        countryId: 1,
        phoneNumber1: '+56 935234098',
        emailId: data.email,
      },
    };
  };

  const onFinishFailed = errorInfo => {};

  const onFinish = values => {
    userSignup(getFormData(values), () => {
      successNotification('app.registration.detailsSaveSuccessMessage');
      setTimeout(() => {}, NOTIFICATION_TIMEOUT);
      router.push('/signin');
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
                <h1>
                  <IntlMessages id="app.userAuth.signUp.page_title" />{' '}
                  {getSubDomain(isClient ? window.location.hostname : 'www.nextdeal.dev')}
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
                <FormItem
                  label={<IntlMessages id="app.userAuth.signUp.field.firstName" />}
                  rules={[
                    {
                      required: true,
                      message: (
                        <IntlMessages id="app.userAuth.signUp.field.firstName.error.required" />
                      ),
                    },
                  ]}
                  name="firstName"
                >
                  <Input className="gx-input-lineheight" placeholder="First Name" />
                </FormItem>
                <FormItem
                  label={<IntlMessages id="app.userAuth.signUp.field.lastName" />}
                  rules={[
                    {
                      required: true,
                      message: (
                        <IntlMessages id="app.userAuth.signUp.field.lastName.error.required" />
                      ),
                    },
                  ]}
                  name="lastName"
                >
                  <Input className="gx-input-lineheight" placeholder="Last Name" />
                </FormItem>

                <FormItem
                  label={<IntlMessages id="app.userAuth.signUp.field.email" />}
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: 'email',
                      message: <IntlMessages id="app.userAuth.signUp.field.email.error.required" />,
                    },
                  ]}
                  help={<IntlMessages id="app.userAuth.signUp.field.email.helptext" />}
                >
                  <Input className="gx-input-lineheight" placeholder="Email" />
                </FormItem>
                <Form.Item
                  label={<IntlMessages id="app.userAuth.signUp.field.password" />}
                  name="password"
                  allowClear
                  rules={[
                    {
                      required: true,
                      message: (
                        <IntlMessages id="app.userAuth.signUp.field.password.error.required" />
                      ),
                    },
                    {
                      min: 6,
                      message: (
                        <IntlMessages id="app.userAuth.signUp.field.password.error.length" />
                      ),
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password className="gx-input-lineheight" placeholder="password" />
                </Form.Item>

                <Form.Item
                  label={<IntlMessages id="app.userAuth.signUp.field.confirm" />}
                  name="confirm"
                  dependencies={['password']}
                  hasFeedback
                  allowClear
                  rules={[
                    {
                      required: true,
                      message: (
                        <IntlMessages id="app.userAuth.signUp.field.confirm.error.required" />
                      ),
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          <IntlMessages id="app.userAuth.signUp.field.confirm.error.match" />,
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password className="gx-input-lineheight" placeholder="re enter password" />
                </Form.Item>

                <Form.Item
                  name="iAccept"
                  rules={[
                    {
                      required: !iAccept,
                      message: 'Please accept!',
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
                  <div style={{ textAlign: 'center' }}>
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
