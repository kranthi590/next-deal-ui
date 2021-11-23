import React, {useEffect, useState} from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Col,
  Row,
  Upload,
  DatePicker,
  Select,
  InputNumber, Divider,Modal
} from "antd";
import Link from 'next/link';

// Utils
import IntlMessages from "../../../../util/IntlMessages";
import {RegistrationProvider, useRegistration} from '../../../../contexts/business-registration';
import {useProject} from "../../../../contexts/projects";
import {
  errorNotification,
  getDateInMilliseconds,
} from "../../../../util/util";
import NewQuotation from "../../../../routes/NewQuotation";
import SupplierRegistration from "../../../../routes/SupplierRegistration";
import SupplierRegistrationPage from "../../../supplier-registration";

const {TextArea} = Input;
const {Option} = Select;

const formLayout = {
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 20},
    md: {span: 20},
    lg: {span: 20},
  },
  labelCol: {
    xs: {span: 24},
    sm: {span: 7},
    md: {span: 7},
    lg: {span: 7},
  },
};

const stringRule = {
  required: true,
  message: <IntlMessages id="app.project.create.validations"/>,
};

const NewQuote = () => {
  const {getBuyerSuppliers} = useRegistration();
  const {error} = useProject();
  const [estimatedBudget, setEstimatedBudget] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [expectedEndDate, setExpectedEndDate] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    getBuyerSuppliers((data) => {
      setSuppliers(data);
    });
  }, []);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const startDateChangeHandler = (date) => {
    setStartDate(getDateInMilliseconds(date));
  };

  const endDateChangeHandler = (date) => {
    setExpectedEndDate(getDateInMilliseconds(date));
  };

  const getFormData = (data) => {
    const formData = Object.keys(data).reduce((acc, key) => {
      if (data[key] && key === "startDate") {
        acc = {...acc, startDate};
      } else if (data[key] && key === "expectedEndDate") {
        acc = {...acc, expectedEndDate};
      } else if (data[key]) {
        acc = {...acc, [key]: data[key]};
      }
      return acc;
    }, {});

    return formData;
  };

  const onSave = (values) => {
    // newProject(getFormData(values), () => {
    //   successNotification("app.registration.detailsSaveSuccessMessage");
    //   setTimeout(() => {
    //     router.push("/projects");
    //   }, NOTIFICATION_TIMEOUT);
    // });
  };

  return (
    <Card
      className="gx-card"
      title={<IntlMessages id="app.quotation.addquotation"/>}
    >
      <Form
        form={form}
        initialValues={{remember: true}}
        onFinish={onSave}
        {...formLayout}
      >
        <Row>
          <Col xl={12} xs={24}>
            <Form.Item
              name="projectName"
              label={<IntlMessages id="app.project.field.projectname"/>}
              rules={[stringRule]}
            >
              <Input placeholder="Project Name"/>
            </Form.Item>
            <Form.Item
              name="name"
              label={<IntlMessages id="app.quotation.field.quotationname"/>}
              rules={[stringRule]}
            >
              <Input placeholder="Quotation Name"/>
            </Form.Item>
            <Form.Item
              name="startDate"
              label={<IntlMessages id="app.project.field.startdate"/>}
            >
              <DatePicker
                className="gx-w-100"
                placeholder="Start Date"
                onChange={startDateChangeHandler}
              />
            </Form.Item>
            <Form.Item
              name="expectedEndDate"
              label={<IntlMessages id="app.project.field.enddate"/>}
              rules={[
                {
                  required: !!startDate,
                  validator: (_, value) => {
                    if (startDate && !value) {
                      return Promise.reject(
                        <IntlMessages id="app.project.create.validations"/>
                      );
                    } else if (startDate > getDateInMilliseconds(value)) {
                      return Promise.reject("Please select valid end date");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <DatePicker
                className="gx-w-100"
                placeholder="End Date"
                onChange={endDateChangeHandler}
              />
            </Form.Item>
            <Form.Item
              name="costCenter"
              label={<IntlMessages id="app.project.field.costcenter"/>}
              rules={[stringRule]}
            >
              <Input placeholder="Cost Center"/>
            </Form.Item>
            <Form.Item
              name="estimatedBudget"
              label={<IntlMessages id="app.project.field.estimatedBudget" />}
            >
              <InputNumber
                className="gx-w-100"
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                placeholder="Estimated Budget"
                onChange={(value) => setEstimatedBudget(value)}
              />
            </Form.Item>
            <Form.Item
              label={<IntlMessages id="app.quotation.field.supplier"/>}
              name="supplier"
              rules={[
                {
                  ...stringRule,
                  required: !!estimatedBudget,
                },
              ]}
            >
              <Select placeholder="Select Currency">
                <Option value=""></Option>
                <Option value="clp">CLP</Option>
                <Option value="uf">UF</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="description"
              label={<IntlMessages id="app.project.field.description"/>}
              rules={[stringRule]}
            >
              <TextArea placeholder="Description" rows={8}/>
            </Form.Item>

          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Form.Item
              label="Suppliers"
              name="suppliers"
              rules={[
                {
                  required: true,
                  message: "Please select your suppliers!",
                  type: "array",
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Suppliers"
                mode="multiple"
              >
                {suppliers &&
                suppliers.map((supplier) => (
                  <Option
                    key={supplier.id}
                    value={supplier.id}
                  >
                    {supplier.legalName}
                  </Option>
                ))}
              </Select>
              <Divider>OR</Divider>
              <p className="gx-text-center"><Button type="link" onClick={()=> setVisible(true) }>Add a Supplier</Button></p>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{textAlign: "right"}}>
            <Button type="primary" htmlType="submit">
              <IntlMessages id="app.quotation.savequotation"/>
            </Button>
          </Col>
        </Row>
      </Form>
      <Modal
        title="Supplier Registration"
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={'auto'}
        bodyStyle={{'padding': '0'}}
      >
        <SupplierRegistrationPage showLoginLink={false} isShared={false}/>
      </Modal>
      {error && errorNotification(error, "app.registration.errorMessageTitle")}
    </Card>
  );
};


const NewQuotationPage = () => (
  <RegistrationProvider>
    <NewQuote/>
  </RegistrationProvider>
);

export default NewQuotationPage;
