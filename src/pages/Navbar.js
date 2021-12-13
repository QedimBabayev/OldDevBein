import React, { Component } from "react";
import { connect } from "react-redux";
import getNavbar from "../actions/getNavbar-action";
import { Segment } from "semantic-ui-react";
import SubmenuList from "./SubmenuList";
import HeaderList from "./HeaderList";
import "semantic-ui-css/semantic.min.css";
import "./header.css";
import getSetting from "../actions/getSettings";
import img_brand from "../images/brand.png";
import { getNotification } from "../actions/notification/notification-action";
import { getSpendItems } from "../actions/getSpendItems-action";
import { Redirect, Link } from "react-router-dom";
import { fetchProfile } from "../actions/getProfile-action";
import { getOwners } from "../actions/getGroups-action";
import { Drawer, Button, Radio, Space } from "antd";
import { updateUpperheader } from "../actions/getNavbar-action";
import { updateButton } from "../actions/getButtons-action";
import { updateChangePage } from "../actions/getData-action";
import { exitModal } from "../actions/updateStates-action";
import { updateSearchInput } from "../actions/getData-action";
import { changeSubMenu } from "../actions/getNavbar-action";
import DropdownLogin from "../components/DropdownLogin";
import NavbarMobile from "./NavbarMobile";
import { Menu, List } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { AiOutlineDashboard, AiOutlineShop } from "react-icons/ai";
import { RiShoppingBag3Line } from "react-icons/ri";
import { MdAddShoppingCart } from "react-icons/md";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { IoAnalytics } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { GiReceiveMoney } from "react-icons/gi";
import moment from "moment";
import { docFilter } from "../config/filter";
import { fetchAttributes } from "../actions/getAttributes-action";
import { init, socket } from "../socketApi";
import axios from "axios";
import { API_BASE } from "../config/env";

var md5 = require("md5");
var menukeys = [];
var rootSubmenuKeys = [];
const { SubMenu } = Menu;

function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
class Navbar extends Component {
  state = {
    visible: false,
    placement: "left",
    balance: 0,
    openKeys: [],
    token: "",
    mes: null,
    connection: false,
  };

  async getNotification() {
    const res = await axios.post(`${API_BASE}/notifications/get.php`, {
      token: JSON.parse(localStorage.getItem("user"))
        ? JSON.parse(localStorage.getItem("user")).Token
        : "",
    });
    return await res;
  }
  componentDidMount() {
    console.log("navbardirmountoldu");
    this.props.fetchAttributes("attributes", "product");
    this.getNotification().then((res) =>
      localStorage.setItem("balance", res.data.Body.AccountBalance)
    );
    init();
    socket.on("notification", (data) => {
      if (data) {
        alert(data)
        this.setState({
          connection: true,
        });

        // this.props.getNotification();
      }
    });
    rootSubmenuKeys = [];
    if (this.props.state.settings.getsetting) {
      this.props.getSetting(
        md5(JSON.stringify(this.props.state.settings.getsetting))
      );
    } else {
      this.props.getSetting("1");
    }
  }
  handleItemClick = (e, { name, parent_id }) => {
    console.log("activeid", parent_id);
    console.log("activeid", e);
  };
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  static getDerivedStateFromProps(props, state) {
    if (props.token != state.token) {
      var filter = {};
      filter.token = props.token;
      props.getNavbar(filter);
      props.fetchProfile("company", filter);
      props.getNotification(filter);
      return {
        token: props.token,
      };
    }
    if (props.balance !== state.balance) {
      return {
        balance: props.balance,
      };
    }
    
    return null;
  }

  handleClick = (e) => {
    console.log("click ", e);
  };

  render() {
    rootSubmenuKeys = [];
    if (Array.isArray(this.props.state.navbar.navbar)) {
      this.props.state.navbar.navbar
        .filter((d) => d.ParentId === "0")
        .map((s) => rootSubmenuKeys.push(s.Id));
    }
    const { placement, visible, activeItem } = this.state;
    const menuitems = Array.isArray(this.props.state.navbar.navbar)
      ? this.props.state.navbar.navbar
          .filter((d) => d.ParentId === this.state.activeId)
          .map((m) => <Menu.Item key={m.Id}>{m.Name}</Menu.Item>)
      : "";

    return (
      <>
        <div
          className={"my_header com_navbar"}
          style={{
            display:
              this.props.state.checkPage.show ||
              this.props.state.checkPage.loginPage
                ? "none"
                : "initial",
          }}
        >
          <HeaderList
            menus={this.props.state.navbar.navbar}
            activeItem={this.props.state.navbar.activeItem}
          />
          <Segment
            style={{
              display:
                this.props.state.navbar.activeItem === "" ? "none" : "flex",
            }}
          >
            <SubmenuList
              submenu={this.props.state.navbar}
              activeItem={this.props.state.navbar.activeSubItem}
              activeFrom={this.props.state.navbar.activeFrom}
            />
          </Segment>
        </div>

        <div className={"my_header mobile_navbar"}>
          <div className="mobile_list" itemLayout="horizontal">
            <div className="left_side_mobile">
              <p onClick={this.showDrawer}>
                <MenuOutlined />
              </p>
              <p>
                <img style={{ width: "25px" }} src={img_brand} />
              </p>
            </div>
            <div className="left_side_mobile">
              <p onClick={this.showDrawer}>
                {" "}
                <img
                  className="small_logo_pics custom_width"
                  src={`/images/help.png`}
                />
              </p>
              <p onClick={this.showDrawer}>
                {" "}
                <img
                  className="small_logo_pics custom_width"
                  src={`/images/notification.png`}
                />
              </p>

              <DropdownLogin
                from="mobile"
                balance={this.state.balance}
                user={
                  JSON.parse(localStorage.getItem("user"))
                    ? JSON.parse(localStorage.getItem("user")).Login
                    : null
                }
              />
            </div>
          </div>

          <Drawer
            title={
              <div className="mobile_drawer_title_wrapper">
                {" "}
                <p className="mobile_navbar_title_info">
                  <span className="name_navbar_title">
                    {JSON.parse(localStorage.getItem("user"))
                      ? JSON.parse(localStorage.getItem("user")).Login
                      : null}
                  </span>
                  <span>{this.props.state.notifications.AccountBalance} ₼</span>
                </p>
                <p onClick={this.onClose} style={{ cursor: "pointer" }}>
                  <CloseOutlined />
                </p>
              </div>
            }
            placement={placement}
            closable={false}
            onClose={this.onClose}
            visible={visible}
            key={placement}
            className="mobile_drawer"
          >
            <NavbarMobile
              onClose={this.onClose}
              rootSubmenuKeys={rootSubmenuKeys}
            />
          </Drawer>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    state,
  };
};

const mapDispatchToProps = {
  getNavbar,
  getSetting,
  getOwners,
  getSpendItems,
  getNotification,
  fetchProfile,
  updateUpperheader,
  updateButton,
  updateChangePage,
  updateSearchInput,
  exitModal,
  changeSubMenu,
  fetchAttributes,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
