import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchData } from "../actions/getData-action";
import { getGroups } from "../actions/getGroups-action";
import Trans from "../usetranslation/Trans";
import GridExampleContainer from "./CustomerPage";
import ButtonsWrapper from "../components/ButtonsWrapper";
import buttonsNames from "../ButtonsNames/Customers/buttonsNames";
import { docFilter } from "../config/filter";
import { getCheckPage } from "../actions/check/check-action";
import { getToken } from "../config/token";
import { getOwners, getDepartments } from "../actions/getGroups-action";
import { updateProductId } from "../actions/updateProduct";

class Customer extends Component {
  state = {
    reload: false,
  };
  componentDidMount() {
    docFilter.id = "";
    docFilter.gp = "";
    this.props.getCheckPage(false);
    this.props.updateProductId(false);

    if (getToken) {
      this.props.getOwners("owners");
      this.props.getDepartments("departments");
      this.props.getGroups("customergroups");
    }
  }

  render() {
    return (
      <div className="table_holder forProduct">
        <ButtonsWrapper
          from={"fast"}
          fetchFast={"customers"}
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
  getGroups,
  getOwners,
  getDepartments,
  getCheckPage,
  updateProductId,
};
export default connect(mapStateToProps, mapDispatchToProps)(Customer);
