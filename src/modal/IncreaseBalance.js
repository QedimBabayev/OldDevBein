import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {openBalanceModal} from '../actions/updateStates-action';
import {Modal, Button, Form, Input} from 'antd';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import {API_BASE} from '../config/env';
export const IncreaseBalance = props => {
  const [loading, setLoading] = useState (false);
  const [link, setLink] = useState ('');
  const history = useHistory ();

  const increaseBalance = async object => {
    const res = await axios.post (`${API_BASE}/merch/put.php`, object);
    if (res.data.Body.ResponseStatus === '0') {
      window.open (res.data.Body.ResponseService);
    }
  };

  const handleOk = () => {};

  const handleCancel = () => {
    props.closeBalance()
  };

  const onFinish = values => {
    var balanceFilter = {};
    balanceFilter = values;
    balanceFilter.token = JSON.parse (localStorage.getItem ('user'))
      ? JSON.parse (localStorage.getItem ('user')).Token
      : '';
    increaseBalance (balanceFilter);
  };

  return (
    <div>
      <Modal
        visible={props.visible}
        title="Ödəmə"
        className="increasebalance"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Bağla
          </Button>,
          <Button
            htmlType="submit"
            form="balanceForm"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            Artır
          </Button>,
        ]}
      >

        <Form id="balanceForm" onFinish={onFinish}>
          <Form.Item label={'Məbləğ'} name="amount">
            <Input
              type="number"
              step="any"
              className="hiddenarrows"
              addonAfter="₼"
              min={0}
            />
          </Form.Item>

        </Form>

      </Modal>

    </div>
  );
};

const mapStateToProps = state => ({
  state,
});

const mapDispatchToProps = {openBalanceModal};

export default connect (mapStateToProps, mapDispatchToProps) (IncreaseBalance);
