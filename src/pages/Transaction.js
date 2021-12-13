import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchData } from "../actions/getData-action";
import GridExampleContainer from "./TransactionPage";
import ButtonsWrapper from "../components/ButtonsWrapper";
import buttonsNames from "../ButtonsNames/Transactions/buttonsNames";
import { docFilter } from "../config/filter";
import { setRedirect, isDeleted } from "../actions/delActions/delData-action";
import ok from "../audio/ok.mp3";
import { getOwners, getDepartments } from "../actions/getGroups-action";
const audio = new Audio(ok);

class Transaction extends Component {
  componentDidMount() {
        docFilter.pg = 0;
        var defaultFilter = {
          pg: 0,
        };
        var filter = { ...docFilter, ...defaultFilter };
    this.props.getDepartments("departments");
    this.props.setRedirect(false);
    this.props.getOwners("owners");
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

  render() {
    return (
      <div className="table_holder">
        <ButtonsWrapper
          from={"normal"}
          fetchFast={"transactions"}
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
  getOwners,
  getDepartments,
  setRedirect,
  isDeleted,
};
export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
