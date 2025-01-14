import {
  CloudDownloadOutlined,
  CloudUploadOutlined,
  SearchOutlined,
  UserAddOutlined,
  EyeOutlined,
  InboxOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Modal,
  Space,
  Table,
  Input,
  Row,
  Col,
  message,
  Breadcrumb,
  Tooltip,
} from 'antd';
import React, { useState, useEffect } from 'react';
import SupplierDetails from '../../app/components/NextDeal/SupplierDetails';
import { useRegistration } from '../../contexts/business-registration';
import SupplierRegistrationPage from '../../pages/supplier-registration';
import IntlMessages from '../../util/IntlMessages';
import { Cookies } from 'react-cookie';
import Dragger from 'antd/lib/upload/Dragger';
import { errorNotification, successNotification } from '../../util/util';
import Link from 'next/link';
import CustomScrollbars from '../../util/CustomScrollbars';
import SupplierCategories from '../../app/components/NextDeal/SupplierCategories';
import { useIntl } from 'react-intl';

const MySuppliers = props => {
  const {
    getBuyerSuppliersByCategory,
    getSupplier,
    downloadSuppliers,
    uploadSupplierDetails,
    fetchCategories,
    suppliersCountByCategories,
  } = useRegistration();
  const [visible, setVisible] = useState(false);
  const [, setSearchText] = useState('');
  const [, setSearchedColumn] = useState('');
  const [suppliersList, setSuppliersList] = useState([]);
  const [isSupplierModalVisible, setIsSupplierModalVisible] = useState(false);
  const [supplierDetails, setSupplierDetails] = useState(null);
  const [buyerId, setBuyerId] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);
  const [uploadSuppliers, setUploadSuppliers] = useState(false);
  const cookie = new Cookies();
  const [supplierCategories, setSupplierCategories] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const intl = useIntl();

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
    setCurrentPage(page);
    setLoading(true);
    getBuyerSuppliersByCategory(
      selectedCategory.id,
      data => {
        setSuppliersList(data.rows);
        setTotalPages(data.count);
        setLoading(false);
      },
      (page - 1) * 20,
      20,
    );
  };

  const loadCategories = () => {
    suppliersCountByCategories(data => {
      setSupplierCategories(data);
    });
  };

  useEffect(() => {
    loadCategories();
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
    // {
    //   title: <IntlMessages id="app.supplierregistration.field.business_fantasyName" />,
    //   dataIndex: 'fantasyName',
    //   key: 'fantasyName',
    //   ...getColumnSearchProps('fantasyName', 'Nombre de fantasía'),
    //   render: (text, record) => (
    //     <div className="gx-w-100">
    //       <a onClick={() => handleOnShow(record.id)}>{record.fantasyName}</a>
    //     </div>
    //   ),
    // },
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
    // {
    //   title: <IntlMessages id="app.supplierregistration.field.isshared" />,
    //   dataIndex: 'isShared',
    //   key: 'isShared',
    //   render: (text, record) => (
    //     <Space size="middle">
    //       {record.isShared ? (
    //         <IntlMessages id="app.common.text.yes" />
    //       ) : (
    //         <IntlMessages id="app.common.text.no" />
    //       )}
    //     </Space>
    //   ),
    // },
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
    window.location.reload();
    // setVisible(false);
    // loadMySuppliers(1);
  };
  const showModal = () => {
    setVisible(true);
  };

  const showCreateSupplierModal = () => {
    setUploadSuppliers(false);
    showModal();
  };

  const onDownloadXls = () => {
    downloadSuppliers();
  };

  const onUploadXls = () => {
    setUploadSuppliers(true);
    showModal();
  };

  const handleUpload = files => {
    //const isXlsm = files.file.type === 'application/vnd.ms-excel.sheet.macroEnabled.12';
    if (files.file.name.split('.').pop() !== 'xlsm') {
      setVisible(false);
      setUploadSuppliers(false);
      errorNotification('', 'file.message.fileTypeNotSupported');
      return;
    }
    /*  if (!isXlsm) {
      setVisible(false);
      setUploadSuppliers(false);
      errorNotification('', 'file.message.fileTypeNotSupported');
      return;
    }*/
    const formData = new FormData();
    formData.append('suppliers', files.file);
    uploadSupplierDetails(formData, () => {
      successNotification('file.message.success');
      setVisible(false);
      setUploadSuppliers(false);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    });
  };

  const onCategoryClick = category => {
    setShowTable(true);
    setSelectedCategory(category);
    // loadMySuppliers(1);
  };

  const handleCategoryBreadcrumbClick = () => {
    setShowTable(false);
    setSelectedCategory(null);
  };

  useEffect(() => {
    if (selectedCategory && selectedCategory.id) {
      loadMySuppliers(1);
    }
  }, [selectedCategory]);

  return (
    <>
      <div className="gx-mb-4">
        <Breadcrumb>
          {selectedCategory && (
            <Breadcrumb.Item>
              <span onClick={handleCategoryBreadcrumbClick} className="gx-link">
                <IntlMessages id="app.supplierregistration.field.business_categories" />
              </span>
            </Breadcrumb.Item>
          )}
          {selectedCategory && selectedCategory.name ? (
            <Breadcrumb.Item>
              <span>{selectedCategory.name}</span>
            </Breadcrumb.Item>
          ) : null}
        </Breadcrumb>
      </div>
      <Card className="gx-card gx-card-widget">
        <div className="ant-card-head gx-pt-0">
          <div className="ant-card-head-wrapper">
            <div className="ant-card-head-title gx-text-left">
              <h4 className="gx-card-bordered-title">
                <i className="icon icon-product-list gx-mr-3" />
                <IntlMessages id="sidebar.suppliers.mySuppliers" />
                {selectedCategory && selectedCategory.name
                  ? ` - ${intl.formatMessage({
                      id: 'app.supplierregistration.field.business_categories',
                    })}: ${selectedCategory.name}`
                  : null}
              </h4>
            </div>
          </div>
        </div>
        <div align="end" style={{ textAlign: 'right' }}>
          <Link href="/ProveedoresCargaMassiva.xlsm">
            <a>
              <Button type="secondary" className="gx-mr-3">
                <FileExcelOutlined className="gx-mr-2" />
                <IntlMessages id="app.common.text.downloadTemplate" />
              </Button>
            </a>
          </Link>
          <Tooltip title={<IntlMessages id="app.common.tooltip.uploadxls" />}>
            <Button type="primary" onClick={onUploadXls}>
              <CloudUploadOutlined className="gx-mr-2" />
              <IntlMessages id="app.common.text.upload" />
              Xlsm
            </Button>
          </Tooltip>
          <Button type="primary" onClick={onDownloadXls}>
            <CloudDownloadOutlined className="gx-mr-2" />
            <IntlMessages id="app.common.text.download" />
            Xlsx
          </Button>
          <Button type="primary" onClick={showCreateSupplierModal}>
            <UserAddOutlined className="gx-mr-2" />
            <IntlMessages id="app.quotation.addsupplier" />
          </Button>
        </div>
        {!showTable ? (
          <div className="gx-mt-2">
            <SupplierCategories categories={supplierCategories} onClick={onCategoryClick} />
          </div>
        ) : (
          <CustomScrollbars className="my-suppliers-table" sid="mySuppliersScrollableWrapper">
            <div className="gx-p-2">
              <Table
                loading={loading}
                columns={suppliersColumns}
                dataSource={suppliersList}
                rowKey="id"
                pagination={{
                  showSizeChanger: false,
                  pageSize: 20,
                  total: totalPages,
                  onChange: loadMySuppliers,
                }}
              />
            </div>
          </CustomScrollbars>
        )}
      </Card>
      <Modal
        title={
          <IntlMessages
            id={
              uploadSuppliers
                ? 'app.common.text.uploadSuppliers'
                : 'app.supplierregistration.page_title'
            }
          />
        }
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        bodyStyle={{ padding: '0' }}
        okButtonProps={{ style: { display: 'none' } }}
        destroyOnClose={true}
        width={uploadSuppliers ? 500 : 1000}
        maskClosable={false}
      >
        {uploadSuppliers ? (
          <div className="gx-p-2">
            <Dragger
              {...props}
              multiple={false}
              accept={['application/vnd.ms-excel.sheet.macroEnabled.12']}
              customRequest={handleUpload}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Haga clic o arrastre el archivo a esta área para cargarlo
              </p>
              <p className="ant-upload-hint">Sólo se admiten los tipos de archivo .xlsm</p>
            </Dragger>
          </div>
        ) : (
          <SupplierRegistrationPage
            isBannerShown={false}
            showLoginLink={false}
            isBuyer={true}
            isAuthenticated={true}
            onAletSuccess={reloadSuppliers}
          />
        )}
      </Modal>
      <Modal
        title={<IntlMessages id="app.common.text.supplierDetails" />}
        centered
        visible={isSupplierModalVisible}
        onCancel={hideSupplierModal}
        bodyStyle={{ padding: '0' }}
        footer={false}
        destroyOnClose={true}
        width={1000}
        maskClosable={false}
      >
        <div className="gx-main-content-wrapper">
          {supplierDetails ? (
            <SupplierDetails
              supplierDetails={supplierDetails}
              categoriesList={supplierCategories}
            />
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
