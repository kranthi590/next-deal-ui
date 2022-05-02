import React, { Component } from 'react';
import { Input } from 'antd';
import { numberToClp } from '../../util/util';

class ClpFormatter extends Component {
  onChange = async e => {
    let response = await numberToClp(e.target.value);
    if (response === '-') {
      response = '';
    }
    this.props.onChange(response);
  };
  render() {
    return <Input {...this.props} onChange={this.onChange} placeholder="1.000.000" />;
  }
}

export default ClpFormatter;
