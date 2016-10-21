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
	
	function StateMachine(scope, config) {
	    this.scope = scope;
	    this.state = '';
	    this.states = [];
	    this.transitions = new _ValueMap2.default();
	    this.actions = new _ValueMap2.default();
	    this.handlers = new _ValueMap2.default();
	    if (config) {
	        this.initialize(config);
	    }
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
	     * The scope in which to call all handlers
	     *
	     * @var {*}
	     */
	    scope: null,
	
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
	
	        // pre-collate all states
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
	                var matches = event.match(/(\w+)\s*[\|:=]\s*(\w+)\s*([<>-])\s*(\w.*)/);
	
	                var _matches = _slicedToArray(matches, 5);
	
	                var name = _matches[1];
	                var from = _matches[2];
	                var op = _matches[3];
	                var to = _matches[4];
	
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
	                this.on(name, config.handlers[name]);
	            }
	        }
	
	        // state
	        if (!config.defer) {
	            this.state = config.initial;
	        }
	
	        /**
	         * Sets the default order to run transition callbacks in
	         *
	         * @type {string[]} type.target
	         */
	        config.order = config.order || ['action.*.start', 'action.@action.start', 'state.@from.@action', 'state.@from.leave', 'state.*.leave', 'state.*.enter', 'state.@to.enter', 'action.@action.end', 'action.*.end'];
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
	        var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
	        var value = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
	
	        var signature = namespace + '.' + type;
	        var event = namespace === 'system' ? new _Events.SystemEvent(type, key, value) : new _Events.TransitionEvent(type);
	        this.dispatch(signature, event);
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
	        if (this.can(action) && !this.isPaused()) {
	            for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	                rest[_key - 1] = arguments[_key];
	            }
	
	            this.transition = _Transition2.default.create(this, action, rest);
	            if (action === 'start') {
	                this.update('system', 'start');
	            }
	            this.update('system', 'update', 'transition', this.transition);
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
	
	        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	        var asMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	
	        state = state || this.state;
	        var actions = this.transitions.get(state || this.state);
	        if (asMap) {
	            var _ret = function () {
	                var states = {};
	                actions.map(function (action) {
	                    states[action] = _this2.actions.get(action + '.' + state);
	                });
	                return {
	                    v: states
	                };
	            }();
	
	            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	        } else {
	            return actions;
	        }
	    },
	
	    getActionForState: function getActionForState(state) {
	        if (this.has(state)) {
	            var actions = this.getActionsFor(state, true);
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
	            this.update('transition', 'pause');
	            this.update('system', 'update', 'pause', true);
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
	            this.update('transition', 'resume');
	            this.update('system', 'update', 'pause', false);
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
	            if (this.isPaused()) {
	                this.update('system', 'update', 'pause', false);
	            }
	            this.state = this.transition.from;
	            this.transition.clear();
	            delete this.transition;
	            this.update('transition', 'cancel');
	            this.update('system', 'update', 'transition', null);
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
	            if (this.isPaused()) {
	                this.update('system', 'update', 'pause', false);
	            }
	            this.state = this.transition.to;
	            this.transition.clear();
	            delete this.transition;
	            this.update('system', 'change', 'state', this.state);
	            this.update('system', 'update', 'state', this.state);
	            if (this.isComplete()) {
	                this.update('system', 'complete');
	            }
	            this.update('system', 'update', 'transition', null);
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
	        this.update('system', 'reset');
	        if (this.transition) {
	            if (this.isPaused()) {
	                this.update('system', 'update', 'pause', false);
	            }
	            this.transition.clear();
	            delete this.transition;
	            this.update('transition', 'cancel');
	            this.update('system', 'update', 'transition', null);
	        }
	        if (this.state !== state) {
	            this.state = state;
	            this.update('system', 'change', 'state', this.state);
	            this.update('system', 'update', 'state', this.state);
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
	        this.actions.set(action + '.' + from, to);
	        this.transitions.add(from, action);
	        return this;
	    },
	
	    /**
	     * Remove a transition
	     *
	     * @param   {string}    action
	     * @param   {string}    from
	     * @param   {string}    to
	     * @return  {StateMachine}
	     */
	    remove: function remove(action, from, to) {
	        this.states.remove(action, from);
	        return this;
	    },
	
	    // ------------------------------------------------------------------------------------------------
	    // handlers
	
	    /**
	     * Add an event handler
	     *
	     * Event handler signature:
	     *
	     * - namespace.type:target1 target2 target3 ...
	     *
	     * Valid event namespaces / types:
	     *
	     * - system.(change|update|complete|reset)
	     * - action.(start|end)
	     * - state.(add|remove|leave|enter)
	     * - transition.(pause|resume|cancel)
	     *
	     * As event types are unique, they can be used without the namespace:
	     *
	     * - change
	     * - pause
	     * - start
	     * - end
	     * - leave:red
	     * - enter:blue green
	     * - start:next
	     * - end:back
	     *
	     * You can also just pass action or names to target individual state.leave / action.end events:
	     *
	     * - next
	     * - intro
	     *
	     * Finally, you can target a state with an action:
	     *
	     * - state@action
	     * - intro@next
	     * - form@submit
	     * - form@leave (built-in state/action)
	     *
	     * @param id
	     * @param fn
	     * @return {StateMachine}
	     */
	    on: function on(id, fn) {
	        var _this3 = this;
	
	        var _parseHandler = parseHandler(this, id);
	
	        var _parseHandler2 = _slicedToArray(_parseHandler, 3);
	
	        var namespace = _parseHandler2[0];
	        var type = _parseHandler2[1];
	        var targets = _parseHandler2[2];
	
	        ///console.log(namespace, type, targets)
	
	        targets.map(function (target) {
	            // warn for invalid actions / states
	            if (target !== '*') {
	                if (namespace === 'state') {
	                    if (_this3.states.indexOf(target) === -1) {
	                        _this3.config.debug && console.warn('Warning assigning state.%s handler: no such state "%s"', type, target);
	                    }
	                } else if (namespace === 'action') {
	                    if (!_this3.actions.has(target)) {
	                        _this3.config.debug && console.warn('Warning assigning action.%s handler: no such action "%s"', type, target);
	                    }
	                }
	            }
	
	            // check handler is a function
	            if (!(0, _utils.isFunction)(fn)) {
	                throw new Error('Error assigning ' + namespace + '.' + type + ' handler; callback is not a Function', fn);
	            }
	
	            // assign
	            var path = getPath(namespace, type, target);
	            _this3.handlers.insert(path, fn);
	        });
	
	        return this;
	    },
	
	    off: function off(id, fn) {
	        var _this4 = this;
	
	        var _parseHandler3 = parseHandler(this, id);
	
	        var _parseHandler4 = _slicedToArray(_parseHandler3, 3);
	
	        var namespace = _parseHandler4[0];
	        var type = _parseHandler4[1];
	        var targets = _parseHandler4[2];
	
	        targets.map(function (target) {
	            var path = getPath(namespace, type, target);
	            _this4.handlers.remove(path, fn);
	        });
	    },
	
	    dispatch: function dispatch(path, event) {
	        this.config.debug && console.info('StateMachine dispatch "%s"', path);
	        var handlers = this.handlers.get(path);
	        if (handlers) {
	            // do we need to pass additional arguments?
	            handlers.map(function (fn) {
	                return fn(event);
	            });
	        }
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
	
	function parseHandler(fsm, id) {
	    // variables
	    var matches, namespace, type, action, target, invalid;
	
	    // match state@action
	    if (id.indexOf('@') !== -1) {
	        matches = id.match(/^(?:state\.)?\s*(\w+[ -_\w]*)@(\w+)$/);
	        if (matches) {
	            namespace = 'state';
	            var _matches2 = matches;
	
	            var _matches3 = _slicedToArray(_matches2, 3);
	
	            target = _matches3[1];
	            action = _matches3[2];
	
	            type = action;
	        }
	    }
	    // matches other
	    else {
	            matches = id.match(/^(?:(\w+)\.)?(\w+[-_\w]*)(?::(.*))?(.*)$/);
	            if (matches) {
	                var _matches4 = matches;
	
	                var _matches5 = _slicedToArray(_matches4, 5);
	
	                namespace = _matches5[1];
	                type = _matches5[2];
	                target = _matches5[3];
	                invalid = _matches5[4];
	            }
	        }
	
	    // flag invalid
	    if (!matches || invalid) {
	        throw new Error('Invalid event handler signature "' + id + '"');
	    }
	
	    // check namespace
	    if (namespace && !/^(system|transition|action|state)$/.test(namespace)) {
	        throw new Error('Invalid event namespace "' + namespace + '"');
	    }
	
	    // determine namespace if not found
	    if (!namespace) {
	        // check if shorthand global was passed
	        namespace = eventNamespaces[type];
	
	        // if event is still null, attempt to determine type from existing states or actions
	        if (!namespace) {
	            if (fsm.states.indexOf(type) !== -1) {
	                target = type;
	                namespace = 'state';
	                type = 'enter';
	            } else if (fsm.actions.has(type)) {
	                target = type;
	                namespace = 'action';
	                type = 'start';
	            } else {
	                fsm.config.debug && console.warn('Warning parsing event handler: unable to map "%s" to a valid event or existing entity', id);
	            }
	        }
	    }
	
	    // determine targets
	    var targets = target ? target.match(/[-*\w_]+/g) : ['*'];
	
	    // return
	    return [namespace, type, targets];
	}
	
	function getPath(namespace, type, target) {
	    return namespace === 'action' || namespace === 'state' ? [namespace, target, type].join('.') : namespace + '.' + type;
	}
	
	var eventNamespaces = {
	    change: 'system',
	    update: 'system',
	    complete: 'system',
	    reset: 'system',
	
	    add: 'state',
	    remove: 'state',
	    leave: 'state',
	    enter: 'state',
	
	    start: 'action',
	    end: 'action',
	
	    pause: 'transition',
	    resume: 'transition',
	    cancel: 'transition'
	};

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
	 * Transitions can also be paused, resumed, or cancelled by calling
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
	 * @param {string}          action
	 * @param {string}          from
	 * @param {string}          to
	 * @param {Function[]}      handlers
	 * @param {Object}          callbacks
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
	                this.callbacks.end();
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
	        var queue = [];
	        var scope = fsm.scope;
	        var from = fsm.state;
	        var to = fsm.actions.get(action)[from];
	        var vars = { action: action, to: to, from: from };
	        var callbacks = {
	            cancel: fsm.cancel.bind(fsm),
	            pause: fsm.pause.bind(fsm),
	            resume: fsm.resume.bind(fsm),
	            end: fsm.end.bind(fsm)
	        };
	
	        // handle "to" being a function
	        if ((0, _utils.isFunction)(to)) {
	            to = to.apply(scope, params);
	            if (fsm.states.indexOf(to) === -1) {
	                throw new Error('Invalid "to" state "' + to + '"');
	            }
	        }
	
	        // build handlers array
	        fsm.config.order.map(function (path) {
	            // replace path tokens
	            path = path.replace(/@(\w+)/g, function (all, token) {
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
	                        // pre-bind handlers, scopes and params;
	                        // this way scope and params don't need to be passed around
	                        return function () {
	                            var event = _Events2.default.create(namespace, type, target, from, to, callbacks);
	                            return handler.apply(scope, [event].concat(params));
	                        };
	                    });
	
	                    // add to queue
	                    queue = queue.concat(handlers);
	                })();
	            }
	        });
	
	        // create
	        return new Transition(action, from, to, queue, callbacks);
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
	exports.SystemEvent = SystemEvent;
	exports.TransitionEvent = TransitionEvent;
	// ------------------------------------------------------------------------------------------------
	// setup
	
	function noop() {}
	
	/**
	 * @prop {string}  namespace  The Event namespace; i.e. state or action
	 * @prop {string}  type       The Event type;      i.e. leave/enter (state) or start/end (action)
	 * @prop {string}  target     The Event target;    i.e. intro (state), next (action), or * (all states or types)
	 * @prop {string}  from       The from state
	 * @prop {string}  to         The to state
	 */
	var event = {
	    // properties
	    namespace: null,
	    type: null,
	    target: null,
	    from: null,
	    to: null,
	
	    // transition callbacks
	    pause: noop,
	    resume: noop,
	    cancel: noop,
	    complete: noop
	};
	
	function initialize(event, namespace, type, target, from, to, callbacks) {
	    event.namespace = namespace;
	    event.type = type;
	    event.target = target;
	    event.from = from;
	    event.to = to;
	
	    event.pause = callbacks.pause;
	    event.resume = callbacks.resume;
	    event.cancel = callbacks.cancel;
	    event.complete = callbacks.complete;
	}
	
	exports.default = {
	    create: function create(namespace, type, target, from, to, callbacks) {
	        var fn = namespace == 'state' ? StateEvent : ActionEvent;
	        return new fn(type, target, from, to, callbacks);
	    }
	};
	
	// ------------------------------------------------------------------------------------------------
	// ActionEvent
	
	function ActionEvent(type, target, from, to, callbacks) {
	    initialize(this, 'action', type, target, from, to, callbacks);
	}
	ActionEvent.prototype = event;
	
	// ------------------------------------------------------------------------------------------------
	// StateEvent
	
	function StateEvent(type, target, from, to, callbacks) {
	    initialize(this, 'state', type, target, from, to, callbacks);
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

/***/ }
/******/ ])
});
;
//# sourceMappingURL=state-machine.js.map