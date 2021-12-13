import React, { Component, createRef } from 'react'
import { connect } from 'react-redux'
import cols from '../ColNames/Supplies/colNames'
import { persistConfig } from '../reducers/rootReducer'
import { Col, Row } from 'antd';
import Filter from '../Filter/supplies'
import FilterPage from '../components/FilterPage';
import './Page.css'
import ResponsiveTable from '../components/ResponsiveTable';


class GridExampleContainer extends Component {
    contextRef = createRef()

    constructor(props) {
        super(props)
        this.state = {
            cols: cols
        }
    }



    render() {
        return (
            <Row className={'table_holder_section'}>
                <Row className='filter_table_wrapper_row doc'>
                    <FilterPage from='supplyreturns'  filter={Filter} />
                    <ResponsiveTable cols={cols} columns={cols.filter(c => c.hidden == false)} redirectTo={'editSupplyReturn'} from={'supplyreturns'} editPage={'editSupplyReturn'} foredit={'supplyreturns'} />
                </Row>
            </Row>

        )
    }
}
const mapStateToProps = (state) => ({
    state
})
export default connect(mapStateToProps)(GridExampleContainer)
