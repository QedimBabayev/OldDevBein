
export function updateProduct(option,bool){
	return {
		type: 'UPDATE_PRODUCT',
		payload: {
			product :option,
			checkBarcode :bool,
		}
	}
}




export function updateProductId(bool) {
  return {
    type: "UPDATE_PRODUCT_ID",
    payload: {
      updated: bool,
    },
  };
}

export function updateProductPage(bool) {
  return {
    type: "UPDATE_PRODUCT_PAGE",
    payload: {
      reload: bool,
    },
  };
}


export function updatePositions(bool,positions){
	return {
		type: 'UPDATE_POSITIONS',
		payload: {
			checkClickInput : bool,
			positions:positions
		}
	}
}


export function updateBarcode(){
	return {
		type: 'UPDATE_POSITIONS_BARCODE',
		payload: {
			barcode: true,

		}
	}
}






export function deleteProduct(option){
	return {
		type: 'DELETE_PRODUCT',
		payload: {
			product : ''
		}
	}
}
