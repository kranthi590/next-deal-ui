import React from 'react';
import { Upload, Modal, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Cookies } from 'react-cookie';
import IntlMessages from '../../../util/IntlMessages';

const cookie = new Cookies();

const acceptedTypes = [
  '.doc',
  '.docx',
  'application / msword',
  'application / vnd.openxmlformats - officedocument.wordprocessingml.document',
  'image/*',
  '.pdf',
  '.csv',
  'application/vnd.ms-excel',
  'text/plain',
  '.xlsx',
  '.xls',
];

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [],
    mimeType: '',
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
      mimeType: file.type,
    });
  };

  getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  handleChange = ({ fileList }) => {
    fileList.forEach(file => {
      if (!file.url && file.response) {
        file.url = `${file.response.data[0].fileUrl}?token=${cookie.get('token')}`;
      } else if (!file.url && file.originFileObj) {
        file.url = window.URL.createObjectURL(file.originFileObj);
      }
    });
    this.setState({ fileList });
    this.props.customSubmitHandler && this.props.customSubmitHandler({ fileList });
  };

  handleDelete = file => {
    const { confirm } = Modal;
    return new Promise((resolve, reject) => {
      confirm({
        title: '¿Está seguro de que quiere eliminar el archivo?', //<IntlMessages id="app.common.confirmDeleteFile" />,
        onOk: () => {
          resolve(true);
        },
        onCancel: () => {
          reject(true);
        },
      });
    });
  };
  componentDidMount() {
    this.setState({
      fileList: this.props.files.map((file, index) => {
        return {
          uid: index,
          name: file.name,
          status: file.status || 'done',
          url: file.fileUrl,
          type: file.mimeType,
        };
      }),
    });
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle, mimeType } = this.state;
    const {
      context,
      maxCount,
      customSubmitHandler,
      hideButton = false,
      accept = [],
      tooltiptext,
      allowDelete,
      handleCustomDelete,
    } = this.props;
    const uploadButton = (
      <div className="gx-d-flex gx-flex-column gx-h-100 gx-w-100 gx-justify-content-center">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>
          <IntlMessages id="file.manager.upload" />
        </div>
      </div>
    );
    let modelBody = (
      <a className="ant-btn ant-btn-primary gx-mt-2" href={previewImage} target="_blank" download>
        <IntlMessages id="file.manager.download" />
      </a>
    );
    if (mimeType === 'application/pdf') {
      modelBody = (
        <object data={`${previewImage}`} type="application/pdf" width="678" height="678">
          <iframe src={`${previewImage}`} width="678" height="678">
            <p>
              <IntlMessages id="file.manager.browser.error.pdf" />
            </p>
          </iframe>
        </object>
      );
    }
    if (mimeType.includes('image')) {
      modelBody = (
        <>
          <img
            alt="example"
            style={{
              display: 'block',
              maxWidth: 650,
              maxHeight: 400,
              width: 'auto',
              height: 'auto',
            }}
            src={previewImage}
          />
          {modelBody}
        </>
      );
    }
    const actionUrl = customSubmitHandler
      ? undefined
      : `${process.env.NEXT_PUBLIC_API_HOST}api/v1/secureFiles?token=${cookie.get('token')}`;
    return (
      <>
        <Upload
          action={actionUrl}
          listType="picture-card"
          fileList={fileList}
          data={context}
          multiple={true}
          openFileDialogOnClick={true}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          showUploadList={{
            showRemoveIcon: allowDelete ? true : false,
          }}
          beforeUpload={() => !customSubmitHandler}
          maxCount={maxCount}
          disabled={(maxCount && fileList.length > maxCount) || hideButton}
          accept={accept.length > 0 ? accept.join(',') : acceptedTypes.join(',')}
          onRemove={handleCustomDelete || this.handleDelete}
        >
          <Tooltip title={tooltiptext}>{!hideButton && uploadButton}</Tooltip>
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
          width={720}
        >
          {modelBody}
        </Modal>
      </>
    );
  }
}
