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

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _ObjectHelper = __webpack_require__(2);
	
	var _ObjectHelper2 = _interopRequireDefault(_ObjectHelper);
	
	var _jQueryHelper = __webpack_require__(4);
	
	var _jQueryHelper2 = _interopRequireDefault(_jQueryHelper);
	
	var _VueRouter = __webpack_require__(5);
	
	var _VueRouter2 = _interopRequireDefault(_VueRouter);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var StateHelper = {
	    object: _ObjectHelper2.default,
	    jQuery: _jQueryHelper2.default,
	    vueRouter: _VueRouter2.default
	};
	
	exports.default = StateHelper;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = setup;
	
	var _utils = __webpack_require__(3);
	
	function ObjectHelper(fsm) {
	    this.data = {};
	    this.fsm = fsm;
	    this.fsm.on('change', this.onChange.bind(this)).on('(pause resume cancel)', this.onPause.bind(this)).on('(state.add state.remove action.add action.remove)', this.onModify.bind(this));
	    this.reset();
	    this.update();
	}
	
	ObjectHelper.prototype = {
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
	        this.data.states = (0, _utils.toHash)(fsm.transitions.getStatesFrom(fsm.state) || []);
	        this.data.actions = (0, _utils.toHash)(fsm.transitions.getActionsFrom(fsm.state) || []);
	        this.data.is = {};
	        this.data.is[fsm.state] = true;
	    }
	
	};
	
	function setup(fsm) {
	    return new ObjectHelper(fsm);
	}

/***/ },
/* 3 */
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
	exports.diff = diff;
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
	
	function diff(a, b) {
	    var da = b.filter(function (v) {
	        return a.indexOf(v) < 0;
	    });
	    var db = a.filter(function (v) {
	        return b.indexOf(v) < 0;
	    });
	    return db.concat(da);
	}
	
	function toHash(values) {
	    return values.reduce(function (obj, value) {
	        obj[value] = true;
	        return obj;
	    }, {});
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = setup;
	function jQueryHelper(fsm, states, controls, state, control) {
	    var _this = this;
	
	    // fsm
	    this.fsm = fsm;
	
	    // selectors
	    this.selectors = {
	        state: state || '[id]',
	        control: control || '[name]'
	    };
	
	    // elements
	    this.elements = {
	        states: $(states || '#states'),
	        controls: $(controls || '#controls')
	    };
	
	    // live-bind button clicks to fsm actions
	    this.elements.controls.on('click', this.selectors.control, function (event) {
	        _this.fsm.do(event.target.name);
	    });
	
	    // bind event handlers
	    this.fsm.on('change', this.onChange.bind(this)).on('(pause resume cancel)', this.onPause.bind(this)).on('(state.add state.remove)', this.onModifyStates.bind(this)).on('(action.add action.remove)', this.onModifyActions.bind(this));
	
	    // update
	    this.update();
	}
	
	jQueryHelper.prototype = {
	    fsm: null,
	
	    elements: null,
	
	    selectors: null,
	
	    update: function update() {
	        this.updateStates();
	        this.updateButtons();
	    },
	    updateStates: function updateStates() {
	        var state = this.fsm.state;
	        if (state) {
	            // assign state
	            this.elements.states.attr('data-state', state);
	
	            // assign active class to the current state
	            this.elements.states.find(this.selectors.state).removeClass('active').filter('#' + state).addClass('active');
	        }
	    },
	    updateButtons: function updateButtons() {
	        var _this2 = this;
	
	        var paused = this.fsm.isPaused();
	        this.elements.controls.find(this.selectors.control).each(function (i, e) {
	            e.disabled = !_this2.fsm.canDo(e.name) || paused;
	        });
	    },
	    onChange: function onChange(event) {
	        this.updateStates();
	        this.updateButtons();
	    },
	    onPause: function onPause(event) {
	        // assign paused
	        this.elements.states.toggleClass('paused', this.fsm.isPaused());
	
	        // update buttons
	        this.updateButtons();
	    },
	    onModifyStates: function onModifyStates(event) {
	        this.updateStates();
	    },
	    onModifyActions: function onModifyActions(event) {
	        this.updateButtons();
	    }
	};
	
	function setup(fsm, states, controls, state, control) {
	    return new jQueryHelper(fsm, states, controls, state, control);
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = setup;
	/**
	 * Setup relationship between VueRouter and StateHelper
	 *
	 * @param   {VueRouter}     router      The VueRouter instance
	 * @param   {StateObject}   object      The StateObject instance
	 */
	function setup(router, object) {
	    function updateRoute() {
	        router.push('/' + object.fsm.state);
	    }
	
	    // update route when state updates
	    object.fsm.on('change', updateRoute);
	
	    // update state when route updates
	    router.afterEach(function (route) {
	        // directly set state so state machine event handlers are not triggered
	        object.fsm.state = route.name;
	
	        // manually update helper
	        object.update();
	    });
	
	    // immediately update route
	    updateRoute();
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=StateHelper.js.map