import React, { Component } from "react";
import { connect } from "react-redux";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components/Table.css";
import Trans from "../usetranslation/Trans";
import { Redirect, Link } from "react-router-dom";
import { Pagination } from "antd";
import { fetchData } from "../actions/getData-action";
import { fetchDataFast } from "../actions/getData-action";
import { productModalFilter } from "../actions/modalActions/getCustomerGroupsModal-action";
import { docFilter } from "../config/filter";
import { updateSelectedRows } from "../actions/updateStates-action";
import { updatePositions } from "../actions/updateProduct";
import TableLoader from "../components/TableLoader";
import { Button, Dropdown, Menu, Checkbox } from "antd";
import { SettingOutlined } from "@ant-design/icons";

var translatedCols = [];
var translatedColsWrapper = [];
var menutranslatedCols = [];
var datas = [];
var menutranslatedColsWrapper = [];
const defaultSorted = [
  {
    dataField: "Name",
    order: "desc",
  },
];
var footerName;
var tableRowEvents;
class ResponsiveTable extends Component {
  constructor(props) {
    super(props);
    console.log("constructor isledi");
    this.state = {
      activePage: 1,
      pageChange: false,
      selectedrow: props.selectedrows ? props.selectedrows : [],
      selectedid: props.selectedrowsid ? props.selectedrowsid : [],
      from: props.from,
      initialcols: props.initialcols ? props.initialcols : props.cols,
      attributes: props.attributes ? props.attributes : "",
      redirect: false,
      visibleMenuSettings: false,
      columns: props.columns,
      redirectto: props.editPage,
    };
  }

  handleSort = (field, order) => {
    docFilter.id = "";
    docFilter.token = JSON.parse(localStorage.getItem("user"))
      ? JSON.parse(localStorage.getItem("user")).Token
      : "";
    docFilter.sr = field;
    order === "asc" ? (docFilter.dr = 0) : (docFilter.dr = 1);
    console.log("productModalFilter", productModalFilter.pg);
    if (productModalFilter.pg === 0) {
      docFilter.pg = 0;
    }
    if (productModalFilter.gp === "") {
      docFilter.gp = "";
    }
    this.props.fetchData(this.state.from, docFilter);
  };

  onChangePage = (page, sizePerPage) => {
    const currentIndex = page - 1;
    docFilter.pg = currentIndex;
    docFilter.token = JSON.parse(localStorage.getItem("user"))
      ? JSON.parse(localStorage.getItem("user")).Token
      : "";
    if (JSON.parse(localStorage.getItem("user"))) {
      if (this.props.state.datas.searching !== "") {
        docFilter.fast = this.props.state.datas.searching;
        this.props.fetchDataFast(this.props.from, docFilter);
        this.setState({ fast: true });
      } else {
        docFilter.fast = "";
        this.setState({ fast: false });

        this.props.fetchData(this.props.from, docFilter);
      }
    }
  };
  handleVisibleChange = (flag) => {
    this.setState({ visibleMenuSettings: flag });
  };
  handleOnSelect = (row, isSelect) => {
    console.log("prevcols", this.state.columns);
    if (isSelect) {
      this.setState(
        {
          selectedrow: [...this.state.selectedrow, row],
          selectedid: [...this.state.selectedid, row.BarCode],
        },
        () => {
          this.props.updateSelectedRows(
            this.state.selectedrow,
            this.state.selectedid
          );
        }
      );
    } else {
      this.setState(
        {
          selectedrow: this.state.selectedrow.filter((x) => x.Id !== row.Id),
          selectedid: this.state.selectedid.filter((x) => x !== row.BarCode),
        },
        () => {
          this.props.updateSelectedRows(
            this.state.selectedrow,
            this.state.selectedid
          );
        }
      );
    }
  };
  handleOnSelectAll = (isSelect, rows) => {
    const barcodes = rows.map((r) => r.BarCode);
    var concatRow = this.state.selectedrow.concat(rows);
    var concatId = this.state.selectedid.concat(barcodes);
    if (isSelect) {
      this.setState(
        {
          selectedrow: concatRow,
          selectedid: concatId,
        },
        () => {
          this.props.updateSelectedRows(
            this.state.selectedrow,
            this.state.selectedid
          );
        }
      );
    } else {
      this.setState(
        {
          selectedrow: [],
          selectedid: [],
        },
        () => {
          this.props.updateSelectedRows(
            this.state.selectedrow,
            this.state.selectedid
          );
        }
      );
    }
  };
  onChange = (e) => {
    var initialCols = this.state.initialcols;
    var findelement;
    var findelementindex;
    var replacedElement;
    findelement = initialCols.find((c) => c.dataField === e.target.id);
    findelementindex = initialCols.findIndex(
      (c) => c.dataField === e.target.id
    );
    findelement.hidden = !e.target.checked;
    replacedElement = findelement;
    initialCols.splice(findelementindex, 1, {
      ...findelement,
      ...replacedElement,
    });
    var filtered = initialCols.filter((c) => c.hidden == false);
    this.setState({
      columns: filtered,
    });
  };
  render() {
    const { selectedid } = this.state;
    datas = [];
    translatedCols = [];
    translatedColsWrapper = [];
    menutranslatedCols = [];
    menutranslatedColsWrapper = [];
    const selectRow = {
      mode: "checkbox",
      clickToSelect: true,
      selected: selectedid,
      onSelect: this.handleOnSelect,
      onSelectAll: this.handleOnSelectAll,
    };

    Object.values(this.state.columns).map((c) => {
      c.onSort = this.handleSort;

      if (c.showFooter === true) {
        c.footer = c.text;
        c.footerName = c.footerName;
        c.footerFormatter = this.handleFooter;
      } else {
        c.footer = "";
      }
    });

    for (let i = 0; i < Object.keys(this.props.state.datas.datas).length; i++) {
      this.props.state.datas.datas[i].Order =
        i + 1 + this.props.state.datas.totalLimit * docFilter.pg;
    }
    Object.values(this.state.columns).map((c) =>
      translatedCols.push({
        text: <Trans word={c.text} />,
        dataField: c.dataField,
        classes: c.classes,
        headerClasses: c.headerClasses,
        sort: c.sort,
        onSort: c.onSort,
        hidden: c.hidden,
        footer: c.footer,
        footerFormatter: c.footerFormatter,
        footerName: c.footerName ? c.footerName : "",
        formatter: c.formatter,
        formatExtraData: c.formatExtraData,
        style: c.style,
      })
    );

    Object.values(this.props.cols.concat(this.props.attributes)).map((c) =>
      menutranslatedCols.push({
        text: <Trans word={c.text} />,
        dataField: c.dataField,
        sort: c.sort,
        onSort: c.onSort,
        hidden: c.hidden,
      })
    );
    translatedColsWrapper = translatedCols;
    menutranslatedColsWrapper = menutranslatedCols;

    const { activePage, from } = this.state;
    const menu = (
      <Menu>
        <Menu.ItemGroup title={<Trans word={"columns"} />}>
          {Object.values(menutranslatedColsWrapper).map((d) => (
            <Menu.Item key={d.dataField}>
              <Checkbox
                id={d.dataField}
                hidden={d.hidden}
                onChange={this.onChange}
                defaultChecked={!d.hidden}
              >
                {d.text}
              </Checkbox>
            </Menu.Item>
          ))}
        </Menu.ItemGroup>
      </Menu>
    );

    return (
      <div className="table-container">
        <div className="tableButtonsWrapper">
          <Dropdown
            overlay={menu}
            onVisibleChange={this.handleVisibleChange}
            visible={this.state.visibleMenuSettings}
          >
            <Button className="flex_directon_col_center">
              {" "}
              <SettingOutlined />
            </Button>
          </Dropdown>
          {this.props.state.datas.loading ? (
            <TableLoader className="custom_table_loader show" />
          ) : (
            <TableLoader className="custom_table_loader hidden" />
          )}
        </div>

        <BootstrapTable
          parentClassName={"custom_body"}
          keyField="BarCode"
          data={this.props.state.datas.datas}
          columns={translatedColsWrapper}
          striped
          hover
          selectRow={selectRow}
          condensed
          loading={true}
          bordered={false}
          defaultSorted={defaultSorted}
          wrapperClasses="table-responsive"
        />

        {this.props.state.datas.loadingFinalData ? (
          ""
        ) : (
          <Pagination
            current={docFilter.pg + 1}
            onChange={this.onChangePage}
            showSizeChanger={false}
            defaultPageSize={this.props.state.datas.totalLimit}
            total={this.props.state.datas.totalDatas}
          />
        )}

        {/* <Pagination
              activePage={activePage}
              from={from}
              onClick={this.changePage}
              onPageChange={this.handlePaginationChange}
              totalPages={Math.ceil(
                this.props.state.datas.totalDatas /
                  this.props.state.datas.totalLimit
              )}
            /> */}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  state,
  selectedrows: state.stateChanges.selectedRows,
  selectedrowsid: state.stateChanges.selectedRowsId,
});
const mapDispatchToProps = {
  fetchData,
  updateSelectedRows,
  updatePositions,
  fetchDataFast,
};
export default connect(mapStateToProps, mapDispatchToProps)(ResponsiveTable);
