"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var cols = [{
  dataField: 'CustomerName',
  text: 'CustomerName',
  classes: 'docNameField',
  sort: true,
  hidden: false
}, {
  dataField: 'CustomerId',
  text: 'CustomerId',
  sort: true,
  hidden: true
}, {
  dataField: 'AmountProfit',
  text: 'Amount Profit',
  sort: false,
  hidden: false,
  showFooter: true,
  priceFormat: true,
  footerName: 'AmountProfit'
}, {
  dataField: 'AmountBorrow',
  text: 'Amount Borrow',
  sort: false,
  hidden: false,
  showFooter: true,
  footerName: 'AmountBorrow',
  priceFormat: true
}, {
  dataField: 'CurrentState',
  text: 'Current State',
  sort: false,
  hidden: true,
  showFooter: true,
  footerName: 'CurrentState',
  priceFormat: true
} // {
//     dataField: 'Payins',
//     text: 'Payins',
//     sort: true,
//     hidden: false
// },
// {
//     dataField: 'Payouts',
//     text: 'Payouts',
//     sort: true,
//     hidden: false
// }
];
var _default = cols;
exports["default"] = _default;