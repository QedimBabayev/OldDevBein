import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchData } from "../actions/getData-action";
import GridExampleContainer from "./SaleReportsPage";
import ButtonsWrapper from "../components/ButtonsWrapper";
import buttonsNames from "../ButtonsNames/SaleReports/buttonsNames";
import { docFilter } from "../config/filter";
import { Result, Button } from "antd";
import { Link, Redirect } from "react-router-dom";
import { updateUpperheader } from "../actions/getNavbar-action";

class SaleReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };
  }

  componentDidMount() {
    var defaultFilter = {
      pg: 0,
    };
    var filter = { ...docFilter, ...defaultFilter };
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
          fetchFast={"salereports"}
          defaultSorted={"today"}
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
  updateUpperheader,
};
export default connect(mapStateToProps, mapDispatchToProps)(SaleReport);
