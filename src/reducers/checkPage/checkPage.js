
const initialState = {
    show: false,
    loginPage:false
};

function checkPage(state = initialState, action) {

    switch (action.type) {
      case "CHECK_PAGE":
        return {
          ...state,
          show: action.payload.show,
        };
      case "CHECK_LOGIN":
        return {
          ...state,
          loginPage: action.payload.show,
        };

      default:
        return state;
    }

}

export default checkPage