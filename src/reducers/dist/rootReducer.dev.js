"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.persistConfig = void 0;

var _redux = require("redux");

var _datas = _interopRequireDefault(require("../reducers/datas"));

var _changeLanguage = _interopRequireDefault(require("../reducers/changeLanguage"));

var _changed = _interopRequireDefault(require("../reducers/changed"));

var _groups = _interopRequireDefault(require("../reducers/groups"));

var _barcode = _interopRequireDefault(require("../reducers/barcode"));

var _navbars = _interopRequireDefault(require("../reducers/navbars"));

var _putdatas = _interopRequireDefault(require("../reducers/putdatas"));

var _docmodals = _interopRequireDefault(require("../reducers/modal/docmodals"));

var _stateChanges = _interopRequireDefault(require("./stateChanges"));

var _colnames = _interopRequireDefault(require("./colnames"));

var _savedoc = _interopRequireDefault(require("./savedoc"));

var _checkPage = _interopRequireDefault(require("./checkPage/checkPage"));

var _spenditems = _interopRequireDefault(require("./spenditems"));

var _updatecolnameschecked = _interopRequireDefault(require("./updatecolnameschecked"));

var _settings = _interopRequireDefault(require("./settings"));

var _cols = _interopRequireDefault(require("./cols"));

var _auth = _interopRequireDefault(require("./login/auth"));

var _login = _interopRequireDefault(require("./login/login"));

var _message = _interopRequireDefault(require("./login/message"));

var _prices = _interopRequireDefault(require("./prices/prices"));

var _mods = _interopRequireDefault(require("./mods/mods"));

var _attributes = _interopRequireDefault(require("./attributes"));

var _profile = _interopRequireDefault(require("./profile/profile"));

var _dashboard = _interopRequireDefault(require("./dashboard"));

var _notifications = _interopRequireDefault(require("./notification/notifications"));

var _links = _interopRequireDefault(require("./links"));

var _expired = _interopRequireDefault(require("./expired/expired"));

var _marks = _interopRequireDefault(require("./marks"));

var _owdep = _interopRequireDefault(require("./owdep"));

var _percent = _interopRequireDefault(require("./percent"));

var _filter = _interopRequireDefault(require("./filter/filter"));

var _selectproductdocument = _interopRequireDefault(require("../reducers/selectproductdocument"));

var _reduxPersist = require("redux-persist");

var _storage = _interopRequireDefault(require("redux-persist/lib/storage"));

var _getnots = _interopRequireDefault(require("./getnots"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var persistedArr;
var user = localStorage.getItem('user');
var persistConfig = {
  key: "root",
  storage: _storage["default"],
  whitelist: ["langs", "attributes", "colsUpdate", "colnames", "navbar", "colnameschecked", "settings", "profile", "owdep", "marks", "spenditems", "notifications", "prices"]
};
exports.persistConfig = persistConfig;
var rootReducer = (0, _redux.combineReducers)({
  nots: _getnots["default"],
  datas: _datas["default"],
  navbar: _navbars["default"],
  langs: _changeLanguage["default"],
  groups: _groups["default"],
  changed: _changed["default"],
  barcode: _barcode["default"],
  putdatas: _putdatas["default"],
  handleProduct: _selectproductdocument["default"],
  stateChanges: _stateChanges["default"],
  colnames: _colnames["default"],
  colnameschecked: _updatecolnameschecked["default"],
  settings: _settings["default"],
  dashboard: _dashboard["default"],
  owdep: _owdep["default"],
  percent: _percent["default"],
  attributes: _attributes["default"],
  marks: _marks["default"],
  links: _links["default"],
  docmodals: _docmodals["default"],
  spenditems: _spenditems["default"],
  filters: _filter["default"],
  auth: _auth["default"],
  message: _message["default"],
  login: _login["default"],
  checkPage: _checkPage["default"],
  profile: _profile["default"],
  mods: _mods["default"],
  savedoc: _savedoc["default"],
  expired: _expired["default"],
  notifications: _notifications["default"],
  prices: _prices["default"],
  colsUpdate: _cols["default"]
});

var _default = (0, _reduxPersist.persistReducer)(persistConfig, rootReducer);

exports["default"] = _default;