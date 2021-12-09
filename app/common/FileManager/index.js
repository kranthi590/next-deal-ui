import React from 'react';
import { Upload, Modal, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {Cookies} from "react-cookie";

const cookie = new Cookies();

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
    mimeType: ''
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

  handleChange = ({ fileList }) => this.setState({ fileList });

  componentDidMount() {
    this.setState({
      fileList: this.props.files.map((file, index) => {
        return {
          uid: index,
          name: file.name,
          status: 'done',
          url: file.fileUrl,
          type: file.mimeType,
        }
      }),
    });
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle, mimeType } = this.state;
    const { context } = this.props;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    let modelBody = (<a className="ant-btn ant-btn-primary gx-mt-2" href={previewImage}
      target="_blank" download>View in new tab</a>);
    if (mimeType === 'application/pdf') {
      modelBody = (
          <object
            data={`${previewImage}`}
            type="application/pdf"
            width="678"
            height="678"
          >
            <iframe
              src={`${previewImage}`}
              width="678"
              height="678"
            >
            <p>This browser does not support PDF!</p>
            </iframe>
          </object>
      );
    }
    if (mimeType.includes("image")) {
      modelBody = (
        <>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
          {modelBody}
        </>
      );
    }
    console.log(fileList);
    return (
      <>
        <Upload
          action={`${process.env.NEXT_PUBLIC_API_HOST}api/v1/secureFiles?token=${cookie.get('token')}`}
          listType="picture-card"
          fileList={fileList}
          data={context}
          multiple={true}
          openFileDialogOnClick={true}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          showUploadList={{
            showRemoveIcon: false
          }}
          // beforeUpload={(file, fileList) => {
          //   this.setState({
          //     fileList: [...fileList, file]
          //   });
          // }}
        >
          {uploadButton}
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
