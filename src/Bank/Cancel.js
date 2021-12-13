import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Result, Button} from 'antd';

export class Cancel extends Component {
  render () {
    return (
      <div>
        <Result
          status="500"
          title="500"
          subTitle="Sorry, something went wrong."
          extra={<Button type="primary">Back Home</Button>}
        />
        

      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect (mapStateToProps, mapDispatchToProps) (Cancel);
