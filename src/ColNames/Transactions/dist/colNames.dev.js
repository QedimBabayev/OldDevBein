"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var cols = [{
  dataField: "Name",
  text: "Name",
  sort: true,
  classes: "docNameField",
  hidden: false
}, {
  dataField: "Moment",
  text: "Moment",
  sort: true,
  hidden: false
}, {
  dataField: "CustomerName",
  text: "CustomerName",
  classes: "nameField",
  sort: true,
  hidden: false
}, {
  dataField: "CashOrInvoice",
  text: "CashOrInvoice",
  sort: false,
  hidden: false
}, {
  dataField: "PaymentIn",
  text: "PaymentIn",
  sort: false,
  hidden: false,
  showFooter: true,
  footerName: "PaymentIn",
  priceFormat: true
}, {
  dataField: "PaymentOut",
  text: "PaymentOut",
  sort: false,
  hidden: false,
  showFooter: true,
  footerName: "PaymentOut",
  priceFormat: true
}, {
  dataField: "Description",
  text: "Description",
  sort: true,
  hidden: true
}, {
  dataField: "MarkCustom",
  text: "Mark",
  sort: true,
  hidden: false,
  showCustomFormatter: true
}, {
  dataField: "Modify",
  text: "Modify",
  sort: true,
  hidden: true
}, {
  dataField: "SpendName",
  text: "SpendName",
  sort: true,
  hidden: false
}];
var _default = cols;
exports["default"] = _default;