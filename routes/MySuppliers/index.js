import { SearchOutlined, SmallDashOutlined } from '@ant-design/icons';
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
const fallbackImg =
  'data:image/png;base64,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';
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
    // getMySuppliers((data) => {
    //     setSuppliersList(data);
    // })
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

  const handleOnShow = supplierId => {
    getSupplier(supplierId, data => {
      showSupplierModal();
      setSupplierDetails(data);
      console.log(data);
    });
  };
  const handleOnDelete = supplierId => {
    alert('delete');
  };

  const DropdownMenu = ({ supplierId }) => (
    <Menu>
      <Menu.Item key="0" onClick={() => handleOnShow(supplierId)}>
        Show
      </Menu.Item>
      <Menu.Item key="1" onClick={() => handleOnDelete(supplierId)}>
        Delete
      </Menu.Item>
    </Menu>
  );
  const suppliersColumns = [
    {
      title: 'Fantasy Name',
      dataIndex: 'fantasyName',
      key: 'fantasyName',
      // width: '30%',
      ...getColumnSearchProps('fantasyName'),
    },
    {
      title: 'Business Name',
      dataIndex: 'legalName',
      key: 'legalName',
      // width: '30%',
      ...getColumnSearchProps('fantasyName'),
    },
    {
      title: 'Email',
      dataIndex: 'emailId',
      key: 'emailId',
      // width: '30%',
      ...getColumnSearchProps('emailId'),
    },
    {
      title: 'Share supplier',
      dataIndex: 'isShared',
      key: 'isShared',
      render: (text, record) => <Space size="middle">{record.isShared ? 'Yes' : 'No'}</Space>,
      // width: '30%',
      // ...this.getColumnSearchProps('name'),
    },
    {
      title: 'Actions',
      key: 'Action',
      render: (text, record) => (
        <div className="gx-w-100 gx-text-center">
          <Dropdown overlay={<DropdownMenu supplierId={record.id} />} trigger={['click']}>
            <a onClick={e => e.preventDefault()}>
              <i className="icon icon-ellipse-h"></i>
              {/* <SmallDashOutlined
                                style={{ fontSize: "150%" }}
                            /> */}
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
