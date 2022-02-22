import {
  CloudDownloadOutlined,
  CloudUploadOutlined,
  SearchOutlined,
  UserAddOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Button, Card, Modal, Space, Table, Input, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import SupplierDetails from '../../app/components/NextDeal/SupplierDetails';
import { useRegistration } from '../../contexts/business-registration';
import SupplierRegistrationPage from '../../pages/supplier-registration';
import IntlMessages from '../../util/IntlMessages';
import { Cookies } from 'react-cookie';
const MySuppliers = props => {
  const { getBuyerSuppliers, getSupplier, downloadSuppliers } = useRegistration();
  const [visible, setVisible] = useState(false);
  const [, setSearchText] = useState('');
  const [, setSearchedColumn] = useState('');
  const [suppliersList, setSuppliersList] = useState([]);
  const [isSupplierModalVisible, setIsSupplierModalVisible] = useState(false);
  const [supplierDetails, setSupplierDetails] = useState(null);
  const [, setBuyerId] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const cookie = new Cookies();

  useEffect(() => {
    setBuyerId(cookie.get('buyerId'));
  });

  const showSupplierModal = () => {
    setIsSupplierModalVisible(true);
  };
  const hideSupplierModal = () => {
    setIsSupplierModalVisible(false);
    setSupplierDetails(null);
  };

  const loadMySuppliers = (page = 1) => {
    setLoading(true);
    getBuyerSuppliers(
      data => {
        setSuppliersList(data.rows);
        setTotalPages(data.count);
        setLoading(false);
      },
      (page - 1) * 20,
      20,
    );
  };

  useEffect(() => {
    loadMySuppliers(1);
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
  const getColumnSearchProps = (dataIndex, fieldPlaceholder) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${fieldPlaceholder}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
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

  const handleOnShow = supplierId => {
    getSupplier(supplierId, data => {
      showSupplierModal();
      setSupplierDetails(data);
    });
  };

  const suppliersColumns = [
    {
      title: <IntlMessages id="app.supplierregistration.field.business_fantasyName" />,
      dataIndex: 'fantasyName',
      key: 'fantasyName',
      ...getColumnSearchProps('fantasyName', 'Nombre de fantasía'),
      render: (text, record) => (
        <div className="gx-w-100">
          <a onClick={() => handleOnShow(record.id)}>{record.fantasyName}</a>
        </div>
      ),
    },
    {
      title: <IntlMessages id="app.supplierregistration.field.business_legalName" />,
      dataIndex: 'legalName',
      key: 'legalName',
      ...getColumnSearchProps('legalName', 'Nombre de la empresa'),
    },
    {
      title: <IntlMessages id="app.supplierregistration.field.business_emailId" />,
      dataIndex: 'emailId',
      key: 'emailId',
      ...getColumnSearchProps('emailId', 'Email del negocio'),
    },
    {
      title: <IntlMessages id="app.supplierregistration.field.isshared" />,
      dataIndex: 'isShared',
      key: 'isShared',
      render: (text, record) => (
        <Space size="middle">
          {record.isShared ? (
            <IntlMessages id="app.common.text.yes" />
          ) : (
            <IntlMessages id="app.common.text.no" />
          )}
        </Space>
      ),
    },
    {
      title: 'Acciones',
      key: 'Action',
      render: (text, record) => (
        <div className="gx-w-100">
          <a onClick={() => handleOnShow(record.id)}>
            <EyeOutlined />
          </a>
        </div>
      ),
    },
  ];
  const reloadSuppliers = () => {
    setVisible(false);
    loadMySuppliers(1);
  };
  const showModal = () => {
    setVisible(true);
  };

  const onDownloadXls = () => {
    downloadSuppliers();
  };

  const onUploadXls = () => {};
  return (
    <>
      <Card className="gx-card gx-card-widget">
        <div className="ant-card-head gx-pt-0">
          <div className="ant-card-head-wrapper">
            <div className="ant-card-head-title gx-text-left">
              <h4 className="gx-card-bordered-title">
                <i className="icon icon-product-list gx-mr-3" />
                <IntlMessages id="sidebar.suppliers.mySuppliers" />
              </h4>
            </div>
          </div>
        </div>
        <div align="end" style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={onUploadXls}>
            <CloudUploadOutlined className="gx-mr-2" />
            <IntlMessages id="app.common.text.upload" />
            Xls
          </Button>
          <Button type="primary" onClick={onDownloadXls}>
            <CloudDownloadOutlined className="gx-mr-2" />
            <IntlMessages id="app.common.text.download" />
            Xls
          </Button>
          <Button type="primary" onClick={showModal}>
            <UserAddOutlined className="gx-mr-2" />
            <IntlMessages id="app.quotation.addsupplier" />
          </Button>
        </div>
        <Table
          loading={loading}
          columns={suppliersColumns}
          dataSource={suppliersList}
          scroll={{ y: 500 }}
          pagination={{
            showSizeChanger: false,
            pageSize: 20,
            total: totalPages,
            onChange: loadMySuppliers,
          }}
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
        width={1000}
        maskClosable={false}
      >
        <SupplierRegistrationPage
          isBannerShown={false}
          showLoginLink={false}
          isBuyer={true}
          isAuthenticated={true}
          onAletSuccess={reloadSuppliers}
        />
      </Modal>
      <Modal
        title={<IntlMessages id="app.common.text.supplierDetails" />}
        centered
        visible={isSupplierModalVisible}
        onCancel={hideSupplierModal}
        bodyStyle={{ padding: '0' }}
        footer={null}
        destroyOnClose={true}
        width={1000}
        maskClosable={false}
      >
        <div className="gx-main-content-wrapper">
          {supplierDetails ? (
            <SupplierDetails supplierDetails={supplierDetails} />
          ) : (
            <Row>
              <Col xs={24} md={12}></Col>
            </Row>
          )}
        </div>
      </Modal>
    </>
  );
};
export default MySuppliers;
