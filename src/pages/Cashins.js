import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchData } from "../actions/getData-action";
import GridExampleContainer from "./CashinsPage";
import ButtonsWrapper from "../components/ButtonsWrapper";
import buttonsNames from "../ButtonsNames/Cashins/buttonsNames";
import { docFilter } from "../config/filter";

class Cashin extends Component {
  componentDidMount() {
        docFilter.pg = 0;
        var defaultFilter = {
          pg: 0,
        };
        var filter = { ...docFilter, ...defaultFilter };
  }

  render() {
    return (
      <div className="table_holder">
        <ButtonsWrapper
          from={"normal"}
          fetchFast={"cashins"}
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
};
export default connect(mapStateToProps, mapDispatchToProps)(Cashin);
