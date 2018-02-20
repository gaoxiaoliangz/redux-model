(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["reduxModel"] = factory();
	else
		root["reduxModel"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createModel = exports.extractSaga = exports.extractReducer = exports.feedStore = undefined;

var _assign2 = __webpack_require__(1);

var _assign3 = _interopRequireDefault(_assign2);

var _mapValues2 = __webpack_require__(2);

var _mapValues3 = _interopRequireDefault(_mapValues2);

var _map2 = __webpack_require__(3);

var _map3 = _interopRequireDefault(_map2);

var _keys2 = __webpack_require__(4);

var _keys3 = _interopRequireDefault(_keys2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _redux = __webpack_require__(5);

var _reactRedux = __webpack_require__(6);

var _effects = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var feedStore = exports.feedStore = function feedStore(store, models) {
  models.forEach(function (model) {
    model.store = store;
  });
};

var extractReducer = exports.extractReducer = function extractReducer(models) {
  return (0, _redux.combineReducers)(models.reduce(function (obj, model) {
    return _extends({}, obj, _defineProperty({}, model.namespace, model.reducer));
  }, {}));
};

var extractSaga = exports.extractSaga = function extractSaga(models) {
  return (/*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return models.map(function (model) {
                return model.saga;
              }).filter(Boolean).map(function (saga) {
                return (0, _effects.fork)(saga);
              });

            case 2:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })
  );
};

var generateActionCreator = function generateActionCreator(type) {
  return function (payload, meta) {
    return {
      type: type,
      payload: payload,
      meta: meta,
      error: payload instanceof Error ? true : undefined
    };
  };
};

var Model = function () {
  function Model() {
    var _this = this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        namespace = _ref.namespace,
        state = _ref.state,
        actionCreators = _ref.actionCreators,
        reducer = _ref.reducer,
        computations = _ref.computations,
        saga = _ref.saga,
        effects = _ref.effects;

    _classCallCheck(this, Model);

    _initialiseProps.call(this);

    var self = this;
    this.namespace = namespace;
    this.initialState = state;

    // get types
    var types = (0, _keys3.default)(computations);
    (0, _keys3.default)(effects).concat((0, _keys3.default)(actionCreators)).forEach(function (key) {
      if (types.includes(key)) {
        console.warn('Duplicated key \'' + key + '\' found! (\'computations\', \'effects\' and \'actionCreators\' should not contain the same key)');
      } else {
        types.push(key);
      }
    });
    this.actionTypes = types;

    // generate action creators
    var generatedActionCreators = types.reduce(function (creators, type) {
      return _extends({}, creators, _defineProperty({}, type, _this._generateActionCreator(type)));
    }, {});
    this._actionCreators = _extends({}, generatedActionCreators, this._mapCreatorTypes(actionCreators));

    // generate reducer
    this.reducer = function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.initialState;
      var action = arguments[1];

      var state1 = reducer ? reducer(state, action) : state;
      var type = _this._unprefixType(action.type);
      if (computations[type]) {
        return computations[type](state1, action.payload, action.meta, action.error);
      }
      return state1;
    };

    // saga
    if (saga || effects) {
      this.saga = /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return [].concat(_toConsumableArray(saga ? [(0, _effects.fork)(saga.bind(self))] : []), _toConsumableArray(effects ? (0, _map3.default)(effects, function (generator, key) {
                  return (0, _effects.fork)(_this2._effectToSaga(key, generator.bind(self)));
                }) : []));

              case 2:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }).bind(this);
    }
  }

  _createClass(Model, [{
    key: '_effectToSaga',
    value: function _effectToSaga(key, generator) {
      var type = this._prefixType(key);
      return (/*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return (0, _effects.takeEvery)(type, /*#__PURE__*/regeneratorRuntime.mark(function _callee3(action) {
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            _context3.next = 2;
                            return (0, _effects.put)({ type: type + '@start' });

                          case 2:
                            _context3.next = 4;
                            return generator(action.payload, action.meta, action.error);

                          case 4:
                            _context3.next = 6;
                            return (0, _effects.put)({ type: type + '@end' });

                          case 6:
                          case 'end':
                            return _context3.stop();
                        }
                      }
                    }, _callee3, this);
                  }));

                case 2:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        })
      );
    }
  }, {
    key: 'connect',
    value: function connect(component, mapStateToProps, mapDispatch) {
      var _this3 = this;

      return (0, _reactRedux.connect)(mapStateToProps = function mapStateToProps(state) {
        return state[_this3.namespace];
      }, mapDispatch)(component);
    }
  }, {
    key: 'store',
    set: function set(store) {
      var _this4 = this;

      this.dispatch = store.dispatch;
      var bindedActions = (0, _mapValues3.default)(this._actionCreators, function (actionCreator) {
        return _this4._bindDispatch(actionCreator);
      });
      (0, _assign3.default)(this, bindedActions);
    }
  }]);

  return Model;
}();

var _initialiseProps = function _initialiseProps() {
  var _this5 = this;

  this._generateActionCreator = function (type) {
    return generateActionCreator(_this5._prefixType(type));
  };

  this._unprefixType = function (type) {
    var typePrefix = _this5.namespace + '/';
    if (type.startsWith(typePrefix)) {
      return type.substr(typePrefix.length);
    }
    return type;
  };

  this._prefixType = function (type) {
    if (!_this5.namespace) {
      return type;
    }
    return _this5.namespace + '/' + type;
  };

  this._mapCreatorTypes = function (actionCreators) {
    return (0, _mapValues3.default)(actionCreators, function (actionCreator, type) {
      var type2 = _this5._prefixType(type);
      return function () {
        return _extends({
          type: type2
        }, actionCreator.apply(undefined, arguments));
      };
    });
  };

  this._bindDispatch = function (actionCreator) {
    return function () {
      return _this5.dispatch(actionCreator.apply(undefined, arguments));
    };
  };
};

var createModel = exports.createModel = function createModel(config) {
  return new Model(config);
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("lodash/assign");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("lodash/mapValues");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("lodash/map");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("lodash/keys");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("react-redux");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("redux-saga/effects");

/***/ })
/******/ ]);
});
//# sourceMappingURL=redux-model.js.map