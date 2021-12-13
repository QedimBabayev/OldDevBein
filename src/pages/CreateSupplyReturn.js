import React, { Component } from "react";
import { connect } from "react-redux";
import CreateSupplyReturnForm from "../components/CreateSupplyReturnForm";
import {
  getGroups,
  getOwners,
  getDepartments,
} from "../actions/getGroups-action";
import { docFilter } from "../config/filter";
import {
  getCustomersData,
  updateCustomerSelect,
} from "../actions/getCustomerGroups-action";
import { fetchPage, fetchData } from "../actions/getData-action";
import { deleteProduct } from "../actions/updateProduct";
import { fetchProfile } from "../actions/getProfile-action";
import getMarks from "../actions/getMarks-action";
import { getCustomers } from "../actions/getCustomerGroups-action";
import { message } from "antd";
import { Spin, Alert } from "antd";
import { progress } from "../actions/putAactions/saveDocument";
import { getToken } from "../config/token";
import { saveButtonPayment } from "../actions/putAactions/saveDocument";
import { updateSelectProductMultiConfirm } from "../actions/updateStates-action";
import { soundLoader } from "../actions/putAactions/saveDocument";

class CreateSupplyReturn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editId: null,
      isCreated: false,
      newDocId: undefined,
      ownUpdate: false,
      showPayment: false,
      docPayment: {},
    };
  }
  componentDidMount() {
    this.props.saveButtonPayment(false);
    this.setState({
      isCreated: false,
    });
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
      this.props.getGroups("stocks");
      this.props.updateSelectProductMultiConfirm(false, false, false, []);
    }

    const { match } = this.props;
    if (match.params.id) {
      docFilter.id = match.params.id;
      this.props.fetchPage("supplyreturns");
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
            this.props.fetchPage("supplyreturns");
            this.setState({
              isCreated: false,
            });
          }
        );
      }
    }
  }

  componentWillUnmount() {
    message.destroy();
  }

  render() {
    const { match } = this.props;
    return (
      <div className="create_page">
        <CreateSupplyReturnForm
          fromdoc={
            this.props.location.state
              ? this.props.location.state.fromdoc.substring(1)
              : undefined
          }
          saledoc={
            this.props.location.state ? this.props.location.state : undefined
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
  fetchPage,
  soundLoader,
  fetchProfile,
  getMarks,
  getCustomersData,
  updateSelectProductMultiConfirm,
  updateCustomerSelect,
  deleteProduct,
  getCustomers,
  getOwners,
  getDepartments,
  getGroups,
  fetchData,
  getMarks,
  saveButtonPayment,
};
export default connect(mapStateToProps, mapDispatchToProps)(CreateSupplyReturn);
