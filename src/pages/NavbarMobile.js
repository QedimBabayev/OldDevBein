import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'
import { AiOutlineDashboard, AiOutlineShop } from 'react-icons/ai';
import { RiShoppingBag3Line } from 'react-icons/ri'
import { MdAddShoppingCart } from 'react-icons/md'
import { HiOutlineShoppingCart } from 'react-icons/hi'
import { IoAnalytics } from 'react-icons/io5';
import { FiUsers } from 'react-icons/fi'
import { GiReceiveMoney } from 'react-icons/gi'
import { updateUpperheader } from '../actions/getNavbar-action'
import { updateButton } from '../actions/getButtons-action'
import { updateChangePage } from '../actions/getData-action'
import { exitModal } from '../actions/updateStates-action';
import { updateSearchInput } from '../actions/getData-action';
import { changeSubMenu } from '../actions/getNavbar-action';
import { Drawer, Button, Radio, Space } from 'antd';
import { Menu, List } from 'antd'
import {
    MenuOutlined,
    CloseOutlined
} from '@ant-design/icons'
const { SubMenu } = Menu;



export const NavbarMobile = (props) => {
    const rootSubmenuKeys = props.rootSubmenuKeys;
    console.log('rootsubmenukeys', props.rootSubmenuKeys)
    const onClose = (e, name, id, from) => {
        if (props.state.stateChanges.changed) {
            props.exitModal(true, from, name)

        }
        else {
            props.exitModal(false)
            props.changeSubMenu('')
            props.updateUpperheader(name, from)
            props.updateButton(name)
            props.updateSearchInput('')
            props.state.datas.changePage == false ? console.log('changepage falsedi') : props.updateChangePage(true)
        }
        props.onClose()
    };
    const [openKeys, setOpenKeys] = React.useState([]);

    const onOpenChange = keys => {
        const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };
    return (
        <Menu
            style={{ width: 256 }}
            onOpenChange={onOpenChange}
            openKeys={openKeys}
            mode="inline"
        >
            {
                Array.isArray(props.state.navbar.navbar) ?
                    props.state.navbar.navbar.filter(d => d.ParentId === '0').map(m =>
                        <SubMenu key={m.Id}
                            parent_id={m.Id}
                            icon={m.Icon.includes('supply') ? <MdAddShoppingCart /> :
                                m.Icon.includes('demand') ? <HiOutlineShoppingCart /> :
                                    m.Icon.includes('dashboard') ? <AiOutlineDashboard /> :
                                        m.Icon.includes('products') ? <RiShoppingBag3Line /> :
                                            m.Icon.includes('customers') ? <FiUsers /> :
                                                m.Icon.includes('finance') ? <GiReceiveMoney /> :
                                                    m.Icon.includes('retail') ? <AiOutlineShop /> :
                                                        m.Icon.includes('reports') ? <IoAnalytics /> : ''} title={m.Name}>

                            {
                                props.state.navbar.navbar.filter(s => s.ParentId === m.Id).map(sub =>
                                    <Menu.Item key={sub.Id}>
                                        <Link from={sub.Url} name={sub.Name} onClick={(e) => onClose(e, sub.Name, sub.Id, sub.Url)} to={`/${sub.Url}`}>
                                            <span className="nav-text">{sub.Name}</span>
                                        </Link>
                                    </Menu.Item>
                                )
                            }
                        </SubMenu>
                    )
                    : ''
            }

        </Menu>
    )
}

const mapStateToProps = (state) => ({
    state
})

const mapDispatchToProps = {
    updateUpperheader, updateButton, updateChangePage, updateSearchInput, exitModal, changeSubMenu
}

export default connect(mapStateToProps, mapDispatchToProps)(NavbarMobile)
