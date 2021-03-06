import React, { useState, useEffect } from 'react';
import { List, message, Avatar, Skeleton, Divider, Checkbox, Drawer, Space } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { findDOMNode } from 'react-dom'
import { API_BASE } from '../config/env'
import PriceChangeMobile from './PriceChangeMobile';
import axios from 'axios';
import { connect } from 'react-redux'

const CheckboxGroup = Checkbox.Group;
const getProductsFilter = {}
getProductsFilter.token = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).Token : ''
getProductsFilter.pg = 0
export const ProductListForMobile = (props) => {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [dataCount, setDataCount] = useState(0);
    const [page, setPage] = useState(0);
    const [checked, setCheck] = useState(false)
    const [checkedList, setCheckedList] = useState([]);
    const [mobilePrice, showMobileDrawer] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState([]);

    const loadMoreData = () => {
        if (loading) {
            return;
        }
        getProductsFilter.pg = page
        var nextPg = page + 1
        setPage(nextPg)
        setLoading(true);
        axios.post(`${API_BASE}/products/get.php`, getProductsFilter)
            .then(res => res.data.Body)
            .then(body => {
                setData([...data, ...body.List]);
                setLoading(false);
                setPageCount(Math.ceil(body.Count / body.Limit))
                setDataCount(body.Count)
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        setData([])
        loadMoreData();
    }, []);


    const closePrice = () => {
        showMobileDrawer(false)
    }

    const handleListItem = (event, item) => {
        if (event.currentTarget.lastChild.firstElementChild.classList.contains('ant-checkbox-wrapper-checked')) {
            const valueToRemove = item.Id
            const filteredItems = checkedList.filter(item => item.Id !== valueToRemove)
            setSelectedProduct(item)
            showMobileDrawer(true)


        }
        else {
            // setCheckedList([...checkedList, item]);
            showMobileDrawer(true)
            setSelectedProduct(item)

        }
    }


    const notPageReload = (e) => {
        e.preventDefault()
    }

    const onChange = (event, item) => {

        if (event.target.checked) {
            setCheckedList([...checkedList, item]);
            showMobileDrawer(true)
            setSelectedProduct(item)


        }
        else {
            const valueToRemove = item.Id
            const filteredItems = checkedList.filter(item => item.Id !== valueToRemove)
            // setCheckedList(filteredItems);
        }

    };
    return (
        <>
            <div
                id="scrollableDiv"
                style={{
                    height: 400,
                    overflow: 'auto',
                    padding: '0 16px',
                    border: '1px solid rgba(140, 140, 140, 0.35)',
                }}
            >
                <InfiniteScroll
                    dataLength={data.length}
                    next={loadMoreData}
                    hasMore={data.length < dataCount}
                    loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                    endMessage={data.length != 0 ? <Divider plain>Siyah??da m??hsul yoxdur...</Divider> : ''}
                    scrollableTarget="scrollableDiv"
                >
                    <List
                        dataSource={data}
                        locale={{ emptyText: <Skeleton avatar paragraph={{ rows: 1 }} active /> }}
                        renderItem={item => (
                            <List.Item onClick={(event) => handleListItem(event, item)} key={item.Id}>
                                <List.Item.Meta
                                    avatar={<Avatar src={`/images/packgrey.png`} />}
                                    title={<a onClick={notPageReload} href="#">{item.Name}</a>}
                                    description={<p className='mobile_barcode_stock_wrapper'><span>{item.BarCode} </span> <span style={{ color: item.StockBalance > 0 || item.StockBalance == null ? 'rgba(0, 0, 0, 0.45)' : 'red' }}>{item.StockBalance ? item.StockBalance : 0} ??d</span></p>}
                                />
                                <div><Checkbox key={item.Id} checked={props.selectedrowsid ? props.selectedrowsid.find(c => c === item.BarCode) ? true : false : false} onChange={(event) => onChange(event, item)}></Checkbox></div>
                            </List.Item>
                        )}
                    />
                </InfiniteScroll>
            </div>
            <PriceChangeMobile from={props.from} showDrawer={mobilePrice} currentProduct={selectedProduct} onClose={closePrice} />
        </>
    )
}

const mapStateToProps = (state) => ({
    state,
    selectedrows: state.stateChanges.selectedRows,
    selectedrowsid: state.stateChanges.selectedRowsId
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ProductListForMobile)
