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

export class Connection extends Component {
    render() {
        return (
            <div className=''>
                <Modal
                    visible={this.props.visible}
                    title={<p className='warning_info'>{<WarningOutlined />} Xəbərdarlıq!</p>}
                    className='repeatLoginModal'
                    onOk={this.props.closeConnection}
                    closable={false}
                    footer={[

                        <Button key="submit" type="primary" danger onClick={this.props.closeConnection}>
                            Bağla
                        </Button>

                    ]}
                >
                    <div>
                        Zəhmət olmasa internet bağlantısını yoxlayın !
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

export default connect(mapStateToProps, mapDispatchToProps)(Connection)
