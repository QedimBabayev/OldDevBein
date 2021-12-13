import React, { Component, createRef } from 'react'
import ProductFolder from './ProductFolder'
import cols from '../ColNames/Products/colNames'
import { Col, Row } from 'antd';
import filter from '../Filter/products'
import FilterPage from '../components/FilterPage';
import './Page.css'
import { connect } from 'react-redux'
import ResponsiveTable from '../components/ResponsiveTable';
import LoaderHOC from '../components/LoaderHOC';

import {
    CaretDownOutlined,
    CaretUpOutlined,
} from '@ant-design/icons';
var attributesNamesArray = []
var attributesNameFilterArray = []

class GridExampleContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cols: cols,
            attributes: this.props.attributes,
            showgroups: false,
            reloadPro:false
        }
    }


    componentWillReceiveProps(nextProps) {


        if (nextProps.state.handleProduct.reload != this.props.state.handleProduct.reload) {
            this.setState({
                reloadPro:true
            })
         }

        if (nextProps.attributes != this.props.attributes) {
            attributesNamesArray = []
            attributesNameFilterArray = []
            if (Array.isArray(nextProps.attributes)) {
                Object.values(nextProps.attributes).map(c => {
                    attributesNamesArray.push({
                        dataField: c.Name,
                        text: c.Title,
                        sort: true,
                        hidden: this.props.state.colsUpdate.updatedProductCols.find(col => col.dataField === c.Name) ? false : true
                    })
                })
                Object.values(nextProps.attributes).map(c => {
                    attributesNameFilterArray.push({
                        key: c.ReferenceTypeId,
                        label: c.Title,
                        name: c.ValueType === 'string' ? 'colt--' + c.Name : '',
                        type: c.ReferenceTypeId ? 'selectMod' : 'text',
                        controller: c.ReferenceTypeId ? 'selectMod' : '',
                        hidden: true
                    })
                })
            }
            this.setState({
                attributes: attributesNamesArray
            })
        }
    }

    showGroups = () => {
        this.setState({
            showgroups: !this.state.showgroups
        })
    }
    render() {
        return (
            <Row className={'table_holder_section'}>
                <p onClick={this.showGroups} className='show_groups' >Qrupları görsət   {this.state.showgroups ? <CaretUpOutlined /> : <CaretDownOutlined />}</p>
                <div className={`groups_holder_for_mobile ${this.state.showgroups ? `show` : ``}`}>
                    <ProductFolder from={'products'} groups={this.props.groups} />
                </div>

                <Row className='filter_table_wrapper_row'>
                    <FilterPage reload={this.state.reloadPro} from='products' default={'GroupName'} filter={filter.concat(attributesNameFilterArray)} />
                    <ResponsiveTable cols={cols} attributes={attributesNamesArray} initialcols={cols.concat(attributesNamesArray)} columns={cols.concat(attributesNamesArray).filter(c => c.hidden == false)} redirectTo={'editProduct'} from={'products'} editPage={'editProduct'} foredit={'products'} />
                </Row>

            </Row>
        )
    }
}
const mapStateToProps = (state) => ({
    state
})
export default connect(mapStateToProps)(GridExampleContainer)
