(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _Config = __webpack_require__(6);

var _Config2 = _interopRequireDefault(_Config);

var _HandlerMap = __webpack_require__(7);

var _HandlerMap2 = _interopRequireDefault(_HandlerMap);

var _TransitionMap = __webpack_require__(13);

var _TransitionMap2 = _interopRequireDefault(_TransitionMap);

var _Transition = __webpack_require__(16);

var _Transition2 = _interopRequireDefault(_Transition);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * StateMachine constructor
 *
 * @param   {Object|null}    options
 * @constructor
 */
function StateMachine(options) {
    this.transitions = new _TransitionMap2.default();
    this.handlers = new _HandlerMap2.default(this);
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
    // -----------------------------------------------------------------------------------------------------------------
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

    // -----------------------------------------------------------------------------------------------------------------
    // private methods

    /**
     * Initialize the FSM with options
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
            options.transitions.forEach(function (tx) {
                transitions = transitions.concat(_this.transitions.parse(tx));
            });
        }

        // add transitions
        transitions.forEach(function (transition) {
            _this.transitions.add(transition.action, transition.from, transition.to);
        });

        // get initial state (must be done after state collation)
        if (!config.initial) {
            config.initial = this.transitions.getStates()[0];
        }

        // add handlers
        if (options.handlers) {
            for (var _name in options.handlers) {
                if (options.handlers.hasOwnProperty(_name)) {
                    this.on(_name, options.handlers[_name]);
                }
            }
        }

        // add methods
        if (options.methods) {
            if (!this.config.scope) {
                this.config.scope = this;
            }
            for (var name in options.methods) {
                if (options.methods.hasOwnProperty(name) && !this.hasOwnProperty(name)) {
                    this[name] = options.methods[name];
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
        this.handlers.trigger('system.start');
        if (this.state) {
            this.handlers.trigger('system.change', this.state);
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
        this.handlers.trigger('system.reset');
        if (this.transition) {
            this.transition.cancel();
            delete this.transition;
        }
        if (this.state !== state) {
            this.state = state;
            this.handlers.trigger('system.change', this.state);
        }
        return this;
    },

    // -----------------------------------------------------------------------------------------------------------------
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
                if (this.transition) {
                    this.transition.clear();
                }
                this.transition = _Transition2.default.force(this, state);
                return this.end();
            }
            var action = this.transitions.getActionFor(this.state, state);
            if (action) {
                return this.do(action);
            }
            this.config.errors > 0 && console.warn('No transition exists from "%s" to "%s"', this.state, state);
            return false;
        }
        this.config.errors > 0 && console.warn('No such state "%s"', state);
        return false;
    },

    /**
     * Query transition map to see if a named action is available
     *
     * @param   {string}        action
     * @returns {boolean}
     */
    canDo: function canDo(action) {
        return this.transitions.getActionsFrom(this.state).indexOf(action) !== -1;
    },

    /**
     * Query transition map to see if a state is available to go to
     *
     * @param to
     * @return {boolean}
     */
    canGo: function canGo(to) {
        return this.transitions.getActionFor(this.state, to) !== null;
    },

    /**
     * Test if a state exists
     *
     * @param   {string}    state
     * @return  {boolean}
     */
    has: function has(state) {
        return this.transitions.hasState(state);
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

    // -----------------------------------------------------------------------------------------------------------------
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

    // -----------------------------------------------------------------------------------------------------------------
    // transitions

    /**
     * Pause any current transition
     *
     * @returns {StateMachine}
     */
    pause: function pause() {
        if (this.transition && !this.isPaused()) {
            this.transition.pause();
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
            this.transition.cancel();
            delete this.transition;
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
            this.state = this.transition.to;
            this.transition.clear();
            delete this.transition;
            this.handlers.trigger('system.change', this.state);
            if (this.isComplete()) {
                this.handlers.trigger('system.complete');
            }
        }
        return this;
    },

    // -----------------------------------------------------------------------------------------------------------------
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
            var transitions = this.transitions.parse(action);
            transitions.forEach(function (tx) {
                return _this2.add(tx.action, tx.from, tx.to);
            });
            return this;
        }

        // 3 arguments: longhand transition
        updateTransitions(this, 'add', function () {
            return _this2.transitions.add(action, from, to);
        });
        return this;
    },

    /**
     * Remove a state
     *
     * @param   {string}    state
     * @return  {StateMachine}
     */
    remove: function remove(state) {
        var _this3 = this;

        this.handlers.remove('state.' + state);
        updateTransitions(this, 'remove', function () {
            return _this3.transitions.remove(state);
        });
        return this;
    },

    // -----------------------------------------------------------------------------------------------------------------
    // handlers

    /**
     * Add an event handler
     *
     * Event handler signatures are built from the following grammar:
     *
     * - token      foo
     * - property   .foo
     * - event      :foo
     * - action     @foo
     * - targets    (foo bar baz)
     *
     * For example:
     *
     * - change
     * - transition.pause
     * - next:end
     * - (a b)@next
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
        var _this4 = this;

        this.parse(id, this.config.invalid, this.config.errors).forEach(function (meta) {
            return _this4.handlers.add(meta.path, fn);
        });
        return this;
    },

    off: function off(id, fn) {
        var _this5 = this;

        this.parse(id, this.config.invalid, this.config.errors).forEach(function (meta) {
            return _this5.handlers.remove(meta.path, fn);
        });
        return this;
    },

    // -----------------------------------------------------------------------------------------------------------------
    // utilities

    /**
     * Parses a handler id string into HandlerMeta objects
     *
     * @param   {string}    id
     * @param   {boolean}   invalid
     * @param   {number}    errors
     * @returns {HandlerMeta[]}
     */
    parse: function parse(id) {
        var _this6 = this;

        var invalid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var errors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        return this.handlers.parse(id).filter(function (result) {
            // picks up unrecognised handlers, namespaces, etc
            if (result instanceof Error) {
                if (errors == 2) {
                    throw result;
                }
                errors == 1 && console.warn(result.message);
                return false;
            }

            // picks up unrecognised states and actions
            if (result.target !== '*') {
                var error = '';

                if (result.namespace === 'state') {
                    if (!_this6.transitions.hasState(result.target)) {
                        error = 'Unrecognised state "' + result.target + '" in handler "' + result.id + '"';
                    }
                } else if (result.namespace === 'action') {
                    if (!_this6.transitions.hasAction(result.target)) {
                        error = 'Unrecognised action "' + result.target + '" in handler "' + result.id + '"';
                    }
                } else if (result.namespace === 'state/action') {
                    // variables
                    var _result$target$split = result.target.split('@'),
                        _result$target$split2 = _slicedToArray(_result$target$split, 2),
                        state = _result$target$split2[0],
                        action = _result$target$split2[1];

                    // test for state and action


                    if (!_this6.transitions.hasState(state)) {
                        error = 'Unrecognised state "' + state + '" in handler "' + result.id + '"';
                    }
                    if (!_this6.transitions.hasAction(action)) {
                        error = 'Unrecognised action "' + action + '" in handler "' + result.id + '"';
                    }
                }

                // if we have an error, the result was not an existing state or action
                if (error) {
                    if (errors == 2) {
                        throw new Error(error);
                    }
                    errors == 1 && console.warn(error);
                    return !!invalid;
                }
            }

            // must be valid
            return true;
        });
    },

    trigger: function trigger(id) {
        var _this7 = this;

        for (var _len2 = arguments.length, rest = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            rest[_key2 - 1] = arguments[_key2];
        }

        this.handlers.parse(id).forEach(function (meta) {
            return _this7.handlers.trigger.apply(_this7.handlers, [meta.path].concat(rest));
        });
        return this;
    }

};

StateMachine.prototype.constructor = StateMachine;

exports.default = StateMachine;

// ---------------------------------------------------------------------------------------------------------------------
// static methods

/**
 * Factory method
 *
 * @param   options
 * @returns {StateMachine}
 */

StateMachine.create = function (options) {
    return new StateMachine(options);
};

/**
 * Gets the default order events should be called in
 * @returns {string[]}
 */
StateMachine.getDefaultOrder = function () {
    return ['action.*.start', 'action.{action}.start', 'state.*.{action}', 'state.{from}.{action}', 'state.{from}.leave', 'state.*.leave', 'state.*.enter', 'state.{to}.enter', 'action.{action}.end', 'action.*.end'];
};

// ---------------------------------------------------------------------------------------------------------------------
// helper functions

/**
 * Utility method to update transitions and dispatch events
 *
 * Saves duplicating the following code in both add() and remove() methods
 *
 * @param   {StateMachine}  fsm
 * @param   {string}        method
 * @param   {Function}      callback
 */
function updateTransitions(fsm, method, callback) {
    var statesBefore = fsm.transitions.getStates();
    var actionsBefore = fsm.transitions.getActions();
    callback();
    var statesAfter = fsm.transitions.getStates();
    var actionsAfter = fsm.transitions.getActions();

    // calculate differences
    var states = (0, _utils.diff)(statesBefore, statesAfter);
    var actions = (0, _utils.diff)(actionsBefore, actionsAfter);

    // dispatch events
    states.forEach(function (state) {
        return fsm.handlers.trigger('system.state.' + method, state);
    });
    actions.forEach(function (action) {
        return fsm.handlers.trigger('system.action.' + method, action);
    });
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.values = exports.remove = exports.indexOf = exports.has = exports.get = exports.set = undefined;
exports.default = ValueMap;

var _utils = __webpack_require__(0);

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

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

function SystemEvent(type, value) {
    this.type = type;
    this.value = value;
}

SystemEvent.prototype = {
    namespace: 'system',
    type: '',
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

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ParseError = ParseError;
function ParseError(message, path, id) {
    this.message = message;
    this.path = path;
    this.id = id;
}

ParseError.prototype = Error.prototype;
ParseError.prototype.name = 'ParseError';
ParseError.prototype.constructor = ParseError;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StateHelper = exports.StateMachine = undefined;

var _StateMachine = __webpack_require__(1);

var _StateMachine2 = _interopRequireDefault(_StateMachine);

var _StateHelper = __webpack_require__(17);

var _StateHelper2 = _interopRequireDefault(_StateHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _StateMachine2.default;
exports.StateMachine = _StateMachine2.default;
exports.StateHelper = _StateHelper2.default;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Config;

var _StateMachine = __webpack_require__(1);

var _StateMachine2 = _interopRequireDefault(_StateMachine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Config(options) {
  var _this = this;

  'scope start initial final invalid errors'.match(/\w+/g).forEach(function (name) {
    if (options.hasOwnProperty(name)) {
      _this[name] = options[name];
    }
  });

  // order
  this.order = options.order || _StateMachine2.default.getDefaultOrder();

  // defaults
  this.defaults = Object.assign({

    // allow user to specify alternate triggers for event and action ids
    action: 'start',
    state: 'enter'

  }, options.defaults);
}

Config.prototype = {
  /**
   * An optional scope to run handler functions in
   *
   * @var object
   */
  scope: null,

  /**
   * A boolean to automatically start the state machine in the initial state
   *
   * @var boolean
   */
  start: true,

  /**
   * A string to indicate which state to start on; defaults to ''
   *
   * @var string
   */
  initial: '',

  /**
   * A string indicating the state to trigger a complete event; defaults to ''
   *
   * @var string
   */
  final: '',

  /**
   * A boolean to allow non-existent states and actions to be added to the handlers object; defaults to false (disallow)
   *
   * @var boolean
   */
  invalid: false,

  /**
   * A number indicating how to handle invalid or erroneous actions; defaults to 1 (warn)
   *
   *  - 0 : quiet
   *  - 1 : console.warn()
   *  - 2 : throw an error
   *
   * @var number
   */
  errors: 1,

  /**
   * The order to run transition callbacks in
   *
   * @type {string[]} type.target
   */
  order: null,

  /**
   * Sets defaults for various declarations
   *
   * Available options are:
   *
   * - action: (start|end)
   * - state: (enter|leave)
   *
   * @type {Object}
   */
  defaults: null

};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _ValueMap = __webpack_require__(2);

var _ValueMap2 = _interopRequireDefault(_ValueMap);

var _events = __webpack_require__(3);

var _utils = __webpack_require__(0);

var _HandlerParser = __webpack_require__(8);

var _HandlerParser2 = _interopRequireDefault(_HandlerParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HandlerMap(fsm) {
    this.fsm = fsm;
    this.map = new _ValueMap2.default();
}

HandlerMap.prototype = {

    fsm: null,

    map: null,

    /**
     * Parse event handler grammar into a HandlerMeta structure
     *
     * @param   {string}        id      The handler id to parse, i.e. '@next', 'intro:end', 'change', etc
     * @returns {HandlerMeta[]}
     */
    parse: function parse(id) {
        return (0, _HandlerParser2.default)(id, this.fsm.config.defaults);
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
     * @param   {string}    path    A 'namespace.target.type' parent to a handler removed from
     * @param   {Function}  fn      The instance of the callback function
     * @returns {HandlerMap}
     */
    remove: function remove(path, fn) {
        this.map.remove(path, fn);
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
     * @param   {string}    path
     * @param   {*}         value
     * @returns {StateMachine}
     */
    trigger: function trigger(path) {
        var _this = this;

        var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        // create lookup path
        var _path$match = path.match(/\w+/g),
            _path$match2 = _slicedToArray(_path$match, 3),
            namespace = _path$match2[0],
            type = _path$match2[1],
            method = _path$match2[2];

        // build event


        var event = void 0;
        if (/^system\.(state|action)\./.test(path)) {
            event = type === 'state' ? new _events.StateEvent(method, value) : new _events.ActionEvent(method, value);
        } else {
            event = namespace === 'system' ? new _events.SystemEvent(type, value) : new _events.TransitionEvent(type);
        }

        // dispatch
        var handlers = this.map.get(path);
        if (handlers) {
            handlers.forEach(function (fn) {
                return fn(event, _this.fsm);
            });
        }
    }

};

exports.default = HandlerMap;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = parse;

var _HandlerMeta = __webpack_require__(9);

var _HandlerMeta2 = _interopRequireDefault(_HandlerMeta);

var _Lexer = __webpack_require__(10);

var _Lexer2 = _interopRequireDefault(_Lexer);

var _utils = __webpack_require__(0);

var _errors = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ------------------------------------------------------------------------------------------------
// functions

function isSystem(token) {
    return (/^(start|change|complete|reset)$/.test(token)
    );
}

function isTransition(token) {
    return (/^(pause|resume|cancel)$/.test(token)
    );
}

function expandGroups(input) {
    var rx = /\((.+?)\)/;
    var matches = input.match(rx);
    if (matches) {
        var group = matches[0];
        var items = matches[1].match(/\S+/g);
        if (items) {
            items = items.map(function (item) {
                return input.replace(group, item);
            });
            if (rx.test(items[0])) {
                return items.reduce(function (output, input) {
                    return output.concat(expandGroups(input));
                }, []);
            }
            return items;
        }
    }
    return [input];
}

function addPath(path, namespace, target) {
    results.push(new _HandlerMeta2.default(_id, path, namespace, target));
    return true;
}

function addError(message, path) {
    var error = new _errors.ParseError(message, path, _id);
    results.push(error);
    return false;
}

// ------------------------------------------------------------------------------------------------
// export

/**
 * Parses event handler id into a HandlerMeta results containing handler paths
 *
 * @param   {string}    id          The handler id to parse, i.e. '@next', 'intro:end', 'change', etc
 * @param   {Object}    defaults     A StateMachine instance to test for states and actions
 * @return  {HandlerMeta[]}
 */
function parse(id, defaults) {
    // pre-parse handler
    id = (0, _utils.trim)(id);

    // objects
    _id = id;
    _defaults = defaults;
    results = [];

    // parse
    parser.parse(id, defaults);

    // return
    return results;
}

// ------------------------------------------------------------------------------------------------
// objects

var results = void 0,
    _defaults = void 0,
    _id = void 0;

var patterns = {
    // start pause intro
    alias: /^(\w+)$/,

    // system.start state.add
    namespaced: /^(system|transition|state|action)\.(\w+)$/,

    // @next @quit
    oneAction: /^@(\w+)$/,

    // @next:start @next:end
    oneActionEvent: /^@(\w+):(start|end)$/,

    // :start :end
    anyActionEvent: /^:(start|end)$/,

    // intro form
    oneState: /^#(\w+)$/,

    // intro:enter intro:leave
    oneStateEvent: /^#?(\w+):(leave|enter)$/,

    // :enter :leave
    anyStateEvent: /^:(enter|leave)$/,

    // intro@next
    oneStateAction: /^#?(\w+)@(\w+)$/
};

var lexer = new _Lexer2.default(patterns);

var parser = {
    /**
     * Parses event handler id into HandlerMeta instance
     *
     * Resolving namespace, type and target properties
     *
     * @param   {string}        id
     * @param   {Object}        defaults
     */
    parse: function parse(id, defaults) {
        var _this = this;

        // expand groups
        var paths = expandGroups(id);

        // process paths
        paths.forEach(function (path) {
            return _this.parsePath(path);
        });
    },


    parsePath: function parsePath(path) {
        var tokens = void 0;
        try {
            tokens = lexer.process(path);
        } catch (error) {
            return addError('Unrecognised pattern "' + path + '"', path);
        }

        if (tokens && tokens.length) {
            // variables
            var token = tokens.shift();
            var fn = this[token.type];

            // process
            if (fn) {
                return fn.apply(this, token.values);
            }
            return addError('Unknown token type "' + token.type + '"', path);
        }
    },

    alias: function alias(value) {
        if (isSystem(value)) {
            return addPath('system.' + value, 'system');
        }
        if (isTransition(value)) {
            return addPath('transition.' + value, 'transition');
        }
        return this.oneState(value);
    },
    namespaced: function namespaced(namespace, type) {
        var path = namespace + '.' + type;

        if (namespace === 'system' && isSystem(type) || namespace === 'transition' && isTransition(type)) {
            return addPath(path, namespace);
        }

        if (/^(state|action)$/.test(namespace) && /^(add|remove)$/.test(type)) {
            return addPath('system.' + path, 'system');
        }

        addError('Unrecognised type "' + type + '" for namespace "' + namespace + '"', _id);
    },
    oneState: function oneState(state) {
        return addPath('state.' + state + '.' + _defaults.state, 'state', state);
    },
    oneAction: function oneAction(action) {
        return addPath('action.' + action + '.' + _defaults.action, 'action', action);
    },
    anyActionEvent: function anyActionEvent(event) {
        return addPath('action.*.' + event, 'action', '*');
    },
    oneActionEvent: function oneActionEvent(action, event) {
        return addPath('action.' + action + '.' + event, 'action', action);
    },
    anyStateEvent: function anyStateEvent(event) {
        return addPath('state.*.' + event, 'state', '*');
    },
    oneStateEvent: function oneStateEvent(state, event) {
        return addPath('state.' + state + '.' + event, 'state', state);
    },
    oneStateAction: function oneStateAction(state, action) {
        return addPath('state.' + state + '.' + action, 'state/action', state + '@' + action);
    }
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
function HandlerMeta(id, path) {
    var namespace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var target = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    this.id = id;
    this.path = path;
    if (namespace) {
        this.namespace = namespace;
    }
    if (target) {
        this.target = target;
    }
}

HandlerMeta.prototype = {
    id: '',
    path: '',
    namespace: '',
    target: ''
};

exports.default = HandlerMeta;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Lexer;

var _Rule = __webpack_require__(11);

var _Rule2 = _interopRequireDefault(_Rule);

var _Token = __webpack_require__(12);

var _Token2 = _interopRequireDefault(_Token);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Simple Lexer class
 *
 * @param   {Object}    rules   A hash of id:RegExp values
 * @constructor
 */
function Lexer(rules) {
    var _this = this;

    this.rules = [];
    if (rules) {
        Object.keys(rules).forEach(function (name) {
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

    /**
     * Process a source string into an array of Tokens based on Rules
     *
     * @param source
     * @returns {Token[]}
     */
    process: function process(source) {
        this.source = source;
        this.tokens = [];
        this.index = 0;
        this.next();
        return this.tokens;
    },

    /**
     * Adds a new rule
     *
     * @protected
     * @param name
     * @param rx
     */
    addRule: function addRule(name, rx) {
        this.rules.push(new _Rule2.default(name, rx));
    },

    next: function next() {
        var _this2 = this;

        if (this.index < this.source.length) {
            var source = this.source.substr(this.index);
            var state = this.rules.some(function (rule) {
                var matches = source.match(rule.rx);
                if (matches) {
                    _this2.tokens.push(new _Token2.default(rule.name, matches));
                    _this2.index += matches[0].length;
                    return true;
                }
                return false;
            });

            // not matched
            if (!state) {
                throw new LexerError('Unable to match source at position ' + this.index + ': "' + source + '"', this.source, this.index);
            }

            // match
            this.next();
        }
    }
};

function LexerError(message, source, index) {
    this.message = message;
    this.source = source;
    this.index = index;
}

LexerError.prototype = new Error();
LexerError.prototype.constructor = LexerError;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * A parsing rule, designed to match part of a string
 *
 * @param   {string}    name
 * @param   {RegExp}    rx
 */
function Rule(name, rx) {
  this.name = name;
  this.rx = rx;
}

exports.default = Rule;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Token class, representing the type and value of part of a source string
 *
 * @param       {string}    type
 * @param       {string[]}  matches
 *
 * @property    {string}    type
 * @property    {string}    match
 * @property    {string[]}  values
 */
function Token(type, matches) {
  this.type = type;
  this.match = matches[0];
  this.values = matches.slice(1);
}

exports.default = Token;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ValueMap = __webpack_require__(2);

var _ValueMap2 = _interopRequireDefault(_ValueMap);

var _TransitionParser = __webpack_require__(14);

var _TransitionParser2 = _interopRequireDefault(_TransitionParser);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
        // procss variables
        action = (0, _utils.trim)(action);
        from = (0, _utils.trim)(from);
        to = typeof to === 'string' ? (0, _utils.trim)(to) : to;

        // check for wildcards
        if (to === '*') {
            throw new Error('Transitioning to a wildcard doesn\'t make sense');
        }

        // add transition
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
     * @param   {string}    from        Name of a state to get actions for
     * @param   {boolean}   [asMap]     Optional boolean to return a Object of action:state properties. Defaults to false
     * @returns {string[]|Object}       An array of string actions, or a hash of action:states
     */
    getActionsFrom: function getActionsFrom(from) {
        var asMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (this.has(from) || this.has('*')) {
            // get all available actions
            var actions = this.map.get(from) || {};
            var wildcard = this.map.get('*');
            var output = Object.assign({}, actions);

            // append wildcard actions
            if (wildcard) {
                for (var action in wildcard) {
                    var value = wildcard[action];
                    if (value !== from && !actions[action]) {
                        output[action] = value;
                    }
                }
            }

            // return map or keys
            return output ? asMap ? output : Object.keys(output) : [];
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
    getActionFor: function getActionFor(from, to) {
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
     * @param   {string|null}    [from]     Optional name of a from state to get states for. Defaults to the current state
     * @returns {string[]}                  An array of string states
     */
    getStatesFrom: function getStatesFrom(from) {
        if (this.hasState(from)) {
            var actions = this.getActionsFrom(from, true);
            return Object.keys(actions).map(function (name) {
                return actions[name];
            });
        }
        return null;
    },

    /**
     * Get the target "to" state from a "from" state via an "action"
     *
     * @param   {string}    from
     * @param   {string}    action
     * @returns {string}
     */
    getStateFor: function getStateFor(from, action) {
        var states = this.getActionsFrom(from, true) || {};
        return states[action];
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
    get: function get() {
        for (var _len = arguments.length, path = Array(_len), _key = 0; _key < _len; _key++) {
            path[_key] = arguments[_key];
        }

        path = [].concat(_toConsumableArray(path)).join('.');
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
     * Test if the given transition exists within the system
     *
     * @param   {string}    action
     * @param   {string}    from
     * @param   {string}    to
     * @returns {boolean}
     */
    hasTransition: function hasTransition(action, from, to) {
        return this.map.get(from + '.' + action) === to;
    },

    /**
     * Utility function to directly check if the composed ValueMap has the requested path
     *
     * Note this does NOT take into account the value of the target object; use hasTransition() for that
     *
     * @param   {string}    path    Pass a path using dot notation, i.e. 'a.next' or pass individual arguments, i.e. from, action, to
     * @returns {boolean}
     */
    has: function has() {
        for (var _len2 = arguments.length, path = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            path[_key2] = arguments[_key2];
        }

        path = [].concat(_toConsumableArray(path)).join('.');
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

    // collate from states
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
    target.states = Object.keys(states).filter(function (state) {
        return state !== '*';
    });
    target.actions = Object.keys(actions);

    // return
    return target;
}

exports.default = TransitionMap;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = parse;

var _utils = __webpack_require__(0);

var _errors = __webpack_require__(4);

var _TransitionMeta = __webpack_require__(15);

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
            if (!/^\w+ [:=] [*\w][\w ]*[|<>] [*\w][\w ]*/.test(tx)) {
                throw new _errors.ParseError(getError(tx, 'cannot determine action and states'));
            }

            // initialize variables
            var transitions = [],
                matches = tx.match(/([*\w ]+|[|<>])/g),
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

                // reset stack if | was passed
                if (match === '|') {
                    stack = [];
                    match = matches.shift();
                }

                // process match
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
                    if (b === '*') {
                        throw new _errors.ParseError(getError(tx, 'transitioning to a wildcard doesn\'t make sense'));
                    }
                    if (Array.isArray(a)) {
                        a.forEach(function (a) {
                            return add(transitions, action, a, b);
                        });
                    } else if (Array.isArray(b)) {
                        b.forEach(function (b) {
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

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

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

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _events = __webpack_require__(3);

var _utils = __webpack_require__(0);

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
        unpause(this);
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
        _pause(this);
        return this;
    },

    resume: function resume() {
        unpause(this);
        return this.exec();
    },

    cancel: function cancel() {
        this.paused = false;
        this.fsm.handlers.trigger('transition.cancel', false);
    }

};

function _pause(transition) {
    if (!transition.paused) {
        transition.paused = true;
        transition.fsm.handlers.trigger('transition.pause', true);
    }
}

function unpause(transition) {
    if (transition.paused) {
        transition.paused = false;
        transition.fsm.handlers.trigger('transition.resume', false);
    }
}

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
        var to = fsm.transitions.getStateFor(from, action);
        var vars = { action: action, to: to, from: from };

        // handle "to" being a function
        if ((0, _utils.isFunction)(to)) {
            to = to.apply(scope, [fsm].concat(params));
            if (!fsm.transitions.hasState(to)) {
                throw new Error('Invalid "to" state "' + to + '"');
            }
        }

        // transition
        var queue = [];
        var transition = new Transition(fsm, action, from, to);

        // build handlers array
        fsm.config.order.forEach(function (path) {
            // replace path tokens
            path = path.replace(/{(\w+)}/g, function (all, token) {
                return vars[token];
            });
            var handlers = fsm.handlers.get(path);

            // do it!
            if (handlers) {
                var _path$split = path.split('.'),
                    _path$split2 = _slicedToArray(_path$split, 3),
                    namespace = _path$split2[0],
                    target = _path$split2[1],
                    type = _path$split2[2];

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

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ObjectHelper = __webpack_require__(18);

var _ObjectHelper2 = _interopRequireDefault(_ObjectHelper);

var _jQueryHelper = __webpack_require__(19);

var _jQueryHelper2 = _interopRequireDefault(_jQueryHelper);

var _VueRouter = __webpack_require__(20);

var _VueRouter2 = _interopRequireDefault(_VueRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    object: _ObjectHelper2.default,
    jQuery: _jQueryHelper2.default,
    vueRouter: _VueRouter2.default
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = setup;

var _utils = __webpack_require__(0);

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

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
        router.push({ name: object.fsm.state });
    }

    // set the current route as current state
    object.fsm.state = router.currentRoute.name;
    // manually update helper
    object.update();

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

/***/ })
/******/ ]);
});
//# sourceMappingURL=state-machine.js.map