import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button, Checkbox, Row, Col } from 'antd';
import TemplateExample from '../components/TemplateExample';
import CascaderBcTemplates from '../components/CascaderBcTemplates';
import { getCheckPage } from '../actions/check/check-action';

class TemplatesPage extends Component {


    render() {


        return (
            <div>
                <Row>
                    <Col xs={24} md={24} xl={16}>
                        <TemplateExample />
                    </Col>
                    <Col xs={24} md={24} xl={8}>
                        <CascaderBcTemplates />
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    state
})

const mapDispatchToProps = {
    getCheckPage
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplatesPage)