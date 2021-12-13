import React, { Component } from "react";
import { connect } from "react-redux";
import CreateInvoiceInForm from "../components/CreateInvoiceInForm";
import {
  getGroups,
  getOwners,
  getDepartments,
} from "../actions/getGroups-action";
import { docFilter } from "../config/filter";
import { fetchPage, fetchData } from "../actions/getData-action";
import { getSpendItems } from "../actions/getSpendItems-action";
import { getCustomers } from "../actions/getCustomerGroups-action";
import { deleteProduct } from "../actions/updateProduct";
import { fetchProfile } from "../actions/getProfile-action";
import { soundLoader } from "../actions/putAactions/saveDocument";
import getMarks from "../actions/getMarks-action";
class CreateInvoiceIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editId: null,
      isCreated: false,
    };
  }

  componentDidMount() {
    if (this.state.editId === null) {
      this.props.fetchProfile("company", {
        token: JSON.parse(localStorage.getItem("user"))
          ? JSON.parse(localStorage.getItem("user")).Token
          : "",
      });
      docFilter.id = "";
      this.props.deleteProduct("");
      this.props.getMarks();
      this.props.soundLoader(false);
      this.props.getCustomers();
      this.props.getSpendItems();
    }

    const { match } = this.props;
    if (match.params.id) {
      docFilter.id = match.params.id;
      this.props.fetchPage("invoiceins");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.state.savedoc.isedited != this.props.state.savedoc.isedited) {
      if (nextProps.state.savedoc.newDocId && this.state.isCreated == false) {
        this.setState(
          {
            editId: nextProps.state.savedoc.newDocId,
            isCreated: true,
          },
          () => {
            docFilter.id = nextProps.state.savedoc.newDocId;
            this.props.fetchPage("invoiceins");
            this.setState({
              isCreated: false,
            });
          }
        );
      }
    }
  }

  render() {
    const { match } = this.props;
    return (
      <div className="create_page">
        <CreateInvoiceInForm
          fromdoc={
            this.props.location.state
              ? this.props.location.state.fromdoc.substring(1)
              : undefined
          }
          id={
            match.params.id
              ? match.params.id
              : this.state.editId
              ? this.state.editId
              : ""
          }
          fetching={
            match.params.id
              ? this.props.state.datas.fetchingEdit
              : this.state.editId
              ? this.props.state.datas.fetchingEdit
              : false
          }
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
  getGroups,
  fetchPage,
  deleteProduct,
  fetchProfile,
  getCustomers,
  getOwners,
  getDepartments,
  fetchData,
  getSpendItems,
  soundLoader,
  getMarks,
};
export default connect(mapStateToProps, mapDispatchToProps)(CreateInvoiceIn);
