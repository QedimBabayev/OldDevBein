import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchData, fetchSecondaryData } from "../actions/getData-action";
import GridExampleContainer from "./SalePointPage";
import ButtonsWrapper from "../components/ButtonsWrapper";
import buttonsNames from "../ButtonsNames/SalePoints/buttonsNames";
import { docFilter } from "../config/filter";

class SalePoint extends Component {
  componentDidMount() {
          docFilter.pg = 0;
          var defaultFilter = {
            pg: 0,
          };
          var filter = { ...docFilter, ...defaultFilter };
    if (JSON.parse(localStorage.getItem("user"))) {
      this.props.fetchSecondaryData("stocks");
    }
  }

  render() {
    return (
      <div className="table_holder">
        <ButtonsWrapper
          from={"normal"}
          fetchFast={"salepoints"}
          buttonsName={buttonsNames}
          activeitem={this.props.state.navbar.activeItem}
          activesubitem={this.props.state.navbar.activeSubItem}
        />
        <GridExampleContainer
          secondaryData={this.props.state.datas.secondaryDatas}
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
  fetchSecondaryData,
};
export default connect(mapStateToProps, mapDispatchToProps)(SalePoint);
