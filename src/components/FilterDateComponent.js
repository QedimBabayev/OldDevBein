import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Icon } from "semantic-ui-react";
import Trans from "../usetranslation/Trans";
import { Col, Row, Tag } from "antd";
import {
  fetchDataFast,
  fetchData,
  fetchProfit,
} from "../actions/getData-action";
import "./Tag.css";
import { updateFilter, clearFilter } from "../actions/updateStates-action";
import moment from "moment";
import "moment/locale/az";
import { docFilter } from "../config/filter";
import { BsDot } from "react-icons/bs";
moment.locale("az");

      var newFilter = {};
        newFilter.momb = moment().startOf("day").format("YYYY-MM-DD HH:mm:ss");
        newFilter.mome = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");
       sessionStorage.setItem('filterdate', JSON.stringify(newFilter))
       sessionStorage.setItem('date', 'today')

export const FilterDateComponent = (props) => {
  const [active, setActive] = useState(
    props.from === "salereports" ||
      props.from === "sales" ||
      props.from === "returns"
      ? sessionStorage.getItem('date')
      : props.from === "profit" ||
        props.from === "cashins" ||
        props.from === "cashouts"
      ? "thisMonth"
      : ""
  );
  useEffect(() => {
    if (props.defaultSorted) {
      setActive(sessionStorage.getItem('date'));
      if (
        props.from === "salereports" ||
        props.from === "sales" ||
        props.from === "returns"
      ) {
        
        Object.assign(docFilter, JSON.parse(sessionStorage.getItem('filterdate')));
      } else {
        delete docFilter["momb"];
        delete docFilter["mome"];
      }
    } else {
      setActive("");
    }
    props.clearFilter(false);
  }, [props.state.stateChanges.clearFilter]);
  const getThisDay = () => {
    var newFilter = {};
    newFilter.momb = moment().startOf("day").format("YYYY-MM-DD HH:mm:ss");
    newFilter.mome = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");
    docFilter.pg = 0
    Object.assign(docFilter, newFilter);

    if (props.from === "profit") {
      props.fetchProfit(props.from, docFilter);
    } else {
      sessionStorage.setItem('filterdate', JSON.stringify(newFilter))
       sessionStorage.setItem('date', 'today')

      props.fetchData(props.from, docFilter);
    }
    setActive("today");
  };
  const getYesterday = () => {
    var newFilter = {};
    newFilter.momb = moment()
      .subtract(1, "day")
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    newFilter.mome = moment()
      .subtract(1, "day")
      .endOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    docFilter.pg = 0
    Object.assign(docFilter, newFilter);

    if (props.from === "profit") {
      props.fetchProfit(props.from, docFilter);
    } else {
           sessionStorage.setItem('filterdate', JSON.stringify(newFilter))
       sessionStorage.setItem('date', 'yesterday')

      props.fetchData(props.from, docFilter);
    }
    setActive("yesterday");
  };
  const getThisMonth = () => {
    var newFilter = {};
    newFilter.momb = moment().startOf("month").format("YYYY-MM-DD HH:mm:ss");
    newFilter.mome = moment().endOf("month").format("YYYY-MM-DD HH:mm:ss");
    docFilter.pg = 0

    Object.assign(docFilter, newFilter);

    if (props.from === "profit") {
      props.fetchProfit(props.from, docFilter);
    } else {
      sessionStorage.setItem('filterdate', JSON.stringify(newFilter))
       sessionStorage.setItem('date', 'thisMonth')

      props.fetchData(props.from, docFilter);
    }
    setActive("thisMonth");
  };
  const getLastMonth = () => {
    var newFilter = {};
    newFilter.momb = moment()
      .subtract(1, "month")
      .startOf("month")
      .format("YYYY-MM-DD HH:mm:ss");
    newFilter.mome = moment()
      .subtract(1, "month")
      .endOf("month")
      .format("YYYY-MM-DD HH:mm:ss");
    docFilter.pg = 0
    Object.assign(docFilter, newFilter);

    if (props.from === "profit") {
      props.fetchProfit(props.from, docFilter);
    } else {
        sessionStorage.setItem('filterdate', JSON.stringify(newFilter))
       sessionStorage.setItem('date', 'lastMonth')

      props.fetchData(props.from, docFilter);
    }
    setActive("lastMonth");
  };
  return (
    <div style={{ marginLeft: "50px" }} className="buttons_center">
      <Tag
        className={`tag_renders_date today ${
          active === "today" ? "active" : ""
        }`}
        onClick={getThisDay}
        color="blue"
      >
        <Trans word={"today"} />
      </Tag>

      <BsDot />
      <Tag
        className={`tag_renders_date yesterday ${
          active === "yesterday" ? "active" : ""
        }`}
        onClick={getYesterday}
        color="blue"
      >
        <Trans word={"yesterday"} />
      </Tag>
      <BsDot />

      <Tag
        className={`tag_renders_date thisMonth ${
          active === "thisMonth" ? "active" : ""
        }`}
        onClick={getThisMonth}
        color="blue"
      >
        <Trans word={"thismonth"} />
      </Tag>
      <BsDot />

      <Tag
        className={`tag_renders_date lastMonth ${
          active === "lastMonth" ? "active" : ""
        }`}
        onClick={getLastMonth}
        color="blue"
      >
        <Trans word={"lastmonth"} />
      </Tag>
    </div>
  );
};

const mapStateToProps = (state) => ({
  state,
});

const mapDispatchToProps = {
  fetchData,
  fetchDataFast,
  fetchProfit,
  clearFilter,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterDateComponent);
