import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchData } from "../actions/getData-action";
import { getGroups } from "../actions/getGroups-action";
import GridExampleContainer from "./ProductPage";
import ButtonsWrapper from "../components/ButtonsWrapper";
import buttonsNames from "../ButtonsNames/Products/buttonsNames";
import { fetchAttributes, fetchRefList } from "../actions/getAttributes-action";
import { docFilter } from "../config/filter";
import { getToken } from "../config/token";
import { getCheckPage } from "../actions/check/check-action";
import { getOwners, getDepartments } from "../actions/getGroups-action";
import { updateProductId } from "../actions/updateProduct";
import "../components/ButtonsWrapper.css";
import session from "redux-persist/lib/storage/session";

class Product extends Component {
  state = {
    attributes: [],
    reload: false,
    redirect: false,
  };
  componentDidMount() {
    docFilter.id = "";
    docFilter.gp = "";
    docFilter.nm = "";
    docFilter.fast = "";

    this.props.getCheckPage(false);
    this.props.updateProductId(false);
    if (JSON.parse(localStorage.getItem("user"))) {
      this.props.getOwners("owners");
      this.props.getDepartments("departments");
      this.props.getGroups("productfolders");
      this.props.fetchAttributes("attributes", "product");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.state.attributes.attributes !=
      this.props.state.attributes.attributes
    ) {
      this.setState({
        attributes: nextProps.state.attributes.attributes,
      });
    }
  }

  render() {
    return (
      <div className="table_holder forProduct">
        <ButtonsWrapper
          searching={this.props.state.datas.searching}
          from={"fast"}
          fetchFast={"products"}
          buttonsName={buttonsNames}
          activeitem={this.props.state.navbar.activeItem}
          activesubitem={this.props.state.navbar.activeSubItem}
        />
        <GridExampleContainer
          attributes={this.state.attributes}
          groups={this.props.state.groups.groups}
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
  getGroups,
  fetchRefList,
  fetchAttributes,
  getCheckPage,
  getOwners,
  getDepartments,
  updateProductId,
};
export default connect(mapStateToProps, mapDispatchToProps)(Product);
