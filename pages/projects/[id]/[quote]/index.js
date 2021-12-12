import React, {useEffect, useState} from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Col,
  Row,
  DatePicker,
  Select,
  InputNumber, Divider, Modal
} from "antd";
import {useRouter} from "next/router";

// Utils
import IntlMessages from "../../../../util/IntlMessages";
import {RegistrationProvider, useRegistration} from '../../../../contexts/business-registration';
import {ProjectProvider, useProject} from "../../../../contexts/projects";
import {
  errorNotification,
  getDateInMilliseconds, successNotification,
} from "../../../../util/util";
import SupplierRegistrationPage from "../../../supplier-registration";
import {QuotationProvider, useQuotation} from "../../../../contexts/quotations";
import FilesManager from "../../../../app/common/FileManager";
import { uploadFiles } from '../../../../util/Api';
import BreadCrumb from "../../../../app/components/BreadCrumb";
import moment from "moment";


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

const NewQuote = (props) => {
  const {getBuyerSuppliers} = useRegistration();
  const {createQuotation} = useQuotation();
  const {error, getProjectById} = useProject();
  const [estimatedBudget, setEstimatedBudget] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [expectedEndDate, setExpectedEndDate] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [projectInfo, setProjectInfo] = useState({})
  const [form] = Form.useForm();
  const router = useRouter();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const projectId = router.query.id;
    getProjectById(projectId, (data) => {
      setProjectInfo(data);
    })
    getBuyerSuppliers((data) => {
      setSuppliers(data);
    });
  }, []);

  const reloadSuppliers =()=>{
    setVisible(false);
    getBuyerSuppliers((data) => {
      setSuppliers(data);
    });
  }

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
    const projectId = projectInfo && projectInfo.id
    createQuotation(projectId, getFormData(values), async (data) => {
      debugger
      if (files.length > 0) {
        await uploadFiles(files, {
          assetRelation: "quotation_request",
          assetRelationId: data.id,
        }, true);
      }
      successNotification("app.registration.detailsSaveSuccessMessage");
      setTimeout(() => {
        router.back();
      }, 1000);
    });
  };

  const disabledStartDate = (value) => {
    const formData = form;
    return moment().add(-1, 'days')  >= value || value > formData.getFieldValue('expectedEndDate');
  }

  const disabledEndDate = (value) =>{
    const formData = form;
    return  value < formData.getFieldValue('startDate') || moment() >= value;
  };

  return (
    <>
      <BreadCrumb navItems={[
        { text: "Projects", route: "/projects" },
        { text: projectInfo.name, route: "/projects/"+projectInfo.id},
        { text: "New Quotation" }]}
      />
    <Card
      className="gx-card"
        title={<IntlMessages id="app.quotation.addquotation" />}>
      <Form
        form={form}
        fields={
          [
            {
              name: ["projectName"],
              value: projectInfo.name,
            },
            {
              name: ["costCenter"],
              value: projectInfo.costCenter
            }
          ]
        }
        onFinish={onSave}
        {...formLayout}
      >
        <Row>
          <Col xl={12} xs={24}>
            <Form.Item
              name="projectName"
              label={'Nombre del Projecto'}
              rules={[stringRule]}
            >
              <Input placeholder="Project Name" disabled/>
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
                disabledDate={disabledStartDate}
              />
            </Form.Item>
            <Form.Item
              name="expectedEndDate"
              label={<IntlMessages id="app.project.field.enddate"/>}
              rules={[
                {
                  required: !!startDate
                },
              ]}
            >
              <DatePicker
                className="gx-w-100"
                placeholder="End Date"
                onChange={endDateChangeHandler}
                disabledDate={disabledEndDate}
              />
            </Form.Item>
            <Form.Item
              name="costCenter"
              label={<IntlMessages id="app.project.field.costcenter"/>}
              rules={[stringRule]}
            >
              <Input placeholder="Cost Center" disabled/>
            </Form.Item>
            <Form.Item
              name="estimatedBudget"
              label={<IntlMessages id="app.project.field.estimatedBudget"/>}
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
              name="currency"
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
                placeholder="Select your suppliers!!"
                mode="multiple"
              >
                <Option value=""></Option>
                {suppliers &&
                suppliers.map((supplier) => (
                  <Option
                    key={supplier.id + supplier.legalName}
                    value={supplier.id}
                  >
                    {supplier.legalName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Divider>OR</Divider>
              <p className="gx-text-center"><Button type="link" onClick={() => setVisible(true)}>Add a Supplier</Button>
              </p>
            </Form.Item>
            <Row gutter={24} style={{ marginBottom: 20 }}>
                <Col xs={24}>
                </Col>
                <Col xs={24}>
                  <FilesManager
                    files={files}
                    context={{
                      assetRelation: "quotation_request",
                      //  assetRelationId: project.id
                    }}
                    customSubmitHandler={({ fileList }) => {
                      setFiles(fileList);
                    }}
                  />
                </Col>
              </Row>
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
          // onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={'auto'}
        bodyStyle={{'padding': '0'}}
          okButtonProps={{style:{display:"none"}}}
      >
          <SupplierRegistrationPage showLoginLink={false} isBuyer={true}
          isAuthenticated={true} onAletSuccess={reloadSuppliers}/>
      </Modal>
    </Card>
    </>
  );
};


const NewQuotationPage = () => (
  <RegistrationProvider>
    <ProjectProvider>
      <QuotationProvider>
        <NewQuote/>
      </QuotationProvider>
    </ProjectProvider>
  </RegistrationProvider>
);

export default NewQuotationPage;
