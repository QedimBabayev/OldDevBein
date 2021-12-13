import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchData } from "../actions/getData-action";
import GridExampleContainer from "./CreditPage";
import ButtonsWrapper from "../components/ButtonsWrapper";
import buttonsNames from "../ButtonsNames/Cashins/buttonsNames";
import { fetchPrices } from "../actions/getPrices-action";
import { docFilter } from "../config/filter";
import { getSpendItems } from "../actions/getSpendItems-action";
import { getOwners, getDepartments } from "../actions/getGroups-action";
import { setRedirect, isDeleted } from "../actions/delActions/delData-action";
import ok from "../audio/ok.mp3";

const audio = new Audio(ok);

class Credit extends Component {
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
  fetchPrices,
  getSpendItems,
};
export default connect(mapStateToProps, mapDispatchToProps)(Credit);
