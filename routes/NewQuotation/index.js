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
  InputNumber,
} from "antd";
import {InboxOutlined} from "@ant-design/icons";
import {useRouter} from "next/router";

// Uitls
import IntlMessages from "../../util/IntlMessages";
import {useProject} from "../../contexts/projects";
import {
  errorNotification,
  NOTIFICATION_TIMEOUT,
  successNotification,
  getDateInMilliseconds,
} from "../../util/util";
import {useRegistration} from "../../contexts/business-registration";

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

const NewProject = () => {
  const router = useRouter();
  const [estimatedBudget, setEstimatedBudget] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [expectedEndDate, setExpectedEndDate] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const {getBuyerSuppliers} = useRegistration();
  const {error} = useProject();

  const [form] = Form.useForm();


  useEffect(() => {
    getBuyerSuppliers((data) => {
      console.log('suppliers', data);
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
              label={<IntlMessages id="app.project.field.projectname"/>}
              rules={[stringRule]}
            >
              <Input placeholder="Project Name" disabled={true}/>
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
              label={<IntlMessages id="app.project.field.estimatedBudget"/>}
            >
              <InputNumber
                className="gx-w-100"
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
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Form.Item label="Dragger">
              <Form.Item
                name="dragger"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
              >
                <Upload.Dragger name="files" action="/upload.do">
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined/>
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload.
                  </p>
                </Upload.Dragger>
              </Form.Item>
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
      {error && errorNotification(error, "app.registration.errorMessageTitle")}
    </Card>
  );
};

export default NewProject;
