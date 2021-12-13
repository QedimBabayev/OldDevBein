import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tooltip, Drawer, Space, Radio, Button } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';






export class MobileDrawer extends Component {

    state = {
        visible: false,
        matches: window.matchMedia("(min-width: 600px)").matches

    }
    componentDidMount() {

        const handler = e => this.setState({ matches: e.matches });
        window.matchMedia("(min-width: 600px)").addEventListener('change', handler);
    }

    showDrawer = () => {
        this.setState({
            visible: true
        })
    };
    onClose = () => {
        this.setState({
            visible: false
        })
    };

    onChangePageMobile = () => {
        this.setState({
            visible: false
        })
    }

    render() {

        const mobilebuttons = (
            <>

                <Button type="primary" onClick={this.showDrawer} className='mobilebutton menu' shape="circle" icon={<PlusOutlined />} />
                <Drawer
                    title={this.props.state.navbar.activeSubItem}
                    placement={'bottom'}
                    className='mobilePageDrawer'
                    onClose={this.onClose}
                    visible={this.state.visible}
                    extra={
                        <Space>
                            <Button onClick={this.onClose}>Cancel</Button>
                            <Button type="primary" onClick={this.onClose}>
                                OK
                            </Button>
                        </Space>
                    }
                >

                    <div className='mobiledocbuttonwrapper'>

                        {
                            this.props.docbuttons
                        }
                        {
                            this.props.printbuttons
                        }
                    </div>
                </Drawer>
            </>


        )
        return (
            !this.state.matches ? mobilebuttons : null
        )
        return (
            <div>

            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    state
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(MobileDrawer)
