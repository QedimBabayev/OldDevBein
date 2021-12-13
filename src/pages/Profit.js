import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchProfit, removeProfit } from "../actions/getData-action";
import GridExampleContainer from "./ProfitPage";
import ButtonsWrapper from "../components/ButtonsWrapper";
import buttonsNames from "../ButtonsNames/Profit/buttonsNames";
import { docFilter } from "../config/filter";
import { getToken } from "../config/token";
import moment from "moment";
import { getSpendItems } from "../actions/getSpendItems-action";
import { Result, Button } from "antd";
import { updateUpperheader } from "../actions/getNavbar-action";
import { Link, Redirect } from "react-router-dom";
class Profit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };
  }

  componentDidMount() {
           docFilter.pg = 0;
           var defaultFilter = {
             pg: 0,
           };
           var filter = { ...docFilter, ...defaultFilter };
    if (JSON.parse(localStorage.getItem("user"))) {
      this.props.removeProfit();
      this.props.fetchProfit("profit", docFilter);
    }
  }
  handleReturnMainPage = () => {
    this.props.updateUpperheader("Göstəricilər", "p=dashboard");
    this.setState({ redirect: true });
  };

  render() {
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect push to={"/p=dashboard"} />;
    }
    return (
      <div className="table_holder">
        {/* <Result
          status="403"
          title="Diqqət"
          subTitle="Səhifədə texniki işlər getdiyinə görə, müvəqqəti olaraq bağlıdır."
          extra={
            <Button onClick={this.handleReturnMainPage} type="primary">
              Əsas səhifə
            </Button>
          }
        /> */}
        <ButtonsWrapper
          from={"normal"}
          fetchFast={"profit"}
          buttonsName={buttonsNames}
          activeitem={this.props.state.navbar.activeItem}
          activesubitem={this.props.state.navbar.activeSubItem}
        />
        <GridExampleContainer datas={this.props.state.datas.profit} />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  state,
});
const mapDispatchToProps = {
  fetchProfit,
  getSpendItems,
  removeProfit,
  updateUpperheader,
};
export default connect(mapStateToProps, mapDispatchToProps)(Profit);
