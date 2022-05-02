import { Form, Row, Col, Select, Button, Badge, Checkbox } from "antd";
import React, { useState, useEffect } from "react";
import { useIntl } from 'react-intl';
import { useRegistration } from "../../../../contexts/business-registration";
import { useResponse } from "../../../../contexts/responses";
import IntlMessages from "../../../../util/IntlMessages";
import { successNotification } from "../../../../util/util";

const formLayout = {
    wrapperCol: {
        xs: { span: 24 },
    },
    labelCol: {
        xs: { span: 24 },
    },
};
const SupplierSelector = ({ quotationId }) => {
    const { suppliersCountByCategories, getBuyerSuppliersByCategory } = useRegistration();
    const { assignSuppliersToQuotation } = useResponse();
    const [suppliersData, setSuppliersData] = useState([]);

    const { Option, OptGroup } = Select;
    const [form] = Form.useForm();
    const intl = useIntl();

    const loadCategories = () => {
        suppliersCountByCategories(data => {
            data = data.map(item => {
                item.suppliers = [];
                return item
            });
            setSuppliersData(data);
        });
    };

    const onCategoryGroupSelect = (e, selectedCategory, dataloaded) => {
        if (!dataloaded) {
            const updatedData = [...suppliersData];
            if (e.target.checked) {
                getBuyerSuppliersByCategory(selectedCategory, ({ rows }) => {
                    for (let i = 0; i < suppliersData.length; i++) {
                        if (suppliersData[i].id === selectedCategory) {
                            updatedData[i].suppliers = rows;
                            break;
                        }
                    }
                    setSuppliersData(updatedData)
                })
            }
        }
    }

    const onSave = values => {
        assignSuppliersToQuotation(quotationId, values, () => {
            successNotification('app.registration.detailsSaveSuccessMessage');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        })
    };

    useEffect(() => {
        loadCategories();
    }, []);

    return (<div className="gx-px-4">
        <div className="gx-text-center">
            <h1 className="gx-font-weight-medium">
                <IntlMessages id="app.common.assignSuppliers" />
            </h1>
        </div>
        <Form
            form={form}
            onFinish={onSave}
            {...formLayout}
            labelAlign="left"
        >
            <Row>
                <Col xs={24}>
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
                        >{
                                suppliersData.map(category => (
                                    <OptGroup
                                        label={
                                            <div className="gx-d-flex" >
                                                <span style={{ flexGrow: 1 }}>{category.name}</span>
                                                <span><Badge count={category.suppliersCount} style={{ backgroundColor: '#038FDE' }} className="gx-mx-2" /></span>
                                                <span>
                                                    <Checkbox disabled={category && category.suppliers && category.suppliers.length} checked={category && category.suppliers && category.suppliers.length}
                                                        onChange={(e) => onCategoryGroupSelect(e, category.id, category.suppliers.length)}
                                                    />
                                                </span>
                                            </div>}
                                        key={category.id}
                                        title={category.name}
                                    >
                                        {category.suppliers &&
                                            category.suppliers.map(supplier => (
                                                <Option key={supplier.id + supplier.legalName} value={supplier.id} title={supplier.legalName}>
                                                    {supplier.legalName}
                                                </Option>
                                            ))}
                                    </OptGroup>
                                ))
                            }
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit">
                        <IntlMessages id="button.save" />
                    </Button>
                </Col>
            </Row>
        </Form>
    </div>)
}

export default SupplierSelector