import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Col,
  Row,
  DatePicker,
  Select,
  Divider,
  Modal,
  Badge,
  Checkbox,
} from 'antd';
import { useRouter } from 'next/router';

// Utils
import IntlMessages from '../../../../util/IntlMessages';
import { RegistrationProvider, useRegistration } from '../../../../contexts/business-registration';
import { ProjectProvider, useProject } from '../../../../contexts/projects';
import {
  getDateInMilliseconds,
  successNotification,
  clpToNumber,
  handleErrorNotification,
} from '../../../../util/util';
import SupplierRegistrationPage from '../../../supplier-registration';
import { QuotationProvider, useQuotation } from '../../../../contexts/quotations';
import FilesManager from '../../../../app/common/FileManager';
import { uploadFiles } from '../../../../util/Api';
import BreadCrumb from '../../../../app/components/BreadCrumb';
import moment from 'moment';
import ClpFormatter from '../../../../shared/CLP';
import { FileAddOutlined } from '@ant-design/icons';
import { CURRENCY } from '../../../../util/appConstants';
import { useIntl } from 'react-intl';
const { TextArea } = Input;
const { Option, OptGroup } = Select;

const formLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
    md: { span: 20 },
    lg: { span: 20 },
  },
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
    md: { span: 7 },
    lg: { span: 7 },
  },
};

const stringRule = {
  required: true,
  message: <IntlMessages id="app.project.create.validations" />,
};

const NewQuote = props => {
  const {
    getBuyerSuppliers,
    getNextDealSuppliers,
    suppliersCountByCategories,
    getBuyerSuppliersByCategory,
  } = useRegistration();
  const { createQuotation } = useQuotation();
  const { getProjectById } = useProject();
  const [estimatedBudget, setEstimatedBudget] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [expectedEndDate, setExpectedEndDate] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [sharedSuppliers, setSharedSuppliers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [projectInfo, setProjectInfo] = useState({});
  const [suppliersData, setSuppliersData] = useState([]);

  const [form] = Form.useForm();
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const intl = useIntl();

  const loadSuppliers = () => {
    getBuyerSuppliers(data => {
      setSuppliers(data.rows);
      getNextDealSuppliers(0, 200, nextdealSuppliers => {
        const updatedSharedSuppliers = nextdealSuppliers.rows.filter(
          item => !data.rows.some(supplier => supplier.id === item.id),
        );
        setSharedSuppliers(updatedSharedSuppliers);
      });
    });
  };

  const loadCategories = () => {
    suppliersCountByCategories(data => {
      data = data.map(item => {
        item.suppliers = [];
        return item;
      });
      setSuppliersData(data);
    });
  };

  useEffect(() => {
    const projectId = router.query.id;
    getProjectById(projectId, data => {
      setProjectInfo(data);
    });
    loadCategories();
  }, []);

  const reloadSuppliers = () => {
    setVisible(false);
    loadCategories();
  };

  const startDateChangeHandler = date => {
    setStartDate(getDateInMilliseconds(date));
  };

  const endDateChangeHandler = date => {
    setExpectedEndDate(getDateInMilliseconds(date));
  };

  const getFormData = data => {
    const formData = Object.keys(data).reduce((acc, key) => {
      if (data[key] && key === 'startDate') {
        acc = { ...acc, startDate };
      } else if (data[key] && key === 'expectedEndDate') {
        acc = { ...acc, expectedEndDate };
      } else if (data[key] && key === 'estimatedBudget') {
        acc = { ...acc, estimatedBudget: clpToNumber(estimatedBudget) };
      } else if (data[key]) {
        acc = { ...acc, [key]: data[key] };
      }
      return acc;
    }, {});
    formData.comments = formData.description;
    if (formData.sharedSuppliers && formData.sharedSuppliers.length) {
      formData.suppliers = formData.suppliers.concat(formData.sharedSuppliers);
    }
    delete formData.sharedSuppliers;
    return formData;
  };

  const onSave = values => {
    const projectId = projectInfo && projectInfo.id;
    createQuotation(projectId, getFormData(values), async data => {
      try {
        if (files.length > 0) {
          await uploadFiles(
            files,
            {
              assetRelation: 'quotation_request',
              assetRelationId: data.id,
            },
            true,
          );
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.data &&
          error.response.data.data.errors &&
          error.response.data.data.errors.length
        ) {
          error.response.data = error.response.data.data;
          handleErrorNotification(error);
        }
      }
      successNotification('app.registration.detailsSaveSuccessMessage');
      setTimeout(() => {
        router.back();
      }, 1000);
    });
  };

  const onBudgetChange = async value => {
    setEstimatedBudget(value);
  };

  const onCategoryGroupSelect = (selectedCategory, dataloaded) => {
    if (!dataloaded) {
      const updatedData = [...suppliersData];
      getBuyerSuppliersByCategory(selectedCategory, ({ rows }) => {
        for (let i = 0; i < suppliersData.length; i++) {
          if (suppliersData[i].id === selectedCategory) {
            updatedData[i].suppliers = rows;
            break;
          }
        }
        setSuppliersData(updatedData);
      });
    }
  };
  return (
    <>
      <BreadCrumb
        navItems={[
          { text: <IntlMessages id="sidebar.project.Projects" />, route: '/projects' },
          { text: projectInfo.name, route: '/projects/' + projectInfo.id },
          { text: <IntlMessages id="app.common.newQuotation" /> },
        ]}
      />
      <Card className="gx-card gx-card-widget">
        <div className="ant-card-head gx-pt-0">
          <div className="ant-card-head-wrapper">
            <div className="ant-card-head-title gx-text-left">
              <h4 className="gx-card-bordered-title">
                <FileAddOutlined className="gx-mr-3" />
                <IntlMessages id="app.quotation.addquotation" />
              </h4>
            </div>
          </div>
        </div>
        <Form
          form={form}
          fields={[
            {
              name: ['projectName'],
              value: projectInfo.name,
            },
            {
              name: ['costCenter'],
              value: projectInfo.costCenter ? projectInfo.costCenter : 'NA',
            },
            {
              name: ['currency'],
              value: 'clp',
            },
          ]}
          onFinish={onSave}
          {...formLayout}
        >
          <Row>
            <Col xl={12} xs={24}>
              <Form.Item
                name="projectName"
                label={<IntlMessages id="app.quotation.field.projectName" />}
                rules={[stringRule]}
              >
                <Input
                  placeholder={intl.formatMessage({ id: 'app.project.field.projectName' })}
                  disabled
                />
              </Form.Item>
              <Form.Item
                name="name"
                label={<IntlMessages id="app.quotation.field.quotationname" />}
                rules={[stringRule]}
              >
                <Input
                  placeholder={intl.formatMessage({ id: 'app.quotation.field.quotationname' })}
                />
              </Form.Item>
              <Form.Item
                name="startDate"
                label={<IntlMessages id="app.project.field.startdate" />}
                rules={[stringRule]}
              >
                <DatePicker
                  className="gx-w-100"
                  placeholder={intl.formatMessage({ id: 'app.project.field.startdate' })}
                  onChange={startDateChangeHandler}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
              <Form.Item
                name="expectedEndDate"
                label={<IntlMessages id="app.project.field.enddate" />}
              >
                <DatePicker
                  className="gx-w-100"
                  placeholder={intl.formatMessage({ id: 'app.project.field.enddate' })}
                  onChange={endDateChangeHandler}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
              <Form.Item
                name="costCenter"
                label={<IntlMessages id="app.project.field.costcenter" />}
                rules={[stringRule]}
              >
                <Input
                  placeholder={intl.formatMessage({ id: 'app.project.field.costcenter' })}
                  disabled
                />
              </Form.Item>
              <Form.Item
                name="estimatedBudget"
                label={<IntlMessages id="app.project.field.estimatedBudget" />}
                rules={[stringRule]}
              >
                <ClpFormatter
                  className="gx-w-100"
                  value={estimatedBudget}
                  size="large"
                  onChange={onBudgetChange}
                  placeholder="1.000.000"
                />
              </Form.Item>
              <Form.Item
                label={<IntlMessages id="app.quotation.field.currency" />}
                name="currency"
                rules={[stringRule]}
              >
                <Select
                  placeholder={intl.formatMessage({ id: 'app.quotation.field.currency' })}
                  showSearch
                  filterOption={(input, option) => {
                    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                  }}
                >
                  {Object.keys(CURRENCY).map(item => (
                    <Option key={item} value={CURRENCY[item].toLowerCase()}>
                      {CURRENCY[item]}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="description"
                label={<IntlMessages id="app.project.field.description" />}
                rules={[stringRule]}
              >
                <TextArea
                  placeholder={intl.formatMessage({ id: 'app.project.field.description' })}
                  rows={8}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              {/* suppliers with categories */}
              <Form.Item
                label={<IntlMessages id="app.quotation.suppliers" />}
                name="suppliers"
                rules={[
                  {
                    required: true,
                    message: <IntlMessages id="app.quotation.suppliers.error.required" />,
                    type: 'array',
                  },
                ]}
              >
                <Select
                  size="large"
                  placeholder={intl.formatMessage({ id: 'app.quotation.selectYourSuppliers' })}
                  mode="multiple"
                  filterOption={(input, option) => {
                    return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                  }}
                >
                  {suppliersData &&
                    suppliersData.map((category, index) => (
                      <OptGroup
                        label={
                          <div className="gx-d-flex">
                            <span
                              style={{ flexGrow: 1, cursor: 'pointer' }}
                              onClick={() => {
                                onCategoryGroupSelect(category.id, category.suppliers.length);
                              }}
                            >
                              {category.name}
                            </span>
                            <span>
                              <Badge
                                count={category.suppliersCount}
                                style={{ backgroundColor: '#038FDE' }}
                                className="gx-mx-2"
                              />
                            </span>
                            {/*      <span>
                              <Checkbox
                                disabled={
                                  category && category.suppliers && category.suppliers.length
                                }
                                checked={
                                  category && category.suppliers && category.suppliers.length
                                }
                                onChange={e =>
                                  onCategoryGroupSelect(e, category.id, category.suppliers.length)
                                }
                              />
                            </span>*/}
                          </div>
                        }
                        key={category.id + '_' + index}
                        title={category.name}
                      >
                        {category.suppliers &&
                          category.suppliers.map((supplier, index) => (
                            <Option
                              key={category.id + '_' + supplier.id + '_' + index}
                              value={supplier.id}
                              title={supplier.legalName}
                            >
                              {supplier.legalName}
                            </Option>
                          ))}
                      </OptGroup>
                    ))}
                </Select>
              </Form.Item>
              {/* suppliers with categories */}

              <Form.Item className="gx-d-flex gx-justify-content-center">
                <Divider>
                  <IntlMessages id="app.userAuth.or" />
                </Divider>
                <p className="gx-text-center">
                  <Button type="link" onClick={() => setVisible(true)}>
                    <IntlMessages id="app.quotation.addsupplier" />
                  </Button>
                </p>
                <Divider>
                  <IntlMessages id="app.userAuth.or" />
                </Divider>
              </Form.Item>
              <Row gutter={24} style={{ marginBottom: 20 }}>
                <Col xs={24}></Col>
                <Col
                  xs={24}
                  style={{
                    height: '150px',
                    overflowX: 'auto',
                  }}
                >
                  <FilesManager
                    files={files}
                    tooltiptext="Arroja los archivos relevantes para tu cotización"
                    context={{
                      assetRelation: 'quotation_request',
                    }}
                    customSubmitHandler={({ fileList }) => {
                      setFiles(fileList);
                    }}
                    allowDelete={true}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">
                <IntlMessages id="app.quotation.savequotation" />
              </Button>
            </Col>
          </Row>
        </Form>
        <Modal
          title={<IntlMessages id="app.supplierregistration.page_title" />}
          centered
          visible={visible}
          onCancel={() => setVisible(false)}
          width={1000}
          bodyStyle={{ padding: '0' }}
          okButtonProps={{ style: { display: 'none' } }}
          maskClosable={false}
          destroyOnClose={true}
          footer={false}
        >
          <SupplierRegistrationPage
            isBannerShown={false}
            showLoginLink={false}
            isBuyer={true}
            isAuthenticated={true}
            onAletSuccess={reloadSuppliers}
          />
        </Modal>
      </Card>
    </>
  );
};

const NewQuotationPage = () => (
  <RegistrationProvider>
    <ProjectProvider>
      <QuotationProvider>
        <NewQuote />
      </QuotationProvider>
    </ProjectProvider>
  </RegistrationProvider>
);

export default NewQuotationPage;
