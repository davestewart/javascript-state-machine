(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["StateHelper"] = factory();
	else
		root["StateHelper"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _object = __webpack_require__(1);
	
	var _object2 = _interopRequireDefault(_object);
	
	var _jQuery = __webpack_require__(3);
	
	var _jQuery2 = _interopRequireDefault(_jQuery);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var StateHelper = {
	    object: _object2.default,
	    jQuery: _jQuery2.default
	};
	
	exports.default = StateHelper;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = setup;
	
	var _utils = __webpack_require__(2);
	
	function StateObject(fsm) {
	    var onPause = this.onPause.bind(this);
	    var onModify = this.onModify.bind(this);
	    this.data = {};
	    this.fsm = fsm;
	    this.fsm.on('change', this.onChange.bind(this)).on('pause', onPause).on('resume', onPause).on('add', onModify).on('remove', onModify);
	    this.reset();
	    this.update();
	}
	
	StateObject.prototype = {
	    fsm: null,
	
	    data: null,
	
	    update: function update() {
	        this.onChange();
	        this.onPause();
	        this.onModify();
	    },
	
	    reset: function reset() {
	        this.data = {
	            name: '',
	            index: -1,
	            paused: false,
	            is: {},
	            actions: {},
	            states: {},
	            all: {
	                states: [],
	                actions: []
	            }
	        };
	    },
	
	    onPause: function onPause(event) {
	        this.data.paused = this.fsm.isPaused();
	    },
	
	    onModify: function onModify(event) {
	        this.data.all.states = this.fsm.transitions.getStates();
	        this.data.all.actions = this.fsm.transitions.getActions();
	    },
	
	    onChange: function onChange(event) {
	        var fsm = this.fsm;
	        this.data.name = fsm.state;
	        this.data.index = this.fsm.transitions.states.indexOf(this.data.name);
	        this.data.states = (0, _utils.toHash)(fsm.transitions.getToStates(fsm.state) || []);
	        this.data.actions = (0, _utils.toHash)(fsm.transitions.getActionsFrom(fsm.state) || []);
	        this.data.is = {};
	        this.data.is[fsm.state] = true;
	    }
	
	};
	
	function setup(fsm) {
	    return new StateObject(fsm);
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.isObject = isObject;
	exports.isArray = isArray;
	exports.isString = isString;
	exports.isFunction = isFunction;
	exports.isDefined = isDefined;
	exports.isUndefined = isUndefined;
	exports.trim = trim;
	exports.toHash = toHash;
	function isObject(value) {
	    return Object.prototype.toString.call(value) === '[object Object]';
	}
	
	function isArray(value) {
	    return value instanceof Array;
	}
	
	function isString(value) {
	    return typeof value === 'string';
	}
	
	function isFunction(value) {
	    return value instanceof Function;
	}
	
	function isDefined(value) {
	    return typeof value !== 'undefined';
	}
	
	function isUndefined(value) {
	    return typeof value === 'undefined';
	}
	
	function trim(value) {
	    return String(value || '').replace(/^\s+|\s+$/g, '');
	}
	
	function toHash(values) {
	    return values.reduce(function (obj, value) {
	        obj[value] = true;
	        return obj;
	    }, {});
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = setup;
	function onPause(event) {
	    // assign paused
	    $states.toggleClass('paused', _fsm.isPaused());
	
	    // update buttons
	    event && updateButtons();
	}
	
	function onChange(event) {
	
	    // assign state
	    $states.attr('data-state', _fsm.state);
	
	    // assign active class to the current state
	    $states.find(_state).removeClass('active').filter('#' + _fsm.state).addClass('active');
	
	    // update buttons
	    event && updateButtons();
	}
	
	function updateButtons() {
	    $controls.find(_control).each(function (i, e) {
	        e.disabled = !_fsm.canDo(e.name) || _fsm.isPaused();
	    });
	}
	
	function update() {
	    onPause();
	    onChange();
	    updateButtons();
	}
	
	var _fsm, $states, $controls, _states, _controls, _state, _control;
	
	function setup(fsm, states, controls, state, control) {
	
	    // parameters
	    _fsm = fsm;
	    _states = states || '#states';
	    _controls = controls || '#controls';
	    _state = state || '[id]';
	    _control = control || '[name]';
	
	    // elements
	    $states = $(_states);
	    $controls = $(_controls);
	
	    // live-bind button clicks to fsm actions
	    $controls.on('click', _control, function (event) {
	        fsm.do(event.target.name);
	    });
	
	    // bind event handlers
	    fsm.on('change', onChange).on('pause', onPause).on('resume', onPause);
	
	    // update
	    update();
	
	    // return
	    return fsm;
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=StateHelper.js.map