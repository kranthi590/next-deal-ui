import { SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Modal,
  Space,
  Table,
  Input,
  Row,
  Col,
  Dropdown,
  Menu,
  Image,
  Typography,
} from 'antd';
import React, { useState, useEffect } from 'react';
import BreadCrumb from '../../app/components/BreadCrumb';
import WidgetHeader from '../../app/components/WidgetHeader';
import SupplierDetails from '../../app/components/SupplierDetails';
import { useRegistration } from '../../contexts/business-registration';
import SupplierRegistrationPage from '../../pages/supplier-registration';
import IntlMessages from '../../util/IntlMessages';
const { Title } = Typography;
const MySuppliers = props => {
  const { getMySuppliers, getBuyerSuppliers, getSupplier } = useRegistration();
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [suppliersList, setSuppliersList] = useState([]);
  const [isSupplierModalVisible, setIsSupplierModalVisible] = useState(false);
  const [supplierDetails, setSupplierDetails] = useState(null);

  const showSupplierModal = () => {
    setIsSupplierModalVisible(true);
  };
  const hideSupplierModal = () => {
    setIsSupplierModalVisible(false);
    setSupplierDetails(null);
  };

  const loadMySuppliers = () => {
    getBuyerSuppliers(data => {
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
            <IntlMessages id="button.search" />
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            <IntlMessages id="button.reset" />
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

  const handleOnShow = supplierId => {
    getSupplier(supplierId, data => {
      showSupplierModal();
      setSupplierDetails(data);
    });
  };
  const handleOnDelete = supplierId => {
    // alert('delete');
  };

  const DropdownMenu = ({ supplierId }) => (
    <Menu>
      <Menu.Item key="0" onClick={() => handleOnShow(supplierId)}>
        <IntlMessages id="button.show" />
      </Menu.Item>
      <Menu.Item key="1" onClick={() => handleOnDelete(supplierId)}>
        <IntlMessages id="button.delete" />
      </Menu.Item>
    </Menu>
  );
  const suppliersColumns = [
    {
      title: <IntlMessages id="app.supplierregistration.field.business_fantasyName" />,
      dataIndex: 'fantasyName',
      key: 'fantasyName',
      ...getColumnSearchProps('fantasyName'),
    },
    {
      title: <IntlMessages id="app.supplierregistration.field.business_legalName" />,
      dataIndex: 'legalName',
      key: 'legalName',
      ...getColumnSearchProps('fantasyName'),
    },
    {
      title: <IntlMessages id="app.supplierregistration.field.business_emailId" />,
      dataIndex: 'emailId',
      key: 'emailId',
      ...getColumnSearchProps('emailId'),
    },
    {
      title: 'Compartir el proveedor',
      dataIndex: 'isShared',
      key: 'isShared',
      render: (text, record) => <Space size="middle">{record.isShared ? 'Yes' : 'No'}</Space>,
    },
    {
      title: 'Acciones',
      key: 'Action',
      render: (text, record) => (
        <div className="gx-w-100 gx-text-center">
          <Dropdown overlay={<DropdownMenu supplierId={record.id} />} trigger={['click']}>
            <a onClick={e => e.preventDefault()}>
              <i className="icon icon-ellipse-h"></i>
            </a>
          </Dropdown>
        </div>
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
      ></BreadCrumb>
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
      <Modal
        title="Supplier Details"
        centered
        visible={isSupplierModalVisible}
        onCancel={hideSupplierModal}
        bodyStyle={{ padding: '0' }}
        footer={null}
        destroyOnClose={true}
        width={1000}
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
