import {
  FETCH_DOC_NAME_PENDING,
  FETCH_DOC_NAME_FULFILLED,
  FETCH_DOC_NAME_REJECTED,
} from "../config/fetching";

const initialState = {
  docName: undefined,
  newDocId: "",
  iscreated: false,
  isedited: false,
  loading: false,
  soundloader: false,
  page: null,
  toPayment: false,
  visible: false,
  networkError: undefined,
  createDoc: {},
  consumption: "",
};

function savedoc(state = initialState, action) {
  switch (action.type) {
    case "UPDATE_DOC_NAME":
      return {
        ...state,
        docName: action.payload.newDocName,
      };
    case "PUT_DOCUMENT_REJECTED":
      return {
        ...state,
        networkError: action.payload.message,
      };

    case "PUT_DOCUMENT_PENDING":
      return {
        ...state,
        networkError: undefined,
      };

    case "SAVEBUTTON":
      return {
        ...state,
        loading: action.payload.loading,
      };

    case "SAVEBUTTONPAYMENT":
      return {
        ...state,
        toPayment: action.payload.loading,
      };
    case "OPENPAYMENT":
      return {
        ...state,
        visible: action.payload.visible,
      };
    case "UPDATE_DOC_ID":
      return {
        ...state,
        newDocId: action.payload.newDocId,
      };
    case "ISEDITED":
      return {
        ...state,
        isedited: action.payload.edited,
      };
    case "UPDATE_URL":
      return {
        ...state,
        page: action.payload.link,
      };

    case "ISCREATED":
      return {
        ...state,
        iscreated: action.payload.newdoc,
      };
    case "SOUNDLOADER":
      return {
        ...state,
        soundloader: action.payload.soundloader,
      };
    case "CLEAR_DOC":
      return {
        ...state,
        createDoc: action.payload.cleared,
      };
    case "PUT_CONSUMPTION":
      return {
        ...state,
        consumption: action.payload.consumption,
      };

    case "FETCH_DOC_AFTER_SAVE_FULFILLED":
      return {
        ...state,
        createDoc: action.payload.Body.List[0],
      };

    default:
      return state;
  }
}

export default savedoc;
