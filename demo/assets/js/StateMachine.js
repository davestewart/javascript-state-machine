(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["StateMachine"] = factory();
	else
		root["StateMachine"] = factory();
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
	
	var _HandlerMap = __webpack_require__(5);
	
	var _HandlerMap2 = _interopRequireDefault(_HandlerMap);
	
	var _TransitionMap = __webpack_require__(12);
	
	var _TransitionMap2 = _interopRequireDefault(_TransitionMap);
	
	var _Transition = __webpack_require__(15);
	
	var _Transition2 = _interopRequireDefault(_Transition);
	
	var _utils = __webpack_require__(2);
	
	var _Config = __webpack_require__(16);
	
	var _Config2 = _interopRequireDefault(_Config);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * StateMachine constructor
	 *
	 * @param   {Object|null}    options
	 * @constructor
	 */
	function StateMachine(options) {
	    this.transitions = new _TransitionMap2.default();
	    this.handlers = new _HandlerMap2.default();
	    this.initialize(options);
	}
	
	/**
	 * StateMachine prototype
	 *
	 * The property examples below illustrate a 4-state machine, with states:
	 *
	 * - intro > settings > summary > end
	 *
	 * And actions:
	 *
	 * - back | next | restart | finish
	 */
	StateMachine.prototype = {
	    // ------------------------------------------------------------------------------------------------
	    // properties
	
	    /**
	     * Configuration object
	     *
	     * @var {Config}
	     */
	    config: null,
	
	    /**
	     * Map of all transitions
	     *
	     * @var {TransitionMap}
	     */
	    transitions: null,
	
	    /**
	     * Map of all handlers
	     *
	     * @var {HandlerMap}
	     */
	    handlers: null,
	
	    /**
	     * Any active Transition object that is driving the state change
	     *
	     * @var {Transition}
	     */
	    transition: null,
	
	    /**
	     * The current state
	     *
	     * @var {string}
	     */
	    state: '',
	
	    // ------------------------------------------------------------------------------------------------
	    // private methods
	
	    /**
	     * Initialize the FSM with a config object
	     *
	     * @private
	     * @param options
	     */
	    initialize: function initialize(options) {
	        var _this = this;
	
	        // state
	        this.state = '';
	
	        // build config
	        var config = new _Config2.default(options);
	        this.config = config;
	
	        // pre-process all transitions
	        var transitions = [];
	        if (Array.isArray(options.transitions)) {
	            options.transitions.map(function (tx) {
	                transitions = transitions.concat(_this.transitions.parse(tx));
	            });
	        }
	
	        // add transitions
	        transitions.map(function (transition) {
	            _this.transitions.add(transition.action, transition.from, transition.to);
	        });
	
	        // get initial state (must be done after state collation)
	        if (!config.initial) {
	            config.initial = this.transitions.getStates()[0];
	        }
	
	        // add handlers
	        if (options.handlers) {
	            for (var name in options.handlers) {
	                if (options.handlers.hasOwnProperty(name)) {
	                    this.on(name, options.handlers[name]);
	                }
	            }
	        }
	
	        // start
	        if (this.config.start) {
	            this.start();
	        }
	
	        // return
	        return this;
	    },
	
	    start: function start() {
	        this.state = this.config.initial;
	        this.handlers.update('system', 'start');
	        this.handlers.update('system', 'change', 'state', this.state);
	        return this;
	    },
	
	    // ------------------------------------------------------------------------------------------------
	    // api
	
	    /**
	     * Attempt to run an action, resulting in a transition to a state
	     *
	     * @param   {string}    action
	     * @param   {*[]}       rest
	     * @returns {boolean}
	     */
	    do: function _do(action) {
	        if (this.canDo(action) && !this.isPaused()) {
	            for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	                rest[_key - 1] = arguments[_key];
	            }
	
	            this.transition = _Transition2.default.create(this, action, rest);
	            if (action === this.config.defaults.initialize) {
	                this.handlers.update('system', 'initialize');
	            }
	            this.transition.exec();
	            return true;
	        }
	        return false;
	    },
	
	    /**
	     * Attempt to go to a state
	     *
	     * Queries TransitionMap instance to see if a transition exists, then calls the related action if it does
	     *
	     * @param   {string}    state
	     * @param   {boolean}   [force]
	     * @returns {boolean}
	     */
	    go: function go(state) {
	        var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	
	        if (this.has(state)) {
	            if (force) {
	                unpause(this);
	                this.transition = _Transition2.default.force(this, state);
	                return this.end();
	            }
	            var action = this.transitions.getActionTo(this.state, state);
	            if (action) {
	                return this.do(action);
	            }
	            this.config.debug && console.warn('No transition exists from "%s" to "%s"', this.state, state);
	        }
	        return false;
	    },
	
	    /**
	     * Query a transition to see if a named action is available
	     *
	     * @param   {string}        action
	     * @returns {boolean}
	     */
	    canDo: function canDo(action) {
	        return this.transitions.has(this.state, action);
	    },
	
	    /**
	     *
	     * @param to
	     * @return {boolean}
	     */
	    canGo: function canGo(to) {
	        return this.transitions.getActionTo(this.state, to) !== null;
	    },
	
	    /**
	     * Test if a state exists
	     *
	     * @param   {string}    state
	     * @return  {boolean}
	     */
	    has: function has(state) {
	        if (!this.transitions.hasState(state)) {
	            this.config.debug && console.warn('No such state "%s"', state);
	            return false;
	        }
	        return true;
	    },
	
	    /**
	     * Test if the current state is the same as the supplied one
	     *
	     * @param   {string}    state       A state name to compare against the current state
	     * @returns {boolean}
	     */
	    is: function is(state) {
	        return state === this.state;
	    },
	
	    // ------------------------------------------------------------------------------------------------
	    // flags
	
	    /**
	     * Test if the FSM has started
	     *
	     * @returns {boolean}
	     */
	    isStarted: function isStarted() {
	        return this.state !== '';
	    },
	
	    /**
	     * Test if the FSM is transitioning
	     *
	     * @returns {boolean}
	     */
	    isTransitioning: function isTransitioning() {
	        return !!this.transition;
	    },
	
	    /**
	     * Test if the FSM is paused (whilst transitioning)
	     *
	     * @returns {boolean}
	     */
	    isPaused: function isPaused() {
	        return this.transition ? this.transition.paused : false;
	    },
	
	    /**
	     * Test if the FSM is on the "final" state
	     *
	     * @returns {boolean}
	     */
	    isComplete: function isComplete() {
	        return this.state === this.config.final;
	    },
	
	    // ------------------------------------------------------------------------------------------------
	    // transitions
	
	    /**
	     * Pause any current transition
	     *
	     * @returns {StateMachine}
	     */
	    pause: function pause() {
	        if (this.transition && !this.isPaused()) {
	            this.transition.pause();
	            this.handlers.update('transition', 'pause');
	        }
	        return this;
	    },
	
	    /**
	     * Resume any current transition
	     *
	     * @returns {StateMachine}
	     */
	    resume: function resume() {
	        if (this.transition && this.isPaused()) {
	            unpause(this);
	            this.transition.resume();
	        }
	        return this;
	    },
	
	    /**
	     * Cancel any current transition
	     *
	     * @returns {StateMachine}
	     */
	    cancel: function cancel() {
	        if (this.transition) {
	            unpause(this);
	            this.state = this.transition.from;
	            this.transition.clear();
	            delete this.transition;
	            this.handlers.update('transition', 'cancel');
	        }
	        return this;
	    },
	
	    /**
	     * End any current transition, skipping remaining handlers
	     *
	     * @returns {StateMachine}
	     */
	    end: function end() {
	        if (this.transition) {
	            unpause(this);
	            this.state = this.transition.to;
	            this.transition.clear();
	            delete this.transition;
	            this.handlers.update('system', 'change', 'state', this.state);
	            if (this.isComplete()) {
	                this.handlers.update('system', 'complete');
	            }
	        }
	        return this;
	    },
	
	    /**
	     * Reset the FSM to the initial, or supplied, state
	     *
	     * @returns {StateMachine}
	     */
	    reset: function reset() {
	        var initial = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	
	        var state = initial || this.config.initial;
	        this.handlers.update('system', 'reset');
	        if (this.transition) {
	            unpause(this);
	            this.transition.clear();
	            delete this.transition;
	            this.handlers.update('transition', 'cancel');
	        }
	        if (this.state !== state) {
	            this.state = state;
	            this.handlers.update('system', 'change', 'state', this.state);
	        }
	        return this;
	    },
	
	    // ------------------------------------------------------------------------------------------------
	    // actions
	
	    /**
	     * Add a transition
	     *
	     * @param   {string}    action
	     * @param   {string}    from
	     * @param   {string}    to
	     * @return  {StateMachine}
	     */
	    add: function add(action, from, to) {
	        var _this2 = this;
	
	        // 1 argument: shorthand transition, i.e 'next : a > b'
	        if (arguments.length === 1) {
	            var transitions = parseTransition(action);
	            transitions.map(function (tx) {
	                return _this2.add(tx.action, tx.from, tx.to);
	            });
	            return this;
	        }
	
	        // 3 arguments: longhand transition
	        this.transitions.add(action, from, to);
	        var states = this.transitions.getStates();
	        this.handlers.update('system', 'add', 'states', states);
	        return this;
	    },
	
	    /**
	     * Remove a state
	     *
	     * @param   {string}    state
	     * @return  {StateMachine}
	     */
	    remove: function remove(state) {
	        this.handlers.remove('state.' + state);
	        this.transitions.remove(state);
	        var states = this.transitions.getStates();
	        this.handlers.update('system', 'remove', 'states', states);
	        return this;
	    },
	
	    // ------------------------------------------------------------------------------------------------
	    // handlers
	
	    /**
	     * Add an event handler
	     *
	     * Event handler signatures are build from the following grammar:
	     *
	     * - token      foo
	     * - property   .foo
	     * - event      :foo
	     * - action     @foo
	     * - targets    (foo|bar|baz)
	     *
	     * For example:
	     *
	     * - change
	     * - transition.pause
	     * - next:end
	     * - (a|b)@next
	     * - a@next
	     *
	     * The main event types are unique, so can be used without the namespace:
	     *
	     * - change
	     * - pause
	     * - complete
	     * - ...
	     *
	     * If your states and events are unique, they can also be used without qualification.
	     *
	     * See docs and demo for more information
	     *
	     * @param   {string}        id
	     * @param   {Function}      fn
	     * @return  {StateMachine}
	     */
	    on: function on(id, fn) {
	        var _this3 = this;
	
	        // pre-parse handler
	        id = (0, _utils.trim)(id);
	
	        // pre-process multiple event handlers
	        if (id.indexOf('|') > -1) {
	            var ids = id.split('|').map(function (id) {
	                return (0, _utils.trim)(id);
	            }).filter(function (id) {
	                return id !== '';
	            });
	            if (ids.length) {
	                ids.map(function (id) {
	                    return _this3.on(id, fn);
	                });
	            }
	            return this;
	        }
	
	        /** @var {HandlerMeta} */
	        var result = this.handlers.parse(id, this);
	
	        if (this.config.debug) {
	            console.log('StateMachine on: ' + id, [result.namespace, result.type], result.paths);
	        }
	
	        // process handlers
	        result.paths.map(function (path, index) {
	            var target = result.targets[index];
	
	            // warn for invalid actions / states
	            if (target !== '*') {
	                if (result.namespace === 'state') {
	                    if (!_this3.transitions.hasState(target)) {
	                        _this3.config.debug && console.warn('StateMachine: Warning assigning state.%s handler; no such state "%s"', result.type, target);
	                    }
	                } else if (result.namespace === 'action') {
	                    if (!_this3.transitions.hasAction(target)) {
	                        _this3.config.debug && console.warn('StateMachine: Warning assigning action.%s handler; no such action "%s"', result.type, target);
	                    }
	                }
	            }
	
	            // assign
	            _this3.handlers.add(path, fn);
	        });
	
	        return this;
	    },
	
	    off: function off(id, fn) {
	        var _this4 = this;
	
	        var result = this.handlers.parse(id, this);
	        result.paths.map(function (path) {
	            _this4.handlers.remove(path, fn);
	        });
	    },
	
	    parse: function parse(id) {
	        return this.handlers.parse(id, this);
	    }
	
	};
	
	StateMachine.prototype.constructor = StateMachine;
	
	/**
	 * Factory method
	 *
	 * @param   options
	 * @returns {StateMachine}
	 */
	StateMachine.create = function (options) {
	    return new StateMachine(options);
	};
	
	exports.default = StateMachine;
	
	
	function unpause(fsm) {
	    if (fsm.isPaused()) {
	        fsm.transition.paused = false;
	        fsm.handlers.update('transition', 'resume');
	    }
	}

/***/ },
/* 1 */,
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
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _ValueMap = __webpack_require__(6);
	
	var _ValueMap2 = _interopRequireDefault(_ValueMap);
	
	var _events = __webpack_require__(7);
	
	var _utils = __webpack_require__(2);
	
	var _HandlerParser = __webpack_require__(8);
	
	var _HandlerParser2 = _interopRequireDefault(_HandlerParser);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function HandlerMap() {
	    this.map = new _ValueMap2.default();
	}
	
	HandlerMap.prototype = {
	
	    map: null,
	
	    /**
	     * Parse event handler grammar into a HandlerMeta structure
	     *
	     * @param   {string}        id      The handler id to parse, i.e. '@next', 'intro:end', 'change', etc
	     * @param   {StateMachine}  fsm     A StateMachine instance to test for states and actions
	     * @returns {HandlerMeta}
	     */
	    parse: function parse(id, fsm) {
	        return (0, _HandlerParser2.default)(id, fsm);
	    },
	
	    /**
	     * Directly add a new handler
	     *
	     * @param   {string}    path    A 'namespace.target.type' target path to add a handler to
	     * @param   {Function}  fn      A callback function
	     * @returns {HandlerMap}
	     */
	    add: function add(path, fn) {
	        // check handler is a function
	        if (!(0, _utils.isFunction)(fn)) {
	            throw new Error('Error assigning "' + path + '" handler; callback is not a function', fn);
	        }
	
	        this.map.insert(path, fn);
	        return this;
	    },
	
	    /**
	     * Directly remove a handler target
	     *
	     * @param   {string}    path    A 'namespace.target.type' target to be removed
	     * @returns {HandlerMap}
	     */
	    remove: function remove(path) {
	        this.map.remove(path);
	        return this;
	    },
	
	    /**
	     * Get all handlers for a valid target path
	     *
	     * @param   {string}    path    A 'namespace.target.type' target path
	     * @returns {Function[]}        An array of callback functions
	     */
	    get: function get(path) {
	        return this.map.get(path);
	    },
	
	    /**
	     * Dispatch an event
	     *
	     * @param   {string}    namespace
	     * @param   {string}    type
	     * @param   {string}    key
	     * @param   {*}         value
	     * @returns {StateMachine}
	     */
	    update: function update(namespace, type) {
	        var _this = this;
	
	        var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
	        var value = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
	
	        // create lookup path
	        var path = namespace + '.' + type;
	
	        // build event
	        var event = namespace === 'system' ? new _events.SystemEvent(type, key, value) : new _events.TransitionEvent(type);
	
	        // dispatch
	        var handlers = this.map.get(path);
	        if (handlers) {
	            handlers.map(function (fn) {
	                return fn(event, _this);
	            });
	        }
	    }
	
	};
	
	exports.default = HandlerMap;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.values = exports.remove = exports.indexOf = exports.has = exports.get = exports.set = undefined;
	exports.default = ValueMap;
	
	var _utils = __webpack_require__(2);
	
	/**
	 * Utility class to create, modify and delete nested hashes and values
	 *
	 * @constructor
	 */
	function ValueMap(data) {
	    this.data = data || {};
	}
	
	ValueMap.prototype = {
	    data: null,
	
	    set: function set(path, value) {
	        _set(this.data, path, value);
	        return this;
	    },
	
	    add: function add(path, value) {
	        _add(this.data, path, value);
	        return this;
	    },
	
	    insert: function insert(path, value) {
	        _insert(this.data, path, value);
	        return this;
	    },
	
	    get: function get(path) {
	        return _get(this.data, path);
	    },
	
	    has: function has(path) {
	        var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	
	        return _has(this.data, path, value);
	    },
	
	    indexOf: function indexOf(path, value) {
	        return _indexOf(this.data, path, value);
	    },
	
	    remove: function remove(path) {
	        var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
	
	        _remove(this.data, path, value);
	        return this;
	    },
	
	    keys: function keys(path) {
	        return Object.keys(_get(this.data, path));
	    },
	
	    values: function values(path) {
	        return _values(this.data, path);
	    }
	
	};
	
	function create(obj, keys) {
	    var key = void 0;
	    while (keys.length) {
	        key = keys.shift();
	        if (!(0, _utils.isObject)(obj[key])) {
	            obj[key] = {};
	        }
	        obj = obj[key];
	    }
	    return obj;
	}
	
	function _set(obj, path, value) {
	    var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : -1;
	
	    var keys = String(path).split('.'),
	        key = keys.pop();
	    obj = create(obj, keys);
	    obj[key] = value;
	}
	
	exports.set = _set;
	function _add(obj, path, value) {
	    var keys = String(path).split('.'),
	        key = keys.pop();
	    obj = create(obj, keys);
	    if (!(0, _utils.isArray)(obj[key])) {
	        obj[key] = [];
	    }
	    obj[key].push(value);
	}
	
	function _insert(obj, path, value) {
	    var keys = String(path).split('.'),
	        key = keys.pop();
	    obj = create(obj, keys);
	    if (!(0, _utils.isArray)(obj[key])) {
	        obj[key] = [];
	    }
	    var parent = obj[key],
	        index = parent.indexOf(value);
	    if (index === -1) {
	        parent.push(value);
	    } else {
	        parent[index] = value;
	    }
	}
	
	function _get(obj, path) {
	    if ((0, _utils.isUndefined)(path) || path == '') {
	        return obj;
	    }
	
	    var key = void 0,
	        keys = String(path).split('.');
	    while (keys.length > 1) {
	        key = keys.shift();
	        if (!obj.hasOwnProperty(key)) {
	            return;
	        }
	        obj = obj[key];
	    }
	    key = keys.shift();
	    return obj[key];
	}
	
	exports.get = _get;
	function _has(obj, path, value) {
	    var parent = _get(obj, path);
	    return !!((0, _utils.isArray)(parent) && (0, _utils.isDefined)(value) ? parent.indexOf(value) !== -1 : (0, _utils.isUndefined)(value) ? (0, _utils.isDefined)(parent) : parent === value);
	}
	
	exports.has = _has;
	function _indexOf(obj, path, value) {
	    var arr = _get(obj, path);
	    if ((0, _utils.isArray)(arr)) {
	        return arr.indexOf(value);
	    }
	    return -1;
	}
	
	exports.indexOf = _indexOf;
	function _remove(obj, path, value) {
	    var parent = obj,
	        keys = String(path || '').split('.'),
	        key = keys.pop();
	
	    if (keys.length) {
	        parent = _get(obj, keys.join('.'));
	    }
	    if ((0, _utils.isDefined)(value) && (0, _utils.isArray)(parent[key])) {
	        var target = parent[key];
	        var index = target.indexOf(value);
	        if (index > -1) {
	            target.splice(index, 1);
	            if (target.length === 0) {
	                delete parent[key];
	            }
	            return true;
	        }
	        return false;
	    } else {
	        if ((0, _utils.isObject)(parent) && obj.hasOwnProperty(key)) {
	            delete parent[key];
	            return true;
	        }
	    }
	    return false;
	}
	
	exports.remove = _remove;
	function _values(obj, path) {
	    var values = [];
	    var target = _get(obj, path);
	    if ((0, _utils.isObject)(target)) {
	        for (var name in target) {
	            if (target.hasOwnProperty(name)) {
	                values.push(target[name]);
	            }
	        }
	    }
	    return values;
	}
	exports.values = _values;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ActionEvent = ActionEvent;
	exports.StateEvent = StateEvent;
	exports.SystemEvent = SystemEvent;
	exports.TransitionEvent = TransitionEvent;
	// ------------------------------------------------------------------------------------------------
	// setup
	
	/**
	 * @prop {string}       namespace   The Event namespace; i.e. state or action
	 * @prop {string}       type        The Event type;      i.e. leave/enter (state) or start/end (action)
	 * @prop {string}       target      The Event target;    i.e. intro (state), next (action), or * (all states or types)
	 * @prop {Transition}   transition  The transition which generated the event
	 */
	var event = {
	    // properties
	    namespace: null,
	    type: null,
	    target: null,
	    transition: null
	};
	
	function initialize(event, namespace, type, target, transition) {
	    event.namespace = namespace;
	    event.type = type;
	    event.target = target;
	    event.transition = transition;
	}
	
	// ------------------------------------------------------------------------------------------------
	// ActionEvent
	
	function ActionEvent(type, target, transition) {
	    initialize(this, 'action', type, target, transition);
	}
	ActionEvent.prototype = event;
	
	// ------------------------------------------------------------------------------------------------
	// StateEvent
	
	function StateEvent(type, target, transition) {
	    initialize(this, 'state', type, target, transition);
	}
	StateEvent.prototype = event;
	
	// ------------------------------------------------------------------------------------------------
	// SystemEvent
	
	function SystemEvent(type, key, value) {
	    this.type = type;
	    this.key = key;
	    this.value = value;
	}
	
	SystemEvent.prototype = {
	    namespace: 'system',
	    type: '',
	    key: '',
	    value: null
	};
	
	// ------------------------------------------------------------------------------------------------
	// TransitionEvent
	
	function TransitionEvent(type) {
	    this.type = type;
	}
	
	TransitionEvent.prototype = {
	    namespace: 'transition',
	    type: ''
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = parse;
	
	var _HandlerMeta = __webpack_require__(9);
	
	var _HandlerMeta2 = _interopRequireDefault(_HandlerMeta);
	
	var _errors = __webpack_require__(10);
	
	var _Lexer = __webpack_require__(11);
	
	var _Lexer2 = _interopRequireDefault(_Lexer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// ------------------------------------------------------------------------------------------------
	// functions
	
	function isNamespace(token) {
	    return (/^(system|transition|action|state)$/.test(token)
	    );
	}
	
	function isSystem(token) {
	    return (/^(add|remove|start|change|update|complete|reset)$/.test(token)
	    );
	}
	
	function isTransition(token) {
	    return (/^(pause|resume|cancel)$/.test(token)
	    );
	}
	
	function isAction(token, fsm) {
	    return fsm.transitions.hasAction(token);
	}
	
	function isState(token, fsm) {
	    return fsm.transitions.hasState(token);
	}
	
	function getNamespace(token) {
	    return isSystem(token) ? 'system' : isTransition(token) ? 'transition' : null;
	}
	
	function getEventNamespace(token) {
	    return (/^(enter|leave)$/.test(token) ? 'state' : /^(start|end)$/.test(token) ? 'action' : null
	    );
	}
	
	// ------------------------------------------------------------------------------------------------
	// export
	
	/**
	 * Parses event handler id into HandlerMeta instance
	 *
	 * @param   {string}        id      The handler id to parse, i.e. '@next', 'intro:end', 'change', etc
	 * @param   {StateMachine}  fsm     A StateMachine instance to test for states and actions
	 * @return  {HandlerMeta}
	 */
	function parse(id, fsm) {
	    return parser.parse(id, fsm);
	}
	
	// ------------------------------------------------------------------------------------------------
	// objects
	
	var lexer = new _Lexer2.default({
	    targets: /\.?\((.+?)\)/,
	    property: /\.(\w+)/,
	    action: /@(\w+)/,
	    event: /:(\w+)/,
	    word: /(\w+)/
	});
	
	var parser = {
	    result: null,
	
	    /**
	     * Parses event handler id into HandlerMeta instance
	     *
	     * Resolving namespace, type and target properties
	     *
	     * @param   {string}        id
	     * @param   {StateMachine}  fsm
	     * @return  {HandlerMeta}
	     */
	    parse: function parse(id, fsm) {
	        var _this = this;
	
	        // variables
	        var defaults = fsm.config.defaults;
	        var tokens = lexer.process(id);
	        var result = this.result = new _HandlerMeta2.default(id);
	
	        // process
	        tokens.map(function (token) {
	            _this.parseToken(token.name, token.value, fsm);
	        });
	
	        if (!result.type) {
	            result.setType(defaults[result.namespace]);
	        }
	
	        // return result
	        return result.update();
	    },
	
	    /**
	     * Parse token name and value
	     *
	     * @param   {string}        name
	     * @param   {string}        value
	     * @param   {StateMachine}  fsm
	     */
	    parseToken: function parseToken(name, value, fsm) {
	        // variables
	        var namespace = void 0,
	            values = void 0;
	
	        // process
	        switch (name) {
	            case 'targets':
	
	                values = value.match(/\w+/g);
	                namespace = isState(values[0], fsm) ? 'state' : isAction(values[0], fsm) ? 'action' : null;
	
	                if (namespace) {
	                    return this.result.setNamespace(namespace).setTarget(values);
	                }
	
	                throw new _errors.ParseError('Unknown target(s) type "(' + value + ')"');
	
	            case 'action':
	
	                if (!isAction(value, fsm)) {
	                    throw new _errors.ParseError('Unknown action "' + value + '"');
	                }
	
	                if (!this.result.namespace) {
	                    this.result.setNamespace('action');
	                }
	                return this.result.namespace === 'state' ? this.result.setType(value) : this.result.setTarget(value);
	
	            case 'event':
	
	                if (namespace = getEventNamespace(value)) {
	                    return this.result.setNamespace(namespace).setType(value);
	                }
	                throw new _errors.ParseError('Unknown event "' + value + '"');
	
	            // any ".property"; could be system.change, intro.next
	            case 'property':
	
	                return this.parseToken('word', value, fsm);
	
	            default:
	
	                // top-level namespace, like system, transition, state
	                if (isNamespace(value)) {
	                    return this.result.setNamespace(value);
	                }
	
	                // generic value, like change, add, update
	                if (namespace = getNamespace(value)) {
	                    return this.result.setNamespace(namespace).setType(value);
	                }
	
	                // existing state, like a, b, c
	                if (isState(value, fsm)) {
	                    return this.result.setNamespace('state').setTarget(value);
	                }
	
	                // existing action, like next, back, quit
	                if (isAction(value, fsm)) {
	                    return this.parseToken('action', value, fsm);
	                }
	
	                // unknown
	                throw new _errors.ParseError('Unknown token "' + value + '"');
	        }
	    }
	
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _errors = __webpack_require__(10);
	
	function HandlerMeta(id) {
	    this.id = id;
	    this.targets = ['*'];
	}
	
	HandlerMeta.prototype = {
	    id: '',
	    namespace: '',
	    type: '',
	    targets: [],
	    paths: [],
	
	    setNamespace: function setNamespace(value) {
	        if (this.namespace && value !== this.namespace) {
	            throw new _errors.ParseError('Cannot set namespace "' + value + '" for existing result ' + this.toString());
	        }
	        this.namespace = value;
	        return this;
	    },
	
	    setType: function setType(value) {
	        if (this.type && value !== this.type) {
	            throw new _errors.ParseError('Cannot set type "' + value + '" for existing result ' + this.toString());
	        }
	        this.type = value;
	        return this;
	    },
	
	    setTarget: function setTarget(value) {
	        this.targets = Array.isArray(value) ? value : [value];
	        return this;
	    },
	
	    update: function update() {
	        var _this = this;
	
	        this.paths = this.targets.map(function (target) {
	            var segments = _this.namespace === 'action' || _this.namespace === 'state' ? [_this.namespace, target, _this.type] : [_this.namespace, _this.type];
	            return segments.join('.');
	        });
	        return this;
	    },
	
	    toString: function toString() {
	        var parts = this.namespace && this.type ? [this.namespace, this.type] : this.namespace ? [this.namespace] : [this.type];
	        return '[' + parts.join(':') + ']';
	    }
	
	};
	
	exports.default = HandlerMeta;

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ParseError = ParseError;
	function ParseError(message) {
	    this.name = 'ParseError';
	    this.message = message;
	}
	
	ParseError.prototype = Error.prototype;

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = Lexer;
	function Lexer(rules) {
	    var _this = this;
	
	    this.rules = [];
	    if (rules) {
	        Object.keys(rules).map(function (name) {
	            return _this.addRule(name, rules[name]);
	        });
	    }
	}
	
	Lexer.prototype = {
	    /** @var {String} */
	    source: null,
	
	    /** @var {Rule[]} */
	    rules: null,
	
	    /** @var {Token[]} */
	    tokens: null,
	
	    /** @var {Number} */
	    index: 0,
	
	    process: function process(source) {
	        this.source = source;
	        this.tokens = [];
	        this.index = 0;
	        this.next();
	        return this.tokens;
	    },
	
	    addRule: function addRule(name, rx) {
	        this.rules.push(new Rule(name, new RegExp('^' + rx.source)));
	    },
	
	    next: function next() {
	        var _this2 = this;
	
	        if (this.index < this.source.length) {
	            (function () {
	                var source = _this2.source.substr(_this2.index);
	                var state = _this2.rules.some(function (rule) {
	                    var matches = source.match(rule.rx);
	                    if (matches) {
	                        _this2.tokens.push(new Token(rule.name, matches[1]));
	                        _this2.index += matches[0].length;
	                        return true;
	                    }
	                    return false;
	                });
	
	                // not matched
	                if (!state) {
	                    throw new Error('Unable to match source at position ' + _this2.index + ': "' + source + '"');
	                }
	
	                // match
	                _this2.next();
	            })();
	        }
	    }
	};
	
	function Token(name, value) {
	    this.name = name;
	    this.value = value;
	}
	
	function Rule(name, rx) {
	    this.name = name;
	    this.rx = rx;
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _ValueMap = __webpack_require__(6);
	
	var _ValueMap2 = _interopRequireDefault(_ValueMap);
	
	var _TransitionParser = __webpack_require__(13);
	
	var _TransitionParser2 = _interopRequireDefault(_TransitionParser);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function TransitionMap() {
	    this.map = new _ValueMap2.default();
	    this.states = [];
	    this.actions = [];
	}
	
	TransitionMap.prototype = {
	    // ------------------------------------------------------------------------------------------------
	    // properties
	
	    map: null,
	    states: null,
	    actions: null,
	
	    // ------------------------------------------------------------------------------------------------
	    // add and remove states
	
	    /**
	     * Add event handler parsing
	     *
	     * @param   {string}    tx
	     * @returns {TransitionMeta[]}
	     */
	    parse: function parse(tx) {
	        return (0, _TransitionParser2.default)(tx);
	    },
	
	    /**
	     * Adds a new transition
	     * 
	     * @param   {string}    action
	     * @param   {string}    from
	     * @param   {string}    to
	     * @returns {TransitionMap}
	     */
	    add: function add(action, from, to) {
	        this.map.set(from + '.' + action, to);
	        return update(this);
	    },
	
	    /**
	     * Removes an existing state
	     *
	     * @param   {string}    state
	     * @returns {TransitionMap}
	     */
	    remove: function remove(state) {
	        // remove "from" state
	        this.map.remove(state);
	
	        // remove "to" states
	        var data = this.map.data;
	        for (var name in data) {
	            var from = data[name];
	            for (var action in from) {
	                if (from[action] === state) {
	                    delete from[action];
	                }
	            }
	        }
	
	        // update and return
	        return update(this);
	    },
	
	    // ------------------------------------------------------------------------------------------------
	    // accessors
	
	    /**
	     * Get all available actions (or action => states map) for a given state
	     *
	     * @param   {string}    state       Name of a state to get actions for
	     * @param   {boolean}   [asMap]     Optional boolean to return a Object of action:state properties. Defaults to false
	     * @returns {string[]|Object}       An array of string actions, or a hash of action:states
	     */
	    getActionsFrom: function getActionsFrom(state) {
	        var asMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	
	        if (this.has(state)) {
	            var actions = this.map.get(state);
	            return actions ? asMap ? actions : Object.keys(actions) : [];
	        }
	        return [];
	    },
	
	    /**
	     * Get the first available action to move from one state to another (if there is one)
	     *
	     * @param   {string}    from
	     * @param   {string}    to
	     * @return  {string|null}
	     */
	    getActionTo: function getActionTo(from, to) {
	        var actions = this.map.get(from);
	        for (var action in actions) {
	            if (actions[action] === to) {
	                return action;
	            }
	        }
	        return null;
	    },
	
	    /**
	     * Get all available "to" states for a given state
	     *
	     * Loops over all actions and returns a unique array of "to" states
	     *
	     * @param   {string|null}    [state]    Optional name of a state to get states for. Defaults to the current state
	     * @returns {string[]}                  An array of string states
	     */
	    getToStates: function getToStates(state) {
	        var _this = this;
	
	        if (this.hasState(state)) {
	            var _ret = function () {
	                var actions = _this.getActionsFrom(state, true);
	                return {
	                    v: Object.keys(actions).map(function (name) {
	                        return actions[name];
	                    })
	                };
	            }();
	
	            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	        }
	        return null;
	    },
	
	    /**
	     * Get all states within the system
	     *
	     * @return  {string[]}
	     */
	    getStates: function getStates() {
	        return [].concat(this.states);
	    },
	
	    /**
	     * Get all actions within the system
	     *
	     * @return  {string[]}
	     */
	    getActions: function getActions() {
	        return [].concat(this.actions);
	    },
	
	    /**
	     * General getter
	     *
	     * @param   {string}    path
	     * @return  {*}
	     */
	    get: function get(path) {
	        path = Array.prototype.slice.apply(arguments).join('.');
	        return this.map.get(path);
	    },
	
	    // ------------------------------------------------------------------------------------------------
	    // checks
	
	    /**
	     * Test if the given state exists within the system
	     *
	     * @param   {string}    state
	     * @returns {boolean}
	     */
	    hasState: function hasState(state) {
	        return this.states.indexOf(state) !== -1;
	    },
	
	    /**
	     * Test if the given action exists within the system
	     *
	     * @param   {string}    action
	     * @returns {boolean}
	     */
	    hasAction: function hasAction(action) {
	        return this.actions.indexOf(action) !== -1;
	    },
	
	    /**
	     * Utility function to directly check if the composed ValueMap has the requested path
	     *
	     * @param   {string}    path    Pass a path using dot notation, i.e. 'a.next.b' or pass individual arguments, i.e. from, action, to
	     * @returns {boolean}
	     */
	    has: function has(path) {
	        path = Array.prototype.slice.apply(arguments).join('.');
	        return !!path ? this.map.has(path) : false;
	    }
	
	};
	
	TransitionMap.prototype.constructor = TransitionMap;
	
	/**
	 * Private utility function to update existing states and actions
	 *
	 * @param   {TransitionMap} target
	 * @returns {TransitionMap}
	 */
	function update(target) {
	    // variables
	    var actions = {};
	    var states = {};
	    var data = target.map.data;
	    var to;
	
	    // remove "to" states
	    for (var from in data) {
	        states[from] = true;
	        for (var action in data[from]) {
	            actions[action] = true;
	            to = data[from][action];
	            if (typeof to !== 'function') {
	                states[to] = true;
	            }
	        }
	    }
	
	    // update
	    target.states = Object.keys(states);
	    target.actions = Object.keys(actions);
	
	    // return
	    return target;
	}
	
	exports.default = TransitionMap;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	exports.default = parse;
	
	var _utils = __webpack_require__(2);
	
	var _errors = __webpack_require__(10);
	
	var _TransitionMeta = __webpack_require__(14);
	
	var _TransitionMeta2 = _interopRequireDefault(_TransitionMeta);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// ------------------------------------------------------------------------------------------------
	// functions
	
	function getError(tx, message) {
	    return 'Invalid transition shorthand pattern "' + tx + '" - ' + message;
	}
	
	function add(transitions, action, from, to) {
	    transitions.push(new _TransitionMeta2.default(action, from, to));
	}
	
	// ------------------------------------------------------------------------------------------------
	// export
	
	/**
	 * Parses/expands transition objects/strings into discrete transitions
	 *
	 * @returns {TransitionMeta[]}  An array of TransitionMeta instances
	 */
	function parse(tx) {
	    if ((0, _utils.isString)(tx)) {
	        var _ret = function () {
	            // pre-process string
	            tx = tx.replace(/([|=:<>])/g, ' $1 ').replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
	
	            // ensure string is valid
	            if (!/^\w+ [:|=] \w[\w ]*[<>] \w[\w ]*/.test(tx)) {
	                throw new _errors.ParseError(getError(tx, 'cannot determine action and states'));
	            }
	
	            // initialize variables
	            var transitions = [],
	                matches = tx.match(/([*\w ]+|[<>])/g),
	                action = matches.shift().replace(/\s+/g, ''),
	                stack = [],
	                match = '',
	                op = '',
	                a = '',
	                b = '';
	
	            // process states
	            while (matches.length) {
	                // get the next match
	                match = matches.shift();
	                if (/[<>]/.test(match)) {
	                    op = match;
	                } else {
	                    match = match.match(/[*\w]+/g);
	                    match = match.length === 1 ? match[0] : match;
	                    stack.push(match);
	                }
	
	                // process matches if stack is full
	                if (stack.length === 2) {
	                    var _ref = op === '<' ? [stack[1], stack[0]] : stack;
	
	                    var _ref2 = _slicedToArray(_ref, 2);
	
	                    a = _ref2[0];
	                    b = _ref2[1];
	
	                    if (Array.isArray(a) && Array.isArray(b)) {
	                        throw new _errors.ParseError(getError(tx, 'transitioning between 2 arrays doesn\'t make sense'));
	                    }
	                    if (Array.isArray(a)) {
	                        a.map(function (a) {
	                            return add(transitions, action, a, b);
	                        });
	                    } else if (Array.isArray(b)) {
	                        b.map(function (b) {
	                            return add(transitions, action, a, b);
	                        });
	                    } else {
	                        add(transitions, action, a, b);
	                    }
	
	                    // discard original match once processed
	                    stack.shift();
	                }
	            }
	
	            // return
	            return {
	                v: transitions
	            };
	        }();
	
	        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	    }
	
	    // return objects wrapped in an array
	    return [tx];
	}

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	function TransitionMeta(action, from, to) {
	    this.action = action;
	    this.from = from;
	    this.to = to;
	}
	
	exports.default = TransitionMeta;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _events = __webpack_require__(7);
	
	var _utils = __webpack_require__(2);
	
	/**
	 * Transition class
	 *
	 * Responsible for managing events in the flow from state to state.
	 *
	 * This adds all handlers for the current action start/end and state from/to to an array:
	 *
	 * - <namespace>.<target>.<type>[]
	 *
	 * So going from state "a" to state "b" with action "next" should build:
	 *
	 * - action.*.start[]
	 * - action.next.start[]
	 * - state.a.leave[]
	 * - state.*.leave[]
	 * - state.*.enter[]
	 * - state.b.enter[]
	 * - action.next.end[]
	 * - action.*.end[]
	 *
	 * This can be changed by passing in an order array in fsm.config
	 *
	 * Event handlers will receive an Event object, along with any passed parameters (from do()) as ...rest parameters.
	 *
	 * From a callback, you can:
	 *
	 * - return false to cancel the transition
	 * - return true to pause the transition
	 * - not return a value (the transition continues)
	 *
	 * TransitionMap can also be paused, resumed, or cancelled by calling
	 * the appropriate method on, or from:
	 *
	 * - the event
	 * - the transition
	 * - the state machine
	 *
	 * Cancelled transitions will reset the FSM to the previous "from" state
	 *
	 * When the last callback has fired, the main FSM's end() handler will be called and the state will updated
	 *
	 * @param {StateMachine}    fsm
	 * @param {string}          action
	 * @param {string}          from
	 * @param {string}          to
	 */
	function Transition(fsm, action, from, to) {
	    this.fsm = fsm;
	    this.action = action;
	    this.from = from;
	    this.to = to;
	    this.clear();
	}
	
	/**
	 * @prop {StateMachine}    fsm
	 * @prop {string}          action
	 * @prop {string}          from
	 * @prop {string}          to
	 * @prop {Function[]}      handlers
	 */
	Transition.prototype = {
	    fsm: null,
	    action: '',
	    from: '',
	    to: '',
	    paused: false,
	    handlers: null,
	
	    clear: function clear() {
	        this.paused = false;
	        this.handlers = [];
	    },
	
	    /**
	     * Execute the next event's callbacks
	     * @returns {*}
	     */
	    exec: function exec() {
	        if (!this.paused) {
	            if (this.handlers.length) {
	                var handler = this.handlers.shift();
	                var state = handler();
	                if (state === false) {
	                    return this.fsm.cancel();
	                }
	                if (state === true) {
	                    return this.fsm.pause();
	                }
	                this.exec();
	            } else {
	                this.fsm.end();
	            }
	        }
	        return this;
	    },
	
	    pause: function pause() {
	        this.paused = true;
	        return this;
	    },
	
	    resume: function resume() {
	        this.paused = false;
	        return this.exec();
	    }
	};
	
	exports.default = {
	    /**
	     * Create the Transition object
	     *
	     * - Set up variables, and queue
	     * - Determine paths to relevant handlers
	     * - Build State and Action Event objects
	     * - Pre-bind all handlers
	     * - Append to queue
	     *
	     * @param {StateMachine}    fsm
	     * @param {string}          action
	     * @param {Array}           params
	     * @returns {Transition}
	     */
	    create: function create(fsm, action, params) {
	        // transition properties
	        var scope = fsm.config.scope;
	        var from = fsm.state;
	        var to = fsm.transitions.get(from, action);
	        var vars = { action: action, to: to, from: from };
	
	        // handle "to" being a function
	        if ((0, _utils.isFunction)(to)) {
	            to = to.apply(scope, params);
	            if (!fsm.transitions.hasState(to)) {
	                throw new Error('Invalid "to" state "' + to + '"');
	            }
	        }
	
	        // transition
	        var queue = [];
	        var transition = new Transition(fsm, action, from, to);
	
	        // build handlers array
	        fsm.config.order.map(function (path) {
	            // replace path tokens
	            path = path.replace(/{(\w+)}/g, function (all, token) {
	                return vars[token];
	            });
	            var handlers = fsm.handlers.get(path);
	
	            // do it!
	            if (handlers) {
	                (function () {
	                    var _path$split = path.split('.');
	
	                    var _path$split2 = _slicedToArray(_path$split, 3);
	
	                    var namespace = _path$split2[0];
	                    var target = _path$split2[1];
	                    var type = _path$split2[2];
	
	                    handlers = handlers.map(function (handler) {
	                        // build event object
	                        var Event = namespace === 'state' ? _events.StateEvent : _events.ActionEvent;
	                        var event = new Event(type, target, transition);
	
	                        // pre-bind handlers, scopes and params
	                        // this way scope and params don't need to be passed around
	                        // and the call from Transition is always just `value = handler()`
	                        return function () {
	                            return handler.apply(scope, [event, fsm].concat(params));
	                        };
	                    });
	
	                    // add to queue
	                    queue = queue.concat(handlers);
	                })();
	            }
	        });
	
	        // return
	        transition.handlers = queue;
	        return transition;
	    },
	
	    force: function force(fsm, state) {
	        var transition = new Transition(fsm, '', fsm.state, state);
	        transition.paused = fsm.transition ? fsm.transition.paused : false;
	        return transition;
	    }
	
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = Config;
	function Config(options) {
	    var _this = this;
	
	    'initial final start debug scope transitions'.match(/\w+/g).map(function (name) {
	        if (options.hasOwnProperty(name)) {
	            _this[name] = options[name];
	        }
	    });
	
	    // order
	    this.order = options.order || this.getDefaultOrder();
	
	    // defaults
	    this.defaults = Object.assign({
	
	        // allow user to specify a custom initialize event name
	        initialize: 'initialize',
	
	        // allow user to specify alternate triggers for event and action ids
	        action: 'start',
	        state: 'enter'
	
	    }, options.defaults);
	}
	
	Config.prototype = {
	    /** @var string */
	    initial: '',
	
	    /** @var string */
	    final: '',
	
	    /** @var boolean */
	    start: true,
	
	    /** @var boolean */
	    debug: false,
	
	    /** @var object */
	    scope: null,
	
	    /** @var *[] */
	    transitions: null,
	
	    /**
	     * The order to run transition callbacks in
	     *
	     * @type {string[]} type.target
	     */
	    order: null,
	
	    /**
	     * Sets defaults for various declarations
	     *
	     * @type {Object}
	     */
	    defaults: null,
	
	    getDefaultOrder: function getDefaultOrder() {
	        return ['action.*.start', 'action.{action}.start', 'state.*.{action}', 'state.{from}.{action}', 'state.{from}.leave', 'state.*.leave', 'state.*.enter', 'state.{to}.enter', 'action.{action}.end', 'action.*.end'];
	    }
	
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=StateMachine.js.map