export const UPDATE_STATESPRODUCT = 'UPDATE_STATESPRODUCT'
export const UPDATE_STATESENTER = 'UPDATE_STATESENTER'
export const UPDATE_STATELOSS = 'UPDATE_STATELOSS'
export const UPDATE_STATEMOVE = 'UPDATE_STATEMOVE'
export const UPDATE_STATECREATED = 'UPDATE_STATECREATED'
export const UPDATE_SELECTPRODUCTMULTI = 'UPDATE_SELECTPRODUCTMULTI'
export const UPDATE_SELECTPRODUCTMULTICONFIRM = 'UPDATE_SELECTPRODUCTMULTICONFIRM'
export const UPDATE_SENDOBJECT = 'UPDATE_SENDOBJECT'
export const UPDATE_SUBMITFORM = 'UPDATE_SUBMITFORM'
export const MODAL_OPEN = 'MODAL_OPEN'
export const CREATEPRODUCTGROUP_MODAL_OPEN = 'CREATEPRODUCTGROUP_MODAL_OPEN'
export const UPDATE_SELECTED_ROWS = 'UPDATE_SELECTED_ROWS'
export const UPDATE_ZINDEX = 'UPDATE_ZINDEX'
export const UPDATE_COLS = 'UPDATE_COLS'


export function updateStatesPro(boolType) {
	return {
		type: UPDATE_STATESPRODUCT,
		payload: {
			filterChanged: boolType,
		}
	}
}

export function openBalanceModal(boolType) {
  return {
    type: 'UPDATE_BALANCE',
    payload: {
      showBalance: boolType,
    },
  };
}

;

export function updateColTable(objectCols, from) {
	return {
		type: UPDATE_COLS,
		payload: {
			updatedCols: objectCols,
			updatedMenus: objectCols,
			from: from
		}
	}
}

export function clearFilter(bool) {
	return {
		type: 'CLEAR_FILTER',
		payload: {
			clearFilter: bool,
		}
	}
}

export function changeForm(boolType) {
	return {
		type: 'CHANGE_FORM',
		payload: {
			changed: boolType,
		}
	}
}



export function exitModal(boolType, from, name) {
	return {
		type: 'EXIT_MODAL',
		payload: {
			visible: boolType,
			from: from,
			name: name
		}
	}
}

export function updateFilter(obj) {
	return {
		type: 'UPDATE_FILTER',
		payload: {
			newFilter : obj,
		}
	}
}
export function updateDefaultFilter(obj) {
	return {
		type: 'UPDATEDEFAULT_FILTER',
		payload: {
			defaultFilter : obj
		}
	}
}




export function updateZIndex(boolType) {
	return {
		type: UPDATE_ZINDEX,
		payload: {
			zindex: boolType,
		}
	}
}

export function openSettingPage(boolType) {
	return {
		type: 'UPDATE_SETTING_PAGE',
		payload: {
			settingpage: boolType,
		}
	}
}
export function updateSelectedRows(rows, rowid) {
	return {
		type: UPDATE_SELECTED_ROWS,
		payload: {
			selectedRows: rows,
			selectedRowsId: rowid,
		}
	}
}
export function openModal(boolType) {
	return {
		type: MODAL_OPEN,
		payload: {
			openModal: boolType,
		}
	}
}

export function openProductGroupModal(boolType) {
	return {
		type: CREATEPRODUCTGROUP_MODAL_OPEN,
		payload: {
			openModal: boolType,
		}
	}
}


export function updateStatesCreate(boolType) {
	return {
		type: UPDATE_STATECREATED,
		payload: {
			created: boolType,
		}
	}
}


export function updateSelectProductMulti(selectedrows, selectedrowskey) {
	return {
		type: UPDATE_SELECTPRODUCTMULTI,
		payload: {
			selectedProducts: selectedrows,
			selectedProductsRow: selectedrowskey,
		}
	}
}

export function updateSelectProductMultiConfirm(boolType, newPro, addedpro, defaultPositons) {
	return {
		type: UPDATE_SELECTPRODUCTMULTICONFIRM,
		payload: {
			confirm: boolType,
			new: newPro,
			added: addedpro,
			defaultPositions: defaultPositons

		}
	}
}

export function updateSendObject(object) {
	return {
		type: UPDATE_SENDOBJECT,
		payload: {
			sendobject: object,
		}
	}
}

export function submitForm(boolean) {
	return {
		type: UPDATE_SUBMITFORM,
		payload: {
			submit: boolean,
		}
	}
}
export function updateStateEnter(boolType) {
	return {
		type: UPDATE_STATESENTER,
		payload: {
			filterChanged: boolType,
		}
	}
}

export function updateStatesLoss(boolType) {
	return {
		type: UPDATE_STATELOSS,
		payload: {
			filterChanged: boolType,
		}
	}
}
export function updateStatesMove(boolType) {
	return {
		type: UPDATE_STATEMOVE,
		payload: {
			filterChanged: boolType,
		}
	}
}


