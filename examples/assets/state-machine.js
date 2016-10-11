(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("StateMachine", [], factory);
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
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	exports.default = StateMachine;
	
	var _ValueMap = __webpack_require__(1);
	
	var _ValueMap2 = _interopRequireDefault(_ValueMap);
	
	var _Transition = __webpack_require__(3);
	
	var _Transition2 = _interopRequireDefault(_Transition);
	
	var _Events = __webpack_require__(4);
	
	var _utils = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function StateMachine(target, config) {
	    this.target = target;
	    this.state = '';
	    this.states = [];
	    this.transitions = new _ValueMap2.default();
	    this.actions = new _ValueMap2.default();
	    this.handlers = new _ValueMap2.default();
	    if (config) {
	        this.initialize(config);
	        this.update('started');
	    }
	    console.log('hello there');
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
	     * Available state names
	     *
	     * - [
	     *     intro,
	     *     settings,
	     *     summary,
	     *     final
	     *   ]
	     *
	     * @var {string[]}
	     */
	    states: null,
	
	    /**
	     * Available transitions for each action
	     *
	     * action.from => to
	     *
	     * - next: {
	     *     intro: settings,
	     *     settings: summary
	     *   },
	     * - back: {
	     *     settings: intro
	     *   },
	     * - restart: {
	     *     summary:intro
	     *   },
	     * - finish: {
	     *     summary:final
	     *   },
	     *
	     * Transitions can also be functions
	     *
	     * - next: {
	     *     intro: function() { return '<random state>' } // jump to a random state
	     *   }
	     *
	     * @var {ValueMap}
	     */
	    transitions: null,
	
	    /**
	     * Actions that are available to be called from each state
	     *
	     * state => [ action, action, ... ]
	     *
	     * - intro: [
	     *     'next'
	     *   ],
	     * - settings: [
	     *     'next',
	     *     'back'
	     *   ],
	     * - summary: [
	     *     'restart'
	     *     'finish',
	     *   ]
	     *
	     * Actions can also be expressed as wildcards
	     *
	     * - intro: [
	     *     '*' // any action is allowed from intro
	     *   ]
	     *
	     * @var {ValueMap}
	     */
	    actions: null,
	
	    /**
	     * Handler functions that should be called on each action event / state change
	     *
	     * name.type => [ handler, handler, ... ]
	     *
	     * - next: {
	     *   - start: [
	     *       hideModal
	     *     ],
	     *   - end: [
	     *       showModal
	     *     ]
	     *   },
	     * - summary: {
	     *   - enter: [
	     *       resetForm
	     *     ],
	     *   - leave: [
	     *       validateForm,
	     *       postData,
	     *     ]
	     *   },
	     *   ...
	     *
	     * @var {ValueMap}
	     */
	    handlers: null,
	
	    /**
	     * The current state
	     *
	     * @var {string}
	     */
	    state: '',
	
	    /**
	     * Any active Transition object that is driving the state change
	     *
	     * @var {Transition}
	     */
	    transition: null,
	
	    /**
	     * The target context in which to call all handlers
	     *
	     * @var {*}
	     */
	    target: null,
	
	    /**
	     * The original config object
	     *
	     * @var {Object}
	     */
	    config: null,
	
	    // ------------------------------------------------------------------------------------------------
	    // private methods
	
	    /**
	     * Initialize the FSM with a config object
	     *
	     * @private
	     * @param config
	     */
	    initialize: function initialize(config) {
	        var _this = this;
	
	        // assign config
	        this.config = config;
	
	        // parse all states
	        addStates(this, 'from', config.events);
	        addStates(this, 'to', config.events);
	
	        // initial state
	        if (!config.initial) {
	            config.initial = this.states[0];
	        }
	
	        // add transitions
	        config.events.map(function (event) {
	            // shorthand
	            if ((0, _utils.isString)(event)) {
	                var _matches = event.match(/(\w+)\s*[\|:=]\s*(\w+)\s*([<>-])\s*(\w.*)/);
	
	                var _matches2 = _slicedToArray(_matches, 5);
	
	                var name = _matches2[1];
	                var from = _matches2[2];
	                var op = _matches2[3];
	                var to = _matches2[4];
	
	                if (op === '-') {
	                    _this.add(name, from, to);
	                    _this.add(name, to, from);
	                    return;
	                }
	                if (op === '<') {
	                    var _ref = [to, from];
	                    from = _ref[0];
	                    to = _ref[1];
	                }
	                _this.add(name, from, to);
	            }
	
	            // keys
	            else {
	                    _this.add(event.name, event.from, event.to);
	                }
	        });
	
	        // add handlers
	        for (var name in config.handlers) {
	            if (config.handlers.hasOwnProperty(name)) {
	                var handler = config.handlers[name];
	                var matches = name.match(/(\w+)\s*(.*)/);
	                if (matches) {
	                    var _matches3 = _slicedToArray(matches, 3);
	
	                    var type = _matches3[1];
	                    var param = _matches3[2];
	
	                    switch (type) {
	                        case 'start':
	                            this.onStart(param, handler);break;
	                        case 'end':
	                            this.onEnd(param, handler);break;
	                        case 'leave':
	                            this.onLeave(param, handler);break;
	                        case 'enter':
	                            this.onEnter(param, handler);break;
	                        default:
	                            this.config.debug && console.warn('Warning processing handlers config: unknown action type "' + type + '"');
	                    }
	                } else {
	                    this.config.debug && console.warn('Warning processing handlers config: unable to parse action key "' + name + '"');
	                }
	            }
	        }
	
	        // state
	        if (!config.defer) {
	            this.state = config.initial;
	        }
	    },
	
	    /**
	     * Dispatch an update event
	     *
	     * @param type
	     */
	    update: function update(type) {
	        this.config.debug && console.info('StateMachine update "%s"', type);
	        var handlers = this.handlers.data.change;
	        if (handlers) {
	            (function () {
	                var event = new _Events.ChangeEvent(type);
	                handlers.map(function (fn) {
	                    return fn(event);
	                });
	            })();
	        }
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
	        if (this.can(action)) {
	            this.config.debug && console.info('Doing action "%s"', action);
	
	            for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	                rest[_key - 1] = arguments[_key];
	            }
	
	            this.transition = _Transition2.default.create(this, action, rest);
	            this.update('transitioning');
	            this.transition.exec();
	            return true;
	        }
	        return false;
	    },
	
	    /**
	     * Attempt to go to a state
	     *
	     * Finds if an appropriate transition exists, then calls the related action if it does
	     *
	     * @param   {string}    state
	     * @returns {boolean}
	     */
	    go: function go(state) {
	        if (this.has(state)) {
	            var action = this.getActionForState(state);
	            if (action) {
	                return this.do(action);
	            }
	            this.config.debug && console.info('No transition exists from "%s" to "%s"', this.state, state);
	        } else {
	            this.config.debug && console.warn('No such state "%s"', state);
	        }
	        return false;
	    },
	
	    /**
	     * Query a transition to see if a named action is available
	     *
	     * @param   {string}    action
	     * @returns {boolean}
	     */
	    can: function can(action) {
	        if (!this.actions.has(action)) {
	            this.config.debug && console.warn('No such action "%s"', action);
	        }
	        return !!this.transitions.has(this.state, action);
	    },
	
	    /**
	     * Query a transition to see if a named action is unavailable
	     *
	     * @param   {string}    action
	     * @returns {boolean}
	     */
	    cannot: function cannot(action) {
	        return !this.can(action);
	    },
	
	    /**
	     * Test if the current state is the same as the supplied one
	     *
	     * @param   {string}    state       A state name to compare against the current state
	     * @returns {boolean}
	     */
	    is: function is(state) {
	        if (this.states.indexOf(state) === -1) {
	            this.config.debug && console.warn('No such state "%s"', state);
	        }
	        return state === this.state;
	    },
	
	    /**
	     * Test if a state exists
	     *
	     * @param   {string}    state
	     * @return  {boolean}
	     */
	    has: function has(state) {
	        return this.states.indexOf(state) !== -1;
	    },
	
	    /**
	     * Get the available "to" states for the current or supplied state
	     *
	     * @param   {string}    [state]     Optional name of a state to get states for. Defaults to the current state
	     * @returns {string[]}              An array of string states
	     */
	    getStatesFor: function getStatesFor() {
	        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	
	        state = state || this.state;
	        var actions = this.getActionsFor(state, true);
	        return Object.keys(actions).map(function (name) {
	            return actions[name];
	        });
	    },
	
	    /**
	     * Get the available actions (or actions and states) for the current or supplied state
	     *
	     * @param   {string}    [state]     Optional name of a state to get actions for. Defaults to the current state
	     * @param   {boolean}   [asMap]     Optional boolean to return a Object of action:state properties. Defaults to false
	     * @returns {string[]|Object}       An array of string actions, or a hash of action:states
	     */
	    getActionsFor: function getActionsFor() {
	        var _this2 = this;
	
	        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	        var asMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	
	        state = state || this.state;
	        var actions = this.transitions.get(state || this.state);
	        if (asMap) {
	            var _ret2 = function () {
	                var states = {};
	                actions.map(function (action) {
	                    states[action] = _this2.actions.get(action + '.' + state);
	                });
	                return {
	                    v: states
	                };
	            }();
	
	            if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
	        } else {
	            return actions;
	        }
	    },
	
	    getActionForState: function getActionForState(state) {
	        if (this.has(state)) {
	            var actions = this.getActionsFor(null, true);
	            for (var action in actions) {
	                if (actions[action] === state) {
	                    return action;
	                }
	            }
	        }
	        return null;
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
	     * Test if the FSM is on the "final" state
	     *
	     * @returns {boolean}
	     */
	    isFinished: function isFinished() {
	        return this.state === this.config.final;
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
	
	    // ------------------------------------------------------------------------------------------------
	    // transitions
	
	    /**
	     * Pause any current transition
	     *
	     * @returns {StateMachine}
	     */
	    pause: function pause() {
	        if (this.transition) {
	            this.transition.pause();
	            this.update('paused');
	        }
	        return this;
	    },
	
	    /**
	     * Resume any current transition
	     *
	     * @returns {StateMachine}
	     */
	    resume: function resume() {
	        if (this.transition) {
	            this.update('resumed');
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
	            this.state = this.transition.from;
	            this.transition.clear();
	            delete this.transition;
	            this.update('cancelled');
	        }
	        return this;
	    },
	
	    /**
	     * Complete any current transition, skipping remaining handlers
	     *
	     * @returns {StateMachine}
	     */
	    complete: function complete() {
	        if (this.transition) {
	            this.state = this.transition.to;
	            this.transition.clear();
	            delete this.transition;
	            this.update('transitioned');
	            if (this.isFinished()) {
	                this.update('finished');
	            }
	        }
	        return this;
	    },
	
	    /**
	     * Reset the FSM to the initial, or supplied, state
	     *
	     * @returns {StateMachine}
	     */
	    reset: function reset(initial) {
	        this.state = initial || this.config.initial;
	        if (this.transition) {
	            this.transition.clear();
	            delete this.transition;
	        }
	        this.update('reset');
	        return this;
	    },
	
	    // ------------------------------------------------------------------------------------------------
	    // actions
	
	    /**
	     * Add a transition event
	     *
	     * @param   {string}    action
	     * @param   {string}    from
	     * @param   {string}    to
	     * @return  {StateMachine}
	     */
	    add: function add(action, from, to) {
	        this.actions.set(action + '.' + from, to);
	        this.transitions.add(from, action);
	        return this;
	    },
	
	    remove: function remove(action, from, to) {
	        this.states.remove(action, from);
	    },
	
	    // ------------------------------------------------------------------------------------------------
	    // handlers
	
	    onChange: function onChange(fn) {
	        this.handlers.add('change', fn);
	        return this;
	    },
	
	    onStart: function onStart(action, fn) {
	        addHandler(this, 'action', 'start', action, fn);
	        return this;
	    },
	
	    onEnd: function onEnd(action, fn) {
	        addHandler(this, 'action', 'end', action, fn);
	        return this;
	    },
	
	    onEnter: function onEnter(state, fn) {
	        addHandler(this, 'state', 'enter', state, fn);
	        return this;
	    },
	
	    onLeave: function onLeave(state, fn) {
	        addHandler(this, 'state', 'leave', state, fn);
	        return this;
	    },
	
	    off: function off(type, target, fn) {
	        return this;
	    }
	
	};
	
	/**
	 * Parses config and adds unique state names to states array
	 *
	 * @param {StateMachine}    fsm
	 * @param {string}          key
	 * @param {Object[]}        transitions
	 */
	function addStates(fsm, key, transitions) {
	    transitions.map(function (event) {
	        return addState(fsm, event[key]);
	    });
	}
	
	function addState(fsm, state) {
	    if ((0, _utils.isString)(state) && fsm.states.indexOf(state) === -1) {
	        fsm.states.push(state);
	    }
	}
	
	/**
	 * Generic function to parse action and add callback
	 *
	 * @param {StateMachine}    fsm
	 * @param {string}          type
	 * @param {string}          verb
	 * @param {string|Function} rest
	 */
	function addHandler(fsm, type, verb) {
	    for (var _len2 = arguments.length, rest = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
	        rest[_key2 - 3] = arguments[_key2];
	    }
	
	    // params
	    if (rest.length === 1) {
	        rest = ['*', rest[0]];
	    }
	    var _rest = rest;
	
	    var _rest2 = _slicedToArray(_rest, 2);
	
	    var param = _rest2[0];
	    var fn = _rest2[1];
	
	    // parse states
	
	    var states = (0, _utils.isArray)(param) ? param : param == '' ? ['*'] : param.match(/\*|\w+[-\w]+/g);
	
	    // assign handlers
	    states.map(function (subject) {
	        // warn for invalid actions / states
	        if (subject !== '*') {
	            if (type === 'state' && fsm.states.indexOf(subject) === -1) {
	                fsm.config.debug && console.warn('Warning assigning state.%s handler: no such state "%s"', verb, subject);
	            } else if (type === 'action' && !fsm.transitions.has(subject)) {
	                fsm.config.debug && console.warn('Warning assigning action.%s handler: no such action "%s"', verb, subject);
	            }
	        }
	
	        // check handler is a function
	        if (!(0, _utils.isFunction)(fn)) {
	            throw new Error('Error assigning ' + verb + '.' + subject + ' handler; callback is not a Function', fn);
	        }
	
	        // assign
	        fsm.handlers.insert([type, subject, verb].join('.'), fn);
	    });
	}
	
	/*
	// event libs
	https://www.npmjs.com/package/event-box
	https://www.npmjs.com/package/dispatchy
	*/

/***/ },
/* 1 */
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
	        parent = parent[key];
	        var index = parent.indexOf(value);
	        if (index > -1) {
	            parent.splice(index, 1);
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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _Events = __webpack_require__(4);
	
	var _Events2 = _interopRequireDefault(_Events);
	
	var _utils = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Transition class
	 *
	 * Responsible for managing events in the flow from state to state.
	 *
	 * The default dispatch order for all transitions is:
	 *
	 * - '*.start'
	 * - ':action.start'
	 * - ':state.leave'
	 * - '*.leave'
	 * - '*.enter'
	 * - ':state.enter'
	 * - ':action.end'
	 * - '*.end'
	 *
	 * This can be changed by calling Transition.setOrder( ... )
	 *
	 * Event handlers will receive an Event object, along with any passed parameters (from do()) as ...rest parameters.
	 *
	 * From a callback, you can:
	 *
	 * - return false to cancel the transition
	 * - return true to pause the transition
	 * - not return a value (the transition continues)
	 *
	 * All transitions can be paused, resumed, cancelled or completed by calling
	 * the appropriate method on, or from:
	 *
	 * - the event
	 * - the transition
	 * - the state machine
	 *
	 * Cancelled transitions will reset teh FSM to the previous "from" state, and completed transitions will advance
	 * the FSM to the passed "to" state.
	 *
	 * When the last callback has fired, the main FSM's complete() handler will be called and the state will update
	 *
	 * @param {string}          action
	 * @param {string}          from
	 * @param {string}          to
	 * @param {Function[]}      handlers
	 * @param {Object}          callbacks
	 * @constructor
	 */
	function Transition(action, from, to, handlers, callbacks) {
	    this.action = action;
	    this.from = from;
	    this.to = to;
	    this.handlers = handlers;
	    this.callbacks = callbacks;
	}
	
	Transition.prototype = {
	    action: '',
	    from: '',
	    to: '',
	    handlers: null,
	    callbacks: null,
	    paused: false,
	
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
	                    return this.callbacks.cancel();
	                }
	                if (state === true) {
	                    return this.callbacks.pause();
	                }
	                this.exec();
	            } else {
	                this.callbacks.complete();
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
	
	/**
	 *
	 * @type {string[]} subject.verb
	 */
	var defaultOrder = ['*.start', 'action.start', 'from.leave', '*.leave', '*.enter', 'to.enter', 'action.end', '*.end'];
	
	Transition.order = defaultOrder;
	
	exports.default = {
	    /**
	     * Create the Transition object
	     *
	     * - Set up variables, callbacks and queue
	     * - Determine paths to relevant callbacks
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
	        // transition
	        var from = fsm.state;
	        var to = fsm.actions.get(action)[from];
	        var target = fsm.target;
	
	        // handle to being a function
	        if ((0, _utils.isFunction)(to)) {
	            var actions = fsm.getActionsFor();
	            var state = to.apply(target, [actions].concat(params));
	            var _action = fsm.getActionsFor(state);
	            // TODO debug this! It's wrong
	            if (!_action) {
	                throw new Error('Cannot go to state "' + state + '" from current state "' + from + '"');
	            }
	        }
	
	        // callbacks
	        var callbacks = {
	            cancel: fsm.cancel.bind(fsm),
	            pause: fsm.pause.bind(fsm),
	            resume: fsm.resume.bind(fsm),
	            complete: fsm.complete.bind(fsm)
	        };
	
	        // build handlers array
	        var queue = [];
	        Transition.order.map(function (token) {
	            // determine path variables
	            var _token$split = token.split('.');
	
	            var _token$split2 = _slicedToArray(_token$split, 2);
	
	            var subject = _token$split2[0];
	            var verb = _token$split2[1]; // i.e. *.start, to.enter, action.end
	
	            var type = /^(start|end)$/.test(verb) ? 'action' : 'state';
	            var name = void 0;
	            if (subject === '*') {
	                name = '*';
	            } else if (type == 'action') {
	                name = action;
	            } else {
	                name = verb === 'leave' ? from : to;
	            }
	
	            // get handlers
	            var path = [type, name, verb].join('.');
	            var handlers = fsm.handlers.get(path);
	            if (handlers) {
	                // bind handlers, targets and params ready for dispatch
	                handlers = handlers.map(function (handler) {
	                    return function () {
	                        var event = _Events2.default.create(type, callbacks, name, verb, from, to);
	                        handler.apply(target, [event].concat(params));
	                    };
	                });
	
	                // add to queue
	                queue = queue.concat(handlers);
	            }
	        });
	
	        // create
	        return new Transition(action, from, to, queue, callbacks);
	    },
	
	    /**
	     * Set the default sort order for transitions
	     *
	     * @param {Array} order
	     */
	    setOrder: function setOrder(order) {
	        Transition.order = order || defaultOrder;
	    },
	
	    /**
	     * Get the current sot order for the transitions
	     *
	     * @returns {string[]}
	     */
	    getOrder: function getOrder() {
	        return Transition.order;
	    }
	
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ActionEvent = ActionEvent;
	exports.StateEvent = StateEvent;
	exports.ChangeEvent = ChangeEvent;
	function noop() {}
	
	/**
	 * @prop {string}  type     The Event type; i.e. state or action
	 * @prop {string}  name     The Event subject/name; i.e. intro (state) or next (action)
	 * @prop {string}  verb     The Event verb; i.e. leave/enter (state) or start/end (action)
	 * @prop {string}  from     The from state
	 * @prop {string}  to       The to state
	 */
	var event = {
	    type: null,
	    name: null,
	    verb: null,
	    from: null,
	    to: null,
	
	    pause: noop,
	    resume: noop,
	    cancel: noop
	};
	
	function initialize(event, callbacks, type, name, verb, from, to) {
	    event.type = type;
	    event.name = name;
	    event.verb = verb;
	    event.from = from;
	    event.to = to;
	
	    event.pause = callbacks.pause;
	    event.resume = callbacks.resume;
	    event.cancel = callbacks.cancel;
	    event.complete = callbacks.complete;
	}
	
	function ActionEvent(callbacks, name, verb, from, to) {
	    initialize(this, callbacks, 'action', name, verb, from, to);
	}
	ActionEvent.prototype = event;
	
	function StateEvent(callbacks, name, verb, from, to) {
	    initialize(this, callbacks, 'state', name, verb, from, to);
	}
	StateEvent.prototype = event;
	
	function ChangeEvent(type) {
	    this.type = type;
	}
	
	ChangeEvent.prototype = {
	    type: ''
	};
	
	exports.default = {
	    create: function create(type, callbacks, name, verb, from, to) {
	        var fn = type == 'state' ? StateEvent : ActionEvent;
	        return new fn(callbacks, name, verb, from, to);
	    }
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=state-machine.js.map