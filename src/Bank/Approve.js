import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Result, Button} from 'antd';
import axios from 'axios';
import {API_BASE} from '../config/env';
import {Redirect} from 'react-router';

export class Approve extends Component {
  state = {
    redirect: false,
  };
  async putApprove (object) {
    const res = await axios.post (`${API_BASE}/merch/status.php`, object);
    return await res;
  }
  componentDidMount () {
    var approveFilter = {};
    setTimeout (() => {
      this.putApprove (approveFilter).then(res => this.setState({redirect:true}));
    }, 5000);
  }
  render () {
    if (this.state.redirect) {
      return <Redirect exact to={'/p=dashboard'} />;
    }
    return (
      <div>
        <Result
          status="success"
          title="Successfully Purchased Cloud Server ECS!"
          subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
          extra={[
            <Button type="primary" key="console">
              Go Console
            </Button>,
            <Button key="buy">Buy Again</Button>,
          ]}
        />

      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect (mapStateToProps, mapDispatchToProps) (Approve);
