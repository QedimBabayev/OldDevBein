"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConvertDecimal = ConvertDecimal;
exports.ConvertFixedTable = ConvertFixedTable;
exports.ConvertFixedBarcode = ConvertFixedBarcode;
exports.ConvertFixedPosition = ConvertFixedPosition;
exports.ConvertFixedPositionInvoice = ConvertFixedPositionInvoice;
exports.FindCofficient = FindCofficient;
exports.FindAdditionals = FindAdditionals;

function ConvertDecimal(num) {
  return Math.floor(num * 100) / 100;
}

function ConvertFixedTable(num) {
  var isNum = !isNaN(parseFloat(num));
  return isNum ? parseFloat(parseFloat(parseFloat(num).toFixed(4)).toFixed(2)) : '';
}

function ConvertFixedBarcode(num) {
  var isNum = !isNaN(parseFloat(num));
  return isNum ? Number(num).toFixed(2) : "";
}

function ConvertFixedPosition(num) {
  var isNum = !isNaN(parseFloat(num));
  return isNum ? parseFloat(parseFloat(parseFloat(num).toFixed(4))) : 0.00;
}

function ConvertFixedPositionInvoice(num) {
  var isNum = !isNaN(parseFloat(num));
  return isNum ? parseFloat(parseFloat(parseFloat(num).toFixed(4))) : null;
}

function FindCofficient(consumption, amount) {
  var isNum = !isNaN(parseFloat(amount));
  return isNum ? parseFloat(parseFloat(parseFloat(consumption / amount).toFixed(4))) : 0.00;
}

function FindAdditionals(consumption, amount, posAmount) {
  var cofficient = FindCofficient(consumption, amount);
  return ConvertFixedTable(posAmount + cofficient * posAmount);
}