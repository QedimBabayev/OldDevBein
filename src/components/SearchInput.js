import React, { Component } from "react";
import { connect } from "react-redux";
import { Input, Space } from "antd";
import { AudioOutlined } from "@ant-design/icons";
import { docFilter } from "../config/filter";
import {
  fetchData,
  fetchDataFast,
  updateSearchInput,
} from "../actions/getData-action";

import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
const { Search } = Input;
class SearchInput extends Component {
  state = {
    value: "",
    searched: false,
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };
  handleSearch = (e) => {
    console.log(docFilter);
    if (e.target.value != "") {
      if (this.props.from === "fast" || this.props.from === "modal") {
        docFilter.fast = e.target.value;
        docFilter.pg = 0;

        this.props.fetchDataFast(this.props.fetchFast, docFilter);
        this.props.updateSearchInput(e.target.value);
      } else {
        docFilter.nm = e.target.value;
        docFilter.pg = 0;
        this.props.fetchData(this.props.fetchFast, docFilter);
        this.setState({
          searched: true,
        });
      }
      e.target.value = "";
    } else {
      docFilter.fast = "";
      docFilter.nm = "";
      docFilter.pg = 0;

      this.props.updateSearchInput("");
      this.props.fetchData(this.props.fetchFast, docFilter);
      this.setState({
        searched: false,
      });
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.state.datas.searching != this.props.state.datas.searching) {
      this.setState({
        value: nextProps.state.datas.searching,
      });
    } else if (nextProps.state.datas.searching != this.state.value) {
      this.setState({
        value: nextProps.state.datas.searching,
      });
    }
  }
  render() {
    return (
      <div className="mobile_filter_wrapper">
        <Search
          className="search_header"
          placeholder={
            this.props.state.langs.lang === "aze"
              ? "Axtarış..."
              : this.props.state.langs.lang === "ru"
              ? "Поиск..."
              : "Found..."
          }
          value={this.state.value}
          onChange={this.onChange}
          onPressEnter={this.handleSearch}
          loading={this.props.state.datas.loading}
          style={{ width: 200 }}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  state,
});

const mapDispatchToProps = {
  fetchData,
  fetchDataFast,
  updateSearchInput,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchInput);
