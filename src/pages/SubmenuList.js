import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { List } from "semantic-ui-react";
import LoaderHOC from "../components/LoaderHOC";
import { connect } from "react-redux";
import { updateUpperheader } from "../actions/getNavbar-action";
import { updateButton } from "../actions/getButtons-action";
import { updateChangePage } from "../actions/getData-action";
import { docFilter } from "../config/filter";
import { updateProductPage } from "../actions/updateProduct";
import { exitModal } from "../actions/updateStates-action";
import { updateSearchInput } from "../actions/getData-action";
import queryString from "query-string";
import { fetchData, loadingData } from "../actions/getData-action";
import moment from "moment";
import Trans from "../usetranslation/Trans";


import { changeSubMenu } from "../actions/getNavbar-action";
class SubmenuList extends Component {
  state = {
    activeItem: this.props.activeItem,
    activeFrom: this.props.activeFrom,
    firstLoading: false,
    redirectProduct: false,
  };

  handleItemClick = (e, { name, from }) => {
    console.log("name", from);
       var newFilter = {};
        newFilter.momb = moment().startOf("day").format("YYYY-MM-DD HH:mm:ss");
        newFilter.mome = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");
        sessionStorage.removeItem("currentPage");
        sessionStorage.removeItem("currentPageFilter");
       sessionStorage.setItem('filterdate', JSON.stringify(newFilter))
       sessionStorage.setItem('date', 'today')
    // if (
    //   from === "p=product" &&
    //   this.props.state.navbar.activeFrom === "p=product"
    // ) {
    //   this.props.updateProductPage(true);
    //   Object.keys(docFilter).map((item) => {
    //     if (item != "token") delete docFilter[item];
    //   });
    //   var refFilter = {};
    //   refFilter.token = docFilter.token;
    //   refFilter.ar = 0
    //   refFilter.dr = 1;
    //   refFilter.fast = '';
    //   refFilter.gp = '';
    //   refFilter.id = "";
    //   refFilter.nm = "";
    //   refFilter.pg = 0;
    //   refFilter.sr = "GroupName";

    //   this.props.fetchData("products", refFilter);
    // }

    if (this.props.state.stateChanges.changed) {
      e.preventDefault();
      e.stopPropagation();
      this.props.exitModal(true, from, name);
    } else {
      this.props.exitModal(false);
      this.setState({ activeItem: name });
      localStorage.setItem("activePage", from);
      this.props.changeSubMenu("");
      this.props.updateUpperheader(name, from);
      this.props.updateButton(name);
      this.props.updateSearchInput("");
      this.props.state.datas.changePage == false
        ? console.log("")
        : this.props.updateChangePage(true);
    }
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.state.navbar.submenu &&
      this.props.state.navbar.submenu != nextProps.state.navbar.submenu
    ) {
      this.setState({
        activeItem: nextProps.state.navbar.submenu,
      });
    }
  }

  render() {
    var data = this.props.submenu.navbar;
    var i = 0;
    var id = this.props.submenu.id;
    const { activeItem } = this.state;

    const menuList = (
      <List className="d-flex">
        {Array.isArray(data)
          ? data
              .filter((d) => d.ParentId === id)
              .map((d) => (
                <List.Item
                  key={i++}
                  as={Link}
                  from={d.Url}
                  to={`/${d.Url}`}
                  active={activeItem === d.Name}
                  name={d.Name}
                  onClick={this.handleItemClick}
                  className="sub_header_items"
                >
                  {<Trans word={d.Name} />}
                </List.Item>
              ))
          : ""}
      </List>
    );

    return menuList;
  }
}

const mapStateToProps = (state) => {
  return {
    state,
  };
};

const mapDispatchToProps = {
  updateUpperheader,
  updateButton,
  updateChangePage,
  updateSearchInput,
  exitModal,
  changeSubMenu,
  fetchData,
  updateProductPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoaderHOC(SubmenuList, "submenu"));
