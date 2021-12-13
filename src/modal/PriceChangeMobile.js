import React, { Component } from 'react'
import { Drawer, Button, Radio, Space, Input } from 'antd';
import { connect } from 'react-redux'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import FloatLabel from '../components/FloatLabel';
import { ConvertFixedPosition, ConvertFixedTable } from '../Function/convertNumberDecimal';
import { updateMobileList } from '../actions/mobileDrawer/updateMobil-action';
import { updateSelectedRows } from '../actions/updateStates-action';

class PriceChangeMobile extends Component {


    constructor(props) {
        super(props)
        this.state = {
            value: 0,
            defaultValue: 0,
            ownUpdate: false,
            currentitem: [],
            selectedrow: this.props.selectedrows ? this.props.selectedrows : [],
            selectedid: this.props.selectedrowsid ? this.props.selectedrowsid : [],
        }
    }


    static getDerivedStateFromProps(props, state) {
        if (state.ownUpdate) {
            return {
                quantity: state.quantity,
                value: state.value,
                ownUpdate: false
            }
        }
        if (props.currentProduct.Price !== state.value) {

            if (props.from === 'demands' || props.from === 'demandreturns') {
                return {
                    value: props.selectedrows ? props.selectedrows.find(p => p.key === props.currentProduct.Id) ? props.selectedrows.find(p => p.key === props.currentProduct.Id).Price : props.currentProduct.Price : props.currentProduct.Price,
                    defaultValue: props.state.docmodals.mobileLists ? props.state.docmodals.mobileLists.find(p => p.Id === props.currentProduct.Id) ? props.state.docmodals.mobileLists.find(p => p.Id === props.currentProduct.Id).Price : props.currentProduct.Price : props.currentProduct.Price,
                    quantity: props.selectedrows ? props.selectedrows.find(p => p.key === props.currentProduct.Id) ? props.selectedrows.find(p => p.key === props.currentProduct.Id).Quantity : 1 : 1,
                    currentitem: props.currentProduct
                }
            }
            else {
                return {
                    value: props.selectedrows ? props.selectedrows.find(p => p.key === props.currentProduct.Id) ? props.selectedrows.find(p => p.key === props.currentProduct.Id).BuyPrice : props.currentProduct.BuyPrice : props.currentProduct.BuyPrice,
                    defaultValue: props.state.docmodals.mobileLists ? props.state.docmodals.mobileLists.find(p => p.Id === props.currentProduct.Id) ? props.state.docmodals.mobileLists.find(p => p.Id === props.currentProduct.Id).BuyPrice : props.currentProduct.BuyPrice : props.currentProduct.BuyPrice,
                    quantity: props.selectedrows ? props.selectedrows.find(p => p.key === props.currentProduct.Id) ? props.selectedrows.find(p => p.key === props.currentProduct.Id).Quantity : 1 : 1,
                    currentitem: props.currentProduct
                }
            }

        }
        return null
    }

    increase = () => {

        var incresedValue = this.state.quantity + 1
        this.setState({
            quantity: incresedValue,
            ownUpdate: true
        })


    }

    onChange = (e) => {
        this.setState({
            value: e.target.value,
            ownUpdate: true
        })
    }

    onChangeQuantity = (e) => {
        this.setState({
            quantity: e.target.value,
            ownUpdate: true
        })
    }

    decline = () => {

        var declinedValue = this.state.quantity - 1
        this.setState({
            quantity: declinedValue,
            ownUpdate: true
        })


    }
    handleFocus = (event) => event.target.select();
    handleSave = () => {
        const prevData = this.state.currentitem
        prevData.Price = this.state.value
        prevData.Quantity = this.state.quantity
        prevData.TotalPrice = ConvertFixedPosition(parseFloat(this.state.value * this.state.quantity))
        var newData = {
            ArtCode: prevData.ArtCode,
            BarCode: prevData.BarCode,
            BasicPrice: this.state.defaultValue,
            CostPrice: prevData.CostPrice ? prevData.CostPrice : 0,
            CostPriceTotal: prevData.CostPrice ? prevData.CostPrice : 0,
            DefaultQuantity: 1,
            Name: prevData.Name,
            Price: this.state.value,
            BuyPrice: this.state.value,
            ProductId: prevData.Id,
            Quantity: prevData.Quantity,
            SellPrice: this.state.value,
            StockQuantity: prevData.StockBalance,
            IsPack: prevData.IsPack,
            PackPrice: prevData.PackPrice,
            TotalPrice: prevData.TotalPrice,
            key: prevData.Id,
            Id: prevData.Id,
            ProductId: prevData.Id

        }


        this.setState({
            selectedrow: [...this.state.selectedrow, newData],
            selectedid: [...this.state.selectedid, newData.BarCode]
        }, () => {
            this.props.updateSelectedRows(this.state.selectedrow, this.state.selectedid)
            this.props.onClose()
        })
    }
    handleReset = () => {
        const prevData = this.state.currentitem
        this.props.updateMobileList(prevData)
        this.setState({
            value: prevData.Price,
            quantity: 1,
            ownUpdate: true
        })
    }


    render() {
        return (
            <Drawer
                title={this.props.currentProduct.Name}
                placement={'bottom'}
                className='mobile_drawer_price_change'
                closable={true}
                onClose={this.props.onClose}
                visible={this.props.showDrawer}
                key={'bottom'}
            >



                <div className='price_holder'>
                    <FloatLabel label="Qiymət" name="priceField">
                        <Input type='number' onFocus={this.handleFocus} onChange={this.onChange} value={this.state.value} className='hiddenarrows' />
                    </FloatLabel>

                    <FloatLabel label="Məbləğ" name="priceTotalField">
                        <Input type='number' disabled={true} onFocus={this.handleFocus} value={ConvertFixedPosition(parseFloat(this.state.value * this.state.quantity))} className='hiddenarrows totalpricesmobil' />
                    </FloatLabel>
                </div>
                <div className='body_wrapper'>

                    <div className='mobile_price_wrapper'>
                        <Button.Group className='countLabel'>
                            <Button className='changepricebtns minusbtn' onClick={this.decline}><div className='minusButton'></div></Button>
                            <FloatLabel label="Miqdar" name="quantityTotalField">
                                <Input type='number' value={this.state.quantity} onChange={this.onChangeQuantity} className='hiddenarrows showquantity' />
                            </FloatLabel>

                            <Button style={{ position: 'relative' }} className='changepricebtns plusbtn' onClick={this.increase}><div className='plusButton'></div><div className='plusButton direction'></div></Button>
                        </Button.Group>
                    </div>
                    <div className='bottom_btn_holder'>
                        <Button onClick={this.handleSave}>
                            Əlavə et
                        </Button>
                        {/* <Button onClick={this.handleReset}>
                            Cixart
                        </Button> */}
                    </div>
                </div>
            </Drawer>
        )
    }
}

const mapStateToProps = (state) => ({
    state,
    selectedrows: state.stateChanges.selectedRows,
    selectedrowsid: state.stateChanges.selectedRowsId
})

const mapDispatchToProps = {
    updateMobileList, updateSelectedRows
}

export default connect(mapStateToProps, mapDispatchToProps)(PriceChangeMobile)
