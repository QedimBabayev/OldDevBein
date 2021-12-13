"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateProduct = updateProduct;
exports.updateProductId = updateProductId;
exports.updateProductPage = updateProductPage;
exports.updatePositions = updatePositions;
exports.updateBarcode = updateBarcode;
exports.deleteProduct = deleteProduct;

function updateProduct(option, bool) {
  return {
    type: 'UPDATE_PRODUCT',
    payload: {
      product: option,
      checkBarcode: bool
    }
  };
}

function updateProductId(bool) {
  return {
    type: "UPDATE_PRODUCT_ID",
    payload: {
      updated: bool
    }
  };
}

function updateProductPage(bool) {
  return {
    type: "UPDATE_PRODUCT_PAGE",
    payload: {
      reload: bool
    }
  };
}

function updatePositions(bool, positions) {
  return {
    type: 'UPDATE_POSITIONS',
    payload: {
      checkClickInput: bool,
      positions: positions
    }
  };
}

function updateBarcode() {
  return {
    type: 'UPDATE_POSITIONS_BARCODE',
    payload: {
      barcode: true
    }
  };
}

function deleteProduct(option) {
  return {
    type: 'DELETE_PRODUCT',
    payload: {
      product: ''
    }
  };
}