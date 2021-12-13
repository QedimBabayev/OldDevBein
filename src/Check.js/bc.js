import React, { Component } from "react";
import { getCheckPage } from "../actions/check/check-action";
import { connect } from "react-redux";
import { Divider } from "antd";
import { fetchCheck } from "../actions/getData-action";
import { Spin, Alert } from "antd";
import { docFilter } from "../config/filter";
import moment from "moment";
import { getCustomersData } from "../actions/getCustomerGroups-action";
import { fetchProfile } from "../actions/getProfile-action";
import { API_BASE } from "../config/env";
import BootstrapTable from "react-bootstrap-table-next";
import fourtwofirst from "./bcTemplates/4x2_1";
import fourtwosecond from "./bcTemplates/4x2_2";
import threetwofirst from "./bcTemplates/3x2_1";
import threetwosecond from "./bcTemplates/3x2_2";
import threetwothird from "./bcTemplates/3x2_3";
import sixtwofirst from "./bcTemplates/6x4_1";
import {
  ConvertFixedPosition,
  ConvertFixedBarcode,
} from "../Function/convertNumberDecimal";
import "./check.css";
import { getToken } from "../config/token";
var customPositions = [];
var getfilter = {};

class bc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      print: false,
    };
  }
  componentDidMount() {
    this.props.getCheckPage(true);
    setTimeout(() => {
      this.setState({ print: true });
    }, 300);
  }

  static getDerivedStateFromProps(props, state) {
    if (state.print) {
        window.print();
      return {
        print: false,
      };
    }
    return null; // No change to state
  }

  render() {
    var mainStyle;
    var imgStyle;
    var nameStyle;
    var priceStyle;

    switch (localStorage.getItem("tempdesign")) {
      case "4x2_1.css":
        mainStyle = fourtwofirst.main;
        imgStyle = fourtwofirst.img;
        nameStyle = fourtwofirst.name;
        priceStyle = fourtwofirst.price;
        break;
      case "4x2_2.css":
        mainStyle = fourtwosecond.main;
        imgStyle = fourtwosecond.img;
        nameStyle = fourtwosecond.name;
        priceStyle = fourtwosecond.price;
        break;
      case "3x2_1.css":
        mainStyle = threetwofirst.main;
        imgStyle = threetwofirst.img;
        nameStyle = threetwofirst.name;
        priceStyle = threetwofirst.price;
        break;
      case "3x2_2.css":
        mainStyle = threetwosecond.main;
        imgStyle = threetwosecond.img;
        nameStyle = threetwosecond.name;
        priceStyle = threetwosecond.price;
        break;

      case "3x2_3.css":
        mainStyle = threetwothird.main;
        imgStyle = threetwothird.img;
        nameStyle = threetwothird.name;
        priceStyle = threetwothird.price;
        break;

      case "6x4_1.css":
        mainStyle = sixtwofirst.main;
        imgStyle = sixtwofirst.img;
        nameStyle = sixtwofirst.name;
        priceStyle = sixtwofirst.price;
        break;
      default:
        break;
    }

    return (
      <div className="main" style={mainStyle}>
        <img
          style={imgStyle}
          src={`${API_BASE}/products/print.php?bc=${this.props.location.search.substring(
            1
          )}`}
        />
        <div style={{ display: "flex" }}>
          <div className="namepro" style={nameStyle}>
            {new URLSearchParams(this.props.location.search).get("nm")}
          </div>
          <div className="pricepro" style={priceStyle}>
            <p>
              {ConvertFixedBarcode(
                new URLSearchParams(this.props.location.search).get("pr")
              )}
              <sup class="manat">₼</sup>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  state,
});

const mapDispatchToProps = {
  getCheckPage,
  fetchCheck,
  getCustomersData,
  fetchProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(bc);
