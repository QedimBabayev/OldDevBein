import {
    UPDATE_COLS
} from '../actions/updateStates-action'
import { default as productCols } from '../ColNames/Products/colNames';


const filterState = {
    updatedProductCols: productCols,
    updatedProductMenus: [],
}

function colsUpdate(state = filterState, action) {

    switch (action.type) {



        case UPDATE_COLS:
            var from = action.payload.from
            var updatedcols = action.payload.updatedCols
            var updatedmenus = action.payload.updatedMenus
            return {
                ...state,
                updatedProductCols: from === 'products' ? updatedcols : null,
            };
        default:
            return state;
    }

}

export default colsUpdate