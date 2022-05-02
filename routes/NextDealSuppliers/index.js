import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Space, Table, Input, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import SupplierDetails from '../../app/components/NextDeal/SupplierDetails';
import { useRegistration } from '../../contexts/business-registration';
import IntlMessages from '../../util/IntlMessages';
import { Cookies } from 'react-cookie';
import CustomScrollbars from '../../util/CustomScrollbars';
const NextDealSuppliers = props => {
  const { getNextDealSuppliers, getSupplier } = useRegistration();
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

  const loadNextDealSuppliers = page => {
    setLoading(true);
    getNextDealSuppliers((page - 1) * 20, 20, data => {
      setSuppliersList(data.rows);
      setTotalPages(data.count);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadNextDealSuppliers(1);
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
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

  return (
    <>
      <Card className="gx-card gx-card-widget">
        <div className="ant-card-head gx-pt-0">
          <div className="ant-card-head-wrapper">
            <div className="ant-card-head-title gx-text-left">
              <h4 className="gx-card-bordered-title">
                <i className="icon icon-product-list gx-mr-3" />
                <IntlMessages id="sidebar.suppliers.suppliersNextDeal" />
              </h4>
            </div>
          </div>
        </div>
        <CustomScrollbars className="next-suppliers-table" sid="mySuppliersScrollableWrapper">
          <div className="gx-p-2">
            <Table
              loading={loading}
              columns={suppliersColumns}
              dataSource={suppliersList}
              pagination={{
                showSizeChanger: false,
                pageSize: 20,
                total: totalPages,
                onChange: loadNextDealSuppliers,
              }}
            />
          </div>
        </CustomScrollbars>
      </Card>
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
              <Col xs={24} md={12} />
            </Row>
          )}
        </div>
      </Modal>
    </>
  );
};
export default NextDealSuppliers;
