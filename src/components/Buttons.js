import React, { Component } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import updateChanged from "../actions/updateChanged-action";
import TransactionButtons from "./TransactionButtons";
import { Button, Icon } from "semantic-ui-react";
import { openFilter } from "../actions/modalActions/getCustomerGroupsModal-action";
import SearchInput from "./SearchInput";
import Trans from "../usetranslation/Trans";

import { DownOutlined } from "@ant-design/icons";
import {
  PlusCircleOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import CreditButtons from "./CreditButtons";
class ButtonSize extends React.Component {
  handleClearChnaged = (filter) => (e) => {
    console.log("filter", e.target.parentElement);
    if (filter) {
      e.preventDefault();
      this.props.openFilter(!this.props.state.filters.isOpen);
      return false;
    }
    this.props.updateChanged(false, "");
  };
  onChangeText = (e) => {
    this.setState({
      text: e.target.value,
    });
  };

  render() {
    const buttons = Object.values(this.props.items).map((p) => (
      <div className={`buttons_click ${p.isfilter ? "filterbutton" : ""}`}>
        <Button
          style={{ height: "max-content", display: "flex" }}
          icon
          onClick={this.handleClearChnaged(p.isfilter)}
          labelPosition="left"
          animated={p.isfilter ? "" : "animated fade"}
          className={`custombtns outerbuttons  ${p.classNames}`}
          as={Link}
          key={p.id}
          to={p.url ? p.url : ""}
          id={p.id}
        >
          <Button.Content
            visible
            style={{ display: "flex", margin: "0", color: "black" }}
          >
            <span>
              {p.url ? (
                <PlusCircleOutlined />
              ) : p.isfilter ? (
                <FilterOutlined />
              ) : (
                ""
              )}
            </span>
            <span style={{ marginLeft: "4px" }}>
              {<Trans word={p.title} />}
            </span>
          </Button.Content>
          {p.isfilter ? (
            ""
          ) : (
            <Button.Content hidden>{<Trans word={p.animated} />}</Button.Content>
          )}
        </Button>
        {/* <Button
          onClick={this.handleClearChnaged}
          as={Link}
          key={p.id}
          to={p.url ? p.url : ""}
          className={`custombtns  ${p.classNames}`}
          id={p.id}

        >
          {" "}
          <span>
            {p.url ? (
              <PlusCircleOutlined />
            ) : p.isfilter ? (
              <FilterOutlined />
            ) : (
              ""
            )}{" "}
            {p.title}
          </span>
        </Button> */}
      </div>
    ));
    const transactionbuttons = (
      <TransactionButtons
        from={this.props.fetchFast}
        handleClearChnaged={this.handleClearChnaged}
      />
    );

    const creditbuttons = (
      <CreditButtons
        from={this.props.fetchFast}
        handleClearChnaged={this.handleClearChnaged}
      />
    );

    const buttonsWrapper = (
      <>
        <div className="buttons_holder_flex">
          {this.props.fetchFast === "credit"
            ? creditbuttons
            : this.props.fetchFast === "transactions"
            ? transactionbuttons
            : this.props.from === "dashboard"
            ? ""
            : buttons}
        </div>
        {this.props.from === "dashboard" ? (
          ""
        ) : (
          <SearchInput
            from={this.props.searchFrom}
            fetchFast={this.props.searchFast}
          />
        )}
      </>
    );

    const modalButtonsWrapper = (
      <div
        style={{
          flexGrow: "1",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <SearchInput
          from={this.props.searchFrom}
          fetchFast={this.props.searchFast}
        />
        <div>
          <Button
            style={{ marginLeft: "10px" }}
            className="customsavebtn"
            type="primary"
            onClick={this.props.onOk}
          >
            Əlavə et
          </Button>
        </div>
      </div>
    );
    return (
      <>
        {this.props.searchFrom === "modal"
          ? modalButtonsWrapper
          : buttonsWrapper}
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  state,
});
const mapDispatchToProps = {
  updateChanged,
  openFilter,
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ButtonSize)
);
