import React, {useEffect, useState} from "react";
import {Button, Checkbox, Form, Input, Select, Col, Row, Upload} from "antd";
import Link from "next/link";
import {useRouter} from "next/router";

// Utils
import IntlMessages from "../../util/IntlMessages";
import {useAuth} from "../../contexts/use-auth";
import {useRegistration} from "../../contexts/business-registration";
import {
  errorNotification,
  NOTIFICATION_TIMEOUT,
  successNotification,
  extractData,
  isValidObject,
  getPhonePrefix,
} from "../../util/util";
import {validate, clean} from 'rut.js'


// Components
import CircularProgress from "../../app/components/CircularProgress";
import WidgetHeader from "../../app/components/WidgetHeader";
import Aside from "../../app/components/Aside";
import Footer from "../../app/components/Footer";
import Rut from "../../shared/Rut";

// Styles
import "../../styles/form-page.css";
import {UploadOutlined} from "@ant-design/icons";

const FormItem = Form.Item;
const {TextArea} = Input;
const {Option} = Select;

const SupplierRegistration = (props) => {
  const router = useRouter();
  const {isLoading} = useAuth();

  const {
    fetchRegions,
    fetchCommune,
    registerSupplier,
    error,
    uploadSupplierLogo
  } = useRegistration();

  const [form] = Form.useForm();

  const [sameAsBusiness, setSameAsBusiness] = useState(false);
  const [regions, setRegions] = useState([]);
  const [communes1, setCommunes1] = useState([]);
  const [communes2, setCommunes2] = useState([]);
  const [iAccept, setIAccept] = useState(false);
  const [rut, setRut] = useState(null);
  const [isLogoUploaded, setLogoUploaded] = useState(false);

  useEffect(() => {
    fetchRegions(({regions}) => {
      setRegions(regions);
    });
  }, []);

  const businessRegionChangeHandler = (value) => {
    form.setFieldsValue({
      business_communeId: "",
    });
    setCommunes1([]);
    fetchCommune({regionId: value}, (data) => {
      const communes = data && data.length > 0 ? data[0] : [];
      setCommunes1(communes);
    });
  };

  const billingRegionChangeHandler = (value) => {
    form.setFieldsValue({
      billing_communeId: "",
    });
    setCommunes2([]);
    fetchCommune({regionId: value}, (data) => {
      const communes = data && data.length > 0 ? data[0] : [];
      setCommunes2(communes);
    });
  };

  const businessAddressHandler = () => {
    setSameAsBusiness(!sameAsBusiness);
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

  const getFormData = (data) => {
    console.log('props', props);
    const business = extractData("business_", data);
    const billing = extractData("billing_", data);
    const contact = extractData("bcontact_", data);

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
      webSiteUrl: business.webSiteUrl,
      emailId: business.emailId,
      categories: business.categories,
      serviceLocations: data.serviceLocations,
      type: business.type,

      isShared: props.isShared,
      inchargeRole: "Owner",
      logoUrl:
        "https://previews.123rf.com/images/trustle/trustle1509/trustle150900041/45658560-abstract-web-icon-and-logo-sample-vector-illusration.jpg",
    };

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

  const onFinishFailed = (errorInfo) => {
  };

  const onFinish = async (values) => {

    registerSupplier(getFormData(values), (data) => {
      try {
        if (data && isLogoUploaded) {
          const formData = new FormData();
          formData.append("logo", values['business_logo'].file.originFileObj);
          formData.append("supplierId", data.id);
          uploadSupplierLogo(formData, (data) => {
          })
          return;
        }
        setTimeout(() => {
          router.push("/signup");
        }, NOTIFICATION_TIMEOUT);
      } catch (e) {
        //handle errors
      }
    });
  };
  const onChange = async (value) => {
    setRut(value);
  }

  const dummyRequest = ({file, onSuccess}) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const handleFileUpload = () => {
    setLogoUploaded(true)
  }

  console.log('props', props);
  return (
    <div className="gx-app-login-wrap registration-container">
      <Aside heading="app.userAuth.welcome" content="app.userAuth.getAccount"/>
      <div className="right-aside">
        <div className="form-container">
          <div className="gx-app-login-content registration-form">
            <div className="heading-wrapper">
              <h1>Supplier Registration</h1>
              {
                props && props.showLoginLink && (
                  <p>
                    <Link href="/signin">
                      <a>
                        <IntlMessages id="app.userAuth.login"/>
                      </a>
                    </Link>
                  </p>
                )
              }
            </div>
            <Form
              layout="inline"
              form={form}
              initialValues={{remember: true}}
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="gx-signin-form gx-form-row0"
            >
              <Row gutter={24} className="bottom-divider">
                <Col xs={24}>
                  <WidgetHeader title="Business Information"/>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="business_fantasyName"
                    label="Fantasy Name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Fantasy Name!",
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Fantasy Name"/>
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="business_legalName"
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
                    name="business_rut"
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
                    name="business_addressLine1"
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
                    name="business_addressLine2"
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
                    name="business_regionId"
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
                      onChange={businessRegionChangeHandler}
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
                    label="Service Locations"
                    name="serviceLocations"
                    rules={[
                      {
                        required: true,
                        message: "Please select your service locations!",
                        type: "array",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      placeholder="Select your service locations"
                      mode="multiple"
                    >
                      <Option value=""></Option>
                      {/* TODO: Change this to locations */}
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
                    name="business_communeId"
                    rules={[
                      {
                        required: true,
                        message: "Please input your commune!",
                      },
                    ]}
                  >
                    <Select size="large" placeholder="Please select Commune">
                      <Option value=""></Option>
                      {communes1 &&
                      communes1.map((commune) => (
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
                    name="business_webSiteUrl"
                    label="Web URL"
                    rules={[
                      {required: false},
                      {type: "url", warningOnly: true},
                    ]}
                  >
                    <Input
                      addonBefore="https://"
                      size="large" placeholder="https://nextdeal.cl"/>
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    name="business_type"
                    label="Type"
                    rules={[
                      {
                        required: true,
                        message: "Please select type!",
                      },
                    ]}
                  >
                    <Select size="large" placeholder="Please select type">
                      <Option value="supplier">Emprendedor</Option>
                      <Option value="buyer">Pyme</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    label="Telephone1"
                    name="business_phoneNumber1"
                    rules={[
                      {
                        required: true,
                        validator: (_, value) => {
                          if (!value) {
                            return Promise.reject(
                              "Please input your telephone!"
                            );
                          } else if (isNaN(value)) {
                            return Promise.reject(
                              "Please input valid telephone!"
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      addonBefore={prefixSelector("business_telephone1")}
                      placeholder="Telephone1"
                    />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem label="Telephone2" name="business_phoneNumber2">
                    <Input
                      placeholder="Telephone2"
                      addonBefore={prefixSelector("business_telephone2")}
                    />
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    label="Business Email"
                    name="business_emailId"
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
                  <FormItem
                    label="Logo"
                    name="business_logo"
                  >
                    <Upload
                      accept="image/png, image/jpeg"
                      maxCount={1}
                      onChange={handleFileUpload}
                      customRequest={dummyRequest}
                    >
                      <Button>
                        <UploadOutlined/> upload
                      </Button>
                    </Upload>
                  </FormItem>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    label="Category"
                    name="business_categories"
                    rules={[
                      {
                        required: true,
                        message: "Please select your categories!",
                        type: "array",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      mode="multiple"
                      placeholder="Please select your categories"
                    >
                      <Option value=""></Option>
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
                      <Option value="17">
                        Productos y regalos corporativos
                      </Option>
                      <Option value="29">Salud y belleza</Option>
                      <Option value="20">
                        Servicios de importación y exportación
                      </Option>
                      <Option value="8">Software y programación</Option>
                      <Option value="25">Textil y calzado</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <FormItem label="Comments" name="business_supplier_info">
                    <TextArea placeholder="services offer" autosize/>
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <Form.Item>
                    <Checkbox
                      onChange={businessAddressHandler}
                      checked={sameAsBusiness}
                    >
                      Billing address same as Business address
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>

              {!sameAsBusiness && (
                <Row gutter={24} className="bottom-divider">
                  <Col xs={24}>
                    <WidgetHeader title="Billing Information"/>
                  </Col>
                  <Col sm={12} xs={24}>
                    <FormItem label="Address 1" name="billing_addressLine1">
                      <Input
                        size="large"
                        placeholder="san pascual"
                      />
                    </FormItem>
                  </Col>
                  <Col sm={12} xs={24}>
                    <FormItem label="Address 2" name="billing_addressLine2">
                      <Input
                        size="large"
                        placeholder="las condes"
                      />
                    </FormItem>
                  </Col>
                  <Col sm={12} xs={24}>
                    <FormItem label="Region" name="billing_regionId">
                      <Select
                        size="large"
                        placeholder="Please select Region"
                        onChange={billingRegionChangeHandler}
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
                    <FormItem label="Commune" name="billing_communeId">
                      <Select size="large" placeholder="Please select Commune">
                        <Option value=""></Option>
                        {communes2 &&
                        communes2.map((commune) => (
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
                    <FormItem label="Telephone1" name="billing_phoneNumber1">
                      <Input
                        size="large"
                        placeholder="Telephone1"
                        addonBefore={prefixSelector("billing_telephone1")}
                      />
                    </FormItem>
                  </Col>
                  <Col sm={12} xs={24}>
                    <FormItem label="Telephone2" name="billing_phoneNumber2">
                      <Input
                        size="large"
                        placeholder="Telephone2"
                        addonBefore={prefixSelector("billing_telephone2")}
                      />
                    </FormItem>
                  </Col>
                </Row>
              )}

              <Row gutter={24} style={{marginBottom: 20}}>
                <Col xs={24}>
                  <WidgetHeader title="Business Contact in Charge"/>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem label="Name" name="bcontact_name">
                    <Input size="large" placeholder="Name"/>
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem label="Surname" name="bcontact_surname">
                    <Input size="large" placeholder="Surname"/>
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem
                    label="Email"
                    name="bcontact_email"
                    rules={[
                      {
                        required: false,
                        type: "email",
                        warningOnly: true,
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Email"/>
                  </FormItem>
                </Col>
                <Col sm={12} xs={24}>
                  <FormItem label="Charge" name="bcontact_charge">
                    <Input size="large" placeholder="Charge"/>
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
      {error && errorNotification(error, "app.registration.errorMessageTitle")}
    </div>
  );
};

SupplierRegistration.defaultProps = {
  showLoginLink: true,
  isShared: true
}
export default SupplierRegistration;
