import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import cols from "../ColNames/Cashins/colNames";
import { Row } from "antd";
import { docFilter } from "../config/filter";
import "./Page.css";
import ResponsiveTable from "../components/ResponsiveTable";
import FilterPage from "../components/FilterPage";
import Filter from "../Filter/transactions";

class GridExampleContainer extends Component {
  contextRef = createRef();

  constructor(props) {
    super(props);
    this.state = {
      cols: cols,
    };
  }

  componentDidMount() {
    docFilter.nm = "";
    docFilter.fast = "";
  }

  render() {
    return (
      <Row className={"table_holder_section"}>
        <Row className="filter_table_wrapper_row doc">
          <FilterPage from="transactions" filter={Filter} />
          <ResponsiveTable
            cols={cols}
            columns={cols.filter((c) => c.hidden == false)}
            redirectTo={""}
            from={"cashins"}
            editPage={""}
            foredit={"cashins"}
          />
        </Row>
      </Row>
    );
  }
}
const mapStateToProps = (state) => ({
  state,
});
export default connect(mapStateToProps)(GridExampleContainer);
