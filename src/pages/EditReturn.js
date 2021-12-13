import React, { Component } from "react";
import { connect } from "react-redux";
import CreateReturnForm from "../components/CreateReturnForm";
import { docFilter } from "../config/filter";
import {
  getCustomersData,
  updateCustomerSelect,
} from "../actions/getCustomerGroups-action";
import { fetchPage, fetchData } from "../actions/getData-action";
import { deleteProduct } from "../actions/updateProduct";
import LoaderDocHOC from "../components/LoaderDocHOC";
import getMarks from "../actions/getMarks-action";
import { getCustomers } from "../actions/getCustomerGroups-action";
import { Spin, Alert } from "antd";
import { getGroups } from "../actions/getGroups-action";

class EditReturn extends Component {
  componentDidMount() {
    docFilter.id = "";
    this.props.deleteProduct("");
    this.props.getMarks();
    const { match } = this.props;
    if (match.params.id != "") {
      docFilter.id = match.params.id;
      this.props.fetchPage("returns");
      this.props.getGroups("stocks");
    }
  }

  render() {
    return (
      <div className="create_page">
        <CreateReturnForm
          fetching={this.props.state.datas.fetchingEdit}
          fromdoc={this.props.location.state ? this.props.location.state : ""}
          owners={this.props.state.owdep.owners}
          departments={this.props.state.owdep.departments}
        />
      </div>
    );
  }
}
const mapStateToProps = (state, props) => ({
  state,
});
const mapDispatchToProps = {
  fetchPage,
  getCustomersData,
  updateCustomerSelect,
  deleteProduct,
  getCustomers,
  fetchData,
  getMarks,
  getGroups,
};
export default connect(mapStateToProps, mapDispatchToProps)(EditReturn);
