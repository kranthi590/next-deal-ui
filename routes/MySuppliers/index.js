import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Space, Table, Input, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import BreadCrumb from '../../app/components/BreadCrumb';
import { useRegistration } from '../../contexts/business-registration';
import SupplierRegistrationPage from '../../pages/supplier-registration';
import IntlMessages from '../../util/IntlMessages';

const MySuppliers = props => {
  const { getMySuppliers } = useRegistration();
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [suppliersList, setSuppliersList] = useState([]);

  const loadMySuppliers = () => {
    getMySuppliers(data => {
      setSuppliersList(data);
    });
  };

  useEffect(() => {
    loadMySuppliers();
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
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
    render: text => text,
  });

  const suppliersColumns = [
    {
      title: <IntlMessages id="app.buyerregistration.field.legalName"/>,
      dataIndex: 'fantasyName',
      key: 'fantasyName',
      // width: '30%',
      ...getColumnSearchProps('fantasyName'),
    },
    {
      title: <IntlMessages id="app.supplierregistration.field.business_categories"/>,
      dataIndex: 'categories',
      key: 'categories',
      // width: '30%',
      ...getColumnSearchProps('categories'),
    },
    {
      title: 'Email',
      dataIndex: 'emailId',
      key: 'emailId',
      // width: '30%',
      ...getColumnSearchProps('emailId'),
    },
    {
      title: <IntlMessages id="app.supplierregistration.field.observacion"/>,
      dataIndex: 'observation',
      key: 'observation',
      // width: '30%',
      ...getColumnSearchProps('observation'),
    },
    {
      title: <IntlMessages id="app.supplierregistration.field.isshared"/>,
      dataIndex: 'isShared',
      key: 'isShared',
      render: (text, record) => <Space size="middle">{record.isShared ? 'Yes' : 'No'}</Space>,
      // width: '30%',
      // ...this.getColumnSearchProps('name'),
    },
    {
      title: 'Details/Edit',
      key: 'Action',
      render: (text, record) => (
        <Space size="middle">
          <a>Edit</a>
        </Space>
      ),
    },
  ];
  const reloadSuppliers = () => {
    setVisible(false);
    loadMySuppliers();
  };
  const showModal = () => {
    setVisible(true);
  };
  return (
    <>
      <BreadCrumb
  navItems={[{ text: <IntlMessages id="sidebar.suppliers.mySuppliers" /> }]}
  />
      <Card className="gx-card" title={<IntlMessages id="app.mysuppliers.pageTitle" />}>
        <div align="end" style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={showModal}>
            <i className="icon icon-add gx-mr-2" />
            <IntlMessages id="app.quotation.addsupplier" />
          </Button>
        </div>
        <Table
          columns={suppliersColumns}
          dataSource={suppliersList}
          pagination={{ pageSize: 30 }}
          scroll={{ y: 500 }}
        />
      </Card>
      <Modal
        title={<IntlMessages id="app.supplierregistration.page_title" />}
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        width={'auto'}
        bodyStyle={{ padding: '0' }}
        okButtonProps={{ style: { display: 'none' } }}
        destroyOnClose={true}
      >
        <SupplierRegistrationPage
          showLoginLink={false}
          isBuyer={true}
          isAuthenticated={true}
          onAletSuccess={reloadSuppliers}
        />
      </Modal>
    </>
  );
};
export default MySuppliers;
