webpackJsonp([0],{

/***/ 102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getLocationOrigin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return defaultOptions; });
/* unused harmony export postMethod */
/* unused harmony export jsonHeader */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return checkStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return parseJSON; });
/* unused harmony export encodeBase64 */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_js_base64__ = __webpack_require__(427);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_js_base64___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_js_base64__);


/*
  window.location.origin polyfill
 */
var getLocationOrigin = function getLocationOrigin() {
  if (!window.location.origin) {
    window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
  }
  return window.location.origin;
};

/*
  query options:
 */
var defaultOptions = {
  credentials: 'same-origin'
};

var postMethod = {
  method: 'POST'
};

var jsonHeader = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

/*
  query response helpers:
 */
var checkStatus = function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    // throw error;
    return Promise.reject(error);
  }
};

var parseJSON = function parseJSON(response) {
  return response.json();
};

/*
 general helpers
 */
var encodeBase64 = function encodeBase64(stringToEncode) {
  return __WEBPACK_IMPORTED_MODULE_0_js_base64__["Base64"].encode(stringToEncode);
};

/***/ }),

/***/ 137:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__earningGraph__ = __webpack_require__(806);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__earningGraph__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__teamMates__ = __webpack_require__(807);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__teamMates__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__userInfos__ = __webpack_require__(808);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_2__userInfos__["a"]; });
//  weak





/***/ }),

/***/ 138:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export auth */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jwt_decode__ = __webpack_require__(813);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jwt_decode___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jwt_decode__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_moment__);





var TOKEN_KEY = 'token';
var USER_INFO = 'userInfo';

var APP_PERSIST_STORES_TYPES = ['localStorage', 'sessionStorage'];

var parse = JSON.parse;
var stringify = JSON.stringify;

/*
  auth object
  -> store "TOKEN_KEY"
  - default storage is "localStorage"
  - default token key is 'token'
 */
var auth = {
  // /////////////////////////////////////////////////////////////
  // TOKEN
  // /////////////////////////////////////////////////////////////

  /**
   * get token from localstorage
   *
   * @param {'localStorage' | 'sessionStorage'} [fromStorage='localStorage'] specify storage
   * @param {any} [tokenKey=TOKEN_KEY]  optionnal parameter to specify a token key
   * @returns {string} token value
   */
  getToken: function getToken() {
    var fromStorage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : APP_PERSIST_STORES_TYPES[0];
    var tokenKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TOKEN_KEY;

    // localStorage:
    if (fromStorage === APP_PERSIST_STORES_TYPES[0]) {
      return localStorage && localStorage.getItem(tokenKey) || null;
    }
    // sessionStorage:
    if (fromStorage === APP_PERSIST_STORES_TYPES[1]) {
      return sessionStorage && sessionStorage.getItem(tokenKey) || null;
    }
    // default:
    return null;
  },


  /**
  * set the token value into localstorage (managed by localforage)
  *
  * @param {string} [value=''] token value
  * @param {'localStorage' | 'sessionStorage'} [toStorage='localStorage'] specify storage
  * @param {any} [tokenKey='token'] token key
  * @returns {boolean} success/failure flag
  */
  setToken: function setToken() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var toStorage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : APP_PERSIST_STORES_TYPES[0];
    var tokenKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : TOKEN_KEY;

    if (!value || value.length <= 0) {
      return;
    }
    // localStorage:
    if (toStorage === APP_PERSIST_STORES_TYPES[0]) {
      if (localStorage) {
        localStorage.setItem(tokenKey, value);
      }
    }
    // sessionStorage:
    if (toStorage === APP_PERSIST_STORES_TYPES[1]) {
      if (sessionStorage) {
        sessionStorage.setItem(tokenKey, value);
      }
    }
  },


  /**
   * check
   * - if token key contains a valid token value (defined and not an empty value)
   * - if the token expiration date is passed
   *
   *
   * Note: 'isAuthenticated' just checks 'tokenKey' on store (localStorage by default or sessionStorage)
   *
   * You may think: 'ok I just put an empty token key and I have access to protected routes?''
   *    -> answer is:  YES^^
   * BUT
   * -> : your backend will not recognize a wrong token so private data or safe and you protected view could be a bit ugly without any data.
   *
   * => ON CONCLUSION: this aim of 'isAuthenticated'
   *    -> is to help for a better "user experience"  (= better than displaying a view with no data since server did not accept the user).
   *    -> it is not a security purpose (security comes from backend, since frontend is easily hackable => user has access to all your frontend)
   *
   * @param {'localStorage' | 'sessionStorage'} [fromStorage='localStorage'] specify storage
   * @param {any} [tokenKey=TOKEN_KEY] token key
   * @returns {bool} is authenticed response
   */
  isAuthenticated: function isAuthenticated() {
    var fromStorage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : APP_PERSIST_STORES_TYPES[0];
    var tokenKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TOKEN_KEY;

    // localStorage:
    if (fromStorage === APP_PERSIST_STORES_TYPES[0]) {
      if (localStorage && localStorage.getItem(tokenKey)) {
        return true;
      } else {
        return false;
      }
    }
    // sessionStorage:
    if (fromStorage === APP_PERSIST_STORES_TYPES[1]) {
      if (sessionStorage && sessionStorage.getItem(tokenKey)) {
        return true;
      } else {
        return false;
      }
    }
    // default:
    return false;
  },


  /**
   * delete token
   *
   * @param {'localStorage' | 'sessionStorage'} [storage='localStorage'] specify storage
   * @param {any} [tokenKey='token'] token key
   * @returns {bool} success/failure flag
   */
  clearToken: function clearToken() {
    var storage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : APP_PERSIST_STORES_TYPES[0];
    var tokenKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TOKEN_KEY;

    // localStorage:
    if (localStorage && localStorage[tokenKey]) {
      localStorage.removeItem(tokenKey);
      return true;
    }
    // sessionStorage:
    if (sessionStorage && sessionStorage[tokenKey]) {
      sessionStorage.removeItem(tokenKey);
      return true;
    }

    return false;
  },


  /**
   * return expiration date from token
   *
   * @param {string} encodedToken - base 64 token received from server and stored in local storage
   * @returns {date | null} returns expiration date or null id expired props not found in decoded token
   */
  getTokenExpirationDate: function getTokenExpirationDate(encodedToken) {
    if (!encodedToken) {
      return new Date(0); // is expired
    }

    var token = __WEBPACK_IMPORTED_MODULE_0_jwt_decode___default()(encodedToken);
    if (!token.exp) {
      return new Date(0); // is expired
    }

    var expirationDate = new Date(token.exp * 1000);
    return expirationDate;
  },


  /**
   * tell is token is expired (compared to now)
   *
   * @param {string} encodedToken - base 64 token received from server and stored in local storage
   * @returns {bool} returns true if expired else false
   */
  isExpiredToken: function isExpiredToken(encodedToken) {
    var expirationDate = this.getTokenExpirationDate(encodedToken);
    var rightNow = __WEBPACK_IMPORTED_MODULE_1_moment___default()();
    var isExpiredToken = __WEBPACK_IMPORTED_MODULE_1_moment___default()(rightNow).isAfter(__WEBPACK_IMPORTED_MODULE_1_moment___default()(expirationDate));

    return isExpiredToken;
  },


  // /////////////////////////////////////////////////////////////
  // USER_INFO
  // /////////////////////////////////////////////////////////////
  /**
   * get user info from localstorage
   *
   * @param {'localStorage' | 'sessionStorage'} [fromStorage='localStorage'] specify storage
   * @param {any} [userInfoKey='userInfo']  optionnal parameter to specify a token key
   * @returns {string} token value
   */
  getUserInfo: function getUserInfo() {
    var fromStorage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : APP_PERSIST_STORES_TYPES[0];
    var userInfoKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : USER_INFO;

    // localStorage:
    if (fromStorage === APP_PERSIST_STORES_TYPES[0]) {
      return localStorage && parse(localStorage.getItem(userInfoKey)) || null;
    }
    // sessionStorage:
    if (fromStorage === APP_PERSIST_STORES_TYPES[1]) {
      return sessionStorage && parse(sessionStorage.getItem(userInfoKey)) || null;
    }
    // default:
    return null;
  },


  /**
   * set the userInfo value into localstorage
   *
   * @param {object} [value=''] token value
   * @param {'localStorage' | 'sessionStorage'} [toStorage='localStorage'] specify storage
   * @param {any} [userInfoKey='userInfo'] token key
   * @returns {boolean} success/failure flag
   */
  setUserInfo: function setUserInfo() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var toStorage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : APP_PERSIST_STORES_TYPES[0];
    var userInfoKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : USER_INFO;

    if (!value || value.length <= 0) {
      return;
    }
    // localStorage:
    if (toStorage === APP_PERSIST_STORES_TYPES[0]) {
      if (localStorage) {
        localStorage.setItem(userInfoKey, stringify(value));
      }
    }
    // sessionStorage:
    if (toStorage === APP_PERSIST_STORES_TYPES[1]) {
      if (sessionStorage) {
        sessionStorage.setItem(userInfoKey, stringify(value));
      }
    }
  },


  /**
   * delete userInfo
   *
   * @param {string} [userInfoKey='userInfo'] token key
   * @returns {bool} success/failure flag
   */
  clearUserInfo: function clearUserInfo() {
    var userInfoKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : USER_INFO;

    // localStorage:
    if (localStorage && localStorage[userInfoKey]) {
      localStorage.removeItem(userInfoKey);
    }
    // sessionStorage:
    if (sessionStorage && sessionStorage[userInfoKey]) {
      sessionStorage.removeItem(userInfoKey);
    }
  },


  // /////////////////////////////////////////////////////////////
  // COMMON
  // /////////////////////////////////////////////////////////////

  /**
   * forget me method: clear all
   * @returns {bool} success/failure flag
   */
  clearAllAppStorage: function clearAllAppStorage() {
    if (localStorage) {
      localStorage.clear();
    }
    if (sessionStorage) {
      sessionStorage.clear();
    }
  }
};

/* harmony default export */ __webpack_exports__["a"] = (auth);

/***/ }),

/***/ 139:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
throw new Error("Cannot find module \"./header/Header\"");
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_0__header_Header___default.a; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__aside__ = __webpack_require__(820);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__aside__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_1__aside__["b"]; });
throw new Error("Cannot find module \"./footer/Footer\"");
/* unused harmony reexport Footer */
throw new Error("Cannot find module \"./jumbotron/Jumbotron\"");
/* unused harmony reexport Jumbotron */
throw new Error("Cannot find module \"./basicForms/BasicForms\"");
/* unused harmony reexport BasicForms */
throw new Error("Cannot find module \"./panel/Panel\"");
/* unused harmony reexport Panel */
throw new Error("Cannot find module \"./horloge/Horloge\"");
/* unused harmony reexport Horloge */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__table__ = __webpack_require__(821);
/* unused harmony reexport Table */
/* unused harmony reexport TableHeader */
/* unused harmony reexport TableBody */
/* unused harmony reexport TableRow */
/* unused harmony reexport TableCol */
throw new Error("Cannot find module \"./toolTip/Tooltip\"");
/* unused harmony reexport ToolTip */
throw new Error("Cannot find module \"./pager/Pager\"");
/* unused harmony reexport Pager */
throw new Error("Cannot find module \"./button/Button\"");
/* unused harmony reexport Button */
throw new Error("Cannot find module \"./label/Label\"");
/* unused harmony reexport Label */
throw new Error("Cannot find module \"./animatedView/AnimatedView\"");
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_12__animatedView_AnimatedView___default.a; });
throw new Error("Cannot find module \"./scrollToTop/ScrollToTop\"");
/* unused harmony reexport ScrollTop */
//  weak















/***/ }),

/***/ 196:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["default"] = earningGraph;
/* harmony export (immutable) */ __webpack_exports__["fetchEarningGraphDataIfNeeded"] = fetchEarningGraphDataIfNeeded;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_API__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_fetchMocks__ = __webpack_require__(428);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__types__ = __webpack_require__(812);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__types__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// flow weak

/* eslint no-console:0 */
/* eslint consistent-return:0 */

/*
  imports
 */






/*
  constants
 */
var REQUEST_EARNING_GRAPH_DATA = 'REQUEST_EARNING_GRAPH_DATA';
var RECEIVED_EARNING_GRAPH_DATA = 'RECEIVED_EARNING_GRAPH_DATA';
var ERROR_EARNING_GRAPH_DATA = 'ERROR_EARNING_GRAPH_DATA';

/*
  reducer
 */
var initialState = {
  isFetching: false,
  labels: [],
  datasets: [],
  time: null
};

function earningGraph() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case 'REQUEST_EARNING_GRAPH_DATA':
      return _extends({}, state, {
        isFetching: action.isFetching,
        time: action.time
      });
    case 'RECEIVED_EARNING_GRAPH_DATA':
      return _extends({}, state, {
        isFetching: action.isFetching,
        labels: action.labels,
        datasets: action.datasets,
        time: action.time
      });
    case 'ERROR_EARNING_GRAPH_DATA':
      return _extends({}, state, {
        isFetching: action.isFetching,
        time: action.time
      });
    default:
      return state;
  }
}

/*
  action creators
 */
function fetchEarningGraphDataIfNeeded() {
  return function (dispatch, getState) {
    if (shouldFetchEarningData(getState())) {
      return dispatch(fetchEarningGraphData());
    }
  };
}
function requestEarningGraphData() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: REQUEST_EARNING_GRAPH_DATA,
    isFetching: true,
    time: time
  };
}
function receivedEarningGraphData(data) {
  var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: RECEIVED_EARNING_GRAPH_DATA,
    isFetching: false,
    labels: [].concat(_toConsumableArray(data.labels)),
    datasets: [].concat(_toConsumableArray(data.datasets)),
    time: time
  };
}
function errorEarningGraphData(error) {
  var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ERROR_EARNING_GRAPH_DATA,
    isFetching: false,
    error: error,
    time: time
  };
}
function fetchEarningGraphData() {
  return function (dispatch) {
    dispatch(requestEarningGraphData());
    if (__WEBPACK_IMPORTED_MODULE_1__config__["a" /* appConfig */].DEV_MODE) {
      // DEV ONLY
      Object(__WEBPACK_IMPORTED_MODULE_3__services_fetchMocks__["a" /* fetchMockEarningGraphData */])().then(function (data) {
        return dispatch(receivedEarningGraphData(data));
      });
    } else {
      Object(__WEBPACK_IMPORTED_MODULE_2__services_API__["a" /* getEarningGraphData */])().then(function (data) {
        return dispatch(receivedEarningGraphData(data));
      }).catch(function (error) {
        return dispatch(errorEarningGraphData(error));
      });
    }
  };
}
function shouldFetchEarningData(state) {
  var earningGraphStore = state.earningGraph;
  // just check wether fetching (assuming data could be refreshed and should not persist in store)
  if (earningGraphStore.isFetching) {
    return false;
  } else {
    return true;
  }
}

/***/ }),

/***/ 197:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["default"] = sideMenu;
/* harmony export (immutable) */ __webpack_exports__["getSideMenuCollpasedStateFromLocalStorage"] = getSideMenuCollpasedStateFromLocalStorage;
/* harmony export (immutable) */ __webpack_exports__["openSideMenu"] = openSideMenu;
/* harmony export (immutable) */ __webpack_exports__["closeSideMenu"] = closeSideMenu;
/* harmony export (immutable) */ __webpack_exports__["toggleSideMenu"] = toggleSideMenu;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_moment__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//  weak



var SIDEMU_IS_COLLAPSED_KEY = 'SIDEMENU_IS_OPENED_KEY';
var SIDEMU_IS_COLLAPSED_VALUE = true;
var SIDEMU_IS_NOT_COLLAPSED_VALUE = false;
var READ_LOCALSTORAGE = false;
var WRITE_LOCALSTORAGE = true;

var OPEN_SIDE_MENU = 'OPEN_SIDE_MENU';
var CLOSE_SIDE_MENU = 'CLOSE_SIDE_MENU';
var GET_SIDE_MENU_TOGGLE_STATE_FROM_LOCALSTORAGE = 'GET_SIDE_MENU_TOGGLE_STATE_FROM_LOCALSTORAGE';

var initialState = {
  isCollapsed: false,
  time: null
};

function sideMenu() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case GET_SIDE_MENU_TOGGLE_STATE_FROM_LOCALSTORAGE:
      return {
        isCollapsed: Boolean(action.permanentStore.storeValue),
        time: action.time
      };
    case OPEN_SIDE_MENU:
      return _extends({}, state, {
        isCollapsed: action.isCollapsed,
        time: action.time
      });
    case CLOSE_SIDE_MENU:
      return _extends({}, state, {
        isCollapsed: action.isCollapsed,
        time: action.time
      });
    default:
      return state;
  }
}

function getSideMenuCollpasedStateFromLocalStorage() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: GET_SIDE_MENU_TOGGLE_STATE_FROM_LOCALSTORAGE,
    time: time,
    // for localStorageManager middleware
    permanentStore: {
      required: true,
      storeKey: SIDEMU_IS_COLLAPSED_KEY,
      storeValue: '',
      ReadOrWrite: READ_LOCALSTORAGE // write key / value to localStorage
    }
  };
}
function openSideMenu() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: OPEN_SIDE_MENU,
    isCollapsed: false,
    time: time,
    // for localStorageManager middleware
    permanentStore: {
      required: true,
      storeKey: SIDEMU_IS_COLLAPSED_KEY,
      storeValue: SIDEMU_IS_NOT_COLLAPSED_VALUE,
      ReadOrWrite: WRITE_LOCALSTORAGE // write key / value to localStorage
    }
  };
}
function closeSideMenu() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: CLOSE_SIDE_MENU,
    isCollapsed: true,
    time: time,
    // for localStorageManager middleware
    permanentStore: {
      required: true,
      storeKey: SIDEMU_IS_COLLAPSED_KEY,
      storeValue: SIDEMU_IS_COLLAPSED_VALUE,
      ReadOrWrite: WRITE_LOCALSTORAGE // write key / value to localStorage
    }
  };
}
function toggleSideMenu() {
  return function (dispatch, getState) {
    var state = getState();
    var sideMenuStore = state.sideMenu;
    if (sideMenuStore.isCollapsed) {
      dispatch(openSideMenu());
    } else {
      dispatch(closeSideMenu());
    }
  };
}

/***/ }),

/***/ 198:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["default"] = userInfos;
/* harmony export (immutable) */ __webpack_exports__["fetchUserInfoDataIfNeeded"] = fetchUserInfoDataIfNeeded;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services__ = __webpack_require__(432);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_API__ = __webpack_require__(137);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//  weak






var REQUEST_USER_INFOS_DATA = 'REQUEST_USER_INFOS_DATA';
var RECEIVED_USER_INFOS_DATA = 'RECEIVED_USER_INFOS_DATA';
var ERROR_USER_INFOS_DATA = 'ERROR_USER_INFOS_DATA';

var initialState = {
  isFetching: false,
  data: {
    login: null,
    firstname: '',
    lastname: '',
    picture: null,
    isAuthenticated: false
  },
  isConnected: false,
  time: null
};

function userInfos() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {

    case REQUEST_USER_INFOS_DATA:
      return _extends({}, state, {
        isFetching: action.isFetching,
        time: action.time
      });

    case RECEIVED_USER_INFOS_DATA:
      return _extends({}, state, {
        isFetching: action.isFetching,
        data: _extends({}, action.userInfos.data),
        isConnected: true, // set user connected when retreiving userInfos
        time: action.time
      });

    case ERROR_USER_INFOS_DATA:
      return _extends({}, state, {
        isFetching: action.isFetching,
        time: action.time
      });

    default:
      return state;
  }
}

function fetchUserInfoDataIfNeeded() {
  console.log("fetch data");
  return function (dispatch, getState) {
    if (shouldFetchUserInfoData(getState())) {
      return dispatch(fetchUserInfosData());
    }
    return false;
  };
}
function requestUserInfosData() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: REQUEST_USER_INFOS_DATA,
    isFetching: true,
    time: time
  };
}
function receivedUserInfosData(data) {
  var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: RECEIVED_USER_INFOS_DATA,
    isFetching: false,
    userInfos: data,
    time: time
  };
}
function errorUserInfosData() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ERROR_USER_INFOS_DATA,
    isFetching: false,
    time: time
  };
}

function fetchUserInfosData() {
  var _this = this;

  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch) {
      var _data, _data2;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              dispatch(requestUserInfosData());

              if (!__WEBPACK_IMPORTED_MODULE_1__config__["a" /* appConfig */].DEV_MODE) {
                _context.next = 8;
                break;
              }

              _context.next = 4;
              return Object(__WEBPACK_IMPORTED_MODULE_2__services__["b" /* fetchMockUserInfosData */])();

            case 4:
              _data = _context.sent;
              return _context.abrupt('return', dispatch(receivedUserInfosData(_data)));

            case 8:
              _context.prev = 8;
              _context.next = 11;
              return Object(__WEBPACK_IMPORTED_MODULE_3__services_API__["c" /* getUserInfoData */])();

            case 11:
              _data2 = _context.sent;
              return _context.abrupt('return', dispatch(receivedUserInfosData(_data2)));

            case 15:
              _context.prev = 15;
              _context.t0 = _context['catch'](8);
              return _context.abrupt('return', dispatch(errorUserInfosData(_context.t0)));

            case 18:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this, [[8, 15]]);
    }));

    return function (_x5) {
      return _ref.apply(this, arguments);
    };
  }();
}
function shouldFetchUserInfoData(state) {
  var userInfosStore = state.userInfos;
  if (userInfosStore.isFetching) {
    return false;
  } else {
    return true;
  }
}

/***/ }),

/***/ 199:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__earningGraph__ = __webpack_require__(196);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_0__earningGraph__["fetchEarningGraphDataIfNeeded"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sideMenu__ = __webpack_require__(197);
/* unused harmony reexport openSideMenu */
/* unused harmony reexport closeSideMenu */
/* unused harmony reexport toggleSideMenu */
/* unused harmony reexport getSideMenuCollpasedStateFromLocalStorage */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__teamMates__ = __webpack_require__(433);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return __WEBPACK_IMPORTED_MODULE_2__teamMates__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__userInfos__ = __webpack_require__(198);
/* unused harmony reexport fetchUserInfoDataIfNeeded */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__views__ = __webpack_require__(89);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_4__views__["enterHome"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return __WEBPACK_IMPORTED_MODULE_4__views__["leaveHome"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_4__views__["enterSimpleTables"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return __WEBPACK_IMPORTED_MODULE_4__views__["leaveSimpleTables"]; });
/* unused harmony reexport enterBasicElements */
/* unused harmony reexport leaveBasicElements */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_4__views__["enterGeneral"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return __WEBPACK_IMPORTED_MODULE_4__views__["leaveGeneral"]; });
/* unused harmony reexport enterPageNotFound */
/* unused harmony reexport leavePageNotFound */
/* unused harmony reexport enterStatsCard */
/* unused harmony reexport leaveStatsCard */
/* unused harmony reexport enterEarningGraph */
/* unused harmony reexport leaveEarningGraph */
/* unused harmony reexport enterNotifications */
/* unused harmony reexport leaveNotifications */
/* unused harmony reexport enterWorkProgress */
/* unused harmony reexport leaveWorkProgress */
/* unused harmony reexport enterTwitterFeed */
/* unused harmony reexport leaveTwitterFeed */
/* unused harmony reexport enterTeamMatesView */
/* unused harmony reexport leaveTeamMatesView */
/* unused harmony reexport enterTodoListView */
/* unused harmony reexport leaveTodoListView */
/* unused harmony reexport enterBreadcrumb */
/* unused harmony reexport leaveBreadcrumb */
/* unused harmony reexport enterStat */
/* unused harmony reexport leaveStat */
/* unused harmony reexport enterBasicProgressBar */
/* unused harmony reexport leaveBasicProgressBar */
/* unused harmony reexport enterTabPanel */
/* unused harmony reexport leaveTabPanel */
/* unused harmony reexport enterStripedProgressBar */
/* unused harmony reexport leaveStripedProgressBar */
/* unused harmony reexport enterAlert */
/* unused harmony reexport leaveAlert */
/* unused harmony reexport enterPagination */
/* unused harmony reexport leavePagination */
// flow weak

// earningGraph:

// sideMenu:

// teamMates:

// userInfos:

// views:


/***/ }),

/***/ 294:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint no-process-env:0 */

if (false) {
  module.exports = require('./configureStore.prod');
} else {
  module.exports = __webpack_require__(777);
}

/***/ }),

/***/ 303:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
var addLeadingSlash = exports.addLeadingSlash = function addLeadingSlash(path) {
  return path.charAt(0) === '/' ? path : '/' + path;
};

var stripLeadingSlash = exports.stripLeadingSlash = function stripLeadingSlash(path) {
  return path.charAt(0) === '/' ? path.substr(1) : path;
};

var hasBasename = exports.hasBasename = function hasBasename(path, prefix) {
  return new RegExp('^' + prefix + '(\\/|\\?|#|$)', 'i').test(path);
};

var stripBasename = exports.stripBasename = function stripBasename(path, prefix) {
  return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
};

var stripTrailingSlash = exports.stripTrailingSlash = function stripTrailingSlash(path) {
  return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path;
};

var parsePath = exports.parsePath = function parsePath(path) {
  var pathname = path || '/';
  var search = '';
  var hash = '';

  var hashIndex = pathname.indexOf('#');
  if (hashIndex !== -1) {
    hash = pathname.substr(hashIndex);
    pathname = pathname.substr(0, hashIndex);
  }

  var searchIndex = pathname.indexOf('?');
  if (searchIndex !== -1) {
    search = pathname.substr(searchIndex);
    pathname = pathname.substr(0, searchIndex);
  }

  return {
    pathname: pathname,
    search: search === '?' ? '' : search,
    hash: hash === '#' ? '' : hash
  };
};

var createPath = exports.createPath = function createPath(location) {
  var pathname = location.pathname,
      search = location.search,
      hash = location.hash;


  var path = pathname || '/';

  if (search && search !== '?') path += search.charAt(0) === '?' ? search : '?' + search;

  if (hash && hash !== '#') path += hash.charAt(0) === '#' ? hash : '#' + hash;

  return path;
};

/***/ }),

/***/ 428:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fetchMockEarningGraphData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return fetchMockUserInfosData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return fetchMockTeamMatesData; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models__ = __webpack_require__(429);
var _this = this;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//  weak




var fetchMockEarningGraphData = function fetchMockEarningGraphData() {
  var timeToWait = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0__config__["a" /* appConfig */].FAKE_ASYNC_DELAY;

  return new Promise(function (resolve) {
    setTimeout(function () {
      return resolve({
        labels: __WEBPACK_IMPORTED_MODULE_1__models__["a" /* earningGraphMockData */].labels,
        datasets: __WEBPACK_IMPORTED_MODULE_1__models__["a" /* earningGraphMockData */].datasets
      });
    }, timeToWait);
  });
};

var fetchMockUserInfosData = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var timeToWait = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0__config__["a" /* appConfig */].FAKE_ASYNC_DELAY;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', new Promise(function (resolve) {
              setTimeout(function () {
                return resolve({ token: __WEBPACK_IMPORTED_MODULE_1__models__["d" /* userInfosMockData */].token, data: _extends({}, __WEBPACK_IMPORTED_MODULE_1__models__["d" /* userInfosMockData */]) });
              }, // { token: userInfosMockData.token, data: {...userInfosMockData}}
              timeToWait);
            }));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));

  return function fetchMockUserInfosData() {
    return _ref.apply(this, arguments);
  };
}();

var fetchMockTeamMatesData = function fetchMockTeamMatesData() {
  var timeToWait = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0__config__["a" /* appConfig */].FAKE_ASYNC_DELAY;

  return new Promise(function (resolve) {
    setTimeout(function () {
      return resolve([].concat(_toConsumableArray(__WEBPACK_IMPORTED_MODULE_1__models__["c" /* teamMatesMock */])));
    }, timeToWait);
  });
};

/***/ }),

/***/ 429:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__navigation__ = __webpack_require__(809);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__earningGraphMockData__ = __webpack_require__(810);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__userInfosMock__ = __webpack_require__(430);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__teamMatesMock__ = __webpack_require__(811);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__navigation__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__earningGraphMockData__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_2__userInfosMock__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_3__teamMatesMock__["a"]; });







/***/ }),

/***/ 430:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return userInfosMockData; });
var userInfosMockData = {
  login: 'johnDoeIsNotAffraid',
  firstname: 'John',
  lastname: 'Doe',
  picture: __webpack_require__(431), // or from an url: 'https://placeimg.com/120/120/people', // or from a relative path (NOTE: this path like public/.. may not be availaible when in dev hot reload!) './public/img/user.jpg',
  showPicture: true,
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJkZW1vIiwiaWF0IjoxNTAyMzA3MzU0LCJleHAiOjE3MjMyMzIxNTQsImF1ZCI6ImRlbW8tZGVtbyIsInN1YiI6ImRlbW8iLCJHaXZlbk5hbWUiOiJKb2huIiwiU3VybmFtZSI6IkRvZSIsIkVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJSb2xlIjpbIlN1cGVyIGNvb2wgZGV2IiwibWFnaWMgbWFrZXIiXX0.6FjgLCypaqmRp4tDjg_idVKIzQw16e-z_rjA3R94IqQ'
};
/* harmony default export */ __webpack_exports__["a"] = (userInfosMockData);

/***/ }),

/***/ 431:
/***/ (function(module, exports) {

module.exports = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wgARCACWAJYDASIAAhEBAxEB/8QAHgAAAAYDAQEAAAAAAAAAAAAAAAUGBwgJAQMECgL/xAAbAQACAwEBAQAAAAAAAAAAAAAFBgIDBAEAB//aAAwDAQACEAMQAAABSW1S6zLBSy2C1RQReAAl0YyPeMnUaFzClaseplzXbwzYx3e/2ZKz3NW/BtClxH8uhGSojEPQtQRjpQXYc1W/AFYv4UnnoUcuaclLl6YELqEEriUe2SjILa6BXqUpgHY0skXPPY9ZDQ9nNfSzIORuBT9gDC9kI8J+viAXV9fWv657BuU/XeTGnbScqyEbj1XXk9RXNNAmjckRbBI9t4QcVguRbFKFxfQhoLIxk1uSxFrHm3L0tjl4WwEU8ZzwLznJPOc4KGUXSD6MmquzAmuvrtFhBLCr0H0z4otZt3j1+xzOgMmIZx5YDcVwlx52PR/ApmD10IYpfoLnjerlSyHMdrCPle5CH9SgUmJZIfSOdiJ1idadnGesLq0eMopTieBpHWVvoSG+VDn6EqJoHgj2XCTXxW2DvJ7aWxsIQYm3OqeSqSF3qm8fzt2ph2GVmGvcxB+loSrBVMp9H+OTBe+rdwabrMX+qvtb8VS20/5z2YrChHs0hdPVtaa43ecD1g01YgUG7Fqn7r1U5UG9DMcBxZk/IeuhwwxiWDCWFp5caIUz0gjNM2HnuxjOSMjvMSpQajlZWO4V1v8A79/2z54HUKWEV0BFvotbqrkdHXLCun0dROUDlQBnzrprUi+TUcOLJqlhKyplWDib5W7+e+8k1Q5BaouK8sWj4HK5ApBB0pGB8emu6dYsZ1qFP75Rt6mJ54XQWWGWjFn8wp012n9s8igzFQg1cjosNCLsvu8+N9Vup+ywzR24waguEN9HRCANUmayAUr3bQIwM0+BCPccARktHiADEYtbANWAwtRAsIzUQYG5l+gBUB//xAArEAABBAICAgEEAQQDAAAAAAAFAgMEBgABBxESEyEQFBUWIggXICUxMkL/2gAIAQEAAQUC9Waa/ldXPbbP8WIkiTjFGMPMD6StbkWrB9vWH8YPkSHPFXHz602NTW+vHfXXe+k56c9fWWRXnYv8UPOtZ+62T0B7zLiaK2SebQ3x6dQ2Npc0o8JDCq5DNWOGEkv8jDtb3yY31/c9Os0jDxFsKIlSFy5X01rvaBbiktwYe8XFr8fA1lpYfQ25caEZU8BAkNkJQMNKRaFKcaFF5SjtfhGkPVSKtGqVATm6UG1v1a1nOJLcMHjgxLA3xaz1BvxrLTS81Or0EcBsKklg9atxltXEQ93f6wFjMsyqvE1uSelZ+Dnu6bgtQ2dqQnFS9MpnlkdjQpSW9/UoHbgzFa62qTIUxrrN+O/o0/HbynXBhKmgJwrEZobLu4dVED8VpDenF61uWUbRuSWYwla2Iuyd0mvZJNT31LuIaFqcRlEZH16+njnjvBJcuFkC+ZbLFTH5sFOJ1y5VXkEOVQHjMvEmQpkdYzLbHHFjlbi8TtdRuPqrDR/YCh+HIXHPGtIA7+c1mtZFjpkStUkA5tHF9amxLGKgjpro+TFb/wDTaHUKpoZw+9Cp5sqYD8QC3XK3URQ9nx6zSd7zw3vH21rauCnV2Qkj3hfDrN6+K3GelFGGR8WL7hEVU4VYT74fhQRpEivVUSPLVt6BHnRJoRFerMoyJYFGzcgcOaHwPHeaRmkeW1o+eSAkoVbeKIkY/Ybg6gtYT4J4LJo7y45h0O4+ygdCHuLakuu/lpzU0FT0PMGYaTl7ONoXJ44Iw5NRCmF+5pv/AFe2c0jes8esdbznSpMEajRS+gdusNEt4tdl+1J1YfMeHy6YZHnA82uQX0WZTUCLVK00y7NkthxUewRBbZgtKnZxOUlxrLKCR67ddL/13r10hv48PlSfgjAbIj3Uep7j7kUGTzmwBHhj+1trolqIjiEbpceXCYexphMdPKLrG6gQhMzyBS1VsHMHEK5W8GEYNzJFYX2sjbX8UNfxTH1m0/C2tL1zDxrJppXOOYH7ETt1WlVp8RtpmXx9ZoSBG7aw2SJkh1YF3C/nbnKlk5U5mFJ3CeNmSc9njUHbIdlnbXIKeGtto7zTXnm9ZtOt5yPHsj9dmQnoT9LMbA2bn4Wn7cfIfgzBZ5wFuq2xxFr5XPMWAmoHXhAYlaoK49bPS5GwdAuhjDBP9ZGVmQ4QB+OuvX1vx+NJ3njkp9mJH5D5vHm9a/7y9NXziiSw9CkI3pGNb6bFEEMP8dGBhaAQ4PEk591oq6iV4757G1oJybMJ3YKBiKhBFpzw+dp32lO951nPtp2Cpzq/nre08JFI5Cp3Lj1RdqVCkj5Xr04tSEobDvzUO6vhqKPoagdhO2MdxnPrtMtqgbbLLbLKm9dfPXjrrrWa1n9Rp9U+6p33tKN5xtPfhHWWohofdePxRMa5HVGflTG5o15tQrb0x5WQXpoqXKNSyQh3bbMSlk/y1X1rSs213jiN6zx3huwB65Eup79ltKfjP+UjJi4culciNob3LZJQ7hxsRhYXpE0UIiVmzGY7HH17f1JpdmiE/uPt1O78UcEQ2ifFjzC47nt6xS093LkOtUqNfLORsJpXznXeNbT621ZHlyGNwLfPYXO5DkyWwXIlRdBiplZS/wDkZIsHb7IiBHQnxx51T2cEW5qXx5Zm5xgU2RhknfXtWg6kzrTPUlcvSdJ35JTja/4Ic1rG96Xi0trUjfkr26QzBNTxi5nKVteHrVrW0Ne5wltlL3ATEWJT/wA22jEMh48iMRjfsH//xAA5EQABAwMCAwQHBgYDAAAAAAABAgMRBBIhADEFIkETMlFhFCNCcYGhsQYVkcHR8BBSYnLh8TOy4v/aAAgBAwEBPwE7EggcsCek5+PwOh/EhZ9oAeQ/z8/lqQgXLNxkQmYxO/8AnQcStyxCgq9XLZKl5xAtkb+fhqlQKNmXiAL7t4CZSNzgez1MTjfSuKUm16lTjlHd2gGTv1xtpXFaecBwjxjfby0+8lUJ7UcvdSDCie6BAPvUP7dFQTaD7RgYJyAVdJ6JP03I1eMYVn+hXzxjRvzzEnoAkJH4m7XrVEDsriCMJWokmeoSmCPELFp8NPPcEoKtL3E6OkYq6hKEJVY8tUQEphpAdbTNvsNoO5jfVKtp0X0ikIaV3G2qRfaCANipCYHUFYA3zp7hPpBaW69VtMND/hVUpCXjEc7SUk43jtrfFJAjX3ZwlNyi7H83NIEfED3fPTrtIhxSUqvSDAUJyPx0xw3hFIm6i4ZTU9SZvrC225Vc29r5HaJnNwiCDB/iY/Z/TSeQ8q1pEZCFW+7IHy/POmeIFh6Kngz7yb+Wop+ItvpUJHMpp4U60GMqSLwDgKX1++0JRLNO83aeVJQkHboUKWTG2Y9+2na6srVzYqEjugLVbMAG3O/n10nh9U5BUl2NylarUnr3ffkYztnSOEFSQSGR5Qr9Bp9KG1htAPjeVKMjqBn/AF02xfjIj9z9P96TJKRnJA+mqVjhlA6hNdSsPpcbUVh13snGVKTAXBmbV9LYkZ19z1VWpRpKdZaUbUvEdiyjY90lx1QjaQknBtjGuI8Gf4clKlOJe5Sp1SByo5+zTzTzBa5Q3ygrIXamEnXDmqapQ0zU8i26i5wX9klxlVgsvzYpJuVcogWrPgNJ4ZTxVKapE0aKdh95N6kqfVNgbvJUpUWQUpXapSs9nidSI8SJEwJ6aClHz93ljXEG1EIcHs9+ACea2D5AZnON9dj2nDrmkXupqll0jmUlstM9gBHs3pe5tgrfcabV2LyOoFpzkquT12/2I0eCtVdFTvtVLYqFoQAgo7RC1GDapQm3cXTJCRgeCOFKRVJ4Xw9btRVOetrHlLKKNoAZTZntD/MSYyG7YuOq7s23qXh7r6Swy56TUOKt9YWUzBiU2zY20iAlKU2JGqRTZqkyoIbdUtKlLB8DBgJJtJAzBgEqzsXXPSeAvVS7WnrW2XsG53slpYQVRHOW7FkRHePU6USnaCDOD8PzOkrwJmf7fcNL5kPc8yjbATcUx7vdmMbap6h6lcSoGFt2yJkG0g5jG+xH56rlO1afvEMFDCldkspTDaXRHKLUgJCrgqPFXnr7KfaBrhzz1NWj1T0Fp0q5UKHLaZ2wepTbB3nl4fxnhqkVlQwhlNs9rUQEhLaRtf7QUObBgYnXF+Is11bUvsz2d6uzChlSEqmCJwnmPWQk+WmOLVSBUVCaekVcm9LC2EKRTpWtKQadOHApAcSAA53cm7Qr3X6GmacBCnah8vAi03BLK0LCf5FALkdCRGNEqJKccxJBnYT/AOflpVU82Si3bGQTIxn46PMVRkdUykJI6EfUwfhqq9W4vmvUYNgkYJO6yYtgY64mNcJWX+HcW4aYlxpNUwDn1rOTAzva37o21K0wSpQ8AkgkX4IPWQJHiNUXEKhNM9w29KGH1oUtRi4pRaYKtwmQDHXaemnuBV54azV8GNLUtuo9f2NiqtO0S8uVQbudtsNZwQ4M6ouILuboKmynqW1FtL7pZZQkDZt4BgqGYF95SfbCcq1xVbLfEKZhpbbqaOnT6TUNn1Tj7oS46psCEhCRCUhMiB79NlJveSrBG+4G2R1E7xPSeulQoyUXHxg+Xhj8NPWn1mYgJQkDr1Uc7/rOnFdqtahOCN46AR+uPLXD3jT1SFDrc0vpKXBaBnfMGPLXFeCWt+lU55VAKM4GIVBjuq6g5nbRkZg7pzEDG3vHTbwxpniFXT3ej1DrMpCVBp0ox1BAiZ+hiJiGK9nsHG3mm3pBPOnIXuOYQrEkyTjpptxb5DZu9UITcs5RgJRzcsAeAEm7rqnSpCCLcnJHl4R3fPGnKS9ZWHHYVBFpMbD+tP01U1ty0hrmJNgO4RMArMYxnHjoeHniPDxjfb940cTE3AgjooHoY+GqTjh9GNNUpK0wBPhsJ2/fz0zTUdW+tCXgwgglKnpsK5SDdHSbjhKojYzp37FMN0K6tFU5UrSlM+jlux19aglLKUwVCVEAk+ZCMaqG0srKAb1JI7TYpSsRyhQ70bH2ZGNtUbVzrSFZUqIJMFMxGRBBmYzPnnTDr/pNZSralFOtvs1h2VuJWw24omUpyFuFNsnlAVMkhJftMFtwnyujptA+ekgemkRgBUDoIujGiBfHn+ujvHTl/wCv+dd0mMco+c6b3H936a9LqW2Vdm84nljB6KNivdKVqTO8KI66bysTJ9Ynqf6f1OuGkqr0k5yr6EfTUC4qgXTvAn8fgPgI1W1dS3VOoQ8tKQUQkHA5Gz+ev//EAD0RAAIBAgQEAwYDBAoDAAAAAAECAxEhAAQSMRMiQVEFMmEUYnGBkaEGI1IzQrHBEBU0Q1NjcoKy8NHh8f/aAAgBAgEBPwHgG57dfh/OuF2HwH9Ap12xHP4ZHGtcpNNL+8ZJBpI90LSh+uEmimDrk8iIxf8AMZRpG1KtdmPoK0pb1iWVYJK6VN9R1Iqb70u/yK19L2nAkNVq2qiiguxqTyrckdrFjWtBTC5LNHmELLfdhvf1v9e+PYpeocEWopFOnv4zzPl8nI4Q1fTEjfpMjKuoH3bt8jhI2YMVppjALEsFABYIPMRW5G1TS+wJxwjQktGAv+YhJuBRQpY1v2pvfEK5cuvGMUMdLt+bO5NqckbqD9QB17Yiy0DI7wZrMR3NJPZIYVApWglecSVvy6WLUBtiIeLzQcOHNPPFDU/tFS1anoHJvU63IuAD0xPG6tpnM7tuW4ipHzdCS77dkYdyO0OYaAkJHCWJFH4RaRNv75zXf3TWtmF8e256oUCoNNqVqelbkn77UwF8RI2H+5Er9748U8dz3iggjlb8mKRZDFqYQNpDaV4IIBu12JNAKDzVGk79D9Pp27YMd6YCGtRUEfLthM21uJHFMbCsqlz06MSO3SmDJlpIqRZxMux3jbKmKh7BouIhBOxsT1UY4CsbzQsT7xHbfUowVykWmsiEmn76AMf52+wwcwFqEeJDUBNEdWAG51mov1+2HzEur+1SD01KO3TGfkEaiNIYA0ytziOMFQugNoAWxow5q2N6E408zAV5XZKkUrobTq9AaagL27Yk5VZiNgWufn8Rt/5w7eI+IFlymZmhZWsyisLmvkDWJt5qEkDYVOIMxHAixz5yMyImqXiODK4WqkKWMaqARQ+YjytQ4yXisWdcoiFOdY01+aRivEoEApyxc78x0qVqeYA5xp4pJ8xl9PC4PK+gs0cgJvpqNSMCq6VA5lH6y2I/EZ9WSSduK2ZnhTUPI1G52RSKA9CU1IBbV0w4r73rXbY/S2/rjhE3FPv6YzsKuglK88K6V6crSQ6yfQKCfljMSuM7AsjIMv7GzIDQK+ZSdPaHkaw1LljlwgrsHahq2MwhZc1HqB0SSoDH/h6m4bKK+VkKN8CMZefNRTSgoTDl2Z5dMwimRVJXkWSnEVqHSV5WagY0qGkzwzEZz/iQEOVQiLLpww2akvUMGNlG5/UbvXYY0ngHxHL5cxSTxPDloFLHhxzMiq97mWT82SV61YvqJO5mjmaB10kyKi2Gx8o01NNxeh39DtlMs6fiSDKsWdYm1oGNUjqvFdF5moqyah6bA2rgA3rt0wQtbmn/AEYZNcbpbnRlFetRS/YfKuGijly0mVzUKSKaq6OAJFejIWRt01BiKXSRSNQYAEZKGLw+T+rWzIlkdeLGJLStCdajd2JKcB0rXSAFpSuPxH4DLnoUmyxpJCTqVVI1RvU6xzA8um9jWtiL4znh+cj9nhlMjayvBhGpmdyRslyCGIjuKk/DHh2Uny8GXTMVLqia9JrHHVFWzHdlp0FK3od8T5CCUxI02aBjKR+0RzPE0zohak2nlYM0bVOizaaEFsZPKKvi2YlW3DykMYqdeqjyK3M3NXmW5rqp3xpsTsKj7/8AzFD2wt+wA+vT5YzccXFE7SBG0aQhF2p5fKNV2ruGpU0NBpx41CVl8L8XRa+xZr2fMU6QZnTp26KRLY9ZPXHI60pUFR2NQL0r/qoVNemPEcpC08GdMZM0GrSKUB4lb6a+ehYdfMDuMZfxXLSeINlvEUzMJjI4Id3XLFl31QjSqld0eXi9wy2GJ8vAI5M3DrmhNJGhy4WR5NJ88bOxUhf0hNRtoYU04/DXtWYhzmezSPG+czI4UMyBZIoIdSRqetyWNTS5qLUxKtKbdiBt6W7+ovTGgdWoe1D6emFB22ruT6Ut/wB+mHBkzUkjGoVyke+yEgMCacp8wt1r1xmY0nyeagJ8yKy9SrwukoanU8lO/N8MeG+PlJWy2YWgR9DgV1Ia01AHzJW5Xfcj9JdVkXlIaumx3uadQNqj59MTZHLyft4o5CGrzopKmtqV+2JIMxl5uJlWIZlWNlFCOHuxo+pRZFHKOl/XIIQskhJXXp1R6VA1Gp4lQKsx97aw2tiWtKjb47npf1NP/WAVA5ljr1qBv98ZrMrlYpCaFqGgBHmAqLWO5XVTo3cjCCwoKWGofK9T1pv64XlGw20n1teo7fU748R/D6TScfLOInbzWrqI7ioJ+l6XGGlz/h+TRni9pdZFUrANLcIVICB+UkcoAYr2rUXi/EmcmziQNBHAj6nb2hZA0UMSa3kdg6x2VT8yBXesUhk/MNkP7MkEMU/Uw1NTVuq7qtK3NFhmBMmk0VGWp70rWg67jviQLwIZFPPIDrWmkIRIY1pepDBdXSnMPiI4SKlrnejUv8MZqpyeTqTVoKlqnUSZRU6vNU6R16Y7H3V/41/lipo3obfwwbgV/UP44kAOtSKjSLH64iROOYyoKVrpIqLMh6+qqfio7YzLFYZWFiqWNsZZFVI1AoOCDud20liSTUkkkknfDqukGlwLHtWtfrhFDIpIBN707PQfYY//xABQEAACAQIEAwQECgUHCAsAAAABAgMEEQAFEiETIjEUMkFhBiNRcRAVJDNCUmJygZEgY6Gx8ENTgsHR4fEHFjRzkpOipCU1RFSDhKOywsPk/9oACAEBAAY/Ase7HpA3szOpi/3DcH/6/wBL1MbPbqR0HvPhhZyaeJHQOAzuX0nfokbC9vDVgPVzXhVlOhEYcXfdNZI039ttvDGn4tp7qNWlryDTtu1yTvfx3waSlSlpZmtxkpI1jRIzY6Z9Ck7gAqpYk97Ta2H0MGX64B03/G2FjF2FTS1Ub2vYBFE4Jt0GqIC58SB1IxfF/DHXH92OmPzxnzfWznMz/wA7N+leORkv10m2BTDMdMYUJy01IsmkbW4gg1j7wIbzxHDPRw1hTo78Us9iW9YOILk/WBHuOIw8cdNxCfVZWKgzOh5VjY65B5WAG+O11TZXlCyAtFS5lVvJWugF9b01HDVyw3P/AHgQHytZsR09VJIsDNq+TQ6VbT4lyCbab6dZX3A47LldFTxTuNNXVtGs1VN0tHxX1FVBBuo8elsdlzSOanWWnSpop0R5u2gu8c0aKiWjenZBq1tpKyIwa7BcEUuW184B6zNFThvPlNQQPet/IY/6jI/89/X2PFjkn/P/AP4T8GZZpJpIoaSedUdtAlkijJih1eBml0RLsSWYWF8VNXLYSVM81RIFvYPNI0jAXJNrsbXJPtPw2/eQP2mwxrery2EaddnzCmZrWv3IXlfV9grrPguCZc4okt9FIMykkb7nyFU2+1IuFJzDMswJUEpS5elGmr6hqKqokcMPG1G48Qx6YjSp/wAnq5lUKfWVWb53V1Tje500MVNQ0PuEkD2HUsd8UwgyGlyatnZYdMWSUaRJq2vx4A50Do0jBDbdha5HBnjjeEixQcmw6KQunYbWHlbGW05kySNKqqmire0qJqunhiy6uqkeGOHVN6yoghph6mXVJKkQUOynCrk2RZtmIVtqiWmOU0BUePGrkjm0/dpHa3RCeXFdVGqp8kp6qsesXKsqTtTRtNFTio0VtchMS1FUtRVT8Kgi9dPI8UiarLT0zGHt9PLHIsxPaKsxIpV46ydtcvBkAFxJJfWFdR4MIYo6OlhsNSpRpLJI3saX1PKPu83U26YCmCnY+dIg/wDmcHi01KW8oEX/ANot+049+KHLo5Qr5hUl5FDgPwadbbpfUY2aTrbTqTrf4KPMKiqRDmHGNJTJE8sjRU8xp5JpX5IYhxUdVj1vMdOpo1jdHYesP+7932vf/B2Ldpq/jXj6Vj4UfZWh07Ncm681wzGS4uloWGtlJkk0gecY/e2r8lOIIqagarzbtEzVNZJVM0JpWSPgwxxtRwqro6yFvVyk8QfKZFtFFl5OS01TAtTHxoYIaiaqkgLWlWNVl0GThMwHqlBa17YEk2Q+j3o/E4B7RUU1TXVhHUaKarr6pICO962OOTpviSors4rJatlKiSjjjpFBINgYbzrwwTfSnCBAtte+EGfZrm2aVHDTiPm2dVcdO9hzuKftUUQjc3IjcOqrylmthFyyiiqAraU+JMsev0uFPemoaeSNDY7tJMDud+uGjociSiViPlGc1sMW23N2Wh7XN7o3eI/WKeFs2zipn+vS5ePi6gO/c0QM9VLbpeWsIPXSMCKnjSCHv8NV0gsRuxH0mP1jc+eN8EnQPMgE4DIW3PUXsevlhO0vHHGvM8UIV5H+yG1kA+32b2vj0QjkjkgnkpM1kkVbystMJaUJK8feW8gcaidJC7d04/vB/O19/LEdK00rU0UkksUBcmKOSUKskiRk2RpBGmsqObQt72GNwT7jb+o42W39L4FJo0kK94SSy6H96o0bj+jIMR0M+cZZ6LRWsJP82zU0pbwEs8Fcai/62WBxfeVwObC1lL6cNmOXO2jjZC2RCAMOqGaCjmngb9U78UfSN7YDVldmNewvft2a5jUpv7YlnSnA+zwdPlj1GX0cX2oaSCO/9PRqPTxOOF9HYWvsPy5cXCLbpv8AvwRrXUPDe/7rfuxqee/3pNh+HsGD8qhXbuJ6xum3KGv+NsWp2LrY3Iup/Lbw9pxeSaU28NTAA+NgNvH34tk3o4GkBOmszmuqqmWxt/I00sFt7mzVMkf1kbElTUupeU3ZYooqeHyCwQJHEoH2V67m7En9P9mO05TX1mX1HjJSTvEWUWOmQKwWWP2pIGQ+ItgDNaSkzUDbjJagqm++1OjU7dN/kgYnq2AavKc2g6X4ElNVr43+ckpDtvbbfy6Y1CoqYT/Nz0Miyf8Ao8WL/jOG7LPUTN4DgMqH3F9x/s4do6gxqzfNxwtsPN2X+zENVS5fmM9PUvw6epKxx00kpSSTQs80iRa9EMraS4YCJtuXA7QtBSdN6ipaeQe5KaOVCf8AxgPPCmvziokH0o6Gmjph7tchqWPsvpU+WABlUdS3RpKx5Kl28zxGMan/AFaJhVvnd1a5f4wj1uPqOOyFNP8Aq0R/t4qqxpczbN543iyegfMY2eWpkGhJmiFOr9lpT6+VmIVtHB165EU/xv8ADBAjW4roh1kCxPXm8FJvv0HjinWaOSk0IgqAlQ2mVwAJOaYSWUnmDKV36bWGOJQNY82mRpDUxf7SSqdtwbsbezBo6GsjzCRLKTSgtEGBPIrEEyH2lSVHQMcRST8CPisNMXHhaqAPi9MjtNALfz6x+VziyXbxvbrfa39nsvhAw4b9QW8/Dz1X/gYOWGVo2qiGkzGUqjZckDa70od0EkkuyW1SAqfmbpdZqGoMaVIkrFlmn0gKKKYUsrIIxovxOVQAATzA23xors1aocd+GDREy+chJkKpb6QsLYrp8jzHMpKSizwv2eeVXopYY6F6KOojiCArKZMwlAl1c8OnWvdK7fx/h8MqRyGCSRHSOdVR2hcqQsirIGRmQ8wDqyEjmUjbGdLLWVmYGHNcwgSqr5uNVSxU9VLDE8z2VdbIguEVIl7saKthj0a7NTwJEKCuWQxwRLLLmEGYVPamkqAgll+SSZe4WSRhHcBFUd7c9fDe4F/3jz3646fxf+zb34p1gHMDe5vy2Gx28+g6dMGpzqceqRUGq41tZVUsV35nPdBuTsLmwPamzbskdTpV+Bl+c0VVN1j6cOTL8zYnUohqoY4j0WQnbHZaMUHoplc/E7LQFkizCqgj1B6iu7MnGdrfORuyRQOeHoU3JFRm2fdpbvNTUsYp12+izu5la/1lCbdDffGYS0cOXx0VDC3aajRHJUSVGkaaOKplEr9qlYiNIo3aYySR2VSVvl9dmQeHMc1knnp8v6mloxp4RnBBYySkiNYzYLG3Pz3Vafg1JSpgnhqYGiuGjncoNClugKy2a/Ly76tRvlPpICKmSoarjzMci1E0lK6Pqi20vLPCNRjspAjDDVfEobh5Zl/Fki7JTBo3ljRyoNXI7PI7sttUY9UNrxi1sVtHDpaMU8pOlbc6Osh3udR1RLv7fIY8vg9vh8HpE00Wmlk9IM0jp5Nt9ZgzJV094fJcypXDEBX1HQW0NbJ8gzSOKfL6bMJs4WGWzLLopkFTSFT3o6swUbOp5SKYgghmIz/MqWlp6PLRmklFSw0cENPCkNMxhgtHCFTW8MQke3edjva2KSLjRVMVdl9JmNLPH/KU9UupCwuSr3ButztaxKkEx6b8yseGv8ow30EXHUEi+9vAb4E8sLMhXiRoBrCnoe9srLqtcp7vOB+yNNVhXJC200nVeHR6+RKyU9/MWW1PHfs4ll0qA9MrVFcyoirFHanp4oz6mBNa2hy6hk4nASdmlzOtL11URBDaWXKaqoqavZBIlDYuZB/2dKk2kXW3zjc0krd1FiuuKOozOCMyU0Zlo8tW3ZcrZiTrZ7ntFa99c07XCOTw2a2vFQxj10uSinpk1W3kB40o9h0s1ulrKfrWxqmBcJOzi5Cj1RuQzW8LIttuuKWGCVBU5TWGumpEtxBCEalncJ4/JKgyNbqQvicZmsar/pE7Jc6tMcjmSCVNhfXE6g7D1iOvVTiqqLWMiBNvbKyCS34vfHuP7N8dOt/hr87paf8A6Qy2qocwqGQXM9NEjUE5I9qQTxSyv/M0SA7IMZFmDnRFFmMKzMdgsM5NPMxHTljlYn3Y9J1yrLxm/o0lYKuSai4Fa9HFI7tC0sKt2umlWLllbhWPD1Aso1Y9EM3pAVqKKjl9Gc1TcBKihnqKqgn37y12XVSqCCQj0E6HwxBVwHTNFIrC3j4kEewjrfbFDUvwVrJqaNp4FPzMhLgqqnfm4Ze2/LZjsykmTTFJqcNo2Hje4I0FLeIBOroeuGpMtjVZXHDLxgAjVs7m24ew2uT9G2wAxBWPEhlWTXGLbCQMbsfC/nuSRe+9sVNfWvw4KWBpJGPX7iL1aSRiI407zuwRRdgMZvneZMYpswzSokgg2eS812jhFuoj5Vd9kFtiSQMHssMktOWkd5EhZruWv4LyeBt1G3najpIy57bPHCrHUpTtEkUfrgfocxU3IAj1eNhjNaanbi5dmFCK+lCHkjkgq3grIY/1TCSGam2AVG4Q2GrEa7qk0sjKp8ViYp+Nm09NsNf8Me8fBc4zCglF4a6iqqOUHcaKmB4WuPuucMo6oxGrx2P5YyWnzjPZfRH0koUTL5c2ngFXknpFQISI4c09bG9FUqtl7TJxICbvdHO0S5dRZdRUtRmPxtV1uXonZ62ZqWdEnvANJZ0eQqdK8RpSzseo6XO6dR4ixIPmCR4i18UtM1T8jMoYQycwfmjXSPHWI1fggWu9h3XYGKQjvojgBtQsygjfx2/DGloVcnm02G5+1/X7cKEjVNO6hQBzfZUf4DxxRvUuIIZM5gWqLnSG4Eb1MI+72lYDYX7u/TFFPUtJDk7VsNKZbncSLczINzHcRE6dOu5UlQWxT5D6N+jmRZmkVJHx8yzCStmMk25MMaQPDwmVFAveUu7am0WsaDN6z0cky3Nq2naaOmgiedygvEJRxpAKWOSS/B7RwjqGxJjuIs/y6octSTnKM1oZjHxMvhmANPMFjvqiaoB4j+LMdKqsOKWlvc0uW0ynylqS9TLceDOjU7nxsVx+P7sdPDG9htg4dG7rqUNiVPMLGzDcGx2I6YfMstpzJ6NZhM8lNIqs4y6Z92oKhuqBDvSO7WlispLSRy4H5/j+3Evo6ZnbteWVMkCNVSxR9ohi4hUxLIEaxDlQY3H0nFtsUkFYCstVHPMUPWMLVTRKmw7zxJFJb9Zp6g2XiwSVTuY1p1jaxDNIvrFFrtJYeqToZNOq4uDRZZJVVszrGKiWpnLyWfT66BbBpBFTlGA5dAC6dWvSrNRwKaiaukjgy6XcRbQyNK56F9Sx2VbWZurAW1TZzncz8GGwOgap6qqkvw6WmTZeLMwsmorHGgaSRkRGIE9TAkWS5bPqoMqiuKemMp0JLOw/0upK8r1MgNnLiBII3CFUlijRYTqSCJjw11W4jm+sySaeUayNAvpF98STcLiPp9UXGnhkW5wRZg1ze47w/PGWVnbqiepzCO1XpnL1aVNE3Zo+65dIqiALIkLAXmEsigoUJy3MKTKs1FBVVUdJmLcKohiaLWryPVFk0cIWLapdjKoW6OynGc1bW1VWZMw090Cnp6ahCDYW0Cl0Eb7qcG439v448NsbEe4/B+/FVD6O5VluerU09TTZllFasoqJ6WeBkMtBKlVAnHguW4DxyPPtwCJUCSSQzQTU80bMk0E8bRSxOPoyRuFdCL2IIv5YyTNegosxglmPiaV34dSn9OB5VBvffytjLM0jjUslRwmkA34NUmoXb6gmjsNR7z7d44grqbhLLSyCZBJHxFV497lTcGxH5keOKpKTMON8YU8SStp9XHrhgqSV09G4vEpbW7uokBsZXPmjy9kimMK7ApDFK8ZTvBNIThx6zcmx1Hq18oyClnXsNDrqKx0YMe2yBkYddN6aDlVr3DVEvXlxJP6QTMIWjjmhyijIfNq1Qw0y6Eb5FTFiD2ipdVYDk1+L0Ho/6PUmU0UkfZ5qio01tdNGxFxJPURuV3IOmGzIbaJBYWOXx02RcZgFUZhHChqdRXkXVRzanbSp0F0L6Rs2nbLK6o+IqF6WaKTL6ZaFWhjaJtKSBFWnguD1PDY3uHa+oGpfPjTCrpIQaiaGUtTkxOC3Z0cAxM9hyFpNtg1jYUOYSqRJmKz5hICCD8vqZqzx9vGuPI4N9vfgkdP0JqqodYYKaGSeeZzZIoYUaSWRz9VEVmY+wYqstyH0cy2oppY5KVs7z6hhqqp4XBUtQULi1LfrDLVSSuAQTSwSjbZeXYdenjcjGTTll48+WJRyyFh6vMcv5Fkc+Hyqm4r+Jjcr9LEtJVL2aeNysyPsQy7W6WZSLMpvpe6kXDA4I6/mwJUdNhuvj/iMMqW59Q71rhLkbPpI3IBHXUBta2IZ6h2Y00MjQKRrMkujlG9tPN4m5Fg1mI04kaWKnqK6tXTW0zxQCRKdFEVp5XPFqE20hX1m2kACPmE8uU54+SxSkuKWqiWenjLm7LAQUkA66VJcqCQpsdvix81ocxDRiQS0h0mNBcFKiGQrJBLvdQNSyLujauVaT0czbK6vLuwqiQ5pT1dbm1JLdVBdoqueery+/wA6EopqikDuRHR0ydCvonE2fRT8KszOqomMsVDTfyKVcraUppZ2A4UNQ8c8oEgjic4yaibvUuWUFO/34aSKJ+tj3gfAe7BBxo6/oHKoG01vpNK+XC3UZdEqyZk/9NGho2H1K1j4YtfpvcG3T2YBHT8Py9v8e7Ge+jMz+ugro6qnUt1irVEYWPccySUrk6bfOL44eSJeFmNOLQTNypUx/Rjlax5R4H6DXW1r4koqqNoZoSVljkHdYGxYddSEAEMtwQLrZMKDazgnkCNcgd0XOxY6QfG1yAe7hSt+QC77NduqBSTsNO9jzHvWthexzTQzJI9S7xvIpEUEbSSHbw2uRuDYbbYemeqnUxz8BFpZ2aV44uUyNNKJJPWdCAUV2LEKLjGY/G9KMynn0yxipkfTCkapqvY+tI+n49bbdIoc1o6XKZIYNNLnOUxJDUJoW8ayLwwJqbSpThVJPKAI3iktIsPo9W01H6RehkmZRV70RlggkqKxpJ6ePiqOJNaSEyB6eaGpgjcU1Tr0opeCGJJY44oIYVinmWpmQJGF0y1CpEs8i6bNMI4xIebQt7YIxbocb9fhTJkIMXo9lsEem97VmYoldOb9BeneiW3hw/eAD1v+7b2fVH9+PK1/2D22/L8MRxrJp48Tx9SLSQstTCdtO44JAN/pD34gqk4ZeSJSSliuvSA6m3jf8b4rKmtaKiq6RTLDmCraRUi3YTW+ch3PKQSB3bG2JkD8dIZCOKinhuEPzmlwGF/AFQ29rajvldIFAdKmYSJGNNtRIjtbvO0IUX+kzfWGKGooXYdvofWa9DBRPHJHMO7yhVbq3dtrJAw7hbtICsp1DyOxACgfS2JQi4G1sLXUcpiljYhTGxXUrrZ1exAAOvQ6HrYggYp8n1zTOtRLISZWfVrBKKqkcgVtydXd1KbahiKlW5eLeZ7Ao8rXGhD7IhyG3WQ320EnIq5t2my6FZD+upvk05v5zQvbyOPPBNvfgdfw+BqzOK6KljVGZEPPUT6NI009Ol5pjqZV5EIUsNZVTfGf55Z1jzLNKueBJbLIlJxNFHHLpJAeKmSJW0uRrBs1gDjy/r6jHtHhuOXw8t+W3S218QVEfzsMsbL95O9v1GvcE+8Yhp5ZIjCw0d4KVbwQj+cG4ta7bfiTR1ADTA25o3MZHVGQ67FTsyspt9JcfHF47VzvxIaOCmijhkQskatHSqkSCdFjlVgoVnJWQiXvNnJLxqhh4kbhQI5HqWgYC9yT80RpJG7b9Lr8X5dPmcNOyi8DB1iM1rRyM5XhXKMw1EKL/aGOFB6K57I5KgfJJCnsAWRhwpAFVQCHYfV6FsPktZlVTT5jFTdqqadtBNJAVDiorPW8OliZShZ5mW0bCRtmGGWlJLPqgeQhCEDbPpcEruRs6mwTdDfmUFjZRcKo7oPKunpq30+e3sxlHaUdilXnCUzklWEfxjOQEY35BI0gsdSBtQtfo0ZvcHxGlvHqD/Vg+Ptx1OGavqhVZi3LS5PRETV9VO1+HEVW60qMQRxqkxpYNp1kaTVVdadFTwoo5oY2vHTgFp4KKN9jwaMS6b8nGmMlRIgkdrE9SSSL+259vsv+WOYC1vK/n47Www0833eo9h39xFx7d9sb8t/q9dutz+O1gb+eOLFKyt4gdGA+snQ+PXw8RgWqJYCHDEozsuxFmMZL3sRboeXx9sC1M0lRNEVTUHfg8JjZmj0tcP3dmA1G/W2IMk9KVps0o5HDkzxlmSz8mvRZ9rDmDK7KA7qeUkQ+j/xbFSGV6hEotAidZTqXSFA5kVtwd09g0gDOczyqFZ81ho+yZTrClPjStPCR0VuV+zJxJbNsQvMpBOKz0fyzMHzLNM0keT0zz/Xxe2VLScRsqpKo3Z6WCUHtdQpAqn1xqWg4gldha4DXsemnT7TcDT9Kw39ltr36XX/iNrHqeXTud8UeVUVE1M+QTVdHUy6i9OzyTisWYGQljLUdufXENSxNG+4jaIYlWgYfG0bRvSFW4PEkglhn0F1tpWXh6Gvym5RticVpoyNNJX11BIn00loqmSnfWNTWDmPiRnbXG6v0ONj0O4W5Pv2/jbFG9SZJSr1U13JY3gTYnUxJbU2oXY9OuKyeYu5qamd7WAteaReurw07bdNumGj35XYfhjx8Pqn94/jzwfZ7he/S/l1tt5eIxt1tfcA9On8DrgL4nfy8sBjq5dvb0t7TexsQdxynbffAAuum1v2+z8f7DhbF0k2uV7rc2k7E8tx97ysNsR1VBV1FNNGysrRtoIZNx0JDLcd0rY+INziXLGzGQmsRlkqSZOLEjronFKOK0dO86Eo8kUakKz6AhOoW36nfx8dW19/s7jzviKJGtxZVjViOmojdhc+W1zgxU6usVLeGLW3MWj+cme1xrmN2IGybKptvjM80kaoNRJnlXSKiW4IpxTZTK2pda6pGlGxYNw1Hq9PEl1cizAXPgl/Dx4nljtdPSyQT66kmSLkMnap5KmVZtMoEycaV3RZQyxk8gXAiZKjTUZK8nK2neirkUXHEtv29txubb9Fx/8QAJxABAQADAAIBAwQDAQEAAAAAAREAITFBUWFxgfCRobHB0eHxECD/2gAIAQEAAT8hCuyRK5ekJew7rVwSfjPq/wB//o4nhAvk9H3OSXwexFD9KD4Y6xAiRK+RQARKa8uEdz1pMA7hrapbLhiBO4co17Mk7AR2+nKBU+12XhMDluguFeA7XE0MQCQ7O87NZuce3z4/XA7BrafJ3/X3x9488vn1iPqSe5P7/rFB1uV+2Mm1re7H9v8A6YUXkAz2HcBYVWQo5ga+5OGTr1niYl3A0+5oLNos25Nojg+M3cVIvbCAIYpo0AgxA7DqLtDH4uX0WDIdzYBKHmjkd4RA3ApQIwJR0OJqv6NHS7CYGhaWJ27CwuzcPPnuPgDSPbr+S88TBjry+OYV/K5waeMwOiw8C4AWaSSCBKO//UASvofuofdzczIiNRIMNEaCLgZBPYN4r9g7wexKnIShsO0FvdBR5leMoQmaT+QFdT3HXpQ0VisGUGBADzBTSPDDRNLbeJArKy0jlCw2CjgIaJA7n6YIA3EeEnQqGDenYsDk5Czha45VnciifJ+PQd4WPBmL132xvXyfyUVXmPmy69p86xpn3Xp9/wBOY5Se91QHc12I6Lio29bRKRuFkk8Df1YmvAd37cB9MWFrUgkqEULbsJwidGdCU4Xd+9eDNPe5ag7nYCCMPTKmY3gpW2egn/8AfV6OriFqBM3h2xYMMZPSNmHZ6D0dD11sgBLBPEhg72xCqK1DcoAVRsCK1CCi4Yd7wHMgLRRGqgVr3weAwdQ2fPtoJXwJqfW+eZK8OnH01T14zVhSkOSBxs+mn1gWWa6vLIaoViGDen2CsHVEiHRmk1uyQlQ2xpvr4jiNTv3KgqmJB4meR4B/Xf6/rigM71rq9oGjV1y4TyL95/n/AJ+mLO9U/wAQU+qdlmaTPJ3m7je5DQlxcPAsjxbpdGEBMHeQ6G4jwS/RjG6tpNFrqnZbLt3no5E7R8cD9D3ip4aUP1W56/XXM8CcivHWob8UE+l7J1qOxIJSmuTNtSErvpCTVnGD54J20cC05TKGc1r16AxrBagDyZStXeKWfkiq78QNmMEW1HJDd8MOBtWBnn+Nfn+//LU+fG8jtjL/AN7D65t/M5+T/eT2fQnlT+8DyiUIB0GkgkXEEqcSmjRZKEm3mXo0EMptoEiKlZwHSieufO1vxyYvGDanydIA42NR98uTwo7dgaL567zmaFYgWK0FfIFjGgCCpHehJZOqixoKtcZqg5NgsPB6pIngVMnGbi6SMx1AmulGxLl6y8QHUM1mpdVSAUwVbed+XbytXbdz6zuB1p/T8Od+7iXWzWtqfJPCafjJos0aCGwZVwYvS56+CAV4zQSlknK0+A0uxzsNBXCvwFeied14FCgKVQ3iDrfZPTox0Osoascik3sb9nRgV1/tWNuiLNFUapDp8liklphdSZX9oA5ENo9Dgus3vFStEitz6tfXnu2Oi/ZGZGGgnNk+/wCj3rIcge/H/Pz3i9pP7/c/HEPVKZOqYfAJqnJoFai5nTEGctsWSTHIRmyrhZ0eDHWOpqAPsAYMAleqdqBGWR4eXxnK11pTKFpA0WnnDZ0R3MIVISxFsEgIkAiJ4p5Lp7jcaZ44XZCwUk4ePwu4DUACPXNlLL97tHkFNER58vebqFzuQlg4/gD59wQc7ZrjwYSqNtuBAQRuEHqem3JqSVoEsc/JcDBDSi30kFX0h+yzf1nT9sK8s76P+4qKQaeJ+ecM0+k9s/k84vxaE1sNpJdWQ5AF6ROw8fw4ek79PyRDXt08VhBwSXmSuOrmCFW17TjUHN3BQUZElqTJx5hcNxATIS8kypUF7BRA4AsfPOY0wwLceBrCj1NABNBkEyc1I28E790CpSSSq7b5iWW5sBdG1hKTxA0Ny2CcxorWfqFcAg+QTuQqdMlQKwFFoKQyHiNfUi+ld3LBBa09qvz/AHhKn2F5P7/nFVA2312t371iG+bo+H89YWq23g898dun4b+qitOaGutC3Mt1q8/yLZMUoXZ3khoUA8hXWfIAMgiLhqk2KOONXvaAjGoRRMAoAPbtID6TSNhiMFtRvMBnmGq0slRgZEKVpD4VxEL97OsJwaTEozkUPWUZHFSsELoJDQuzUkoKtes2NMKPG3oXqgBeMM75NyulD0x0RF0yIUerRLryKIQwDytfK7j+/wB/tiQJDZeu/frVxKuM1Utn9Yr4Bg5zR03ObIHn8OJVO0OtjREz6HE3vG/TzlMnfuOmMHjLes1F9Y0bz2461axDDDeLWN5pgu7s0oHz5FuCjFDCslqFo3K34yGlLfxXsgVp8LwyvAF/9gCa80ois2qwc5z2GdjcZg4OZxnguyuIRNpPSPSc2dKbB0iVJqa2LIpzqVLyOsd0mmsMF5cr2fvkE6eNFFajdD1sn7j6ynSsWaD4u9y/mjuvgU7+fl8H+x/WDEmldtYlRQK2bM1mZNCJrfzwrwI0VF4p9HpZSx7LsbyIZzvHOmjAQ/42tjwMoUAdEGVRcQDoHHbcI3GOzckETRDF4RPMTZpLpUZYUE9vjSpcnSqaIWOTe0GDNIo1KYZEge84Ah8TBQcSJdQ5XcBFgThXQoOEZ2SFg0uvcn+lI1G64Oj8tbT4fg4ehwcsFW4AC+zp+7kJrFwClPl2/n3wDSfJs58N8bNZNdkX+/8AeJa+inZ4/P0w7lmjo6IFCnOBPRkrAUyiCrW2ENjCHdJOUy2klHeVh0LhDcAQA1Mis/BhCeilXsZrg0vXS1AEacXLcW4UwfGoD9WjuQYyxEoGZIynFWd8c4yjCzJh2ZUTzocGCD2+psAgnABcJQqhG5h/bD/olB2DjI5UBnIVA3dlenEhxgDBDgNGo9GIlod6aKRiGr+OXEe30fp8771ywaPz/GJVfJxOfnvuQH8/nfrnohO4GUjpp3GZ9j7oexIpR5erDq0iRsCFPGq6qGLHpUS963OnMMrpLvMaBidGCwEBWFW7SN9yzaiWxDZwtYHo0SOi+ZQyox4RU/wPDmpp8aQS2qfoBkyY43342SzORtniAvAx2LYd8nBAzAf09XY78GLDzlbFqvM4YmD+X+eXIIL9p7Gw2Co3ZzT9veB8gTfNer/OaB8e9Zwr51zn9Z4nd+P3uIvcDhw2lFib6G/Fh8iG0oaJqfP6jeHno33p72shssmqLpVrWqD1AxgKaY/b4SoM0jXVkqMeY/EnMuhYW2CsFT/srrPPhGycHOwOrYQ47taBtZLquBFroM7soagN+dpRBY1B4CphwFQHwvYDqaA2YRBp3c5R0XMQuSW7Cb0ELo9y7kTVk1mSFunXoAe3mw/P4+MuhoZU2n/M0wWrf5rtW/EyAgRWP+v6yLznn89/9xMBUUWlSmbRbtclZKu+xmxo+TyN2d2DcWdPMT2L+gewIiUA6Irr0QXQTi9QIYSO5obCB7rJjIcOYX3opDmlc2CanRZiF545gfCJBQkohLRDGuUWgT6SokApsHIKQcxLoIJ/VhsFmUcKX2Q+gQchsCRMBeho/KVUuiC9HjjXrSoyFVbTTdjjwn4QmBWpT9Vke9rfreYNHk+nyfT493JZfo9PHfvv/OCPsfL4PP6YrzG3ZAFsrJzib1uUWI0P7JGAJHypHQLtrww2+Bt1gWgtYp8gDvqdzbcgKoCu9hGqIqMPmMDTUds7HGfxXdxRaUKKhRoQaNDlrzE1z09Hy0GCpKGzr6o0lUoeCtrF/KJiVAWtGuZebpDruwmJIIaUfPIQr4TSB8/sKDjY2uztyAOzm9QQGUtSa6RFAb6ZGazgeQWLxdasDbS4daB846nX4b8k6U9cycUg85t0b19jmG4BMwGyjpBGPG2YSuUwnihgDhWRy1dks8AKbobh8GOck2VCB9SK6OwGhtQp2UI1VJLpTnkMeQ8k8hfSNlBJzemjzWwv0STTRqVYmbRBWjY6gTAy4D4LQH2xgHHG/HsJej1yBBntydyPA4yLSZmFM2qk8uP2J0IGJIIIuZ0ArK64Lk+ONuDZb4VeE5YIrsGtPRTSdjaGwuXhQfnboLSOKkdgakZO9mRWM22dIwxkTwXHGkeAsAcGkeDEHyrWUVLaaZGg0aR9Zu13WxfdKD2V0ys+m1xH9Wp8XqmbrOy/QZDRbt8dkBmj4zW4ewu0fgQaIuSUtcYbtrXQIkb7Q1ggiEWgfoPgA4zu9Y7l/H4UFNOiPwIU/wBIB4QRvq6KxDljsGVdGnpDgwrWOa+Jzi8WF8qzF3EwS0GAamEzx1l4AJ0QrN0A3SuCoa/Wmg4io2XbBWhsAHeaBDvZ4A7iGQhhtiUlaDBQIEr2pZsOOP7ZyzhkwDe07ZmVgIIRPjn1HDqR/9oADAMBAAIAAwAAABCeMBJlFYNQxmRlTUHA0wCabPMn1E9gM2YHgAWvMgNAqoqeyEw05l+QUzNYLsx4GwXB5GZ4Buvr+COuwfMKdL4Kdk4b4F+IH8D70MP/xAAgEQEBAQEBAQADAQADAAAAAAABESExAEFRYXGBEJHw/9oACAEDAQE/EEasaDCAIDLUkCt1DwgBgAQ4Z8/5UyUwq/IK/wBLGYCLWsu4AIDGmQcQFrcQ4LCBYDDPpguo96jidGK7xd4ABQeJpWxXgwiqoVQOVKFmCliGqlT6dcvjkNYiaCyJKZIQrwGkIoYhTECIysKFQKCKqAihbqyCbU8ikW5bKdPMUq2mTzN3w5ZLsx9ATFrAqwBFQFCt2ip8nHwEIZaDpR7KjCVEIrhuFUgdAQeIUg4F5C3IyKk6rWjFTUICRC/196ZiDaE220FHgURIgijDB1OXWh3fse93++6X/cv/AL+nqCKxNiHT8oTOJ/junZbFCkYTMGVOhMjw6QgAPCf73gWj5qA1nVukM66WKVpWCJAkIigFHyNGryxEPBICiMmgRCIeXIuCeAkPwfqHZxvjSC21BjWqJCghUMHlVCIW3EAXovQiMdfEMEASfXof8BS5e0bQnAUwKGBoQBFSD5UIw2hawDV4kCmngnoxbHUjvHK3g+k4JaED3JEC4BaA7GBMIAvKRSwSDUVJwy8kyr4CoqooEqFVm/WAdhNUXUKlCBNAaVoAw2+RSg3RECkduHHQqqCM6ms2hEaAgbE1ZckwD1MxJBzsj6Jws1JIWkwnFDwXnpw0xuDIYMBRkMootskvRZgQ8KQ+KDIsiYylQFAxJCAWIfhSgAQ/ii+RhHDEjGgzbj/TMnsTFykmmYDCM0ABB8xtSJpAljAWgOBEeKBHk0n4MIHhXLwo4AHCTCUFAHwY6aZ2tNCiBYVoekzii4hAIrYAGHjWLDEv8pPOsdLGyVEGgEai4hYY1LBTCAEgKGinTNfJRbhUAhN+N/VdQEHEwkWIJRTAiWIBZ4KGYBCK0EpIBtB8GzeOJWCUrBYdOvcVIkA2qaHSwC8fa0ASkzXQiUHQUPsOI0hGzFECLxDxViRCQGFEfofKAgTVKAwmAx1K2PeFhDRogqlDEweTRIgpbIxZG5Adnz3JdBAqYAhQZTMHb5zMpsGBAQAOmAUX75w6SCwNnSrOuKVCcEJQoE2A3ToxUfS4DRMdKcw6gDVt9fz5LVSbYouqgSXhRsEk5hHJvn00s8xjJCIigkjVbAN15VQ1JUJ3SpIdA66PkCMEUigE4Tv/AGWPiGkZtTA6AQJL1AvlDhKjkwA1oPVWRwRqUksSBaKsA2BBOPlQq47CUG2mcLoqeLGDQSxol1elEE1siGkihOVRcEv6uudC1olCYm6TYAggHhUQJRap08UxS1EPcA9qD8AmLJU1tFKJPh13oHswU/yDLgCGSTOegQIgjuKnv27e374hIKaPzl/vU/1vw8KpqEEX4q/kYY0wzPNqQfoATOEKWFnUFr53ivnxQ/KKQFILwvaR1MYTs4H+vkNr7ScEOAYCQOTw6M0SSAegFwtXDjPRROEUZCZVL+1/Pv/EACARAQEBAQEBAQEAAwEBAAAAAAERITEAQVFhcZHwELH/2gAIAQIBAT8QHLSmQn4eGUCUPuxT9d+zq4av2/8AgSUn0hWfwpX/ACn+fEFTDTHv45LreU8bcEkJg1mqlmA1fBQbaCxyWoKrTIAjwCH3NkCRU6gWgPVRSAWCfiAZMPUgTE2TRQkOIDInOh5/CZCRkABpHUP5UWBpikWgmkFMCCbYrsdFBaqCCYHxYMVn4AblSiNWoeJGLEO4Nk9FoTHzdfAOIkwmpfgg8ahG5tW26+qxoXyzim64yc03Cy1od6bDrhSaR1wRARIIQZJcgjJHUEwz77OPViU4ACJ8ejz34rQ4RoIQhkTJnPQhRAWs78m/OfDL1fACwWi1cLHh1uPfWxhIiDSoKA2GIHjAwpVqrCBxswM86RrFmaqOm3Puz8GC/AlRWVEA4K6OL4KhEtFEFuDDW1RPVryPDGvhfjrr5Ou1j878QAFAmWNZQwtINE7SsqrCaAyIaFRGDjMNKB8U80toNTYV+jgAgoNLBaTEyTovj8i8wVoRkgCmT5V8biL8by7MV6+HNtkcJiOYjQbWY8GikA10AQaEtUKYF9CM+anSU7D4fv2+TpQN+nW/ixoVlsNjKMpBwKiFonnHXaYixA4TXZK+fyVNKlU2h4z+U61wmOCCBcqscqfVeqJh22FKzwYcc2gpQK1RIjDw81jkKSogTGNAEBKMgDkSqPY3+eCtFsGfxn+jP5zIEGtB6oi/1aAU7qIHGrQa00or4Eml2jFVC4kSiAomgiiAVAGpFRJAnF4ka+bGhlGEoTCshP8ABvUE5hnsMfXCd0pjOAKIUiDFaZ2b7djcUUBOAI6BiTEAF5U7zwhRJ+h/37/084UYHzSR+0KszZ2R8qpD6AoKASGyKSM+K25rGuMIUAaH1CrrQ1wYWncRVCL4RigMNlYQAipJEc68DCTDAFBBM9siIlADmi3AKkqlGJAA2DtYGQuYsiSrDMKHFVwKR9LB+yWVXRiRdGOpk9ycQoEkgQUBtetjBfBsqcQMiQo2UsSj0lA6AmFCUNiQgR1G6QEdETb5QUNT11qrxBAiCZBaI4GAxQ6kltbOWVBhMQDK7FhhkwIqgCV8WasgczgmwKVOhiKUU0iXGIL9HHsxhAQcsoJRWsD9f9L4axdkhESpDkgF8kABdhSAKv8AQr1tJwKCIRhSkEpyH6DY0aqjNnD7vdWBPIcNPNFAAilRQnfCWyu5B2JwBjt+QUBeCr7pSralN90s4vWOMiBIYJFaFFKFXCwZEX1GhSA+EkOigfpppU/t7d8kl0K07XoVdsb5Ahi2T+j/AOg59L1fMK8cQkY59mV37336hIP0oem3+9AAYB6fQp0Kr9bKULDQAWuqIhWBysuHFKKI9sQkoKXERv2j58wyXVHAVgKlrr4QDU6VOg2j9Juv61J4AoVEszYB+w9//8QAIxABAQEBAQEAAgEFAQEAAAAAAREhADFBUWFxECCBkaHwsf/aAAgBAQABPxCcamAFWqOewxrVGjrOasQEJlY7BP37q2IEt+FVsxqK/VX7/as+f9N35u/k/OcH492OasEGsM2Sx4scwthyPrP0Ri5VU+FUGUHXjATF/KqQADMEoUZKhm1BpQAhPhUIoCVHCGhRfZRQ7hmAAYYzkA2YIgqYHwetDY40c4KhJbRuo/VAaFIu7y5QDBYA4EiyYjjCciIVAWoDpFGqtdPkqCLYIxgWhjhojFPrZwKuwQQiADJ8u/aAF529j+h6/wCIOhjv9tTcPNT/ABEIT85/OcepAR7RGgAUBsrNvCqOrU6s4ykBUldSePULAJzoRh4dXGnCwhUJGYh0PeMcolstVXEXlYsIU12S9ItGY1p/YCaOHGQe6/705Dc87Y0piUlJSlwSNmx32neTJVFNqZIURT0oTAxpAikgEaznigRoBRQuMqlvmeoAFHNprtUIBFSCSkeBGojphASv/H9ERKgNS/hVnon/ADq0Vp2wQeHBFBzxXBiyfVoNKiYujAYB1HCCFzeuj432bDrqZleYtABhOoljvHxJNBOKBRaAldQL/oZaDtcB7jWYV7HMh4+IWwIUulXGQ2VvjjvjODdWF/8AHDVOq6CNyKadg2ZDOjLBAvvoJHAVQqqJwcRMZyaaTqibtCeCefGGuhEY5oID8p0Yh3nB+cVzKnv3+b/v3/uv+OrVAXYpKGjO5kqiNS0tBAtAgaNVcKDTAt4h+L76DLTNC1AwouKgwedWWP2OIRF4QJ/BhENLO6AChvFC886BSFEAIgIdUoUqUzSQbH2Oc8ebUczijM0eGJ0hXUx0XJwMI1iO6zFkHpAwTGpWDuURP8qgGwKkGhgOxq0ePYuCKVIIH1ganpd4ltaEKxpWYgU5T8LNxlWBKjCwLluASsbQoFxGjcjgCFNi6e0DYgh6tpQUtlARgNUFuBcUclq1SkQlQSV4FJH2qslEL8n5HUAibIiWwGOkbiNcEgQ2fQqapTCu6CU8gZHVlFLRAk5rssdBLhIVPK4HCUHIZPqwxjB1+TdUANKwY0QCGIu1fMSr14UIoyBZYJaCJhMjEYCPIoBX58qDQIVgBC8KrUKmSAQqAAXhMcLY51GSlzBILn8juHwBaT9UCNDHGFQowTv6wBFfD9ABtMC+P1SM5kF4NIIjJa2/h/d2VKFPK/R/Dx35P142af8Atz7iAgqWqDapQEL+KgZ+eT23KZ/9y6P8xm7wAisQCY4YEdXNaJmdVAAlBcNUMCEalZn4rQhciAFvqgsKh8GUDmIKAA5A/SQu7uO0ASIpF4rJoO9IhNttmEpwzFH1DAUgUFGXIRSwcJgaQhgdUC1KYIDgMhsaaWCRtAmeeHo0dCSgQBPsgidvcRcVFUNK9oigcKxVCcKqhJzt4XEZTeIEJGp42y86qEsLYFAJwKhkvQGiZV7UdyFvht67Y8g9uTkAikrVdUcIQbAFcp1foSOR+Ov2IejnREVQHQYhqhoDXihQCr4VxIaBT6SWnKj3NZWY/jq6WzAKygQ2HsQB/wAY6g6C0RL3REp29G5HV8cJhWEqYiTzyyYqqnA7GXhssWLqteBeE+fxbc26QLhJlQoMeHAX9IC9MyO0voKog/E9jiItsW44WFwx8hsTT0kW/dtFhQazeEP3shEKBcavsqxBOAGCSUxRdo3XVEUPDiaKOUW9ZB8LVyQhCMNTjhTN7YY5tIXbO/zpjDEGCtAWAdCC8KLihkpkCAgK+HjuldUgMEdSeyKSOsy2lu4DOCJDCSYDe9spmk7c5mbktauFMpg3ABBoocGylF6VgeOo4rqYE5L9Akaksr2jOQgITglEsIUYdibOrF1FjF9KFwbbXqq1tCdVCW6XWXwsKY6L4pYNZZPgCESCkqlMzrBo9MRVragL0FaEcaAy+FpRQcHJhlBLsiZEWNKCJagAeN+M6hcLjQeTDWv6YlwvtD/FWNgqlPNed7nBGL6HOppOssQ6DiIALnxaEwDpYPcuJKxslKvxLacwNGOFSi4df5t9oeWwJf5GlnQyr0gtzDoPcEKnHkSR4WYAc8fe5v7YURLvQcj1jEA2WLDF0r5fM/WVGTsg8pdSxWfh3OgRCl8uExIPfRFT9V3IdIIJhWYgsARRPw+1cAlLdeXxWorUin5KI6EQrZEBG8yQU3ipBMSANWES39NpvnHvtD52CInmI8xkwmIBmsgQd6C/YnrEvskQNSAOY9m3hBYNMHOnFKGBS3ABPE5xJ0sFpK6FxEChCVAZjohwFvTl1euPBDPyABYZo2gXFdYgfPJDGOEr1Fibi5QQI1QTnHJKdn3jE8gZgqgM1Xmskz6OJITYSw6XbPpi3pwbcuhn2XE/MAKyPCns2K4awAdMFSSJ4PjhnkFLYxdICjQZPcBdLMRlQQG0JHyfyBJKzQP3NIqR+zL9xJ8pX/QRYxUolEEQoCNFUDZzVqjg5PNkpgyrAc/1kbaFkEqHHIemVCKAO7WUhHJBIMrG4PFs5AD7okbOYNhRSkII/LxJ9AS0CGxAgqgBu0+XQtCEf1QPrV+y2D6kJo+QjJxFSyxoJ7zs0UioSkpy7TQ5Hdp1+Qdve0ozHEoKjMSmlT8jtWoIhKAVAFVcgrFKCYhsuD8Nfdpps9LymsHQIu/t3uiAAqQouMR8LCgbDxkGAQUYk1ZW36BLbOGZGkLLAUdogD18/HL1Mh1SFDooJFcldQJKKbUNc29uhxMu18H/AHfCb5pkIMw9+tv6yonpM+aBc8ikwokK3Pgw+GXE0ELRkNdCBxzj2sitvw9awIh2Clk2RrnwAiM1DDsSxIG9WCrrTyutzosXvWcdfPn+iZEoCDuppiywErGiy9NzA6kBpA1lAqNSIoGsW1AmoGwVWYT0iAGlBZPwgqkeKSmqhUo1R8J+GJpAYRJpNTF3xPc/UJmERoUaKn6dVf5HKeB166mjscIoP9U0GIkvopYPLmdGy8NRKplzYmV6s+Hs8F3MhyeGOYpYcAEm4Eq1MNUVVG2SZwYWwi3FaHW4y8AbywCJSYw4ROWB5Y1CrfIOjCZO7GCmivEhqgnOE/wOYJP2p0SmSD5ehBQmTuE/TgRAf0vuPMWACSZ4MUL0OKgCwfAEp8njVGvaLUcRhMfwL4N3isY0HQ8M1WiCLbfTwC8R8CIz8WeYo8noKAFTAJT7hG3CrLPnHep8soFcYHZtB9yIW9u0m2FjoQ9MoCVdSpGUV2Zhn3n5CkSQUReYQYdNEmLvJxZdEIkJRxiOC8+Dv6IBlUqcGCEE7xnWDXDA6oBWc1pfchiMcJHpaq2dDBHSJber0Qtkg+cLd71frMnYmrRtBq49GYWvAtsB2AAPsICKTlZJUGHQmZwjBR9QVgaFU+R6dLNAi3CsAJR4Wfw5OBSGhYSrPjhKTIHIlAacKn5u5WMVnpK7Bq/GWCkXJdHdqB2C/BALU9yLsjwcbfYrVjJYG/beCBCX1FAKEga6MDm59LEvvQWAYD3Za12gQircHISHuzVtj4LzCGDletkIQtC+WnhoGveYoIJFAG6NDBPNJh0pgclD+e0XVaB2bk1bzMgFBSIODM14enmVR4f0Wq7eaVqDfCygr53BXqYR83e8+aHn+9gGQBsMQmI1JVQBKQGYx+LTAAuhgyoCIkPgAgAN2dbSoHo0GmfQdTH5p7iSg/BU1FFCrAQCRgoAvHTgkPyPDtLUtC3OQBaEyRQOqbpBY0Vwej6guNTeDzuwQ/WNjwehiJtV0BgoYG2YeLrs0OTlCa68OGzrHLoAIp3jhf4pXLKJnPDAtDAz78pdiyLt/wDhfQisNRLEeyHyoTzXB1dFIQRxvdYkoKPWtbQZBITfSB5zMTrUAMgLvESMvBgFgTY01AqoH/I43ZEWj1tSBWJgfywD9gWaK+tP9H4KLLRDDEIZfhxg1vvVAoTJT3V8AgRHNbKN9udpUQw0gKPhCpSJIAnR4o1BhK8AF6APUjC3e9Y5FgBgCD/YAqElCKERSo7KzeMOGAwMtkDh3U8PQ4HxxvdcZ4BmzZStHnfOz92ZMKpSP7OBGa0PkMtxiuWpN9f+zy2Q/nOFOXor28wiIdyDhIjvcbOAgG6mhJEn62flz8k4wlkQgVYEOeRDmhVM3MYo58x/oC78VLKAEGhI0PjdnNHlksIDUmuF0Vf2MgLJmAGd16SdCHvCe2wGarwMAQoDSVhLQm3AOHj7DZS8I6UEgOWQQqtAjvsShmi3O6ueCtpHFILSHmDXIxyIgNFl04TqWy4Q6IYIjtCdV3OzNMHDZ0lkHaoLSkmVvAtP4ve3NHjGGJ5VnRpeUK9NovAtOxZVLdyEOyD2qwBuDQBSmB2T3oyfQquopxisoN8RlS04JlBkimrSJiIsetULEBRCIPjI5Q8Efd9eyrlYcCPHGhr3vEsQgRxAaQkQ1Mz8KbYbAVeKq8iDIMBVA1RTFqkhAkDEOkUdvATRrm2FqCWhV0OTyCoGM7IQqA8MBhS0MSlu4cx9E9273NBnwCQMoXaHdoAFdVUI9IZIFY915AvNJKAOo+nmcYaizY/xCBWLKbBCpKJFhPpcDH7uwQgPRCt8gIjBIjsijna63dpAjiP+NrdQQQgTjSwbqUoVbAIDZnf20UD1m9RVyxipDqe5/9k="

/***/ }),

/***/ 432:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__fetchTools__ = __webpack_require__(102);
/* unused harmony reexport defaultOptions */
/* unused harmony reexport checkStatus */
/* unused harmony reexport parseJSON */
/* unused harmony reexport getLocationOrigin */
/* unused harmony reexport encodeBase64 */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__fetchMocks__ = __webpack_require__(428);
/* unused harmony reexport fetchMockEarningGraphData */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__fetchMocks__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__fetchMocks__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__API__ = __webpack_require__(137);
/* unused harmony reexport getEarningGraphData */
/* unused harmony reexport getTeamMatesData */
/* unused harmony reexport getUserInfoData */
//  weak

// fetchTools:

// fetchMocks:

// API:


/***/ }),

/***/ 433:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = teamMates;
/* harmony export (immutable) */ __webpack_exports__["b"] = fetchTeamMatesDataIfNeeded;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services__ = __webpack_require__(432);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_API__ = __webpack_require__(137);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//  weak

/* eslint no-console:0 */
/* eslint consistent-return:0 */





var REQUEST_TEAM_MATES_DATA = 'REQUEST_TEAM_MATES_DATA';
var RECEIVED_TEAM_MATES_DATA = 'RECEIVED_TEAM_MATES_DATA';
var ERROR_TEAM_MATES_DATA = 'ERROR_TEAM_MATES_DATA';

var initialState = {
  isFetching: false,
  data: [],
  time: null
};

function teamMates() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {

    case 'REQUEST_TEAM_MATES_DATA':
      return _extends({}, state, {
        isFetching: action.isFetching,
        time: action.time
      });

    case 'RECEIVED_TEAM_MATES_DATA':
      return _extends({}, state, {
        isFetching: action.isFetching,
        data: [].concat(_toConsumableArray(action.data)),
        time: action.time
      });

    case 'ERROR_TEAM_MATES_DATA':
      return _extends({}, state, {
        isFetching: action.isFetching,
        time: action.time
      });

    default:
      return state;
  }
}

function fetchTeamMatesDataIfNeeded() {
  return function (dispatch, getState) {
    if (shouldFetchTeamMatesData(getState())) {
      return dispatch(fetchTeamMatesData());
    }
  };
}
function requestTeamMatesData() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: REQUEST_TEAM_MATES_DATA,
    isFetching: true,
    time: time
  };
}
function receivedTeamMatesData(data) {
  var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: RECEIVED_TEAM_MATES_DATA,
    isFetching: false,
    data: data,
    time: time
  };
}
function errorTeamMatesData() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ERROR_TEAM_MATES_DATA,
    isFetching: false,
    time: time
  };
}
function fetchTeamMatesData() {
  return function (dispatch) {
    dispatch(requestTeamMatesData());
    if (__WEBPACK_IMPORTED_MODULE_1__config__["a" /* appConfig */].DEV_MODE) {
      Object(__WEBPACK_IMPORTED_MODULE_2__services__["a" /* fetchMockTeamMatesData */])().then(function (data) {
        return dispatch(receivedTeamMatesData(data));
      });
    } else {
      Object(__WEBPACK_IMPORTED_MODULE_3__services_API__["b" /* getTeamMatesData */])().then(function (data) {
        return dispatch(receivedTeamMatesData(data));
      }).catch(function (error) {
        return dispatch(errorTeamMatesData(error));
      });
    }
  };
}
function shouldFetchTeamMatesData(state) {
  var teamMatesStore = state.teamMates;
  // just check wether fetching (assuming data could be refreshed and should not persist in store)
  if (teamMatesStore.isFetching) {
    return false;
  } else {
    return true;
  }
}

/***/ }),

/***/ 434:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["disconnectUser"] = disconnectUser;
/* harmony export (immutable) */ __webpack_exports__["checkUserIsConnected"] = checkUserIsConnected;
/* harmony export (immutable) */ __webpack_exports__["logUserIfNeeded"] = logUserIfNeeded;
/* harmony export (immutable) */ __webpack_exports__["fetchUserInfoDataIfNeeded"] = fetchUserInfoDataIfNeeded;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_userInfosMock__ = __webpack_require__(430);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_fetchTools__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_auth__ = __webpack_require__(138);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//  weak



 // from '../../models/userInfosMocks';
 // '../../services/utils';


// --------------------------------
// CONSTANTS
// --------------------------------
var REQUEST_USER_INFOS_DATA = 'REQUEST_USER_INFOS_DATA';
var RECEIVED_USER_INFOS_DATA = 'RECEIVED_USER_INFOS_DATA';
var ERROR_USER_INFOS_DATA = 'ERROR_USER_INFOS_DATA';

var REQUEST_LOG_USER = 'REQUEST_LOG_USER';
var RECEIVED_LOG_USER = 'RECEIVED_LOG_USER';
var ERROR_LOG_USER = 'ERROR_LOG_USER';

var CHECK_IF_USER_IS_AUTHENTICATED = 'CHECK_IF_USER_IS_AUTHENTICATED';

var DISCONNECT_USER = 'DISCONNECT_USER';

// --------------------------------
// REDUCER
// --------------------------------
var initialState = {
  // actions details
  isFetching: false,
  isLogging: false,
  time: '',

  // userInfos
  id: '',
  login: '',
  firstname: '',
  lastname: '',

  token: null,
  isAuthenticated: false // authentication status (token based auth)
};

/* harmony default export */ __webpack_exports__["default"] = (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  var currentTime = __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  switch (action.type) {

    case CHECK_IF_USER_IS_AUTHENTICATED:
      return _extends({}, state, {
        actionTime: currentTime,
        isAuthenticated: action.isAuthenticated,
        token: action.token || initialState.token,
        id: action.user && action.user.id ? action.user.id : initialState.id,
        login: action.user && action.user.login ? action.user.login : initialState.login,
        firstname: action.user && action.user.firstname ? action.user.firstname : initialState.firstname,
        lastname: action.user && action.user.lastname ? action.user.lastname : initialState.firstname
      });

    case DISCONNECT_USER:
      return _extends({}, state, {
        actionTime: currentTime,
        isAuthenticated: false,
        token: initialState.token,
        id: initialState.id,
        login: initialState.login,
        firstname: initialState.firstname,
        lastname: initialState.lastname
      });

    // user login (get token and userInfo)
    case REQUEST_LOG_USER:
      return _extends({}, state, {
        actionTime: currentTime,
        isLogging: true
      });

    case RECEIVED_LOG_USER:
      {
        var userLogged = action.payload;

        return _extends({}, state, {
          actionTime: currentTime,
          isAuthenticated: true,
          token: userLogged.token,
          id: userLogged.id,
          login: userLogged.login,
          firstname: userLogged.firstname,
          lastname: userLogged.lastname,
          isLogging: false
        });
      }

    case ERROR_LOG_USER:
      return _extends({}, state, {
        actionTime: currentTime,
        isAuthenticated: false,
        isLogging: false
      });

    // not used right now:
    case REQUEST_USER_INFOS_DATA:
      return _extends({}, state, {
        actionTime: currentTime,
        isFetching: true
      });

    case RECEIVED_USER_INFOS_DATA:
      {
        var userInfos = action.userInfos;

        return _extends({}, state, {
          actionTime: currentTime,
          isFetching: false,
          id: userInfos.id,
          login: userInfos.login,
          firstname: userInfos.firstname,
          lastname: userInfos.lastname
        });
      }

    case ERROR_USER_INFOS_DATA:
      return _extends({}, state, {
        actionTime: currentTime,
        isFetching: false
      });

    default:
      return state;
  }
});

// --------------------------------
// ACTIONS CREATORS
// --------------------------------
//

/**
 *
 * set user isAuthenticated to false and clear all app localstorage:
 *
 * @export
 * @returns {action} action
 */
function disconnectUser() {
  __WEBPACK_IMPORTED_MODULE_4__services_auth__["a" /* default */].clearAllAppStorage();
  return { type: DISCONNECT_USER };
}

/**
 *
 * check if user is connected by looking at locally stored
 * - token
 * - user fonrmation
 *
 * @export
 * @returns {action} action
 */
function checkUserIsConnected() {
  var token = __WEBPACK_IMPORTED_MODULE_4__services_auth__["a" /* default */].getToken();
  var user = __WEBPACK_IMPORTED_MODULE_4__services_auth__["a" /* default */].getUserInfo();
  var checkUserHasId = function checkUserHasId(obj) {
    return obj && obj._id;
  };
  var isAuthenticated = token && checkUserHasId(user) ? true : false;

  return _extends({
    type: CHECK_IF_USER_IS_AUTHENTICATED,
    token: token
  }, user, {
    isAuthenticated: isAuthenticated
  });
}

/**
 *
 *  user login
 *
 * @param {string} login user login
 * @param {string} password usepasswordr
 * @returns {Promise<any>} promised action
 */
function logUser(login, password) {
  var _this = this;

  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch) {
      var FETCH_TYPE, __SOME_LOGIN_API__, mockResult, url, method, headers, options;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              FETCH_TYPE = __WEBPACK_IMPORTED_MODULE_1__config__["a" /* appConfig */].DEV_MODE ? 'FETCH_MOCK' : 'FETCH';
              __SOME_LOGIN_API__ = 'login';
              mockResult = { token: __WEBPACK_IMPORTED_MODULE_2__models_userInfosMock__["a" /* default */].token, data: _extends({}, __WEBPACK_IMPORTED_MODULE_2__models_userInfosMock__["a" /* default */]) }; // will be fetch_mock data returned (in case FETCH_TYPE = 'FETCH_MOCK', otherwise cata come from server)

              url = Object(__WEBPACK_IMPORTED_MODULE_3__services_fetchTools__["c" /* getLocationOrigin */])() + '/' + __SOME_LOGIN_API__;
              method = 'post';
              headers = {};
              options = {
                credentials: 'same-origin',
                data: {
                  login: login,
                  password: password
                }
              };

              // fetchMiddleware (does: fetch mock, real fetch, dispatch 3 actions... for a minimum code on action creator!)

              return _context.abrupt('return', dispatch({
                type: 'FETCH_MIDDLEWARE',
                fetch: {
                  // common props:
                  type: FETCH_TYPE,
                  actionTypes: {
                    request: REQUEST_LOG_USER,
                    success: RECEIVED_LOG_USER,
                    fail: ERROR_LOG_USER
                  },
                  // mock fetch props:
                  mockResult: mockResult,
                  // real fetch props:
                  url: url,
                  method: method,
                  headers: headers,
                  options: options
                }
              }));

            case 8:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x2) {
      return _ref.apply(this, arguments);
    };
  }();
}
function logUserIfNeeded(email, password) {
  return function (dispatch, getState) {
    if (shouldLogUser(getState())) {
      return dispatch(logUser(email, password));
    }
    return Promise.resolve('already loggin in...');
  };
}
function shouldLogUser(state) {
  var isLogging = state.userAuth.isLogging;
  if (isLogging) {
    return false;
  }
  return true;
}

/**
 * fetch user info
 *
 * NOTE: this shows a use-case of fetchMiddleware
 *@param {string} [id=''] user id
 * @returns {Promise<any>} returns fetch promise
 */
function fetchUserInfosData() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  return function (dispatch) {
    var token = __WEBPACK_IMPORTED_MODULE_4__services_auth__["a" /* default */].getToken();
    var FETCH_TYPE = __WEBPACK_IMPORTED_MODULE_1__config__["a" /* appConfig */].DEV_MODE ? 'FETCH_MOCK' : 'FETCH';

    console.log('token');
    var mockResult = { token: __WEBPACK_IMPORTED_MODULE_2__models_userInfosMock__["a" /* default */].token, data: _extends({}, __WEBPACK_IMPORTED_MODULE_2__models_userInfosMock__["a" /* default */]) }; // will be fetch_mock data returned (in case FETCH_TYPE = 'FETCH_MOCK', otherwise cata come from server)
    var url = Object(__WEBPACK_IMPORTED_MODULE_3__services_fetchTools__["c" /* getLocationOrigin */])() + '/' + __WEBPACK_IMPORTED_MODULE_1__config__["a" /* appConfig */].API.users + '/' + id;
    var method = 'get';
    var headers = { authorization: 'Bearer ' + token };
    var options = { credentials: 'same-origin' }; // put options here (see axios options)

    return dispatch({
      type: 'FETCH_MIDDLEWARE',
      fetch: {
        // common props:
        type: FETCH_TYPE,
        actionTypes: {
          request: REQUEST_USER_INFOS_DATA,
          success: RECEIVED_USER_INFOS_DATA,
          fail: ERROR_USER_INFOS_DATA
        },
        // mock fetch props:
        mockResult: mockResult,
        // real fetch props:
        url: url,
        method: method,
        headers: headers,
        options: options
      }
    });
  };
}

function fetchUserInfoDataIfNeeded() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  return function (dispatch, getState) {
    if (shouldFetchUserInfoData(getState())) {
      return dispatch(fetchUserInfosData(id));
    }
    return Promise.resolve();
  };
}

/**
 *
 * determine wether fetching should occur
 *
 * rules:
 * - should not fetch twice when already fetching
 * - ...more rules can be added
 *
 * @param {Immutable.Map} state all redux state (immutable state)
 * @returns {boolean} flag
 */
function shouldFetchUserInfoData(state) {
  var userInfos = state.userAuth;
  if (userInfos.isFetching) {
    return false;
  }
  return true;
}

/***/ }),

/***/ 435:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__redux_modules_actions__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Home__ = __webpack_require__(823);
//  weak






var mapStateToProps = function mapStateToProps(state) {
  return {
    currentView: state.views.currentView,

    earningGraphIsFetching: state.earningGraph.isFetching,
    earningGraphLabels: state.earningGraph.labels,
    earningGraphDatasets: state.earningGraph.datasets,
    teamMatesIsFetching: state.teamMates.isFetching,
    teamMates: state.teamMates.data
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    actions: Object(__WEBPACK_IMPORTED_MODULE_0_redux__["bindActionCreators"])({
      enterHome: __WEBPACK_IMPORTED_MODULE_2__redux_modules_actions__["b" /* enterHome */],
      leaveHome: __WEBPACK_IMPORTED_MODULE_2__redux_modules_actions__["g" /* leaveHome */],

      fetchEarningGraphDataIfNeeded: __WEBPACK_IMPORTED_MODULE_2__redux_modules_actions__["d" /* fetchEarningGraphDataIfNeeded */],
      fetchTeamMatesDataIfNeeded: __WEBPACK_IMPORTED_MODULE_2__redux_modules_actions__["e" /* fetchTeamMatesDataIfNeeded */]
    }, dispatch)
  };
};

/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_1_react_redux__["connect"])(mapStateToProps, mapDispatchToProps)(__WEBPACK_IMPORTED_MODULE_3__Home__["a" /* default */]));

/***/ }),

/***/ 436:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__redux_modules_actions__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__SimpleTables__ = __webpack_require__(824);
//  weak






var mapStateToProps = function mapStateToProps(state) {
  return {
    currentView: state.views.currentView
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    actions: Object(__WEBPACK_IMPORTED_MODULE_0_redux__["bindActionCreators"])({
      enterSimpleTables: __WEBPACK_IMPORTED_MODULE_2__redux_modules_actions__["c" /* enterSimpleTables */],
      leaveSimpleTables: __WEBPACK_IMPORTED_MODULE_2__redux_modules_actions__["h" /* leaveSimpleTables */]
    }, dispatch)
  };
};

/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_1_react_redux__["connect"])(mapStateToProps, mapDispatchToProps)(__WEBPACK_IMPORTED_MODULE_3__SimpleTables__["a" /* default */]));

/***/ }),

/***/ 437:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__redux_modules_views__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__PageNotFound__ = __webpack_require__(828);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//  weak






var mapStateToProps = function mapStateToProps(state) {
  return {
    currentView: state.views.currentView
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    actions: Object(__WEBPACK_IMPORTED_MODULE_0_redux__["bindActionCreators"])(_extends({}, __WEBPACK_IMPORTED_MODULE_2__redux_modules_views__), dispatch)
  };
};

/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_1_react_redux__["connect"])(mapStateToProps, mapDispatchToProps)(__WEBPACK_IMPORTED_MODULE_3__PageNotFound__["a" /* default */]));

/***/ }),

/***/ 511:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(230);
module.exports = __webpack_require__(713);


/***/ }),

/***/ 56:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__appConfig__ = __webpack_require__(805);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__appConfig__["a"]; });
//  weak



/***/ }),

/***/ 713:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_hot_loader__ = __webpack_require__(720);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_hot_loader___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_hot_loader__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_smoothscroll_polyfill__ = __webpack_require__(266);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_smoothscroll_polyfill___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_smoothscroll_polyfill__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_animate_css__ = __webpack_require__(725);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_animate_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_animate_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_jquery__ = __webpack_require__(185);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_font_awesome_css_font_awesome_min_css__ = __webpack_require__(726);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_font_awesome_css_font_awesome_min_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_font_awesome_css_font_awesome_min_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_ionicons_dist_css_ionicons_css__ = __webpack_require__(727);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_ionicons_dist_css_ionicons_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_ionicons_dist_css_ionicons_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_bootstrap_dist_css_bootstrap_min_css__ = __webpack_require__(728);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_bootstrap_dist_css_bootstrap_min_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_bootstrap_dist_css_bootstrap_min_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_bootstrap_dist_js_bootstrap_min_js__ = __webpack_require__(267);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_bootstrap_dist_js_bootstrap_min_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_bootstrap_dist_js_bootstrap_min_js__);
throw new Error("Cannot find module \"./style/director-style.css\"");
throw new Error("Cannot find module \"./style/highlight/darkula.css\"");
throw new Error("Cannot find module \"./style/index.style.scss\"");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__Root__ = __webpack_require__(729);
// flow weak

// #region imports




// import injectTpEventPlugin  from 'react-tap-event-plugin'; // no more compatible with React 16.4+









// import configureStore from './redux/store/configureStore';

// #endregion

var ELEMENT_TO_BOOTSTRAP = "root";
var BootstrapedElement = document.getElementById(ELEMENT_TO_BOOTSTRAP);

// #region polyfills initializations
// tap events: react-tap-event-plugin is no more compatible with React 16.4+
// injectTpEventPlugin();

// smoothscroll polyfill
__WEBPACK_IMPORTED_MODULE_3_smoothscroll_polyfill___default.a.polyfill();
// force polyfill (even if browser partially implements it)
window.__forceSmoothScrollPolyfill__ = true;
// #endregion

var renderApp = function renderApp(RootComponent) {
  Object(__WEBPACK_IMPORTED_MODULE_1_react_dom__["render"])(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    __WEBPACK_IMPORTED_MODULE_2_react_hot_loader__["AppContainer"],
    { warnings: false },
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(RootComponent, null)
  ), BootstrapedElement);
};

renderApp(__WEBPACK_IMPORTED_MODULE_13__Root__["a" /* default */]);

if (false) {
  module.hot.accept("./Root", function () {
    var RootComponent = require("./Root").default;
    renderApp(RootComponent);
  });
}

/***/ }),

/***/ 720:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(721)


/***/ }),

/***/ 721:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable global-require */

if (true) {
  module.exports = __webpack_require__(722);
} else {
  module.exports = require('./index.dev');
}

/***/ }),

/***/ 722:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports.AppContainer = __webpack_require__(723);

/***/ }),

/***/ 723:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable global-require */

if (true) {
  module.exports = __webpack_require__(724);
} else {
  module.exports = require('./AppContainer.dev');
}

/***/ }),

/***/ 724:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable react/prop-types */

var React = __webpack_require__(0);

var Component = React.Component;

var AppContainer = function (_Component) {
  _inherits(AppContainer, _Component);

  function AppContainer() {
    _classCallCheck(this, AppContainer);

    return _possibleConstructorReturn(this, (AppContainer.__proto__ || Object.getPrototypeOf(AppContainer)).apply(this, arguments));
  }

  _createClass(AppContainer, [{
    key: 'render',
    value: function render() {
      if (this.props.component) {
        return React.createElement(this.props.component, this.props.props);
      }

      return React.Children.only(this.props.children);
    }
  }]);

  return AppContainer;
}(Component);

module.exports = AppContainer;

/***/ }),

/***/ 725:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 726:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 727:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 728:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 729:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_router_dom__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router_redux__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_redux__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__redux_store_configureStore__ = __webpack_require__(294);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__redux_store_configureStore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__redux_store_configureStore__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__containers_app__ = __webpack_require__(818);
throw new Error("Cannot find module \"../common/components/scrollToTop/ScrollToTop\"");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__views_login_index__ = __webpack_require__(833);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__views_pageNotFound__ = __webpack_require__(437);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//  weak












// #region flow types

// #endregion

var store = __WEBPACK_IMPORTED_MODULE_4__redux_store_configureStore___default()();

var Root = function (_Component) {
  _inherits(Root, _Component);

  function Root() {
    _classCallCheck(this, Root);

    return _possibleConstructorReturn(this, (Root.__proto__ || Object.getPrototypeOf(Root)).apply(this, arguments));
  }

  _createClass(Root, [{
    key: 'render',
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_3_react_redux__["Provider"],
        { store: store },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'div',
          null,
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_2_react_router_redux__["ConnectedRouter"],
            { history: __WEBPACK_IMPORTED_MODULE_4__redux_store_configureStore__["history"] },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_6__common_components_scrollToTop_ScrollToTop___default.a,
              null,
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_1_react_router_dom__["Switch"],
                null,
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_react_router_dom__["Route"], { exact: true, path: '/login', component: __WEBPACK_IMPORTED_MODULE_7__views_login_index__["a" /* default */] }),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__containers_app__["a" /* default */], null),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_react_router_dom__["Route"], { component: __WEBPACK_IMPORTED_MODULE_8__views_pageNotFound__["a" /* default */] })
              )
            )
          )
        )
      );
    }
  }]);

  return Root;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

/* harmony default export */ __webpack_exports__["a"] = (Root);

/***/ }),

/***/ 777:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "history", function() { return history; });
/* harmony export (immutable) */ __webpack_exports__["default"] = configureStore;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_logger__ = __webpack_require__(778);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_logger___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_redux_logger__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_redux_thunk__ = __webpack_require__(295);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_router_redux__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_redux_devtools_extension__ = __webpack_require__(779);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_redux_devtools_extension___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_redux_devtools_extension__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__middleware_fetchMiddleware__ = __webpack_require__(780);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_history_createHashHistory__ = __webpack_require__(799);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_history_createHashHistory___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_history_createHashHistory__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__modules_reducers__ = __webpack_require__(803);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__middleware__ = __webpack_require__(816);
// flow weak







// #region import createHistory from hashHistory or BrowserHistory:

// import createHistory            from 'history/createBrowserHistory';
// #endregion



var loggerMiddleware = Object(__WEBPACK_IMPORTED_MODULE_1_redux_logger__["createLogger"])({
  level: 'info',
  collapsed: true
});

var history = __WEBPACK_IMPORTED_MODULE_6_history_createHashHistory___default()();

// createStore : enhancer
var enhancer = Object(__WEBPACK_IMPORTED_MODULE_4_redux_devtools_extension__["composeWithDevTools"])(Object(__WEBPACK_IMPORTED_MODULE_0_redux__["applyMiddleware"])(__WEBPACK_IMPORTED_MODULE_8__middleware__["a" /* localStorageManager */], __WEBPACK_IMPORTED_MODULE_2_redux_thunk__["default"], __WEBPACK_IMPORTED_MODULE_5__middleware_fetchMiddleware__["a" /* default */], Object(__WEBPACK_IMPORTED_MODULE_3_react_router_redux__["routerMiddleware"])(history), loggerMiddleware));

function configureStore(initialState) {
  var store = Object(__WEBPACK_IMPORTED_MODULE_0_redux__["createStore"])(__WEBPACK_IMPORTED_MODULE_7__modules_reducers__["a" /* default */], initialState, enhancer);
  if (false) {
    module.hot.accept('../modules/reducers', function () {
      return store.replaceReducer(require('../modules/reducers').default);
    });
  }
  return store;
}

/***/ }),

/***/ 778:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {!function(e,t){ true?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.reduxLogger=e.reduxLogger||{})}(this,function(e){"use strict";function t(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}function r(e,t){Object.defineProperty(this,"kind",{value:e,enumerable:!0}),t&&t.length&&Object.defineProperty(this,"path",{value:t,enumerable:!0})}function n(e,t,r){n.super_.call(this,"E",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0}),Object.defineProperty(this,"rhs",{value:r,enumerable:!0})}function o(e,t){o.super_.call(this,"N",e),Object.defineProperty(this,"rhs",{value:t,enumerable:!0})}function i(e,t){i.super_.call(this,"D",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0})}function a(e,t,r){a.super_.call(this,"A",e),Object.defineProperty(this,"index",{value:t,enumerable:!0}),Object.defineProperty(this,"item",{value:r,enumerable:!0})}function f(e,t,r){var n=e.slice((r||t)+1||e.length);return e.length=t<0?e.length+t:t,e.push.apply(e,n),e}function u(e){var t="undefined"==typeof e?"undefined":N(e);return"object"!==t?t:e===Math?"math":null===e?"null":Array.isArray(e)?"array":"[object Date]"===Object.prototype.toString.call(e)?"date":"function"==typeof e.toString&&/^\/.*\//.test(e.toString())?"regexp":"object"}function l(e,t,r,c,s,d,p){s=s||[],p=p||[];var g=s.slice(0);if("undefined"!=typeof d){if(c){if("function"==typeof c&&c(g,d))return;if("object"===("undefined"==typeof c?"undefined":N(c))){if(c.prefilter&&c.prefilter(g,d))return;if(c.normalize){var h=c.normalize(g,d,e,t);h&&(e=h[0],t=h[1])}}}g.push(d)}"regexp"===u(e)&&"regexp"===u(t)&&(e=e.toString(),t=t.toString());var y="undefined"==typeof e?"undefined":N(e),v="undefined"==typeof t?"undefined":N(t),b="undefined"!==y||p&&p[p.length-1].lhs&&p[p.length-1].lhs.hasOwnProperty(d),m="undefined"!==v||p&&p[p.length-1].rhs&&p[p.length-1].rhs.hasOwnProperty(d);if(!b&&m)r(new o(g,t));else if(!m&&b)r(new i(g,e));else if(u(e)!==u(t))r(new n(g,e,t));else if("date"===u(e)&&e-t!==0)r(new n(g,e,t));else if("object"===y&&null!==e&&null!==t)if(p.filter(function(t){return t.lhs===e}).length)e!==t&&r(new n(g,e,t));else{if(p.push({lhs:e,rhs:t}),Array.isArray(e)){var w;e.length;for(w=0;w<e.length;w++)w>=t.length?r(new a(g,w,new i(void 0,e[w]))):l(e[w],t[w],r,c,g,w,p);for(;w<t.length;)r(new a(g,w,new o(void 0,t[w++])))}else{var x=Object.keys(e),S=Object.keys(t);x.forEach(function(n,o){var i=S.indexOf(n);i>=0?(l(e[n],t[n],r,c,g,n,p),S=f(S,i)):l(e[n],void 0,r,c,g,n,p)}),S.forEach(function(e){l(void 0,t[e],r,c,g,e,p)})}p.length=p.length-1}else e!==t&&("number"===y&&isNaN(e)&&isNaN(t)||r(new n(g,e,t)))}function c(e,t,r,n){return n=n||[],l(e,t,function(e){e&&n.push(e)},r),n.length?n:void 0}function s(e,t,r){if(r.path&&r.path.length){var n,o=e[t],i=r.path.length-1;for(n=0;n<i;n++)o=o[r.path[n]];switch(r.kind){case"A":s(o[r.path[n]],r.index,r.item);break;case"D":delete o[r.path[n]];break;case"E":case"N":o[r.path[n]]=r.rhs}}else switch(r.kind){case"A":s(e[t],r.index,r.item);break;case"D":e=f(e,t);break;case"E":case"N":e[t]=r.rhs}return e}function d(e,t,r){if(e&&t&&r&&r.kind){for(var n=e,o=-1,i=r.path?r.path.length-1:0;++o<i;)"undefined"==typeof n[r.path[o]]&&(n[r.path[o]]="number"==typeof r.path[o]?[]:{}),n=n[r.path[o]];switch(r.kind){case"A":s(r.path?n[r.path[o]]:n,r.index,r.item);break;case"D":delete n[r.path[o]];break;case"E":case"N":n[r.path[o]]=r.rhs}}}function p(e,t,r){if(r.path&&r.path.length){var n,o=e[t],i=r.path.length-1;for(n=0;n<i;n++)o=o[r.path[n]];switch(r.kind){case"A":p(o[r.path[n]],r.index,r.item);break;case"D":o[r.path[n]]=r.lhs;break;case"E":o[r.path[n]]=r.lhs;break;case"N":delete o[r.path[n]]}}else switch(r.kind){case"A":p(e[t],r.index,r.item);break;case"D":e[t]=r.lhs;break;case"E":e[t]=r.lhs;break;case"N":e=f(e,t)}return e}function g(e,t,r){if(e&&t&&r&&r.kind){var n,o,i=e;for(o=r.path.length-1,n=0;n<o;n++)"undefined"==typeof i[r.path[n]]&&(i[r.path[n]]={}),i=i[r.path[n]];switch(r.kind){case"A":p(i[r.path[n]],r.index,r.item);break;case"D":i[r.path[n]]=r.lhs;break;case"E":i[r.path[n]]=r.lhs;break;case"N":delete i[r.path[n]]}}}function h(e,t,r){if(e&&t){var n=function(n){r&&!r(e,t,n)||d(e,t,n)};l(e,t,n)}}function y(e){return"color: "+F[e].color+"; font-weight: bold"}function v(e){var t=e.kind,r=e.path,n=e.lhs,o=e.rhs,i=e.index,a=e.item;switch(t){case"E":return[r.join("."),n,"→",o];case"N":return[r.join("."),o];case"D":return[r.join(".")];case"A":return[r.join(".")+"["+i+"]",a];default:return[]}}function b(e,t,r,n){var o=c(e,t);try{n?r.groupCollapsed("diff"):r.group("diff")}catch(e){r.log("diff")}o?o.forEach(function(e){var t=e.kind,n=v(e);r.log.apply(r,["%c "+F[t].text,y(t)].concat(P(n)))}):r.log("—— no diff ——");try{r.groupEnd()}catch(e){r.log("—— diff end —— ")}}function m(e,t,r,n){switch("undefined"==typeof e?"undefined":N(e)){case"object":return"function"==typeof e[n]?e[n].apply(e,P(r)):e[n];case"function":return e(t);default:return e}}function w(e){var t=e.timestamp,r=e.duration;return function(e,n,o){var i=["action"];return i.push("%c"+String(e.type)),t&&i.push("%c@ "+n),r&&i.push("%c(in "+o.toFixed(2)+" ms)"),i.join(" ")}}function x(e,t){var r=t.logger,n=t.actionTransformer,o=t.titleFormatter,i=void 0===o?w(t):o,a=t.collapsed,f=t.colors,u=t.level,l=t.diff,c="undefined"==typeof t.titleFormatter;e.forEach(function(o,s){var d=o.started,p=o.startedTime,g=o.action,h=o.prevState,y=o.error,v=o.took,w=o.nextState,x=e[s+1];x&&(w=x.prevState,v=x.started-d);var S=n(g),k="function"==typeof a?a(function(){return w},g,o):a,j=D(p),E=f.title?"color: "+f.title(S)+";":"",A=["color: gray; font-weight: lighter;"];A.push(E),t.timestamp&&A.push("color: gray; font-weight: lighter;"),t.duration&&A.push("color: gray; font-weight: lighter;");var O=i(S,j,v);try{k?f.title&&c?r.groupCollapsed.apply(r,["%c "+O].concat(A)):r.groupCollapsed(O):f.title&&c?r.group.apply(r,["%c "+O].concat(A)):r.group(O)}catch(e){r.log(O)}var N=m(u,S,[h],"prevState"),P=m(u,S,[S],"action"),C=m(u,S,[y,h],"error"),F=m(u,S,[w],"nextState");if(N)if(f.prevState){var L="color: "+f.prevState(h)+"; font-weight: bold";r[N]("%c prev state",L,h)}else r[N]("prev state",h);if(P)if(f.action){var T="color: "+f.action(S)+"; font-weight: bold";r[P]("%c action    ",T,S)}else r[P]("action    ",S);if(y&&C)if(f.error){var M="color: "+f.error(y,h)+"; font-weight: bold;";r[C]("%c error     ",M,y)}else r[C]("error     ",y);if(F)if(f.nextState){var _="color: "+f.nextState(w)+"; font-weight: bold";r[F]("%c next state",_,w)}else r[F]("next state",w);l&&b(h,w,r,k);try{r.groupEnd()}catch(e){r.log("—— log end ——")}})}function S(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object.assign({},L,e),r=t.logger,n=t.stateTransformer,o=t.errorTransformer,i=t.predicate,a=t.logErrors,f=t.diffPredicate;if("undefined"==typeof r)return function(){return function(e){return function(t){return e(t)}}};if(e.getState&&e.dispatch)return console.error("[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:\n// Logger with default options\nimport { logger } from 'redux-logger'\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n// Or you can create your own logger with custom options http://bit.ly/redux-logger-options\nimport createLogger from 'redux-logger'\nconst logger = createLogger({\n  // ...options\n});\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n"),function(){return function(e){return function(t){return e(t)}}};var u=[];return function(e){var r=e.getState;return function(e){return function(l){if("function"==typeof i&&!i(r,l))return e(l);var c={};u.push(c),c.started=O.now(),c.startedTime=new Date,c.prevState=n(r()),c.action=l;var s=void 0;if(a)try{s=e(l)}catch(e){c.error=o(e)}else s=e(l);c.took=O.now()-c.started,c.nextState=n(r());var d=t.diff&&"function"==typeof f?f(r,l):t.diff;if(x(u,Object.assign({},t,{diff:d})),u.length=0,c.error)throw c.error;return s}}}}var k,j,E=function(e,t){return new Array(t+1).join(e)},A=function(e,t){return E("0",t-e.toString().length)+e},D=function(e){return A(e.getHours(),2)+":"+A(e.getMinutes(),2)+":"+A(e.getSeconds(),2)+"."+A(e.getMilliseconds(),3)},O="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.now?performance:Date,N="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},P=function(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)},C=[];k="object"===("undefined"==typeof global?"undefined":N(global))&&global?global:"undefined"!=typeof window?window:{},j=k.DeepDiff,j&&C.push(function(){"undefined"!=typeof j&&k.DeepDiff===c&&(k.DeepDiff=j,j=void 0)}),t(n,r),t(o,r),t(i,r),t(a,r),Object.defineProperties(c,{diff:{value:c,enumerable:!0},observableDiff:{value:l,enumerable:!0},applyDiff:{value:h,enumerable:!0},applyChange:{value:d,enumerable:!0},revertChange:{value:g,enumerable:!0},isConflict:{value:function(){return"undefined"!=typeof j},enumerable:!0},noConflict:{value:function(){return C&&(C.forEach(function(e){e()}),C=null),c},enumerable:!0}});var F={E:{color:"#2196F3",text:"CHANGED:"},N:{color:"#4CAF50",text:"ADDED:"},D:{color:"#F44336",text:"DELETED:"},A:{color:"#2196F3",text:"ARRAY:"}},L={level:"log",logger:console,logErrors:!0,collapsed:void 0,predicate:void 0,duration:!1,timestamp:!0,stateTransformer:function(e){return e},actionTransformer:function(e){return e},errorTransformer:function(e){return e},colors:{title:function(){return"inherit"},prevState:function(){return"#9E9E9E"},action:function(){return"#03A9F4"},nextState:function(){return"#4CAF50"},error:function(){return"#F20404"}},diff:!1,diffPredicate:void 0,transformer:void 0},T=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.dispatch,r=e.getState;return"function"==typeof t||"function"==typeof r?S()({dispatch:t,getState:r}):void console.error("\n[redux-logger v3] BREAKING CHANGE\n[redux-logger v3] Since 3.0.0 redux-logger exports by default logger with default settings.\n[redux-logger v3] Change\n[redux-logger v3] import createLogger from 'redux-logger'\n[redux-logger v3] to\n[redux-logger v3] import { createLogger } from 'redux-logger'\n")};e.defaults=L,e.createLogger=S,e.logger=T,e.default=T,Object.defineProperty(e,"__esModule",{value:!0})});

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(58)))

/***/ }),

/***/ 779:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var compose = __webpack_require__(37).compose;

exports.__esModule = true;
exports.composeWithDevTools = (
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ :
    function() {
      if (arguments.length === 0) return undefined;
      if (typeof arguments[0] === 'object') return compose;
      return compose.apply(null, arguments);
    }
);

exports.devToolsEnhancer = (
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ ?
    window.__REDUX_DEVTOOLS_EXTENSION__ :
    function() { return function(noop) { return noop; } }
);


/***/ }),

/***/ 780:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export FETCH_MOCK */
/* unused harmony export FETCH */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__(296);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//  weak



var FETCH_MOCK = 'FETCH_MOCK';
var FETCH = 'FETCH';
//
// FETCH_MOCK mode
// in any action just add fetch object like:
// {
//  fetch: {
//    type: 'FETCH_MOCK',
//    actionTypes: {
//      request: 'TYPE_FOR_REQUEST',
//      success: 'TYPE_FOR_RECEIVED',
//      fail: 'TYPE_FOR_ERROR',
//    },
//    mockResult: any
//  }
// }
//

// FETCH mode
// in any action just add fetch object like:
// {
//  fetch: {
//    type: 'FETCH',
//    actionTypes: {
//      request: 'TYPE_FOR_REQUEST',
//      success: 'TYPE_FOR_RECEIVED',
//      fail: 'TYPE_FOR_ERROR',
//    },
//    url: 'an url',
//    method: 'get',  // lower case, one of 'get', 'post'...
//    headers: {}     // OPTIONAL CONTENT like: data: { someprop: 'value ...}
//    options: {}     // OPTIONAL CONTENT like: Authorization: 'Bearer _A_TOKEN_'
//  }
// }
//
//
//
//
var fetchMiddleware = function fetchMiddleware(store) {
  return function (next) {
    return function (action) {
      if (!action.fetch) {
        return next(action);
      }

      if (!action.fetch.type || !action.fetch.type === FETCH_MOCK || !action.fetch.type === FETCH) {
        return next(action);
      }

      if (!action.fetch.actionTypes) {
        return next(action);
      }

      /**
       * fetch mock
       * @type {[type]}
       */
      if (action.fetch.type === FETCH_MOCK) {
        if (!action.fetch.mockResult) {
          throw new Error('Fetch middleware require a mockResult payload when type is "FETCH_MOCK"');
        }

        var _action$fetch = action.fetch,
            _action$fetch$actionT = _action$fetch.actionTypes,
            request = _action$fetch$actionT.request,
            success = _action$fetch$actionT.success,
            mockResult = _action$fetch.mockResult;

        // request

        store.dispatch({ type: request });

        // received successful for mock
        return Promise.resolve(store.dispatch({
          type: success,
          payload: mockResult
        }));
      }

      if (action.fetch.type === FETCH) {
        var _action$fetch2 = action.fetch,
            _action$fetch2$action = _action$fetch2.actionTypes,
            _request = _action$fetch2$action.request,
            _success = _action$fetch2$action.success,
            fail = _action$fetch2$action.fail,
            url = _action$fetch2.url,
            method = _action$fetch2.method,
            headers = _action$fetch2.headers,
            options = _action$fetch2.options;

        // request

        store.dispatch({ type: _request });

        // fetch server (success or fail)
        // returns a Promise
        return __WEBPACK_IMPORTED_MODULE_0_axios___default.a.request(_extends({
          method: method,
          url: url,
          withCredentials: true,
          headers: _extends({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Acces-Control-Allow-Origin': '*'
          }, headers)
        }, options)).then(function (data) {
          return store.dispatch({ type: _success, payload: data });
        }).catch(function (err) {
          store.dispatch({ type: fail, error: err });
          return Promise.reject(err);
        });
      }
      return next(action);
    };
  };
};

/* harmony default export */ __webpack_exports__["a"] = (fetchMiddleware);

/***/ }),

/***/ 799:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _warning = __webpack_require__(25);

var _warning2 = _interopRequireDefault(_warning);

var _invariant = __webpack_require__(186);

var _invariant2 = _interopRequireDefault(_invariant);

var _LocationUtils = __webpack_require__(800);

var _PathUtils = __webpack_require__(303);

var _createTransitionManager = __webpack_require__(801);

var _createTransitionManager2 = _interopRequireDefault(_createTransitionManager);

var _DOMUtils = __webpack_require__(802);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HashChangeEvent = 'hashchange';

var HashPathCoders = {
  hashbang: {
    encodePath: function encodePath(path) {
      return path.charAt(0) === '!' ? path : '!/' + (0, _PathUtils.stripLeadingSlash)(path);
    },
    decodePath: function decodePath(path) {
      return path.charAt(0) === '!' ? path.substr(1) : path;
    }
  },
  noslash: {
    encodePath: _PathUtils.stripLeadingSlash,
    decodePath: _PathUtils.addLeadingSlash
  },
  slash: {
    encodePath: _PathUtils.addLeadingSlash,
    decodePath: _PathUtils.addLeadingSlash
  }
};

var getHashPath = function getHashPath() {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var hashIndex = href.indexOf('#');
  return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
};

var pushHashPath = function pushHashPath(path) {
  return window.location.hash = path;
};

var replaceHashPath = function replaceHashPath(path) {
  var hashIndex = window.location.href.indexOf('#');

  window.location.replace(window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + path);
};

var createHashHistory = function createHashHistory() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  (0, _invariant2.default)(_DOMUtils.canUseDOM, 'Hash history needs a DOM');

  var globalHistory = window.history;
  var canGoWithoutReload = (0, _DOMUtils.supportsGoWithoutReloadUsingHash)();

  var _props$getUserConfirm = props.getUserConfirmation,
      getUserConfirmation = _props$getUserConfirm === undefined ? _DOMUtils.getConfirmation : _props$getUserConfirm,
      _props$hashType = props.hashType,
      hashType = _props$hashType === undefined ? 'slash' : _props$hashType;

  var basename = props.basename ? (0, _PathUtils.stripTrailingSlash)((0, _PathUtils.addLeadingSlash)(props.basename)) : '';

  var _HashPathCoders$hashT = HashPathCoders[hashType],
      encodePath = _HashPathCoders$hashT.encodePath,
      decodePath = _HashPathCoders$hashT.decodePath;


  var getDOMLocation = function getDOMLocation() {
    var path = decodePath(getHashPath());

    (0, _warning2.default)(!basename || (0, _PathUtils.hasBasename)(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".');

    if (basename) path = (0, _PathUtils.stripBasename)(path, basename);

    return (0, _LocationUtils.createLocation)(path);
  };

  var transitionManager = (0, _createTransitionManager2.default)();

  var setState = function setState(nextState) {
    _extends(history, nextState);

    history.length = globalHistory.length;

    transitionManager.notifyListeners(history.location, history.action);
  };

  var forceNextPop = false;
  var ignorePath = null;

  var handleHashChange = function handleHashChange() {
    var path = getHashPath();
    var encodedPath = encodePath(path);

    if (path !== encodedPath) {
      // Ensure we always have a properly-encoded hash.
      replaceHashPath(encodedPath);
    } else {
      var location = getDOMLocation();
      var prevLocation = history.location;

      if (!forceNextPop && (0, _LocationUtils.locationsAreEqual)(prevLocation, location)) return; // A hashchange doesn't always == location change.

      if (ignorePath === (0, _PathUtils.createPath)(location)) return; // Ignore this change; we already setState in push/replace.

      ignorePath = null;

      handlePop(location);
    }
  };

  var handlePop = function handlePop(location) {
    if (forceNextPop) {
      forceNextPop = false;
      setState();
    } else {
      var action = 'POP';

      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (ok) {
          setState({ action: action, location: location });
        } else {
          revertPop(location);
        }
      });
    }
  };

  var revertPop = function revertPop(fromLocation) {
    var toLocation = history.location;

    // TODO: We could probably make this more reliable by
    // keeping a list of paths we've seen in sessionStorage.
    // Instead, we just default to 0 for paths we don't know.

    var toIndex = allPaths.lastIndexOf((0, _PathUtils.createPath)(toLocation));

    if (toIndex === -1) toIndex = 0;

    var fromIndex = allPaths.lastIndexOf((0, _PathUtils.createPath)(fromLocation));

    if (fromIndex === -1) fromIndex = 0;

    var delta = toIndex - fromIndex;

    if (delta) {
      forceNextPop = true;
      go(delta);
    }
  };

  // Ensure the hash is encoded properly before doing anything else.
  var path = getHashPath();
  var encodedPath = encodePath(path);

  if (path !== encodedPath) replaceHashPath(encodedPath);

  var initialLocation = getDOMLocation();
  var allPaths = [(0, _PathUtils.createPath)(initialLocation)];

  // Public interface

  var createHref = function createHref(location) {
    return '#' + encodePath(basename + (0, _PathUtils.createPath)(location));
  };

  var push = function push(path, state) {
    (0, _warning2.default)(state === undefined, 'Hash history cannot push state; it is ignored');

    var action = 'PUSH';
    var location = (0, _LocationUtils.createLocation)(path, undefined, undefined, history.location);

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;

      var path = (0, _PathUtils.createPath)(location);
      var encodedPath = encodePath(basename + path);
      var hashChanged = getHashPath() !== encodedPath;

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a PUSH, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path;
        pushHashPath(encodedPath);

        var prevIndex = allPaths.lastIndexOf((0, _PathUtils.createPath)(history.location));
        var nextPaths = allPaths.slice(0, prevIndex === -1 ? 0 : prevIndex + 1);

        nextPaths.push(path);
        allPaths = nextPaths;

        setState({ action: action, location: location });
      } else {
        (0, _warning2.default)(false, 'Hash history cannot PUSH the same path; a new entry will not be added to the history stack');

        setState();
      }
    });
  };

  var replace = function replace(path, state) {
    (0, _warning2.default)(state === undefined, 'Hash history cannot replace state; it is ignored');

    var action = 'REPLACE';
    var location = (0, _LocationUtils.createLocation)(path, undefined, undefined, history.location);

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;

      var path = (0, _PathUtils.createPath)(location);
      var encodedPath = encodePath(basename + path);
      var hashChanged = getHashPath() !== encodedPath;

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a REPLACE, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path;
        replaceHashPath(encodedPath);
      }

      var prevIndex = allPaths.indexOf((0, _PathUtils.createPath)(history.location));

      if (prevIndex !== -1) allPaths[prevIndex] = path;

      setState({ action: action, location: location });
    });
  };

  var go = function go(n) {
    (0, _warning2.default)(canGoWithoutReload, 'Hash history go(n) causes a full page reload in this browser');

    globalHistory.go(n);
  };

  var goBack = function goBack() {
    return go(-1);
  };

  var goForward = function goForward() {
    return go(1);
  };

  var listenerCount = 0;

  var checkDOMListeners = function checkDOMListeners(delta) {
    listenerCount += delta;

    if (listenerCount === 1) {
      (0, _DOMUtils.addEventListener)(window, HashChangeEvent, handleHashChange);
    } else if (listenerCount === 0) {
      (0, _DOMUtils.removeEventListener)(window, HashChangeEvent, handleHashChange);
    }
  };

  var isBlocked = false;

  var block = function block() {
    var prompt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    var unblock = transitionManager.setPrompt(prompt);

    if (!isBlocked) {
      checkDOMListeners(1);
      isBlocked = true;
    }

    return function () {
      if (isBlocked) {
        isBlocked = false;
        checkDOMListeners(-1);
      }

      return unblock();
    };
  };

  var listen = function listen(listener) {
    var unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);

    return function () {
      checkDOMListeners(-1);
      unlisten();
    };
  };

  var history = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    block: block,
    listen: listen
  };

  return history;
};

exports.default = createHashHistory;

/***/ }),

/***/ 800:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.locationsAreEqual = exports.createLocation = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _resolvePathname = __webpack_require__(269);

var _resolvePathname2 = _interopRequireDefault(_resolvePathname);

var _valueEqual = __webpack_require__(270);

var _valueEqual2 = _interopRequireDefault(_valueEqual);

var _PathUtils = __webpack_require__(303);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createLocation = exports.createLocation = function createLocation(path, state, key, currentLocation) {
  var location = void 0;
  if (typeof path === 'string') {
    // Two-arg form: push(path, state)
    location = (0, _PathUtils.parsePath)(path);
    location.state = state;
  } else {
    // One-arg form: push(location)
    location = _extends({}, path);

    if (location.pathname === undefined) location.pathname = '';

    if (location.search) {
      if (location.search.charAt(0) !== '?') location.search = '?' + location.search;
    } else {
      location.search = '';
    }

    if (location.hash) {
      if (location.hash.charAt(0) !== '#') location.hash = '#' + location.hash;
    } else {
      location.hash = '';
    }

    if (state !== undefined && location.state === undefined) location.state = state;
  }

  try {
    location.pathname = decodeURI(location.pathname);
  } catch (e) {
    if (e instanceof URIError) {
      throw new URIError('Pathname "' + location.pathname + '" could not be decoded. ' + 'This is likely caused by an invalid percent-encoding.');
    } else {
      throw e;
    }
  }

  if (key) location.key = key;

  if (currentLocation) {
    // Resolve incomplete/relative pathname relative to current location.
    if (!location.pathname) {
      location.pathname = currentLocation.pathname;
    } else if (location.pathname.charAt(0) !== '/') {
      location.pathname = (0, _resolvePathname2.default)(location.pathname, currentLocation.pathname);
    }
  } else {
    // When there is no prior location and pathname is empty, set it to /
    if (!location.pathname) {
      location.pathname = '/';
    }
  }

  return location;
};

var locationsAreEqual = exports.locationsAreEqual = function locationsAreEqual(a, b) {
  return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && (0, _valueEqual2.default)(a.state, b.state);
};

/***/ }),

/***/ 801:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _warning = __webpack_require__(25);

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createTransitionManager = function createTransitionManager() {
  var prompt = null;

  var setPrompt = function setPrompt(nextPrompt) {
    (0, _warning2.default)(prompt == null, 'A history supports only one prompt at a time');

    prompt = nextPrompt;

    return function () {
      if (prompt === nextPrompt) prompt = null;
    };
  };

  var confirmTransitionTo = function confirmTransitionTo(location, action, getUserConfirmation, callback) {
    // TODO: If another transition starts while we're still confirming
    // the previous one, we may end up in a weird state. Figure out the
    // best way to handle this.
    if (prompt != null) {
      var result = typeof prompt === 'function' ? prompt(location, action) : prompt;

      if (typeof result === 'string') {
        if (typeof getUserConfirmation === 'function') {
          getUserConfirmation(result, callback);
        } else {
          (0, _warning2.default)(false, 'A history needs a getUserConfirmation function in order to use a prompt message');

          callback(true);
        }
      } else {
        // Return false from a transition hook to cancel the transition.
        callback(result !== false);
      }
    } else {
      callback(true);
    }
  };

  var listeners = [];

  var appendListener = function appendListener(fn) {
    var isActive = true;

    var listener = function listener() {
      if (isActive) fn.apply(undefined, arguments);
    };

    listeners.push(listener);

    return function () {
      isActive = false;
      listeners = listeners.filter(function (item) {
        return item !== listener;
      });
    };
  };

  var notifyListeners = function notifyListeners() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    listeners.forEach(function (listener) {
      return listener.apply(undefined, args);
    });
  };

  return {
    setPrompt: setPrompt,
    confirmTransitionTo: confirmTransitionTo,
    appendListener: appendListener,
    notifyListeners: notifyListeners
  };
};

exports.default = createTransitionManager;

/***/ }),

/***/ 802:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
var canUseDOM = exports.canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

var addEventListener = exports.addEventListener = function addEventListener(node, event, listener) {
  return node.addEventListener ? node.addEventListener(event, listener, false) : node.attachEvent('on' + event, listener);
};

var removeEventListener = exports.removeEventListener = function removeEventListener(node, event, listener) {
  return node.removeEventListener ? node.removeEventListener(event, listener, false) : node.detachEvent('on' + event, listener);
};

var getConfirmation = exports.getConfirmation = function getConfirmation(message, callback) {
  return callback(window.confirm(message));
}; // eslint-disable-line no-alert

/**
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
 */
var supportsHistory = exports.supportsHistory = function supportsHistory() {
  var ua = window.navigator.userAgent;

  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) return false;

  return window.history && 'pushState' in window.history;
};

/**
 * Returns true if browser fires popstate on hash change.
 * IE10 and IE11 do not.
 */
var supportsPopStateOnHashChange = exports.supportsPopStateOnHashChange = function supportsPopStateOnHashChange() {
  return window.navigator.userAgent.indexOf('Trident') === -1;
};

/**
 * Returns false if using go(n) with hash history causes a full page reload.
 */
var supportsGoWithoutReloadUsingHash = exports.supportsGoWithoutReloadUsingHash = function supportsGoWithoutReloadUsingHash() {
  return window.navigator.userAgent.indexOf('Firefox') === -1;
};

/**
 * Returns true if a given popstate event is an extraneous WebKit event.
 * Accounts for the fact that Chrome on iOS fires real popstate events
 * containing undefined state when pressing the back button.
 */
var isExtraneousPopstateEvent = exports.isExtraneousPopstateEvent = function isExtraneousPopstateEvent(event) {
  return event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1;
};

/***/ }),

/***/ 803:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export reducers */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_router_redux__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__earningGraph__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__sideMenu__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__userInfos__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__teamMates__ = __webpack_require__(433);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__views__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__userAuth__ = __webpack_require__(434);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//  weak










var reducers = {
  earningGraph: __WEBPACK_IMPORTED_MODULE_2__earningGraph__["default"],
  sideMenu: __WEBPACK_IMPORTED_MODULE_3__sideMenu__["default"],
  userInfos: __WEBPACK_IMPORTED_MODULE_4__userInfos__["default"],
  teamMates: __WEBPACK_IMPORTED_MODULE_5__teamMates__["a" /* default */],
  views: __WEBPACK_IMPORTED_MODULE_6__views__["default"],
  userAuth: __WEBPACK_IMPORTED_MODULE_7__userAuth__["default"]
};

/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_1_redux__["combineReducers"])(_extends({}, reducers, {
  routing: __WEBPACK_IMPORTED_MODULE_0_react_router_redux__["routerReducer"]
})));

/***/ }),

/***/ 805:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return appConfig; });
//  weak

var appConfig = {
  // dev mode to mock async data for instance
  DEV_MODE: true,
  // When you need some kind "console spam" to debug
  DEBUG_ENABLED: true,
  // fake delay to mock async
  FAKE_ASYNC_DELAY: 1000,

  APP_NAME: 'PMS',

  // connection status text references
  CONNECTION_STATUS: {
    online: 'online',
    disconnected: 'disconnected'
  },
  // eaningGraph config
  earningGraph: {
    data: {
      API: 'api/earnigGraphData'
    }
  },
  teamMates: {
    data: {
      API: 'api/teamMates'
    }
  },

  // userInfos config
  userInfos: {
    data: {
      API: 'api/userInfos'
    }
  },

  HELLO_WORD: 'Hello'

};

/***/ }),

/***/ 806:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getEarningGraphData; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__fetchTools__ = __webpack_require__(102);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//  weak




var getEarningGraphData = function getEarningGraphData() {
  var url = Object(__WEBPACK_IMPORTED_MODULE_1__fetchTools__["c" /* getLocationOrigin */])() + '/' + __WEBPACK_IMPORTED_MODULE_0__config__["a" /* appConfig */].earningGraph.data.API;
  var options = _extends({}, __WEBPACK_IMPORTED_MODULE_1__fetchTools__["b" /* defaultOptions */]);

  return fetch(url, options).then(__WEBPACK_IMPORTED_MODULE_1__fetchTools__["a" /* checkStatus */]).then(__WEBPACK_IMPORTED_MODULE_1__fetchTools__["d" /* parseJSON */]).then(function (data) {
    return data;
  }).catch(function (error) {
    return error;
  });
};

/***/ }),

/***/ 807:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getTeamMatesData; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__fetchTools__ = __webpack_require__(102);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//  weak




var getTeamMatesData = function getTeamMatesData() {
  var url = Object(__WEBPACK_IMPORTED_MODULE_1__fetchTools__["c" /* getLocationOrigin */])() + '/' + __WEBPACK_IMPORTED_MODULE_0__config__["a" /* appConfig */].teamMates.data.API;
  var options = _extends({}, __WEBPACK_IMPORTED_MODULE_1__fetchTools__["b" /* defaultOptions */]);

  fetch(url, options).then(__WEBPACK_IMPORTED_MODULE_1__fetchTools__["a" /* checkStatus */]).then(__WEBPACK_IMPORTED_MODULE_1__fetchTools__["d" /* parseJSON */]).then(function (data) {
    return data;
  }).catch(function (error) {
    return error;
  });
};

/***/ }),

/***/ 808:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getUserInfoData; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__fetchTools__ = __webpack_require__(102);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//  weak




var getUserInfoData = function getUserInfoData() {
  var url = Object(__WEBPACK_IMPORTED_MODULE_1__fetchTools__["c" /* getLocationOrigin */])() + '/' + __WEBPACK_IMPORTED_MODULE_0__config__["a" /* appConfig */].userInfos.data.API;
  var options = _extends({}, __WEBPACK_IMPORTED_MODULE_1__fetchTools__["b" /* defaultOptions */]);

  fetch(url, options).then(__WEBPACK_IMPORTED_MODULE_1__fetchTools__["a" /* checkStatus */]).then(__WEBPACK_IMPORTED_MODULE_1__fetchTools__["d" /* parseJSON */]).then(function (data) {
    return data;
  }).catch(function (error) {
    return error;
  });
};

/***/ }),

/***/ 809:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return navigation; });
var navigation = {
  brand: 'reactDirectorAdmin',
  leftLinks: [],
  rightLinks: [{
    label: 'Home',
    link: '/',
    view: 'home',
    isRouteBtn: true
  }, {
    label: 'About',
    link: '/about',
    view: 'about',
    isRouteBtn: true
  }],
  sideMenu: [
  // group menu #1
  {
    id: 1,
    group: 'Dashboard  ',
    menus: [{
      name: 'Dashboard preview',
      linkTo: '/',
      faIconName: 'fa-eye'
    }]
  },
  // group menu #2
  {
    id: 2,
    group: 'SimpleTables',
    menus: [{
      name: 'Simple tables preview',
      linkTo: '/simpleTables',
      faIconName: 'fa-eye'
    }]
  }]
};

/***/ }),

/***/ 810:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return earningGraphMockData; });
var earningGraphMockData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [{
    label: 'My First dataset',
    fillColor: 'rgba(220,220,220,0.2)',
    strokeColor: 'rgba(220,220,220,1)',
    pointColor: 'rgba(220,220,220,1)',
    pointStrokeColor: '#fff',
    pointHighlightFill: '#fff',
    pointHighlightStroke: 'rgba(220,220,220,1)',
    data: [65, 59, 80, 81, 56, 55, 40]
  }, {
    label: 'My Second dataset',
    fillColor: 'rgba(151,187,205,0.2)',
    strokeColor: 'rgba(151,187,205,1)',
    pointColor: 'rgba(151,187,205,1)',
    pointStrokeColor: '#fff',
    pointHighlightFill: '#fff',
    pointHighlightStroke: 'rgba(151,187,205,1)',
    data: [28, 48, 40, 19, 86, 27, 90]
  }]
};

/***/ }),

/***/ 811:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return teamMatesMock; });
var teamMatesMock = [{
  picture: '/public/img/26115.jpg',
  firstname: 'Damon',
  lastname: 'Parker',
  profile: 'Admin',
  profileColor: 'danger'
}, {
  picture: '/public/img/26115.jpg',
  firstname: 'Joe',
  lastname: 'Waston',
  profile: 'Member',
  profileColor: 'warning'
}, {
  picture: '/public/img/26115.jpg',
  firstname: 'Jannie',
  lastname: 'Davis',
  profile: 'Editor',
  profileColor: 'warning'
}, {
  picture: '/public/img/26115.jpg',
  firstname: 'Emma',
  lastname: 'Welson',
  profile: 'Editor',
  profileColor: 'success'
}, {
  picture: '/public/img/26115.jpg',
  firstname: 'Emma',
  lastname: 'Welson',
  profile: 'Editor',
  profileColor: 'info'
}];

/***/ }),

/***/ 812:
/***/ (function(module, exports) {



/***/ }),

/***/ 813:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var base64_url_decode = __webpack_require__(814);

function InvalidTokenError(message) {
  this.message = message;
}

InvalidTokenError.prototype = new Error();
InvalidTokenError.prototype.name = 'InvalidTokenError';

module.exports = function (token,options) {
  if (typeof token !== 'string') {
    throw new InvalidTokenError('Invalid token specified');
  }

  options = options || {};
  var pos = options.header === true ? 0 : 1;
  try {
    return JSON.parse(base64_url_decode(token.split('.')[pos]));
  } catch (e) {
    throw new InvalidTokenError('Invalid token specified: ' + e.message);
  }
};

module.exports.InvalidTokenError = InvalidTokenError;


/***/ }),

/***/ 814:
/***/ (function(module, exports, __webpack_require__) {

var atob = __webpack_require__(815);

function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
    var code = p.charCodeAt(0).toString(16).toUpperCase();
    if (code.length < 2) {
      code = '0' + code;
    }
    return '%' + code;
  }));
}

module.exports = function(str) {
  var output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw "Illegal base64url string!";
  }

  try{
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
};


/***/ }),

/***/ 815:
/***/ (function(module, exports) {

/**
 * The code was extracted from:
 * https://github.com/davidchambers/Base64.js
 */

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function InvalidCharacterError(message) {
  this.message = message;
}

InvalidCharacterError.prototype = new Error();
InvalidCharacterError.prototype.name = 'InvalidCharacterError';

function polyfill (input) {
  var str = String(input).replace(/=+$/, '');
  if (str.length % 4 == 1) {
    throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
  }
  for (
    // initialize result and counters
    var bc = 0, bs, buffer, idx = 0, output = '';
    // get next character
    buffer = str.charAt(idx++);
    // character found in table? initialize bit storage and add its ascii value;
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      // and if not first of each 4 characters,
      // convert the first 8 bits to one ascii character
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    // try to find character in table (0-63, not found => -1)
    buffer = chars.indexOf(buffer);
  }
  return output;
}


module.exports = typeof window !== 'undefined' && window.atob && window.atob.bind(window) || polyfill;


/***/ }),

/***/ 816:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__localStorage__ = __webpack_require__(817);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__localStorage__["a"]; });
//  weak



/***/ }),

/***/ 817:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return localStorageManager; });
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//  weak

var objectHasProperty = Object.prototype.hasOwnProperty;
var jsonStringify = JSON.stringify;
var jsonParse = JSON.parse;
/*
    localStorageManager middleware (READ or WRITE to localStorage)
      -> does not delete: do it on your own

    dispatch an action with "permanentStore" object :

    permanentStore: {
      required: [boolean]     -> REQUIRED,
      storeKey: [string]      -> REQUIRED
      storeValue: [string]    -> REQUIRED | if write should be suppplied by a value to write || if read will be suppplied by middleware with value
      ReadOrWrite: [boolean]  -> REQUIRED | false is READ storage and true is WRITE to storage
    }
 */
/* eslint-disable no-unused-vars */
var localStorageManager = function localStorageManager(store) {
  return function (next) {
    return function (action) {
      // if action contains a "permanentStore" object property: middleware localStorage should be required
      if (action && action.permanentStore && isPermanentStoreActive(action.permanentStore)) {
        var permanentStore = action.permanentStore;
        if (permanentStore.required) {
          var key = permanentStore.storeKey;
          var value = permanentStore.storeValue;

          if (permanentStore.ReadOrWrite) {
            // write to localStorage
            localStorage.setItem(key, jsonStringify(value));
            next(_extends({}, action, { permanentStore: _extends({}, permanentStore) }));
          } else {
            // read localStorage and set action.permanentStore.value to read value from localStorage
            var item = localStorage.getItem(key) || 'false';
            permanentStore.storeValue = jsonParse(item);
            next(_extends({}, action, { permanentStore: _extends({}, permanentStore) }));
          }
        } else {
          // permanent storage not needed in this action:
          next(action);
        }
      } else {
        next(action);
      }
    };
  };
};
/* eslint-enable no-unused-vars */

/*
    localStorageManager middleware helpers
 */

// permanentStore validation helper
function isPermanentStoreActive(object) {
  if (isPermanentStoreObject(object)) {
    return object.required;
  }
  return false;
}
// permanentStore validation helper
function isPermanentStoreObject(object) {
  if (object && objectHasProperty.call(object, 'required') && typeof object.required === 'boolean' && objectHasProperty.call(object, 'storeKey') && typeof object.storeKey === 'string' && storeKeyIsValid(object.storeKey) && objectHasProperty.call(object, 'storeValue') && objectHasProperty.call(object, 'ReadOrWrite') && typeof object.ReadOrWrite === 'boolean') {
    return true;
  }
  return false;
}
// permanentStore validation helper
function storeKeyIsValid() {
  var storeKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  if (storeKey && storeKey.trim().length > 0) {
    return true;
  } else {
    return false;
  }
}

/***/ }),

/***/ 818:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_redux__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__redux_modules_views__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__redux_modules_userInfos__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__redux_modules_sideMenu__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__redux_modules_earningGraph__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__App__ = __webpack_require__(819);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//  weak










var mapStateToProps = function mapStateToProps(state) {
  return {
    // views:
    currentView: state.views.currentView,
    // sideMenu:
    sideMenuIsCollapsed: state.sideMenu.isCollapsed,
    // userInfos:
    userInfos: state.userInfos.data,
    userIsConnected: state.userInfos.isConnected
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    actions: Object(__WEBPACK_IMPORTED_MODULE_1_redux__["bindActionCreators"])(_extends({}, __WEBPACK_IMPORTED_MODULE_3__redux_modules_views__, __WEBPACK_IMPORTED_MODULE_4__redux_modules_userInfos__, __WEBPACK_IMPORTED_MODULE_5__redux_modules_sideMenu__, __WEBPACK_IMPORTED_MODULE_6__redux_modules_earningGraph__), dispatch)
  };
};

// we use here compose (from redux) just for conveniance (since compose(f,h, g)(args) looks better than f(g(h(args))))
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_1_redux__["compose"])(__WEBPACK_IMPORTED_MODULE_2_react_router__["withRouter"], // IMPORTANT: witRouter is "needed here" to avoid blocking routing:
Object(__WEBPACK_IMPORTED_MODULE_0_react_redux__["connect"])(mapStateToProps, mapDispatchToProps))(__WEBPACK_IMPORTED_MODULE_7__App__["a" /* default */]));

/***/ }),

/***/ 819:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_components__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__views__ = __webpack_require__(822);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__config__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models__ = __webpack_require__(429);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__routes_MainRoutes__ = __webpack_require__(829);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_auth__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__img_user_jpg__ = __webpack_require__(431);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__img_user_jpg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__img_user_jpg__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//  weak

// #region imports









// #endregion


var App = function (_Component) {
  _inherits(App, _Component);

  function App() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, App);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = App.__proto__ || Object.getPrototypeOf(App)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      appName: __WEBPACK_IMPORTED_MODULE_4__config__["a" /* appConfig */].APP_NAME,
      connectionStatus: __WEBPACK_IMPORTED_MODULE_4__config__["a" /* appConfig */].CONNECTION_STATUS,
      helloWord: __WEBPACK_IMPORTED_MODULE_4__config__["a" /* appConfig */].HELLO_WORD
    }, _this.handlesMenuButtonClick = function (event) {
      if (event) {
        event.preventDefault();
      }
      var toggleSideMenu = _this.props.actions.toggleSideMenu;

      toggleSideMenu();
    }, _this.handlesOnLogout = function (event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      // clear all application storage
      __WEBPACK_IMPORTED_MODULE_7__services_auth__["a" /* default */].clearAllAppStorage();
      // redirect to login
      var history = _this.props.history;

      history.push('/login');
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(App, [{
    key: 'componentDidMount',


    // #region lifecycle methods
    value: function componentDidMount() {
      var _props$actions = this.props.actions,
          fetchUserInfoDataIfNeeded = _props$actions.fetchUserInfoDataIfNeeded,
          getSideMenuCollpasedStateFromLocalStorage = _props$actions.getSideMenuCollpasedStateFromLocalStorage;


      fetchUserInfoDataIfNeeded();
      getSideMenuCollpasedStateFromLocalStorage();
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          appName = _state.appName,
          connectionStatus = _state.connectionStatus,
          helloWord = _state.helloWord;
      var _props = this.props,
          userInfos = _props.userInfos,
          userIsConnected = _props.userIsConnected;
      var _props2 = this.props,
          sideMenuIsCollapsed = _props2.sideMenuIsCollapsed,
          currentView = _props2.currentView;


      var userFullName = userInfos.firstname + ' ' + userInfos.lastname.toUpperCase();
      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'div',
        null,
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__common_components__["d" /* Header */], {
          appName: appName,
          userLogin: userInfos.login,
          userFirstname: userInfos.firstname,
          userLastname: userInfos.lastname,
          userPicture: __WEBPACK_IMPORTED_MODULE_8__img_user_jpg___default.a,
          showPicture: userInfos.showPicture,
          currentView: currentView,
          toggleSideMenu: this.handlesMenuButtonClick,
          onLogout: this.handlesOnLogout
        }),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'div',
          { className: 'wrapper row-offcanvas row-offcanvas-left' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__common_components__["b" /* AsideLeft */], {
            isAnimated: true,
            sideMenu: __WEBPACK_IMPORTED_MODULE_5__models__["b" /* navigation */].sideMenu,
            currentView: currentView,
            isCollapsed: sideMenuIsCollapsed,
            helloWord: helloWord,
            connectionStatus: connectionStatus,
            userIsConnected: userIsConnected,
            username: userFullName,
            userPicture: userInfos.picture,
            showPicture: userInfos.showPicture
          }),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_2__common_components__["c" /* AsideRight */],
            {
              isAnimated: true,
              isExpanded: sideMenuIsCollapsed },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__routes_MainRoutes__["a" /* default */], null)
          )
        ),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__views__["a" /* Modals */], null)
      );
    }
    // #endregion

  }]);

  return App;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

App.propTypes = {
  // react-router 4:
  match: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.object.isRequired,
  location: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.object.isRequired,
  history: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.object.isRequired,

  sideMenuIsCollapsed: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.bool,
  userInfos: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.shape({
    login: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string,
    firstname: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string,
    lastname: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string,
    picture: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string,
    showPicture: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.bool
  }),
  userIsConnected: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.bool,
  currentView: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string,

  actions: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.shape({
    enterHome: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    leaveHome: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    fetchEarningGraphDataIfNeeded: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    fetchUserInfoDataIfNeeded: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    openSideMenu: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    closeSideMenu: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    toggleSideMenu: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func
  })
};


/* harmony default export */ __webpack_exports__["a"] = (App);

/***/ }),

/***/ 820:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
throw new Error("Cannot find module \"./asideLeft/AsideLeft\"");
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__asideLeft_AsideLeft___default.a; });
throw new Error("Cannot find module \"./asideRight/AsideRight\"");
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__asideRight_AsideRight___default.a; });
//  weak




/***/ }),

/***/ 821:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
throw new Error("Cannot find module \"./Table\"");
/* unused harmony reexport Table */
throw new Error("Cannot find module \"./tableHeader/TableHeader\"");
/* unused harmony reexport TableHeader */
throw new Error("Cannot find module \"./tableBody/TableBody\"");
/* unused harmony reexport TableBody */
throw new Error("Cannot find module \"./tableRow/TableRow\"");
/* unused harmony reexport TableRow */
throw new Error("Cannot find module \"./tableCol/TableCol\"");
/* unused harmony reexport TableCol */
//  weak







/***/ }),

/***/ 822:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__home__ = __webpack_require__(435);
/* unused harmony reexport Home */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__simpleTables__ = __webpack_require__(436);
/* unused harmony reexport SimpleTables */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__general__ = __webpack_require__(825);
/* unused harmony reexport General */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modals_Modals__ = __webpack_require__(827);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_3__modals_Modals__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pageNotFound__ = __webpack_require__(437);
/* unused harmony reexport PageNotFound */
//  weak







/***/ }),

/***/ 823:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_components__ = __webpack_require__(139);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// flow weak





var Home = function (_PureComponent) {
  _inherits(Home, _PureComponent);

  function Home() {
    _classCallCheck(this, Home);

    return _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).apply(this, arguments));
  }

  _createClass(Home, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var enterHome = this.props.actions.enterHome;

      enterHome();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props$actions = this.props.actions,
          fetchEarningGraphDataIfNeeded = _props$actions.fetchEarningGraphDataIfNeeded,
          fetchTeamMatesDataIfNeeded = _props$actions.fetchTeamMatesDataIfNeeded;


      fetchEarningGraphDataIfNeeded();
      fetchTeamMatesDataIfNeeded();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var leaveHome = this.props.actions.leaveHome;

      leaveHome();
    }
  }, {
    key: 'render',
    value: function render() {
      _objectDestructuringEmpty(this.props);

      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_2__common_components__["a" /* AnimatedView */],
        null,
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'div',
          { className: 'nothing' },
          'Dashboard preview'
        )
      );
    }
  }]);

  return Home;
}(__WEBPACK_IMPORTED_MODULE_0_react__["PureComponent"]);

Home.propTypes = {
  earningGraphLabels: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.array,
  earningGraphDatasets: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.array,
  teamMatesIsFetching: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.bool,
  teamMates: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.arrayOf(__WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.shape({
    picture: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string,
    firstname: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string,
    lastname: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string,
    profile: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string,
    profileColor: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.oneOf(['danger', 'warning', 'info', 'success'])
  })),
  actions: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.shape({
    enterHome: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    leaveHome: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    fetchEarningGraphDataIfNeeded: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    fetchTeamMatesDataIfNeeded: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func
  })
};


/* harmony default export */ __webpack_exports__["a"] = (Home);

/***/ }),

/***/ 824:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_components__ = __webpack_require__(139);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//  weak





var SimpleTables = function (_PureComponent) {
  _inherits(SimpleTables, _PureComponent);

  function SimpleTables() {
    _classCallCheck(this, SimpleTables);

    return _possibleConstructorReturn(this, (SimpleTables.__proto__ || Object.getPrototypeOf(SimpleTables)).apply(this, arguments));
  }

  _createClass(SimpleTables, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var enterSimpleTables = this.props.actions.enterSimpleTables;

      enterSimpleTables();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var leaveSimpleTables = this.props.actions.leaveSimpleTables;

      leaveSimpleTables();
    }
  }, {
    key: 'render',
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_2__common_components__["a" /* AnimatedView */],
        null,
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'div',
          { className: 'row' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            'div',
            { className: 'col-md-6' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              'div',
              { className: 'panel' },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'header',
                { className: 'panel-heading' },
                'Bordered Table'
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                { className: 'panel-body' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'table',
                  { className: 'table table-bordered' },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'thead',
                    null,
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'th',
                        { style: { width: '10px' } },
                        '#'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'th',
                        null,
                        'Task'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'th',
                        null,
                        'Progress'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'th',
                        { style: { width: '40px' } },
                        'Label'
                      )
                    )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'tbody',
                    null,
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '1.'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'Update software'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'div',
                          { className: 'progress xs' },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                            className: 'progress-bar progress-bar-danger',
                            style: { width: '55%' } })
                        )
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'span',
                          { className: 'badge bg-red' },
                          '55%'
                        )
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '2.'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'Clean database'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'div',
                          { className: 'progress xs' },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                            className: 'progress-bar progress-bar-yellow',
                            style: { width: '70%' } })
                        )
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'span',
                          { className: 'badge bg-yellow' },
                          '70%'
                        )
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '3.'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'Cron job running'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'div',
                          { className: 'progress xs progress-striped active' },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                            className: 'progress-bar progress-bar-primary',
                            style: { width: '30%' } })
                        )
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'span',
                          { className: 'badge bg-light-blue' },
                          '30%'
                        )
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '4.'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'Fix and squish bugs'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'div',
                          { className: 'progress xs progress-striped active' },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                            className: 'progress-bar progress-bar-success',
                            style: { width: '90%' } })
                        )
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'span',
                          { className: 'badge bg-green' },
                          '90%'
                        )
                      )
                    )
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'div',
                  { className: 'table-foot' },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'ul',
                    { className: 'pagination pagination-sm no-margin pull-right' },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'li',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'a',
                        { href: '#' },
                        '\xAB'
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'li',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'a',
                        { href: '#' },
                        '1'
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'li',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'a',
                        { href: '#' },
                        '2'
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'li',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'a',
                        { href: '#' },
                        '3'
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'li',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'a',
                        { href: '#' },
                        '\xBB'
                      )
                    )
                  )
                )
              )
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              'div',
              { className: 'panel' },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'header',
                { className: 'panel-heading' },
                'Condensed Full Width Table'
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                { className: 'panel-body no-padding' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'table',
                  { className: 'table table-condensed' },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'thead',
                    null,
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'th',
                        { style: { width: '10px' } },
                        '#'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'th',
                        null,
                        'Task'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'th',
                        null,
                        'Progress'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'th',
                        { style: { width: '40px' } },
                        'Label'
                      )
                    )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'tbody',
                    null,
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '1.'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'Update software'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'div',
                          { className: 'progress xs' },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                            className: 'progress-bar progress-bar-danger',
                            style: { width: '55%' } })
                        )
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'span',
                          { className: 'badge bg-red' },
                          '55%'
                        )
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '2.'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'Clean database'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'div',
                          { className: 'progress xs' },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'progress-bar progress-bar-yellow', style: { width: '70%' } })
                        )
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'span',
                          { className: 'badge bg-yellow' },
                          '70%'
                        )
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '3.'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'Cron job running'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'div',
                          { className: 'progress xs progress-striped active' },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'progress-bar progress-bar-primary', style: { width: '30%' } })
                        )
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'span',
                          { className: 'badge bg-light-blue' },
                          '30%'
                        )
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '4.'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'Fix and squish bugs'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'div',
                          { className: 'progress xs progress-striped active' },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { className: 'progress-bar progress-bar-success', style: { width: '90%' } })
                        )
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'span',
                          { className: 'badge bg-green' },
                          '90%'
                        )
                      )
                    )
                  )
                )
              )
            )
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            'div',
            { className: 'col-md-6' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              'div',
              { className: 'panel' },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'header',
                { className: 'panel-heading' },
                'Simple Full Width Table'
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                { className: 'panel-body' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'div',
                  { className: 'box-tools' },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'ul',
                    { className: 'pagination pagination-sm m-b-10 m-t-10 pull-right' },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'li',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'a',
                        { href: '#' },
                        '\xAB'
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'li',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'a',
                        { href: '#' },
                        '1'
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'li',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'a',
                        { href: '#' },
                        '2'
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'li',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'a',
                        { href: '#' },
                        '3'
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'li',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'a',
                        { href: '#' },
                        '\xBB'
                      )
                    )
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'table',
                  { className: 'table' },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'thead',
                    null,
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'th',
                        { style: { width: '10px' } },
                        '#'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'th',
                        null,
                        'Task'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'th',
                        null,
                        'Progress'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'th',
                        { style: { width: '40px' } },
                        'Label'
                      )
                    )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'tbody',
                    null,
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '1.'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'Update software'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'div',
                          { className: 'progress xs' },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                            className: 'progress-bar progress-bar-danger',
                            style: { width: '55%' } })
                        )
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'span',
                          { className: 'badge bg-red' },
                          '55%'
                        )
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '2.'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'Clean database'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'div',
                          { className: 'progress xs' },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                            className: 'progress-bar progress-bar-yellow',
                            style: { width: '70%' } })
                        )
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'span',
                          { className: 'badge bg-yellow' },
                          '70%'
                        )
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '3.'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'Cron job running'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'div',
                          { className: 'progress xs progress-striped active' },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                            className: 'progress-bar progress-bar-primary',
                            style: { width: '30%' } })
                        )
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'span',
                          { className: 'badge bg-light-blue' },
                          '30%'
                        )
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '4.'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'Fix and squish bugs'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'div',
                          { className: 'progress xs progress-striped active' },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                            className: 'progress-bar progress-bar-success',
                            style: { width: '90%' } })
                        )
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'span',
                          { className: 'badge bg-green' },
                          '90%'
                        )
                      )
                    )
                  )
                )
              )
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              'div',
              { className: 'panel' },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'header',
                { className: 'panel-heading' },
                'Striped Full Width Table'
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                { className: 'panel-body' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'table',
                  { className: 'table table-striped' },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'thead',
                    null,
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'th',
                        { style: { width: '10px' } },
                        '#'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'th',
                        null,
                        'Task'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'th',
                        null,
                        'Progress'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'th',
                        { style: { width: '40px' } },
                        'Label'
                      )
                    )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'tbody',
                    null,
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '1.'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'Update software'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'div',
                          { className: 'progress xs' },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                            className: 'progress-bar progress-bar-danger',
                            style: { width: '55%' } })
                        )
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'span',
                          { className: 'badge bg-red' },
                          '55%'
                        )
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '2.'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'Clean database'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'div',
                          { className: 'progress xs' },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                            className: 'progress-bar progress-bar-yellow',
                            style: { width: '70%' } })
                        )
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'span',
                          { className: 'badge bg-yellow' },
                          '70%'
                        )
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '3.'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'Cron job running'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'div',
                          { className: 'progress xs progress-striped active' },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                            className: 'progress-bar progress-bar-primary',
                            style: { width: '30%' } })
                        )
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'span',
                          { className: 'badge bg-light-blue' },
                          '30%'
                        )
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '4.'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'Fix and squish bugs'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'div',
                          { className: 'progress xs progress-striped active' },
                          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
                            className: 'progress-bar progress-bar-success',
                            style: { width: '90%' } })
                        )
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'span',
                          { className: 'badge bg-green' },
                          '90%'
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        ),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'div',
          { className: 'row' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            'div',
            { className: 'col-xs-12' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              'div',
              { className: 'panel' },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'header',
                { className: 'panel-heading' },
                'Responsive Hover Table'
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                { className: 'panel-body table-responsive' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'div',
                  { className: 'box-tools m-b-15' },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    { className: 'input-group' },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('input', {
                      type: 'text',
                      name: 'table_search',
                      className: 'form-control input-sm pull-right',
                      style: { width: '150px' },
                      placeholder: 'Search'
                    }),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'div',
                      { className: 'input-group-btn' },
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'button',
                        { className: 'btn btn-sm btn-default' },
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('i', { className: 'fa fa-search' })
                      )
                    )
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'table',
                  { className: 'table table-hover' },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'thead',
                    null,
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'th',
                        null,
                        'ID'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'th',
                        null,
                        'User'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'th',
                        null,
                        'Date'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'th',
                        null,
                        'Status'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'th',
                        null,
                        'Reason'
                      )
                    )
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'tbody',
                    null,
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '183'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'John Doe'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '11-7-2014'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'span',
                          { className: 'label label-success' },
                          'Approved'
                        )
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'Bacon ipsum dolor sit amet salami venison chicken flank fatback doner.'
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '219'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'Jane Doe'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '11-7-2014'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'span',
                          { className: 'label label-warning' },
                          'Pending'
                        )
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'Bacon ipsum dolor sit amet salami venison chicken flank fatback doner.'
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '657'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'Bob Doe'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '11-7-2014'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'span',
                          { className: 'label label-primary' },
                          'Approved'
                        )
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'Bacon ipsum dolor sit amet salami venison chicken flank fatback doner.'
                      )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      'tr',
                      null,
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '175'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'Mike Doe'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        '11-7-2014'
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                          'span',
                          { className: 'label label-danger' },
                          'Denied'
                        )
                      ),
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'td',
                        null,
                        'Bacon ipsum dolor sit amet salami venison chicken flank fatback doner.'
                      )
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
  }]);

  return SimpleTables;
}(__WEBPACK_IMPORTED_MODULE_0_react__["PureComponent"]);

SimpleTables.propTypes = {
  actions: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.shape({
    enterSimpleTables: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    leaveSimpleTables: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func
  })
};

/* harmony default export */ __webpack_exports__["a"] = (SimpleTables);

/***/ }),

/***/ 825:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__redux_modules_actions__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__General__ = __webpack_require__(826);
//  weak






var mapStateToProps = function mapStateToProps(state) {
  return {
    currentView: state.views.currentView
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    actions: Object(__WEBPACK_IMPORTED_MODULE_0_redux__["bindActionCreators"])({
      enterGeneral: __WEBPACK_IMPORTED_MODULE_2__redux_modules_actions__["a" /* enterGeneral */],
      leaveGeneral: __WEBPACK_IMPORTED_MODULE_2__redux_modules_actions__["f" /* leaveGeneral */]
    }, dispatch)
  };
};

/* unused harmony default export */ var _unused_webpack_default_export = (Object(__WEBPACK_IMPORTED_MODULE_1_react_redux__["connect"])(mapStateToProps, mapDispatchToProps)(__WEBPACK_IMPORTED_MODULE_3__General__["a" /* default */]));

/***/ }),

/***/ 826:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_components__ = __webpack_require__(139);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//  weak

/* eslint no-console:0 */




var General = function (_PureComponent) {
  _inherits(General, _PureComponent);

  function General() {
    _classCallCheck(this, General);

    return _possibleConstructorReturn(this, (General.__proto__ || Object.getPrototypeOf(General)).apply(this, arguments));
  }

  _createClass(General, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.props.actions.enterGeneral();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.actions.leaveGeneral();
    }
  }, {
    key: 'render',
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_2__common_components__["a" /* AnimatedView */],
        null,
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'div',
          null,
          'General'
        )
      );
    }
  }]);

  return General;
}(__WEBPACK_IMPORTED_MODULE_0_react__["PureComponent"]);

General.propTypes = {
  actions: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.shape({
    enterGeneral: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    leaveGeneral: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func
  })
};


/* harmony default export */ __webpack_exports__["a"] = (General);

/***/ }),

/***/ 827:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);


var Modals = function Modals() {
  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    "section",
    null,
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      "div",
      { id: "generalViewModals" },
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        "div",
        {
          className: "modal fade",
          id: "myModalGeneral",
          tabIndex: "-1",
          role: "dialog",
          "aria-labelledby": "myModalLabel",
          "aria-hidden": "true" },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          "div",
          { className: "modal-dialog" },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            "div",
            { className: "modal-content" },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              "div",
              { className: "modal-header" },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                "button",
                {
                  type: "button",
                  className: "close",
                  "data-dismiss": "modal",
                  "aria-hidden": "true" },
                "\xD7"
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                "h4",
                { className: "modal-title" },
                "Modal Tittle"
              )
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              "div",
              { className: "modal-body" },
              "Body goes here..."
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              "div",
              { className: "modal-footer" },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                "button",
                {
                  "data-dismiss": "modal",
                  className: "btn btn-default",
                  type: "button" },
                "Close"
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                "button",
                {
                  className: "btn btn-success",
                  type: "button" },
                "Save changes"
              )
            )
          )
        )
      ),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        "div",
        {
          className: "modal fade",
          id: "myModalGeneral2",
          tabIndex: "-1",
          role: "dialog",
          "aria-labelledby": "myModalLabel",
          "aria-hidden": "true" },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          "div",
          { className: "modal-dialog" },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            "div",
            { className: "modal-content" },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              "div",
              { className: "modal-header" },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                "button",
                {
                  type: "button",
                  className: "close",
                  "data-dismiss": "modal",
                  "aria-hidden": "true" },
                "\xD7"
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                "h4",
                { className: "modal-title" },
                "Modal Tittle"
              )
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              "div",
              { className: "modal-body" },
              "Body goes here..."
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              "div",
              { className: "modal-footer" },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                "button",
                {
                  "data-dismiss": "modal",
                  className: "btn btn-default",
                  type: "button" },
                "Close"
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                "button",
                {
                  className: "btn btn-warning",
                  type: "button" },
                "Confirm"
              )
            )
          )
        )
      ),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        "div",
        {
          className: "modal fade",
          id: "myModalGeneral3",
          tabIndex: "-1",
          role: "dialog",
          "aria-labelledby": "myModalLabel",
          "aria-hidden": "true" },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          "div",
          { className: "modal-dialog" },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            "div",
            { className: "modal-content" },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              "div",
              { className: "modal-header" },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                "button",
                {
                  type: "button",
                  className: "close",
                  "data-dismiss": "modal",
                  "aria-hidden": "true" },
                "\xD7"
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                "h4",
                { className: "modal-title" },
                "Modal Tittle"
              )
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              "div",
              { className: "modal-body" },
              "Body goes here..."
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              "div",
              { className: "modal-footer" },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                "button",
                {
                  className: "btn btn-danger",
                  type: "button" },
                "Ok"
              )
            )
          )
        )
      )
    ),
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      "div",
      { id: "basicElementsModals" },
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        "div",
        {
          "aria-hidden": "true",
          "aria-labelledby": "myModalLabel",
          role: "dialog",
          tabIndex: "-1",
          id: "myModalBasicElements",
          className: "modal fade" },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          "div",
          { className: "modal-dialog" },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            "div",
            { className: "modal-content" },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              "div",
              { className: "modal-header" },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                "button",
                {
                  "aria-hidden": "true",
                  "data-dismiss": "modal",
                  className: "close",
                  type: "button" },
                "\xD7"
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                "h4",
                { className: "modal-title" },
                "Form Tittle"
              )
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              "div",
              { className: "modal-body" },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                "form",
                { role: "form" },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  "div",
                  { className: "form-group" },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    "label",
                    { htmlFor: "exampleInputEmail1" },
                    "Email address"
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("input", {
                    type: "email",
                    className: "form-control",
                    id: "exampleInputEmail3",
                    placeholder: "Enter email"
                  })
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  "div",
                  { className: "form-group" },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    "label",
                    { htmlFor: "exampleInputPassword1" },
                    "Password"
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("input", {
                    type: "password",
                    className: "form-control",
                    id: "exampleInputPassword3",
                    placeholder: "Password"
                  })
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  "div",
                  { className: "form-group" },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    "label",
                    { htmlFor: "exampleInputFile" },
                    "File input"
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("input", {
                    type: "file",
                    id: "exampleInputFile3"
                  }),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    "p",
                    { className: "help-block" },
                    "Example block-level help text here."
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  "div",
                  { className: "checkbox" },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    "label",
                    null,
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("input", { type: "checkbox" }),
                    "Check me out"
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  "button",
                  {
                    type: "submit",
                    className: "btn btn-default" },
                  "Submit"
                )
              )
            )
          )
        )
      ),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        "div",
        {
          "aria-hidden": "true",
          "aria-labelledby": "myModalLabel",
          role: "dialog",
          tabIndex: "-1",
          id: "myModalBasicElements-1",
          className: "modal fade" },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          "div",
          { className: "modal-dialog" },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            "div",
            { className: "modal-content" },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              "div",
              { className: "modal-header" },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                "button",
                {
                  "aria-hidden": "true",
                  "data-dismiss": "modal",
                  className: "close",
                  type: "button" },
                "\xD7"
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                "h4",
                { className: "modal-title" },
                "Form Tittle"
              )
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              "div",
              { className: "modal-body" },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                "form",
                {
                  className: "form-horizontal",
                  role: "form" },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  "div",
                  { className: "form-group" },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    "label",
                    {
                      htmlFor: "inputEmail1",
                      className: "col-lg-2 col-sm-2 control-label" },
                    "Email"
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    "div",
                    { className: "col-lg-10" },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("input", {
                      type: "email",
                      className: "form-control",
                      id: "inputEmail4",
                      placeholder: "Email"
                    })
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  "div",
                  { className: "form-group" },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    "label",
                    {
                      htmlFor: "inputPassword1",
                      className: "col-lg-2 col-sm-2 control-label" },
                    "Password"
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    "div",
                    { className: "col-lg-10" },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("input", {
                      type: "password",
                      className: "form-control",
                      id: "inputPassword4",
                      placeholder: "Password"
                    })
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  "div",
                  { className: "form-group" },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    "div",
                    { className: "col-lg-offset-2 col-lg-10" },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      "div",
                      { className: "checkbox" },
                      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        "label",
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("input", { type: "checkbox" }),
                        "Remember me"
                      )
                    )
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  "div",
                  { className: "form-group" },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    "div",
                    { className: "col-lg-offset-2 col-lg-10" },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      "button",
                      {
                        type: "submit",
                        className: "btn btn-default" },
                      "Sign in"
                    )
                  )
                )
              )
            )
          )
        )
      ),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        "div",
        {
          "aria-hidden": "true",
          "aria-labelledby": "myModalLabel",
          role: "dialog",
          tabIndex: "-1",
          id: "myModalBasicElements-2",
          className: "modal fade" },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          "div",
          { className: "modal-dialog" },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            "div",
            { className: "modal-content" },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              "div",
              { className: "modal-header" },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                "button",
                {
                  "aria-hidden": "true",
                  "data-dismiss": "modal",
                  className: "close",
                  type: "button" },
                "\xD7"
              ),
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                "h4",
                { className: "modal-title" },
                "Form Tittle"
              )
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              "div",
              { className: "modal-body" },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                "form",
                {
                  className: "form-inline",
                  role: "form" },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  "div",
                  { className: "form-group" },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    "label",
                    {
                      className: "sr-only",
                      htmlFor: "exampleInputEmail2" },
                    "Email address"
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("input", {
                    type: "email",
                    className: "form-control sm-input",
                    id: "exampleInputEmail5",
                    placeholder: "Enter email"
                  })
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  "div",
                  { className: "form-group" },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    "label",
                    {
                      className: "sr-only",
                      htmlFor: "exampleInputPassword2" },
                    "Password"
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("input", {
                    type: "password",
                    className: "form-control sm-input",
                    id: "exampleInputPassword5",
                    placeholder: "Password"
                  })
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  "div",
                  { className: "checkbox" },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    "label",
                    null,
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("input", { type: "checkbox" }),
                    "Remember me"
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  "button",
                  {
                    type: "submit",
                    className: "btn btn-default" },
                  "Sign in"
                )
              )
            )
          )
        )
      )
    )
  );
};

/* harmony default export */ __webpack_exports__["a"] = (Modals);

/***/ }),

/***/ 828:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
throw new Error("Cannot find module \"../../../common/components/animatedView/AnimatedView\"");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//  weak





var PageNotFound = function (_PureComponent) {
  _inherits(PageNotFound, _PureComponent);

  function PageNotFound() {
    _classCallCheck(this, PageNotFound);

    return _possibleConstructorReturn(this, (PageNotFound.__proto__ || Object.getPrototypeOf(PageNotFound)).apply(this, arguments));
  }

  _createClass(PageNotFound, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var enterPageNotFound = this.props.actions.enterPageNotFound;

      enterPageNotFound();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var leavePageNotFound = this.props.actions.leavePageNotFound;

      leavePageNotFound();
    }
  }, {
    key: 'render',
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_2__common_components_animatedView_AnimatedView___default.a,
        null,
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'div',
          { className: 'row' },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            'div',
            { className: 'col-md-12' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              'h2',
              null,
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('i', {
                className: 'fa fa-frown-o',
                'aria-hidden': 'true'
              }),
              '\xA0 Sorry... This page does not exist'
            )
          )
        )
      );
    }
  }]);

  return PageNotFound;
}(__WEBPACK_IMPORTED_MODULE_0_react__["PureComponent"]);

PageNotFound.propTypes = {
  actions: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.shape({
    enterPageNotFound: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func.isRequired,
    leavePageNotFound: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func.isRequired
  })
};


/* harmony default export */ __webpack_exports__["a"] = (PageNotFound);

/***/ }),

/***/ 829:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export MainRoutes */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_router_dom__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_privateRoute_PrivateRoute__ = __webpack_require__(830);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__views_home__ = __webpack_require__(435);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__views_simpleTables__ = __webpack_require__(436);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__views_protected__ = __webpack_require__(831);

/* eslint no-process-env:0 */







var MainRoutes = function MainRoutes() {
  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    __WEBPACK_IMPORTED_MODULE_1_react_router_dom__["Switch"],
    null,
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_react_router_dom__["Route"], { exact: true, path: '/', component: __WEBPACK_IMPORTED_MODULE_3__views_home__["a" /* default */] }),
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_react_router_dom__["Route"], { exact: true, path: '/simpleTables', component: __WEBPACK_IMPORTED_MODULE_4__views_simpleTables__["a" /* default */] }),
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__components_privateRoute_PrivateRoute__["a" /* default */], { path: '/protected', component: __WEBPACK_IMPORTED_MODULE_5__views_protected__["a" /* default */] })
  );
};

/* harmony default export */ __webpack_exports__["a"] = (MainRoutes);

/***/ }),

/***/ 830:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router_dom__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_auth__ = __webpack_require__(138);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//  weak






var PrivateRoute = function (_Component) {
  _inherits(PrivateRoute, _Component);

  function PrivateRoute() {
    _classCallCheck(this, PrivateRoute);

    return _possibleConstructorReturn(this, (PrivateRoute.__proto__ || Object.getPrototypeOf(PrivateRoute)).apply(this, arguments));
  }

  _createClass(PrivateRoute, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          InnerComponent = _props.component,
          rest = _objectWithoutProperties(_props, ['component']);

      var location = this.props.location;


      var isUserAuthenticated = this.isAuthenticated();
      var isTokenExpired = this.isExpired();

      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_react_router_dom__["Route"], _extends({}, rest, {
        render: function render(props) {
          return !isTokenExpired && isUserAuthenticated ? __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(InnerComponent, props) : __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_react_router_dom__["Redirect"], { to: { pathname: '/login', state: { from: location } } });
        }
      }));
    }
  }, {
    key: 'isAuthenticated',
    value: function isAuthenticated() {
      var checkUserHasId = function checkUserHasId(user) {
        return user && user.id;
      };
      var user = __WEBPACK_IMPORTED_MODULE_3__services_auth__["a" /* default */].getUserInfo() ? __WEBPACK_IMPORTED_MODULE_3__services_auth__["a" /* default */].getUserInfo() : null;
      var isAuthenticated = __WEBPACK_IMPORTED_MODULE_3__services_auth__["a" /* default */].getToken() && checkUserHasId(user);
      return isAuthenticated;
    }
  }, {
    key: 'isExpired',
    value: function isExpired() {
      return __WEBPACK_IMPORTED_MODULE_3__services_auth__["a" /* default */].isExpiredToken(__WEBPACK_IMPORTED_MODULE_3__services_auth__["a" /* default */].getToken());
    }
  }]);

  return PrivateRoute;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

PrivateRoute.propTypes = {
  // react-router 4:
  match: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.object.isRequired,
  location: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.object.isRequired,
  history: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.object.isRequired,

  component: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.any.isRequired,
  path: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string
};


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_2_react_router_dom__["withRouter"])(PrivateRoute));

/***/ }),

/***/ 831:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_redux__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__redux_modules_views__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Protected__ = __webpack_require__(832);





var mapStateToProps = function mapStateToProps(state) {
  return {
    // views
    currentView: state.views.currentView
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return Object(__WEBPACK_IMPORTED_MODULE_1_redux__["bindActionCreators"])({
    // views
    enterProtected: __WEBPACK_IMPORTED_MODULE_2__redux_modules_views__["enterProtected"],
    leaveProtected: __WEBPACK_IMPORTED_MODULE_2__redux_modules_views__["leaveProtected"]
  }, dispatch);
};

/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0_react_redux__["connect"])(mapStateToProps, mapDispatchToProps)(__WEBPACK_IMPORTED_MODULE_3__Protected__["a" /* default */]));

/***/ }),

/***/ 832:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
throw new Error("Cannot find module \"../../../common/components/animatedView/AnimatedView\"");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//  weak





var Protected = function (_PureComponent) {
  _inherits(Protected, _PureComponent);

  function Protected() {
    _classCallCheck(this, Protected);

    return _possibleConstructorReturn(this, (Protected.__proto__ || Object.getPrototypeOf(Protected)).apply(this, arguments));
  }

  _createClass(Protected, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var enterProtected = this.props.enterProtected;

      enterProtected();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var leaveProtected = this.props.leaveProtected;

      leaveProtected();
    }
  }, {
    key: 'render',
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_2__common_components_animatedView_AnimatedView___default.a,
        null,
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'h1',
          null,
          'Protected view'
        ),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'h3',
          null,
          'If you can read, it means you are authenticated'
        )
      );
    }
  }]);

  return Protected;
}(__WEBPACK_IMPORTED_MODULE_0_react__["PureComponent"]);

Protected.propTypes = {
  // react-router 4:
  match: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.object.isRequired,
  location: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.object.isRequired,
  history: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.object.isRequired,

  // views:
  currentView: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired,
  enterProtected: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func.isRequired,
  leaveProtected: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func.isRequired
};


/* harmony default export */ __webpack_exports__["a"] = (Protected);

/***/ }),

/***/ 833:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__redux_modules_views__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__redux_modules_userAuth__ = __webpack_require__(434);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Login__ = __webpack_require__(834);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//  weak







var mapStateToProps = function mapStateToProps(state) {
  return {
    // views:
    currentView: state.views.currentView,

    // useAuth:
    isAuthenticated: state.userAuth.isAuthenticated,
    isFetching: state.userAuth.isFetching,
    isLogging: state.userAuth.isLogging

  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return Object(__WEBPACK_IMPORTED_MODULE_0_redux__["bindActionCreators"])(_extends({}, __WEBPACK_IMPORTED_MODULE_2__redux_modules_views__, __WEBPACK_IMPORTED_MODULE_3__redux_modules_userAuth__), dispatch);
};

/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_1_react_redux__["connect"])(mapStateToProps, mapDispatchToProps)(__WEBPACK_IMPORTED_MODULE_4__Login__["a" /* default */]));

/***/ }),

/***/ 834:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_bootstrap__ = __webpack_require__(438);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_auth__ = __webpack_require__(138);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// #region imports




// #endregion

// #region flow types

// #endregion

var Login = function (_PureComponent) {
  _inherits(Login, _PureComponent);

  function Login() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, Login);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Login.__proto__ || Object.getPrototypeOf(Login)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      email: '',
      password: ''
    }, _this.handlesOnEmailChange = function (event) {
      if (event) {
        event.preventDefault();
        // should add some validator before setState in real use cases
        _this.setState({ email: event.target.value.trim() });
      }
    }, _this.handlesOnPasswordChange = function (event) {
      if (event) {
        event.preventDefault();
        // should add some validator before setState in real use cases
        _this.setState({ password: event.target.value.trim() });
      }
    }, _this.handlesOnLogin = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
        var _this$props, history, logUserIfNeeded, _this$state, email, password, response, data, token, login, firstname, lastname, picture, showPicture, user;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (event) {
                  event.preventDefault();
                }

                _this$props = _this.props, history = _this$props.history, logUserIfNeeded = _this$props.logUserIfNeeded;
                _this$state = _this.state, email = _this$state.email, password = _this$state.password;
                _context.prev = 3;
                _context.next = 6;
                return logUserIfNeeded(email, password);

              case 6:
                response = _context.sent;

                console.log('response: ', response);
                data = response.payload.data;
                token = data.token;
                login = data.login, firstname = data.firstname, lastname = data.lastname, picture = data.picture, showPicture = data.showPicture;
                user = {
                  login: login,
                  firstname: firstname,
                  lastname: lastname,
                  picture: picture,
                  showPicture: showPicture
                };

                __WEBPACK_IMPORTED_MODULE_3__services_auth__["a" /* default */].setToken(token);
                __WEBPACK_IMPORTED_MODULE_3__services_auth__["a" /* default */].setUserInfo(user);

                history.push({ pathname: '/' }); // back to Home
                _context.next = 20;
                break;

              case 17:
                _context.prev = 17;
                _context.t0 = _context['catch'](3);

                /* eslint-disable no-console */
                console.log('login went wrong..., error: ', _context.t0);
                /* eslint-enable no-console */

              case 20:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this2, [[3, 17]]);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }(), _this.goHome = function (event) {
      if (event) {
        event.preventDefault();
      }

      var history = _this.props.history;


      history.push({ pathname: '/' });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  // #region propTypes

  // #endregion

  _createClass(Login, [{
    key: 'componentDidMount',


    // #region lifecycle methods
    value: function componentDidMount() {
      var _props = this.props,
          enterLogin = _props.enterLogin,
          disconnectUser = _props.disconnectUser;


      disconnectUser(); // diconnect user: remove token and user info
      enterLogin();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var leaveLogin = this.props.leaveLogin;

      leaveLogin();
    }
  }, {
    key: 'render',

    // #endregion
    value: function render() {
      var _state = this.state,
          email = _state.email,
          password = _state.password;
      var isLogging = this.props.isLogging;


      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'div',
        { className: 'content' },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Row"],
          null,
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Col"],
            {
              md: 4,
              mdOffset: 4,
              xs: 10,
              xsOffset: 1
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              'form',
              {
                className: 'form-horizontal',
                noValidate: true },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'fieldset',
                null,
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'legend',
                  {
                    className: 'text-center'
                  },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'h1',
                    null,
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('i', { className: 'fa fa-3x fa-user-circle', 'aria-hidden': 'true' })
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'h2',
                    null,
                    'Login'
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'div',
                  { className: 'form-group' },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'label',
                    {
                      htmlFor: 'inputEmail',
                      className: 'col-lg-2 control-label' },
                    'Email'
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    { className: 'col-lg-10' },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('input', {
                      type: 'text',
                      className: 'form-control',
                      id: 'inputEmail',
                      placeholder: 'Email',
                      value: email,
                      onChange: this.handlesOnEmailChange
                    })
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'div',
                  { className: 'form-group' },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'label',
                    {
                      htmlFor: 'inputPassword',
                      className: 'col-lg-2 control-label' },
                    'Password'
                  ),
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    { className: 'col-lg-10' },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('input', {
                      type: 'password',
                      className: 'form-control',
                      id: 'inputPassword',
                      placeholder: 'Password',
                      value: password,
                      onChange: this.handlesOnPasswordChange
                    })
                  )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  'div',
                  { className: 'form-group' },
                  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Col"],
                    {
                      lg: 10,
                      lgOffset: 2
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                      __WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Button"],
                      {
                        className: 'login-button btn-block',
                        bsStyle: 'primary',
                        disabled: isLogging,
                        onClick: this.handlesOnLogin },
                      isLogging ? __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'span',
                        null,
                        'login in... \xA0',
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('i', {
                          className: 'fa fa-spinner fa-pulse fa-fw'
                        })
                      ) : __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'span',
                        null,
                        'Login'
                      )
                    )
                  )
                )
              )
            )
          )
        ),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Row"],
          null,
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Col"],
            {
              md: 4,
              mdOffset: 4,
              xs: 10,
              xsOffset: 1
            },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              'div',
              {
                className: 'pull-right'
              },
              __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_2_react_bootstrap__["Button"],
                {
                  bsStyle: 'default',
                  onClick: this.goHome
                },
                'back to home'
              )
            )
          )
        )
      );
    }
    // #endregion

    // #region form inputs change callbacks

    // #endregion


    // #region on login button click callback

    // #endregion

    // #region on go back home button click callback

  }]);

  return Login;
}(__WEBPACK_IMPORTED_MODULE_0_react__["PureComponent"]);

Login.propTypes = {
  // react-router 4:
  match: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.object.isRequired,
  location: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.object.isRequired,
  history: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.object.isRequired,

  // views props:
  currentView: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired,
  enterLogin: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func.isRequired,
  leaveLogin: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func.isRequired,

  // userAuth:
  isAuthenticated: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.bool,
  isFetching: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.bool,
  isLogging: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.bool,
  disconnectUser: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func.isRequired,
  logUserIfNeeded: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func.isRequired
};
Login.defaultProps = {
  isFetching: false,
  isLogging: false
};


/* harmony default export */ __webpack_exports__["a"] = (Login);

/***/ }),

/***/ 89:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["default"] = views;
/* harmony export (immutable) */ __webpack_exports__["enterHome"] = enterHome;
/* harmony export (immutable) */ __webpack_exports__["leaveHome"] = leaveHome;
/* harmony export (immutable) */ __webpack_exports__["enterSimpleTables"] = enterSimpleTables;
/* harmony export (immutable) */ __webpack_exports__["leaveSimpleTables"] = leaveSimpleTables;
/* harmony export (immutable) */ __webpack_exports__["enterBasicElements"] = enterBasicElements;
/* harmony export (immutable) */ __webpack_exports__["leaveBasicElements"] = leaveBasicElements;
/* harmony export (immutable) */ __webpack_exports__["enterGeneral"] = enterGeneral;
/* harmony export (immutable) */ __webpack_exports__["leaveGeneral"] = leaveGeneral;
/* harmony export (immutable) */ __webpack_exports__["enterPageNotFound"] = enterPageNotFound;
/* harmony export (immutable) */ __webpack_exports__["leavePageNotFound"] = leavePageNotFound;
/* harmony export (immutable) */ __webpack_exports__["enterStatsCard"] = enterStatsCard;
/* harmony export (immutable) */ __webpack_exports__["leaveStatsCard"] = leaveStatsCard;
/* harmony export (immutable) */ __webpack_exports__["enterEarningGraph"] = enterEarningGraph;
/* harmony export (immutable) */ __webpack_exports__["leaveEarningGraph"] = leaveEarningGraph;
/* harmony export (immutable) */ __webpack_exports__["enterNotifications"] = enterNotifications;
/* harmony export (immutable) */ __webpack_exports__["leaveNotifications"] = leaveNotifications;
/* harmony export (immutable) */ __webpack_exports__["enterWorkProgress"] = enterWorkProgress;
/* harmony export (immutable) */ __webpack_exports__["leaveWorkProgress"] = leaveWorkProgress;
/* harmony export (immutable) */ __webpack_exports__["enterTwitterFeed"] = enterTwitterFeed;
/* harmony export (immutable) */ __webpack_exports__["leaveTwitterFeed"] = leaveTwitterFeed;
/* harmony export (immutable) */ __webpack_exports__["enterTeamMatesView"] = enterTeamMatesView;
/* harmony export (immutable) */ __webpack_exports__["leaveTeamMatesView"] = leaveTeamMatesView;
/* harmony export (immutable) */ __webpack_exports__["enterTodoListView"] = enterTodoListView;
/* harmony export (immutable) */ __webpack_exports__["leaveTodoListView"] = leaveTodoListView;
/* harmony export (immutable) */ __webpack_exports__["enterBreadcrumb"] = enterBreadcrumb;
/* harmony export (immutable) */ __webpack_exports__["leaveBreadcrumb"] = leaveBreadcrumb;
/* harmony export (immutable) */ __webpack_exports__["enterStat"] = enterStat;
/* harmony export (immutable) */ __webpack_exports__["leaveStat"] = leaveStat;
/* harmony export (immutable) */ __webpack_exports__["enterBasicProgressBar"] = enterBasicProgressBar;
/* harmony export (immutable) */ __webpack_exports__["leaveBasicProgressBar"] = leaveBasicProgressBar;
/* harmony export (immutable) */ __webpack_exports__["enterTabPanel"] = enterTabPanel;
/* harmony export (immutable) */ __webpack_exports__["leaveTabPanel"] = leaveTabPanel;
/* harmony export (immutable) */ __webpack_exports__["enterStripedProgressBar"] = enterStripedProgressBar;
/* harmony export (immutable) */ __webpack_exports__["leaveStripedProgressBar"] = leaveStripedProgressBar;
/* harmony export (immutable) */ __webpack_exports__["enterAlert"] = enterAlert;
/* harmony export (immutable) */ __webpack_exports__["leaveAlert"] = leaveAlert;
/* harmony export (immutable) */ __webpack_exports__["enterPagination"] = enterPagination;
/* harmony export (immutable) */ __webpack_exports__["leavePagination"] = leavePagination;
/* harmony export (immutable) */ __webpack_exports__["enterLogin"] = enterLogin;
/* harmony export (immutable) */ __webpack_exports__["leaveLogin"] = leaveLogin;
/* harmony export (immutable) */ __webpack_exports__["enterProtected"] = enterProtected;
/* harmony export (immutable) */ __webpack_exports__["leaveProtected"] = leaveProtected;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_moment__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//  weak



var ENTER_LOGIN_VIEW = 'ENTER_LOGIN_VIEW';
var LEAVE_LOGIN_VIEW = 'LEAVE_LOGIN_VIEW';

var ENTER_HOME_VIEW = 'ENTER_HOME_VIEW';
var LEAVE_HOME_VIEW = 'LEAVE_HOME_VIEW';
var ENTER_SIMPLE_TABLES_VIEW = 'ENTER_SIMPLE_TABLES_VIEW';
var LEAVE_SIMPLE_TABLES_VIEW = 'LEAVE_SIMPLE_TABLES_VIEW';
var ENTER_BASIC_ELEMENTS_VIEW = 'ENTER_BASIC_ELEMENTS_VIEW';
var LEAVE_BASIC_ELEMENTS_VIEW = 'LEAVE_BASIC_ELEMENTS_VIEW';
var ENTER_GENERAL_VIEW = 'ENTER_GENERAL_VIEW';
var LEAVE_GENERAL_VIEW = 'LEAVE_GENERAL_VIEW';
var ENTER_PAGE_NOT_FOUND_VIEW = 'ENTER_PAGE_NOT_FOUND_VIEW';
var LEAVE_PAGE_NOT_FOUND_VIEW = 'LEAVE_PAGE_NOT_FOUND_VIEW';
var ENTER_STATS_CARD_VIEW = 'ENTER_STATS_CARD_VIEW';
var LEAVE_STATS_CARD_VIEW = 'LEAVE_STATS_CARD_VIEW';
var ENTER_EARNING_GRAPH_VIEW = 'ENTER_EARNING_GRAPH_VIEW';
var LEAVE_EARNING_GRAPH_VIEW = 'LEAVE_EARNING_GRAPH_VIEW';
var ENTER_NOTIFICATIONS_VIEW = 'ENTER_NOTIFICATIONS_VIEW';
var LEAVE_NOTIFICATIONS_VIEW = 'LEAVE_NOTIFICATIONS_VIEW';
var ENTER_WORK_PROGRESS_VIEW = 'ENTER_WORK_PROGRESS_VIEW';
var LEAVE_WORK_PROGRESS_VIEW = 'LEAVE_WORK_PROGRESS_VIEW';
var ENTER_TWITTER_FEED_VIEW = 'ENTER_TWITTER_FEED_VIEW';
var LEAVE_TWITTER_FEED_VIEW = 'LEAVE_TWITTER_FEED_VIEW';
var ENTER_TEAM_MATES_VIEW = 'ENTER_TEAM_MATES_VIEW';
var LEAVE_TEAM_MATES_VIEW = 'LEAVE_TEAM_MATES_VIEW';
var ENTER_TODO_LIST_VIEW = 'ENTER_TODO_LIST_VIEW';
var LEAVE_TODO_LIST_VIEW = 'LEAVE_TODO_LIST_VIEW';
var ENTER_BREADCRUMB_VIEW = 'ENTER_BREADCRUMB_VIEW';
var LEAVE_BREADCRUMB_VIEW = 'LEAVE_BREADCRUMB_VIEW';
var ENTER_STAT_VIEW = 'ENTER_STAT_VIEW';
var LEAVE_STAT_VIEW = 'LEAVE_STAT_VIEW';
var ENTER_BASIC_PROGRESS_BAR_VIEW = 'ENTER_BASIC_PROGRESS_BAR_VIEW';
var LEAVE_BASIC_PROGRESS_BAR_VIEW = 'LEAVE_BASIC_PROGRESS_BAR_VIEW';
var ENTER_TAB_PANEL_VIEW = 'ENTER_TAB_PANEL_VIEW';
var LEAVE_TAB_PANEL_VIEW = 'LEAVE_TAB_PANEL_VIEW';
var ENTER_STRIPED_PROGRESS_BAR_VIEW = 'ENTER_STRIPED_PROGRESS_BAR_VIEW';
var LEAVE_STRIPED_PROGRESS_BAR_VIEW = 'LEAVE_STRIPED_PROGRESS_BAR_VIEW';
var ENTER_ALERT_VIEW = 'ENTER_ALERT_VIEW';
var LEAVE_ALERT_VIEW = 'LEAVE_ALERT_VIEW';
var ENTER_PAGINATION_VIEW = 'ENTER_PAGINATION_VIEW';
var LEAVE_PAGINATION_VIEW = 'LEAVE_PAGINATION_VIEW';
var ENTER_PROTECTED_VIEW = 'ENTER_PROTECTED_VIEW';
var LEAVE_PROTECTED_VIEW = 'LEAVE_PROTECTED_VIEW';

var initialState = {
  currentView: 'home',
  enterTime: null,
  leaveTime: null
};

function views() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case ENTER_HOME_VIEW:
    case ENTER_LOGIN_VIEW:
    case ENTER_SIMPLE_TABLES_VIEW:
    case ENTER_BASIC_ELEMENTS_VIEW:
    case ENTER_GENERAL_VIEW:
    case ENTER_PAGE_NOT_FOUND_VIEW:
    case ENTER_STATS_CARD_VIEW:
    case ENTER_EARNING_GRAPH_VIEW:
    case ENTER_NOTIFICATIONS_VIEW:
    case ENTER_WORK_PROGRESS_VIEW:
    case ENTER_TWITTER_FEED_VIEW:
    case ENTER_TEAM_MATES_VIEW:
    case ENTER_TODO_LIST_VIEW:
    case ENTER_BREADCRUMB_VIEW:
    case ENTER_STAT_VIEW:
    case ENTER_BASIC_PROGRESS_BAR_VIEW:
    case ENTER_TAB_PANEL_VIEW:
    case ENTER_STRIPED_PROGRESS_BAR_VIEW:
    case ENTER_ALERT_VIEW:
    case ENTER_PAGINATION_VIEW:
    case ENTER_PROTECTED_VIEW:
      // can't enter if you are already inside
      if (state.currentView !== action.currentView) {
        return _extends({}, state, {
          currentView: action.currentView,
          enterTime: action.enterTime,
          leaveTime: action.leaveTime
        });
      }
      return state;

    case LEAVE_HOME_VIEW:
    case LEAVE_LOGIN_VIEW:
    case LEAVE_SIMPLE_TABLES_VIEW:
    case LEAVE_BASIC_ELEMENTS_VIEW:
    case LEAVE_GENERAL_VIEW:
    case LEAVE_PAGE_NOT_FOUND_VIEW:
    case LEAVE_STATS_CARD_VIEW:
    case LEAVE_EARNING_GRAPH_VIEW:
    case LEAVE_NOTIFICATIONS_VIEW:
    case LEAVE_WORK_PROGRESS_VIEW:
    case LEAVE_TWITTER_FEED_VIEW:
    case LEAVE_TEAM_MATES_VIEW:
    case LEAVE_TODO_LIST_VIEW:
    case LEAVE_BREADCRUMB_VIEW:
    case LEAVE_STAT_VIEW:
    case LEAVE_BASIC_PROGRESS_BAR_VIEW:
    case LEAVE_TAB_PANEL_VIEW:
    case LEAVE_STRIPED_PROGRESS_BAR_VIEW:
    case LEAVE_ALERT_VIEW:
    case LEAVE_PAGINATION_VIEW:
    case LEAVE_PROTECTED_VIEW:
      // can't leave if you aren't already inside
      if (state.currentView === action.currentView) {
        return _extends({}, state, {
          currentView: action.currentView,
          enterTime: action.enterTime,
          leaveTime: action.leaveTime
        });
      }
      return state;

    default:
      return state;
  }
}

function enterHome() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ENTER_HOME_VIEW,
    currentView: 'Home',
    enterTime: time,
    leaveTime: null
  };
}

function leaveHome() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: LEAVE_HOME_VIEW,
    currentView: 'Home',
    enterTime: null,
    leaveTime: time
  };
}

function enterSimpleTables() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ENTER_SIMPLE_TABLES_VIEW,
    currentView: 'SimpleTables',
    enterTime: time,
    leaveTime: null
  };
}

function leaveSimpleTables() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: LEAVE_SIMPLE_TABLES_VIEW,
    currentView: 'SimpleTables',
    enterTime: null,
    leaveTime: time
  };
}

function enterBasicElements() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ENTER_BASIC_ELEMENTS_VIEW,
    currentView: 'BasicElements',
    enterTime: time,
    leaveTime: null
  };
}

function leaveBasicElements() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: LEAVE_BASIC_ELEMENTS_VIEW,
    currentView: 'BasicElements',
    enterTime: null,
    leaveTime: time
  };
}

function enterGeneral() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ENTER_GENERAL_VIEW,
    currentView: 'General',
    enterTime: time,
    leaveTime: null
  };
}

function leaveGeneral() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: LEAVE_GENERAL_VIEW,
    currentView: 'General',
    enterTime: null,
    leaveTime: time
  };
}

function enterPageNotFound() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ENTER_PAGE_NOT_FOUND_VIEW,
    currentView: 'PageNotFound',
    enterTime: time,
    leaveTime: null
  };
}

function leavePageNotFound() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: LEAVE_PAGE_NOT_FOUND_VIEW,
    currentView: 'PageNotFound',
    enterTime: null,
    leaveTime: time
  };
}

function enterStatsCard() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ENTER_STATS_CARD_VIEW,
    currentView: 'StatsCard',
    enterTime: time,
    leaveTime: null
  };
}

function leaveStatsCard() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: LEAVE_STATS_CARD_VIEW,
    currentView: 'StatsCard',
    enterTime: null,
    leaveTime: time
  };
}

function enterEarningGraph() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ENTER_EARNING_GRAPH_VIEW,
    currentView: 'EarningGraph',
    enterTime: time,
    leaveTime: null
  };
}

function leaveEarningGraph() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: LEAVE_EARNING_GRAPH_VIEW,
    currentView: 'EarningGraph',
    enterTime: null,
    leaveTime: time
  };
}

function enterNotifications() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ENTER_NOTIFICATIONS_VIEW,
    currentView: 'Notifications',
    enterTime: time,
    leaveTime: null
  };
}

function leaveNotifications() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: LEAVE_NOTIFICATIONS_VIEW,
    currentView: 'Notifications',
    enterTime: null,
    leaveTime: time
  };
}

function enterWorkProgress() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ENTER_WORK_PROGRESS_VIEW,
    currentView: 'WorkProgress',
    enterTime: time,
    leaveTime: null
  };
}

function leaveWorkProgress() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: LEAVE_WORK_PROGRESS_VIEW,
    currentView: 'WorkProgress',
    enterTime: null,
    leaveTime: time
  };
}

function enterTwitterFeed() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ENTER_TWITTER_FEED_VIEW,
    currentView: 'TwitterFeed',
    enterTime: time,
    leaveTime: null
  };
}

function leaveTwitterFeed() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: LEAVE_TWITTER_FEED_VIEW,
    currentView: 'TwitterFeed',
    enterTime: null,
    leaveTime: time
  };
}

function enterTeamMatesView() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ENTER_TEAM_MATES_VIEW,
    currentView: 'TeamMatesView',
    enterTime: time,
    leaveTime: null
  };
}

function leaveTeamMatesView() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: LEAVE_TEAM_MATES_VIEW,
    currentView: 'TeamMatesView',
    enterTime: null,
    leaveTime: time
  };
}

function enterTodoListView() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ENTER_TODO_LIST_VIEW,
    currentView: 'TodoListView',
    enterTime: time,
    leaveTime: null
  };
}

function leaveTodoListView() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: LEAVE_TODO_LIST_VIEW,
    currentView: 'TodoListView',
    enterTime: null,
    leaveTime: time
  };
}

function enterBreadcrumb() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ENTER_BREADCRUMB_VIEW,
    currentView: 'BreadcrumbView',
    enterTime: time,
    leaveTime: null
  };
}

function leaveBreadcrumb() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: LEAVE_BREADCRUMB_VIEW,
    currentView: 'BreadcrumbView',
    enterTime: null,
    leaveTime: time
  };
}

function enterStat() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ENTER_STAT_VIEW,
    currentView: 'StatView',
    enterTime: time,
    leaveTime: null
  };
}

function leaveStat() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: LEAVE_STAT_VIEW,
    currentView: 'StatView',
    enterTime: null,
    leaveTime: time
  };
}

function enterBasicProgressBar() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ENTER_BASIC_PROGRESS_BAR_VIEW,
    currentView: 'BasicProgressBarView',
    enterTime: time,
    leaveTime: null
  };
}

function leaveBasicProgressBar() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: LEAVE_BASIC_PROGRESS_BAR_VIEW,
    currentView: 'BasicProgressBarView',
    enterTime: null,
    leaveTime: time
  };
}

function enterTabPanel() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ENTER_TAB_PANEL_VIEW,
    currentView: 'TabPanel',
    enterTime: time,
    leaveTime: null
  };
}

function leaveTabPanel() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: LEAVE_TAB_PANEL_VIEW,
    currentView: 'TabPanel',
    enterTime: null,
    leaveTime: time
  };
}

function enterStripedProgressBar() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ENTER_STRIPED_PROGRESS_BAR_VIEW,
    currentView: 'StripedProgressBarView',
    enterTime: time,
    leaveTime: null
  };
}

function leaveStripedProgressBar() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: LEAVE_STRIPED_PROGRESS_BAR_VIEW,
    currentView: 'StripedProgressBarView',
    enterTime: null,
    leaveTime: time
  };
}

function enterAlert() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ENTER_ALERT_VIEW,
    currentView: 'AlertView',
    enterTime: time,
    leaveTime: null
  };
}

function leaveAlert() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: LEAVE_ALERT_VIEW,
    currentView: 'AlertView',
    enterTime: null,
    leaveTime: time
  };
}

function enterPagination() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ENTER_PAGINATION_VIEW,
    currentView: 'PaginationView',
    enterTime: time,
    leaveTime: null
  };
}

function leavePagination() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: LEAVE_PAGINATION_VIEW,
    currentView: 'PaginationView',
    enterTime: null,
    leaveTime: time
  };
}

function enterLogin() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ENTER_LOGIN_VIEW,
    currentView: 'Login',
    enterTime: time,
    leaveTime: null
  };
}

function leaveLogin() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: LEAVE_LOGIN_VIEW,
    currentView: 'Login',
    enterTime: null,
    leaveTime: time
  };
}

function enterProtected() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: ENTER_PROTECTED_VIEW,
    currentView: 'Protected',
    enterTime: time,
    leaveTime: null
  };
}

function leaveProtected() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_0_moment___default()().format();

  return {
    type: LEAVE_PROTECTED_VIEW,
    currentView: 'Protected',
    enterTime: null,
    leaveTime: time
  };
}

/***/ })

},[511]);
//# sourceMappingURL=app.bundle.js.map