import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchData } from "../actions/getData-action";
import GridExampleContainer from "./ReturnsPage";
import ButtonsWrapper from "../components/ButtonsWrapper";
import buttonsNames from "../ButtonsNames/Sales/buttonsNames";
import { docFilter } from "../config/filter";
import { getOwners, getDepartments } from "../actions/getGroups-action";
import { Result, Button } from "antd";
import { updateUpperheader } from "../actions/getNavbar-action";
import { Link, Redirect } from "react-router-dom";

class Return extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };
  }
  componentDidMount() {
    this.props.getOwners("owners");
    this.props.getDepartments("departments");
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
          fetchFast={"returns"}
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
  getOwners,
  getDepartments,
  updateUpperheader,
};
export default connect(mapStateToProps, mapDispatchToProps)(Return);
