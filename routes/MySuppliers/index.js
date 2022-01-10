import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, Modal, Space, Table, Input, Row, Col } from "antd";
import React, { useState } from "react";
import BreadCrumb from "../../app/components/BreadCrumb";
import SupplierRegistrationPage from "../../pages/supplier-registration";
import IntlMessages from "../../util/IntlMessages";
const data = [
    { fantasyName: "Sairaj", categories: "Alimentacion", emailId: "sairaj.devacc@gmail.com", observation: "Comments", isShared: true },
    { fantasyName: "Ram", categories: "Alimentacion", emailId: "sairaj.devacc@gmail.com", observation: "Comments", isShared: true },
    { fantasyName: "Steve", categories: "Alimentacion", emailId: "sairaj.devacc@gmail.com", observation: "Comments", isShared: true },
    { fantasyName: "Raj", categories: "Alimentacion", emailId: "sairaj.devacc@gmail.com", observation: "Comments", isShared: true },
    { fantasyName: "John", categories: "Alimentacion", emailId: "sairaj.devacc@gmail.com", observation: "Comments", isShared: true },
];
const MySuppliers = (props) => {
    const [visible, setVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('')
    };
    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    // ref={node => {
                    //     this.searchInput = node;
                    // }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                // setTimeout(() => this.searchInput.select(), 100);
            }
        },
        render: text => text
    });

    const suppliersColumns = [
        {
            title: 'Business Name',
            dataIndex: 'fantasyName',
            key: 'fantasyName',
            // width: '30%',
            ...getColumnSearchProps('fantasyName'),
        }, {
            title: 'Category',
            dataIndex: 'categories',
            key: 'categories',
            // width: '30%',
            ...getColumnSearchProps('categories'),
        }, {
            title: 'Email',
            dataIndex: 'emailId',
            key: 'emailId',
            // width: '30%',
            ...getColumnSearchProps('emailId'),
        }, {
            title: 'Observation',
            dataIndex: 'observation',
            key: 'observation',
            // width: '30%',
            ...getColumnSearchProps('observation'),
        }, {
            title: 'Share supplier',
            dataIndex: 'isShared',
            key: 'isShared',
            render: (text, record) => (
                <Space size="middle">
                    {record.isShared ? "Yes" : "No"}
                </Space>
            ),
            // width: '30%',
            // ...this.getColumnSearchProps('name'),
        }, {
            title: 'Details/Edit',
            key: 'Action',
            render: (text, record) => (
                <Space size="middle">
                    <a>Edit</a>
                </Space>
            )
        }
    ];
    const reloadSuppliers = () => {
        setVisible(false);
        // getBuyerSuppliers((data) => {
        //   setSuppliers(data);
        // });
    }
    const showModal = () => {
        setVisible(true);
    }
    return (
        <>
            <BreadCrumb navItems={[{ text: <IntlMessages id="sidebar.suppliers.mySuppliers" /> }]}></BreadCrumb>
            <Card
                className="gx-card"
                title={<IntlMessages id="app.mysuppliers.pageTitle" />}
            >
                <div align="end" style={{textAlign:"right"}}>
                    <Button type="primary" onClick={showModal} >
                        <i className="icon icon-add gx-mr-2" />
                        <IntlMessages id="app.quotation.addsupplier" />
                    </Button>
                </div>
                <Table columns={suppliersColumns} dataSource={data} pagination={{ pageSize: 30 }} scroll={{ y: 240 }}/>
            </Card>
            <Modal
                title={<IntlMessages id="app.supplierregistration.page_title" />}
                centered
                visible={visible}
                onCancel={() => setVisible(false)}
                width={'auto'}
                bodyStyle={{ 'padding': '0' }}
                okButtonProps={{ style: { display: "none" } }}
                destroyOnClose={true}
            >
                <SupplierRegistrationPage showLoginLink={false} isBuyer={true}
                    isAuthenticated={true} onAletSuccess={reloadSuppliers} />
            </Modal>
        </>
    )
}
export default MySuppliers