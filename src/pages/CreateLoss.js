import React, { Component } from "react";
import { connect } from "react-redux";
import DocButtons from "../components/DocButtons";
import buttonsNames from "../ButtonsNames/NotDocs/buttonsNames";
import CreateLossForm from "../components/CreateLossForm";
import {
  getGroups,
  getOwners,
  getDepartments,
} from "../actions/getGroups-action";
import { docFilter } from "../config/filter";
import { fetchPage } from "../actions/getData-action";
import { soundLoader } from "../actions/putAactions/saveDocument";
import { deleteProduct } from "../actions/updateProduct";
import getMarks from "../actions/getMarks-action";
import { fetchProfile } from "../actions/getProfile-action";
import { updateSelectProductMultiConfirm } from "../actions/updateStates-action";

import { getToken } from "../config/token";

class CreateLoss extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editId: null,
      isCreated: false,
    };
  }

  componentDidMount() {
    this.props.fetchProfile("company", {
      token: JSON.parse(localStorage.getItem("user"))
        ? JSON.parse(localStorage.getItem("user")).Token
        : "",
    });
    docFilter.id = "";
    this.props.deleteProduct("");
    this.props.soundLoader(false);

    this.props.getMarks();
    this.props.getGroups("stocks");
    this.props.updateSelectProductMultiConfirm(false, false, false, []);

    const { match } = this.props;
    if (match.params.id) {
      docFilter.id = match.params.id;
      this.props.fetchPage("losses");
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
            this.props.fetchPage("losses");
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
        <CreateLossForm
          fromdoc={this.props.location.state ? this.props.location.state : ""}
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
  soundLoader,
  updateSelectProductMultiConfirm,
  deleteProduct,
  getOwners,
  getDepartments,
  getMarks,
  fetchProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateLoss);
