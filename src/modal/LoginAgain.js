import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal, Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, Redirect } from 'react-router-dom';
import { API_LOGIN } from '../config/env';
import { updateSessionError } from '../actions/getData-action';
import axios from 'axios';
import './loginrepeat.css'
import {
    WarningOutlined
} from '@ant-design/icons';
import Login from '../pages/Login'

export class LoginAgain extends Component {
    state = {
        loading: false,
        visible: this.props.state.datas.sessionWarning,
    };
    async repeatToken(object) {
        const res = await axios.post(`${API_LOGIN}/send.php`, object);
        return await res;
    }


    handleOk = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false });
            this.props.updateSessionError(false)
            window.location.reload()
        }, 3000);

    }

    render() {
        const { visible, loading } = this.state;
        return (
            <div className=''>
                <Modal
                    visible={this.props.state.datas.sessionWarning}
                    title={<p className='warning_info'>{<WarningOutlined />} Xəbərdarlıq!</p>}
                    className='repeatLoginModal'
                    onOk={this.handleOk}
                    closable={false}
                    footer={[

                        <Button key="submit" type="primary" danger loading={loading} onClick={this.handleOk}>
                            Ok
                        </Button>

                    ]}
                >
                    <div>

                        Sessiyaniz bitmişdir !
                    </div>
                </Modal>
            </div>

        )
    }
}

const mapStateToProps = (state) => ({
    state
})

const mapDispatchToProps = {
    updateSessionError
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginAgain)
