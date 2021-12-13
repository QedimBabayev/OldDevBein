export const initialState = {

  nots : [],
};

function nots(state = initialState, action) {

    switch (action.type) {

        case 'NEW_NOTS':
            return {
                ...state,
                nots:action.payload.nots,
            };
        default:
            return state;
    }

}

export default nots;