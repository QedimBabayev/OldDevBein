import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchData } from "../actions/getData-action";
import GridExampleContainer from "./EnterPage";
import ButtonsWrapper from "../components/ButtonsWrapper";
import buttonsNames from "../ButtonsNames/Enters/buttonsNames";
import { docFilter } from "../config/filter";
import { updateColName } from "../actions/updateColName";
import { setRedirect, isDeleted } from "../actions/delActions/delData-action";
import { getOwners, getDepartments } from "../actions/getGroups-action";
import { Redirect } from "react-router-dom";

import ok from "../audio/ok.mp3";
const audio = new Audio(ok);

class Enter extends Component {

  componentDidMount() {
    docFilter.pg = 0;
    var defaultFilter = {
      pg: 0,
    };
    var filter = { ...docFilter, ...defaultFilter };
    this.props.getDepartments("departments");
    this.props.getOwners("owners");
    this.props.setRedirect(false);
    this.props.isDeleted(false);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.state.putdatas.isdeleted &&
      nextProps.state.putdatas.isdeleted != this.props.state.putdatas.isdeleted
    ) {
      audio.play();
    }
  }
  handleRedirect = () => {
    this.setState({ redirect: true });
  };
  render() {
   
    return (
      <div className="table_holder">
        <ButtonsWrapper
          from={"normal"}
          fetchFast={"enters"}
          buttonsName={buttonsNames}
          activeitem={this.props.state.navbar.activeItem}
          activesubitem={this.props.state.navbar.activeSubItem}
        />
        <GridExampleContainer groups={this.props.state.groups.groups} />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  state,
});
const mapDispatchToProps = {
  fetchData,
  updateColName,
  getDepartments,
  getOwners,
  setRedirect,
  isDeleted,
};
export default connect(mapStateToProps, mapDispatchToProps)(Enter);
