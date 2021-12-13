"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var cols = [{
  dataField: "Name",
  text: "Demand Number",
  classes: "docNameField",
  sort: true,
  hidden: false
}, {
  dataField: "Moment",
  text: "Moment",
  sort: true,
  hidden: false
}, {
  dataField: "StockName",
  text: "StockName",
  sort: true,
  hidden: false
}, {
  dataField: "CustomerName",
  text: "CustomerName",
  classes: "nameField",
  sort: true,
  hidden: false
}, {
  dataField: "Amount",
  text: "AmountMoney",
  sort: true,
  hidden: false,
  showFooter: true,
  footerName: "Amount",
  priceFormat: true
}, {
  dataField: "Profit",
  text: "Profit",
  sort: true,
  hidden: false,
  showFooter: true,
  footerName: "ProfitDemand",
  priceFormat: true
}, {
  dataField: "Status",
  text: "Status",
  sort: true,
  hidden: true
}, {
  dataField: "MarkCustom",
  text: "Mark",
  sort: true,
  hidden: false,
  showCustomFormatter: true
}, {
  dataField: "Description",
  text: "Description",
  sort: true,
  hidden: false
}, {
  dataField: "Modify",
  text: "Modify",
  sort: true,
  hidden: false
}, {
  dataField: "CustomerDiscount",
  text: "CustomerDiscount",
  sort: true,
  hidden: true,
  priceFormat: true
}, {
  dataField: "Consumption",
  text: "Consumption",
  sort: true,
  hidden: true
}, {
  dataField: "Discount",
  text: "Discount",
  sort: true,
  hidden: true,
  priceFormat: true
}];
var _default = cols;
exports["default"] = _default;