import React, { Component } from 'react';
import { format } from 'rut.js';
import { Input } from 'antd';

class Rut extends Component {
  onChange = async e => {
    let response = await format(e.target.value);
    if (response === '-') {
      response = '';
    }
    this.props.onChange(response);
  };
  render() {
    return <Input {...this.props} onChange={this.onChange} placeholder="RUT" maxLength={12} />;
  }
}

export default Rut;
