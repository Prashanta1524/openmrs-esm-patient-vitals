/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../../node_modules/ansi-html-community/index.js":
/*!*******************************************************!*\
  !*** ../../node_modules/ansi-html-community/index.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),

/***/ "../../node_modules/events/events.js":
/*!*******************************************!*\
  !*** ../../node_modules/events/events.js ***!
  \*******************************************/
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/actions-buttons/action-button.scss":
/*!***************************************************************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/actions-buttons/action-button.scss ***!
  \***************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".-esm-patient-chart__action-button__menuitem___E0jOc {\n  max-width: none;\n}", "",{"version":3,"sources":["webpack://./src/actions-buttons/action-button.scss"],"names":[],"mappings":"AAAA;EACE,eAAA;AACF","sourcesContent":[".menuitem {\n  max-width: none;\n}\n"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"menuitem": "-esm-patient-chart__action-button__menuitem___E0jOc"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/loader/loader.scss":
/*!***********************************************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/loader/loader.scss ***!
  \***********************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* 60,70 and 80 are already declared as brand-01, 02 and 03 respectively */\n:root {\n  --brand-01: #005d5d;\n  --brand-02: #004144;\n  --brand-03: #007d79;\n  --bottom-nav-height: 4rem;\n  --workspace-header-height: 3rem;\n  --tablet-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--bottom-nav-height));\n  --desktop-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--workspace-header-height));\n}\n\n/* These color variables will be removed in a future release */\n.-esm-patient-chart__loader__loading___uDaDf {\n  display: flex;\n  background-color: #f4f4f4;\n  justify-content: center;\n  min-height: 3rem;\n}", "",{"version":3,"sources":["webpack://./../../node_modules/@openmrs/esm-styleguide/src/_vars.scss","webpack://./src/loader/loader.scss","webpack://./../../node_modules/@carbon/layout/scss/generated/_spacing.scss"],"names":[],"mappings":"AAkCA,0EAAA;AAoBA;EACE,mBAAA;EACA,mBAAA;EACA,mBAAA;EACA,yBAAA;EACA,+BAAA;EACA,oGAAA;EACA,2GAAA;ACpDF;;ADgEA,8DAAA;ACtEA;EACE,aAAA;EACA,yBDgBwB;ECfxB,uBAAA;EACA,gBC4CW;ADlCb","sourcesContent":["@use '@carbon/layout';\n\n$ui-01: #f4f4f4;\n$ui-02: #ffffff;\n$ui-03: #e0e0e0;\n$ui-04: #8d8d8d;\n$ui-05: #161616;\n$text-02: #525252;\n$text-03: #a8a8a8;\n$ui-background: #ffffff;\n$color-gray-30: #c6c6c6;\n$color-gray-70: #525252;\n$color-gray-100: #161616;\n$color-blue-60-2: #0f62fe;\n$color-blue-10: #edf5ff;\n$color-yellow-50: #feecae;\n$carbon--red-50: #fa4d56;\n$inverse-link: #78a9ff;\n$support-02: #24a148;\n$inverse-support-03: #f1c21b;\n$warning-background: #fff8e1;\n$openmrs-background-grey: #f4f4f4;\n$danger: #da1e28;\n$interactive-01: #0f62fe;\n$field-01: #f4f4f4;\n$grey-2: #e0e0e0;\n$labeldropdown: #c6c6c6;\n\n$brand-primary-10: #d9fbfb;\n$brand-primary-20: #9ef0f0;\n$brand-primary-30: #3ddbd9;\n$brand-primary-40: #08bdba;\n$brand-primary-50: #009d9a;\n\n/* 60,70 and 80 are already declared as brand-01, 02 and 03 respectively */\n\n$brand-primary-90: #022b30;\n$brand-primary-100: #081a1c;\n\n@mixin brand-01($property) {\n  #{$property}: #005d5d;\n  #{$property}: var(--brand-01);\n}\n\n@mixin brand-02($property) {\n  #{$property}: #004144;\n  #{$property}: var(--brand-02);\n}\n\n@mixin brand-03($property) {\n  #{$property}: #007d79;\n  #{$property}: var(--brand-03);\n}\n\n:root {\n  --brand-01: #005d5d;\n  --brand-02: #004144;\n  --brand-03: #007d79;\n  --bottom-nav-height: #{layout.$spacing-10};\n  --workspace-header-height: #{layout.$spacing-09};\n  --tablet-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--bottom-nav-height));\n  --desktop-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--workspace-header-height));\n}\n\n$breakpoint-phone-min: 0px;\n$breakpoint-phone-max: 600px;\n$breakpoint-tablet-min: 601px;\n$breakpoint-tablet-max: 1023px;\n$breakpoint-small-desktop-min: 1024px;\n$breakpoint-small-desktop-max: 1439px;\n$breakpoint-large-desktop-min: 1440px;\n$breakpoint-large-desktop-max: 99999999px;\n\n/* These color variables will be removed in a future release */\n$brand-teal-01: #007d79;\n$brand-01: #005d5d;\n$brand-02: #004144;\n","@use '@carbon/layout';\n@use '@openmrs/esm-styleguide/src/vars' as *;\n\n.loading {\n  display: flex;\n  background-color: $openmrs-background-grey;\n  justify-content: center;\n  min-height: layout.$spacing-09;\n}\n","// Code generated by @carbon/layout. DO NOT EDIT.\n//\n// Copyright IBM Corp. 2018, 2023\n//\n// This source code is licensed under the Apache-2.0 license found in the\n// LICENSE file in the root directory of this source tree.\n//\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-01: 0.125rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-02: 0.25rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-03: 0.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-04: 0.75rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-05: 1rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-06: 1.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-07: 2rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-08: 2.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-09: 3rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-10: 4rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-11: 5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-12: 6rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-13: 10rem !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/layout\n$spacing: (\n  spacing-01: $spacing-01,\n  spacing-02: $spacing-02,\n  spacing-03: $spacing-03,\n  spacing-04: $spacing-04,\n  spacing-05: $spacing-05,\n  spacing-06: $spacing-06,\n  spacing-07: $spacing-07,\n  spacing-08: $spacing-08,\n  spacing-09: $spacing-09,\n  spacing-10: $spacing-10,\n  spacing-11: $spacing-11,\n  spacing-12: $spacing-12,\n  spacing-13: $spacing-13,\n);\n"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"loading": "-esm-patient-chart__loader__loading___uDaDf"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/patient-chart/chart-review/dashboard-view.scss":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/patient-chart/chart-review/dashboard-view.scss ***!
  \***************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".-esm-patient-chart__dashboard-view__dashboardTitle___-EFVQ {\n  font-size: var(--cds-heading-03-font-size, 1.25rem);\n  font-weight: var(--cds-heading-03-font-weight, 400);\n  line-height: var(--cds-heading-03-line-height, 1.4);\n  letter-spacing: var(--cds-heading-03-letter-spacing, 0);\n  margin: 1rem 0 1rem 1.3125rem;\n}\n\n.-esm-patient-chart__dashboard-view__dashboard___pKgEf {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  grid-auto-rows: auto;\n  grid-gap: 1.3125rem;\n  margin: 1.3125rem;\n}\n\n[data-extension-slot-name=patient-chart-encounters-dashboard-slot],\n[data-extension-slot-name=patient-chart-test-results-dashboard-slot] {\n  margin: 0 1rem;\n}\n\n.-esm-patient-chart__dashboard-view__dashboardContainer___EWL2X:not(:has([data-extension-slot-name=patient-chart-attachments-dashboard-slot])) {\n  container-name: dashboard;\n  container-type: inline-size;\n}\n\n@container dashboard (width <= 68.25rem) {\n  .-esm-patient-chart__dashboard-view__dashboard___pKgEf {\n    grid-template-columns: 1fr;\n  }\n}\n.-esm-patient-chart__dashboard-view__extensionWrapper___Jd2UR > * {\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n}\n\n.-esm-patient-chart__dashboard-view__extension___TH0bk:only-child {\n  grid-column: 1/-1;\n}\n\n.-esm-patient-chart__dashboard-view__fullWidth___9g9iT {\n  grid-column: 1/-1;\n}\n\n.omrs-breakpoint-lt-desktop .-esm-patient-chart__dashboard-view__dashboard___pKgEf {\n  grid-template-columns: 1fr;\n}\n\n.omrs-breakpoint-lt-tablet .-esm-patient-chart__dashboard-view__container___zJuTN {\n  margin: 5px;\n  overflow-x: auto;\n  justify-content: center;\n}\n\n.omrs-breakpoint-lt-tablet .-esm-patient-chart__dashboard-view__dashboard___pKgEf {\n  display: flex;\n  flex-direction: column;\n  flex-wrap: wrap;\n}\n\n.omrs-breakpoint-lt-tablet .-esm-patient-chart__dashboard-view__dashboard___pKgEf > div {\n  margin: 0.125rem 0px;\n}\n\nhtml[dir=rtl] .-esm-patient-chart__dashboard-view__dashboardTitle___-EFVQ {\n  margin: 1rem 1.3125rem 1rem 0;\n}", "",{"version":3,"sources":["webpack://./src/patient-chart/chart-review/dashboard-view.scss","webpack://./../../node_modules/@carbon/type/scss/_styles.scss"],"names":[],"mappings":"AAGA;EC+1BI,mDAAA;EAAA,mDAAA;EAAA,mDAAA;EAAA,uDAAA;ED71BF,6BAAA;AACF;;AAEA;EACE,aAAA;EACA,gDAAA;EACA,oBAAA;EACA,mBAAA;EACA,iBAAA;AACF;;AAGA;;EAGE,cAAA;AADF;;AAIA;EACE,yBAAA;EACA,2BAAA;AADF;;AAOA;EACE;IACE,0BAAA;EAJF;AACF;AAQE;EACE,YAAA;EACA,aAAA;EACA,sBAAA;AANJ;;AAUA;EACE,iBAAA;AAPF;;AAUA;EACE,iBAAA;AAPF;;AAUA;EACE,0BAAA;AAPF;;AAUA;EACE,WAAA;EACA,gBAAA;EACA,uBAAA;AAPF;;AAUA;EACE,aAAA;EACA,sBAAA;EACA,eAAA;AAPF;;AAUA;EACE,oBAAA;AAPF;;AAYE;EACE,6BAAA;AATJ","sourcesContent":["@use '@carbon/layout';\n@use '@carbon/type';\n\n.dashboardTitle {\n  @include type.type-style('heading-03');\n  margin: layout.$spacing-05 0 layout.$spacing-05 1.3125rem;\n}\n\n.dashboard {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  grid-auto-rows: auto;\n  grid-gap: 1.3125rem;\n  margin: 1.3125rem;\n}\n\n// See https://zpl.io/lrlmdq0 for the Visits dashboard design\n[data-extension-slot-name='patient-chart-encounters-dashboard-slot'],\n// See https://zpl.io/RmMXrDE for the Test Results dashboard design\n[data-extension-slot-name='patient-chart-test-results-dashboard-slot'] {\n  margin: 0 layout.$spacing-05;\n}\n\n.dashboardContainer:not(:has([data-extension-slot-name='patient-chart-attachments-dashboard-slot'])) {\n  container-name: dashboard;\n  container-type: inline-size;\n}\n\n// When the dashboard's width is less than or equal to 68.25rem (1100px),\n// the layout should switch to a single column. This adjustment ensures\n// proper rendering when the workspace area is opened.\n@container dashboard (width <= 68.25rem) {\n  .dashboard {\n    grid-template-columns: 1fr;\n  }\n}\n\n.extensionWrapper {\n  > * {\n    height: 100%;\n    display: flex;\n    flex-direction: column;\n  }\n}\n\n.extension:only-child {\n  grid-column: 1 / -1;\n}\n\n.fullWidth {\n  grid-column: 1 / -1;\n}\n\n:global(.omrs-breakpoint-lt-desktop) .dashboard {\n  grid-template-columns: 1fr;\n}\n\n:global(.omrs-breakpoint-lt-tablet) .container {\n  margin: 5px;\n  overflow-x: auto;\n  justify-content: center;\n}\n\n:global(.omrs-breakpoint-lt-tablet) .dashboard {\n  display: flex;\n  flex-direction: column;\n  flex-wrap: wrap;\n}\n\n:global(.omrs-breakpoint-lt-tablet) .dashboard > div {\n  margin: layout.$spacing-01 0px;\n}\n\n// Overriding styles for RTL support\nhtml[dir='rtl'] {\n  .dashboardTitle {\n    margin: layout.$spacing-05 1.3125rem layout.$spacing-05 0;\n  }\n}\n","//\n// Copyright IBM Corp. 2018, 2023\n//\n// This source code is licensed under the Apache-2.0 license found in the\n// LICENSE file in the root directory of this source tree.\n//\n\n// stylelint-disable number-max-precision\n\n@use 'sass:map';\n@use 'sass:math';\n@use '@carbon/grid/scss/config' as gridconfig;\n@use '@carbon/grid/scss/breakpoint' as grid;\n@use 'prefix' as *;\n@use 'font-family';\n@use 'scale';\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$caption-01: (\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$caption-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$label-01: (\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$label-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$legal-01: (\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$legal-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$helper-text-01: (\n  font-size: scale.type-scale(1),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$helper-text-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-short-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-compact-01: $body-short-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-long-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.42857,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-01: $body-long-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-short-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.375,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-compact-02: $body-short-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-long-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.5,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-02: $body-long-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$code-01: (\n  font-family: font-family.font-family('mono'),\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$code-02: (\n  font-family: font-family.font-family('mono'),\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.42857,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.42857,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-compact-01: $productive-heading-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.5,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.375,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-compact-02: $productive-heading-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-03: (\n  font-size: scale.type-scale(5),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.4,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-03: $productive-heading-03 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-04: (\n  font-size: scale.type-scale(7),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-04: $productive-heading-04 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-05: (\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.25,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-05: $productive-heading-05 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-06: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  // Extra digit needed for precision in Chrome\n  line-height: 1.199,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-06: $productive-heading-06 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-07: (\n  font-size: scale.type-scale(12),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-07: $productive-heading-07 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-01: $heading-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-02: $heading-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-03: (\n  font-size: scale.type-scale(5),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.4,\n  letter-spacing: 0,\n  breakpoints: (\n    xlg: (\n      font-size: scale.type-scale(5),\n      line-height: 1.4,\n    ),\n    max: (\n      font-size: scale.type-scale(6),\n      line-height: 1.334,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-03: $expressive-heading-03 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-04: (\n  font-size: scale.type-scale(7),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0,\n  breakpoints: (\n    xlg: (\n      font-size: scale.type-scale(8),\n      line-height: 1.25,\n      font-weight: font-family.font-weight('regular'),\n    ),\n    max: (\n      font-size: scale.type-scale(8),\n      font-weight: font-family.font-weight('regular'),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-04: $expressive-heading-04 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-05: (\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.25,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(9),\n      font-weight: font-family.font-weight('light'),\n      line-height: 1.22,\n    ),\n    lg: (\n      font-size: scale.type-scale(10),\n      line-height: 1.19,\n    ),\n    xlg: (\n      font-size: scale.type-scale(11),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(13),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-05: $expressive-heading-05 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-06: (\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.25,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(9),\n      line-height: 1.22,\n    ),\n    lg: (\n      font-size: scale.type-scale(10),\n      line-height: 1.19,\n    ),\n    xlg: (\n      font-size: scale.type-scale(11),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(13),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-06: $expressive-heading-06 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-paragraph-01: (\n  font-size: scale.type-scale(6),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.334,\n  letter-spacing: 0,\n  breakpoints: (\n    lg: (\n      font-size: scale.type-scale(7),\n      line-height: 1.28572,\n    ),\n    max: (\n      font-size: scale.type-scale(8),\n      line-height: 1.25,\n    ),\n  ),\n);\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-paragraph-01: $expressive-paragraph-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$quotation-01: (\n  font-family: font-family.font-family('serif'),\n  font-size: scale.type-scale(5),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.3,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(5),\n    ),\n    lg: (\n      font-size: scale.type-scale(6),\n      line-height: 1.334,\n    ),\n    xlg: (\n      font-size: scale.type-scale(7),\n      line-height: 1.28572,\n    ),\n    max: (\n      font-size: scale.type-scale(8),\n      line-height: 1.25,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-quotation-01: $quotation-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$quotation-02: (\n  font-family: font-family.font-family('serif'),\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.25,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(9),\n      line-height: 1.22,\n    ),\n    lg: (\n      font-size: scale.type-scale(10),\n      line-height: 1.19,\n    ),\n    xlg: (\n      font-size: scale.type-scale(11),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(13),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-quotation-02: $quotation-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-01: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(10),\n    ),\n    lg: (\n      font-size: scale.type-scale(12),\n    ),\n    xlg: (\n      font-size: scale.type-scale(13),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(15),\n      line-height: 1.13,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-01: $display-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-02: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(10),\n    ),\n    lg: (\n      font-size: scale.type-scale(12),\n    ),\n    xlg: (\n      font-size: scale.type-scale(13),\n      line-height: 1.16,\n    ),\n    max: (\n      font-size: scale.type-scale(15),\n      line-height: 1.13,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-02: $display-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-03: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(12),\n      line-height: 1.18,\n    ),\n    lg: (\n      font-size: scale.type-scale(13),\n      line-height: 1.16,\n      letter-spacing: -0.64px,\n    ),\n    xlg: (\n      font-size: scale.type-scale(15),\n      line-height: 1.13,\n      letter-spacing: -0.64px,\n    ),\n    max: (\n      font-size: scale.type-scale(16),\n      line-height: 1.11,\n      letter-spacing: -0.96px,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-03: $display-03 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-04: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(14),\n      line-height: 1.15,\n    ),\n    lg: (\n      font-size: scale.type-scale(17),\n      line-height: 1.11,\n      letter-spacing: -0.64px,\n    ),\n    xlg: (\n      font-size: scale.type-scale(20),\n      line-height: 1.07,\n      letter-spacing: -0.64px,\n    ),\n    max: (\n      font-size: scale.type-scale(23),\n      line-height: 1.05,\n      letter-spacing: -0.96px,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-04: $display-04 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$tokens: (\n  caption-01: $caption-01,\n  caption-02: $caption-02,\n  label-01: $label-01,\n  label-02: $label-02,\n  helper-text-01: $helper-text-01,\n  helper-text-02: $helper-text-02,\n  body-short-01: $body-short-01,\n  body-short-02: $body-short-02,\n  body-long-01: $body-long-01,\n  body-long-02: $body-long-02,\n  code-01: $code-01,\n  code-02: $code-02,\n  heading-01: $heading-01,\n  heading-02: $heading-02,\n  productive-heading-01: $productive-heading-01,\n  productive-heading-02: $productive-heading-02,\n  productive-heading-03: $productive-heading-03,\n  productive-heading-04: $productive-heading-04,\n  productive-heading-05: $productive-heading-05,\n  productive-heading-06: $productive-heading-06,\n  productive-heading-07: $productive-heading-07,\n  expressive-paragraph-01: $expressive-paragraph-01,\n  expressive-heading-01: $expressive-heading-01,\n  expressive-heading-02: $expressive-heading-02,\n  expressive-heading-03: $expressive-heading-03,\n  expressive-heading-04: $expressive-heading-04,\n  expressive-heading-05: $expressive-heading-05,\n  expressive-heading-06: $expressive-heading-06,\n  quotation-01: $quotation-01,\n  quotation-02: $quotation-02,\n  display-01: $display-01,\n  display-02: $display-02,\n  display-03: $display-03,\n  display-04: $display-04,\n  // V11 Tokens\n  legal-01: $legal-01,\n  legal-02: $legal-02,\n  body-compact-01: $body-compact-01,\n  body-compact-02: $body-compact-02,\n  heading-compact-01: $heading-compact-01,\n  heading-compact-02: $heading-compact-02,\n  body-01: $body-01,\n  body-02: $body-02,\n  heading-03: $heading-03,\n  heading-04: $heading-04,\n  heading-05: $heading-05,\n  heading-06: $heading-06,\n  heading-07: $heading-07,\n  fluid-heading-03: $fluid-heading-03,\n  fluid-heading-04: $fluid-heading-04,\n  fluid-heading-05: $fluid-heading-05,\n  fluid-heading-06: $fluid-heading-06,\n  fluid-paragraph-01: $fluid-paragraph-01,\n  fluid-quotation-01: $fluid-quotation-01,\n  fluid-quotation-02: $fluid-quotation-02,\n  fluid-display-01: $fluid-display-01,\n  fluid-display-02: $fluid-display-02,\n  fluid-display-03: $fluid-display-03,\n  fluid-display-04: $fluid-display-04,\n) !default;\n\n/// @param {Map} $map\n/// @access public\n/// @group @carbon/type\n@mixin properties($map) {\n  @each $name, $value in $map {\n    #{$name}: $value;\n  }\n}\n\n/// @param {Number} $value - Number with units\n/// @return {Number} Without units\n/// @access public\n/// @group @carbon/type\n@function strip-unit($value) {\n  @return math.div($value, $value * 0 + 1);\n}\n\n/// This helper includes fluid type styles for the given token value. Fluid type\n/// means that the `font-size` is computed using `calc()` in order to be\n/// determined by the screen size instead of a breakpoint. As a result, fluid\n/// styles should be used with caution in fixed width contexts.\n///\n/// In addition, we make use of %-based line-heights so that the line-height of\n/// each type style is computed correctly due to the dynamic nature of the\n/// `font-size`.\n///\n/// Most of the logic for this work comes from CSS Tricks:\n/// https://css-tricks.com/snippets/css/fluid-typography/\n///\n/// @param {Map} $type-styles - The value of a given type token\n/// @param {Map} $breakpoints [$grid-breakpoints] - Custom breakpoints to use\n/// @access public\n/// @group @carbon/type\n@mixin fluid-type($type-styles, $breakpoints: gridconfig.$grid-breakpoints) {\n  // Include the initial styles for the given token by default without any\n  // media query guard. This includes `font-size` as a fallback in the case\n  // that a browser does not support `calc()`\n  @include properties(map.remove($type-styles, breakpoints));\n  // We also need to include the `sm` styles by default since they don't\n  // appear in the fluid styles for tokens\n  @include fluid-type-size($type-styles, sm, $breakpoints);\n\n  // Finally, we need to go through all the breakpoints defined in the type\n  // token and apply the properties and fluid type size for that given\n  // breakpoint\n  @each $name, $values in map.get($type-styles, breakpoints) {\n    @include grid.breakpoint($name) {\n      @include properties($values);\n      @include fluid-type-size($type-styles, $name, $breakpoints);\n    }\n  }\n}\n\n/// Computes the fluid `font-size` for a given type style and breakpoint\n/// @param {Map} $type-styles - The styles for a given token\n/// @param {String} $name - The name of the breakpoint to which we apply the fluid\n/// @param {Map} $breakpoints [$grid-breakpoints] - The breakpoints for the grid system\n/// @access public\n/// @group @carbon/type\n@mixin fluid-type-size(\n  $type-styles,\n  $name,\n  $breakpoints: gridconfig.$grid-breakpoints\n) {\n  // Get the information about the breakpoint we're currently working in. Useful\n  // for getting initial width information\n  $breakpoint: map.get($breakpoints, $name);\n\n  // Our fluid styles are captured under the 'breakpoints' property in our type\n  // styles map. These define what values to treat as `max-` variables below\n  $fluid-sizes: map.get($type-styles, breakpoints);\n  $fluid-breakpoint: ();\n  // Special case for `sm` because the styles for small are on the type style\n  // directly\n  @if $name == sm {\n    $fluid-breakpoint: map.remove($type-styles, breakpoints);\n  } @else {\n    $fluid-breakpoint: map.get($fluid-sizes, $name);\n  }\n\n  // Initialize our font-sizes to the default size for the type style\n  $max-font-size: map.get($type-styles, font-size);\n  $min-font-size: map.get($type-styles, font-size);\n  @if map.has-key($fluid-breakpoint, font-size) {\n    $min-font-size: map.get($fluid-breakpoint, font-size);\n  }\n\n  // Initialize our min and max width to the width of the current breakpoint\n  $max-vw: map.get($breakpoint, width);\n  $min-vw: map.get($breakpoint, width);\n\n  // We can use `breakpoint-next` to see if there is another breakpoint we can\n  // use to update `max-font-size` and `max-vw` with larger values\n  $next-breakpoint-available: grid.breakpoint-next($name, $breakpoints);\n  $next-fluid-breakpoint-name: null;\n\n  // We need to figure out what the next available fluid breakpoint is for our\n  // given $type-styles. In this loop we try and iterate through breakpoints\n  // until we either manually set $next-breakpoint-available to null or\n  // `breakpoint-next` returns null.\n  @while $next-breakpoint-available {\n    @if map.has-key($fluid-sizes, $next-breakpoint-available) {\n      $next-fluid-breakpoint-name: $next-breakpoint-available;\n      $next-breakpoint-available: null;\n    } @else {\n      $next-breakpoint-available: grid.breakpoint-next(\n        $next-breakpoint-available,\n        $breakpoints\n      );\n    }\n  }\n\n  // If we have found the next available fluid breakpoint name, then we know\n  // that we have values that we can use to set max-font-size and max-vw as both\n  // values derive from the next breakpoint\n  @if $next-fluid-breakpoint-name {\n    $next-fluid-breakpoint: map.get($breakpoints, $next-fluid-breakpoint-name);\n    $max-font-size: map.get(\n      map.get($fluid-sizes, $next-fluid-breakpoint-name),\n      font-size\n    );\n    $max-vw: map.get($next-fluid-breakpoint, width);\n\n    // prettier-ignore\n    font-size: calc(#{$min-font-size} +\n      #{strip-unit($max-font-size - $min-font-size)} *\n      ((100vw - #{$min-vw}) / #{strip-unit($max-vw - $min-vw)})\n    );\n  } @else {\n    // Otherwise, just default to setting the font size found from the type\n    // style or the given fluid breakpoint in the type style\n    font-size: $min-font-size;\n  }\n}\n\n// TODO move following variable and `custom-property` mixin into shared file for\n// both `@carbon/type` and `@carbon/themes`\n\n/// @access private\n/// @group @carbon/type\n@mixin custom-properties($name, $value) {\n  @each $property, $value in $value {\n    #{$property}: var(\n      --#{$custom-property-prefix}-#{$name}-#{$property},\n      #{$value}\n    );\n  }\n}\n\n/// Helper mixin to include the styles for a given token in any selector in your\n/// project. Also includes an optional fluid option that will enable fluid\n/// styles for the token if they are defined. Fluid styles will cause the\n/// token's font-size to be computed based on the viewport size. As a result, use\n/// with caution in fixed contexts.\n/// @param {String} $name - The name of the token to get the styles for\n/// @param {Boolean} $fluid [false] - Specify whether to include fluid styles for the\n/// @param {Map} $breakpoints [$grid-breakpoints] - Provide a custom breakpoint map to use\n/// @access public\n/// @group @carbon/type\n@mixin type-style(\n  $name,\n  $fluid: false,\n  $breakpoints: gridconfig.$grid-breakpoints\n) {\n  @if not map.has-key($tokens, $name) {\n    @error 'Unable to find a token with the name: `#{$name}`';\n  }\n\n  $token: map.get($tokens, $name);\n\n  // If $fluid is set to true and the token has breakpoints defined for fluid\n  // styles, delegate to the fluid-type helper for the given token\n  @if $fluid == true and map.has-key($token, 'breakpoints') {\n    @include fluid-type($token, $breakpoints);\n  } @else {\n    @include custom-properties($name, $token);\n  }\n}\n"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"dashboardTitle": "-esm-patient-chart__dashboard-view__dashboardTitle___-EFVQ",
	"dashboard": "-esm-patient-chart__dashboard-view__dashboard___pKgEf",
	"dashboardContainer": "-esm-patient-chart__dashboard-view__dashboardContainer___EWL2X",
	"extensionWrapper": "-esm-patient-chart__dashboard-view__extensionWrapper___Jd2UR",
	"extension": "-esm-patient-chart__dashboard-view__extension___TH0bk",
	"fullWidth": "-esm-patient-chart__dashboard-view__fullWidth___9g9iT",
	"container": "-esm-patient-chart__dashboard-view__container___zJuTN"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/patient-chart/patient-chart.scss":
/*!*************************************************************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/patient-chart/patient-chart.scss ***!
  \*************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* 60,70 and 80 are already declared as brand-01, 02 and 03 respectively */\n:root {\n  --brand-01: #005d5d;\n  --brand-02: #004144;\n  --brand-03: #007d79;\n  --bottom-nav-height: 4rem;\n  --workspace-header-height: 3rem;\n  --tablet-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--bottom-nav-height));\n  --desktop-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--workspace-header-height));\n}\n\n/* These color variables will be removed in a future release */\n.-esm-patient-chart__patient-chart__grid___9\\+zJb {\n  display: grid;\n  grid-template-columns: 1fr min-content;\n  grid-template-rows: 1fr;\n  align-items: stretch;\n  width: inherit;\n}\n\n.-esm-patient-chart__patient-chart__chartReview___5Q4\\+H {\n  grid-row: 1;\n  grid-column: 1;\n  align-self: start;\n  height: 90%;\n  width: 100%;\n  margin: 0 auto;\n  padding-bottom: 4rem;\n}\n\n.-esm-patient-chart__patient-chart__widthContained___Ow0JH {\n  max-width: 60rem;\n}\n\n.omrs-breakpoint-gt-small-desktop .-esm-patient-chart__patient-chart__widthContained___Ow0JH {\n  max-width: 80rem;\n}\n\n.-esm-patient-chart__patient-chart__chartContainer___xCAwZ {\n  flex: 1;\n  display: flex;\n  align-items: flex-start;\n  flex-direction: column;\n}\n\n.-esm-patient-chart__patient-chart__innerChartContainer___QPoaQ {\n  display: flex;\n  width: 100%;\n  flex-direction: column;\n}\n\n.-esm-patient-chart__patient-chart__closeWorkspace___gUWy6 {\n  padding-right: 0;\n}\n\nhtml[dir=rtl] .-esm-patient-chart__patient-chart__chartContainer___xCAwZ {\n  padding-right: unset;\n  padding-left: 0.125rem;\n}\nhtml[dir=rtl] .omrs-breakpoint-lt-desktop .-esm-patient-chart__patient-chart__innerChartContainer___QPoaQ {\n  padding-left: 0;\n  margin-right: unset;\n}", "",{"version":3,"sources":["webpack://./../../node_modules/@openmrs/esm-styleguide/src/_vars.scss","webpack://./src/patient-chart/patient-chart.scss","webpack://./../../node_modules/@carbon/layout/scss/generated/_spacing.scss"],"names":[],"mappings":"AAkCA,0EAAA;AAoBA;EACE,mBAAA;EACA,mBAAA;EACA,mBAAA;EACA,yBAAA;EACA,+BAAA;EACA,oGAAA;EACA,2GAAA;ACpDF;;ADgEA,8DAAA;AClEA;EACE,aAAA;EACA,sCAAA;EACA,uBAAA;EACA,oBAAA;EACA,cAAA;AAMF;;AAHA;EACE,WAAA;EACA,cAAA;EACA,iBAAA;EACA,WAAA;EACA,WAAA;EACA,cAAA;EACA,oBCkCW;AD5Bb;;AAHA;EACE,gBAAA;AAMF;;AAHA;EACE,gBAAA;AAMF;;AAHA;EACE,OAAA;EACA,aAAA;EACA,uBAAA;EACA,sBAAA;AAMF;;AAHA;EACE,aAAA;EACA,WAAA;EACA,sBAAA;AAMF;;AAHA;EACE,gBAAA;AAMF;;AADE;EACE,oBAAA;EACA,sBC3CS;AD+Cb;AADE;EACE,eAAA;EACA,mBAAA;AAGJ","sourcesContent":["@use '@carbon/layout';\n\n$ui-01: #f4f4f4;\n$ui-02: #ffffff;\n$ui-03: #e0e0e0;\n$ui-04: #8d8d8d;\n$ui-05: #161616;\n$text-02: #525252;\n$text-03: #a8a8a8;\n$ui-background: #ffffff;\n$color-gray-30: #c6c6c6;\n$color-gray-70: #525252;\n$color-gray-100: #161616;\n$color-blue-60-2: #0f62fe;\n$color-blue-10: #edf5ff;\n$color-yellow-50: #feecae;\n$carbon--red-50: #fa4d56;\n$inverse-link: #78a9ff;\n$support-02: #24a148;\n$inverse-support-03: #f1c21b;\n$warning-background: #fff8e1;\n$openmrs-background-grey: #f4f4f4;\n$danger: #da1e28;\n$interactive-01: #0f62fe;\n$field-01: #f4f4f4;\n$grey-2: #e0e0e0;\n$labeldropdown: #c6c6c6;\n\n$brand-primary-10: #d9fbfb;\n$brand-primary-20: #9ef0f0;\n$brand-primary-30: #3ddbd9;\n$brand-primary-40: #08bdba;\n$brand-primary-50: #009d9a;\n\n/* 60,70 and 80 are already declared as brand-01, 02 and 03 respectively */\n\n$brand-primary-90: #022b30;\n$brand-primary-100: #081a1c;\n\n@mixin brand-01($property) {\n  #{$property}: #005d5d;\n  #{$property}: var(--brand-01);\n}\n\n@mixin brand-02($property) {\n  #{$property}: #004144;\n  #{$property}: var(--brand-02);\n}\n\n@mixin brand-03($property) {\n  #{$property}: #007d79;\n  #{$property}: var(--brand-03);\n}\n\n:root {\n  --brand-01: #005d5d;\n  --brand-02: #004144;\n  --brand-03: #007d79;\n  --bottom-nav-height: #{layout.$spacing-10};\n  --workspace-header-height: #{layout.$spacing-09};\n  --tablet-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--bottom-nav-height));\n  --desktop-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--workspace-header-height));\n}\n\n$breakpoint-phone-min: 0px;\n$breakpoint-phone-max: 600px;\n$breakpoint-tablet-min: 601px;\n$breakpoint-tablet-max: 1023px;\n$breakpoint-small-desktop-min: 1024px;\n$breakpoint-small-desktop-max: 1439px;\n$breakpoint-large-desktop-min: 1440px;\n$breakpoint-large-desktop-max: 99999999px;\n\n/* These color variables will be removed in a future release */\n$brand-teal-01: #007d79;\n$brand-01: #005d5d;\n$brand-02: #004144;\n","@use '@carbon/layout';\n@use '@openmrs/esm-styleguide/src/vars' as *;\n\n$actionNavOffset: 45px;\n$actionPanelOffset: 256px;\n$actionPanelExpandedOffset: $actionNavOffset + $actionPanelOffset;\n\n.grid {\n  display: grid;\n  grid-template-columns: 1fr min-content;\n  grid-template-rows: 1fr;\n  align-items: stretch;\n  width: inherit;\n}\n\n.chartReview {\n  grid-row: 1;\n  grid-column: 1;\n  align-self: start;\n  height: 90%;\n  width: 100%;\n  margin: 0 auto;\n  padding-bottom: layout.$spacing-10;\n}\n\n.widthContained {\n  max-width: 60rem;\n}\n\n:global(.omrs-breakpoint-gt-small-desktop) .widthContained {\n  max-width: 80rem;\n}\n\n.chartContainer {\n  flex: 1;\n  display: flex;\n  align-items: flex-start;\n  flex-direction: column;\n}\n\n.innerChartContainer {\n  display: flex;\n  width: 100%;\n  flex-direction: column;\n}\n\n.closeWorkspace {\n  padding-right: 0;\n}\n\n// Overriding styles for RTL support\nhtml[dir='rtl'] {\n  .chartContainer {\n    padding-right: unset;\n    padding-left: layout.$spacing-01;\n  }\n\n  :global(.omrs-breakpoint-lt-desktop) .innerChartContainer {\n    padding-left: 0;\n    margin-right: unset;\n  }\n}\n","// Code generated by @carbon/layout. DO NOT EDIT.\n//\n// Copyright IBM Corp. 2018, 2023\n//\n// This source code is licensed under the Apache-2.0 license found in the\n// LICENSE file in the root directory of this source tree.\n//\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-01: 0.125rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-02: 0.25rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-03: 0.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-04: 0.75rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-05: 1rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-06: 1.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-07: 2rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-08: 2.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-09: 3rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-10: 4rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-11: 5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-12: 6rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-13: 10rem !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/layout\n$spacing: (\n  spacing-01: $spacing-01,\n  spacing-02: $spacing-02,\n  spacing-03: $spacing-03,\n  spacing-04: $spacing-04,\n  spacing-05: $spacing-05,\n  spacing-06: $spacing-06,\n  spacing-07: $spacing-07,\n  spacing-08: $spacing-08,\n  spacing-09: $spacing-09,\n  spacing-10: $spacing-10,\n  spacing-11: $spacing-11,\n  spacing-12: $spacing-12,\n  spacing-13: $spacing-13,\n);\n"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"grid": "-esm-patient-chart__patient-chart__grid___9+zJb",
	"chartReview": "-esm-patient-chart__patient-chart__chartReview___5Q4+H",
	"widthContained": "-esm-patient-chart__patient-chart__widthContained___Ow0JH",
	"chartContainer": "-esm-patient-chart__patient-chart__chartContainer___xCAwZ",
	"innerChartContainer": "-esm-patient-chart__patient-chart__innerChartContainer___QPoaQ",
	"closeWorkspace": "-esm-patient-chart__patient-chart__closeWorkspace___gUWy6"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/patient-details-tile/patient-details-tile.scss":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/patient-details-tile/patient-details-tile.scss ***!
  \***************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* 60,70 and 80 are already declared as brand-01, 02 and 03 respectively */\n:root {\n  --brand-01: #005d5d;\n  --brand-02: #004144;\n  --brand-03: #007d79;\n  --bottom-nav-height: 4rem;\n  --workspace-header-height: 3rem;\n  --tablet-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--bottom-nav-height));\n  --desktop-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--workspace-header-height));\n}\n\n/* These color variables will be removed in a future release */\n.-esm-patient-chart__patient-details-tile__container___U7W00:after {\n  content: \"\";\n  height: 100%;\n  width: 1px;\n  position: absolute;\n  right: 0;\n  top: 0;\n  background-color: #c6c6c6;\n  margin: 0 1rem;\n}\n\n.-esm-patient-chart__patient-details-tile__details___V8C3v {\n  margin-top: 5px;\n  font-size: var(--cds-body-compact-01-font-size, 0.875rem);\n  font-weight: var(--cds-body-compact-01-font-weight, 400);\n  line-height: var(--cds-body-compact-01-line-height, 1.28572);\n  letter-spacing: var(--cds-body-compact-01-letter-spacing, 0.16px);\n  color: #525252;\n}\n\n.-esm-patient-chart__patient-details-tile__name___2mQg6 {\n  font-size: var(--cds-body-compact-02-font-size, 1rem);\n  font-weight: var(--cds-body-compact-02-font-weight, 400);\n  line-height: var(--cds-body-compact-02-line-height, 1.375);\n  letter-spacing: var(--cds-body-compact-02-letter-spacing, 0);\n}", "",{"version":3,"sources":["webpack://./../../node_modules/@openmrs/esm-styleguide/src/_vars.scss","webpack://./src/patient-details-tile/patient-details-tile.scss","webpack://./../../node_modules/@carbon/type/scss/_styles.scss"],"names":[],"mappings":"AAkCA,0EAAA;AAoBA;EACE,mBAAA;EACA,mBAAA;EACA,mBAAA;EACA,yBAAA;EACA,+BAAA;EACA,oGAAA;EACA,2GAAA;ACpDF;;ADgEA,8DAAA;ACrEA;EACE,WAAA;EACA,YAAA;EACA,UAAA;EACA,kBAAA;EACA,QAAA;EACA,MAAA;EACA,yBDDc;ECEd,cAAA;AASF;;AANA;EACE,eAAA;ECk1BE,yDAAA;EAAA,wDAAA;EAAA,4DAAA;EAAA,iEAAA;EDh1BF,cDXQ;ACuBV;;AATA;EC60BI,qDAAA;EAAA,wDAAA;EAAA,0DAAA;EAAA,4DAAA;AD7zBJ","sourcesContent":["@use '@carbon/layout';\n\n$ui-01: #f4f4f4;\n$ui-02: #ffffff;\n$ui-03: #e0e0e0;\n$ui-04: #8d8d8d;\n$ui-05: #161616;\n$text-02: #525252;\n$text-03: #a8a8a8;\n$ui-background: #ffffff;\n$color-gray-30: #c6c6c6;\n$color-gray-70: #525252;\n$color-gray-100: #161616;\n$color-blue-60-2: #0f62fe;\n$color-blue-10: #edf5ff;\n$color-yellow-50: #feecae;\n$carbon--red-50: #fa4d56;\n$inverse-link: #78a9ff;\n$support-02: #24a148;\n$inverse-support-03: #f1c21b;\n$warning-background: #fff8e1;\n$openmrs-background-grey: #f4f4f4;\n$danger: #da1e28;\n$interactive-01: #0f62fe;\n$field-01: #f4f4f4;\n$grey-2: #e0e0e0;\n$labeldropdown: #c6c6c6;\n\n$brand-primary-10: #d9fbfb;\n$brand-primary-20: #9ef0f0;\n$brand-primary-30: #3ddbd9;\n$brand-primary-40: #08bdba;\n$brand-primary-50: #009d9a;\n\n/* 60,70 and 80 are already declared as brand-01, 02 and 03 respectively */\n\n$brand-primary-90: #022b30;\n$brand-primary-100: #081a1c;\n\n@mixin brand-01($property) {\n  #{$property}: #005d5d;\n  #{$property}: var(--brand-01);\n}\n\n@mixin brand-02($property) {\n  #{$property}: #004144;\n  #{$property}: var(--brand-02);\n}\n\n@mixin brand-03($property) {\n  #{$property}: #007d79;\n  #{$property}: var(--brand-03);\n}\n\n:root {\n  --brand-01: #005d5d;\n  --brand-02: #004144;\n  --brand-03: #007d79;\n  --bottom-nav-height: #{layout.$spacing-10};\n  --workspace-header-height: #{layout.$spacing-09};\n  --tablet-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--bottom-nav-height));\n  --desktop-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--workspace-header-height));\n}\n\n$breakpoint-phone-min: 0px;\n$breakpoint-phone-max: 600px;\n$breakpoint-tablet-min: 601px;\n$breakpoint-tablet-max: 1023px;\n$breakpoint-small-desktop-min: 1024px;\n$breakpoint-small-desktop-max: 1439px;\n$breakpoint-large-desktop-min: 1440px;\n$breakpoint-large-desktop-max: 99999999px;\n\n/* These color variables will be removed in a future release */\n$brand-teal-01: #007d79;\n$brand-01: #005d5d;\n$brand-02: #004144;\n","@use '@carbon/layout';\n@use '@carbon/type';\n@use '@openmrs/esm-styleguide/src/vars' as *;\n\n.container:after {\n  content: '';\n  height: 100%;\n  width: 1px;\n  position: absolute;\n  right: 0;\n  top: 0;\n  background-color: $color-gray-30;\n  margin: 0 layout.$spacing-05;\n}\n\n.details {\n  margin-top: 5px;\n  @include type.type-style('body-compact-01');\n  color: $text-02;\n}\n\n.name {\n  @include type.type-style('body-compact-02');\n}\n","//\n// Copyright IBM Corp. 2018, 2023\n//\n// This source code is licensed under the Apache-2.0 license found in the\n// LICENSE file in the root directory of this source tree.\n//\n\n// stylelint-disable number-max-precision\n\n@use 'sass:map';\n@use 'sass:math';\n@use '@carbon/grid/scss/config' as gridconfig;\n@use '@carbon/grid/scss/breakpoint' as grid;\n@use 'prefix' as *;\n@use 'font-family';\n@use 'scale';\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$caption-01: (\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$caption-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$label-01: (\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$label-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$legal-01: (\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$legal-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$helper-text-01: (\n  font-size: scale.type-scale(1),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$helper-text-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-short-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-compact-01: $body-short-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-long-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.42857,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-01: $body-long-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-short-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.375,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-compact-02: $body-short-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-long-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.5,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-02: $body-long-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$code-01: (\n  font-family: font-family.font-family('mono'),\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$code-02: (\n  font-family: font-family.font-family('mono'),\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.42857,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.42857,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-compact-01: $productive-heading-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.5,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.375,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-compact-02: $productive-heading-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-03: (\n  font-size: scale.type-scale(5),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.4,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-03: $productive-heading-03 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-04: (\n  font-size: scale.type-scale(7),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-04: $productive-heading-04 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-05: (\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.25,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-05: $productive-heading-05 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-06: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  // Extra digit needed for precision in Chrome\n  line-height: 1.199,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-06: $productive-heading-06 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-07: (\n  font-size: scale.type-scale(12),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-07: $productive-heading-07 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-01: $heading-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-02: $heading-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-03: (\n  font-size: scale.type-scale(5),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.4,\n  letter-spacing: 0,\n  breakpoints: (\n    xlg: (\n      font-size: scale.type-scale(5),\n      line-height: 1.4,\n    ),\n    max: (\n      font-size: scale.type-scale(6),\n      line-height: 1.334,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-03: $expressive-heading-03 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-04: (\n  font-size: scale.type-scale(7),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0,\n  breakpoints: (\n    xlg: (\n      font-size: scale.type-scale(8),\n      line-height: 1.25,\n      font-weight: font-family.font-weight('regular'),\n    ),\n    max: (\n      font-size: scale.type-scale(8),\n      font-weight: font-family.font-weight('regular'),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-04: $expressive-heading-04 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-05: (\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.25,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(9),\n      font-weight: font-family.font-weight('light'),\n      line-height: 1.22,\n    ),\n    lg: (\n      font-size: scale.type-scale(10),\n      line-height: 1.19,\n    ),\n    xlg: (\n      font-size: scale.type-scale(11),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(13),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-05: $expressive-heading-05 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-06: (\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.25,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(9),\n      line-height: 1.22,\n    ),\n    lg: (\n      font-size: scale.type-scale(10),\n      line-height: 1.19,\n    ),\n    xlg: (\n      font-size: scale.type-scale(11),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(13),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-06: $expressive-heading-06 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-paragraph-01: (\n  font-size: scale.type-scale(6),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.334,\n  letter-spacing: 0,\n  breakpoints: (\n    lg: (\n      font-size: scale.type-scale(7),\n      line-height: 1.28572,\n    ),\n    max: (\n      font-size: scale.type-scale(8),\n      line-height: 1.25,\n    ),\n  ),\n);\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-paragraph-01: $expressive-paragraph-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$quotation-01: (\n  font-family: font-family.font-family('serif'),\n  font-size: scale.type-scale(5),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.3,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(5),\n    ),\n    lg: (\n      font-size: scale.type-scale(6),\n      line-height: 1.334,\n    ),\n    xlg: (\n      font-size: scale.type-scale(7),\n      line-height: 1.28572,\n    ),\n    max: (\n      font-size: scale.type-scale(8),\n      line-height: 1.25,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-quotation-01: $quotation-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$quotation-02: (\n  font-family: font-family.font-family('serif'),\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.25,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(9),\n      line-height: 1.22,\n    ),\n    lg: (\n      font-size: scale.type-scale(10),\n      line-height: 1.19,\n    ),\n    xlg: (\n      font-size: scale.type-scale(11),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(13),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-quotation-02: $quotation-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-01: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(10),\n    ),\n    lg: (\n      font-size: scale.type-scale(12),\n    ),\n    xlg: (\n      font-size: scale.type-scale(13),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(15),\n      line-height: 1.13,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-01: $display-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-02: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(10),\n    ),\n    lg: (\n      font-size: scale.type-scale(12),\n    ),\n    xlg: (\n      font-size: scale.type-scale(13),\n      line-height: 1.16,\n    ),\n    max: (\n      font-size: scale.type-scale(15),\n      line-height: 1.13,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-02: $display-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-03: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(12),\n      line-height: 1.18,\n    ),\n    lg: (\n      font-size: scale.type-scale(13),\n      line-height: 1.16,\n      letter-spacing: -0.64px,\n    ),\n    xlg: (\n      font-size: scale.type-scale(15),\n      line-height: 1.13,\n      letter-spacing: -0.64px,\n    ),\n    max: (\n      font-size: scale.type-scale(16),\n      line-height: 1.11,\n      letter-spacing: -0.96px,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-03: $display-03 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-04: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(14),\n      line-height: 1.15,\n    ),\n    lg: (\n      font-size: scale.type-scale(17),\n      line-height: 1.11,\n      letter-spacing: -0.64px,\n    ),\n    xlg: (\n      font-size: scale.type-scale(20),\n      line-height: 1.07,\n      letter-spacing: -0.64px,\n    ),\n    max: (\n      font-size: scale.type-scale(23),\n      line-height: 1.05,\n      letter-spacing: -0.96px,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-04: $display-04 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$tokens: (\n  caption-01: $caption-01,\n  caption-02: $caption-02,\n  label-01: $label-01,\n  label-02: $label-02,\n  helper-text-01: $helper-text-01,\n  helper-text-02: $helper-text-02,\n  body-short-01: $body-short-01,\n  body-short-02: $body-short-02,\n  body-long-01: $body-long-01,\n  body-long-02: $body-long-02,\n  code-01: $code-01,\n  code-02: $code-02,\n  heading-01: $heading-01,\n  heading-02: $heading-02,\n  productive-heading-01: $productive-heading-01,\n  productive-heading-02: $productive-heading-02,\n  productive-heading-03: $productive-heading-03,\n  productive-heading-04: $productive-heading-04,\n  productive-heading-05: $productive-heading-05,\n  productive-heading-06: $productive-heading-06,\n  productive-heading-07: $productive-heading-07,\n  expressive-paragraph-01: $expressive-paragraph-01,\n  expressive-heading-01: $expressive-heading-01,\n  expressive-heading-02: $expressive-heading-02,\n  expressive-heading-03: $expressive-heading-03,\n  expressive-heading-04: $expressive-heading-04,\n  expressive-heading-05: $expressive-heading-05,\n  expressive-heading-06: $expressive-heading-06,\n  quotation-01: $quotation-01,\n  quotation-02: $quotation-02,\n  display-01: $display-01,\n  display-02: $display-02,\n  display-03: $display-03,\n  display-04: $display-04,\n  // V11 Tokens\n  legal-01: $legal-01,\n  legal-02: $legal-02,\n  body-compact-01: $body-compact-01,\n  body-compact-02: $body-compact-02,\n  heading-compact-01: $heading-compact-01,\n  heading-compact-02: $heading-compact-02,\n  body-01: $body-01,\n  body-02: $body-02,\n  heading-03: $heading-03,\n  heading-04: $heading-04,\n  heading-05: $heading-05,\n  heading-06: $heading-06,\n  heading-07: $heading-07,\n  fluid-heading-03: $fluid-heading-03,\n  fluid-heading-04: $fluid-heading-04,\n  fluid-heading-05: $fluid-heading-05,\n  fluid-heading-06: $fluid-heading-06,\n  fluid-paragraph-01: $fluid-paragraph-01,\n  fluid-quotation-01: $fluid-quotation-01,\n  fluid-quotation-02: $fluid-quotation-02,\n  fluid-display-01: $fluid-display-01,\n  fluid-display-02: $fluid-display-02,\n  fluid-display-03: $fluid-display-03,\n  fluid-display-04: $fluid-display-04,\n) !default;\n\n/// @param {Map} $map\n/// @access public\n/// @group @carbon/type\n@mixin properties($map) {\n  @each $name, $value in $map {\n    #{$name}: $value;\n  }\n}\n\n/// @param {Number} $value - Number with units\n/// @return {Number} Without units\n/// @access public\n/// @group @carbon/type\n@function strip-unit($value) {\n  @return math.div($value, $value * 0 + 1);\n}\n\n/// This helper includes fluid type styles for the given token value. Fluid type\n/// means that the `font-size` is computed using `calc()` in order to be\n/// determined by the screen size instead of a breakpoint. As a result, fluid\n/// styles should be used with caution in fixed width contexts.\n///\n/// In addition, we make use of %-based line-heights so that the line-height of\n/// each type style is computed correctly due to the dynamic nature of the\n/// `font-size`.\n///\n/// Most of the logic for this work comes from CSS Tricks:\n/// https://css-tricks.com/snippets/css/fluid-typography/\n///\n/// @param {Map} $type-styles - The value of a given type token\n/// @param {Map} $breakpoints [$grid-breakpoints] - Custom breakpoints to use\n/// @access public\n/// @group @carbon/type\n@mixin fluid-type($type-styles, $breakpoints: gridconfig.$grid-breakpoints) {\n  // Include the initial styles for the given token by default without any\n  // media query guard. This includes `font-size` as a fallback in the case\n  // that a browser does not support `calc()`\n  @include properties(map.remove($type-styles, breakpoints));\n  // We also need to include the `sm` styles by default since they don't\n  // appear in the fluid styles for tokens\n  @include fluid-type-size($type-styles, sm, $breakpoints);\n\n  // Finally, we need to go through all the breakpoints defined in the type\n  // token and apply the properties and fluid type size for that given\n  // breakpoint\n  @each $name, $values in map.get($type-styles, breakpoints) {\n    @include grid.breakpoint($name) {\n      @include properties($values);\n      @include fluid-type-size($type-styles, $name, $breakpoints);\n    }\n  }\n}\n\n/// Computes the fluid `font-size` for a given type style and breakpoint\n/// @param {Map} $type-styles - The styles for a given token\n/// @param {String} $name - The name of the breakpoint to which we apply the fluid\n/// @param {Map} $breakpoints [$grid-breakpoints] - The breakpoints for the grid system\n/// @access public\n/// @group @carbon/type\n@mixin fluid-type-size(\n  $type-styles,\n  $name,\n  $breakpoints: gridconfig.$grid-breakpoints\n) {\n  // Get the information about the breakpoint we're currently working in. Useful\n  // for getting initial width information\n  $breakpoint: map.get($breakpoints, $name);\n\n  // Our fluid styles are captured under the 'breakpoints' property in our type\n  // styles map. These define what values to treat as `max-` variables below\n  $fluid-sizes: map.get($type-styles, breakpoints);\n  $fluid-breakpoint: ();\n  // Special case for `sm` because the styles for small are on the type style\n  // directly\n  @if $name == sm {\n    $fluid-breakpoint: map.remove($type-styles, breakpoints);\n  } @else {\n    $fluid-breakpoint: map.get($fluid-sizes, $name);\n  }\n\n  // Initialize our font-sizes to the default size for the type style\n  $max-font-size: map.get($type-styles, font-size);\n  $min-font-size: map.get($type-styles, font-size);\n  @if map.has-key($fluid-breakpoint, font-size) {\n    $min-font-size: map.get($fluid-breakpoint, font-size);\n  }\n\n  // Initialize our min and max width to the width of the current breakpoint\n  $max-vw: map.get($breakpoint, width);\n  $min-vw: map.get($breakpoint, width);\n\n  // We can use `breakpoint-next` to see if there is another breakpoint we can\n  // use to update `max-font-size` and `max-vw` with larger values\n  $next-breakpoint-available: grid.breakpoint-next($name, $breakpoints);\n  $next-fluid-breakpoint-name: null;\n\n  // We need to figure out what the next available fluid breakpoint is for our\n  // given $type-styles. In this loop we try and iterate through breakpoints\n  // until we either manually set $next-breakpoint-available to null or\n  // `breakpoint-next` returns null.\n  @while $next-breakpoint-available {\n    @if map.has-key($fluid-sizes, $next-breakpoint-available) {\n      $next-fluid-breakpoint-name: $next-breakpoint-available;\n      $next-breakpoint-available: null;\n    } @else {\n      $next-breakpoint-available: grid.breakpoint-next(\n        $next-breakpoint-available,\n        $breakpoints\n      );\n    }\n  }\n\n  // If we have found the next available fluid breakpoint name, then we know\n  // that we have values that we can use to set max-font-size and max-vw as both\n  // values derive from the next breakpoint\n  @if $next-fluid-breakpoint-name {\n    $next-fluid-breakpoint: map.get($breakpoints, $next-fluid-breakpoint-name);\n    $max-font-size: map.get(\n      map.get($fluid-sizes, $next-fluid-breakpoint-name),\n      font-size\n    );\n    $max-vw: map.get($next-fluid-breakpoint, width);\n\n    // prettier-ignore\n    font-size: calc(#{$min-font-size} +\n      #{strip-unit($max-font-size - $min-font-size)} *\n      ((100vw - #{$min-vw}) / #{strip-unit($max-vw - $min-vw)})\n    );\n  } @else {\n    // Otherwise, just default to setting the font size found from the type\n    // style or the given fluid breakpoint in the type style\n    font-size: $min-font-size;\n  }\n}\n\n// TODO move following variable and `custom-property` mixin into shared file for\n// both `@carbon/type` and `@carbon/themes`\n\n/// @access private\n/// @group @carbon/type\n@mixin custom-properties($name, $value) {\n  @each $property, $value in $value {\n    #{$property}: var(\n      --#{$custom-property-prefix}-#{$name}-#{$property},\n      #{$value}\n    );\n  }\n}\n\n/// Helper mixin to include the styles for a given token in any selector in your\n/// project. Also includes an optional fluid option that will enable fluid\n/// styles for the token if they are defined. Fluid styles will cause the\n/// token's font-size to be computed based on the viewport size. As a result, use\n/// with caution in fixed contexts.\n/// @param {String} $name - The name of the token to get the styles for\n/// @param {Boolean} $fluid [false] - Specify whether to include fluid styles for the\n/// @param {Map} $breakpoints [$grid-breakpoints] - Provide a custom breakpoint map to use\n/// @access public\n/// @group @carbon/type\n@mixin type-style(\n  $name,\n  $fluid: false,\n  $breakpoints: gridconfig.$grid-breakpoints\n) {\n  @if not map.has-key($tokens, $name) {\n    @error 'Unable to find a token with the name: `#{$name}`';\n  }\n\n  $token: map.get($tokens, $name);\n\n  // If $fluid is set to true and the token has breakpoints defined for fluid\n  // styles, delegate to the fluid-type helper for the given token\n  @if $fluid == true and map.has-key($token, 'breakpoints') {\n    @include fluid-type($token, $breakpoints);\n  } @else {\n    @include custom-properties($name, $token);\n  }\n}\n"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"container": "-esm-patient-chart__patient-details-tile__container___U7W00",
	"details": "-esm-patient-chart__patient-details-tile__details___V8C3v",
	"name": "-esm-patient-chart__patient-details-tile__name___2mQg6"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/root.scss":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/root.scss ***!
  \**************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".-esm-patient-chart__root__patientChartWrapper___rIbt0 {\n  display: flex;\n  position: relative;\n}\n\n.-esm-patient-chart__root__patientChartWrapper___rIbt0 > nav {\n  padding-bottom: 3rem;\n  scrollbar-width: none;\n}\n.-esm-patient-chart__root__patientChartWrapper___rIbt0 .cds--side-nav__overlay-active {\n  background-color: transparent;\n}\n\n.omrs-breakpoint-gt-tablet .-esm-patient-chart__root__patientChartWrapper___rIbt0 {\n  margin-left: var(--omrs-sidenav-width);\n}\n\n.omrs-breakpoint-lt-desktop .-esm-patient-chart__root__patientChartWrapper___rIbt0 .cds--side-nav {\n  height: calc(100vh - 3rem - var(--bottom-nav-height));\n}\n\nhtml[dir=rtl] .cds--date-picker-input__wrapper svg {\n  left: 1rem;\n  right: unset;\n}\nhtml[dir=rtl] .cds--side-nav {\n  right: 0;\n}\nhtml[dir=rtl] .cds--side-nav .active-left-nav-link {\n  border-right: 0.25rem solid var(--brand-01);\n  border-left: unset;\n}\nhtml[dir=rtl] .omrs-breakpoint-gt-tablet .-esm-patient-chart__root__patientChartWrapper___rIbt0 {\n  margin-right: var(--omrs-sidenav-width);\n  margin-left: unset;\n}", "",{"version":3,"sources":["webpack://./src/root.scss","webpack://./../../node_modules/@carbon/layout/scss/generated/_spacing.scss"],"names":[],"mappings":"AAIA;EACE,aAAA;EACA,kBAAA;AAHF;;AAOE;EACE,oBCwCS;EDvCT,qBAAA;AAJJ;AAOE;EACE,6BAAA;AALJ;;AASA;EACE,sCAAA;AANF;;AAYI;EACE,qDAAA;AATN;;AAiBI;EACE,UCNO;EDOP,YAAA;AAdN;AAiBE;EACE,QAAA;AAfJ;AAgBI;EACE,2CAAA;EACA,kBAAA;AAdN;AAkBE;EACE,uCAAA;EACA,kBAAA;AAhBJ","sourcesContent":["@use '@carbon/colors';\n@use '@carbon/layout';\n@use '@carbon/type';\n\n.patientChartWrapper {\n  display: flex;\n  position: relative;\n}\n\n.patientChartWrapper {\n  & > nav {\n    padding-bottom: layout.$spacing-09;\n    scrollbar-width: none;\n  }\n\n  :global(.cds--side-nav__overlay-active) {\n    background-color: transparent;\n  }\n}\n\n:global(.omrs-breakpoint-gt-tablet) .patientChartWrapper {\n  margin-left: var(--omrs-sidenav-width);\n}\n\n// Tablet side nav scrolling\n:global(.omrs-breakpoint-lt-desktop) {\n  .patientChartWrapper {\n    :global(.cds--side-nav) {\n      height: calc(100vh - layout.$spacing-09 - var(--bottom-nav-height));\n    }\n  }\n}\n\n// Overriding styles for RTL support\nhtml[dir='rtl'] {\n  :global(.cds--date-picker-input__wrapper) {\n    svg {\n      left: layout.$spacing-05;\n      right: unset;\n    }\n  }\n  :global(.cds--side-nav) {\n    right: 0;\n    :global(.active-left-nav-link) {\n      border-right: layout.$spacing-02 solid var(--brand-01);\n      border-left: unset;\n    }\n  }\n\n  :global(.omrs-breakpoint-gt-tablet) .patientChartWrapper {\n    margin-right: var(--omrs-sidenav-width);\n    margin-left: unset;\n  }\n}\n","// Code generated by @carbon/layout. DO NOT EDIT.\n//\n// Copyright IBM Corp. 2018, 2023\n//\n// This source code is licensed under the Apache-2.0 license found in the\n// LICENSE file in the root directory of this source tree.\n//\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-01: 0.125rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-02: 0.25rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-03: 0.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-04: 0.75rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-05: 1rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-06: 1.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-07: 2rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-08: 2.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-09: 3rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-10: 4rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-11: 5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-12: 6rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-13: 10rem !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/layout\n$spacing: (\n  spacing-01: $spacing-01,\n  spacing-02: $spacing-02,\n  spacing-03: $spacing-03,\n  spacing-04: $spacing-04,\n  spacing-05: $spacing-05,\n  spacing-06: $spacing-06,\n  spacing-07: $spacing-07,\n  spacing-08: $spacing-08,\n  spacing-09: $spacing-09,\n  spacing-10: $spacing-10,\n  spacing-11: $spacing-11,\n  spacing-12: $spacing-12,\n  spacing-13: $spacing-13,\n);\n"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"patientChartWrapper": "-esm-patient-chart__root__patientChartWrapper___rIbt0"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visit-history-table/visit-actions-cell.scss":
/*!******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visit-history-table/visit-actions-cell.scss ***!
  \******************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".-esm-patient-chart__visit-actions-cell__visitActions___i0Lk4 {\n  display: flex;\n  align-items: center;\n}", "",{"version":3,"sources":["webpack://./src/visit/visit-history-table/visit-actions-cell.scss"],"names":[],"mappings":"AAAA;EACE,aAAA;EACA,mBAAA;AACF","sourcesContent":[".visitActions {\n  display: flex;\n  align-items: center;\n}\n"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"visitActions": "-esm-patient-chart__visit-actions-cell__visitActions___i0Lk4"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visit-history-table/visit-history-table.scss":
/*!*******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visit-history-table/visit-history-table.scss ***!
  \*******************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* 60,70 and 80 are already declared as brand-01, 02 and 03 respectively */\n:root {\n  --brand-01: #005d5d;\n  --brand-02: #004144;\n  --brand-03: #007d79;\n  --bottom-nav-height: 4rem;\n  --workspace-header-height: 3rem;\n  --tablet-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--bottom-nav-height));\n  --desktop-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--workspace-header-height));\n}\n\n/* These color variables will be removed in a future release */\n.-esm-patient-chart__visit-history-table__container___rhJ6s {\n  margin: 1rem 0;\n  border: 1px solid #e0e0e0;\n}\n.-esm-patient-chart__visit-history-table__container___rhJ6s tr.cds--parent-row.cds--expandable-row + tr[data-child-row] td {\n  padding-inline-start: 1rem;\n}\n\n.-esm-patient-chart__visit-history-table__emptyStateContainer___ougfK {\n  text-align: center;\n  margin: 1rem 0;\n}\n\n.-esm-patient-chart__visit-history-table__actionsColumn___v\\+qcF {\n  width: 1% !important;\n}\n\n.-esm-patient-chart__visit-history-table__hiddenRow___\\+5HWK {\n  display: none;\n}", "",{"version":3,"sources":["webpack://./../../node_modules/@openmrs/esm-styleguide/src/_vars.scss","webpack://./src/visit/visit-history-table/visit-history-table.scss","webpack://./../../node_modules/@carbon/layout/scss/generated/_spacing.scss"],"names":[],"mappings":"AAkCA,0EAAA;AAoBA;EACE,mBAAA;EACA,mBAAA;EACA,mBAAA;EACA,yBAAA;EACA,+BAAA;EACA,oGAAA;EACA,2GAAA;ACpDF;;ADgEA,8DAAA;ACtEA;EACE,cAAA;EACA,yBAAA;AAUF;AAPE;EACE,0BCsBS;ADbb;;AALA;EACE,kBAAA;EACA,cAAA;AAQF;;AALA;EACE,oBAAA;AAQF;;AALA;EACE,aAAA;AAQF","sourcesContent":["@use '@carbon/layout';\n\n$ui-01: #f4f4f4;\n$ui-02: #ffffff;\n$ui-03: #e0e0e0;\n$ui-04: #8d8d8d;\n$ui-05: #161616;\n$text-02: #525252;\n$text-03: #a8a8a8;\n$ui-background: #ffffff;\n$color-gray-30: #c6c6c6;\n$color-gray-70: #525252;\n$color-gray-100: #161616;\n$color-blue-60-2: #0f62fe;\n$color-blue-10: #edf5ff;\n$color-yellow-50: #feecae;\n$carbon--red-50: #fa4d56;\n$inverse-link: #78a9ff;\n$support-02: #24a148;\n$inverse-support-03: #f1c21b;\n$warning-background: #fff8e1;\n$openmrs-background-grey: #f4f4f4;\n$danger: #da1e28;\n$interactive-01: #0f62fe;\n$field-01: #f4f4f4;\n$grey-2: #e0e0e0;\n$labeldropdown: #c6c6c6;\n\n$brand-primary-10: #d9fbfb;\n$brand-primary-20: #9ef0f0;\n$brand-primary-30: #3ddbd9;\n$brand-primary-40: #08bdba;\n$brand-primary-50: #009d9a;\n\n/* 60,70 and 80 are already declared as brand-01, 02 and 03 respectively */\n\n$brand-primary-90: #022b30;\n$brand-primary-100: #081a1c;\n\n@mixin brand-01($property) {\n  #{$property}: #005d5d;\n  #{$property}: var(--brand-01);\n}\n\n@mixin brand-02($property) {\n  #{$property}: #004144;\n  #{$property}: var(--brand-02);\n}\n\n@mixin brand-03($property) {\n  #{$property}: #007d79;\n  #{$property}: var(--brand-03);\n}\n\n:root {\n  --brand-01: #005d5d;\n  --brand-02: #004144;\n  --brand-03: #007d79;\n  --bottom-nav-height: #{layout.$spacing-10};\n  --workspace-header-height: #{layout.$spacing-09};\n  --tablet-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--bottom-nav-height));\n  --desktop-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--workspace-header-height));\n}\n\n$breakpoint-phone-min: 0px;\n$breakpoint-phone-max: 600px;\n$breakpoint-tablet-min: 601px;\n$breakpoint-tablet-max: 1023px;\n$breakpoint-small-desktop-min: 1024px;\n$breakpoint-small-desktop-max: 1439px;\n$breakpoint-large-desktop-min: 1440px;\n$breakpoint-large-desktop-max: 99999999px;\n\n/* These color variables will be removed in a future release */\n$brand-teal-01: #007d79;\n$brand-01: #005d5d;\n$brand-02: #004144;\n","@use '@carbon/layout';\n@use '@openmrs/esm-styleguide/src/vars' as *;\n\n.container {\n  margin: layout.$spacing-05 0;\n  border: 1px solid $ui-03;\n\n  // fixes padding of encounters table within the expanded visit table row\n  :global(tr.cds--parent-row.cds--expandable-row + tr[data-child-row] td) {\n    padding-inline-start: layout.$spacing-05;\n  }\n}\n\n.emptyStateContainer {\n  text-align: center;\n  margin: layout.$spacing-05 0;\n}\n\n.actionsColumn {\n  width: 1% !important; // fixes the width of action column to fit content\n}\n\n.hiddenRow {\n  display: none;\n}\n","// Code generated by @carbon/layout. DO NOT EDIT.\n//\n// Copyright IBM Corp. 2018, 2023\n//\n// This source code is licensed under the Apache-2.0 license found in the\n// LICENSE file in the root directory of this source tree.\n//\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-01: 0.125rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-02: 0.25rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-03: 0.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-04: 0.75rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-05: 1rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-06: 1.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-07: 2rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-08: 2.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-09: 3rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-10: 4rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-11: 5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-12: 6rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-13: 10rem !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/layout\n$spacing: (\n  spacing-01: $spacing-01,\n  spacing-02: $spacing-02,\n  spacing-03: $spacing-03,\n  spacing-04: $spacing-04,\n  spacing-05: $spacing-05,\n  spacing-06: $spacing-06,\n  spacing-07: $spacing-07,\n  spacing-08: $spacing-08,\n  spacing-09: $spacing-09,\n  spacing-10: $spacing-10,\n  spacing-11: $spacing-11,\n  spacing-12: $spacing-12,\n  spacing-13: $spacing-13,\n);\n"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"container": "-esm-patient-chart__visit-history-table__container___rhJ6s",
	"emptyStateContainer": "-esm-patient-chart__visit-history-table__emptyStateContainer___ougfK",
	"actionsColumn": "-esm-patient-chart__visit-history-table__actionsColumn___v+qcF",
	"hiddenRow": "-esm-patient-chart__visit-history-table__hiddenRow___+5HWK"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/encounter-observations/styles.scss":
/*!***********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/encounter-observations/styles.scss ***!
  \***********************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".-esm-patient-chart__styles__observation___ZeYLX {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  grid-gap: 0.5rem;\n  margin-block: 1rem;\n  margin-inline: 0 1rem;\n}\n\n.-esm-patient-chart__styles__observation___ZeYLX > span {\n  align-self: center;\n  justify-self: start;\n}\n\n.-esm-patient-chart__styles__parentConcept___H2xxT {\n  font-weight: bold;\n}\n\n.-esm-patient-chart__styles__childConcept___isRM6 {\n  padding-inline-start: 0.75rem;\n}", "",{"version":3,"sources":["webpack://./src/visit/visits-widget/encounter-observations/styles.scss","webpack://./../../node_modules/@carbon/layout/scss/generated/_spacing.scss"],"names":[],"mappings":"AAEA;EACE,aAAA;EACA,8BAAA;EACA,gBCgBW;EDfX,kBCyBW;EDxBX,qBAAA;AADF;;AAIA;EACE,kBAAA;EACA,mBAAA;AADF;;AAIA;EACE,iBAAA;AADF;;AAIA;EACE,6BCMW;ADPb","sourcesContent":["@use '@carbon/layout';\n\n.observation {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  grid-gap: layout.$spacing-03;\n  margin-block: layout.$spacing-05;\n  margin-inline: 0 layout.$spacing-05;\n}\n\n.observation > span {\n  align-self: center;\n  justify-self: start;\n}\n\n.parentConcept {\n  font-weight: bold;\n}\n\n.childConcept {\n  padding-inline-start: layout.$spacing-04;\n}\n","// Code generated by @carbon/layout. DO NOT EDIT.\n//\n// Copyright IBM Corp. 2018, 2023\n//\n// This source code is licensed under the Apache-2.0 license found in the\n// LICENSE file in the root directory of this source tree.\n//\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-01: 0.125rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-02: 0.25rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-03: 0.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-04: 0.75rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-05: 1rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-06: 1.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-07: 2rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-08: 2.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-09: 3rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-10: 4rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-11: 5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-12: 6rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-13: 10rem !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/layout\n$spacing: (\n  spacing-01: $spacing-01,\n  spacing-02: $spacing-02,\n  spacing-03: $spacing-03,\n  spacing-04: $spacing-04,\n  spacing-05: $spacing-05,\n  spacing-06: $spacing-06,\n  spacing-07: $spacing-07,\n  spacing-08: $spacing-08,\n  spacing-09: $spacing-09,\n  spacing-10: $spacing-10,\n  spacing-11: $spacing-11,\n  spacing-12: $spacing-12,\n  spacing-13: $spacing-13,\n);\n"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"observation": "-esm-patient-chart__styles__observation___ZeYLX",
	"parentConcept": "-esm-patient-chart__styles__parentConcept___H2xxT",
	"childConcept": "-esm-patient-chart__styles__childConcept___isRM6"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/past-visits-components/encounters-table/encounters-table.scss":
/*!**************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/past-visits-components/encounters-table/encounters-table.scss ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* 60,70 and 80 are already declared as brand-01, 02 and 03 respectively */\n:root {\n  --brand-01: #005d5d;\n  --brand-02: #004144;\n  --brand-03: #007d79;\n  --bottom-nav-height: 4rem;\n  --workspace-header-height: 3rem;\n  --tablet-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--bottom-nav-height));\n  --desktop-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--workspace-header-height));\n}\n\n/* These color variables will be removed in a future release */\n.-esm-patient-chart__encounters-table__container___OasQC {\n  margin: 1rem 0;\n  border: 1px solid #e0e0e0;\n}\n\n.-esm-patient-chart__encounters-table__tableContainer___Qudmq {\n  padding: 0;\n  border-bottom: none;\n}\n.-esm-patient-chart__encounters-table__tableContainer___Qudmq .cds--data-table-header {\n  padding: 0;\n}\n.-esm-patient-chart__encounters-table__tableContainer___Qudmq .cds--table-toolbar {\n  position: relative;\n  overflow: visible;\n  top: 0;\n}\n.-esm-patient-chart__encounters-table__tableContainer___Qudmq.cds--data-table-container {\n  background: none !important;\n}\n\n.-esm-patient-chart__encounters-table__paginationContainer___zFwqx > div {\n  border: 1px solid #e0e0e0 !important;\n  border-top: none !important;\n}\n\n.-esm-patient-chart__encounters-table__filterContainer___ZEcWe .cds--dropdown__wrapper--inline {\n  gap: 0;\n}\n.-esm-patient-chart__encounters-table__filterContainer___ZEcWe .cds--list-box__menu-icon {\n  height: 1rem;\n}\n.-esm-patient-chart__encounters-table__filterContainer___ZEcWe label {\n  margin-right: 1rem !important;\n}\n\n.-esm-patient-chart__encounters-table__search___-gPNu {\n  max-width: 16rem;\n}\n\n.-esm-patient-chart__encounters-table__menuItem___vaBSE {\n  max-width: none;\n}\n\n.-esm-patient-chart__encounters-table__expandedRow___2bijG {\n  padding-inline-start: 3.5rem;\n}\n.-esm-patient-chart__encounters-table__expandedRow___2bijG > td {\n  padding: inherit !important;\n}\n.-esm-patient-chart__encounters-table__expandedRow___2bijG > td > div {\n  max-height: max-content !important;\n}\n.-esm-patient-chart__encounters-table__expandedRow___2bijG > div {\n  background-color: #ffffff;\n}\n\n.-esm-patient-chart__encounters-table__hiddenRow___mH\\+Nc {\n  display: none;\n}\n\n.-esm-patient-chart__encounters-table__content___2TAho {\n  font-size: var(--cds-heading-compact-02-font-size, 1rem);\n  font-weight: var(--cds-heading-compact-02-font-weight, 600);\n  line-height: var(--cds-heading-compact-02-line-height, 1.375);\n  letter-spacing: var(--cds-heading-compact-02-letter-spacing, 0);\n  color: #525252;\n  margin-bottom: 0.5rem;\n}\n\n.-esm-patient-chart__encounters-table__tileContainer___T2DE9 {\n  background-color: #ffffff;\n  border-top: 1px solid #e0e0e0;\n  padding: 5rem 0;\n}\n\n.-esm-patient-chart__encounters-table__tile___uktoD {\n  margin: auto;\n  width: fit-content;\n}\n\n.-esm-patient-chart__encounters-table__tileContent___9sqfZ {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.-esm-patient-chart__encounters-table__helper___ZKd0g {\n  font-size: var(--cds-body-compact-01-font-size, 0.875rem);\n  font-weight: var(--cds-body-compact-01-font-weight, 400);\n  line-height: var(--cds-body-compact-01-line-height, 1.28572);\n  letter-spacing: var(--cds-body-compact-01-letter-spacing, 0.16px);\n  color: #525252;\n}\n\n.-esm-patient-chart__encounters-table__layer___eGgog {\n  height: 100%;\n}\n.-esm-patient-chart__encounters-table__layer___eGgog .cds--btn--primary {\n  background-color: unset;\n}", "",{"version":3,"sources":["webpack://./../../node_modules/@openmrs/esm-styleguide/src/_vars.scss","webpack://./src/visit/visits-widget/past-visits-components/encounters-table/encounters-table.scss","webpack://./../../node_modules/@carbon/layout/scss/generated/_spacing.scss","webpack://./../../node_modules/@carbon/type/scss/_styles.scss"],"names":[],"mappings":"AAkCA,0EAAA;AAoBA;EACE,mBAAA;EACA,mBAAA;EACA,mBAAA;EACA,yBAAA;EACA,+BAAA;EACA,oGAAA;EACA,2GAAA;ACpDF;;ADgEA,8DAAA;ACrEA;EACE,cAAA;EACA,yBAAA;AASF;;AANA;EACE,UAAA;EACA,mBAAA;AASF;AAPE;EACE,UAAA;AASJ;AANE;EACE,kBAAA;EACA,iBAAA;EACA,MAAA;AAQJ;AALE;EACE,2BAAA;AAOJ;;AAFE;EACE,oCAAA;EACA,2BAAA;AAKJ;;AAAE;EACE,MAAA;AAGJ;AAAE;EACE,YCVS;ADYb;AACE;EACE,6BAAA;AACJ;;AAGA;EACE,gBAAA;AAAF;;AAGA;EACE,eAAA;AAAF;;AAGA;EACE,4BAAA;AAAF;AAEE;EACE,2BAAA;AAAJ;AAEI;EACE,kCAAA;AAAN;AAIE;EACE,yBDlEI;ACgER;;AAMA;EACE,aAAA;AAHF;;AAMA;EEqxBI,wDAAA;EAAA,2DAAA;EAAA,6DAAA;EAAA,+DAAA;EFnxBF,cDxEQ;ECyER,qBC3DW;AD2Db;;AAGA;EACE,yBDjFM;ECkFN,6BAAA;EACA,eAAA;AAAF;;AAGA;EACE,YAAA;EACA,kBAAA;AAAF;;AAGA;EACE,aAAA;EACA,sBAAA;EACA,mBAAA;AAAF;;AAGA;EE8vBI,yDAAA;EAAA,wDAAA;EAAA,4DAAA;EAAA,iEAAA;EF5vBF,cD/FQ;ACkGV;;AAAA;EACE,YAAA;AAGF;AADE;EACE,uBAAA;AAGJ","sourcesContent":["@use '@carbon/layout';\n\n$ui-01: #f4f4f4;\n$ui-02: #ffffff;\n$ui-03: #e0e0e0;\n$ui-04: #8d8d8d;\n$ui-05: #161616;\n$text-02: #525252;\n$text-03: #a8a8a8;\n$ui-background: #ffffff;\n$color-gray-30: #c6c6c6;\n$color-gray-70: #525252;\n$color-gray-100: #161616;\n$color-blue-60-2: #0f62fe;\n$color-blue-10: #edf5ff;\n$color-yellow-50: #feecae;\n$carbon--red-50: #fa4d56;\n$inverse-link: #78a9ff;\n$support-02: #24a148;\n$inverse-support-03: #f1c21b;\n$warning-background: #fff8e1;\n$openmrs-background-grey: #f4f4f4;\n$danger: #da1e28;\n$interactive-01: #0f62fe;\n$field-01: #f4f4f4;\n$grey-2: #e0e0e0;\n$labeldropdown: #c6c6c6;\n\n$brand-primary-10: #d9fbfb;\n$brand-primary-20: #9ef0f0;\n$brand-primary-30: #3ddbd9;\n$brand-primary-40: #08bdba;\n$brand-primary-50: #009d9a;\n\n/* 60,70 and 80 are already declared as brand-01, 02 and 03 respectively */\n\n$brand-primary-90: #022b30;\n$brand-primary-100: #081a1c;\n\n@mixin brand-01($property) {\n  #{$property}: #005d5d;\n  #{$property}: var(--brand-01);\n}\n\n@mixin brand-02($property) {\n  #{$property}: #004144;\n  #{$property}: var(--brand-02);\n}\n\n@mixin brand-03($property) {\n  #{$property}: #007d79;\n  #{$property}: var(--brand-03);\n}\n\n:root {\n  --brand-01: #005d5d;\n  --brand-02: #004144;\n  --brand-03: #007d79;\n  --bottom-nav-height: #{layout.$spacing-10};\n  --workspace-header-height: #{layout.$spacing-09};\n  --tablet-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--bottom-nav-height));\n  --desktop-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--workspace-header-height));\n}\n\n$breakpoint-phone-min: 0px;\n$breakpoint-phone-max: 600px;\n$breakpoint-tablet-min: 601px;\n$breakpoint-tablet-max: 1023px;\n$breakpoint-small-desktop-min: 1024px;\n$breakpoint-small-desktop-max: 1439px;\n$breakpoint-large-desktop-min: 1440px;\n$breakpoint-large-desktop-max: 99999999px;\n\n/* These color variables will be removed in a future release */\n$brand-teal-01: #007d79;\n$brand-01: #005d5d;\n$brand-02: #004144;\n","@use '@carbon/layout';\n@use '@carbon/type';\n@use '@openmrs/esm-styleguide/src/vars' as *;\n\n.container {\n  margin: layout.$spacing-05 0;\n  border: 1px solid $ui-03;\n}\n\n.tableContainer {\n  padding: 0;\n  border-bottom: none;\n\n  :global(.cds--data-table-header) {\n    padding: 0;\n  }\n\n  :global(.cds--table-toolbar) {\n    position: relative;\n    overflow: visible;\n    top: 0;\n  }\n\n  &:global(.cds--data-table-container) {\n    background: none !important;\n  }\n}\n\n.paginationContainer {\n  > div {\n    border: 1px solid $ui-03 !important;\n    border-top: none !important;\n  }\n}\n\n.filterContainer {\n  :global(.cds--dropdown__wrapper--inline) {\n    gap: 0;\n  }\n\n  :global(.cds--list-box__menu-icon) {\n    height: layout.$spacing-05;\n  }\n\n  label {\n    margin-right: layout.$spacing-05 !important;\n  }\n}\n\n.search {\n  max-width: 16rem;\n}\n\n.menuItem {\n  max-width: none;\n}\n\n.expandedRow {\n  padding-inline-start: 3.5rem;\n\n  > td {\n    padding: inherit !important;\n\n    > div {\n      max-height: max-content !important;\n    }\n  }\n\n  > div {\n    background-color: $ui-02;\n  }\n}\n\n.hiddenRow {\n  display: none;\n}\n\n.content {\n  @include type.type-style('heading-compact-02');\n  color: $text-02;\n  margin-bottom: layout.$spacing-03;\n}\n\n.tileContainer {\n  background-color: $ui-02;\n  border-top: 1px solid $ui-03;\n  padding: layout.$spacing-11 0;\n}\n\n.tile {\n  margin: auto;\n  width: fit-content;\n}\n\n.tileContent {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.helper {\n  @include type.type-style('body-compact-01');\n  color: $text-02;\n}\n\n.layer {\n  height: 100%;\n\n  :global(.cds--btn--primary) {\n    background-color: unset;\n  }\n}\n","// Code generated by @carbon/layout. DO NOT EDIT.\n//\n// Copyright IBM Corp. 2018, 2023\n//\n// This source code is licensed under the Apache-2.0 license found in the\n// LICENSE file in the root directory of this source tree.\n//\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-01: 0.125rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-02: 0.25rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-03: 0.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-04: 0.75rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-05: 1rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-06: 1.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-07: 2rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-08: 2.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-09: 3rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-10: 4rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-11: 5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-12: 6rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-13: 10rem !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/layout\n$spacing: (\n  spacing-01: $spacing-01,\n  spacing-02: $spacing-02,\n  spacing-03: $spacing-03,\n  spacing-04: $spacing-04,\n  spacing-05: $spacing-05,\n  spacing-06: $spacing-06,\n  spacing-07: $spacing-07,\n  spacing-08: $spacing-08,\n  spacing-09: $spacing-09,\n  spacing-10: $spacing-10,\n  spacing-11: $spacing-11,\n  spacing-12: $spacing-12,\n  spacing-13: $spacing-13,\n);\n","//\n// Copyright IBM Corp. 2018, 2023\n//\n// This source code is licensed under the Apache-2.0 license found in the\n// LICENSE file in the root directory of this source tree.\n//\n\n// stylelint-disable number-max-precision\n\n@use 'sass:map';\n@use 'sass:math';\n@use '@carbon/grid/scss/config' as gridconfig;\n@use '@carbon/grid/scss/breakpoint' as grid;\n@use 'prefix' as *;\n@use 'font-family';\n@use 'scale';\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$caption-01: (\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$caption-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$label-01: (\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$label-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$legal-01: (\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$legal-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$helper-text-01: (\n  font-size: scale.type-scale(1),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$helper-text-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-short-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-compact-01: $body-short-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-long-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.42857,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-01: $body-long-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-short-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.375,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-compact-02: $body-short-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-long-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.5,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-02: $body-long-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$code-01: (\n  font-family: font-family.font-family('mono'),\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$code-02: (\n  font-family: font-family.font-family('mono'),\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.42857,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.42857,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-compact-01: $productive-heading-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.5,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.375,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-compact-02: $productive-heading-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-03: (\n  font-size: scale.type-scale(5),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.4,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-03: $productive-heading-03 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-04: (\n  font-size: scale.type-scale(7),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-04: $productive-heading-04 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-05: (\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.25,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-05: $productive-heading-05 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-06: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  // Extra digit needed for precision in Chrome\n  line-height: 1.199,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-06: $productive-heading-06 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-07: (\n  font-size: scale.type-scale(12),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-07: $productive-heading-07 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-01: $heading-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-02: $heading-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-03: (\n  font-size: scale.type-scale(5),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.4,\n  letter-spacing: 0,\n  breakpoints: (\n    xlg: (\n      font-size: scale.type-scale(5),\n      line-height: 1.4,\n    ),\n    max: (\n      font-size: scale.type-scale(6),\n      line-height: 1.334,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-03: $expressive-heading-03 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-04: (\n  font-size: scale.type-scale(7),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0,\n  breakpoints: (\n    xlg: (\n      font-size: scale.type-scale(8),\n      line-height: 1.25,\n      font-weight: font-family.font-weight('regular'),\n    ),\n    max: (\n      font-size: scale.type-scale(8),\n      font-weight: font-family.font-weight('regular'),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-04: $expressive-heading-04 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-05: (\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.25,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(9),\n      font-weight: font-family.font-weight('light'),\n      line-height: 1.22,\n    ),\n    lg: (\n      font-size: scale.type-scale(10),\n      line-height: 1.19,\n    ),\n    xlg: (\n      font-size: scale.type-scale(11),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(13),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-05: $expressive-heading-05 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-06: (\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.25,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(9),\n      line-height: 1.22,\n    ),\n    lg: (\n      font-size: scale.type-scale(10),\n      line-height: 1.19,\n    ),\n    xlg: (\n      font-size: scale.type-scale(11),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(13),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-06: $expressive-heading-06 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-paragraph-01: (\n  font-size: scale.type-scale(6),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.334,\n  letter-spacing: 0,\n  breakpoints: (\n    lg: (\n      font-size: scale.type-scale(7),\n      line-height: 1.28572,\n    ),\n    max: (\n      font-size: scale.type-scale(8),\n      line-height: 1.25,\n    ),\n  ),\n);\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-paragraph-01: $expressive-paragraph-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$quotation-01: (\n  font-family: font-family.font-family('serif'),\n  font-size: scale.type-scale(5),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.3,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(5),\n    ),\n    lg: (\n      font-size: scale.type-scale(6),\n      line-height: 1.334,\n    ),\n    xlg: (\n      font-size: scale.type-scale(7),\n      line-height: 1.28572,\n    ),\n    max: (\n      font-size: scale.type-scale(8),\n      line-height: 1.25,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-quotation-01: $quotation-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$quotation-02: (\n  font-family: font-family.font-family('serif'),\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.25,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(9),\n      line-height: 1.22,\n    ),\n    lg: (\n      font-size: scale.type-scale(10),\n      line-height: 1.19,\n    ),\n    xlg: (\n      font-size: scale.type-scale(11),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(13),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-quotation-02: $quotation-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-01: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(10),\n    ),\n    lg: (\n      font-size: scale.type-scale(12),\n    ),\n    xlg: (\n      font-size: scale.type-scale(13),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(15),\n      line-height: 1.13,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-01: $display-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-02: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(10),\n    ),\n    lg: (\n      font-size: scale.type-scale(12),\n    ),\n    xlg: (\n      font-size: scale.type-scale(13),\n      line-height: 1.16,\n    ),\n    max: (\n      font-size: scale.type-scale(15),\n      line-height: 1.13,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-02: $display-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-03: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(12),\n      line-height: 1.18,\n    ),\n    lg: (\n      font-size: scale.type-scale(13),\n      line-height: 1.16,\n      letter-spacing: -0.64px,\n    ),\n    xlg: (\n      font-size: scale.type-scale(15),\n      line-height: 1.13,\n      letter-spacing: -0.64px,\n    ),\n    max: (\n      font-size: scale.type-scale(16),\n      line-height: 1.11,\n      letter-spacing: -0.96px,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-03: $display-03 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-04: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(14),\n      line-height: 1.15,\n    ),\n    lg: (\n      font-size: scale.type-scale(17),\n      line-height: 1.11,\n      letter-spacing: -0.64px,\n    ),\n    xlg: (\n      font-size: scale.type-scale(20),\n      line-height: 1.07,\n      letter-spacing: -0.64px,\n    ),\n    max: (\n      font-size: scale.type-scale(23),\n      line-height: 1.05,\n      letter-spacing: -0.96px,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-04: $display-04 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$tokens: (\n  caption-01: $caption-01,\n  caption-02: $caption-02,\n  label-01: $label-01,\n  label-02: $label-02,\n  helper-text-01: $helper-text-01,\n  helper-text-02: $helper-text-02,\n  body-short-01: $body-short-01,\n  body-short-02: $body-short-02,\n  body-long-01: $body-long-01,\n  body-long-02: $body-long-02,\n  code-01: $code-01,\n  code-02: $code-02,\n  heading-01: $heading-01,\n  heading-02: $heading-02,\n  productive-heading-01: $productive-heading-01,\n  productive-heading-02: $productive-heading-02,\n  productive-heading-03: $productive-heading-03,\n  productive-heading-04: $productive-heading-04,\n  productive-heading-05: $productive-heading-05,\n  productive-heading-06: $productive-heading-06,\n  productive-heading-07: $productive-heading-07,\n  expressive-paragraph-01: $expressive-paragraph-01,\n  expressive-heading-01: $expressive-heading-01,\n  expressive-heading-02: $expressive-heading-02,\n  expressive-heading-03: $expressive-heading-03,\n  expressive-heading-04: $expressive-heading-04,\n  expressive-heading-05: $expressive-heading-05,\n  expressive-heading-06: $expressive-heading-06,\n  quotation-01: $quotation-01,\n  quotation-02: $quotation-02,\n  display-01: $display-01,\n  display-02: $display-02,\n  display-03: $display-03,\n  display-04: $display-04,\n  // V11 Tokens\n  legal-01: $legal-01,\n  legal-02: $legal-02,\n  body-compact-01: $body-compact-01,\n  body-compact-02: $body-compact-02,\n  heading-compact-01: $heading-compact-01,\n  heading-compact-02: $heading-compact-02,\n  body-01: $body-01,\n  body-02: $body-02,\n  heading-03: $heading-03,\n  heading-04: $heading-04,\n  heading-05: $heading-05,\n  heading-06: $heading-06,\n  heading-07: $heading-07,\n  fluid-heading-03: $fluid-heading-03,\n  fluid-heading-04: $fluid-heading-04,\n  fluid-heading-05: $fluid-heading-05,\n  fluid-heading-06: $fluid-heading-06,\n  fluid-paragraph-01: $fluid-paragraph-01,\n  fluid-quotation-01: $fluid-quotation-01,\n  fluid-quotation-02: $fluid-quotation-02,\n  fluid-display-01: $fluid-display-01,\n  fluid-display-02: $fluid-display-02,\n  fluid-display-03: $fluid-display-03,\n  fluid-display-04: $fluid-display-04,\n) !default;\n\n/// @param {Map} $map\n/// @access public\n/// @group @carbon/type\n@mixin properties($map) {\n  @each $name, $value in $map {\n    #{$name}: $value;\n  }\n}\n\n/// @param {Number} $value - Number with units\n/// @return {Number} Without units\n/// @access public\n/// @group @carbon/type\n@function strip-unit($value) {\n  @return math.div($value, $value * 0 + 1);\n}\n\n/// This helper includes fluid type styles for the given token value. Fluid type\n/// means that the `font-size` is computed using `calc()` in order to be\n/// determined by the screen size instead of a breakpoint. As a result, fluid\n/// styles should be used with caution in fixed width contexts.\n///\n/// In addition, we make use of %-based line-heights so that the line-height of\n/// each type style is computed correctly due to the dynamic nature of the\n/// `font-size`.\n///\n/// Most of the logic for this work comes from CSS Tricks:\n/// https://css-tricks.com/snippets/css/fluid-typography/\n///\n/// @param {Map} $type-styles - The value of a given type token\n/// @param {Map} $breakpoints [$grid-breakpoints] - Custom breakpoints to use\n/// @access public\n/// @group @carbon/type\n@mixin fluid-type($type-styles, $breakpoints: gridconfig.$grid-breakpoints) {\n  // Include the initial styles for the given token by default without any\n  // media query guard. This includes `font-size` as a fallback in the case\n  // that a browser does not support `calc()`\n  @include properties(map.remove($type-styles, breakpoints));\n  // We also need to include the `sm` styles by default since they don't\n  // appear in the fluid styles for tokens\n  @include fluid-type-size($type-styles, sm, $breakpoints);\n\n  // Finally, we need to go through all the breakpoints defined in the type\n  // token and apply the properties and fluid type size for that given\n  // breakpoint\n  @each $name, $values in map.get($type-styles, breakpoints) {\n    @include grid.breakpoint($name) {\n      @include properties($values);\n      @include fluid-type-size($type-styles, $name, $breakpoints);\n    }\n  }\n}\n\n/// Computes the fluid `font-size` for a given type style and breakpoint\n/// @param {Map} $type-styles - The styles for a given token\n/// @param {String} $name - The name of the breakpoint to which we apply the fluid\n/// @param {Map} $breakpoints [$grid-breakpoints] - The breakpoints for the grid system\n/// @access public\n/// @group @carbon/type\n@mixin fluid-type-size(\n  $type-styles,\n  $name,\n  $breakpoints: gridconfig.$grid-breakpoints\n) {\n  // Get the information about the breakpoint we're currently working in. Useful\n  // for getting initial width information\n  $breakpoint: map.get($breakpoints, $name);\n\n  // Our fluid styles are captured under the 'breakpoints' property in our type\n  // styles map. These define what values to treat as `max-` variables below\n  $fluid-sizes: map.get($type-styles, breakpoints);\n  $fluid-breakpoint: ();\n  // Special case for `sm` because the styles for small are on the type style\n  // directly\n  @if $name == sm {\n    $fluid-breakpoint: map.remove($type-styles, breakpoints);\n  } @else {\n    $fluid-breakpoint: map.get($fluid-sizes, $name);\n  }\n\n  // Initialize our font-sizes to the default size for the type style\n  $max-font-size: map.get($type-styles, font-size);\n  $min-font-size: map.get($type-styles, font-size);\n  @if map.has-key($fluid-breakpoint, font-size) {\n    $min-font-size: map.get($fluid-breakpoint, font-size);\n  }\n\n  // Initialize our min and max width to the width of the current breakpoint\n  $max-vw: map.get($breakpoint, width);\n  $min-vw: map.get($breakpoint, width);\n\n  // We can use `breakpoint-next` to see if there is another breakpoint we can\n  // use to update `max-font-size` and `max-vw` with larger values\n  $next-breakpoint-available: grid.breakpoint-next($name, $breakpoints);\n  $next-fluid-breakpoint-name: null;\n\n  // We need to figure out what the next available fluid breakpoint is for our\n  // given $type-styles. In this loop we try and iterate through breakpoints\n  // until we either manually set $next-breakpoint-available to null or\n  // `breakpoint-next` returns null.\n  @while $next-breakpoint-available {\n    @if map.has-key($fluid-sizes, $next-breakpoint-available) {\n      $next-fluid-breakpoint-name: $next-breakpoint-available;\n      $next-breakpoint-available: null;\n    } @else {\n      $next-breakpoint-available: grid.breakpoint-next(\n        $next-breakpoint-available,\n        $breakpoints\n      );\n    }\n  }\n\n  // If we have found the next available fluid breakpoint name, then we know\n  // that we have values that we can use to set max-font-size and max-vw as both\n  // values derive from the next breakpoint\n  @if $next-fluid-breakpoint-name {\n    $next-fluid-breakpoint: map.get($breakpoints, $next-fluid-breakpoint-name);\n    $max-font-size: map.get(\n      map.get($fluid-sizes, $next-fluid-breakpoint-name),\n      font-size\n    );\n    $max-vw: map.get($next-fluid-breakpoint, width);\n\n    // prettier-ignore\n    font-size: calc(#{$min-font-size} +\n      #{strip-unit($max-font-size - $min-font-size)} *\n      ((100vw - #{$min-vw}) / #{strip-unit($max-vw - $min-vw)})\n    );\n  } @else {\n    // Otherwise, just default to setting the font size found from the type\n    // style or the given fluid breakpoint in the type style\n    font-size: $min-font-size;\n  }\n}\n\n// TODO move following variable and `custom-property` mixin into shared file for\n// both `@carbon/type` and `@carbon/themes`\n\n/// @access private\n/// @group @carbon/type\n@mixin custom-properties($name, $value) {\n  @each $property, $value in $value {\n    #{$property}: var(\n      --#{$custom-property-prefix}-#{$name}-#{$property},\n      #{$value}\n    );\n  }\n}\n\n/// Helper mixin to include the styles for a given token in any selector in your\n/// project. Also includes an optional fluid option that will enable fluid\n/// styles for the token if they are defined. Fluid styles will cause the\n/// token's font-size to be computed based on the viewport size. As a result, use\n/// with caution in fixed contexts.\n/// @param {String} $name - The name of the token to get the styles for\n/// @param {Boolean} $fluid [false] - Specify whether to include fluid styles for the\n/// @param {Map} $breakpoints [$grid-breakpoints] - Provide a custom breakpoint map to use\n/// @access public\n/// @group @carbon/type\n@mixin type-style(\n  $name,\n  $fluid: false,\n  $breakpoints: gridconfig.$grid-breakpoints\n) {\n  @if not map.has-key($tokens, $name) {\n    @error 'Unable to find a token with the name: `#{$name}`';\n  }\n\n  $token: map.get($tokens, $name);\n\n  // If $fluid is set to true and the token has breakpoints defined for fluid\n  // styles, delegate to the fluid-type helper for the given token\n  @if $fluid == true and map.has-key($token, 'breakpoints') {\n    @include fluid-type($token, $breakpoints);\n  } @else {\n    @include custom-properties($name, $token);\n  }\n}\n"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"container": "-esm-patient-chart__encounters-table__container___OasQC",
	"tableContainer": "-esm-patient-chart__encounters-table__tableContainer___Qudmq",
	"paginationContainer": "-esm-patient-chart__encounters-table__paginationContainer___zFwqx",
	"filterContainer": "-esm-patient-chart__encounters-table__filterContainer___ZEcWe",
	"search": "-esm-patient-chart__encounters-table__search___-gPNu",
	"menuItem": "-esm-patient-chart__encounters-table__menuItem___vaBSE",
	"expandedRow": "-esm-patient-chart__encounters-table__expandedRow___2bijG",
	"hiddenRow": "-esm-patient-chart__encounters-table__hiddenRow___mH+Nc",
	"content": "-esm-patient-chart__encounters-table__content___2TAho",
	"tileContainer": "-esm-patient-chart__encounters-table__tileContainer___T2DE9",
	"tile": "-esm-patient-chart__encounters-table__tile___uktoD",
	"tileContent": "-esm-patient-chart__encounters-table__tileContent___9sqfZ",
	"helper": "-esm-patient-chart__encounters-table__helper___ZKd0g",
	"layer": "-esm-patient-chart__encounters-table__layer___eGgog"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/past-visits-components/visit-summary.scss":
/*!******************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/past-visits-components/visit-summary.scss ***!
  \******************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* 60,70 and 80 are already declared as brand-01, 02 and 03 respectively */\n:root {\n  --brand-01: #005d5d;\n  --brand-02: #004144;\n  --brand-03: #007d79;\n  --bottom-nav-height: 4rem;\n  --workspace-header-height: 3rem;\n  --tablet-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--bottom-nav-height));\n  --desktop-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--workspace-header-height));\n}\n\n/* These color variables will be removed in a future release */\n.-esm-patient-chart__visit-summary__diagnosisLabel___aOydB {\n  font-size: var(--cds-heading-compact-01-font-size, 0.875rem);\n  font-weight: var(--cds-heading-compact-01-font-weight, 600);\n  line-height: var(--cds-heading-compact-01-line-height, 1.28572);\n  letter-spacing: var(--cds-heading-compact-01-letter-spacing, 0.16px);\n  color: #525252;\n  margin-top: 5px;\n}\n\n.-esm-patient-chart__visit-summary__diagnosesList___dZzcb {\n  display: flex;\n  flex-flow: row wrap;\n  padding-bottom: 0.5rem;\n  margin: 0 1rem;\n  border-bottom: 1px solid #e0e0e0;\n}\n\n.-esm-patient-chart__visit-summary__summaryContainer___DFBsA {\n  background-color: #ffffff;\n  display: grid;\n  grid-template-columns: max-content auto;\n  padding: 1rem;\n}\n.-esm-patient-chart__visit-summary__summaryContainer___DFBsA .cds--tabs {\n  min-height: 8rem;\n}\n\n.-esm-patient-chart__visit-summary__verticalTabs___wKYOE {\n  margin: 1rem 0;\n  scroll-behavior: smooth;\n}\n.-esm-patient-chart__visit-summary__verticalTabs___wKYOE > ul {\n  flex-direction: column !important;\n}\n.-esm-patient-chart__visit-summary__verticalTabs___wKYOE .cds--tabs--scrollable .cds--tabs--scrollable__nav-item + .cds--tabs--scrollable__nav-item {\n  margin-left: 0;\n}\n.-esm-patient-chart__visit-summary__verticalTabs___wKYOE .cds--tabs--scrollable .cds--tabs--scrollable__nav-link {\n  border-bottom: 0 !important;\n  border-left: 0.125rem solid #c6c6c6;\n}\n\n.-esm-patient-chart__visit-summary__tab___PH5nM {\n  outline: 0;\n  outline-offset: 0;\n  min-height: 2rem !important;\n}\n.-esm-patient-chart__visit-summary__tab___PH5nM:active, .-esm-patient-chart__visit-summary__tab___PH5nM:focus {\n  outline: 0.125rem solid var(--brand-03) !important;\n}\n.-esm-patient-chart__visit-summary__tab___PH5nM[aria-selected=true] {\n  border-left: 3px solid var(--brand-03);\n  border-bottom: none;\n  font-weight: 600;\n  margin-left: 0 !important;\n}\n.-esm-patient-chart__visit-summary__tab___PH5nM[aria-selected=false] {\n  border-bottom: none;\n  border-left: 0.125rem solid #e0e0e0;\n  margin-left: 0 !important;\n}\n\n.-esm-patient-chart__visit-summary__tablist___LGVnN .cds--tab--list {\n  flex-direction: column;\n  max-height: fit-content;\n}\n.-esm-patient-chart__visit-summary__tablist___LGVnN > button .cds--tabs .cds--tabs__nav-link {\n  border-bottom: none;\n}\n\n.-esm-patient-chart__visit-summary__text02___QS647 {\n  color: #525252;\n}\n\n.-esm-patient-chart__visit-summary__bodyLong01___SBwHI {\n  font-size: var(--cds-body-01-font-size, 0.875rem);\n  font-weight: var(--cds-body-01-font-weight, 400);\n  line-height: var(--cds-body-01-line-height, 1.42857);\n  letter-spacing: var(--cds-body-01-letter-spacing, 0.16px);\n}", "",{"version":3,"sources":["webpack://./../../node_modules/@openmrs/esm-styleguide/src/_vars.scss","webpack://./src/visit/visits-widget/past-visits-components/visit-summary.scss","webpack://./../../node_modules/@carbon/type/scss/_styles.scss","webpack://./../../node_modules/@carbon/layout/scss/generated/_spacing.scss","webpack://./../../node_modules/@carbon/colors/index.scss"],"names":[],"mappings":"AAkCA,0EAAA;AAoBA;EACE,mBAAA;EACA,mBAAA;EACA,mBAAA;EACA,yBAAA;EACA,+BAAA;EACA,oGAAA;EACA,2GAAA;ACpDF;;ADgEA,8DAAA;ACpEA;EC61BI,4DAAA;EAAA,2DAAA;EAAA,+DAAA;EAAA,oEAAA;ED31BF,cAAA;EACA,eAAA;AAWF;;AARA;EACE,aAAA;EACA,mBAAA;EACA,sBEOW;EFNX,cAAA;EACA,gCAAA;AAWF;;AARA;EACE,yBDXc;ECYd,aAAA;EACA,uCAAA;EACA,aEQW;AFGb;AATE;EACE,gBAAA;AAWJ;;AAPA;EACE,cAAA;EACA,uBAAA;AAUF;AARE;EACE,iCAAA;AAUJ;AAPE;EACE,cAAA;AASJ;AANE;EACE,2BAAA;EACA,mCAAA;AAQJ;;AAJA;EACE,UAAA;EACA,iBAAA;EACA,2BAAA;AAOF;AALE;EAEE,kDAAA;AAMJ;AAHE;EACE,sCAAA;EACA,mBAAA;EACA,gBAAA;EACA,yBAAA;AAKJ;AAFE;EACE,mBAAA;EACA,mCAAA;EACA,yBAAA;AAIJ;;AACE;EACE,sBAAA;EACA,uBAAA;AAEJ;AACE;EACE,mBAAA;AACJ;;AAGA;EACE,cGpCQ;AHoCV;;AAGA;EC2wBI,iDAAA;EAAA,gDAAA;EAAA,oDAAA;EAAA,yDAAA;ADvwBJ","sourcesContent":["@use '@carbon/layout';\n\n$ui-01: #f4f4f4;\n$ui-02: #ffffff;\n$ui-03: #e0e0e0;\n$ui-04: #8d8d8d;\n$ui-05: #161616;\n$text-02: #525252;\n$text-03: #a8a8a8;\n$ui-background: #ffffff;\n$color-gray-30: #c6c6c6;\n$color-gray-70: #525252;\n$color-gray-100: #161616;\n$color-blue-60-2: #0f62fe;\n$color-blue-10: #edf5ff;\n$color-yellow-50: #feecae;\n$carbon--red-50: #fa4d56;\n$inverse-link: #78a9ff;\n$support-02: #24a148;\n$inverse-support-03: #f1c21b;\n$warning-background: #fff8e1;\n$openmrs-background-grey: #f4f4f4;\n$danger: #da1e28;\n$interactive-01: #0f62fe;\n$field-01: #f4f4f4;\n$grey-2: #e0e0e0;\n$labeldropdown: #c6c6c6;\n\n$brand-primary-10: #d9fbfb;\n$brand-primary-20: #9ef0f0;\n$brand-primary-30: #3ddbd9;\n$brand-primary-40: #08bdba;\n$brand-primary-50: #009d9a;\n\n/* 60,70 and 80 are already declared as brand-01, 02 and 03 respectively */\n\n$brand-primary-90: #022b30;\n$brand-primary-100: #081a1c;\n\n@mixin brand-01($property) {\n  #{$property}: #005d5d;\n  #{$property}: var(--brand-01);\n}\n\n@mixin brand-02($property) {\n  #{$property}: #004144;\n  #{$property}: var(--brand-02);\n}\n\n@mixin brand-03($property) {\n  #{$property}: #007d79;\n  #{$property}: var(--brand-03);\n}\n\n:root {\n  --brand-01: #005d5d;\n  --brand-02: #004144;\n  --brand-03: #007d79;\n  --bottom-nav-height: #{layout.$spacing-10};\n  --workspace-header-height: #{layout.$spacing-09};\n  --tablet-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--bottom-nav-height));\n  --desktop-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--workspace-header-height));\n}\n\n$breakpoint-phone-min: 0px;\n$breakpoint-phone-max: 600px;\n$breakpoint-tablet-min: 601px;\n$breakpoint-tablet-max: 1023px;\n$breakpoint-small-desktop-min: 1024px;\n$breakpoint-small-desktop-max: 1439px;\n$breakpoint-large-desktop-min: 1440px;\n$breakpoint-large-desktop-max: 99999999px;\n\n/* These color variables will be removed in a future release */\n$brand-teal-01: #007d79;\n$brand-01: #005d5d;\n$brand-02: #004144;\n","@use '@carbon/colors';\n@use '@carbon/layout';\n@use '@carbon/type';\n@use '@openmrs/esm-styleguide/src/vars' as *;\n\n.diagnosisLabel {\n  @include type.type-style('heading-compact-01');\n  color: $text-02;\n  margin-top: 5px;\n}\n\n.diagnosesList {\n  display: flex;\n  flex-flow: row wrap;\n  padding-bottom: layout.$spacing-03;\n  margin: 0 layout.$spacing-05;\n  border-bottom: 1px solid $ui-03;\n}\n\n.summaryContainer {\n  background-color: $ui-background;\n  display: grid;\n  grid-template-columns: max-content auto;\n  padding: layout.$spacing-05;\n\n  :global(.cds--tabs) {\n    min-height: 8rem;\n  }\n}\n\n.verticalTabs {\n  margin: layout.$spacing-05 0;\n  scroll-behavior: smooth;\n\n  > ul {\n    flex-direction: column !important;\n  }\n\n  :global(.cds--tabs--scrollable .cds--tabs--scrollable__nav-item + .cds--tabs--scrollable__nav-item) {\n    margin-left: 0;\n  }\n\n  :global(.cds--tabs--scrollable .cds--tabs--scrollable__nav-link) {\n    border-bottom: 0 !important;\n    border-left: layout.$spacing-01 solid $color-gray-30;\n  }\n}\n\n.tab {\n  outline: 0;\n  outline-offset: 0;\n  min-height: 2rem !important;\n\n  &:active,\n  &:focus {\n    outline: layout.$spacing-01 solid var(--brand-03) !important;\n  }\n\n  &[aria-selected='true'] {\n    border-left: 3px solid var(--brand-03);\n    border-bottom: none;\n    font-weight: 600;\n    margin-left: 0 !important;\n  }\n\n  &[aria-selected='false'] {\n    border-bottom: none;\n    border-left: layout.$spacing-01 solid $ui-03;\n    margin-left: 0 !important;\n  }\n}\n\n.tablist {\n  :global(.cds--tab--list) {\n    flex-direction: column;\n    max-height: fit-content;\n  }\n\n  > button :global(.cds--tabs .cds--tabs__nav-link) {\n    border-bottom: none;\n  }\n}\n\n.text02 {\n  color: colors.$gray-70;\n}\n\n.bodyLong01 {\n  @include type.type-style('body-01');\n}\n","//\n// Copyright IBM Corp. 2018, 2023\n//\n// This source code is licensed under the Apache-2.0 license found in the\n// LICENSE file in the root directory of this source tree.\n//\n\n// stylelint-disable number-max-precision\n\n@use 'sass:map';\n@use 'sass:math';\n@use '@carbon/grid/scss/config' as gridconfig;\n@use '@carbon/grid/scss/breakpoint' as grid;\n@use 'prefix' as *;\n@use 'font-family';\n@use 'scale';\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$caption-01: (\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$caption-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$label-01: (\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$label-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$legal-01: (\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$legal-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$helper-text-01: (\n  font-size: scale.type-scale(1),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$helper-text-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-short-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-compact-01: $body-short-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-long-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.42857,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-01: $body-long-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-short-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.375,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-compact-02: $body-short-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-long-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.5,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-02: $body-long-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$code-01: (\n  font-family: font-family.font-family('mono'),\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$code-02: (\n  font-family: font-family.font-family('mono'),\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.42857,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.42857,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-compact-01: $productive-heading-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.5,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.375,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-compact-02: $productive-heading-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-03: (\n  font-size: scale.type-scale(5),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.4,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-03: $productive-heading-03 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-04: (\n  font-size: scale.type-scale(7),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-04: $productive-heading-04 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-05: (\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.25,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-05: $productive-heading-05 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-06: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  // Extra digit needed for precision in Chrome\n  line-height: 1.199,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-06: $productive-heading-06 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-07: (\n  font-size: scale.type-scale(12),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-07: $productive-heading-07 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-01: $heading-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-02: $heading-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-03: (\n  font-size: scale.type-scale(5),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.4,\n  letter-spacing: 0,\n  breakpoints: (\n    xlg: (\n      font-size: scale.type-scale(5),\n      line-height: 1.4,\n    ),\n    max: (\n      font-size: scale.type-scale(6),\n      line-height: 1.334,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-03: $expressive-heading-03 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-04: (\n  font-size: scale.type-scale(7),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0,\n  breakpoints: (\n    xlg: (\n      font-size: scale.type-scale(8),\n      line-height: 1.25,\n      font-weight: font-family.font-weight('regular'),\n    ),\n    max: (\n      font-size: scale.type-scale(8),\n      font-weight: font-family.font-weight('regular'),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-04: $expressive-heading-04 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-05: (\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.25,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(9),\n      font-weight: font-family.font-weight('light'),\n      line-height: 1.22,\n    ),\n    lg: (\n      font-size: scale.type-scale(10),\n      line-height: 1.19,\n    ),\n    xlg: (\n      font-size: scale.type-scale(11),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(13),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-05: $expressive-heading-05 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-06: (\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.25,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(9),\n      line-height: 1.22,\n    ),\n    lg: (\n      font-size: scale.type-scale(10),\n      line-height: 1.19,\n    ),\n    xlg: (\n      font-size: scale.type-scale(11),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(13),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-06: $expressive-heading-06 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-paragraph-01: (\n  font-size: scale.type-scale(6),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.334,\n  letter-spacing: 0,\n  breakpoints: (\n    lg: (\n      font-size: scale.type-scale(7),\n      line-height: 1.28572,\n    ),\n    max: (\n      font-size: scale.type-scale(8),\n      line-height: 1.25,\n    ),\n  ),\n);\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-paragraph-01: $expressive-paragraph-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$quotation-01: (\n  font-family: font-family.font-family('serif'),\n  font-size: scale.type-scale(5),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.3,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(5),\n    ),\n    lg: (\n      font-size: scale.type-scale(6),\n      line-height: 1.334,\n    ),\n    xlg: (\n      font-size: scale.type-scale(7),\n      line-height: 1.28572,\n    ),\n    max: (\n      font-size: scale.type-scale(8),\n      line-height: 1.25,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-quotation-01: $quotation-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$quotation-02: (\n  font-family: font-family.font-family('serif'),\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.25,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(9),\n      line-height: 1.22,\n    ),\n    lg: (\n      font-size: scale.type-scale(10),\n      line-height: 1.19,\n    ),\n    xlg: (\n      font-size: scale.type-scale(11),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(13),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-quotation-02: $quotation-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-01: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(10),\n    ),\n    lg: (\n      font-size: scale.type-scale(12),\n    ),\n    xlg: (\n      font-size: scale.type-scale(13),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(15),\n      line-height: 1.13,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-01: $display-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-02: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(10),\n    ),\n    lg: (\n      font-size: scale.type-scale(12),\n    ),\n    xlg: (\n      font-size: scale.type-scale(13),\n      line-height: 1.16,\n    ),\n    max: (\n      font-size: scale.type-scale(15),\n      line-height: 1.13,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-02: $display-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-03: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(12),\n      line-height: 1.18,\n    ),\n    lg: (\n      font-size: scale.type-scale(13),\n      line-height: 1.16,\n      letter-spacing: -0.64px,\n    ),\n    xlg: (\n      font-size: scale.type-scale(15),\n      line-height: 1.13,\n      letter-spacing: -0.64px,\n    ),\n    max: (\n      font-size: scale.type-scale(16),\n      line-height: 1.11,\n      letter-spacing: -0.96px,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-03: $display-03 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-04: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(14),\n      line-height: 1.15,\n    ),\n    lg: (\n      font-size: scale.type-scale(17),\n      line-height: 1.11,\n      letter-spacing: -0.64px,\n    ),\n    xlg: (\n      font-size: scale.type-scale(20),\n      line-height: 1.07,\n      letter-spacing: -0.64px,\n    ),\n    max: (\n      font-size: scale.type-scale(23),\n      line-height: 1.05,\n      letter-spacing: -0.96px,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-04: $display-04 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$tokens: (\n  caption-01: $caption-01,\n  caption-02: $caption-02,\n  label-01: $label-01,\n  label-02: $label-02,\n  helper-text-01: $helper-text-01,\n  helper-text-02: $helper-text-02,\n  body-short-01: $body-short-01,\n  body-short-02: $body-short-02,\n  body-long-01: $body-long-01,\n  body-long-02: $body-long-02,\n  code-01: $code-01,\n  code-02: $code-02,\n  heading-01: $heading-01,\n  heading-02: $heading-02,\n  productive-heading-01: $productive-heading-01,\n  productive-heading-02: $productive-heading-02,\n  productive-heading-03: $productive-heading-03,\n  productive-heading-04: $productive-heading-04,\n  productive-heading-05: $productive-heading-05,\n  productive-heading-06: $productive-heading-06,\n  productive-heading-07: $productive-heading-07,\n  expressive-paragraph-01: $expressive-paragraph-01,\n  expressive-heading-01: $expressive-heading-01,\n  expressive-heading-02: $expressive-heading-02,\n  expressive-heading-03: $expressive-heading-03,\n  expressive-heading-04: $expressive-heading-04,\n  expressive-heading-05: $expressive-heading-05,\n  expressive-heading-06: $expressive-heading-06,\n  quotation-01: $quotation-01,\n  quotation-02: $quotation-02,\n  display-01: $display-01,\n  display-02: $display-02,\n  display-03: $display-03,\n  display-04: $display-04,\n  // V11 Tokens\n  legal-01: $legal-01,\n  legal-02: $legal-02,\n  body-compact-01: $body-compact-01,\n  body-compact-02: $body-compact-02,\n  heading-compact-01: $heading-compact-01,\n  heading-compact-02: $heading-compact-02,\n  body-01: $body-01,\n  body-02: $body-02,\n  heading-03: $heading-03,\n  heading-04: $heading-04,\n  heading-05: $heading-05,\n  heading-06: $heading-06,\n  heading-07: $heading-07,\n  fluid-heading-03: $fluid-heading-03,\n  fluid-heading-04: $fluid-heading-04,\n  fluid-heading-05: $fluid-heading-05,\n  fluid-heading-06: $fluid-heading-06,\n  fluid-paragraph-01: $fluid-paragraph-01,\n  fluid-quotation-01: $fluid-quotation-01,\n  fluid-quotation-02: $fluid-quotation-02,\n  fluid-display-01: $fluid-display-01,\n  fluid-display-02: $fluid-display-02,\n  fluid-display-03: $fluid-display-03,\n  fluid-display-04: $fluid-display-04,\n) !default;\n\n/// @param {Map} $map\n/// @access public\n/// @group @carbon/type\n@mixin properties($map) {\n  @each $name, $value in $map {\n    #{$name}: $value;\n  }\n}\n\n/// @param {Number} $value - Number with units\n/// @return {Number} Without units\n/// @access public\n/// @group @carbon/type\n@function strip-unit($value) {\n  @return math.div($value, $value * 0 + 1);\n}\n\n/// This helper includes fluid type styles for the given token value. Fluid type\n/// means that the `font-size` is computed using `calc()` in order to be\n/// determined by the screen size instead of a breakpoint. As a result, fluid\n/// styles should be used with caution in fixed width contexts.\n///\n/// In addition, we make use of %-based line-heights so that the line-height of\n/// each type style is computed correctly due to the dynamic nature of the\n/// `font-size`.\n///\n/// Most of the logic for this work comes from CSS Tricks:\n/// https://css-tricks.com/snippets/css/fluid-typography/\n///\n/// @param {Map} $type-styles - The value of a given type token\n/// @param {Map} $breakpoints [$grid-breakpoints] - Custom breakpoints to use\n/// @access public\n/// @group @carbon/type\n@mixin fluid-type($type-styles, $breakpoints: gridconfig.$grid-breakpoints) {\n  // Include the initial styles for the given token by default without any\n  // media query guard. This includes `font-size` as a fallback in the case\n  // that a browser does not support `calc()`\n  @include properties(map.remove($type-styles, breakpoints));\n  // We also need to include the `sm` styles by default since they don't\n  // appear in the fluid styles for tokens\n  @include fluid-type-size($type-styles, sm, $breakpoints);\n\n  // Finally, we need to go through all the breakpoints defined in the type\n  // token and apply the properties and fluid type size for that given\n  // breakpoint\n  @each $name, $values in map.get($type-styles, breakpoints) {\n    @include grid.breakpoint($name) {\n      @include properties($values);\n      @include fluid-type-size($type-styles, $name, $breakpoints);\n    }\n  }\n}\n\n/// Computes the fluid `font-size` for a given type style and breakpoint\n/// @param {Map} $type-styles - The styles for a given token\n/// @param {String} $name - The name of the breakpoint to which we apply the fluid\n/// @param {Map} $breakpoints [$grid-breakpoints] - The breakpoints for the grid system\n/// @access public\n/// @group @carbon/type\n@mixin fluid-type-size(\n  $type-styles,\n  $name,\n  $breakpoints: gridconfig.$grid-breakpoints\n) {\n  // Get the information about the breakpoint we're currently working in. Useful\n  // for getting initial width information\n  $breakpoint: map.get($breakpoints, $name);\n\n  // Our fluid styles are captured under the 'breakpoints' property in our type\n  // styles map. These define what values to treat as `max-` variables below\n  $fluid-sizes: map.get($type-styles, breakpoints);\n  $fluid-breakpoint: ();\n  // Special case for `sm` because the styles for small are on the type style\n  // directly\n  @if $name == sm {\n    $fluid-breakpoint: map.remove($type-styles, breakpoints);\n  } @else {\n    $fluid-breakpoint: map.get($fluid-sizes, $name);\n  }\n\n  // Initialize our font-sizes to the default size for the type style\n  $max-font-size: map.get($type-styles, font-size);\n  $min-font-size: map.get($type-styles, font-size);\n  @if map.has-key($fluid-breakpoint, font-size) {\n    $min-font-size: map.get($fluid-breakpoint, font-size);\n  }\n\n  // Initialize our min and max width to the width of the current breakpoint\n  $max-vw: map.get($breakpoint, width);\n  $min-vw: map.get($breakpoint, width);\n\n  // We can use `breakpoint-next` to see if there is another breakpoint we can\n  // use to update `max-font-size` and `max-vw` with larger values\n  $next-breakpoint-available: grid.breakpoint-next($name, $breakpoints);\n  $next-fluid-breakpoint-name: null;\n\n  // We need to figure out what the next available fluid breakpoint is for our\n  // given $type-styles. In this loop we try and iterate through breakpoints\n  // until we either manually set $next-breakpoint-available to null or\n  // `breakpoint-next` returns null.\n  @while $next-breakpoint-available {\n    @if map.has-key($fluid-sizes, $next-breakpoint-available) {\n      $next-fluid-breakpoint-name: $next-breakpoint-available;\n      $next-breakpoint-available: null;\n    } @else {\n      $next-breakpoint-available: grid.breakpoint-next(\n        $next-breakpoint-available,\n        $breakpoints\n      );\n    }\n  }\n\n  // If we have found the next available fluid breakpoint name, then we know\n  // that we have values that we can use to set max-font-size and max-vw as both\n  // values derive from the next breakpoint\n  @if $next-fluid-breakpoint-name {\n    $next-fluid-breakpoint: map.get($breakpoints, $next-fluid-breakpoint-name);\n    $max-font-size: map.get(\n      map.get($fluid-sizes, $next-fluid-breakpoint-name),\n      font-size\n    );\n    $max-vw: map.get($next-fluid-breakpoint, width);\n\n    // prettier-ignore\n    font-size: calc(#{$min-font-size} +\n      #{strip-unit($max-font-size - $min-font-size)} *\n      ((100vw - #{$min-vw}) / #{strip-unit($max-vw - $min-vw)})\n    );\n  } @else {\n    // Otherwise, just default to setting the font size found from the type\n    // style or the given fluid breakpoint in the type style\n    font-size: $min-font-size;\n  }\n}\n\n// TODO move following variable and `custom-property` mixin into shared file for\n// both `@carbon/type` and `@carbon/themes`\n\n/// @access private\n/// @group @carbon/type\n@mixin custom-properties($name, $value) {\n  @each $property, $value in $value {\n    #{$property}: var(\n      --#{$custom-property-prefix}-#{$name}-#{$property},\n      #{$value}\n    );\n  }\n}\n\n/// Helper mixin to include the styles for a given token in any selector in your\n/// project. Also includes an optional fluid option that will enable fluid\n/// styles for the token if they are defined. Fluid styles will cause the\n/// token's font-size to be computed based on the viewport size. As a result, use\n/// with caution in fixed contexts.\n/// @param {String} $name - The name of the token to get the styles for\n/// @param {Boolean} $fluid [false] - Specify whether to include fluid styles for the\n/// @param {Map} $breakpoints [$grid-breakpoints] - Provide a custom breakpoint map to use\n/// @access public\n/// @group @carbon/type\n@mixin type-style(\n  $name,\n  $fluid: false,\n  $breakpoints: gridconfig.$grid-breakpoints\n) {\n  @if not map.has-key($tokens, $name) {\n    @error 'Unable to find a token with the name: `#{$name}`';\n  }\n\n  $token: map.get($tokens, $name);\n\n  // If $fluid is set to true and the token has breakpoints defined for fluid\n  // styles, delegate to the fluid-type helper for the given token\n  @if $fluid == true and map.has-key($token, 'breakpoints') {\n    @include fluid-type($token, $breakpoints);\n  } @else {\n    @include custom-properties($name, $token);\n  }\n}\n","// Code generated by @carbon/layout. DO NOT EDIT.\n//\n// Copyright IBM Corp. 2018, 2023\n//\n// This source code is licensed under the Apache-2.0 license found in the\n// LICENSE file in the root directory of this source tree.\n//\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-01: 0.125rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-02: 0.25rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-03: 0.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-04: 0.75rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-05: 1rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-06: 1.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-07: 2rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-08: 2.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-09: 3rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-10: 4rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-11: 5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-12: 6rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-13: 10rem !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/layout\n$spacing: (\n  spacing-01: $spacing-01,\n  spacing-02: $spacing-02,\n  spacing-03: $spacing-03,\n  spacing-04: $spacing-04,\n  spacing-05: $spacing-05,\n  spacing-06: $spacing-06,\n  spacing-07: $spacing-07,\n  spacing-08: $spacing-08,\n  spacing-09: $spacing-09,\n  spacing-10: $spacing-10,\n  spacing-11: $spacing-11,\n  spacing-12: $spacing-12,\n  spacing-13: $spacing-13,\n);\n","// Code generated by @carbon/colors. DO NOT EDIT.\n//\n// Copyright IBM Corp. 2018, 2023\n//\n// This source code is licensed under the Apache-2.0 license found in the\n// LICENSE file in the root directory of this source tree.\n//\n\n$black: #000000 !default;\n$white: #ffffff !default;\n\n$black-100: #000000 !default;\n$blue-10: #edf5ff !default;\n$blue-20: #d0e2ff !default;\n$blue-30: #a6c8ff !default;\n$blue-40: #78a9ff !default;\n$blue-50: #4589ff !default;\n$blue-60: #0f62fe !default;\n$blue-70: #0043ce !default;\n$blue-80: #002d9c !default;\n$blue-90: #001d6c !default;\n$blue-100: #001141 !default;\n$cool-gray-10: #f2f4f8 !default;\n$cool-gray-20: #dde1e6 !default;\n$cool-gray-30: #c1c7cd !default;\n$cool-gray-40: #a2a9b0 !default;\n$cool-gray-50: #878d96 !default;\n$cool-gray-60: #697077 !default;\n$cool-gray-70: #4d5358 !default;\n$cool-gray-80: #343a3f !default;\n$cool-gray-90: #21272a !default;\n$cool-gray-100: #121619 !default;\n$cyan-10: #e5f6ff !default;\n$cyan-20: #bae6ff !default;\n$cyan-30: #82cfff !default;\n$cyan-40: #33b1ff !default;\n$cyan-50: #1192e8 !default;\n$cyan-60: #0072c3 !default;\n$cyan-70: #00539a !default;\n$cyan-80: #003a6d !default;\n$cyan-90: #012749 !default;\n$cyan-100: #061727 !default;\n$gray-10: #f4f4f4 !default;\n$gray-20: #e0e0e0 !default;\n$gray-30: #c6c6c6 !default;\n$gray-40: #a8a8a8 !default;\n$gray-50: #8d8d8d !default;\n$gray-60: #6f6f6f !default;\n$gray-70: #525252 !default;\n$gray-80: #393939 !default;\n$gray-90: #262626 !default;\n$gray-100: #161616 !default;\n$green-10: #defbe6 !default;\n$green-20: #a7f0ba !default;\n$green-30: #6fdc8c !default;\n$green-40: #42be65 !default;\n$green-50: #24a148 !default;\n$green-60: #198038 !default;\n$green-70: #0e6027 !default;\n$green-80: #044317 !default;\n$green-90: #022d0d !default;\n$green-100: #071908 !default;\n$magenta-10: #fff0f7 !default;\n$magenta-20: #ffd6e8 !default;\n$magenta-30: #ffafd2 !default;\n$magenta-40: #ff7eb6 !default;\n$magenta-50: #ee5396 !default;\n$magenta-60: #d02670 !default;\n$magenta-70: #9f1853 !default;\n$magenta-80: #740937 !default;\n$magenta-90: #510224 !default;\n$magenta-100: #2a0a18 !default;\n$orange-10: #fff2e8 !default;\n$orange-20: #ffd9be !default;\n$orange-30: #ffb784 !default;\n$orange-40: #ff832b !default;\n$orange-50: #eb6200 !default;\n$orange-60: #ba4e00 !default;\n$orange-70: #8a3800 !default;\n$orange-80: #5e2900 !default;\n$orange-90: #3e1a00 !default;\n$orange-100: #231000 !default;\n$purple-10: #f6f2ff !default;\n$purple-20: #e8daff !default;\n$purple-30: #d4bbff !default;\n$purple-40: #be95ff !default;\n$purple-50: #a56eff !default;\n$purple-60: #8a3ffc !default;\n$purple-70: #6929c4 !default;\n$purple-80: #491d8b !default;\n$purple-90: #31135e !default;\n$purple-100: #1c0f30 !default;\n$red-10: #fff1f1 !default;\n$red-20: #ffd7d9 !default;\n$red-30: #ffb3b8 !default;\n$red-40: #ff8389 !default;\n$red-50: #fa4d56 !default;\n$red-60: #da1e28 !default;\n$red-70: #a2191f !default;\n$red-80: #750e13 !default;\n$red-90: #520408 !default;\n$red-100: #2d0709 !default;\n$teal-10: #d9fbfb !default;\n$teal-20: #9ef0f0 !default;\n$teal-30: #3ddbd9 !default;\n$teal-40: #08bdba !default;\n$teal-50: #009d9a !default;\n$teal-60: #007d79 !default;\n$teal-70: #005d5d !default;\n$teal-80: #004144 !default;\n$teal-90: #022b30 !default;\n$teal-100: #081a1c !default;\n$warm-gray-10: #f7f3f2 !default;\n$warm-gray-20: #e5e0df !default;\n$warm-gray-30: #cac5c4 !default;\n$warm-gray-40: #ada8a8 !default;\n$warm-gray-50: #8f8b8b !default;\n$warm-gray-60: #726e6e !default;\n$warm-gray-70: #565151 !default;\n$warm-gray-80: #3c3838 !default;\n$warm-gray-90: #272525 !default;\n$warm-gray-100: #171414 !default;\n$white-0: #ffffff !default;\n$yellow-10: #fcf4d6 !default;\n$yellow-20: #fddc69 !default;\n$yellow-30: #f1c21b !default;\n$yellow-40: #d2a106 !default;\n$yellow-50: #b28600 !default;\n$yellow-60: #8e6a00 !default;\n$yellow-70: #684e00 !default;\n$yellow-80: #483700 !default;\n$yellow-90: #302400 !default;\n$yellow-100: #1c1500 !default;\n\n$white-hover: #e8e8e8 !default;\n$black-hover: #212121 !default;\n$blue-10-hover: #dbebff !default;\n$blue-20-hover: #b8d3ff !default;\n$blue-30-hover: #8ab6ff !default;\n$blue-40-hover: #5c97ff !default;\n$blue-50-hover: #1f70ff !default;\n$blue-60-hover: #0050e6 !default;\n$blue-70-hover: #0053ff !default;\n$blue-80-hover: #0039c7 !default;\n$blue-90-hover: #00258a !default;\n$blue-100-hover: #001f75 !default;\n$cool-gray-10-hover: #e4e9f1 !default;\n$cool-gray-20-hover: #cdd3da !default;\n$cool-gray-30-hover: #adb5bd !default;\n$cool-gray-40-hover: #9199a1 !default;\n$cool-gray-50-hover: #757b85 !default;\n$cool-gray-60-hover: #585e64 !default;\n$cool-gray-70-hover: #5d646a !default;\n$cool-gray-80-hover: #434a51 !default;\n$cool-gray-90-hover: #2b3236 !default;\n$cool-gray-100-hover: #222a2f !default;\n$cyan-10-hover: #cceeff !default;\n$cyan-20-hover: #99daff !default;\n$cyan-30-hover: #57beff !default;\n$cyan-40-hover: #059fff !default;\n$cyan-50-hover: #0f7ec8 !default;\n$cyan-60-hover: #005fa3 !default;\n$cyan-70-hover: #0066bd !default;\n$cyan-80-hover: #00498a !default;\n$cyan-90-hover: #013360 !default;\n$cyan-100-hover: #0b2947 !default;\n$gray-10-hover: #e8e8e8 !default;\n$gray-20-hover: #d1d1d1 !default;\n$gray-30-hover: #b5b5b5 !default;\n$gray-40-hover: #999999 !default;\n$gray-50-hover: #7a7a7a !default;\n$gray-60-hover: #5e5e5e !default;\n$gray-70-hover: #636363 !default;\n$gray-80-hover: #474747 !default;\n$gray-90-hover: #333333 !default;\n$gray-100-hover: #292929 !default;\n$green-10-hover: #b6f6c8 !default;\n$green-20-hover: #74e792 !default;\n$green-30-hover: #36ce5e !default;\n$green-40-hover: #3bab5a !default;\n$green-50-hover: #208e3f !default;\n$green-60-hover: #166f31 !default;\n$green-70-hover: #11742f !default;\n$green-80-hover: #05521c !default;\n$green-90-hover: #033b11 !default;\n$green-100-hover: #0d300f !default;\n$magenta-10-hover: #ffe0ef !default;\n$magenta-20-hover: #ffbdda !default;\n$magenta-30-hover: #ff94c3 !default;\n$magenta-40-hover: #ff57a0 !default;\n$magenta-50-hover: #e3176f !default;\n$magenta-60-hover: #b0215f !default;\n$magenta-70-hover: #bf1d63 !default;\n$magenta-80-hover: #8e0b43 !default;\n$magenta-90-hover: #68032e !default;\n$magenta-100-hover: #53142f !default;\n$orange-10-hover: #ffe2cc !default;\n$orange-20-hover: #ffc69e !default;\n$orange-30-hover: #ff9d57 !default;\n$orange-40-hover: #fa6800 !default;\n$orange-50-hover: #cc5500 !default;\n$orange-60-hover: #9e4200 !default;\n$orange-70-hover: #a84400 !default;\n$orange-80-hover: #753300 !default;\n$orange-90-hover: #522200 !default;\n$orange-100-hover: #421e00 !default;\n$purple-10-hover: #ede5ff !default;\n$purple-20-hover: #dcc7ff !default;\n$purple-30-hover: #c5a3ff !default;\n$purple-40-hover: #ae7aff !default;\n$purple-50-hover: #9352ff !default;\n$purple-60-hover: #7822fb !default;\n$purple-70-hover: #7c3dd6 !default;\n$purple-80-hover: #5b24ad !default;\n$purple-90-hover: #40197b !default;\n$purple-100-hover: #341c59 !default;\n$red-10-hover: #ffe0e0 !default;\n$red-20-hover: #ffc2c5 !default;\n$red-30-hover: #ff99a0 !default;\n$red-40-hover: #ff6168 !default;\n$red-50-hover: #ee0713 !default;\n$red-60-hover: #b81922 !default;\n$red-70-hover: #c21e25 !default;\n$red-80-hover: #921118 !default;\n$red-90-hover: #66050a !default;\n$red-100-hover: #540d11 !default;\n$teal-10-hover: #acf6f6 !default;\n$teal-20-hover: #57e5e5 !default;\n$teal-30-hover: #25cac8 !default;\n$teal-40-hover: #07aba9 !default;\n$teal-50-hover: #008a87 !default;\n$teal-60-hover: #006b68 !default;\n$teal-70-hover: #007070 !default;\n$teal-80-hover: #005357 !default;\n$teal-90-hover: #033940 !default;\n$teal-100-hover: #0f3034 !default;\n$warm-gray-10-hover: #f0e8e6 !default;\n$warm-gray-20-hover: #d8d0cf !default;\n$warm-gray-30-hover: #b9b3b1 !default;\n$warm-gray-40-hover: #9c9696 !default;\n$warm-gray-50-hover: #7f7b7b !default;\n$warm-gray-60-hover: #605d5d !default;\n$warm-gray-70-hover: #696363 !default;\n$warm-gray-80-hover: #4c4848 !default;\n$warm-gray-90-hover: #343232 !default;\n$warm-gray-100-hover: #2c2626 !default;\n$yellow-10-hover: #f8e6a0 !default;\n$yellow-20-hover: #fccd27 !default;\n$yellow-30-hover: #ddb00e !default;\n$yellow-40-hover: #bc9005 !default;\n$yellow-50-hover: #9e7700 !default;\n$yellow-60-hover: #755800 !default;\n$yellow-70-hover: #806000 !default;\n$yellow-80-hover: #5c4600 !default;\n$yellow-90-hover: #3d2e00 !default;\n$yellow-100-hover: #332600 !default;\n\n/// Colors from the IBM Design Language\n/// @access public\n/// @group @carbon/colors\n$colors: (\n  black: (\n    100: #000000,\n  ),\n  blue: (\n    10: #edf5ff,\n    20: #d0e2ff,\n    30: #a6c8ff,\n    40: #78a9ff,\n    50: #4589ff,\n    60: #0f62fe,\n    70: #0043ce,\n    80: #002d9c,\n    90: #001d6c,\n    100: #001141,\n  ),\n  cool-gray: (\n    10: #f2f4f8,\n    20: #dde1e6,\n    30: #c1c7cd,\n    40: #a2a9b0,\n    50: #878d96,\n    60: #697077,\n    70: #4d5358,\n    80: #343a3f,\n    90: #21272a,\n    100: #121619,\n  ),\n  cyan: (\n    10: #e5f6ff,\n    20: #bae6ff,\n    30: #82cfff,\n    40: #33b1ff,\n    50: #1192e8,\n    60: #0072c3,\n    70: #00539a,\n    80: #003a6d,\n    90: #012749,\n    100: #061727,\n  ),\n  gray: (\n    10: #f4f4f4,\n    20: #e0e0e0,\n    30: #c6c6c6,\n    40: #a8a8a8,\n    50: #8d8d8d,\n    60: #6f6f6f,\n    70: #525252,\n    80: #393939,\n    90: #262626,\n    100: #161616,\n  ),\n  green: (\n    10: #defbe6,\n    20: #a7f0ba,\n    30: #6fdc8c,\n    40: #42be65,\n    50: #24a148,\n    60: #198038,\n    70: #0e6027,\n    80: #044317,\n    90: #022d0d,\n    100: #071908,\n  ),\n  magenta: (\n    10: #fff0f7,\n    20: #ffd6e8,\n    30: #ffafd2,\n    40: #ff7eb6,\n    50: #ee5396,\n    60: #d02670,\n    70: #9f1853,\n    80: #740937,\n    90: #510224,\n    100: #2a0a18,\n  ),\n  orange: (\n    10: #fff2e8,\n    20: #ffd9be,\n    30: #ffb784,\n    40: #ff832b,\n    50: #eb6200,\n    60: #ba4e00,\n    70: #8a3800,\n    80: #5e2900,\n    90: #3e1a00,\n    100: #231000,\n  ),\n  purple: (\n    10: #f6f2ff,\n    20: #e8daff,\n    30: #d4bbff,\n    40: #be95ff,\n    50: #a56eff,\n    60: #8a3ffc,\n    70: #6929c4,\n    80: #491d8b,\n    90: #31135e,\n    100: #1c0f30,\n  ),\n  red: (\n    10: #fff1f1,\n    20: #ffd7d9,\n    30: #ffb3b8,\n    40: #ff8389,\n    50: #fa4d56,\n    60: #da1e28,\n    70: #a2191f,\n    80: #750e13,\n    90: #520408,\n    100: #2d0709,\n  ),\n  teal: (\n    10: #d9fbfb,\n    20: #9ef0f0,\n    30: #3ddbd9,\n    40: #08bdba,\n    50: #009d9a,\n    60: #007d79,\n    70: #005d5d,\n    80: #004144,\n    90: #022b30,\n    100: #081a1c,\n  ),\n  warm-gray: (\n    10: #f7f3f2,\n    20: #e5e0df,\n    30: #cac5c4,\n    40: #ada8a8,\n    50: #8f8b8b,\n    60: #726e6e,\n    70: #565151,\n    80: #3c3838,\n    90: #272525,\n    100: #171414,\n  ),\n  white: (\n    0: #ffffff,\n  ),\n  yellow: (\n    10: #fcf4d6,\n    20: #fddc69,\n    30: #f1c21b,\n    40: #d2a106,\n    50: #b28600,\n    60: #8e6a00,\n    70: #684e00,\n    80: #483700,\n    90: #302400,\n    100: #1c1500,\n  ),\n) !default;\n"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"diagnosisLabel": "-esm-patient-chart__visit-summary__diagnosisLabel___aOydB",
	"diagnosesList": "-esm-patient-chart__visit-summary__diagnosesList___dZzcb",
	"summaryContainer": "-esm-patient-chart__visit-summary__summaryContainer___DFBsA",
	"verticalTabs": "-esm-patient-chart__visit-summary__verticalTabs___wKYOE",
	"tab": "-esm-patient-chart__visit-summary__tab___PH5nM",
	"tablist": "-esm-patient-chart__visit-summary__tablist___LGVnN",
	"text02": "-esm-patient-chart__visit-summary__text02___QS647",
	"bodyLong01": "-esm-patient-chart__visit-summary__bodyLong01___SBwHI"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/visit-detail-overview.scss":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/visit-detail-overview.scss ***!
  \***************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* 60,70 and 80 are already declared as brand-01, 02 and 03 respectively */\n:root {\n  --brand-01: #005d5d;\n  --brand-02: #004144;\n  --brand-03: #007d79;\n  --bottom-nav-height: 4rem;\n  --workspace-header-height: 3rem;\n  --tablet-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--bottom-nav-height));\n  --desktop-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--workspace-header-height));\n}\n\n/* These color variables will be removed in a future release */\n.-esm-patient-chart__visit-detail-overview__visitType___rDxbw {\n  font-size: var(--cds-heading-compact-02-font-size, 1rem);\n  font-weight: var(--cds-heading-compact-02-font-weight, 600);\n  line-height: var(--cds-heading-compact-02-line-height, 1.375);\n  letter-spacing: var(--cds-heading-compact-02-letter-spacing, 0);\n  color: #525252;\n  margin-bottom: 5px;\n}\n\n.-esm-patient-chart__visit-detail-overview__date___h1FsY {\n  font-size: var(--cds-body-compact-01-font-size, 0.875rem);\n  font-weight: var(--cds-body-compact-01-font-weight, 400);\n  line-height: var(--cds-body-compact-01-line-height, 1.28572);\n  letter-spacing: var(--cds-body-compact-01-letter-spacing, 0.16px);\n  color: #525252;\n  padding-right: 0.625rem;\n}\n\n.-esm-patient-chart__visit-detail-overview__dateLabel___I-EX6 {\n  padding-right: 0.313rem;\n}\n\n.-esm-patient-chart__visit-detail-overview__displayFlex___q2IKc {\n  display: flex;\n  align-items: center;\n  justify-content: left;\n}\n\n.-esm-patient-chart__visit-detail-overview__container___qbR5p {\n  background-color: #ffffff;\n  border: 1px solid #e0e0e0;\n  padding: 1rem;\n  margin: 1rem 0 1rem;\n  width: 100%;\n}\n\n.-esm-patient-chart__visit-detail-overview__tabs___KCHuP > .cds--tab-content {\n  padding: 0 0 !important;\n}\n\n.-esm-patient-chart__visit-detail-overview__tabList___hCqhE {\n  position: sticky;\n  top: 3rem;\n  z-index: 10;\n  background-color: #f4f4f4;\n  border-bottom: 2px solid #e0e0e0;\n}\n.-esm-patient-chart__visit-detail-overview__tabList___hCqhE .cds--tabs__nav-link {\n  border-bottom: none !important;\n}\n\n.-esm-patient-chart__visit-detail-overview__tab___-hJhQ {\n  height: 2.5rem;\n}\n.-esm-patient-chart__visit-detail-overview__tab___-hJhQ:active, .-esm-patient-chart__visit-detail-overview__tab___-hJhQ:focus {\n  outline: none !important;\n}\n.-esm-patient-chart__visit-detail-overview__tab___-hJhQ[aria-selected=true] {\n  border-bottom: 3px solid var(--brand-03) !important;\n}\n\n.-esm-patient-chart__visit-detail-overview__header___Yfe26 .-esm-patient-chart__visit-detail-overview__visitInfo___3Z73L {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n\n.-esm-patient-chart__visit-detail-overview__header___Yfe26::after {\n  content: \"\";\n  display: block;\n  width: 2rem;\n  padding-top: 0.188rem;\n  border-bottom: 0.375rem solid var(--brand-03);\n}\n\n.-esm-patient-chart__visit-detail-overview__toggleButtons___uSrvx {\n  margin: 0 1rem;\n  height: 2.5rem;\n}\n\n.-esm-patient-chart__visit-detail-overview__toggle___qy4aV {\n  border: 1px solid #a6c8ff;\n}\n.-esm-patient-chart__visit-detail-overview__toggle___qy4aV:hover {\n  background-color: #edf5ff;\n}\n.-esm-patient-chart__visit-detail-overview__toggle___qy4aV:active, .-esm-patient-chart__visit-detail-overview__toggle___qy4aV:focus {\n  box-shadow: none;\n  background-color: #edf5ff;\n}\n.-esm-patient-chart__visit-detail-overview__toggle___qy4aV:first-of-type {\n  border-radius: 0.25rem 0 0 0.25rem;\n}\n.-esm-patient-chart__visit-detail-overview__toggle___qy4aV:last-of-type {\n  border-radius: 0 0.25rem 0.25rem 0;\n}\n\n.-esm-patient-chart__visit-detail-overview__emptyStateContainer___yGFkx {\n  text-align: center;\n  margin: 1rem 0;\n}\n\n.-esm-patient-chart__visit-detail-overview__observation___mlrYy {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  grid-gap: 0.5rem;\n  margin: 1rem 1rem 0 0;\n}\n\n.-esm-patient-chart__visit-detail-overview__observation___mlrYy > span {\n  align-self: center;\n}\n\n.-esm-patient-chart__visit-detail-overview__flexSections___H0-Ka {\n  display: flex;\n}\n\n.-esm-patient-chart__visit-detail-overview__desktopTabs___sSz2b button {\n  height: 2rem;\n}\n\n.-esm-patient-chart__visit-detail-overview__tabletTabs___1CBU1 button {\n  height: 3rem;\n}\n\n.-esm-patient-chart__visit-detail-overview__tabContent___U\\+Keh {\n  border-top: 1px solid #e0e0e0;\n  padding: 1rem 0;\n  width: 70%;\n}\n\n.-esm-patient-chart__visit-detail-overview__medicationRecord___jmCmM {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n}\n.-esm-patient-chart__visit-detail-overview__medicationRecord___jmCmM .-esm-patient-chart__visit-detail-overview__bodyLong01___10nWJ {\n  margin: 0.25rem 0;\n}\n\n.-esm-patient-chart__visit-detail-overview__medicationContainer___uYgEc {\n  background-color: #f4f4f4;\n  padding: 1rem;\n  width: 100% !important;\n}\n\n.-esm-patient-chart__visit-detail-overview__dosage___pPx-M {\n  font-size: var(--cds-heading-compact-01-font-size, 0.875rem);\n  font-weight: var(--cds-heading-compact-01-font-weight, 600);\n  line-height: var(--cds-heading-compact-01-line-height, 1.28572);\n  letter-spacing: var(--cds-heading-compact-01-letter-spacing, 0.16px);\n}\n\n.-esm-patient-chart__visit-detail-overview__toggleSwitch___6YWsL {\n  display: flex;\n  flex-direction: row;\n  justify-content: flex-end;\n  margin-bottom: 0.25rem;\n}\n\n.-esm-patient-chart__visit-detail-overview__toggleSwitch___6YWsL div {\n  width: 30%;\n}\n\n.-esm-patient-chart__visit-detail-overview__noteText___xdpyx {\n  background-color: #f4f4f4;\n  padding: 1rem;\n  width: 100% !important;\n  white-space: pre-wrap;\n}\n\n.-esm-patient-chart__visit-detail-overview__metadata___RC3aG {\n  font-size: var(--cds-label-01-font-size, 0.75rem);\n  font-weight: var(--cds-label-01-font-weight, 400);\n  line-height: var(--cds-label-01-line-height, 1.33333);\n  letter-spacing: var(--cds-label-01-letter-spacing, 0.32px);\n  color: #525252;\n  margin: 0.5rem 0 1rem;\n}\n\n.-esm-patient-chart__visit-detail-overview__observationsEmptyState___FM5jT {\n  margin-top: 1.5rem;\n}\n\n.-esm-patient-chart__visit-detail-overview__loader___FOXiP {\n  margin: 0 auto;\n}\n\n.-esm-patient-chart__visit-detail-overview__notesContainer___buWxq {\n  margin-bottom: 2rem;\n}\n\n.-esm-patient-chart__visit-detail-overview__visitDetailOverviewActions___KHMl4 {\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n}\n\n.-esm-patient-chart__visit-detail-overview__loadMoreButton___V2Lsd .cds--inline-loading {\n  min-height: 1rem !important;\n}\n.-esm-patient-chart__visit-detail-overview__loadMoreButton___V2Lsd .cds--inline-loading__text {\n  font-size: unset !important;\n}\n\n.-esm-patient-chart__visit-detail-overview__label01___6d9y6 {\n  font-size: var(--cds-label-01-font-size, 0.75rem);\n  font-weight: var(--cds-label-01-font-weight, 400);\n  line-height: var(--cds-label-01-line-height, 1.33333);\n  letter-spacing: var(--cds-label-01-letter-spacing, 0.32px);\n}\n\n.-esm-patient-chart__visit-detail-overview__text02___-pI5V {\n  color: #525252;\n}\n\n.-esm-patient-chart__visit-detail-overview__bodyLong01___10nWJ {\n  font-size: var(--cds-body-01-font-size, 0.875rem);\n  font-weight: var(--cds-body-01-font-weight, 400);\n  line-height: var(--cds-body-01-line-height, 1.42857);\n  letter-spacing: var(--cds-body-01-letter-spacing, 0.16px);\n}\n\nhtml[dir=rtl] .-esm-patient-chart__visit-detail-overview__header___Yfe26 .-esm-patient-chart__visit-detail-overview__visitInfo___3Z73L {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}", "",{"version":3,"sources":["webpack://./../../node_modules/@openmrs/esm-styleguide/src/_vars.scss","webpack://./src/visit/visits-widget/visit-detail-overview.scss","webpack://./../../node_modules/@carbon/type/scss/_styles.scss","webpack://./../../node_modules/@carbon/layout/scss/generated/_spacing.scss","webpack://./../../node_modules/@carbon/colors/index.scss"],"names":[],"mappings":"AAkCA,0EAAA;AAoBA;EACE,mBAAA;EACA,mBAAA;EACA,mBAAA;EACA,yBAAA;EACA,+BAAA;EACA,oGAAA;EACA,2GAAA;ACpDF;;ADgEA,8DAAA;ACpEA;EC61BI,wDAAA;EAAA,2DAAA;EAAA,6DAAA;EAAA,+DAAA;ED31BF,cAAA;EACA,kBAAA;AAWF;;AARA;ECu1BI,yDAAA;EAAA,wDAAA;EAAA,4DAAA;EAAA,iEAAA;EDr1BF,cDNQ;ECOR,uBAAA;AAcF;;AAXA;EACE,uBAAA;AAcF;;AAXA;EACE,aAAA;EACA,mBAAA;EACA,qBAAA;AAcF;;AAXA;EACE,yBDnBc;ECoBd,yBAAA;EACA,aECW;EFAX,mBAAA;EACA,WAAA;AAcF;;AAXA;EACE,uBAAA;AAcF;;AAXA;EACE,gBAAA;EACA,SAAA;EACA,WAAA;EACA,yBDzCM;EC0CN,gCAAA;AAcF;AAZE;EACE,8BAAA;AAcJ;;AAVA;EACE,cAAA;AAaF;AAXE;EAEE,wBAAA;AAYJ;AATE;EACE,mDAAA;AAWJ;;AANE;EACE,aAAA;EACA,mBAAA;EACA,8BAAA;AASJ;;AALA;EACE,WAAA;EACA,cAAA;EACA,WElCW;EFmCX,qBAAA;EACA,6CAAA;AAQF;;AALA;EACE,cAAA;EACA,cEpCW;AF4Cb;;AALA;EACE,yBAAA;AAQF;AANE;EACE,yBD3EY;ACmFhB;AALE;EAEE,gBAAA;EACA,yBDjFY;ACuFhB;AAHE;EACE,kCAAA;AAKJ;AAFE;EACE,kCAAA;AAIJ;;AAAA;EACE,kBAAA;EACA,cAAA;AAGF;;AAAA;EACE,aAAA;EACA,8BAAA;EACA,gBE9FW;EF+FX,qBAAA;AAGF;;AAAA;EACE,kBAAA;AAGF;;AAAA;EACE,aAAA;AAGF;;AACE;EACE,YExFS;AF0Fb;;AAGE;EACE,YEpFS;AFoFb;;AAIA;EACE,6BAAA;EACA,eAAA;EACA,UAAA;AADF;;AAIA;EACE,aAAA;EACA,sBAAA;EACA,8BAAA;AADF;AAGE;EACE,iBAAA;AADJ;;AAKA;EACE,yBD1JM;EC2JN,aE9HW;EF+HX,sBAAA;AAFF;;AAKA;ECisBI,4DAAA;EAAA,2DAAA;EAAA,+DAAA;EAAA,oEAAA;AD/rBJ;;AAEA;EACE,aAAA;EACA,mBAAA;EACA,yBAAA;EACA,sBEzJW;AF0Jb;;AAEA;EACE,UAAA;AACF;;AAEA;EACE,yBD/KM;ECgLN,aEnJW;EFoJX,sBAAA;EACA,qBAAA;AACF;;AAEA;EC2qBI,iDAAA;EAAA,iDAAA;EAAA,qDAAA;EAAA,0DAAA;EDzqBF,cDlLQ;ECmLR,qBAAA;AAIF;;AADA;EACE,kBE1JW;AF8Jb;;AADA;EACE,cAAA;AAIF;;AADA;EACE,mBE7JW;AFiKb;;AADA;EACE,aAAA;EACA,yBAAA;EACA,mBAAA;AAIF;;AAAE;EACE,2BAAA;AAGJ;AAAE;EACE,2BAAA;AAEJ;;AAEA;ECyoBI,iDAAA;EAAA,iDAAA;EAAA,qDAAA;EAAA,0DAAA;ADpoBJ;;AADA;EACE,cG9KQ;AHkLV;;AADA;ECioBI,iDAAA;EAAA,gDAAA;EAAA,oDAAA;EAAA,yDAAA;ADznBJ;;AADI;EACE,aAAA;EACA,mBAAA;EACA,8BAAA;AAIN","sourcesContent":["@use '@carbon/layout';\n\n$ui-01: #f4f4f4;\n$ui-02: #ffffff;\n$ui-03: #e0e0e0;\n$ui-04: #8d8d8d;\n$ui-05: #161616;\n$text-02: #525252;\n$text-03: #a8a8a8;\n$ui-background: #ffffff;\n$color-gray-30: #c6c6c6;\n$color-gray-70: #525252;\n$color-gray-100: #161616;\n$color-blue-60-2: #0f62fe;\n$color-blue-10: #edf5ff;\n$color-yellow-50: #feecae;\n$carbon--red-50: #fa4d56;\n$inverse-link: #78a9ff;\n$support-02: #24a148;\n$inverse-support-03: #f1c21b;\n$warning-background: #fff8e1;\n$openmrs-background-grey: #f4f4f4;\n$danger: #da1e28;\n$interactive-01: #0f62fe;\n$field-01: #f4f4f4;\n$grey-2: #e0e0e0;\n$labeldropdown: #c6c6c6;\n\n$brand-primary-10: #d9fbfb;\n$brand-primary-20: #9ef0f0;\n$brand-primary-30: #3ddbd9;\n$brand-primary-40: #08bdba;\n$brand-primary-50: #009d9a;\n\n/* 60,70 and 80 are already declared as brand-01, 02 and 03 respectively */\n\n$brand-primary-90: #022b30;\n$brand-primary-100: #081a1c;\n\n@mixin brand-01($property) {\n  #{$property}: #005d5d;\n  #{$property}: var(--brand-01);\n}\n\n@mixin brand-02($property) {\n  #{$property}: #004144;\n  #{$property}: var(--brand-02);\n}\n\n@mixin brand-03($property) {\n  #{$property}: #007d79;\n  #{$property}: var(--brand-03);\n}\n\n:root {\n  --brand-01: #005d5d;\n  --brand-02: #004144;\n  --brand-03: #007d79;\n  --bottom-nav-height: #{layout.$spacing-10};\n  --workspace-header-height: #{layout.$spacing-09};\n  --tablet-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--bottom-nav-height));\n  --desktop-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--workspace-header-height));\n}\n\n$breakpoint-phone-min: 0px;\n$breakpoint-phone-max: 600px;\n$breakpoint-tablet-min: 601px;\n$breakpoint-tablet-max: 1023px;\n$breakpoint-small-desktop-min: 1024px;\n$breakpoint-small-desktop-max: 1439px;\n$breakpoint-large-desktop-min: 1440px;\n$breakpoint-large-desktop-max: 99999999px;\n\n/* These color variables will be removed in a future release */\n$brand-teal-01: #007d79;\n$brand-01: #005d5d;\n$brand-02: #004144;\n","@use '@carbon/colors';\n@use '@carbon/layout';\n@use '@carbon/type';\n@use '@openmrs/esm-styleguide/src/vars' as *;\n\n.visitType {\n  @include type.type-style('heading-compact-02');\n  color: $text-02;\n  margin-bottom: 5px;\n}\n\n.date {\n  @include type.type-style('body-compact-01');\n  color: $text-02;\n  padding-right: 0.625rem;\n}\n\n.dateLabel {\n  padding-right: 0.313rem;\n}\n\n.displayFlex {\n  display: flex;\n  align-items: center;\n  justify-content: left;\n}\n\n.container {\n  background-color: $ui-background;\n  border: 1px solid $grey-2;\n  padding: layout.$spacing-05;\n  margin: layout.$spacing-05 0 layout.$spacing-05;\n  width: 100%;\n}\n\n.tabs > :global(.cds--tab-content) {\n  padding: 0 0 !important;\n}\n\n.tabList {\n  position: sticky;\n  top: 3rem;\n  z-index: 10;\n  background-color: $ui-01;\n  border-bottom: 2px solid $ui-03;\n\n  & :global(.cds--tabs__nav-link) {\n    border-bottom: none !important;\n  }\n}\n\n.tab {\n  height: 2.5rem;\n\n  &:active,\n  &:focus {\n    outline: none !important;\n  }\n\n  &[aria-selected='true'] {\n    border-bottom: 3px solid var(--brand-03) !important;\n  }\n}\n\n.header {\n  .visitInfo {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n  }\n}\n\n.header::after {\n  content: '';\n  display: block;\n  width: layout.$spacing-07;\n  padding-top: 0.188rem;\n  border-bottom: 0.375rem solid var(--brand-03);\n}\n\n.toggleButtons {\n  margin: 0 layout.$spacing-05;\n  height: layout.$spacing-08;\n}\n\n.toggle {\n  border: 1px solid colors.$blue-30;\n\n  &:hover {\n    background-color: $color-blue-10;\n  }\n\n  &:active,\n  &:focus {\n    box-shadow: none;\n    background-color: $color-blue-10;\n  }\n\n  &:first-of-type {\n    border-radius: layout.$spacing-02 0 0 layout.$spacing-02;\n  }\n\n  &:last-of-type {\n    border-radius: 0 layout.$spacing-02 layout.$spacing-02 0;\n  }\n}\n\n.emptyStateContainer {\n  text-align: center;\n  margin: layout.$spacing-05 0;\n}\n\n.observation {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  grid-gap: layout.$spacing-03;\n  margin: layout.$spacing-05 layout.$spacing-05 0 0;\n}\n\n.observation > span {\n  align-self: center;\n}\n\n.flexSections {\n  display: flex;\n}\n\n.desktopTabs {\n  button {\n    height: layout.$spacing-07;\n  }\n}\n\n.tabletTabs {\n  button {\n    height: layout.$spacing-09;\n  }\n}\n\n.tabContent {\n  border-top: 1px solid $ui-03;\n  padding: layout.$spacing-05 0;\n  width: 70%;\n}\n\n.medicationRecord {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n\n  .bodyLong01 {\n    margin: layout.$spacing-02 0;\n  }\n}\n\n.medicationContainer {\n  background-color: $ui-01;\n  padding: layout.$spacing-05;\n  width: 100% !important;\n}\n\n.dosage {\n  @include type.type-style('heading-compact-01');\n}\n\n.toggleSwitch {\n  display: flex;\n  flex-direction: row;\n  justify-content: flex-end;\n  margin-bottom: layout.$spacing-02;\n}\n\n.toggleSwitch div {\n  width: 30%;\n}\n\n.noteText {\n  background-color: $ui-01;\n  padding: layout.$spacing-05;\n  width: 100% !important;\n  white-space: pre-wrap;\n}\n\n.metadata {\n  @include type.type-style('label-01');\n  color: $text-02;\n  margin: layout.$spacing-03 0 layout.$spacing-05;\n}\n\n.observationsEmptyState {\n  margin-top: layout.$spacing-06;\n}\n\n.loader {\n  margin: 0 auto;\n}\n\n.notesContainer {\n  margin-bottom: layout.$spacing-07;\n}\n\n.visitDetailOverviewActions {\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n}\n\n.loadMoreButton {\n  :global(.cds--inline-loading) {\n    min-height: layout.$spacing-05 !important;\n  }\n\n  :global(.cds--inline-loading__text) {\n    font-size: unset !important;\n  }\n}\n\n.label01 {\n  @include type.type-style('label-01');\n}\n\n.text02 {\n  color: colors.$gray-70;\n}\n\n.bodyLong01 {\n  @include type.type-style('body-01');\n}\n\n// Overriding styles for RTL support\nhtml[dir='rtl'] {\n  .header {\n    .visitInfo {\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n    }\n  }\n}\n","//\n// Copyright IBM Corp. 2018, 2023\n//\n// This source code is licensed under the Apache-2.0 license found in the\n// LICENSE file in the root directory of this source tree.\n//\n\n// stylelint-disable number-max-precision\n\n@use 'sass:map';\n@use 'sass:math';\n@use '@carbon/grid/scss/config' as gridconfig;\n@use '@carbon/grid/scss/breakpoint' as grid;\n@use 'prefix' as *;\n@use 'font-family';\n@use 'scale';\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$caption-01: (\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$caption-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$label-01: (\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$label-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$legal-01: (\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$legal-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$helper-text-01: (\n  font-size: scale.type-scale(1),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$helper-text-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-short-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-compact-01: $body-short-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-long-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.42857,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-01: $body-long-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-short-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.375,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-compact-02: $body-short-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-long-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.5,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-02: $body-long-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$code-01: (\n  font-family: font-family.font-family('mono'),\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$code-02: (\n  font-family: font-family.font-family('mono'),\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.42857,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.42857,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-compact-01: $productive-heading-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.5,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.375,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-compact-02: $productive-heading-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-03: (\n  font-size: scale.type-scale(5),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.4,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-03: $productive-heading-03 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-04: (\n  font-size: scale.type-scale(7),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-04: $productive-heading-04 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-05: (\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.25,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-05: $productive-heading-05 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-06: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  // Extra digit needed for precision in Chrome\n  line-height: 1.199,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-06: $productive-heading-06 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-07: (\n  font-size: scale.type-scale(12),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-07: $productive-heading-07 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-01: $heading-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-02: $heading-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-03: (\n  font-size: scale.type-scale(5),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.4,\n  letter-spacing: 0,\n  breakpoints: (\n    xlg: (\n      font-size: scale.type-scale(5),\n      line-height: 1.4,\n    ),\n    max: (\n      font-size: scale.type-scale(6),\n      line-height: 1.334,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-03: $expressive-heading-03 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-04: (\n  font-size: scale.type-scale(7),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0,\n  breakpoints: (\n    xlg: (\n      font-size: scale.type-scale(8),\n      line-height: 1.25,\n      font-weight: font-family.font-weight('regular'),\n    ),\n    max: (\n      font-size: scale.type-scale(8),\n      font-weight: font-family.font-weight('regular'),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-04: $expressive-heading-04 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-05: (\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.25,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(9),\n      font-weight: font-family.font-weight('light'),\n      line-height: 1.22,\n    ),\n    lg: (\n      font-size: scale.type-scale(10),\n      line-height: 1.19,\n    ),\n    xlg: (\n      font-size: scale.type-scale(11),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(13),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-05: $expressive-heading-05 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-06: (\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.25,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(9),\n      line-height: 1.22,\n    ),\n    lg: (\n      font-size: scale.type-scale(10),\n      line-height: 1.19,\n    ),\n    xlg: (\n      font-size: scale.type-scale(11),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(13),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-06: $expressive-heading-06 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-paragraph-01: (\n  font-size: scale.type-scale(6),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.334,\n  letter-spacing: 0,\n  breakpoints: (\n    lg: (\n      font-size: scale.type-scale(7),\n      line-height: 1.28572,\n    ),\n    max: (\n      font-size: scale.type-scale(8),\n      line-height: 1.25,\n    ),\n  ),\n);\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-paragraph-01: $expressive-paragraph-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$quotation-01: (\n  font-family: font-family.font-family('serif'),\n  font-size: scale.type-scale(5),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.3,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(5),\n    ),\n    lg: (\n      font-size: scale.type-scale(6),\n      line-height: 1.334,\n    ),\n    xlg: (\n      font-size: scale.type-scale(7),\n      line-height: 1.28572,\n    ),\n    max: (\n      font-size: scale.type-scale(8),\n      line-height: 1.25,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-quotation-01: $quotation-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$quotation-02: (\n  font-family: font-family.font-family('serif'),\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.25,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(9),\n      line-height: 1.22,\n    ),\n    lg: (\n      font-size: scale.type-scale(10),\n      line-height: 1.19,\n    ),\n    xlg: (\n      font-size: scale.type-scale(11),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(13),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-quotation-02: $quotation-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-01: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(10),\n    ),\n    lg: (\n      font-size: scale.type-scale(12),\n    ),\n    xlg: (\n      font-size: scale.type-scale(13),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(15),\n      line-height: 1.13,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-01: $display-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-02: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(10),\n    ),\n    lg: (\n      font-size: scale.type-scale(12),\n    ),\n    xlg: (\n      font-size: scale.type-scale(13),\n      line-height: 1.16,\n    ),\n    max: (\n      font-size: scale.type-scale(15),\n      line-height: 1.13,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-02: $display-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-03: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(12),\n      line-height: 1.18,\n    ),\n    lg: (\n      font-size: scale.type-scale(13),\n      line-height: 1.16,\n      letter-spacing: -0.64px,\n    ),\n    xlg: (\n      font-size: scale.type-scale(15),\n      line-height: 1.13,\n      letter-spacing: -0.64px,\n    ),\n    max: (\n      font-size: scale.type-scale(16),\n      line-height: 1.11,\n      letter-spacing: -0.96px,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-03: $display-03 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-04: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(14),\n      line-height: 1.15,\n    ),\n    lg: (\n      font-size: scale.type-scale(17),\n      line-height: 1.11,\n      letter-spacing: -0.64px,\n    ),\n    xlg: (\n      font-size: scale.type-scale(20),\n      line-height: 1.07,\n      letter-spacing: -0.64px,\n    ),\n    max: (\n      font-size: scale.type-scale(23),\n      line-height: 1.05,\n      letter-spacing: -0.96px,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-04: $display-04 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$tokens: (\n  caption-01: $caption-01,\n  caption-02: $caption-02,\n  label-01: $label-01,\n  label-02: $label-02,\n  helper-text-01: $helper-text-01,\n  helper-text-02: $helper-text-02,\n  body-short-01: $body-short-01,\n  body-short-02: $body-short-02,\n  body-long-01: $body-long-01,\n  body-long-02: $body-long-02,\n  code-01: $code-01,\n  code-02: $code-02,\n  heading-01: $heading-01,\n  heading-02: $heading-02,\n  productive-heading-01: $productive-heading-01,\n  productive-heading-02: $productive-heading-02,\n  productive-heading-03: $productive-heading-03,\n  productive-heading-04: $productive-heading-04,\n  productive-heading-05: $productive-heading-05,\n  productive-heading-06: $productive-heading-06,\n  productive-heading-07: $productive-heading-07,\n  expressive-paragraph-01: $expressive-paragraph-01,\n  expressive-heading-01: $expressive-heading-01,\n  expressive-heading-02: $expressive-heading-02,\n  expressive-heading-03: $expressive-heading-03,\n  expressive-heading-04: $expressive-heading-04,\n  expressive-heading-05: $expressive-heading-05,\n  expressive-heading-06: $expressive-heading-06,\n  quotation-01: $quotation-01,\n  quotation-02: $quotation-02,\n  display-01: $display-01,\n  display-02: $display-02,\n  display-03: $display-03,\n  display-04: $display-04,\n  // V11 Tokens\n  legal-01: $legal-01,\n  legal-02: $legal-02,\n  body-compact-01: $body-compact-01,\n  body-compact-02: $body-compact-02,\n  heading-compact-01: $heading-compact-01,\n  heading-compact-02: $heading-compact-02,\n  body-01: $body-01,\n  body-02: $body-02,\n  heading-03: $heading-03,\n  heading-04: $heading-04,\n  heading-05: $heading-05,\n  heading-06: $heading-06,\n  heading-07: $heading-07,\n  fluid-heading-03: $fluid-heading-03,\n  fluid-heading-04: $fluid-heading-04,\n  fluid-heading-05: $fluid-heading-05,\n  fluid-heading-06: $fluid-heading-06,\n  fluid-paragraph-01: $fluid-paragraph-01,\n  fluid-quotation-01: $fluid-quotation-01,\n  fluid-quotation-02: $fluid-quotation-02,\n  fluid-display-01: $fluid-display-01,\n  fluid-display-02: $fluid-display-02,\n  fluid-display-03: $fluid-display-03,\n  fluid-display-04: $fluid-display-04,\n) !default;\n\n/// @param {Map} $map\n/// @access public\n/// @group @carbon/type\n@mixin properties($map) {\n  @each $name, $value in $map {\n    #{$name}: $value;\n  }\n}\n\n/// @param {Number} $value - Number with units\n/// @return {Number} Without units\n/// @access public\n/// @group @carbon/type\n@function strip-unit($value) {\n  @return math.div($value, $value * 0 + 1);\n}\n\n/// This helper includes fluid type styles for the given token value. Fluid type\n/// means that the `font-size` is computed using `calc()` in order to be\n/// determined by the screen size instead of a breakpoint. As a result, fluid\n/// styles should be used with caution in fixed width contexts.\n///\n/// In addition, we make use of %-based line-heights so that the line-height of\n/// each type style is computed correctly due to the dynamic nature of the\n/// `font-size`.\n///\n/// Most of the logic for this work comes from CSS Tricks:\n/// https://css-tricks.com/snippets/css/fluid-typography/\n///\n/// @param {Map} $type-styles - The value of a given type token\n/// @param {Map} $breakpoints [$grid-breakpoints] - Custom breakpoints to use\n/// @access public\n/// @group @carbon/type\n@mixin fluid-type($type-styles, $breakpoints: gridconfig.$grid-breakpoints) {\n  // Include the initial styles for the given token by default without any\n  // media query guard. This includes `font-size` as a fallback in the case\n  // that a browser does not support `calc()`\n  @include properties(map.remove($type-styles, breakpoints));\n  // We also need to include the `sm` styles by default since they don't\n  // appear in the fluid styles for tokens\n  @include fluid-type-size($type-styles, sm, $breakpoints);\n\n  // Finally, we need to go through all the breakpoints defined in the type\n  // token and apply the properties and fluid type size for that given\n  // breakpoint\n  @each $name, $values in map.get($type-styles, breakpoints) {\n    @include grid.breakpoint($name) {\n      @include properties($values);\n      @include fluid-type-size($type-styles, $name, $breakpoints);\n    }\n  }\n}\n\n/// Computes the fluid `font-size` for a given type style and breakpoint\n/// @param {Map} $type-styles - The styles for a given token\n/// @param {String} $name - The name of the breakpoint to which we apply the fluid\n/// @param {Map} $breakpoints [$grid-breakpoints] - The breakpoints for the grid system\n/// @access public\n/// @group @carbon/type\n@mixin fluid-type-size(\n  $type-styles,\n  $name,\n  $breakpoints: gridconfig.$grid-breakpoints\n) {\n  // Get the information about the breakpoint we're currently working in. Useful\n  // for getting initial width information\n  $breakpoint: map.get($breakpoints, $name);\n\n  // Our fluid styles are captured under the 'breakpoints' property in our type\n  // styles map. These define what values to treat as `max-` variables below\n  $fluid-sizes: map.get($type-styles, breakpoints);\n  $fluid-breakpoint: ();\n  // Special case for `sm` because the styles for small are on the type style\n  // directly\n  @if $name == sm {\n    $fluid-breakpoint: map.remove($type-styles, breakpoints);\n  } @else {\n    $fluid-breakpoint: map.get($fluid-sizes, $name);\n  }\n\n  // Initialize our font-sizes to the default size for the type style\n  $max-font-size: map.get($type-styles, font-size);\n  $min-font-size: map.get($type-styles, font-size);\n  @if map.has-key($fluid-breakpoint, font-size) {\n    $min-font-size: map.get($fluid-breakpoint, font-size);\n  }\n\n  // Initialize our min and max width to the width of the current breakpoint\n  $max-vw: map.get($breakpoint, width);\n  $min-vw: map.get($breakpoint, width);\n\n  // We can use `breakpoint-next` to see if there is another breakpoint we can\n  // use to update `max-font-size` and `max-vw` with larger values\n  $next-breakpoint-available: grid.breakpoint-next($name, $breakpoints);\n  $next-fluid-breakpoint-name: null;\n\n  // We need to figure out what the next available fluid breakpoint is for our\n  // given $type-styles. In this loop we try and iterate through breakpoints\n  // until we either manually set $next-breakpoint-available to null or\n  // `breakpoint-next` returns null.\n  @while $next-breakpoint-available {\n    @if map.has-key($fluid-sizes, $next-breakpoint-available) {\n      $next-fluid-breakpoint-name: $next-breakpoint-available;\n      $next-breakpoint-available: null;\n    } @else {\n      $next-breakpoint-available: grid.breakpoint-next(\n        $next-breakpoint-available,\n        $breakpoints\n      );\n    }\n  }\n\n  // If we have found the next available fluid breakpoint name, then we know\n  // that we have values that we can use to set max-font-size and max-vw as both\n  // values derive from the next breakpoint\n  @if $next-fluid-breakpoint-name {\n    $next-fluid-breakpoint: map.get($breakpoints, $next-fluid-breakpoint-name);\n    $max-font-size: map.get(\n      map.get($fluid-sizes, $next-fluid-breakpoint-name),\n      font-size\n    );\n    $max-vw: map.get($next-fluid-breakpoint, width);\n\n    // prettier-ignore\n    font-size: calc(#{$min-font-size} +\n      #{strip-unit($max-font-size - $min-font-size)} *\n      ((100vw - #{$min-vw}) / #{strip-unit($max-vw - $min-vw)})\n    );\n  } @else {\n    // Otherwise, just default to setting the font size found from the type\n    // style or the given fluid breakpoint in the type style\n    font-size: $min-font-size;\n  }\n}\n\n// TODO move following variable and `custom-property` mixin into shared file for\n// both `@carbon/type` and `@carbon/themes`\n\n/// @access private\n/// @group @carbon/type\n@mixin custom-properties($name, $value) {\n  @each $property, $value in $value {\n    #{$property}: var(\n      --#{$custom-property-prefix}-#{$name}-#{$property},\n      #{$value}\n    );\n  }\n}\n\n/// Helper mixin to include the styles for a given token in any selector in your\n/// project. Also includes an optional fluid option that will enable fluid\n/// styles for the token if they are defined. Fluid styles will cause the\n/// token's font-size to be computed based on the viewport size. As a result, use\n/// with caution in fixed contexts.\n/// @param {String} $name - The name of the token to get the styles for\n/// @param {Boolean} $fluid [false] - Specify whether to include fluid styles for the\n/// @param {Map} $breakpoints [$grid-breakpoints] - Provide a custom breakpoint map to use\n/// @access public\n/// @group @carbon/type\n@mixin type-style(\n  $name,\n  $fluid: false,\n  $breakpoints: gridconfig.$grid-breakpoints\n) {\n  @if not map.has-key($tokens, $name) {\n    @error 'Unable to find a token with the name: `#{$name}`';\n  }\n\n  $token: map.get($tokens, $name);\n\n  // If $fluid is set to true and the token has breakpoints defined for fluid\n  // styles, delegate to the fluid-type helper for the given token\n  @if $fluid == true and map.has-key($token, 'breakpoints') {\n    @include fluid-type($token, $breakpoints);\n  } @else {\n    @include custom-properties($name, $token);\n  }\n}\n","// Code generated by @carbon/layout. DO NOT EDIT.\n//\n// Copyright IBM Corp. 2018, 2023\n//\n// This source code is licensed under the Apache-2.0 license found in the\n// LICENSE file in the root directory of this source tree.\n//\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-01: 0.125rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-02: 0.25rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-03: 0.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-04: 0.75rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-05: 1rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-06: 1.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-07: 2rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-08: 2.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-09: 3rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-10: 4rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-11: 5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-12: 6rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-13: 10rem !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/layout\n$spacing: (\n  spacing-01: $spacing-01,\n  spacing-02: $spacing-02,\n  spacing-03: $spacing-03,\n  spacing-04: $spacing-04,\n  spacing-05: $spacing-05,\n  spacing-06: $spacing-06,\n  spacing-07: $spacing-07,\n  spacing-08: $spacing-08,\n  spacing-09: $spacing-09,\n  spacing-10: $spacing-10,\n  spacing-11: $spacing-11,\n  spacing-12: $spacing-12,\n  spacing-13: $spacing-13,\n);\n","// Code generated by @carbon/colors. DO NOT EDIT.\n//\n// Copyright IBM Corp. 2018, 2023\n//\n// This source code is licensed under the Apache-2.0 license found in the\n// LICENSE file in the root directory of this source tree.\n//\n\n$black: #000000 !default;\n$white: #ffffff !default;\n\n$black-100: #000000 !default;\n$blue-10: #edf5ff !default;\n$blue-20: #d0e2ff !default;\n$blue-30: #a6c8ff !default;\n$blue-40: #78a9ff !default;\n$blue-50: #4589ff !default;\n$blue-60: #0f62fe !default;\n$blue-70: #0043ce !default;\n$blue-80: #002d9c !default;\n$blue-90: #001d6c !default;\n$blue-100: #001141 !default;\n$cool-gray-10: #f2f4f8 !default;\n$cool-gray-20: #dde1e6 !default;\n$cool-gray-30: #c1c7cd !default;\n$cool-gray-40: #a2a9b0 !default;\n$cool-gray-50: #878d96 !default;\n$cool-gray-60: #697077 !default;\n$cool-gray-70: #4d5358 !default;\n$cool-gray-80: #343a3f !default;\n$cool-gray-90: #21272a !default;\n$cool-gray-100: #121619 !default;\n$cyan-10: #e5f6ff !default;\n$cyan-20: #bae6ff !default;\n$cyan-30: #82cfff !default;\n$cyan-40: #33b1ff !default;\n$cyan-50: #1192e8 !default;\n$cyan-60: #0072c3 !default;\n$cyan-70: #00539a !default;\n$cyan-80: #003a6d !default;\n$cyan-90: #012749 !default;\n$cyan-100: #061727 !default;\n$gray-10: #f4f4f4 !default;\n$gray-20: #e0e0e0 !default;\n$gray-30: #c6c6c6 !default;\n$gray-40: #a8a8a8 !default;\n$gray-50: #8d8d8d !default;\n$gray-60: #6f6f6f !default;\n$gray-70: #525252 !default;\n$gray-80: #393939 !default;\n$gray-90: #262626 !default;\n$gray-100: #161616 !default;\n$green-10: #defbe6 !default;\n$green-20: #a7f0ba !default;\n$green-30: #6fdc8c !default;\n$green-40: #42be65 !default;\n$green-50: #24a148 !default;\n$green-60: #198038 !default;\n$green-70: #0e6027 !default;\n$green-80: #044317 !default;\n$green-90: #022d0d !default;\n$green-100: #071908 !default;\n$magenta-10: #fff0f7 !default;\n$magenta-20: #ffd6e8 !default;\n$magenta-30: #ffafd2 !default;\n$magenta-40: #ff7eb6 !default;\n$magenta-50: #ee5396 !default;\n$magenta-60: #d02670 !default;\n$magenta-70: #9f1853 !default;\n$magenta-80: #740937 !default;\n$magenta-90: #510224 !default;\n$magenta-100: #2a0a18 !default;\n$orange-10: #fff2e8 !default;\n$orange-20: #ffd9be !default;\n$orange-30: #ffb784 !default;\n$orange-40: #ff832b !default;\n$orange-50: #eb6200 !default;\n$orange-60: #ba4e00 !default;\n$orange-70: #8a3800 !default;\n$orange-80: #5e2900 !default;\n$orange-90: #3e1a00 !default;\n$orange-100: #231000 !default;\n$purple-10: #f6f2ff !default;\n$purple-20: #e8daff !default;\n$purple-30: #d4bbff !default;\n$purple-40: #be95ff !default;\n$purple-50: #a56eff !default;\n$purple-60: #8a3ffc !default;\n$purple-70: #6929c4 !default;\n$purple-80: #491d8b !default;\n$purple-90: #31135e !default;\n$purple-100: #1c0f30 !default;\n$red-10: #fff1f1 !default;\n$red-20: #ffd7d9 !default;\n$red-30: #ffb3b8 !default;\n$red-40: #ff8389 !default;\n$red-50: #fa4d56 !default;\n$red-60: #da1e28 !default;\n$red-70: #a2191f !default;\n$red-80: #750e13 !default;\n$red-90: #520408 !default;\n$red-100: #2d0709 !default;\n$teal-10: #d9fbfb !default;\n$teal-20: #9ef0f0 !default;\n$teal-30: #3ddbd9 !default;\n$teal-40: #08bdba !default;\n$teal-50: #009d9a !default;\n$teal-60: #007d79 !default;\n$teal-70: #005d5d !default;\n$teal-80: #004144 !default;\n$teal-90: #022b30 !default;\n$teal-100: #081a1c !default;\n$warm-gray-10: #f7f3f2 !default;\n$warm-gray-20: #e5e0df !default;\n$warm-gray-30: #cac5c4 !default;\n$warm-gray-40: #ada8a8 !default;\n$warm-gray-50: #8f8b8b !default;\n$warm-gray-60: #726e6e !default;\n$warm-gray-70: #565151 !default;\n$warm-gray-80: #3c3838 !default;\n$warm-gray-90: #272525 !default;\n$warm-gray-100: #171414 !default;\n$white-0: #ffffff !default;\n$yellow-10: #fcf4d6 !default;\n$yellow-20: #fddc69 !default;\n$yellow-30: #f1c21b !default;\n$yellow-40: #d2a106 !default;\n$yellow-50: #b28600 !default;\n$yellow-60: #8e6a00 !default;\n$yellow-70: #684e00 !default;\n$yellow-80: #483700 !default;\n$yellow-90: #302400 !default;\n$yellow-100: #1c1500 !default;\n\n$white-hover: #e8e8e8 !default;\n$black-hover: #212121 !default;\n$blue-10-hover: #dbebff !default;\n$blue-20-hover: #b8d3ff !default;\n$blue-30-hover: #8ab6ff !default;\n$blue-40-hover: #5c97ff !default;\n$blue-50-hover: #1f70ff !default;\n$blue-60-hover: #0050e6 !default;\n$blue-70-hover: #0053ff !default;\n$blue-80-hover: #0039c7 !default;\n$blue-90-hover: #00258a !default;\n$blue-100-hover: #001f75 !default;\n$cool-gray-10-hover: #e4e9f1 !default;\n$cool-gray-20-hover: #cdd3da !default;\n$cool-gray-30-hover: #adb5bd !default;\n$cool-gray-40-hover: #9199a1 !default;\n$cool-gray-50-hover: #757b85 !default;\n$cool-gray-60-hover: #585e64 !default;\n$cool-gray-70-hover: #5d646a !default;\n$cool-gray-80-hover: #434a51 !default;\n$cool-gray-90-hover: #2b3236 !default;\n$cool-gray-100-hover: #222a2f !default;\n$cyan-10-hover: #cceeff !default;\n$cyan-20-hover: #99daff !default;\n$cyan-30-hover: #57beff !default;\n$cyan-40-hover: #059fff !default;\n$cyan-50-hover: #0f7ec8 !default;\n$cyan-60-hover: #005fa3 !default;\n$cyan-70-hover: #0066bd !default;\n$cyan-80-hover: #00498a !default;\n$cyan-90-hover: #013360 !default;\n$cyan-100-hover: #0b2947 !default;\n$gray-10-hover: #e8e8e8 !default;\n$gray-20-hover: #d1d1d1 !default;\n$gray-30-hover: #b5b5b5 !default;\n$gray-40-hover: #999999 !default;\n$gray-50-hover: #7a7a7a !default;\n$gray-60-hover: #5e5e5e !default;\n$gray-70-hover: #636363 !default;\n$gray-80-hover: #474747 !default;\n$gray-90-hover: #333333 !default;\n$gray-100-hover: #292929 !default;\n$green-10-hover: #b6f6c8 !default;\n$green-20-hover: #74e792 !default;\n$green-30-hover: #36ce5e !default;\n$green-40-hover: #3bab5a !default;\n$green-50-hover: #208e3f !default;\n$green-60-hover: #166f31 !default;\n$green-70-hover: #11742f !default;\n$green-80-hover: #05521c !default;\n$green-90-hover: #033b11 !default;\n$green-100-hover: #0d300f !default;\n$magenta-10-hover: #ffe0ef !default;\n$magenta-20-hover: #ffbdda !default;\n$magenta-30-hover: #ff94c3 !default;\n$magenta-40-hover: #ff57a0 !default;\n$magenta-50-hover: #e3176f !default;\n$magenta-60-hover: #b0215f !default;\n$magenta-70-hover: #bf1d63 !default;\n$magenta-80-hover: #8e0b43 !default;\n$magenta-90-hover: #68032e !default;\n$magenta-100-hover: #53142f !default;\n$orange-10-hover: #ffe2cc !default;\n$orange-20-hover: #ffc69e !default;\n$orange-30-hover: #ff9d57 !default;\n$orange-40-hover: #fa6800 !default;\n$orange-50-hover: #cc5500 !default;\n$orange-60-hover: #9e4200 !default;\n$orange-70-hover: #a84400 !default;\n$orange-80-hover: #753300 !default;\n$orange-90-hover: #522200 !default;\n$orange-100-hover: #421e00 !default;\n$purple-10-hover: #ede5ff !default;\n$purple-20-hover: #dcc7ff !default;\n$purple-30-hover: #c5a3ff !default;\n$purple-40-hover: #ae7aff !default;\n$purple-50-hover: #9352ff !default;\n$purple-60-hover: #7822fb !default;\n$purple-70-hover: #7c3dd6 !default;\n$purple-80-hover: #5b24ad !default;\n$purple-90-hover: #40197b !default;\n$purple-100-hover: #341c59 !default;\n$red-10-hover: #ffe0e0 !default;\n$red-20-hover: #ffc2c5 !default;\n$red-30-hover: #ff99a0 !default;\n$red-40-hover: #ff6168 !default;\n$red-50-hover: #ee0713 !default;\n$red-60-hover: #b81922 !default;\n$red-70-hover: #c21e25 !default;\n$red-80-hover: #921118 !default;\n$red-90-hover: #66050a !default;\n$red-100-hover: #540d11 !default;\n$teal-10-hover: #acf6f6 !default;\n$teal-20-hover: #57e5e5 !default;\n$teal-30-hover: #25cac8 !default;\n$teal-40-hover: #07aba9 !default;\n$teal-50-hover: #008a87 !default;\n$teal-60-hover: #006b68 !default;\n$teal-70-hover: #007070 !default;\n$teal-80-hover: #005357 !default;\n$teal-90-hover: #033940 !default;\n$teal-100-hover: #0f3034 !default;\n$warm-gray-10-hover: #f0e8e6 !default;\n$warm-gray-20-hover: #d8d0cf !default;\n$warm-gray-30-hover: #b9b3b1 !default;\n$warm-gray-40-hover: #9c9696 !default;\n$warm-gray-50-hover: #7f7b7b !default;\n$warm-gray-60-hover: #605d5d !default;\n$warm-gray-70-hover: #696363 !default;\n$warm-gray-80-hover: #4c4848 !default;\n$warm-gray-90-hover: #343232 !default;\n$warm-gray-100-hover: #2c2626 !default;\n$yellow-10-hover: #f8e6a0 !default;\n$yellow-20-hover: #fccd27 !default;\n$yellow-30-hover: #ddb00e !default;\n$yellow-40-hover: #bc9005 !default;\n$yellow-50-hover: #9e7700 !default;\n$yellow-60-hover: #755800 !default;\n$yellow-70-hover: #806000 !default;\n$yellow-80-hover: #5c4600 !default;\n$yellow-90-hover: #3d2e00 !default;\n$yellow-100-hover: #332600 !default;\n\n/// Colors from the IBM Design Language\n/// @access public\n/// @group @carbon/colors\n$colors: (\n  black: (\n    100: #000000,\n  ),\n  blue: (\n    10: #edf5ff,\n    20: #d0e2ff,\n    30: #a6c8ff,\n    40: #78a9ff,\n    50: #4589ff,\n    60: #0f62fe,\n    70: #0043ce,\n    80: #002d9c,\n    90: #001d6c,\n    100: #001141,\n  ),\n  cool-gray: (\n    10: #f2f4f8,\n    20: #dde1e6,\n    30: #c1c7cd,\n    40: #a2a9b0,\n    50: #878d96,\n    60: #697077,\n    70: #4d5358,\n    80: #343a3f,\n    90: #21272a,\n    100: #121619,\n  ),\n  cyan: (\n    10: #e5f6ff,\n    20: #bae6ff,\n    30: #82cfff,\n    40: #33b1ff,\n    50: #1192e8,\n    60: #0072c3,\n    70: #00539a,\n    80: #003a6d,\n    90: #012749,\n    100: #061727,\n  ),\n  gray: (\n    10: #f4f4f4,\n    20: #e0e0e0,\n    30: #c6c6c6,\n    40: #a8a8a8,\n    50: #8d8d8d,\n    60: #6f6f6f,\n    70: #525252,\n    80: #393939,\n    90: #262626,\n    100: #161616,\n  ),\n  green: (\n    10: #defbe6,\n    20: #a7f0ba,\n    30: #6fdc8c,\n    40: #42be65,\n    50: #24a148,\n    60: #198038,\n    70: #0e6027,\n    80: #044317,\n    90: #022d0d,\n    100: #071908,\n  ),\n  magenta: (\n    10: #fff0f7,\n    20: #ffd6e8,\n    30: #ffafd2,\n    40: #ff7eb6,\n    50: #ee5396,\n    60: #d02670,\n    70: #9f1853,\n    80: #740937,\n    90: #510224,\n    100: #2a0a18,\n  ),\n  orange: (\n    10: #fff2e8,\n    20: #ffd9be,\n    30: #ffb784,\n    40: #ff832b,\n    50: #eb6200,\n    60: #ba4e00,\n    70: #8a3800,\n    80: #5e2900,\n    90: #3e1a00,\n    100: #231000,\n  ),\n  purple: (\n    10: #f6f2ff,\n    20: #e8daff,\n    30: #d4bbff,\n    40: #be95ff,\n    50: #a56eff,\n    60: #8a3ffc,\n    70: #6929c4,\n    80: #491d8b,\n    90: #31135e,\n    100: #1c0f30,\n  ),\n  red: (\n    10: #fff1f1,\n    20: #ffd7d9,\n    30: #ffb3b8,\n    40: #ff8389,\n    50: #fa4d56,\n    60: #da1e28,\n    70: #a2191f,\n    80: #750e13,\n    90: #520408,\n    100: #2d0709,\n  ),\n  teal: (\n    10: #d9fbfb,\n    20: #9ef0f0,\n    30: #3ddbd9,\n    40: #08bdba,\n    50: #009d9a,\n    60: #007d79,\n    70: #005d5d,\n    80: #004144,\n    90: #022b30,\n    100: #081a1c,\n  ),\n  warm-gray: (\n    10: #f7f3f2,\n    20: #e5e0df,\n    30: #cac5c4,\n    40: #ada8a8,\n    50: #8f8b8b,\n    60: #726e6e,\n    70: #565151,\n    80: #3c3838,\n    90: #272525,\n    100: #171414,\n  ),\n  white: (\n    0: #ffffff,\n  ),\n  yellow: (\n    10: #fcf4d6,\n    20: #fddc69,\n    30: #f1c21b,\n    40: #d2a106,\n    50: #b28600,\n    60: #8e6a00,\n    70: #684e00,\n    80: #483700,\n    90: #302400,\n    100: #1c1500,\n  ),\n) !default;\n"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"visitType": "-esm-patient-chart__visit-detail-overview__visitType___rDxbw",
	"date": "-esm-patient-chart__visit-detail-overview__date___h1FsY",
	"dateLabel": "-esm-patient-chart__visit-detail-overview__dateLabel___I-EX6",
	"displayFlex": "-esm-patient-chart__visit-detail-overview__displayFlex___q2IKc",
	"container": "-esm-patient-chart__visit-detail-overview__container___qbR5p",
	"tabs": "-esm-patient-chart__visit-detail-overview__tabs___KCHuP",
	"tabList": "-esm-patient-chart__visit-detail-overview__tabList___hCqhE",
	"tab": "-esm-patient-chart__visit-detail-overview__tab___-hJhQ",
	"header": "-esm-patient-chart__visit-detail-overview__header___Yfe26",
	"visitInfo": "-esm-patient-chart__visit-detail-overview__visitInfo___3Z73L",
	"toggleButtons": "-esm-patient-chart__visit-detail-overview__toggleButtons___uSrvx",
	"toggle": "-esm-patient-chart__visit-detail-overview__toggle___qy4aV",
	"emptyStateContainer": "-esm-patient-chart__visit-detail-overview__emptyStateContainer___yGFkx",
	"observation": "-esm-patient-chart__visit-detail-overview__observation___mlrYy",
	"flexSections": "-esm-patient-chart__visit-detail-overview__flexSections___H0-Ka",
	"desktopTabs": "-esm-patient-chart__visit-detail-overview__desktopTabs___sSz2b",
	"tabletTabs": "-esm-patient-chart__visit-detail-overview__tabletTabs___1CBU1",
	"tabContent": "-esm-patient-chart__visit-detail-overview__tabContent___U+Keh",
	"medicationRecord": "-esm-patient-chart__visit-detail-overview__medicationRecord___jmCmM",
	"bodyLong01": "-esm-patient-chart__visit-detail-overview__bodyLong01___10nWJ",
	"medicationContainer": "-esm-patient-chart__visit-detail-overview__medicationContainer___uYgEc",
	"dosage": "-esm-patient-chart__visit-detail-overview__dosage___pPx-M",
	"toggleSwitch": "-esm-patient-chart__visit-detail-overview__toggleSwitch___6YWsL",
	"noteText": "-esm-patient-chart__visit-detail-overview__noteText___xdpyx",
	"metadata": "-esm-patient-chart__visit-detail-overview__metadata___RC3aG",
	"observationsEmptyState": "-esm-patient-chart__visit-detail-overview__observationsEmptyState___FM5jT",
	"loader": "-esm-patient-chart__visit-detail-overview__loader___FOXiP",
	"notesContainer": "-esm-patient-chart__visit-detail-overview__notesContainer___buWxq",
	"visitDetailOverviewActions": "-esm-patient-chart__visit-detail-overview__visitDetailOverviewActions___KHMl4",
	"loadMoreButton": "-esm-patient-chart__visit-detail-overview__loadMoreButton___V2Lsd",
	"label01": "-esm-patient-chart__visit-detail-overview__label01___6d9y6",
	"text02": "-esm-patient-chart__visit-detail-overview__text02___-pI5V"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js":
/*!******************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js ***!
  \******************************************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js":
/*!*************************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js ***!
  \*************************************************************************************************/
/***/ ((module) => {

"use strict";


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./src/actions-buttons/action-button.scss":
/*!************************************************!*\
  !*** ./src/actions-buttons/action-button.scss ***!
  \************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_action_button_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./action-button.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/actions-buttons/action-button.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_action_button_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);


if (true) {
  if (!_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_action_button_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals || module.hot.invalidate) {
    var isEqualLocals = function isEqualLocals(a, b, isNamedExport) {
  if (!a && b || a && !b) {
    return false;
  }
  var p;
  for (p in a) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (a[p] !== b[p]) {
      return false;
    }
  }
  for (p in b) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (!a[p]) {
      return false;
    }
  }
  return true;
};
    var isNamedExport = !_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_action_button_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;
    var oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_action_button_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_action_button_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

    module.hot.accept(
      /*! !!../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./action-button.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/actions-buttons/action-button.scss",
      __WEBPACK_OUTDATED_DEPENDENCIES__ => { /* harmony import */ _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_action_button_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./action-button.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/actions-buttons/action-button.scss");
(function () {
        if (!isEqualLocals(oldLocals, isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_action_button_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_action_button_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals, isNamedExport)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_action_button_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_action_button_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

              update(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_action_button_scss__WEBPACK_IMPORTED_MODULE_6__["default"]);
      })(__WEBPACK_OUTDATED_DEPENDENCIES__); }
    )
  }

  module.hot.dispose(function() {
    update();
  });
}



       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_action_button_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_action_button_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_action_button_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/loader/loader.scss":
/*!********************************!*\
  !*** ./src/loader/loader.scss ***!
  \********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_loader_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./loader.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/loader/loader.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_loader_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);


if (true) {
  if (!_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_loader_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals || module.hot.invalidate) {
    var isEqualLocals = function isEqualLocals(a, b, isNamedExport) {
  if (!a && b || a && !b) {
    return false;
  }
  var p;
  for (p in a) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (a[p] !== b[p]) {
      return false;
    }
  }
  for (p in b) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (!a[p]) {
      return false;
    }
  }
  return true;
};
    var isNamedExport = !_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_loader_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;
    var oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_loader_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_loader_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

    module.hot.accept(
      /*! !!../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./loader.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/loader/loader.scss",
      __WEBPACK_OUTDATED_DEPENDENCIES__ => { /* harmony import */ _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_loader_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./loader.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/loader/loader.scss");
(function () {
        if (!isEqualLocals(oldLocals, isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_loader_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_loader_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals, isNamedExport)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_loader_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_loader_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

              update(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_loader_scss__WEBPACK_IMPORTED_MODULE_6__["default"]);
      })(__WEBPACK_OUTDATED_DEPENDENCIES__); }
    )
  }

  module.hot.dispose(function() {
    update();
  });
}



       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_loader_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_loader_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_loader_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/patient-chart/chart-review/dashboard-view.scss":
/*!************************************************************!*\
  !*** ./src/patient-chart/chart-review/dashboard-view.scss ***!
  \************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_dashboard_view_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./dashboard-view.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/patient-chart/chart-review/dashboard-view.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_dashboard_view_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);


if (true) {
  if (!_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_dashboard_view_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals || module.hot.invalidate) {
    var isEqualLocals = function isEqualLocals(a, b, isNamedExport) {
  if (!a && b || a && !b) {
    return false;
  }
  var p;
  for (p in a) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (a[p] !== b[p]) {
      return false;
    }
  }
  for (p in b) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (!a[p]) {
      return false;
    }
  }
  return true;
};
    var isNamedExport = !_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_dashboard_view_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;
    var oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_dashboard_view_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_dashboard_view_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

    module.hot.accept(
      /*! !!../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./dashboard-view.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/patient-chart/chart-review/dashboard-view.scss",
      __WEBPACK_OUTDATED_DEPENDENCIES__ => { /* harmony import */ _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_dashboard_view_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./dashboard-view.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/patient-chart/chart-review/dashboard-view.scss");
(function () {
        if (!isEqualLocals(oldLocals, isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_dashboard_view_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_dashboard_view_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals, isNamedExport)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_dashboard_view_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_dashboard_view_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

              update(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_dashboard_view_scss__WEBPACK_IMPORTED_MODULE_6__["default"]);
      })(__WEBPACK_OUTDATED_DEPENDENCIES__); }
    )
  }

  module.hot.dispose(function() {
    update();
  });
}



       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_dashboard_view_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_dashboard_view_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_dashboard_view_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/patient-chart/patient-chart.scss":
/*!**********************************************!*\
  !*** ./src/patient-chart/patient-chart.scss ***!
  \**********************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_chart_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./patient-chart.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/patient-chart/patient-chart.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_chart_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);


if (true) {
  if (!_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_chart_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals || module.hot.invalidate) {
    var isEqualLocals = function isEqualLocals(a, b, isNamedExport) {
  if (!a && b || a && !b) {
    return false;
  }
  var p;
  for (p in a) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (a[p] !== b[p]) {
      return false;
    }
  }
  for (p in b) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (!a[p]) {
      return false;
    }
  }
  return true;
};
    var isNamedExport = !_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_chart_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;
    var oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_chart_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_chart_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

    module.hot.accept(
      /*! !!../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./patient-chart.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/patient-chart/patient-chart.scss",
      __WEBPACK_OUTDATED_DEPENDENCIES__ => { /* harmony import */ _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_chart_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./patient-chart.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/patient-chart/patient-chart.scss");
(function () {
        if (!isEqualLocals(oldLocals, isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_chart_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_chart_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals, isNamedExport)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_chart_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_chart_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

              update(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_chart_scss__WEBPACK_IMPORTED_MODULE_6__["default"]);
      })(__WEBPACK_OUTDATED_DEPENDENCIES__); }
    )
  }

  module.hot.dispose(function() {
    update();
  });
}



       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_chart_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_chart_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_chart_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/patient-details-tile/patient-details-tile.scss":
/*!************************************************************!*\
  !*** ./src/patient-details-tile/patient-details-tile.scss ***!
  \************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_details_tile_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./patient-details-tile.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/patient-details-tile/patient-details-tile.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_details_tile_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);


if (true) {
  if (!_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_details_tile_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals || module.hot.invalidate) {
    var isEqualLocals = function isEqualLocals(a, b, isNamedExport) {
  if (!a && b || a && !b) {
    return false;
  }
  var p;
  for (p in a) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (a[p] !== b[p]) {
      return false;
    }
  }
  for (p in b) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (!a[p]) {
      return false;
    }
  }
  return true;
};
    var isNamedExport = !_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_details_tile_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;
    var oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_details_tile_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_details_tile_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

    module.hot.accept(
      /*! !!../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./patient-details-tile.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/patient-details-tile/patient-details-tile.scss",
      __WEBPACK_OUTDATED_DEPENDENCIES__ => { /* harmony import */ _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_details_tile_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./patient-details-tile.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/patient-details-tile/patient-details-tile.scss");
(function () {
        if (!isEqualLocals(oldLocals, isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_details_tile_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_details_tile_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals, isNamedExport)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_details_tile_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_details_tile_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

              update(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_details_tile_scss__WEBPACK_IMPORTED_MODULE_6__["default"]);
      })(__WEBPACK_OUTDATED_DEPENDENCIES__); }
    )
  }

  module.hot.dispose(function() {
    update();
  });
}



       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_details_tile_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_details_tile_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_patient_details_tile_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/root.scss":
/*!***********************!*\
  !*** ./src/root.scss ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_root_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./root.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/root.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_root_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);


if (true) {
  if (!_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_root_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals || module.hot.invalidate) {
    var isEqualLocals = function isEqualLocals(a, b, isNamedExport) {
  if (!a && b || a && !b) {
    return false;
  }
  var p;
  for (p in a) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (a[p] !== b[p]) {
      return false;
    }
  }
  for (p in b) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (!a[p]) {
      return false;
    }
  }
  return true;
};
    var isNamedExport = !_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_root_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;
    var oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_root_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_root_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

    module.hot.accept(
      /*! !!../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./root.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/root.scss",
      __WEBPACK_OUTDATED_DEPENDENCIES__ => { /* harmony import */ _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_root_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./root.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/root.scss");
(function () {
        if (!isEqualLocals(oldLocals, isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_root_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_root_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals, isNamedExport)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_root_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_root_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

              update(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_root_scss__WEBPACK_IMPORTED_MODULE_6__["default"]);
      })(__WEBPACK_OUTDATED_DEPENDENCIES__); }
    )
  }

  module.hot.dispose(function() {
    update();
  });
}



       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_root_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_root_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_root_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/visit/visit-history-table/visit-actions-cell.scss":
/*!***************************************************************!*\
  !*** ./src/visit/visit-history-table/visit-actions-cell.scss ***!
  \***************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_actions_cell_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./visit-actions-cell.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visit-history-table/visit-actions-cell.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_actions_cell_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);


if (true) {
  if (!_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_actions_cell_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals || module.hot.invalidate) {
    var isEqualLocals = function isEqualLocals(a, b, isNamedExport) {
  if (!a && b || a && !b) {
    return false;
  }
  var p;
  for (p in a) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (a[p] !== b[p]) {
      return false;
    }
  }
  for (p in b) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (!a[p]) {
      return false;
    }
  }
  return true;
};
    var isNamedExport = !_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_actions_cell_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;
    var oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_actions_cell_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_actions_cell_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

    module.hot.accept(
      /*! !!../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./visit-actions-cell.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visit-history-table/visit-actions-cell.scss",
      __WEBPACK_OUTDATED_DEPENDENCIES__ => { /* harmony import */ _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_actions_cell_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./visit-actions-cell.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visit-history-table/visit-actions-cell.scss");
(function () {
        if (!isEqualLocals(oldLocals, isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_actions_cell_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_actions_cell_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals, isNamedExport)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_actions_cell_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_actions_cell_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

              update(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_actions_cell_scss__WEBPACK_IMPORTED_MODULE_6__["default"]);
      })(__WEBPACK_OUTDATED_DEPENDENCIES__); }
    )
  }

  module.hot.dispose(function() {
    update();
  });
}



       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_actions_cell_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_actions_cell_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_actions_cell_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/visit/visit-history-table/visit-history-table.scss":
/*!****************************************************************!*\
  !*** ./src/visit/visit-history-table/visit-history-table.scss ***!
  \****************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_history_table_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./visit-history-table.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visit-history-table/visit-history-table.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_history_table_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);


if (true) {
  if (!_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_history_table_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals || module.hot.invalidate) {
    var isEqualLocals = function isEqualLocals(a, b, isNamedExport) {
  if (!a && b || a && !b) {
    return false;
  }
  var p;
  for (p in a) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (a[p] !== b[p]) {
      return false;
    }
  }
  for (p in b) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (!a[p]) {
      return false;
    }
  }
  return true;
};
    var isNamedExport = !_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_history_table_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;
    var oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_history_table_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_history_table_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

    module.hot.accept(
      /*! !!../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./visit-history-table.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visit-history-table/visit-history-table.scss",
      __WEBPACK_OUTDATED_DEPENDENCIES__ => { /* harmony import */ _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_history_table_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./visit-history-table.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visit-history-table/visit-history-table.scss");
(function () {
        if (!isEqualLocals(oldLocals, isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_history_table_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_history_table_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals, isNamedExport)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_history_table_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_history_table_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

              update(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_history_table_scss__WEBPACK_IMPORTED_MODULE_6__["default"]);
      })(__WEBPACK_OUTDATED_DEPENDENCIES__); }
    )
  }

  module.hot.dispose(function() {
    update();
  });
}



       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_history_table_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_history_table_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_history_table_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/visit/visits-widget/encounter-observations/styles.scss":
/*!********************************************************************!*\
  !*** ./src/visit/visits-widget/encounter-observations/styles.scss ***!
  \********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_styles_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./styles.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/encounter-observations/styles.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);


if (true) {
  if (!_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals || module.hot.invalidate) {
    var isEqualLocals = function isEqualLocals(a, b, isNamedExport) {
  if (!a && b || a && !b) {
    return false;
  }
  var p;
  for (p in a) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (a[p] !== b[p]) {
      return false;
    }
  }
  for (p in b) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (!a[p]) {
      return false;
    }
  }
  return true;
};
    var isNamedExport = !_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;
    var oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_styles_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

    module.hot.accept(
      /*! !!../../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./styles.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/encounter-observations/styles.scss",
      __WEBPACK_OUTDATED_DEPENDENCIES__ => { /* harmony import */ _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_styles_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./styles.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/encounter-observations/styles.scss");
(function () {
        if (!isEqualLocals(oldLocals, isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_styles_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals, isNamedExport)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_styles_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

              update(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"]);
      })(__WEBPACK_OUTDATED_DEPENDENCIES__); }
    )
  }

  module.hot.dispose(function() {
    update();
  });
}



       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/visit/visits-widget/past-visits-components/encounters-table/encounters-table.scss":
/*!***********************************************************************************************!*\
  !*** ./src/visit/visits-widget/past-visits-components/encounters-table/encounters-table.scss ***!
  \***********************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_encounters_table_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./encounters-table.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/past-visits-components/encounters-table/encounters-table.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_encounters_table_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);


if (true) {
  if (!_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_encounters_table_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals || module.hot.invalidate) {
    var isEqualLocals = function isEqualLocals(a, b, isNamedExport) {
  if (!a && b || a && !b) {
    return false;
  }
  var p;
  for (p in a) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (a[p] !== b[p]) {
      return false;
    }
  }
  for (p in b) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (!a[p]) {
      return false;
    }
  }
  return true;
};
    var isNamedExport = !_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_encounters_table_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;
    var oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_encounters_table_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_encounters_table_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

    module.hot.accept(
      /*! !!../../../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./encounters-table.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/past-visits-components/encounters-table/encounters-table.scss",
      __WEBPACK_OUTDATED_DEPENDENCIES__ => { /* harmony import */ _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_encounters_table_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./encounters-table.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/past-visits-components/encounters-table/encounters-table.scss");
(function () {
        if (!isEqualLocals(oldLocals, isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_encounters_table_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_encounters_table_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals, isNamedExport)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_encounters_table_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_encounters_table_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

              update(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_encounters_table_scss__WEBPACK_IMPORTED_MODULE_6__["default"]);
      })(__WEBPACK_OUTDATED_DEPENDENCIES__); }
    )
  }

  module.hot.dispose(function() {
    update();
  });
}



       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_encounters_table_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_encounters_table_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_encounters_table_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/visit/visits-widget/past-visits-components/visit-summary.scss":
/*!***************************************************************************!*\
  !*** ./src/visit/visits-widget/past-visits-components/visit-summary.scss ***!
  \***************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_summary_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./visit-summary.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/past-visits-components/visit-summary.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_summary_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);


if (true) {
  if (!_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_summary_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals || module.hot.invalidate) {
    var isEqualLocals = function isEqualLocals(a, b, isNamedExport) {
  if (!a && b || a && !b) {
    return false;
  }
  var p;
  for (p in a) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (a[p] !== b[p]) {
      return false;
    }
  }
  for (p in b) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (!a[p]) {
      return false;
    }
  }
  return true;
};
    var isNamedExport = !_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_summary_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;
    var oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_summary_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_summary_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

    module.hot.accept(
      /*! !!../../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./visit-summary.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/past-visits-components/visit-summary.scss",
      __WEBPACK_OUTDATED_DEPENDENCIES__ => { /* harmony import */ _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_summary_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./visit-summary.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/past-visits-components/visit-summary.scss");
(function () {
        if (!isEqualLocals(oldLocals, isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_summary_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_summary_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals, isNamedExport)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_summary_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_summary_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

              update(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_summary_scss__WEBPACK_IMPORTED_MODULE_6__["default"]);
      })(__WEBPACK_OUTDATED_DEPENDENCIES__); }
    )
  }

  module.hot.dispose(function() {
    update();
  });
}



       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_summary_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_summary_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_summary_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/visit/visits-widget/visit-detail-overview.scss":
/*!************************************************************!*\
  !*** ./src/visit/visits-widget/visit-detail-overview.scss ***!
  \************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./visit-detail-overview.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/visit-detail-overview.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);


if (true) {
  if (!_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals || module.hot.invalidate) {
    var isEqualLocals = function isEqualLocals(a, b, isNamedExport) {
  if (!a && b || a && !b) {
    return false;
  }
  var p;
  for (p in a) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (a[p] !== b[p]) {
      return false;
    }
  }
  for (p in b) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (!a[p]) {
      return false;
    }
  }
  return true;
};
    var isNamedExport = !_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;
    var oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

    module.hot.accept(
      /*! !!../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./visit-detail-overview.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/visit-detail-overview.scss",
      __WEBPACK_OUTDATED_DEPENDENCIES__ => { /* harmony import */ _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./visit-detail-overview.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/visit-detail-overview.scss");
(function () {
        if (!isEqualLocals(oldLocals, isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals, isNamedExport)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

              update(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_6__["default"]);
      })(__WEBPACK_OUTDATED_DEPENDENCIES__); }
    )
  }

  module.hot.dispose(function() {
    update();
  });
}



       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!*****************************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \*****************************************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!*********************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \*********************************************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!***********************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \***********************************************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!***********************************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \***********************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!****************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \****************************************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!**********************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \**********************************************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/actions-buttons/delete-visit.component.tsx":
/*!********************************************************!*\
  !*** ./src/actions-buttons/delete-visit.component.tsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @carbon/react */ "webpack/sharing/consume/default/@carbon/react/@carbon/react");
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_carbon_react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _action_button_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./action-button.scss */ "./src/actions-buttons/action-button.scss");





var DeleteVisitOverflowMenuItem = function(param) {
    var patientUuid = param.patientUuid;
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)().t;
    var activeVisit = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.useVisit)(patientUuid).activeVisit;
    var handleLaunchModal = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function() {
        var dispose = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.showModal)('delete-visit-dialog', {
            closeModal: function() {
                return dispose();
            },
            patientUuid: patientUuid,
            visit: activeVisit
        });
    }, [
        patientUuid,
        activeVisit
    ]);
    return activeVisit && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.OverflowMenuItem, {
        className: _action_button_scss__WEBPACK_IMPORTED_MODULE_4__["default"].menuitem,
        itemText: t('deleteActiveVisit', 'Delete active visit'),
        onClick: handleLaunchModal,
        isDelete: true
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DeleteVisitOverflowMenuItem);


/***/ }),

/***/ "./src/actions-buttons/mark-patient-alive.component.tsx":
/*!**************************************************************!*\
  !*** ./src/actions-buttons/mark-patient-alive.component.tsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @carbon/react */ "webpack/sharing/consume/default/@carbon/react/@carbon/react");
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_carbon_react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _action_button_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./action-button.scss */ "./src/actions-buttons/action-button.scss");





var MarkPatientAliveOverflowMenuItem = function(param) {
    var patientUuid = param.patientUuid, patient = param.patient;
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)().t;
    var _patient_deceasedBoolean;
    var isDead = (_patient_deceasedBoolean = patient.deceasedBoolean) !== null && _patient_deceasedBoolean !== void 0 ? _patient_deceasedBoolean : Boolean(patient.deceasedDateTime);
    var handleLaunchModal = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function() {
        var dispose = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.showModal)('mark-patient-alive-modal', {
            closeModal: function() {
                return dispose();
            },
            patientUuid: patientUuid,
            patient: patient
        });
    }, [
        patientUuid,
        patient
    ]);
    return patient && isDead && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.OverflowMenuItem, {
        className: _action_button_scss__WEBPACK_IMPORTED_MODULE_4__["default"].menuitem,
        itemText: t('markPatientAlive', 'Mark patient alive'),
        onClick: handleLaunchModal
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MarkPatientAliveOverflowMenuItem);


/***/ }),

/***/ "./src/actions-buttons/mark-patient-deceased.component.tsx":
/*!*****************************************************************!*\
  !*** ./src/actions-buttons/mark-patient-deceased.component.tsx ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @carbon/react */ "webpack/sharing/consume/default/@carbon/react/@carbon/react");
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_carbon_react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _action_button_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./action-button.scss */ "./src/actions-buttons/action-button.scss");





var MarkPatientDeceasedOverflowMenuItem = function(param) {
    var patient = param.patient;
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)().t;
    var _patient_deceasedBoolean;
    var isDead = (_patient_deceasedBoolean = patient.deceasedBoolean) !== null && _patient_deceasedBoolean !== void 0 ? _patient_deceasedBoolean : Boolean(patient.deceasedDateTime);
    var handleLaunchModal = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function() {
        return (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.launchWorkspace)('mark-patient-deceased-workspace-form');
    }, []);
    return patient && !isDead && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.OverflowMenuItem, {
        className: _action_button_scss__WEBPACK_IMPORTED_MODULE_4__["default"].menuitem,
        itemText: t('markPatientDeceased', 'Mark patient deceased'),
        onClick: handleLaunchModal
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MarkPatientDeceasedOverflowMenuItem);


/***/ }),

/***/ "./src/actions-buttons/start-visit.component.tsx":
/*!*******************************************************!*\
  !*** ./src/actions-buttons/start-visit.component.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @carbon/react */ "webpack/sharing/consume/default/@carbon/react/@carbon/react");
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_carbon_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @openmrs/esm-patient-common-lib */ "webpack/sharing/consume/default/@openmrs/esm-patient-common-lib/@openmrs/esm-patient-common-lib");
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _action_button_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./action-button.scss */ "./src/actions-buttons/action-button.scss");





var StartVisitOverflowMenuItem = function(param) {
    var patient = param.patient;
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)().t;
    var isDeceased = Boolean(patient === null || patient === void 0 ? void 0 : patient.deceasedDateTime);
    var handleLaunchModal = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(function() {
        return (0,_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_1__.launchPatientWorkspace)('start-visit-workspace-form', {
            openedFrom: 'patient-chart-start-visit'
        });
    }, []);
    return !isDeceased && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_0__.OverflowMenuItem, {
        className: _action_button_scss__WEBPACK_IMPORTED_MODULE_4__["default"].menuitem,
        itemText: t('addVisit', 'Add visit'),
        onClick: handleLaunchModal
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StartVisitOverflowMenuItem);


/***/ }),

/***/ "./src/actions-buttons/stop-visit.component.tsx":
/*!******************************************************!*\
  !*** ./src/actions-buttons/stop-visit.component.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @carbon/react */ "webpack/sharing/consume/default/@carbon/react/@carbon/react");
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_carbon_react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _action_button_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./action-button.scss */ "./src/actions-buttons/action-button.scss");





/**
 * This button shows up in the patient banner action menu, but only when the patient has an active visit.
 * On click, it opens the modal in end-visit-dialog.component.tsx
 */ var StopVisitOverflowMenuItem = function(param) {
    var patientUuid = param.patientUuid;
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)().t;
    var activeVisit = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.useVisit)(patientUuid).activeVisit;
    var handleLaunchModal = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function() {
        var dispose = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.showModal)('end-visit-dialog', {
            closeModal: function() {
                return dispose();
            },
            patientUuid: patientUuid
        });
    }, [
        patientUuid
    ]);
    return activeVisit && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_3__.OverflowMenuItem, {
        className: _action_button_scss__WEBPACK_IMPORTED_MODULE_4__["default"].menuitem,
        itemText: "".concat(t('endActiveVisit', 'End active visit')),
        onClick: handleLaunchModal
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StopVisitOverflowMenuItem);


/***/ }),

/***/ "./src/config-schema.ts":
/*!******************************!*\
  !*** ./src/config-schema.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   esmPatientChartSchema: () => (/* binding */ esmPatientChartSchema)
/* harmony export */ });
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__);

var esmPatientChartSchema = {
    defaultFacilityUrl: {
        _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.String,
        _default: '',
        _description: 'Custom URL to load default facility if it is not in the session'
    },
    disableChangingVisitLocation: {
        _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.Boolean,
        _description: 'Whether the visit location field in the Start Visit form should be view-only.',
        _default: false
    },
    disableEmptyTabs: {
        _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.Boolean,
        _default: false,
        _description: 'Disable notes/tests/medications/encounters tabs when empty'
    },
    freeTextFieldConceptUuid: {
        _default: '5622AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.ConceptUuid
    },
    logo: {
        alt: {
            _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.String,
            _default: 'Logo',
            _description: 'Alt text, shown on hover'
        },
        name: {
            _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.String,
            _default: null,
            _description: 'The organization name displayed when image is absent'
        },
        src: {
            _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.String,
            _default: null,
            _description: 'A path or URL to an image. Defaults to the OpenMRS SVG sprite.'
        }
    },
    notesConceptUuids: {
        _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.Array,
        _default: [
            '162169AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
        ]
    },
    obsConceptUuidsToHide: {
        _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.Array,
        _elements: {
            _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.ConceptUuid
        },
        _description: 'An array of concept UUIDs. If an observation has a concept UUID that matches any of the ones in this array, it will be hidden from the observations list in the Encounters summary table.',
        _default: []
    },
    offlineVisitTypeUuid: {
        _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.UUID,
        _description: 'The UUID of the visit type to be used for the automatically created offline visits.',
        _default: 'a22733fa-3501-4020-a520-da024eeff088'
    },
    restrictByVisitLocationTag: {
        _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.Boolean,
        _description: 'On the start visit form, whether to restrict the visit location to locations with the Visit Location tag',
        _default: false
    },
    showAllEncountersTab: {
        _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.Boolean,
        _description: 'Shows the All Encounters Tab of Patient Visits section in Patient Chart',
        _default: true
    },
    showExtraVisitAttributesSlot: {
        _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.Boolean,
        _description: 'Whether on start visit form should handle submission of the extra visit attributes from the extra visit attributes slot',
        _default: false
    },
    showRecommendedVisitTypeTab: {
        _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.Boolean,
        _description: 'Whether start visit form should display recommended visit type tab. Requires `visitTypeResourceUrl`',
        _default: false
    },
    showServiceQueueFields: {
        _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.Boolean,
        _description: 'Whether start visit form should display service queue fields`',
        _default: false
    },
    showUpcomingAppointments: {
        _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.Boolean,
        _description: 'Whether start visit form should display upcoming appointments',
        _default: false
    },
    visitAttributeTypes: {
        _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.Array,
        _description: 'List of visit attribute types shown when filling the visit form',
        _elements: {
            uuid: {
                _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.UUID,
                _description: 'UUID of the visit attribute type'
            },
            required: {
                _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.Boolean,
                _description: 'Whether the attribute type field is required or not',
                _default: false
            },
            displayInThePatientBanner: {
                _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.Boolean,
                _description: "Whether we should show this visit attribute's value in the patient banner",
                _default: true
            }
        },
        _default: [
            {
                uuid: '57ea0cbb-064f-4d09-8cf4-e8228700491c',
                required: false,
                displayInThePatientBanner: true
            },
            {
                uuid: 'aac48226-d143-4274-80e0-264db4e368ee',
                required: false,
                displayInThePatientBanner: true
            }
        ]
    },
    visitDiagnosisConceptUuid: {
        _default: '159947AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.ConceptUuid
    },
    visitTypeResourceUrl: {
        _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.String,
        _default: '/etl-latest/etl/patient/',
        _description: 'Custom URL to load resources required for showing recommended visit types'
    },
    trueConceptUuid: {
        _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.String,
        _description: 'Default concept uuid for true in forms',
        _default: '1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    },
    falseConceptUuid: {
        _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.String,
        _description: 'Default concept uuid for false in forms',
        _default: '1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    },
    otherConceptUuid: {
        _type: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.Type.String,
        _description: 'Default concept uuid for other in forms',
        _default: '5622AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    }
};


/***/ }),

/***/ "./src/constants.ts":
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   basePath: () => (/* binding */ basePath),
/* harmony export */   clinicalFormsWorkspace: () => (/* binding */ clinicalFormsWorkspace),
/* harmony export */   dashboardPath: () => (/* binding */ dashboardPath),
/* harmony export */   formEntryWorkspace: () => (/* binding */ formEntryWorkspace),
/* harmony export */   moduleName: () => (/* binding */ moduleName),
/* harmony export */   omrsDateFormat: () => (/* binding */ omrsDateFormat),
/* harmony export */   patientChartWorkspaceHeaderSlot: () => (/* binding */ patientChartWorkspaceHeaderSlot),
/* harmony export */   patientChartWorkspaceSlot: () => (/* binding */ patientChartWorkspaceSlot),
/* harmony export */   spaBasePath: () => (/* binding */ spaBasePath),
/* harmony export */   spaRoot: () => (/* binding */ spaRoot)
/* harmony export */ });
var clinicalFormsWorkspace = 'clinical-forms-workspace';
var formEntryWorkspace = 'patient-form-entry-workspace';
var spaRoot = window['getOpenmrsSpaBase']();
var basePath = '/patient/:patientUuid/chart';
var dashboardPath = "".concat(basePath, "/:view/*");
var spaBasePath = "".concat(window.spaBase).concat(basePath);
var moduleName = '@openmrs/esm-patient-chart-app';
var patientChartWorkspaceSlot = 'patient-chart-workspace-slot';
var patientChartWorkspaceHeaderSlot = 'patient-chart-workspace-header-slot';
var omrsDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';


/***/ }),

/***/ "./src/dashboard.meta.ts":
/*!*******************************!*\
  !*** ./src/dashboard.meta.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   encountersDashboardMeta: () => (/* binding */ encountersDashboardMeta),
/* harmony export */   summaryDashboardMeta: () => (/* binding */ summaryDashboardMeta)
/* harmony export */ });
var summaryDashboardMeta = {
    slot: 'patient-chart-summary-dashboard-slot',
    path: 'Patient Summary',
    title: 'Patient Summary',
    icon: 'omrs-icon-report'
};
var encountersDashboardMeta = {
    slot: 'patient-chart-encounters-dashboard-slot',
    path: 'Visits',
    title: 'Visits',
    icon: 'omrs-icon-calendar-heat-map'
};


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   activeVisitActionsComponent: () => (/* binding */ activeVisitActionsComponent),
/* harmony export */   clinicalViewsSummary: () => (/* binding */ clinicalViewsSummary),
/* harmony export */   currentVisitSummary: () => (/* binding */ currentVisitSummary),
/* harmony export */   deleteEncounterModal: () => (/* binding */ deleteEncounterModal),
/* harmony export */   deleteVisitActionButton: () => (/* binding */ deleteVisitActionButton),
/* harmony export */   deleteVisitActionMenuButton: () => (/* binding */ deleteVisitActionMenuButton),
/* harmony export */   deleteVisitModal: () => (/* binding */ deleteVisitModal),
/* harmony export */   editVisitDetailsActionButton: () => (/* binding */ editVisitDetailsActionButton),
/* harmony export */   encounterListTableTabs: () => (/* binding */ encounterListTableTabs),
/* harmony export */   encountersSummaryDashboardLink: () => (/* binding */ encountersSummaryDashboardLink),
/* harmony export */   endVisitModal: () => (/* binding */ endVisitModal),
/* harmony export */   importTranslation: () => (/* binding */ importTranslation),
/* harmony export */   markPatientAliveActionButton: () => (/* binding */ markPatientAliveActionButton),
/* harmony export */   markPatientAliveModal: () => (/* binding */ markPatientAliveModal),
/* harmony export */   markPatientDeceasedActionButton: () => (/* binding */ markPatientDeceasedActionButton),
/* harmony export */   markPatientDeceasedForm: () => (/* binding */ markPatientDeceasedForm),
/* harmony export */   modifyVisitDateModal: () => (/* binding */ modifyVisitDateModal),
/* harmony export */   pastVisitsDetailOverview: () => (/* binding */ pastVisitsDetailOverview),
/* harmony export */   patientDetailsTile: () => (/* binding */ patientDetailsTile),
/* harmony export */   patientSummaryDashboardLink: () => (/* binding */ patientSummaryDashboardLink),
/* harmony export */   retrospectiveDateTimePicker: () => (/* binding */ retrospectiveDateTimePicker),
/* harmony export */   root: () => (/* binding */ root),
/* harmony export */   startVisitActionButton: () => (/* binding */ startVisitActionButton),
/* harmony export */   startVisitModal: () => (/* binding */ startVisitModal),
/* harmony export */   startVisitPatientSearchActionButton: () => (/* binding */ startVisitPatientSearchActionButton),
/* harmony export */   startVisitWorkspace: () => (/* binding */ startVisitWorkspace),
/* harmony export */   startupApp: () => (/* binding */ startupApp),
/* harmony export */   stopVisitActionButton: () => (/* binding */ stopVisitActionButton),
/* harmony export */   stopVisitPatientSearchActionButton: () => (/* binding */ stopVisitPatientSearchActionButton),
/* harmony export */   visitAttributeTags: () => (/* binding */ visitAttributeTags),
/* harmony export */   visitContextHeader: () => (/* binding */ visitContextHeader),
/* harmony export */   visitContextSwitcherModal: () => (/* binding */ visitContextSwitcherModal)
/* harmony export */ });
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @openmrs/esm-patient-common-lib */ "webpack/sharing/consume/default/@openmrs/esm-patient-common-lib/@openmrs/esm-patient-common-lib");
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _config_schema__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config-schema */ "./src/config-schema.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ "./src/constants.ts");
/* harmony import */ var _offline__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./offline */ "./src/offline.ts");
/* harmony import */ var _dashboard_meta__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dashboard.meta */ "./src/dashboard.meta.ts");
/* harmony import */ var _actions_buttons_delete_visit_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./actions-buttons/delete-visit.component */ "./src/actions-buttons/delete-visit.component.tsx");
/* harmony import */ var _visit_visits_widget_current_visit_summary_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./visit/visits-widget/current-visit-summary.component */ "./src/visit/visits-widget/current-visit-summary.component.tsx");
/* harmony import */ var _actions_buttons_mark_patient_alive_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./actions-buttons/mark-patient-alive.component */ "./src/actions-buttons/mark-patient-alive.component.tsx");
/* harmony import */ var _actions_buttons_mark_patient_deceased_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./actions-buttons/mark-patient-deceased.component */ "./src/actions-buttons/mark-patient-deceased.component.tsx");
/* harmony import */ var _visit_visits_widget_visit_detail_overview_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./visit/visits-widget/visit-detail-overview.component */ "./src/visit/visits-widget/visit-detail-overview.component.tsx");
/* harmony import */ var _root_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./root.component */ "./src/root.component.tsx");
/* harmony import */ var _patient_details_tile_patient_details_tile_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./patient-details-tile/patient-details-tile.component */ "./src/patient-details-tile/patient-details-tile.component.tsx");
/* harmony import */ var _actions_buttons_start_visit_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./actions-buttons/start-visit.component */ "./src/actions-buttons/start-visit.component.tsx");
/* harmony import */ var _visit_start_visit_button_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./visit/start-visit-button.component */ "./src/visit/start-visit-button.component.tsx");
/* harmony import */ var _actions_buttons_stop_visit_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./actions-buttons/stop-visit.component */ "./src/actions-buttons/stop-visit.component.tsx");
/* harmony import */ var _patient_banner_tags_visit_attribute_tags_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./patient-banner-tags/visit-attribute-tags.component */ "./src/patient-banner-tags/visit-attribute-tags.component.tsx");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}


















// Expose framework for legacy modules (like ngx-formentry)
window['_openmrs_esm_framework'] = _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__;
var importTranslation = __webpack_require__("./translations lazy .json$");
function startupApp() {
    (0,_offline__WEBPACK_IMPORTED_MODULE_4__.setupOfflineVisitsSync)();
    (0,_offline__WEBPACK_IMPORTED_MODULE_4__.setupCacheableRoutes)();
    (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.defineConfigSchema)(_constants__WEBPACK_IMPORTED_MODULE_3__.moduleName, _config_schema__WEBPACK_IMPORTED_MODULE_2__.esmPatientChartSchema);
}
// ✅ Restrict ONLY for "self registration" and "include_hcw"
function useIsRestrictedUser() {
    var _user_roles;
    var user = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.useSession)().user;
    var roles = (user === null || user === void 0 ? void 0 : (_user_roles = user.roles) === null || _user_roles === void 0 ? void 0 : _user_roles.map(function(r) {
        var _r_display;
        return (_r_display = r.display) === null || _r_display === void 0 ? void 0 : _r_display.toLowerCase();
    })) || [];
    // If user has either restricted role → restrict
    return roles.includes('self registration') || roles.includes('include_hcw');
}
var root = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getSyncLifecycle)(_root_component__WEBPACK_IMPORTED_MODULE_11__["default"], {
    featureName: 'patient-chart',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var patientSummaryDashboardLink = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getSyncLifecycle)((0,_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_1__.createDashboardLink)(_object_spread_props(_object_spread({}, _dashboard_meta__WEBPACK_IMPORTED_MODULE_5__.summaryDashboardMeta), {
    moduleName: ''
})), {
    featureName: 'summary-dashboard',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var markPatientAliveActionButton = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getSyncLifecycle)(_actions_buttons_mark_patient_alive_component__WEBPACK_IMPORTED_MODULE_8__["default"], {
    featureName: 'patient-actions-slot',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var markPatientDeceasedActionButton = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getSyncLifecycle)(_actions_buttons_mark_patient_deceased_component__WEBPACK_IMPORTED_MODULE_9__["default"], {
    featureName: 'patient-actions-slot-deceased-button',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var startVisitActionButton = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getSyncLifecycle)(_actions_buttons_start_visit_component__WEBPACK_IMPORTED_MODULE_13__["default"], {
    featureName: 'patient-actions-slot',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var stopVisitActionButton = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getSyncLifecycle)(_actions_buttons_stop_visit_component__WEBPACK_IMPORTED_MODULE_15__["default"], {
    featureName: 'patient-actions-slot',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var deleteVisitActionMenuButton = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getSyncLifecycle)(_actions_buttons_delete_visit_component__WEBPACK_IMPORTED_MODULE_6__["default"], {
    featureName: 'patient-actions-slot',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var startVisitPatientSearchActionButton = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getSyncLifecycle)(_visit_start_visit_button_component__WEBPACK_IMPORTED_MODULE_14__["default"], {
    featureName: 'start-visit-button-patient-search',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var stopVisitPatientSearchActionButton = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getSyncLifecycle)(_actions_buttons_stop_visit_component__WEBPACK_IMPORTED_MODULE_15__["default"], {
    featureName: 'patient-actions-slot',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var clinicalViewsSummary = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getAsyncLifecycle)(function() {
    return Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_swr_dist_index_index_mjs"), __webpack_require__.e("webpack_sharing_consume_default_dayjs_dayjs"), __webpack_require__.e("src_clinical-views_encounter-tile_clinical-views-summary_component_tsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./clinical-views/encounter-tile/clinical-views-summary.component */ "./src/clinical-views/encounter-tile/clinical-views-summary.component.tsx"));
}, {
    featureName: 'clinical-views-summary',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
// ✅ Visits dashboard link with restriction
var encountersSummaryDashboardLink = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getSyncLifecycle)(function(props) {
    var restricted = useIsRestrictedUser();
    if (restricted) return null;
    var DashboardLink = (0,_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_1__.createDashboardLink)(_object_spread_props(_object_spread({}, _dashboard_meta__WEBPACK_IMPORTED_MODULE_5__.encountersDashboardMeta), {
        moduleName: ''
    }));
    return DashboardLink(props);
}, {
    featureName: 'encounter',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
// ✅ Current visit summary with restriction
var currentVisitSummary = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getSyncLifecycle)(function(props) {
    var restricted = useIsRestrictedUser();
    if (restricted) return null;
    return (0,_visit_visits_widget_current_visit_summary_component__WEBPACK_IMPORTED_MODULE_7__["default"])({
        patientUuid: props.patientUuid
    });
}, {
    featureName: 'current-visit-summary',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var pastVisitsDetailOverview = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getSyncLifecycle)(_visit_visits_widget_visit_detail_overview_component__WEBPACK_IMPORTED_MODULE_10__["default"], {
    featureName: 'visits-detail-slot',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var patientDetailsTile = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getSyncLifecycle)(_patient_details_tile_patient_details_tile_component__WEBPACK_IMPORTED_MODULE_12__["default"], {
    featureName: 'patient-details-tile',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var visitAttributeTags = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getSyncLifecycle)(_patient_banner_tags_visit_attribute_tags_component__WEBPACK_IMPORTED_MODULE_16__["default"], {
    featureName: 'visit-attribute-tags',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var startVisitWorkspace = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getAsyncLifecycle)(function() {
    return Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_swr_dist_index_index_mjs"), __webpack_require__.e("vendors-node_modules_react-hook-form_dist_index_esm_mjs"), __webpack_require__.e("vendors-node_modules_hookform_resolvers_zod_dist_zod_mjs-node_modules_zod_v3_types_js"), __webpack_require__.e("webpack_sharing_consume_default_lodash-es_lodash-es-webpack_sharing_consume_default_swr_immut-59a49d"), __webpack_require__.e("webpack_sharing_consume_default_dayjs_dayjs"), __webpack_require__.e("src_visit_visit-form_visit-form_workspace_tsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./visit/visit-form/visit-form.workspace */ "./src/visit/visit-form/visit-form.workspace.tsx"));
}, {
    featureName: 'start-visit-form',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var markPatientDeceasedForm = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getAsyncLifecycle)(function() {
    return Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_swr_dist_index_index_mjs"), __webpack_require__.e("vendors-node_modules_carbon_icons-react_es_Icon_js-node_modules_carbon_icons-react_es_iconPro-cf7878"), __webpack_require__.e("vendors-node_modules_carbon_icons-react_es_generated_bucket-19_js"), __webpack_require__.e("vendors-node_modules_react-hook-form_dist_index_esm_mjs"), __webpack_require__.e("vendors-node_modules_hookform_resolvers_zod_dist_zod_mjs-node_modules_zod_v3_types_js"), __webpack_require__.e("src_mark-patient-deceased_mark-patient-deceased-form_workspace_tsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./mark-patient-deceased/mark-patient-deceased-form.workspace */ "./src/mark-patient-deceased/mark-patient-deceased-form.workspace.tsx"));
}, {
    featureName: 'mark-patient-deceased-form',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var startVisitModal = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getAsyncLifecycle)(function() {
    return Promise.all(/*! import() */[__webpack_require__.e("src_visit_visit-prompt_start-visit-dialog_scss"), __webpack_require__.e("src_visit_visit-prompt_start-visit-dialog_component_tsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./visit/visit-prompt/start-visit-dialog.component */ "./src/visit/visit-prompt/start-visit-dialog.component.tsx"));
}, {
    featureName: 'start visit',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var deleteVisitModal = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getAsyncLifecycle)(function() {
    return Promise.all(/*! import() */[__webpack_require__.e("src_visit_visit-prompt_start-visit-dialog_scss"), __webpack_require__.e("src_visit_visit-prompt_delete-visit-dialog_component_tsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./visit/visit-prompt/delete-visit-dialog.component */ "./src/visit/visit-prompt/delete-visit-dialog.component.tsx"));
}, {
    featureName: 'delete visit',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var modifyVisitDateModal = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getAsyncLifecycle)(function() {
    return Promise.all(/*! import() */[__webpack_require__.e("src_visit_visit-prompt_start-visit-dialog_scss"), __webpack_require__.e("src_visit_visit-prompt_modify-visit-date_modal_tsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./visit/visit-prompt/modify-visit-date.modal */ "./src/visit/visit-prompt/modify-visit-date.modal.tsx"));
}, {
    featureName: 'modify visit date',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var endVisitModal = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getAsyncLifecycle)(function() {
    return __webpack_require__.e(/*! import() */ "src_visit_visit-prompt_end-visit-dialog_component_tsx").then(__webpack_require__.bind(__webpack_require__, /*! ./visit/visit-prompt/end-visit-dialog.component */ "./src/visit/visit-prompt/end-visit-dialog.component.tsx"));
}, {
    featureName: 'end visit',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var markPatientAliveModal = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getAsyncLifecycle)(function() {
    return Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_swr_dist_index_index_mjs"), __webpack_require__.e("src_mark-patient-alive_mark-patient-alive_modal_tsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./mark-patient-alive/mark-patient-alive.modal */ "./src/mark-patient-alive/mark-patient-alive.modal.tsx"));
}, {
    featureName: 'mark patient alive',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var deleteEncounterModal = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getAsyncLifecycle)(function() {
    return __webpack_require__.e(/*! import() */ "src_visit_visits-widget_past-visits-components_delete-encounter_modal_tsx").then(__webpack_require__.bind(__webpack_require__, /*! ./visit/visits-widget/past-visits-components/delete-encounter.modal */ "./src/visit/visits-widget/past-visits-components/delete-encounter.modal.tsx"));
}, {
    featureName: 'delete-encounter-modal',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var editVisitDetailsActionButton = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getAsyncLifecycle)(function() {
    return __webpack_require__.e(/*! import() */ "src_visit_visit-action-items_edit-visit-details_component_tsx").then(__webpack_require__.bind(__webpack_require__, /*! ./visit/visit-action-items/edit-visit-details.component */ "./src/visit/visit-action-items/edit-visit-details.component.tsx"));
}, {
    featureName: 'edit-visit-details',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var deleteVisitActionButton = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getAsyncLifecycle)(function() {
    return __webpack_require__.e(/*! import() */ "src_visit_visit-action-items_delete-visit-action-item_component_tsx").then(__webpack_require__.bind(__webpack_require__, /*! ./visit/visit-action-items/delete-visit-action-item.component */ "./src/visit/visit-action-items/delete-visit-action-item.component.tsx"));
}, {
    featureName: 'delete-visit',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var activeVisitActionsComponent = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getAsyncLifecycle)(function() {
    return __webpack_require__.e(/*! import() */ "src_visit_visits-widget_active-visit-buttons_active-visit-buttons_tsx").then(__webpack_require__.bind(__webpack_require__, /*! ./visit/visits-widget/active-visit-buttons/active-visit-buttons */ "./src/visit/visits-widget/active-visit-buttons/active-visit-buttons.tsx"));
}, {
    featureName: 'active-visit-actions',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var encounterListTableTabs = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getAsyncLifecycle)(function() {
    return Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_swr_dist_index_index_mjs"), __webpack_require__.e("src_clinical-views_encounter-list_encounter-list-tabs_component_tsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./clinical-views/encounter-list/encounter-list-tabs.component */ "./src/clinical-views/encounter-list/encounter-list-tabs.component.tsx"));
}, {
    featureName: 'encounter-list-table-tabs',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var visitContextSwitcherModal = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getAsyncLifecycle)(function() {
    return Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_carbon_icons-react_es_Icon_js-node_modules_carbon_icons-react_es_iconPro-cf7878"), __webpack_require__.e("vendors-node_modules_carbon_icons-react_es_generated_bucket-1_js"), __webpack_require__.e("webpack_sharing_consume_default_dayjs_dayjs"), __webpack_require__.e("src_visit_visits-widget_visit-context_visit-context-switcher_modal_tsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./visit/visits-widget/visit-context/visit-context-switcher.modal */ "./src/visit/visits-widget/visit-context/visit-context-switcher.modal.tsx"));
}, {
    featureName: 'visit-context-switcher',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var visitContextHeader = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getAsyncLifecycle)(function() {
    return Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_carbon_icons-react_es_Icon_js-node_modules_carbon_icons-react_es_iconPro-cf7878"), __webpack_require__.e("vendors-node_modules_carbon_icons-react_es_generated_bucket-1_js"), __webpack_require__.e("src_visit_visits-widget_visit-context_visit-context-header_component_tsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./visit/visits-widget/visit-context/visit-context-header.component */ "./src/visit/visits-widget/visit-context/visit-context-header.component.tsx"));
}, {
    featureName: 'visit-context-header',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});
var retrospectiveDateTimePicker = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.getAsyncLifecycle)(function() {
    return Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_react-hook-form_dist_index_esm_mjs"), __webpack_require__.e("src_visit_visits-widget_visit-context_retrospective-data-date-time-picker_retrospective-date--bbc641")]).then(__webpack_require__.bind(__webpack_require__, /*! ./visit/visits-widget/visit-context/retrospective-data-date-time-picker/retrospective-date-time-picker.component */ "./src/visit/visits-widget/visit-context/retrospective-data-date-time-picker/retrospective-date-time-picker.component.tsx"));
}, {
    featureName: 'retrospective-date-time-picker',
    moduleName: _constants__WEBPACK_IMPORTED_MODULE_3__.moduleName
});


/***/ }),

/***/ "./src/loader/loader.component.tsx":
/*!*****************************************!*\
  !*** ./src/loader/loader.component.tsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @carbon/react */ "webpack/sharing/consume/default/@carbon/react/@carbon/react");
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_carbon_react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _loader_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./loader.scss */ "./src/loader/loader.scss");




var Loader = function() {
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)().t;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.InlineLoading, {
        className: _loader_scss__WEBPACK_IMPORTED_MODULE_3__["default"].loading,
        description: "".concat(t('loading', 'Loading'), " ...")
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Loader);


/***/ }),

/***/ "./src/offline.ts":
/*!************************!*\
  !*** ./src/offline.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setupCacheableRoutes: () => (/* binding */ setupCacheableRoutes),
/* harmony export */   setupOfflineVisitsSync: () => (/* binding */ setupOfflineVisitsSync)
/* harmony export */ });
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @openmrs/esm-patient-common-lib */ "webpack/sharing/consume/default/@openmrs/esm-patient-common-lib/@openmrs/esm-patient-common-lib");
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_1__);
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _ts_generator(thisArg, body) {
    var f, y, t, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}


function setupCacheableRoutes() {
    (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.messageOmrsServiceWorker)({
        type: 'registerDynamicRoute',
        pattern: ".+".concat(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.fhirBaseUrl, "/R4/Patient/.+")
    });
    (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.messageOmrsServiceWorker)({
        type: 'registerDynamicRoute',
        pattern: ".+".concat(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.restBaseUrl, "/visit.+")
    });
}
/**
 * Sets up the offline synchronization for offline visits.
 */ function setupOfflineVisitsSync() {
    (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.setupOfflineSync)(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_1__.visitSyncType, [
        'patient-registration'
    ], function(visit, options) {
        return _async_to_generator(function() {
            var visitPayload, res;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        visitPayload = _object_spread_props(_object_spread({}, visit), {
                            stopDatetime: new Date()
                        });
                        return [
                            4,
                            (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.saveVisit)(visitPayload, options.abort)
                        ];
                    case 1:
                        res = _state.sent();
                        if (!res.ok) {
                            throw new Error("Failed to synchronize offline visit with the UUID: ".concat(visit.uuid, ". Error: ").concat(JSON.stringify(res.data)));
                        }
                        return [
                            2,
                            res.data
                        ];
                }
            });
        })();
    });
}


/***/ }),

/***/ "./src/patient-banner-tags/visit-attribute-tags.component.tsx":
/*!********************************************************************!*\
  !*** ./src/patient-banner-tags/visit-attribute-tags.component.tsx ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @carbon/react */ "webpack/sharing/consume/default/@carbon/react/@carbon/react");
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_carbon_react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @openmrs/esm-patient-common-lib */ "webpack/sharing/consume/default/@openmrs/esm-patient-common-lib/@openmrs/esm-patient-common-lib");
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_3__);




var getAttributeValue = function(attributeType, value) {
    switch(attributeType === null || attributeType === void 0 ? void 0 : attributeType.datatypeClassname){
        case 'org.openmrs.customdatatype.datatype.ConceptDatatype':
            return value === null || value === void 0 ? void 0 : value.display;
        case 'org.openmrs.customdatatype.datatype.FloatDatatype':
        case 'org.openmrs.customdatatype.datatype.FreeTextDatatype':
        case 'org.openmrs.customdatatype.datatype.LongFreeTextDatatype':
        case 'org.openmrs.customdatatype.datatype.BooleanDatatype':
            return value;
        case 'org.openmrs.customdatatype.datatype.DateDatatype':
            return (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.formatDate)(new Date(value), {
                mode: 'wide'
            });
        default:
            return value;
    }
};
var VisitAttributeTags = function(param) {
    var patientUuid = param.patientUuid;
    var _currentVisit_attributes;
    var currentVisit = (0,_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_3__.useVisitOrOfflineVisit)(patientUuid).currentVisit;
    var visitAttributeTypes = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.useConfig)().visitAttributeTypes;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, currentVisit === null || currentVisit === void 0 ? void 0 : (_currentVisit_attributes = currentVisit.attributes) === null || _currentVisit_attributes === void 0 ? void 0 : _currentVisit_attributes.filter(function(attribute) {
        var _visitAttributeTypes_find;
        return (_visitAttributeTypes_find = visitAttributeTypes.find(function(param) {
            var uuid = param.uuid;
            var _attribute_attributeType;
            return (attribute === null || attribute === void 0 ? void 0 : (_attribute_attributeType = attribute.attributeType) === null || _attribute_attributeType === void 0 ? void 0 : _attribute_attributeType.uuid) === uuid;
        })) === null || _visitAttributeTypes_find === void 0 ? void 0 : _visitAttributeTypes_find.displayInThePatientBanner;
    }).map(function(attribute) {
        var _attribute_attributeType;
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.Tag, {
            key: attribute === null || attribute === void 0 ? void 0 : (_attribute_attributeType = attribute.attributeType) === null || _attribute_attributeType === void 0 ? void 0 : _attribute_attributeType.uuid,
            type: "gray"
        }, getAttributeValue(attribute === null || attribute === void 0 ? void 0 : attribute.attributeType, attribute === null || attribute === void 0 ? void 0 : attribute.value));
    }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VisitAttributeTags);


/***/ }),

/***/ "./src/patient-chart/chart-review/chart-review.component.tsx":
/*!*******************************************************************!*\
  !*** ./src/patient-chart/chart-review/chart-review.component.tsx ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "webpack/sharing/consume/default/react-router-dom/react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @openmrs/esm-patient-common-lib */ "webpack/sharing/consume/default/@openmrs/esm-patient-common-lib/@openmrs/esm-patient-common-lib");
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _dashboard_view_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dashboard-view.component */ "./src/patient-chart/chart-review/dashboard-view.component.tsx");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../constants */ "./src/constants.ts");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}






function makePath(target) {
    var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var parts = "".concat(_constants__WEBPACK_IMPORTED_MODULE_5__.basePath, "/").concat(encodeURIComponent(target.path)).split('/');
    Object.keys(params).forEach(function(key) {
        for(var i = 0; i < parts.length; i++){
            if (parts[i][0] === ':' && parts[i].indexOf(key) === 1) {
                parts[i] = params[key];
            }
        }
    });
    return parts.join('/');
}
function getDashboardDefinition(meta, config, moduleName) {
    return _object_spread_props(_object_spread({}, meta, config), {
        moduleName: moduleName
    });
}
var ChartReview = function(param) {
    var patientUuid = param.patientUuid, patient = param.patient, view = param.view, setDashboardLayoutMode = param.setDashboardLayoutMode;
    var extensionStore = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.useExtensionStore)();
    var navGroups = (0,_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_3__.useNavGroups)().navGroups;
    var ungroupedDashboards = extensionStore.slots['patient-chart-dashboard-slot'].assignedExtensions.map(function(e) {
        return getDashboardDefinition(e.meta, e.config, e.moduleName);
    });
    var groupedDashboards = navGroups.map(function(slotName) {
        return extensionStore.slots[slotName].assignedExtensions.map(function(e) {
            return getDashboardDefinition(e.meta, e.config, e.moduleName);
        });
    }).flat();
    var dashboards = ungroupedDashboards.concat(groupedDashboards);
    var defaultDashboard = dashboards.filter(function(dashboard) {
        return dashboard.path;
    })[0];
    var dashboard = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function() {
        return dashboards.find(function(dashboard) {
            return dashboard.path === view;
        });
    }, [
        dashboards,
        view
    ]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function() {
        var activeDashboard = dashboard !== null && dashboard !== void 0 ? dashboard : defaultDashboard;
        if (setDashboardLayoutMode) {
            var _activeDashboard_layoutMode;
            setDashboardLayoutMode((_activeDashboard_layoutMode = activeDashboard.layoutMode) !== null && _activeDashboard_layoutMode !== void 0 ? _activeDashboard_layoutMode : 'contained');
        }
    }, [
        dashboard,
        defaultDashboard,
        setDashboardLayoutMode
    ]);
    if (!('patient-chart-dashboard-slot' in extensionStore.slots)) {
        return null;
    }
    if (!defaultDashboard) {
        return null;
    } else if (!dashboard) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Navigate, {
            to: makePath(defaultDashboard, {
                patientUuid: patientUuid
            }),
            replace: true
        });
    } else {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_dashboard_view_component__WEBPACK_IMPORTED_MODULE_4__.DashboardView, {
            dashboard: dashboard,
            patientUuid: patientUuid,
            patient: patient
        });
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChartReview);


/***/ }),

/***/ "./src/patient-chart/chart-review/dashboard-view.component.tsx":
/*!*********************************************************************!*\
  !*** ./src/patient-chart/chart-review/dashboard-view.component.tsx ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DashboardView: () => (/* binding */ DashboardView)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "../../node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "webpack/sharing/consume/default/react-router-dom/react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @openmrs/esm-patient-common-lib */ "webpack/sharing/consume/default/@openmrs/esm-patient-common-lib/@openmrs/esm-patient-common-lib");
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../constants */ "./src/constants.ts");
/* harmony import */ var _dashboard_view_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./dashboard-view.scss */ "./src/patient-chart/chart-review/dashboard-view.scss");
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}








function DashboardView(param) {
    var dashboard = param.dashboard, patientUuid = param.patientUuid, patient = param.patient;
    var widgetMetas = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_4__.useExtensionSlotMeta)(dashboard.slot);
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)(dashboard.moduleName).t;
    var _useMatch = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__.useMatch)(_constants__WEBPACK_IMPORTED_MODULE_6__.dashboardPath), view = _useMatch.params.view;
    var state = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function() {
        return {
            basePath: view,
            patient: patient,
            patientUuid: patientUuid,
            launchPatientWorkspace: _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_5__.launchPatientWorkspace,
            launchStartVisitPrompt: _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_5__.launchStartVisitPrompt
        };
    }, [
        patient,
        patientUuid,
        view
    ]);
    var _useState = _sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(), 2), resolvedTitle = _useState[0], setResolvedTitle = _useState[1];
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function() {
        if (typeof (dashboard === null || dashboard === void 0 ? void 0 : dashboard.title) === 'function') {
            Promise.resolve(dashboard.title()).then(setResolvedTitle);
        } else if (typeof (dashboard === null || dashboard === void 0 ? void 0 : dashboard.title) === 'string') {
            setResolvedTitle(dashboard.title);
        } else {
            setResolvedTitle(undefined);
        }
    }, [
        dashboard
    ]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_4__.ExtensionSlot, {
        state: state,
        name: "top-of-all-patient-dashboards-slot"
    }), !dashboard.hideDashboardTitle && resolvedTitle && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", {
        className: _dashboard_view_scss__WEBPACK_IMPORTED_MODULE_7__["default"].dashboardTitle
    }, t(resolvedTitle)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _dashboard_view_scss__WEBPACK_IMPORTED_MODULE_7__["default"].dashboardContainer
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_4__.ExtensionSlot, {
        key: dashboard.slot,
        name: dashboard.slot,
        className: _dashboard_view_scss__WEBPACK_IMPORTED_MODULE_7__["default"].dashboard
    }, function(extension) {
        var _ref = widgetMetas[extension.id] || {}, _ref_fullWidth = _ref.fullWidth, fullWidth = _ref_fullWidth === void 0 ? false : _ref_fullWidth;
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
            className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(_dashboard_view_scss__WEBPACK_IMPORTED_MODULE_7__["default"].extension, fullWidth && _dashboard_view_scss__WEBPACK_IMPORTED_MODULE_7__["default"].fullWidth)
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_4__.Extension, {
            state: state,
            className: _dashboard_view_scss__WEBPACK_IMPORTED_MODULE_7__["default"].extensionWrapper
        }));
    })));
}


/***/ }),

/***/ "./src/patient-chart/patient-chart.component.tsx":
/*!*******************************************************!*\
  !*** ./src/patient-chart/patient-chart.component.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @openmrs/esm-patient-common-lib */ "webpack/sharing/consume/default/@openmrs/esm-patient-common-lib/@openmrs/esm-patient-common-lib");
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "../../node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-router-dom */ "webpack/sharing/consume/default/react-router-dom/react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _loader_loader_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../loader/loader.component */ "./src/loader/loader.component.tsx");
/* harmony import */ var _patient_chart_chart_review_chart_review_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../patient-chart/chart-review/chart-review.component */ "./src/patient-chart/chart-review/chart-review.component.tsx");
/* harmony import */ var _side_nav_side_menu_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../side-nav/side-menu.component */ "./src/side-nav/side-menu.component.tsx");
/* harmony import */ var _patient_chart_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./patient-chart.scss */ "./src/patient-chart/patient-chart.scss");
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}










var PatientChart = function() {
    var _useParams = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_4__.useParams)(), patientUuid = _useParams.patientUuid, encodedView = _useParams.view;
    var view = decodeURIComponent(encodedView);
    var _usePatient = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.usePatient)(patientUuid), isLoadingPatient = _usePatient.isLoading, patient = _usePatient.patient;
    var state = (0,react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(function() {
        return {
            patient: patient,
            patientUuid: patientUuid
        };
    }, [
        patient,
        patientUuid
    ]);
    var _useWorkspaces = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.useWorkspaces)(), workspaceWindowState = _useWorkspaces.workspaceWindowState, active = _useWorkspaces.active;
    var _useState = _sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(), 2), layoutMode = _useState[0], setLayoutMode = _useState[1];
    // Keep state updated with the current patient. Anything used outside the patient
    // chart (e.g., the current visit is used by the Active Visit Tag used in the
    // patient search) must be updated in the callback, which is called when the patient
    // chart unmounts.
    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(function() {
        return function() {
            (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.setCurrentVisit)(null, null);
        };
    }, [
        patientUuid
    ]);
    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(function() {
        (0,_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_1__.getPatientChartStore)().setState(_object_spread({}, state));
        return function() {
            (0,_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_1__.getPatientChartStore)().setState({});
        };
    }, [
        state
    ]);
    var leftNavBasePath = (0,react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(function() {
        return _constants__WEBPACK_IMPORTED_MODULE_5__.spaBasePath.replace(':patientUuid', patientUuid);
    }, [
        patientUuid
    ]);
    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(function() {
        (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.setLeftNav)({
            name: 'patient-chart-dashboard-slot',
            basePath: leftNavBasePath
        });
        return function() {
            return (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.unsetLeftNav)('patient-chart-dashboard-slot');
        };
    }, [
        leftNavBasePath
    ]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement((react__WEBPACK_IMPORTED_MODULE_3___default().Fragment), null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement(_side_nav_side_menu_component__WEBPACK_IMPORTED_MODULE_8__["default"], null), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement("main", {
        className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('omrs-main-content', _patient_chart_scss__WEBPACK_IMPORTED_MODULE_9__["default"].chartContainer)
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement((react__WEBPACK_IMPORTED_MODULE_3___default().Fragment), null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_2___default()(_patient_chart_scss__WEBPACK_IMPORTED_MODULE_9__["default"].innerChartContainer, workspaceWindowState === 'normal' && active ? _patient_chart_scss__WEBPACK_IMPORTED_MODULE_9__["default"].closeWorkspace : _patient_chart_scss__WEBPACK_IMPORTED_MODULE_9__["default"].activeWorkspace)
    }, isLoadingPatient ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement(_loader_loader_component__WEBPACK_IMPORTED_MODULE_6__["default"], null) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement((react__WEBPACK_IMPORTED_MODULE_3___default().Fragment), null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement("aside", null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.ExtensionSlot, {
        name: "patient-header-slot",
        state: state
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.ExtensionSlot, {
        name: "patient-highlights-bar-slot",
        state: state
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.ExtensionSlot, {
        name: "patient-info-slot",
        state: state
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement("div", {
        className: _patient_chart_scss__WEBPACK_IMPORTED_MODULE_9__["default"].grid
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_2___default()(_patient_chart_scss__WEBPACK_IMPORTED_MODULE_9__["default"].chartReview, _define_property({}, _patient_chart_scss__WEBPACK_IMPORTED_MODULE_9__["default"].widthContained, layoutMode == 'contained'))
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement(_patient_chart_chart_review_chart_review_component__WEBPACK_IMPORTED_MODULE_7__["default"], {
        patient: state.patient,
        patientUuid: state.patientUuid,
        view: view,
        setDashboardLayoutMode: setLayoutMode
    }))))))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.WorkspaceContainer, {
        showSiderailAndBottomNav: true,
        contextKey: "patient/".concat(patientUuid),
        additionalWorkspaceProps: state
    }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PatientChart);


/***/ }),

/***/ "./src/patient-details-tile/patient-details-tile.component.tsx":
/*!*********************************************************************!*\
  !*** ./src/patient-details-tile/patient-details-tile.component.tsx ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_es_capitalize__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash-es/capitalize */ "../../node_modules/lodash-es/capitalize.js");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _patient_details_tile_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./patient-details-tile.scss */ "./src/patient-details-tile/patient-details-tile.scss");





var PatientDetailsTile = function(param) {
    var patient = param.patient;
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)().t;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _patient_details_tile_scss__WEBPACK_IMPORTED_MODULE_3__["default"].container
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
        className: _patient_details_tile_scss__WEBPACK_IMPORTED_MODULE_3__["default"].name
    }, patient ? (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.getPatientName)(patient) : ''), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _patient_details_tile_scss__WEBPACK_IMPORTED_MODULE_3__["default"].details
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, (0,lodash_es_capitalize__WEBPACK_IMPORTED_MODULE_4__["default"])(patient === null || patient === void 0 ? void 0 : patient.gender)), " \xb7 ", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.age)(patient === null || patient === void 0 ? void 0 : patient.birthDate)), " \xb7", ' ', /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.formatDate)((0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.parseDate)(patient === null || patient === void 0 ? void 0 : patient.birthDate), {
        mode: 'wide',
        time: false
    }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PatientDetailsTile);


/***/ }),

/***/ "./src/root.component.tsx":
/*!********************************!*\
  !*** ./src/root.component.tsx ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Root)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "webpack/sharing/consume/default/react-router-dom/react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./src/constants.ts");
/* harmony import */ var _patient_chart_patient_chart_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./patient-chart/patient-chart.component */ "./src/patient-chart/patient-chart.component.tsx");
/* harmony import */ var _root_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./root.scss */ "./src/root.scss");





function Root() {
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _root_scss__WEBPACK_IMPORTED_MODULE_4__["default"].patientChartWrapper
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.BrowserRouter, {
        basename: _constants__WEBPACK_IMPORTED_MODULE_2__.spaRoot
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Routes, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
        path: _constants__WEBPACK_IMPORTED_MODULE_2__.basePath,
        element: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_patient_chart_patient_chart_component__WEBPACK_IMPORTED_MODULE_3__["default"], null)
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.Route, {
        path: _constants__WEBPACK_IMPORTED_MODULE_2__.dashboardPath,
        element: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_patient_chart_patient_chart_component__WEBPACK_IMPORTED_MODULE_3__["default"], null)
    })))));
} /**
 * DO NOT REMOVE THIS COMMENT
 * THE TRANSLATION KEYS AND VALUES USED IN THE COMMON LIB IS WRITTEN HERE
 * t('paginationPageText', 'of {{count}} pages', {count})
 * t("emptyStateText", 'There are no {{displayText}} to display for this patient', {displayText: "sample text"})
 * t('record', 'Record')
 * t('errorCopy','Sorry, there was a problem displaying this information. You can try to reload this page, or contact the site administrator and quote the error code above.')
 * t('error', 'Error')
 * t('seeAll', 'See all')
 * t('paginationItemsCount', `{{pageItemsCount}} / {{count}} items`, { count: totalItems, pageItemsCount });
 * t('Routine')
 * t('Stat')
 * t('On scheduled date')
 */ 


/***/ }),

/***/ "./src/side-nav/side-menu.component.tsx":
/*!**********************************************!*\
  !*** ./src/side-nav/side-menu.component.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__);


var SideMenuPanel = function() {
    var layout = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.useLayoutType)();
    return layout === 'large-desktop' && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.LeftNavMenu, null);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SideMenuPanel);


/***/ }),

/***/ "./src/visit/start-visit-button.component.tsx":
/*!****************************************************!*\
  !*** ./src/visit/start-visit-button.component.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @carbon/react */ "webpack/sharing/consume/default/@carbon/react/@carbon/react");
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_carbon_react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @openmrs/esm-patient-common-lib */ "webpack/sharing/consume/default/@openmrs/esm-patient-common-lib/@openmrs/esm-patient-common-lib");
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_4__);





/**
 * This button shows up in search results patient cards for patients with no active visit
 */ var StartVisitButton = function(param) {
    var patientUuid = param.patientUuid, handleReturnToSearchList = param.handleReturnToSearchList, hidePatientSearch = param.hidePatientSearch;
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)().t;
    var startVisitWorkspaceForm = 'start-visit-workspace-form';
    var handleStartVisit = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function() {
        hidePatientSearch === null || hidePatientSearch === void 0 ? void 0 : hidePatientSearch();
        try {
            (0,_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_3__.launchPatientWorkspace)(startVisitWorkspaceForm, {
                patientUuid: patientUuid,
                openedFrom: 'patient-chart-start-visit',
                handleReturnToSearchList: handleReturnToSearchList
            });
        } catch (error) {
            console.error('Error launching visit form workspace:', error);
            var _error_message;
            (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_4__.showSnackbar)({
                isLowContrast: false,
                kind: 'error',
                title: t('errorStartingVisit', 'Error starting visit'),
                subtitle: (_error_message = error.message) !== null && _error_message !== void 0 ? _error_message : t('errorStartingVisitDescription', 'An error occurred while starting the visit')
            });
        }
    }, [
        patientUuid,
        t,
        handleReturnToSearchList,
        hidePatientSearch
    ]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.Button, {
        "aria-label": t('startVisit', 'Start visit'),
        kind: "primary",
        onClick: handleStartVisit
    }, t('startVisit', 'Start visit'));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StartVisitButton);


/***/ }),

/***/ "./src/visit/visit-history-table/visit-actions-cell.component.tsx":
/*!************************************************************************!*\
  !*** ./src/visit/visit-history-table/visit-actions-cell.component.tsx ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _visit_actions_cell_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./visit-actions-cell.scss */ "./src/visit/visit-history-table/visit-actions-cell.scss");



var VisitActionsCell = function(param) {
    var visit = param.visit;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.ExtensionSlot, {
        name: "visit-detail-overview-actions",
        className: _visit_actions_cell_scss__WEBPACK_IMPORTED_MODULE_2__["default"].visitActions,
        state: {
            patientUuid: visit.patient.uuid,
            visit: visit,
            compact: true
        }
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VisitActionsCell);


/***/ }),

/***/ "./src/visit/visit-history-table/visit-date-cell.component.tsx":
/*!*********************************************************************!*\
  !*** ./src/visit/visit-history-table/visit-date-cell.component.tsx ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_2__);



var VisitDateCell = function(param) {
    var visit = param.visit;
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)().t;
    var startDatetime = visit.startDatetime, stopDatetime = visit.stopDatetime;
    var fromDate = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.formatDate)(new Date(startDatetime));
    var toDate = stopDatetime ? (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.formatDate)(new Date(stopDatetime)) : null;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().createElement((react__WEBPACK_IMPORTED_MODULE_1___default().Fragment), null, toDate ? t('fromDateToDate', '{{fromDate}} - {{toDate}}', {
        fromDate: fromDate,
        toDate: toDate
    }) : fromDate);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VisitDateCell);


/***/ }),

/***/ "./src/visit/visit-history-table/visit-diagnoses-cell.component.tsx":
/*!**************************************************************************!*\
  !*** ./src/visit/visit-history-table/visit-diagnoses-cell.component.tsx ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


var VisitDiagnosisCell = function(param) {
    var visit = param.visit;
    var diagnoses = visit.encounters.flatMap(function(encounter) {
        return encounter.diagnoses;
    }).filter(function(diagnosis) {
        return !diagnosis.voided;
    }).sort(function(a, b) {
        return a.rank - b.rank;
    });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.DiagnosisTags, {
        diagnoses: diagnoses
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VisitDiagnosisCell);


/***/ }),

/***/ "./src/visit/visit-history-table/visit-history-table.component.tsx":
/*!*************************************************************************!*\
  !*** ./src/visit/visit-history-table/visit-history-table.component.tsx ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @carbon/react */ "webpack/sharing/consume/default/@carbon/react/@carbon/react");
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_carbon_react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @openmrs/esm-patient-common-lib */ "webpack/sharing/consume/default/@openmrs/esm-patient-common-lib/@openmrs/esm-patient-common-lib");
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _visits_widget_visit_resource__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../visits-widget/visit.resource */ "./src/visit/visits-widget/visit.resource.tsx");
/* harmony import */ var _visit_date_cell_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./visit-date-cell.component */ "./src/visit/visit-history-table/visit-date-cell.component.tsx");
/* harmony import */ var _visit_diagnoses_cell_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./visit-diagnoses-cell.component */ "./src/visit/visit-history-table/visit-diagnoses-cell.component.tsx");
/* harmony import */ var _visits_widget_past_visits_components_visit_summary_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../visits-widget/past-visits-components/visit-summary.component */ "./src/visit/visits-widget/past-visits-components/visit-summary.component.tsx");
/* harmony import */ var _visit_type_cell_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./visit-type-cell.component */ "./src/visit/visit-history-table/visit-type-cell.component.tsx");
/* harmony import */ var _visit_actions_cell_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./visit-actions-cell.component */ "./src/visit/visit-history-table/visit-actions-cell.component.tsx");
/* harmony import */ var _visit_history_table_scss__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./visit-history-table.scss */ "./src/visit/visit-history-table/visit-history-table.scss");
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}












/**
 * This show a list of visit histories in the visit tab in patient chart
 */ var VisitHistoryTable = function(param) {
    var patientUuid = param.patientUuid;
    var defaultPageSize = 10;
    var _useState = _sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(defaultPageSize), 2), pageSize = _useState[0], setPageSize = _useState[1];
    var pageSizes = [
        10,
        20,
        30,
        40,
        50
    ];
    var _usePaginatedVisits = (0,_visits_widget_visit_resource__WEBPACK_IMPORTED_MODULE_5__.usePaginatedVisits)(patientUuid, pageSize), visits = _usePaginatedVisits.data, currentPage = _usePaginatedVisits.currentPage, error = _usePaginatedVisits.error, isLoading = _usePaginatedVisits.isLoading, totalCount = _usePaginatedVisits.totalCount, goTo = _usePaginatedVisits.goTo;
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)().t;
    var desktopLayout = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.isDesktop)((0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.useLayoutType)());
    // TODO: make this configurable
    var columns = [
        {
            key: 'visitDate',
            header: t('date', 'Date'),
            CellComponent: _visit_date_cell_component__WEBPACK_IMPORTED_MODULE_6__["default"]
        },
        {
            key: 'visitType',
            header: t('visitType', 'Visit type'),
            CellComponent: _visit_type_cell_component__WEBPACK_IMPORTED_MODULE_9__["default"]
        },
        {
            key: 'diagnoses',
            header: t('diagnoses', 'Diagnoses'),
            CellComponent: _visit_diagnoses_cell_component__WEBPACK_IMPORTED_MODULE_7__["default"]
        },
        {
            key: 'actions',
            header: '',
            CellComponent: _visit_actions_cell_component__WEBPACK_IMPORTED_MODULE_10__["default"]
        }
    ];
    var layout = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.useLayoutType)();
    var rowData = visits === null || visits === void 0 ? void 0 : visits.map(function(visit) {
        var row = {
            id: visit.uuid
        };
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = columns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var _step_value = _step.value, key = _step_value.key, CellComponent = _step_value.CellComponent;
                row[key] = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(CellComponent, {
                    key: key,
                    visit: visit
                });
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
        return row;
    });
    if (isLoading) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.DataTableSkeleton, {
            role: "progressbar",
            compact: (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.isDesktop)(layout),
            zebra: true
        });
    }
    if (error) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.ErrorState, {
            error: error,
            headerTitle: t('pastVisits', 'Past visits')
        });
    }
    if (visits.length === 0) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
            className: _visit_history_table_scss__WEBPACK_IMPORTED_MODULE_11__["default"].emptyStateContainer
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_4__.EmptyState, {
            headerTitle: t('pastVisits', 'Past visits'),
            displayText: t('visits', 'visits')
        }));
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _visit_history_table_scss__WEBPACK_IMPORTED_MODULE_11__["default"].container
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.DataTable, {
        headers: columns,
        rows: rowData,
        size: desktopLayout ? 'sm' : 'lg',
        useZebraStyles: true
    }, function(param) {
        var rows = param.rows, headers = param.headers, getTableProps = param.getTableProps, getHeaderProps = param.getHeaderProps, getExpandHeaderProps = param.getExpandHeaderProps, getRowProps = param.getRowProps, getExpandedRowProps = param.getExpandedRowProps;
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableContainer, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.Table, getTableProps(), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableHead, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableRow, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableExpandHeader, _object_spread({
            enableToggle: true
        }, getExpandHeaderProps())), headers.map(function(header) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableHeader, getHeaderProps({
                header: header,
                isSortable: header.isSortable,
                className: header.key === 'actions' ? _visit_history_table_scss__WEBPACK_IMPORTED_MODULE_11__["default"].actionsColumn : ''
            }), header.header);
        }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableBody, null, rows.map(function(row, i) {
            var visit = visits[i];
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), {
                key: row.id
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableExpandRow, getRowProps({
                row: row
            }), row.cells.map(function(cell) {
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableCell, {
                    key: cell.id
                }, cell === null || cell === void 0 ? void 0 : cell.value);
            })), row.isExpanded ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableExpandedRow, _object_spread_props(_object_spread({}, getExpandedRowProps({
                row: row
            })), {
                colSpan: headers.length + 2
            }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_visits_widget_past_visits_components_visit_summary_component__WEBPACK_IMPORTED_MODULE_8__["default"], {
                visit: visit,
                patientUuid: patientUuid
            })) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableExpandedRow, {
                className: _visit_history_table_scss__WEBPACK_IMPORTED_MODULE_11__["default"].hiddenRow,
                colSpan: headers.length + 2
            }));
        })))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.Pagination, {
            forwardText: t('nextPage', 'Next page'),
            backwardText: t('previousPage', 'Previous page'),
            page: currentPage,
            pageSize: pageSize,
            pageSizes: pageSizes,
            totalItems: totalCount,
            onChange: function(param) {
                var pageSize = param.pageSize, page = param.page;
                setPageSize(pageSize);
                if (page !== currentPage) {
                    goTo(page);
                }
            }
        }));
    }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VisitHistoryTable);


/***/ }),

/***/ "./src/visit/visit-history-table/visit-type-cell.component.tsx":
/*!*********************************************************************!*\
  !*** ./src/visit/visit-history-table/visit-type-cell.component.tsx ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

var VisitTypeCell = function(param) {
    var visit = param.visit;
    var visitType = visit.visitType;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, visitType.display);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VisitTypeCell);


/***/ }),

/***/ "./src/visit/visits-widget/current-visit-summary.component.tsx":
/*!*********************************************************************!*\
  !*** ./src/visit/visits-widget/current-visit-summary.component.tsx ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @carbon/react */ "webpack/sharing/consume/default/@carbon/react/@carbon/react");
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_carbon_react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @openmrs/esm-patient-common-lib */ "webpack/sharing/consume/default/@openmrs/esm-patient-common-lib/@openmrs/esm-patient-common-lib");
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _past_visits_components_visit_summary_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./past-visits-components/visit-summary.component */ "./src/visit/visits-widget/past-visits-components/visit-summary.component.tsx");






var CurrentVisitSummary = function(param) {
    var patientUuid = param.patientUuid;
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)().t;
    var _useVisit = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.useVisit)(patientUuid), isLoading = _useVisit.isLoading, currentVisit = _useVisit.currentVisit, error = _useVisit.error, isValidating = _useVisit.isValidating;
    if (isLoading) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_3__.InlineLoading, {
            status: "active",
            iconDescription: t('loading', 'Loading'),
            description: t('loadingVisit', 'Loading current visit...')
        });
    }
    if (!!error) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.ErrorState, {
            headerTitle: t('failedToLoadCurrentVisit', 'Failed loading current visit'),
            error: error
        });
    }
    if (!currentVisit) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_4__.EmptyState, {
            headerTitle: t('currentVisit', 'Current visit'),
            displayText: t('noActiveVisitMessage', 'active visit'),
            launchForm: function() {
                return (0,_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_4__.launchPatientWorkspace)('start-visit-workspace-form', {
                    openedFrom: 'patient-chart-current-visit-summary'
                });
            }
        });
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: styles.container
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_4__.CardHeader, {
        title: t('currentVisit', 'Current visit')
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, isValidating ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_3__.InlineLoading, null) : null)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: styles.visitSummaryCard
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_past_visits_components_visit_summary_component__WEBPACK_IMPORTED_MODULE_5__["default"], {
        visit: currentVisit,
        patientUuid: patientUuid
    })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CurrentVisitSummary);


/***/ }),

/***/ "./src/visit/visits-widget/encounter-observations/encounter-observations.component.tsx":
/*!*********************************************************************************************!*\
  !*** ./src/visit/visits-widget/encounter-observations/encounter-observations.component.tsx ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles.scss */ "./src/visit/visits-widget/encounter-observations/styles.scss");




var EncounterObservations = function(param) {
    var observations = param.observations;
    var getAnswerFromDisplay = function getAnswerFromDisplay(display) {
        var colonIndex = display.indexOf(':');
        if (colonIndex === -1) {
            return '';
        } else {
            return display.substring(colonIndex + 1).trim();
        }
    };
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)().t;
    var _useConfig = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.useConfig)(), _useConfig_obsConceptUuidsToHide = _useConfig.obsConceptUuidsToHide, obsConceptUuidsToHide = _useConfig_obsConceptUuidsToHide === void 0 ? [] : _useConfig_obsConceptUuidsToHide;
    var filteredObservations = !!obsConceptUuidsToHide.length ? observations === null || observations === void 0 ? void 0 : observations.filter(function(obs) {
        var _obs_concept;
        return !obsConceptUuidsToHide.includes(obs === null || obs === void 0 ? void 0 : (_obs_concept = obs.concept) === null || _obs_concept === void 0 ? void 0 : _obs_concept.uuid);
    }) : observations;
    if (!filteredObservations || filteredObservations.length == 0) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
            className: _styles_scss__WEBPACK_IMPORTED_MODULE_3__["default"].observation
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, t('noObservationsFound', 'No observations found')));
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _styles_scss__WEBPACK_IMPORTED_MODULE_3__["default"].observation
    }, filteredObservations === null || filteredObservations === void 0 ? void 0 : filteredObservations.map(function(obs, index) {
        if (obs.groupMembers) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), {
                key: index
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
                className: _styles_scss__WEBPACK_IMPORTED_MODULE_3__["default"].parentConcept
            }, obs.concept.display), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null), obs.groupMembers.map(function(member) {
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), {
                    key: index
                }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
                    className: _styles_scss__WEBPACK_IMPORTED_MODULE_3__["default"].childConcept
                }, member.concept.display), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, getAnswerFromDisplay(member.display)));
            }));
        } else {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), {
                key: index
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, obs.concept.display), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, getAnswerFromDisplay(obs.display)));
        }
    }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EncounterObservations);


/***/ }),

/***/ "./src/visit/visits-widget/encounter-observations/index.ts":
/*!*****************************************************************!*\
  !*** ./src/visit/visits-widget/encounter-observations/index.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _encounter_observations_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./encounter-observations.component */ "./src/visit/visits-widget/encounter-observations/encounter-observations.component.tsx");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_encounter_observations_component__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./src/visit/visits-widget/past-visits-components/encounters-table/all-encounters-table.component.tsx":
/*!************************************************************************************************************!*\
  !*** ./src/visit/visits-widget/past-visits-components/encounters-table/all-encounters-table.component.tsx ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _encounters_table_resource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./encounters-table.resource */ "./src/visit/visits-widget/past-visits-components/encounters-table/encounters-table.resource.ts");
/* harmony import */ var _encounters_table_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./encounters-table.component */ "./src/visit/visits-widget/past-visits-components/encounters-table/encounters-table.component.tsx");
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}




/**
 * This component shows a table of all encounters (across all visits) of a patient
 */ var AllEncountersTable = function(param) {
    var patientUuid = param.patientUuid;
    var _useState = _sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null), 2), encounterTypeToFilter = _useState[0], setEncounterTypeToFilter = _useState[1];
    var _useState1 = _sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(20), 2), pageSize = _useState1[0], setPageSize = _useState1[1];
    var _usePaginatedEncounters = (0,_encounters_table_resource__WEBPACK_IMPORTED_MODULE_2__.usePaginatedEncounters)(patientUuid, encounterTypeToFilter === null || encounterTypeToFilter === void 0 ? void 0 : encounterTypeToFilter.uuid, pageSize), paginatedEncounters = _usePaginatedEncounters.data, currentPage = _usePaginatedEncounters.currentPage, isLoading = _usePaginatedEncounters.isLoading, totalCount = _usePaginatedEncounters.totalCount, goTo = _usePaginatedEncounters.goTo, mutate = _usePaginatedEncounters.mutate;
    var mutateEncounters = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function() {
        return mutate();
    }, [
        mutate
    ]);
    (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.useVisitContextStore)(mutateEncounters);
    var encountersTableProps = {
        currentPage: currentPage,
        encounterTypeToFilter: encounterTypeToFilter,
        goTo: goTo,
        isLoading: isLoading,
        pageSize: pageSize,
        paginatedEncounters: paginatedEncounters,
        patientUuid: patientUuid,
        setEncounterTypeToFilter: setEncounterTypeToFilter,
        setPageSize: setPageSize,
        showEncounterTypeFilter: true,
        showVisitType: true,
        totalCount: totalCount
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_encounters_table_component__WEBPACK_IMPORTED_MODULE_3__["default"], encountersTableProps);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AllEncountersTable);


/***/ }),

/***/ "./src/visit/visits-widget/past-visits-components/encounters-table/encounters-table.component.tsx":
/*!********************************************************************************************************!*\
  !*** ./src/visit/visits-widget/past-visits-components/encounters-table/encounters-table.component.tsx ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @carbon/react */ "webpack/sharing/consume/default/@carbon/react/@carbon/react");
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_carbon_react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @openmrs/esm-patient-common-lib */ "webpack/sharing/consume/default/@openmrs/esm-patient-common-lib/@openmrs/esm-patient-common-lib");
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _encounters_table_resource__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./encounters-table.resource */ "./src/visit/visits-widget/past-visits-components/encounters-table/encounters-table.resource.ts");
/* harmony import */ var _encounter_observations__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../encounter-observations */ "./src/visit/visits-widget/encounter-observations/index.ts");
/* harmony import */ var _encounters_table_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./encounters-table.scss */ "./src/visit/visits-widget/past-visits-components/encounters-table/encounters-table.scss");
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}








/**
 * This components is used by the AllEncountersTable and VisitEncountersTable to display
 * a table of encounters, with the actual data, pagination and filtering logic passed in
 * as props.
 */ var EncountersTable = function(param) {
    var currentPage = param.currentPage, encounterTypeToFilter = param.encounterTypeToFilter, goTo = param.goTo, isLoading = param.isLoading, pageSize = param.pageSize, paginatedEncounters = param.paginatedEncounters, patientUuid = param.patientUuid, setEncounterTypeToFilter = param.setEncounterTypeToFilter, setPageSize = param.setPageSize, showEncounterTypeFilter = param.showEncounterTypeFilter, showVisitType = param.showVisitType, totalCount = param.totalCount;
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)().t;
    var pageSizes = [
        10,
        20,
        30,
        40,
        50
    ];
    var desktopLayout = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.isDesktop)((0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.useLayoutType)());
    var session = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.useSession)();
    var mutateVisit = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.useVisitContextStore)().mutateVisit;
    var responsiveSize = desktopLayout ? 'sm' : 'lg';
    var _useEncounterTypes = (0,_encounters_table_resource__WEBPACK_IMPORTED_MODULE_5__.useEncounterTypes)(), encounterTypes = _useEncounterTypes.data, isLoadingEncounterTypes = _useEncounterTypes.isLoading;
    var formsConfig = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.useConfig)({
        externalModuleName: '@openmrs/esm-patient-forms-app'
    });
    var htmlFormEntryForms = formsConfig.htmlFormEntryForms;
    var paginatedMappedEncounters = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function() {
        return paginatedEncounters === null || paginatedEncounters === void 0 ? void 0 : paginatedEncounters.map(_encounters_table_resource__WEBPACK_IMPORTED_MODULE_5__.mapEncounter);
    }, [
        paginatedEncounters
    ]);
    var tableHeaders = [
        {
            header: t('dateAndTime', 'Date & time'),
            key: 'datetime'
        }
    ].concat(_to_consumable_array(showVisitType ? [
        {
            header: t('visitType', 'Visit type'),
            key: 'visitType'
        }
    ] : []), [
        {
            header: t('encounterType', 'Encounter type'),
            key: 'encounterType'
        },
        {
            header: t('form', 'Form name'),
            key: 'formName'
        },
        {
            header: t('provider', 'Provider'),
            key: 'provider'
        }
    ]);
    var handleDeleteEncounter = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function(encounterUuid, encounterTypeName) {
        var dispose = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.showModal)('delete-encounter-modal', {
            close: function() {
                return dispose();
            },
            encounterTypeName: encounterTypeName || '',
            onConfirmation: function() {
                var abortController = new AbortController();
                (0,_encounters_table_resource__WEBPACK_IMPORTED_MODULE_5__.deleteEncounter)(encounterUuid, abortController).then(function() {
                    mutateVisit();
                    (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.showSnackbar)({
                        isLowContrast: true,
                        title: t('encounterDeleted', 'Encounter deleted'),
                        subtitle: t('encounterSuccessfullyDeleted', 'The encounter has been deleted successfully'),
                        kind: 'success'
                    });
                }).catch(function() {
                    (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.showSnackbar)({
                        isLowContrast: false,
                        title: t('error', 'Error'),
                        subtitle: t('encounterWithError', 'The encounter could not be deleted successfully. If the error persists, please contact your system administrator.'),
                        kind: 'error'
                    });
                });
                dispose();
            }
        });
    }, [
        mutateVisit,
        t
    ]);
    if (isLoadingEncounterTypes || isLoading) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.DataTableSkeleton, {
            role: "progressbar",
            zebra: true
        });
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _encounters_table_scss__WEBPACK_IMPORTED_MODULE_7__["default"].container
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.DataTable, {
        headers: tableHeaders,
        overflowMenuOnHover: desktopLayout,
        rows: paginatedMappedEncounters !== null && paginatedMappedEncounters !== void 0 ? paginatedMappedEncounters : [],
        size: responsiveSize,
        useZebraStyles: totalCount > 1 ? true : false
    }, function(param) {
        var rows = param.rows, headers = param.headers, getHeaderProps = param.getHeaderProps, getRowProps = param.getRowProps, getExpandHeaderProps = param.getExpandHeaderProps, getToolbarProps = param.getToolbarProps, getTableProps = param.getTableProps;
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableContainer, {
            className: _encounters_table_scss__WEBPACK_IMPORTED_MODULE_7__["default"].tableContainer
        }, showEncounterTypeFilter && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableToolbar, getToolbarProps(), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableToolbarContent, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
            className: _encounters_table_scss__WEBPACK_IMPORTED_MODULE_7__["default"].filterContainer
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.ComboBox, {
            "aria-label": t('filterByEncounterType', 'Filter by encounter type'),
            className: _encounters_table_scss__WEBPACK_IMPORTED_MODULE_7__["default"].substitutionType,
            id: "encounterTypeFilter",
            items: encounterTypes,
            itemToString: function(item) {
                return item === null || item === void 0 ? void 0 : item.display;
            },
            onChange: function(param) {
                var selectedItem = param.selectedItem;
                return setEncounterTypeToFilter(selectedItem);
            },
            placeholder: t('filterByEncounterType', 'Filter by encounter type'),
            selectedItem: encounterTypeToFilter,
            size: responsiveSize
        })))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.Table, getTableProps(), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableHead, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableRow, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableExpandHeader, _object_spread({
            enableToggle: true
        }, getExpandHeaderProps())), headers.map(function(header, i) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableHeader, _object_spread({
                className: _encounters_table_scss__WEBPACK_IMPORTED_MODULE_7__["default"].tableHeader,
                key: i
            }, getHeaderProps({
                header: header
            })), header.header);
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableHeader, {
            "aria-label": t('actions', 'Actions')
        }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableBody, null, rows === null || rows === void 0 ? void 0 : rows.map(function(row, i) {
            var _encounter_form, _encounter_form1;
            var encounter = paginatedMappedEncounters[i];
            var isVisitNoteEncounter = function(encounter) {
                return encounter.encounterType === 'Visit Note' && !encounter.form;
            };
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), {
                key: encounter.id
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableExpandRow, getRowProps({
                row: row
            }), row.cells.map(function(cell) {
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableCell, {
                    key: cell.id
                }, cell.value);
            }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableCell, {
                className: "cds--table-column-menu"
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.Layer, {
                className: _encounters_table_scss__WEBPACK_IMPORTED_MODULE_7__["default"].layer
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.OverflowMenu, {
                align: "left",
                "aria-label": t('encounterTableActionsMenu', 'Encounter table actions menu'),
                flipped: true,
                size: responsiveSize
            }, (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.userHasAccess)(encounter.editPrivilege, session === null || session === void 0 ? void 0 : session.user) && (((_encounter_form = encounter.form) === null || _encounter_form === void 0 ? void 0 : _encounter_form.uuid) || isVisitNoteEncounter(encounter)) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.OverflowMenuItem, {
                className: _encounters_table_scss__WEBPACK_IMPORTED_MODULE_7__["default"].menuItem,
                itemText: t('editThisEncounter', 'Edit this encounter'),
                size: responsiveSize,
                onClick: function() {
                    if (isVisitNoteEncounter(encounter)) {
                        (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.launchWorkspace)('visit-notes-form-workspace', {
                            encounter: encounter,
                            formContext: 'editing',
                            patientUuid: patientUuid
                        });
                    } else {
                        (0,_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_4__.launchFormEntryOrHtmlForms)(htmlFormEntryForms, patientUuid, encounter.form, encounter.visitUuid, encounter.id, encounter.visitTypeUuid, encounter.visitStartDatetime, encounter.visitStopDatetime);
                    }
                }
            }), (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.userHasAccess)(encounter.editPrivilege, session === null || session === void 0 ? void 0 : session.user) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.OverflowMenuItem, {
                className: _encounters_table_scss__WEBPACK_IMPORTED_MODULE_7__["default"].menuItem,
                hasDivider: true,
                isDelete: true,
                itemText: t('deleteThisEncounter', 'Delete this encounter'),
                onClick: function() {
                    var _encounter_form;
                    return handleDeleteEncounter(encounter.id, (_encounter_form = encounter.form) === null || _encounter_form === void 0 ? void 0 : _encounter_form.display);
                },
                size: responsiveSize
            }))))), row.isExpanded ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableExpandedRow, {
                className: _encounters_table_scss__WEBPACK_IMPORTED_MODULE_7__["default"].expandedRow,
                colSpan: headers.length + 2
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_encounter_observations__WEBPACK_IMPORTED_MODULE_6__["default"], {
                observations: encounter.obs
            }), (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.userHasAccess)(encounter.editPrivilege, session === null || session === void 0 ? void 0 : session.user) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, (((_encounter_form1 = encounter.form) === null || _encounter_form1 === void 0 ? void 0 : _encounter_form1.uuid) || isVisitNoteEncounter(encounter)) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.Button, {
                kind: "ghost",
                onClick: function() {
                    if (isVisitNoteEncounter(encounter)) {
                        (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.launchWorkspace)('visit-notes-form-workspace', {
                            encounter: encounter,
                            formContext: 'editing',
                            patientUuid: patientUuid
                        });
                    } else {
                        (0,_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_4__.launchFormEntryOrHtmlForms)(htmlFormEntryForms, patientUuid, encounter.form, encounter.visitUuid, encounter.id, encounter.visitTypeUuid, encounter.visitStartDatetime, encounter.visitStopDatetime);
                    }
                },
                renderIcon: function(props) {
                    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.EditIcon, _object_spread({
                        size: 16
                    }, props));
                }
            }, t('editThisEncounter', 'Edit this encounter')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.Button, {
                kind: "danger--ghost",
                onClick: function() {
                    var _encounter_form;
                    return handleDeleteEncounter(encounter.id, (_encounter_form = encounter.form) === null || _encounter_form === void 0 ? void 0 : _encounter_form.display);
                },
                renderIcon: function(props) {
                    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.TrashCanIcon, _object_spread({
                        size: 16
                    }, props));
                }
            }, t('deleteThisEncounter', 'Delete this encounter'))))) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TableExpandedRow, {
                className: _encounters_table_scss__WEBPACK_IMPORTED_MODULE_7__["default"].hiddenRow,
                colSpan: headers.length + 2
            }));
        }))), (rows === null || rows === void 0 ? void 0 : rows.length) === 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
            className: _encounters_table_scss__WEBPACK_IMPORTED_MODULE_7__["default"].tileContainer
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.Tile, {
            className: _encounters_table_scss__WEBPACK_IMPORTED_MODULE_7__["default"].tile
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
            className: _encounters_table_scss__WEBPACK_IMPORTED_MODULE_7__["default"].tileContent
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
            className: _encounters_table_scss__WEBPACK_IMPORTED_MODULE_7__["default"].content
        }, t('noEncountersToDisplay', 'No encounters to display')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
            className: _encounters_table_scss__WEBPACK_IMPORTED_MODULE_7__["default"].helper
        }, t('checkFilters', 'Check the filters above')))))));
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.Pagination, {
        forwardText: t('nextPage', 'Next page'),
        backwardText: t('previousPage', 'Previous page'),
        page: currentPage,
        pageSize: pageSize,
        pageSizes: pageSizes,
        totalItems: totalCount,
        onChange: function(param) {
            var newPageSize = param.pageSize, page = param.page;
            if (newPageSize !== pageSize) {
                setPageSize(newPageSize);
            }
            if (page !== currentPage) {
                goTo(page);
            }
        }
    }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EncountersTable);


/***/ }),

/***/ "./src/visit/visits-widget/past-visits-components/encounters-table/encounters-table.resource.ts":
/*!******************************************************************************************************!*\
  !*** ./src/visit/visits-widget/past-visits-components/encounters-table/encounters-table.resource.ts ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deleteEncounter: () => (/* binding */ deleteEncounter),
/* harmony export */   mapEncounter: () => (/* binding */ mapEncounter),
/* harmony export */   useEncounterTypes: () => (/* binding */ useEncounterTypes),
/* harmony export */   usePaginatedEncounters: () => (/* binding */ usePaginatedEncounters)
/* harmony export */ });
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__);
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}

function deleteEncounter(encounterUuid, abortController) {
    return (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.openmrsFetch)("".concat(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.restBaseUrl, "/encounter/").concat(encounterUuid), {
        method: 'DELETE',
        signal: abortController.signal
    });
}
function usePaginatedEncounters(patientUuid, encounterType, pageSize) {
    var customRep = "custom:(uuid,display,diagnoses:(uuid,display,rank,diagnosis,certainty,voided),encounterDatetime,form:(uuid,display,name,description,encounterType,version,resources:(uuid,display,name,valueReference)),encounterType,visit,patient,obs:(uuid,concept:(uuid,display,conceptClass:(uuid,display)),display,groupMembers:(uuid,concept:(uuid,display),value:(uuid,display),display),value,obsDatetime),encounterProviders:(provider:(person)))";
    var url = new URL((0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.makeUrl)("".concat(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.restBaseUrl, "/encounter")), window.location.toString());
    url.searchParams.set('patient', patientUuid);
    url.searchParams.set('v', customRep);
    url.searchParams.set('order', 'desc');
    encounterType && url.searchParams.set('encounterType', encounterType);
    return (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.useOpenmrsPagination)(patientUuid ? url : null, pageSize);
}
function useEncounterTypes() {
    return (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.useOpenmrsFetchAll)("".concat(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.restBaseUrl, "/encountertype"), {
        immutable: true
    });
}
function mapEncounter(encounter) {
    var _encounter_diagnoses, _encounter_encounterType, _encounter_encounterType_editPrivilege, _encounter_encounterType1, _encounter_form, _encounter_encounterProviders, _encounter_encounterProviders__provider_person, _encounter_encounterProviders__provider, _encounter_visit, _encounter_visit1, _encounter_visit_visitType, _encounter_visit2, _encounter_visit_visitType1, _encounter_visit3, _encounter_visit4;
    var _encounter_form_display;
    return {
        id: encounter.uuid,
        datetime: (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.formatDatetime)((0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.parseDate)(encounter.encounterDatetime), {
            noToday: true
        }),
        diagnoses: ((_encounter_diagnoses = encounter.diagnoses) === null || _encounter_diagnoses === void 0 ? void 0 : _encounter_diagnoses.filter(function(diagnosis) {
            return !diagnosis.voided;
        }).map(function(diagnosis) {
            return _object_spread_props(_object_spread({}, diagnosis), {
                certainty: diagnosis.certainty || 'PROVISIONAL'
            });
        })) || [],
        encounterType: (_encounter_encounterType = encounter.encounterType) === null || _encounter_encounterType === void 0 ? void 0 : _encounter_encounterType.display,
        editPrivilege: (_encounter_encounterType1 = encounter.encounterType) === null || _encounter_encounterType1 === void 0 ? void 0 : (_encounter_encounterType_editPrivilege = _encounter_encounterType1.editPrivilege) === null || _encounter_encounterType_editPrivilege === void 0 ? void 0 : _encounter_encounterType_editPrivilege.display,
        form: encounter.form,
        formName: (_encounter_form_display = (_encounter_form = encounter.form) === null || _encounter_form === void 0 ? void 0 : _encounter_form.display) !== null && _encounter_form_display !== void 0 ? _encounter_form_display : '--',
        obs: encounter.obs,
        provider: ((_encounter_encounterProviders = encounter.encounterProviders) === null || _encounter_encounterProviders === void 0 ? void 0 : _encounter_encounterProviders.length) > 0 ? (_encounter_encounterProviders__provider = encounter.encounterProviders[0].provider) === null || _encounter_encounterProviders__provider === void 0 ? void 0 : (_encounter_encounterProviders__provider_person = _encounter_encounterProviders__provider.person) === null || _encounter_encounterProviders__provider_person === void 0 ? void 0 : _encounter_encounterProviders__provider_person.display : '--',
        visitStartDatetime: (_encounter_visit = encounter.visit) === null || _encounter_visit === void 0 ? void 0 : _encounter_visit.startDatetime,
        visitStopDatetime: (_encounter_visit1 = encounter.visit) === null || _encounter_visit1 === void 0 ? void 0 : _encounter_visit1.stopDatetime,
        visitType: (_encounter_visit2 = encounter.visit) === null || _encounter_visit2 === void 0 ? void 0 : (_encounter_visit_visitType = _encounter_visit2.visitType) === null || _encounter_visit_visitType === void 0 ? void 0 : _encounter_visit_visitType.display,
        visitTypeUuid: (_encounter_visit3 = encounter.visit) === null || _encounter_visit3 === void 0 ? void 0 : (_encounter_visit_visitType1 = _encounter_visit3.visitType) === null || _encounter_visit_visitType1 === void 0 ? void 0 : _encounter_visit_visitType1.uuid,
        visitUuid: (_encounter_visit4 = encounter.visit) === null || _encounter_visit4 === void 0 ? void 0 : _encounter_visit4.uuid
    };
}


/***/ }),

/***/ "./src/visit/visits-widget/past-visits-components/encounters-table/visit-encounters-table.component.tsx":
/*!**************************************************************************************************************!*\
  !*** ./src/visit/visits-widget/past-visits-components/encounters-table/visit-encounters-table.component.tsx ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _encounters_table_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./encounters-table.component */ "./src/visit/visits-widget/past-visits-components/encounters-table/encounters-table.component.tsx");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__);
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}



/**
 * This component shows a table of encounters from a single visit of a patient
 */ var VisitEncountersTable = function(param) {
    var patientUuid = param.patientUuid, visit = param.visit;
    var _useState = _sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(10), 2), pageSize = _useState[0], setPageSize = _useState[1];
    var mappedEncounters = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function() {
        return visit.encounters.map(function(encounter) {
            encounter.visit = visit;
            return encounter;
        });
    }, [
        visit
    ]);
    var _usePagination = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.usePagination)(mappedEncounters, pageSize), paginatedEncounters = _usePagination.results, currentPage = _usePagination.currentPage, goTo = _usePagination.goTo;
    var encountersTableProps = {
        patientUuid: patientUuid,
        totalCount: visit.encounters.length,
        currentPage: currentPage,
        goTo: goTo,
        isLoading: false,
        showVisitType: false,
        paginatedEncounters: paginatedEncounters,
        showEncounterTypeFilter: false,
        pageSize: pageSize,
        setPageSize: setPageSize
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_encounters_table_component__WEBPACK_IMPORTED_MODULE_1__["default"], encountersTableProps);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VisitEncountersTable);


/***/ }),

/***/ "./src/visit/visits-widget/past-visits-components/medications-summary.component.tsx":
/*!******************************************************************************************!*\
  !*** ./src/visit/visits-widget/past-visits-components/medications-summary.component.tsx ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_es_capitalize__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash-es/capitalize */ "../../node_modules/lodash-es/capitalize.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @openmrs/esm-patient-common-lib */ "webpack/sharing/consume/default/@openmrs/esm-patient-common-lib/@openmrs/esm-patient-common-lib");
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../visit-detail-overview.scss */ "./src/visit/visits-widget/visit-detail-overview.scss");






var MedicationSummary = function(param) {
    var medications = param.medications;
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)().t;
    var drugOrders = medications === null || medications === void 0 ? void 0 : medications.filter(function(medication) {
        var _medication_order_orderType, _medication_order;
        return (medication === null || medication === void 0 ? void 0 : (_medication_order = medication.order) === null || _medication_order === void 0 ? void 0 : (_medication_order_orderType = _medication_order.orderType) === null || _medication_order_orderType === void 0 ? void 0 : _medication_order_orderType.display) === 'Drug Order';
    });
    if (drugOrders.length === 0) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_2__.EmptyState, {
            displayText: t('medications__lower', 'medications'),
            headerTitle: t('medications', 'Medications')
        });
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_4__["default"].medicationRecord
    }, drugOrders.map(function(medication, index) {
        var _medication_order, _medication_order_drug, _medication_order1, _medication_order_drug1, _medication_order2, _medication_order_drug_strength, _medication_order_drug2, _medication_order3, _medication_order_doseUnits, _medication_order4, _medication_order_doseUnits_display, _medication_order_doseUnits1, _medication_order5, _medication_order6, _medication_order_doseUnits_display1, _medication_order_doseUnits2, _medication_order7, _medication_order_route, _medication_order8, _medication_order_route_display, _medication_order_route1, _medication_order9, _medication_order_frequency_display, _medication_order_frequency, _medication_order10, _medication_order11, _medication_order12, _medication_order_durationUnits_display, _medication_order_durationUnits, _medication_order13, _medication_order14, _medication_order15, _medication_order16, _medication_order_dosingInstructions, _medication_order17, _medication_order18, _medication_order19, _medication_order20, _medication_order21, _medication_order22, _medication_order23, _medication_order24, _medication_order25, _medication_order26, _medication_order27, _medication_provider, _medication_provider1, _medication_provider2, _medication_provider3;
        return (medication === null || medication === void 0 ? void 0 : (_medication_order = medication.order) === null || _medication_order === void 0 ? void 0 : _medication_order.dose) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), {
            key: index
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
            className: _visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_4__["default"].medicationContainer
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
            className: _visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_4__["default"].bodyLong01
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("strong", null, (0,lodash_es_capitalize__WEBPACK_IMPORTED_MODULE_5__["default"])(medication === null || medication === void 0 ? void 0 : (_medication_order1 = medication.order) === null || _medication_order1 === void 0 ? void 0 : (_medication_order_drug = _medication_order1.drug) === null || _medication_order_drug === void 0 ? void 0 : _medication_order_drug.display)), ' ', (medication === null || medication === void 0 ? void 0 : (_medication_order2 = medication.order) === null || _medication_order2 === void 0 ? void 0 : (_medication_order_drug1 = _medication_order2.drug) === null || _medication_order_drug1 === void 0 ? void 0 : _medication_order_drug1.strength) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, "— ", medication === null || medication === void 0 ? void 0 : (_medication_order3 = medication.order) === null || _medication_order3 === void 0 ? void 0 : (_medication_order_drug2 = _medication_order3.drug) === null || _medication_order_drug2 === void 0 ? void 0 : (_medication_order_drug_strength = _medication_order_drug2.strength) === null || _medication_order_drug_strength === void 0 ? void 0 : _medication_order_drug_strength.toLowerCase()), ' ', (medication === null || medication === void 0 ? void 0 : (_medication_order4 = medication.order) === null || _medication_order4 === void 0 ? void 0 : (_medication_order_doseUnits = _medication_order4.doseUnits) === null || _medication_order_doseUnits === void 0 ? void 0 : _medication_order_doseUnits.display) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, "— ", medication === null || medication === void 0 ? void 0 : (_medication_order5 = medication.order) === null || _medication_order5 === void 0 ? void 0 : (_medication_order_doseUnits1 = _medication_order5.doseUnits) === null || _medication_order_doseUnits1 === void 0 ? void 0 : (_medication_order_doseUnits_display = _medication_order_doseUnits1.display) === null || _medication_order_doseUnits_display === void 0 ? void 0 : _medication_order_doseUnits_display.toLowerCase()), ' '), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
            className: _visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_4__["default"].bodyLong01
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
            className: _visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_4__["default"].label01
        }, " ", t('dose', 'Dose').toUpperCase(), " "), ' ', /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
            className: _visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_4__["default"].dosage
        }, medication === null || medication === void 0 ? void 0 : (_medication_order6 = medication.order) === null || _medication_order6 === void 0 ? void 0 : _medication_order6.dose, " ", medication === null || medication === void 0 ? void 0 : (_medication_order7 = medication.order) === null || _medication_order7 === void 0 ? void 0 : (_medication_order_doseUnits2 = _medication_order7.doseUnits) === null || _medication_order_doseUnits2 === void 0 ? void 0 : (_medication_order_doseUnits_display1 = _medication_order_doseUnits2.display) === null || _medication_order_doseUnits_display1 === void 0 ? void 0 : _medication_order_doseUnits_display1.toLowerCase()), ' ', ((_medication_order8 = medication.order) === null || _medication_order8 === void 0 ? void 0 : (_medication_order_route = _medication_order8.route) === null || _medication_order_route === void 0 ? void 0 : _medication_order_route.display) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, "— ", medication === null || medication === void 0 ? void 0 : (_medication_order9 = medication.order) === null || _medication_order9 === void 0 ? void 0 : (_medication_order_route1 = _medication_order9.route) === null || _medication_order_route1 === void 0 ? void 0 : (_medication_order_route_display = _medication_order_route1.display) === null || _medication_order_route_display === void 0 ? void 0 : _medication_order_route_display.toLowerCase(), " — "), medication === null || medication === void 0 ? void 0 : (_medication_order10 = medication.order) === null || _medication_order10 === void 0 ? void 0 : (_medication_order_frequency = _medication_order10.frequency) === null || _medication_order_frequency === void 0 ? void 0 : (_medication_order_frequency_display = _medication_order_frequency.display) === null || _medication_order_frequency_display === void 0 ? void 0 : _medication_order_frequency_display.toLowerCase(), " —", ' ', !(medication === null || medication === void 0 ? void 0 : (_medication_order11 = medication.order) === null || _medication_order11 === void 0 ? void 0 : _medication_order11.duration) ? t('orderIndefiniteDuration', 'Indefinite duration') : t('orderDurationAndUnit', 'for {{duration}} {{durationUnit}}', {
            duration: medication === null || medication === void 0 ? void 0 : (_medication_order12 = medication.order) === null || _medication_order12 === void 0 ? void 0 : _medication_order12.duration,
            durationUnit: medication === null || medication === void 0 ? void 0 : (_medication_order13 = medication.order) === null || _medication_order13 === void 0 ? void 0 : (_medication_order_durationUnits = _medication_order13.durationUnits) === null || _medication_order_durationUnits === void 0 ? void 0 : (_medication_order_durationUnits_display = _medication_order_durationUnits.display) === null || _medication_order_durationUnits_display === void 0 ? void 0 : _medication_order_durationUnits_display.toLowerCase()
        }), (medication === null || medication === void 0 ? void 0 : (_medication_order14 = medication.order) === null || _medication_order14 === void 0 ? void 0 : _medication_order14.numRefills) !== 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
            className: _visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_4__["default"].label01
        }, " — ", t('refills', 'Refills').toUpperCase()), ' ', medication === null || medication === void 0 ? void 0 : (_medication_order15 = medication.order) === null || _medication_order15 === void 0 ? void 0 : _medication_order15.numRefills, ''), (medication === null || medication === void 0 ? void 0 : (_medication_order16 = medication.order) === null || _medication_order16 === void 0 ? void 0 : _medication_order16.dosingInstructions) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, " — ", medication === null || medication === void 0 ? void 0 : (_medication_order17 = medication.order) === null || _medication_order17 === void 0 ? void 0 : (_medication_order_dosingInstructions = _medication_order17.dosingInstructions) === null || _medication_order_dosingInstructions === void 0 ? void 0 : _medication_order_dosingInstructions.toLocaleLowerCase())), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
            className: _visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_4__["default"].bodyLong01
        }, (medication === null || medication === void 0 ? void 0 : (_medication_order18 = medication.order) === null || _medication_order18 === void 0 ? void 0 : _medication_order18.orderReasonNonCoded) ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
            className: _visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_4__["default"].label01
        }, t('indication', 'Indication').toUpperCase()), ' ', medication === null || medication === void 0 ? void 0 : (_medication_order19 = medication.order) === null || _medication_order19 === void 0 ? void 0 : _medication_order19.orderReasonNonCoded) : null, (medication === null || medication === void 0 ? void 0 : (_medication_order20 = medication.order) === null || _medication_order20 === void 0 ? void 0 : _medication_order20.orderReasonNonCoded) && (medication === null || medication === void 0 ? void 0 : (_medication_order21 = medication.order) === null || _medication_order21 === void 0 ? void 0 : _medication_order21.quantity) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, "—"), (medication === null || medication === void 0 ? void 0 : (_medication_order22 = medication.order) === null || _medication_order22 === void 0 ? void 0 : _medication_order22.quantity) ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
            className: _visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_4__["default"].label01
        }, " ", t('quantity', 'Quantity').toUpperCase()), ' ', medication === null || medication === void 0 ? void 0 : (_medication_order23 = medication.order) === null || _medication_order23 === void 0 ? void 0 : _medication_order23.quantity) : null, (medication === null || medication === void 0 ? void 0 : (_medication_order24 = medication.order) === null || _medication_order24 === void 0 ? void 0 : _medication_order24.dateStopped) ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
            className: _visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_4__["default"].bodyShort01
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
            className: _visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_4__["default"].label01
        }, (medication === null || medication === void 0 ? void 0 : (_medication_order25 = medication.order) === null || _medication_order25 === void 0 ? void 0 : _medication_order25.quantity) ? " — " : '', " ", t('endDate', 'End date').toUpperCase()), ' ', (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.formatDate)(new Date(medication === null || medication === void 0 ? void 0 : (_medication_order26 = medication.order) === null || _medication_order26 === void 0 ? void 0 : _medication_order26.dateStopped))) : null))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
            className: _visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_4__["default"].metadata
        }, (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.formatTime)((0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.parseDate)(medication === null || medication === void 0 ? void 0 : (_medication_order27 = medication.order) === null || _medication_order27 === void 0 ? void 0 : _medication_order27.dateActivated)), (medication === null || medication === void 0 ? void 0 : (_medication_provider = medication.provider) === null || _medication_provider === void 0 ? void 0 : _medication_provider.name) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, " \xb7 ", medication === null || medication === void 0 ? void 0 : (_medication_provider1 = medication.provider) === null || _medication_provider1 === void 0 ? void 0 : _medication_provider1.name), (medication === null || medication === void 0 ? void 0 : (_medication_provider2 = medication.provider) === null || _medication_provider2 === void 0 ? void 0 : _medication_provider2.role) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, ", ", medication === null || medication === void 0 ? void 0 : (_medication_provider3 = medication.provider) === null || _medication_provider3 === void 0 ? void 0 : _medication_provider3.role)));
    }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MedicationSummary);


/***/ }),

/***/ "./src/visit/visits-widget/past-visits-components/notes-summary.component.tsx":
/*!************************************************************************************!*\
  !*** ./src/visit/visits-widget/past-visits-components/notes-summary.component.tsx ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "../../node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @openmrs/esm-patient-common-lib */ "webpack/sharing/consume/default/@openmrs/esm-patient-common-lib/@openmrs/esm-patient-common-lib");
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../visit-detail-overview.scss */ "./src/visit/visits-widget/visit-detail-overview.scss");





var NotesSummary = function(param) {
    var notes = param.notes;
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)().t;
    if (notes.length === 0) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_3__.EmptyState, {
            displayText: t('notes__lower', 'notes'),
            headerTitle: t('notes', 'Notes')
        });
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, notes.map(function(note, index) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
            className: _visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_4__["default"].notesContainer,
            key: index
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
            className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(_visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_4__["default"].noteText, _visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_4__["default"].bodyLong01)
        }, note.note), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
            className: _visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_4__["default"].metadata
        }, note.time, " ", note.provider.name ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, "\xb7 ", note.provider.name, " ") : null, note.provider.role ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, "\xb7 ", note.provider.role) : null));
    }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NotesSummary);


/***/ }),

/***/ "./src/visit/visits-widget/past-visits-components/tests-summary.component.tsx":
/*!************************************************************************************!*\
  !*** ./src/visit/visits-widget/past-visits-components/tests-summary.component.tsx ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__);
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}


var TestsSummary = function(param) {
    var patientUuid = param.patientUuid, encounters = param.encounters;
    var filter = react__WEBPACK_IMPORTED_MODULE_0___default().useMemo(function() {
        var encounterIds = encounters.map(function(e) {
            return "Encounter/".concat(e.uuid);
        });
        return function(param) {
            var _param = _sliced_to_array(param, 1), entry = _param[0];
            var _entry_encounter;
            return encounterIds.includes((_entry_encounter = entry.encounter) === null || _entry_encounter === void 0 ? void 0 : _entry_encounter.reference);
        };
    }, [
        encounters
    ]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.ExtensionSlot, {
        name: "test-results-filtered-overview-slot",
        state: {
            filter: filter,
            patientUuid: patientUuid
        }
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TestsSummary);


/***/ }),

/***/ "./src/visit/visits-widget/past-visits-components/visit-summary.component.tsx":
/*!************************************************************************************!*\
  !*** ./src/visit/visits-widget/past-visits-components/visit-summary.component.tsx ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @carbon/react */ "webpack/sharing/consume/default/@carbon/react/@carbon/react");
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_carbon_react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! classnames */ "../../node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _medications_summary_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./medications-summary.component */ "./src/visit/visits-widget/past-visits-components/medications-summary.component.tsx");
/* harmony import */ var _notes_summary_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./notes-summary.component */ "./src/visit/visits-widget/past-visits-components/notes-summary.component.tsx");
/* harmony import */ var _tests_summary_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./tests-summary.component */ "./src/visit/visits-widget/past-visits-components/tests-summary.component.tsx");
/* harmony import */ var _visit_summary_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./visit-summary.scss */ "./src/visit/visits-widget/past-visits-components/visit-summary.scss");
/* harmony import */ var _encounters_table_visit_encounters_table_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./encounters-table/visit-encounters-table.component */ "./src/visit/visits-widget/past-visits-components/encounters-table/visit-encounters-table.component.tsx");
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}










var visitSummaryPanelSlot = 'visit-summary-panels';
var VisitSummary = function(param) {
    var visit = param.visit, patientUuid = param.patientUuid;
    var config = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.useConfig)();
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)().t;
    var extensions = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.useAssignedExtensions)(visitSummaryPanelSlot);
    var layout = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.useLayoutType)();
    var _useMemo = _sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function() {
        var _visit_encounters;
        // Medication Tab
        var medications = [];
        // Diagnoses in a Visit
        var diagnoses = [];
        // Notes Tab
        var notes = [];
        visit === null || visit === void 0 ? void 0 : (_visit_encounters = visit.encounters) === null || _visit_encounters === void 0 ? void 0 : _visit_encounters.forEach(function(enc) {
            if (enc.hasOwnProperty('orders')) {
                var _medications;
                (_medications = medications).push.apply(_medications, _to_consumable_array(enc.orders.map(function(order) {
                    return {
                        order: order,
                        provider: {
                            name: enc.encounterProviders.length ? enc.encounterProviders[0].provider.person.display : '',
                            role: enc.encounterProviders.length ? enc.encounterProviders[0].encounterRole.display : ''
                        }
                    };
                })));
            }
            // Check if there is a diagnosis associated with this encounter
            if (enc.hasOwnProperty('diagnoses')) {
                if (enc.diagnoses.length > 0) {
                    var _diagnoses;
                    var validDiagnoses = enc.diagnoses.filter(function(diagnosis) {
                        return !diagnosis.voided;
                    });
                    (_diagnoses = diagnoses).push.apply(_diagnoses, _to_consumable_array(validDiagnoses));
                }
            }
            // Check for Visit Diagnoses and Notes
            if (enc.hasOwnProperty('obs')) {
                enc.obs.forEach(function(obs) {
                    var _config_notesConceptUuids;
                    if ((_config_notesConceptUuids = config.notesConceptUuids) === null || _config_notesConceptUuids === void 0 ? void 0 : _config_notesConceptUuids.includes(obs.concept.uuid)) {
                        // Putting all notes in a single array.
                        notes.push({
                            note: obs.value,
                            provider: {
                                name: enc.encounterProviders.length ? enc.encounterProviders[0].provider.person.display : '',
                                role: enc.encounterProviders.length ? enc.encounterProviders[0].encounterRole.display : ''
                            },
                            time: enc.encounterDatetime ? (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.formatTime)((0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.parseDate)(enc.encounterDatetime)) : '',
                            concept: obs.concept
                        });
                    }
                });
            }
        });
        // Sort the diagnoses by rank, so that primary diagnoses come first
        diagnoses.sort(function(a, b) {
            return a.rank - b.rank;
        });
        return [
            diagnoses,
            notes,
            medications
        ];
    }, [
        config.notesConceptUuids,
        visit === null || visit === void 0 ? void 0 : visit.encounters
    ]), 3), diagnoses = _useMemo[0], notes = _useMemo[1], medications = _useMemo[2];
    var testsFilter = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function() {
        var _visit_encounters;
        var encounterIds = visit === null || visit === void 0 ? void 0 : (_visit_encounters = visit.encounters) === null || _visit_encounters === void 0 ? void 0 : _visit_encounters.map(function(e) {
            return "Encounter/".concat(e.uuid);
        });
        return function(param) {
            var _param = _sliced_to_array(param, 1), entry = _param[0];
            var _entry_encounter;
            return encounterIds.includes((_entry_encounter = entry.encounter) === null || _entry_encounter === void 0 ? void 0 : _entry_encounter.reference);
        };
    }, [
        visit === null || visit === void 0 ? void 0 : visit.encounters
    ]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _visit_summary_scss__WEBPACK_IMPORTED_MODULE_8__["default"].summaryContainer
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
        className: _visit_summary_scss__WEBPACK_IMPORTED_MODULE_8__["default"].diagnosisLabel
    }, t('diagnoses', 'Diagnoses')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _visit_summary_scss__WEBPACK_IMPORTED_MODULE_8__["default"].diagnosesList
    }, diagnoses.length > 0 ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.DiagnosisTags, {
        diagnoses: diagnoses
    }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
        className: classnames__WEBPACK_IMPORTED_MODULE_4___default()(_visit_summary_scss__WEBPACK_IMPORTED_MODULE_8__["default"].bodyLong01, _visit_summary_scss__WEBPACK_IMPORTED_MODULE_8__["default"].text02),
        style: {
            marginBottom: '0.5rem'
        }
    }, t('noDiagnosesFound', 'No diagnoses found'))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.Tabs, {
        className: classnames__WEBPACK_IMPORTED_MODULE_4___default()(_visit_summary_scss__WEBPACK_IMPORTED_MODULE_8__["default"].verticalTabs, layout === 'tablet' ? _visit_summary_scss__WEBPACK_IMPORTED_MODULE_8__["default"].tabletTabs : _visit_summary_scss__WEBPACK_IMPORTED_MODULE_8__["default"].desktopTabs)
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TabList, {
        "aria-label": "Visit summary tabs",
        className: _visit_summary_scss__WEBPACK_IMPORTED_MODULE_8__["default"].tablist
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.Tab, {
        className: classnames__WEBPACK_IMPORTED_MODULE_4___default()(_visit_summary_scss__WEBPACK_IMPORTED_MODULE_8__["default"].tab, _visit_summary_scss__WEBPACK_IMPORTED_MODULE_8__["default"].bodyLong01),
        id: "notes-tab",
        disabled: notes.length <= 0 && config.disableEmptyTabs
    }, t('notes', 'Notes')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.Tab, {
        className: _visit_summary_scss__WEBPACK_IMPORTED_MODULE_8__["default"].tab,
        id: "tests-tab",
        disabled: testsFilter.length <= 0 && config.disableEmptyTabs
    }, t('tests', 'Tests')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.Tab, {
        className: _visit_summary_scss__WEBPACK_IMPORTED_MODULE_8__["default"].tab,
        id: "medications-tab",
        disabled: medications.length <= 0 && config.disableEmptyTabs
    }, t('medications', 'Medications')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.Tab, {
        className: _visit_summary_scss__WEBPACK_IMPORTED_MODULE_8__["default"].tab,
        id: "encounters-tab",
        disabled: (visit === null || visit === void 0 ? void 0 : visit.encounters.length) <= 0 && config.disableEmptyTabs
    }, t('encounters_title', 'Encounters')), extensions === null || extensions === void 0 ? void 0 : extensions.map(function(extension, index) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.Tab, {
            key: index,
            className: _visit_summary_scss__WEBPACK_IMPORTED_MODULE_8__["default"].tab,
            id: "".concat(extension.meta.title || index, "-tab")
        }, t(extension.meta.title, {
            ns: extension.moduleName,
            defaultValue: extension.meta.title
        }));
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TabPanels, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TabPanel, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_notes_summary_component__WEBPACK_IMPORTED_MODULE_6__["default"], {
        notes: notes
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TabPanel, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_tests_summary_component__WEBPACK_IMPORTED_MODULE_7__["default"], {
        patientUuid: patientUuid,
        encounters: visit === null || visit === void 0 ? void 0 : visit.encounters
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TabPanel, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_medications_summary_component__WEBPACK_IMPORTED_MODULE_5__["default"], {
        medications: medications
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TabPanel, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_encounters_table_visit_encounters_table_component__WEBPACK_IMPORTED_MODULE_9__["default"], {
        visit: visit,
        patientUuid: patientUuid
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.ExtensionSlot, {
        name: visitSummaryPanelSlot
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.TabPanel, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.Extension, {
        state: {
            patientUuid: patientUuid,
            visit: visit
        }
    }))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VisitSummary);


/***/ }),

/***/ "./src/visit/visits-widget/visit-detail-overview.component.tsx":
/*!*********************************************************************!*\
  !*** ./src/visit/visits-widget/visit-detail-overview.component.tsx ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @carbon/react */ "webpack/sharing/consume/default/@carbon/react/@carbon/react");
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_carbon_react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _visit_history_table_visit_history_table_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../visit-history-table/visit-history-table.component */ "./src/visit/visit-history-table/visit-history-table.component.tsx");
/* harmony import */ var _past_visits_components_encounters_table_all_encounters_table_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./past-visits-components/encounters-table/all-encounters-table.component */ "./src/visit/visits-widget/past-visits-components/encounters-table/all-encounters-table.component.tsx");
/* harmony import */ var _visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./visit-detail-overview.scss */ "./src/visit/visits-widget/visit-detail-overview.scss");
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}







function VisitDetailOverviewComponent(param) {
    var patientUuid = param.patientUuid;
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)().t;
    var _useState = _sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0), 2), tabIndex = _useState[0], setTabIndex = _useState[1];
    var showAllEncountersTab = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.useConfig)().showAllEncountersTab;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_6__["default"].tabs
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.Tabs, {
        onChange: function(param) {
            var selectedIndex = param.selectedIndex;
            return setTabIndex(selectedIndex);
        },
        selectedIndex: tabIndex
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.TabList, {
        "aria-label": "Visit detail tabs",
        className: _visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_6__["default"].tabList
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.Tab, {
        className: _visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_6__["default"].tab,
        id: "visit-summaries-tab"
    }, t('Visits', 'Visits')), showAllEncountersTab ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.Tab, {
        className: _visit_detail_overview_scss__WEBPACK_IMPORTED_MODULE_6__["default"].tab,
        id: "all-encounters-tab"
    }, t('allEncounters', 'All encounters')) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.TabPanels, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.TabPanel, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_visit_history_table_visit_history_table_component__WEBPACK_IMPORTED_MODULE_4__["default"], {
        patientUuid: patientUuid
    })), showAllEncountersTab && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.TabPanel, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_past_visits_components_encounters_table_all_encounters_table_component__WEBPACK_IMPORTED_MODULE_5__["default"], {
        patientUuid: patientUuid
    })))));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VisitDetailOverviewComponent);


/***/ }),

/***/ "./src/visit/visits-widget/visit.resource.tsx":
/*!****************************************************!*\
  !*** ./src/visit/visits-widget/visit.resource.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deleteVisit: () => (/* binding */ deleteVisit),
/* harmony export */   restoreVisit: () => (/* binding */ restoreVisit),
/* harmony export */   useInfiniteVisits: () => (/* binding */ useInfiniteVisits),
/* harmony export */   usePaginatedVisits: () => (/* binding */ usePaginatedVisits)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__);
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = _object_without_properties_loose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}


var customRepresentation = 'custom:(uuid,location,encounters:(uuid,diagnoses:(uuid,display,rank,diagnosis,voided),form:(uuid,display,name,description,encounterType,version,resources:(uuid,display,name,valueReference)),encounterDatetime,orders:full,obs:(uuid,concept:(uuid,display,conceptClass:(uuid,display)),display,groupMembers:(uuid,concept:(uuid,display),value:(uuid,display),display),value,obsDatetime),encounterType:(uuid,display,viewPrivilege,editPrivilege),encounterProviders:(uuid,display,encounterRole:(uuid,display),provider:(uuid,person:(uuid,display)))),visitType:(uuid,name,display),startDatetime,stopDatetime,patient,attributes:(attributeType:ref,display,uuid,value)';
function useInfiniteVisits(patientUuid) {
    var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, rep = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : customRepresentation;
    var url = new URL("".concat(window.openmrsBase, "/").concat(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.restBaseUrl, "/visit?patient=").concat(patientUuid, "&v=").concat(rep), window.location.toString());
    for(var key in params){
        url.searchParams.set(key, '' + params[key]);
    }
    var _useOpenmrsInfinite = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.useOpenmrsInfinite)(patientUuid ? url : null), data = _useOpenmrsInfinite.data, mutate = _useOpenmrsInfinite.mutate, rest = _object_without_properties(_useOpenmrsInfinite, [
        "data",
        "mutate"
    ]);
    var mutateVisit = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function() {
        return mutate();
    }, [
        mutate
    ]);
    (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.useVisitContextStore)(mutateVisit);
    return _object_spread({
        visits: data,
        mutate: mutate
    }, rest);
}
function usePaginatedVisits(patientUuid, pageSize) {
    var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var url = new URL("".concat(window.openmrsBase, "/").concat(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.restBaseUrl, "/visit?patient=").concat(patientUuid, "&v=").concat(customRepresentation), window.location.toString());
    for(var key in params){
        url.searchParams.set(key, '' + params[key]);
    }
    var ret = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.useOpenmrsPagination)(url, pageSize);
    var mutate = ret.mutate;
    var mutateVisit = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function() {
        return mutate();
    }, [
        mutate
    ]);
    (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.useVisitContextStore)(mutateVisit);
    return ret;
}
function deleteVisit(visitUuid) {
    return (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.openmrsFetch)("".concat(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.restBaseUrl, "/visit/").concat(visitUuid), {
        method: 'DELETE'
    });
}
function restoreVisit(visitUuid) {
    return (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.openmrsFetch)("".concat(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.restBaseUrl, "/visit/").concat(visitUuid), {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: {
            voided: false
        }
    });
}


/***/ }),

/***/ "../../node_modules/openmrs/node_modules/webpack-dev-server/client/clients/WebSocketClient.js":
/*!****************************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/webpack-dev-server/client/clients/WebSocketClient.js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WebSocketClient)
/* harmony export */ });
/* harmony import */ var _utils_log_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/log.js */ "../../node_modules/openmrs/node_modules/webpack-dev-server/client/utils/log.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var WebSocketClient = /*#__PURE__*/function () {
  /**
   * @param {string} url
   */
  function WebSocketClient(url) {
    _classCallCheck(this, WebSocketClient);
    this.client = new WebSocket(url);
    this.client.onerror = function (error) {
      _utils_log_js__WEBPACK_IMPORTED_MODULE_0__.log.error(error);
    };
  }

  /**
   * @param {(...args: any[]) => void} f
   */
  return _createClass(WebSocketClient, [{
    key: "onOpen",
    value: function onOpen(f) {
      this.client.onopen = f;
    }

    /**
     * @param {(...args: any[]) => void} f
     */
  }, {
    key: "onClose",
    value: function onClose(f) {
      this.client.onclose = f;
    }

    // call f with the message string as the first argument
    /**
     * @param {(...args: any[]) => void} f
     */
  }, {
    key: "onMessage",
    value: function onMessage(f) {
      this.client.onmessage = function (e) {
        f(e.data);
      };
    }
  }]);
}();


/***/ }),

/***/ "../../node_modules/openmrs/node_modules/webpack-dev-server/client/index.js?protocol=ws%3A&hostname=0.0.0.0&port=7001&pathname=%2Fws&logging=info&overlay=true&reconnect=10&hot=true&live-reload=true":
/*!************************************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/webpack-dev-server/client/index.js?protocol=ws%3A&hostname=0.0.0.0&port=7001&pathname=%2Fws&logging=info&overlay=true&reconnect=10&hot=true&live-reload=true ***!
  \************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
var __resourceQuery = "?protocol=ws%3A&hostname=0.0.0.0&port=7001&pathname=%2Fws&logging=info&overlay=true&reconnect=10&hot=true&live-reload=true";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSocketURL: () => (/* binding */ createSocketURL),
/* harmony export */   getCurrentScriptSource: () => (/* binding */ getCurrentScriptSource),
/* harmony export */   parseURL: () => (/* binding */ parseURL)
/* harmony export */ });
/* harmony import */ var webpack_hot_log_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webpack/hot/log.js */ "../../node_modules/openmrs/node_modules/webpack/hot/log.js");
/* harmony import */ var webpack_hot_log_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webpack_hot_log_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var webpack_hot_emitter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! webpack/hot/emitter.js */ "../../node_modules/openmrs/node_modules/webpack/hot/emitter.js");
/* harmony import */ var webpack_hot_emitter_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(webpack_hot_emitter_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _socket_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./socket.js */ "../../node_modules/openmrs/node_modules/webpack-dev-server/client/socket.js");
/* harmony import */ var _overlay_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./overlay.js */ "../../node_modules/openmrs/node_modules/webpack-dev-server/client/overlay.js");
/* harmony import */ var _utils_log_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/log.js */ "../../node_modules/openmrs/node_modules/webpack-dev-server/client/utils/log.js");
/* harmony import */ var _utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/sendMessage.js */ "../../node_modules/openmrs/node_modules/webpack-dev-server/client/utils/sendMessage.js");
/* harmony import */ var _progress_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./progress.js */ "../../node_modules/openmrs/node_modules/webpack-dev-server/client/progress.js");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/* global __resourceQuery, __webpack_hash__ */
/// <reference types="webpack/module" />








/**
 * @typedef {Object} OverlayOptions
 * @property {boolean | (error: Error) => boolean} [warnings]
 * @property {boolean | (error: Error) => boolean} [errors]
 * @property {boolean | (error: Error) => boolean} [runtimeErrors]
 * @property {string} [trustedTypesPolicyName]
 */

/**
 * @typedef {Object} Options
 * @property {boolean} hot
 * @property {boolean} liveReload
 * @property {boolean} progress
 * @property {boolean | OverlayOptions} overlay
 * @property {string} [logging]
 * @property {number} [reconnect]
 */

/**
 * @typedef {Object} Status
 * @property {boolean} isUnloading
 * @property {string} currentHash
 * @property {string} [previousHash]
 */

/**
 * @param {boolean | { warnings?: boolean | string; errors?: boolean | string; runtimeErrors?: boolean | string; }} overlayOptions
 */
var decodeOverlayOptions = function decodeOverlayOptions(overlayOptions) {
  if (_typeof(overlayOptions) === "object") {
    ["warnings", "errors", "runtimeErrors"].forEach(function (property) {
      if (typeof overlayOptions[property] === "string") {
        var overlayFilterFunctionString = decodeURIComponent(overlayOptions[property]);

        // eslint-disable-next-line no-new-func
        overlayOptions[property] = new Function("message", "var callback = ".concat(overlayFilterFunctionString, "\n        return callback(message)"));
      }
    });
  }
};

/**
 * @type {Status}
 */
var status = {
  isUnloading: false,
  // eslint-disable-next-line camelcase
  currentHash: __webpack_require__.h()
};

/**
 * @returns {string}
 */
var getCurrentScriptSource = function getCurrentScriptSource() {
  // `document.currentScript` is the most accurate way to find the current script,
  // but is not supported in all browsers.
  if (document.currentScript) {
    return document.currentScript.getAttribute("src");
  }

  // Fallback to getting all scripts running in the document.
  var scriptElements = document.scripts || [];
  var scriptElementsWithSrc = Array.prototype.filter.call(scriptElements, function (element) {
    return element.getAttribute("src");
  });
  if (scriptElementsWithSrc.length > 0) {
    var currentScript = scriptElementsWithSrc[scriptElementsWithSrc.length - 1];
    return currentScript.getAttribute("src");
  }

  // Fail as there was no script to use.
  throw new Error("[webpack-dev-server] Failed to get current script source.");
};

/**
 * @param {string} resourceQuery
 * @returns {{ [key: string]: string | boolean }}
 */
var parseURL = function parseURL(resourceQuery) {
  /** @type {{ [key: string]: string }} */
  var result = {};
  if (typeof resourceQuery === "string" && resourceQuery !== "") {
    var searchParams = resourceQuery.slice(1).split("&");
    for (var i = 0; i < searchParams.length; i++) {
      var pair = searchParams[i].split("=");
      result[pair[0]] = decodeURIComponent(pair[1]);
    }
  } else {
    // Else, get the url from the <script> this file was called with.
    var scriptSource = getCurrentScriptSource();
    var scriptSourceURL;
    try {
      // The placeholder `baseURL` with `window.location.href`,
      // is to allow parsing of path-relative or protocol-relative URLs,
      // and will have no effect if `scriptSource` is a fully valid URL.
      scriptSourceURL = new URL(scriptSource, self.location.href);
    } catch (error) {
      // URL parsing failed, do nothing.
      // We will still proceed to see if we can recover using `resourceQuery`
    }
    if (scriptSourceURL) {
      result = scriptSourceURL;
      result.fromCurrentScript = true;
    }
  }
  return result;
};
var parsedResourceQuery = parseURL(__resourceQuery);
var enabledFeatures = {
  "Hot Module Replacement": false,
  "Live Reloading": false,
  Progress: false,
  Overlay: false
};

/** @type {Options} */
var options = {
  hot: false,
  liveReload: false,
  progress: false,
  overlay: false
};
if (parsedResourceQuery.hot === "true") {
  options.hot = true;
  enabledFeatures["Hot Module Replacement"] = true;
}
if (parsedResourceQuery["live-reload"] === "true") {
  options.liveReload = true;
  enabledFeatures["Live Reloading"] = true;
}
if (parsedResourceQuery.progress === "true") {
  options.progress = true;
  enabledFeatures.Progress = true;
}
if (parsedResourceQuery.overlay) {
  try {
    options.overlay = JSON.parse(parsedResourceQuery.overlay);
  } catch (e) {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_4__.log.error("Error parsing overlay options from resource query:", e);
  }

  // Fill in default "true" params for partially-specified objects.
  if (_typeof(options.overlay) === "object") {
    options.overlay = _objectSpread({
      errors: true,
      warnings: true,
      runtimeErrors: true
    }, options.overlay);
    decodeOverlayOptions(options.overlay);
  }
  enabledFeatures.Overlay = options.overlay !== false;
}
if (parsedResourceQuery.logging) {
  options.logging = parsedResourceQuery.logging;
}
if (typeof parsedResourceQuery.reconnect !== "undefined") {
  options.reconnect = Number(parsedResourceQuery.reconnect);
}

/**
 * @param {string} level
 */
var setAllLogLevel = function setAllLogLevel(level) {
  // This is needed because the HMR logger operate separately from dev server logger
  webpack_hot_log_js__WEBPACK_IMPORTED_MODULE_0___default().setLogLevel(level === "verbose" || level === "log" ? "info" : level);
  (0,_utils_log_js__WEBPACK_IMPORTED_MODULE_4__.setLogLevel)(level);
};
if (options.logging) {
  setAllLogLevel(options.logging);
}
var logEnabledFeatures = function logEnabledFeatures(features) {
  var listEnabledFeatures = Object.keys(features);
  if (!features || listEnabledFeatures.length === 0) {
    return;
  }
  var logString = "Server started:";

  // Server started: Hot Module Replacement enabled, Live Reloading enabled, Overlay disabled.
  for (var i = 0; i < listEnabledFeatures.length; i++) {
    var key = listEnabledFeatures[i];
    logString += " ".concat(key, " ").concat(features[key] ? "enabled" : "disabled", ",");
  }
  // replace last comma with a period
  logString = logString.slice(0, -1).concat(".");
  _utils_log_js__WEBPACK_IMPORTED_MODULE_4__.log.info(logString);
};
logEnabledFeatures(enabledFeatures);
self.addEventListener("beforeunload", function () {
  status.isUnloading = true;
});
var overlay = typeof window !== "undefined" ? (0,_overlay_js__WEBPACK_IMPORTED_MODULE_3__.createOverlay)(_typeof(options.overlay) === "object" ? {
  trustedTypesPolicyName: options.overlay.trustedTypesPolicyName,
  catchRuntimeError: options.overlay.runtimeErrors
} : {
  trustedTypesPolicyName: false,
  catchRuntimeError: options.overlay
}) : {
  send: function send() {}
};

/**
 * @param {Options} options
 * @param {Status} currentStatus
 */
var reloadApp = function reloadApp(_ref, currentStatus) {
  var hot = _ref.hot,
    liveReload = _ref.liveReload;
  if (currentStatus.isUnloading) {
    return;
  }
  var currentHash = currentStatus.currentHash,
    previousHash = currentStatus.previousHash;
  var isInitial = currentHash.indexOf(/** @type {string} */previousHash) >= 0;
  if (isInitial) {
    return;
  }

  /**
   * @param {Window} rootWindow
   * @param {number} intervalId
   */
  function applyReload(rootWindow, intervalId) {
    clearInterval(intervalId);
    _utils_log_js__WEBPACK_IMPORTED_MODULE_4__.log.info("App updated. Reloading...");
    rootWindow.location.reload();
  }
  var search = self.location.search.toLowerCase();
  var allowToHot = search.indexOf("webpack-dev-server-hot=false") === -1;
  var allowToLiveReload = search.indexOf("webpack-dev-server-live-reload=false") === -1;
  if (hot && allowToHot) {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_4__.log.info("App hot update...");
    webpack_hot_emitter_js__WEBPACK_IMPORTED_MODULE_1___default().emit("webpackHotUpdate", currentStatus.currentHash);
    if (typeof self !== "undefined" && self.window) {
      // broadcast update to window
      self.postMessage("webpackHotUpdate".concat(currentStatus.currentHash), "*");
    }
  }
  // allow refreshing the page only if liveReload isn't disabled
  else if (liveReload && allowToLiveReload) {
    var rootWindow = self;

    // use parent window for reload (in case we're in an iframe with no valid src)
    var intervalId = self.setInterval(function () {
      if (rootWindow.location.protocol !== "about:") {
        // reload immediately if protocol is valid
        applyReload(rootWindow, intervalId);
      } else {
        rootWindow = rootWindow.parent;
        if (rootWindow.parent === rootWindow) {
          // if parent equals current window we've reached the root which would continue forever, so trigger a reload anyways
          applyReload(rootWindow, intervalId);
        }
      }
    });
  }
};
var ansiRegex = new RegExp(["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|"), "g");

/**
 *
 * Strip [ANSI escape codes](https://en.wikipedia.org/wiki/ANSI_escape_code) from a string.
 * Adapted from code originally released by Sindre Sorhus
 * Licensed the MIT License
 *
 * @param {string} string
 * @return {string}
 */
var stripAnsi = function stripAnsi(string) {
  if (typeof string !== "string") {
    throw new TypeError("Expected a `string`, got `".concat(_typeof(string), "`"));
  }
  return string.replace(ansiRegex, "");
};
var onSocketMessage = {
  hot: function hot() {
    if (parsedResourceQuery.hot === "false") {
      return;
    }
    options.hot = true;
  },
  liveReload: function liveReload() {
    if (parsedResourceQuery["live-reload"] === "false") {
      return;
    }
    options.liveReload = true;
  },
  invalid: function invalid() {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_4__.log.info("App updated. Recompiling...");

    // Fixes #1042. overlay doesn't clear if errors are fixed but warnings remain.
    if (options.overlay) {
      overlay.send({
        type: "DISMISS"
      });
    }
    (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_5__["default"])("Invalid");
  },
  /**
   * @param {string} hash
   */
  hash: function hash(_hash) {
    status.previousHash = status.currentHash;
    status.currentHash = _hash;
  },
  logging: setAllLogLevel,
  /**
   * @param {boolean} value
   */
  overlay: function overlay(value) {
    if (typeof document === "undefined") {
      return;
    }
    options.overlay = value;
    decodeOverlayOptions(options.overlay);
  },
  /**
   * @param {number} value
   */
  reconnect: function reconnect(value) {
    if (parsedResourceQuery.reconnect === "false") {
      return;
    }
    options.reconnect = value;
  },
  /**
   * @param {boolean} value
   */
  progress: function progress(value) {
    options.progress = value;
  },
  /**
   * @param {{ pluginName?: string, percent: number, msg: string }} data
   */
  "progress-update": function progressUpdate(data) {
    if (options.progress) {
      _utils_log_js__WEBPACK_IMPORTED_MODULE_4__.log.info("".concat(data.pluginName ? "[".concat(data.pluginName, "] ") : "").concat(data.percent, "% - ").concat(data.msg, "."));
    }
    if ((0,_progress_js__WEBPACK_IMPORTED_MODULE_6__.isProgressSupported)()) {
      if (typeof options.progress === "string") {
        var progress = document.querySelector("wds-progress");
        if (!progress) {
          (0,_progress_js__WEBPACK_IMPORTED_MODULE_6__.defineProgressElement)();
          progress = document.createElement("wds-progress");
          document.body.appendChild(progress);
        }
        progress.setAttribute("progress", data.percent);
        progress.setAttribute("type", options.progress);
      }
    }
    (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_5__["default"])("Progress", data);
  },
  "still-ok": function stillOk() {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_4__.log.info("Nothing changed.");
    if (options.overlay) {
      overlay.send({
        type: "DISMISS"
      });
    }
    (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_5__["default"])("StillOk");
  },
  ok: function ok() {
    (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_5__["default"])("Ok");
    if (options.overlay) {
      overlay.send({
        type: "DISMISS"
      });
    }
    reloadApp(options, status);
  },
  /**
   * @param {string} file
   */
  "static-changed": function staticChanged(file) {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_4__.log.info("".concat(file ? "\"".concat(file, "\"") : "Content", " from static directory was changed. Reloading..."));
    self.location.reload();
  },
  /**
   * @param {Error[]} warnings
   * @param {any} params
   */
  warnings: function warnings(_warnings, params) {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_4__.log.warn("Warnings while compiling.");
    var printableWarnings = _warnings.map(function (error) {
      var _formatProblem = (0,_overlay_js__WEBPACK_IMPORTED_MODULE_3__.formatProblem)("warning", error),
        header = _formatProblem.header,
        body = _formatProblem.body;
      return "".concat(header, "\n").concat(stripAnsi(body));
    });
    (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_5__["default"])("Warnings", printableWarnings);
    for (var i = 0; i < printableWarnings.length; i++) {
      _utils_log_js__WEBPACK_IMPORTED_MODULE_4__.log.warn(printableWarnings[i]);
    }
    var overlayWarningsSetting = typeof options.overlay === "boolean" ? options.overlay : options.overlay && options.overlay.warnings;
    if (overlayWarningsSetting) {
      var warningsToDisplay = typeof overlayWarningsSetting === "function" ? _warnings.filter(overlayWarningsSetting) : _warnings;
      if (warningsToDisplay.length) {
        overlay.send({
          type: "BUILD_ERROR",
          level: "warning",
          messages: _warnings
        });
      }
    }
    if (params && params.preventReloading) {
      return;
    }
    reloadApp(options, status);
  },
  /**
   * @param {Error[]} errors
   */
  errors: function errors(_errors) {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_4__.log.error("Errors while compiling. Reload prevented.");
    var printableErrors = _errors.map(function (error) {
      var _formatProblem2 = (0,_overlay_js__WEBPACK_IMPORTED_MODULE_3__.formatProblem)("error", error),
        header = _formatProblem2.header,
        body = _formatProblem2.body;
      return "".concat(header, "\n").concat(stripAnsi(body));
    });
    (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_5__["default"])("Errors", printableErrors);
    for (var i = 0; i < printableErrors.length; i++) {
      _utils_log_js__WEBPACK_IMPORTED_MODULE_4__.log.error(printableErrors[i]);
    }
    var overlayErrorsSettings = typeof options.overlay === "boolean" ? options.overlay : options.overlay && options.overlay.errors;
    if (overlayErrorsSettings) {
      var errorsToDisplay = typeof overlayErrorsSettings === "function" ? _errors.filter(overlayErrorsSettings) : _errors;
      if (errorsToDisplay.length) {
        overlay.send({
          type: "BUILD_ERROR",
          level: "error",
          messages: _errors
        });
      }
    }
  },
  /**
   * @param {Error} error
   */
  error: function error(_error) {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_4__.log.error(_error);
  },
  close: function close() {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_4__.log.info("Disconnected!");
    if (options.overlay) {
      overlay.send({
        type: "DISMISS"
      });
    }
    (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_5__["default"])("Close");
  }
};

/**
 * @param {{ protocol?: string, auth?: string, hostname?: string, port?: string, pathname?: string, search?: string, hash?: string, slashes?: boolean }} objURL
 * @returns {string}
 */
var formatURL = function formatURL(objURL) {
  var protocol = objURL.protocol || "";
  if (protocol && protocol.substr(-1) !== ":") {
    protocol += ":";
  }
  var auth = objURL.auth || "";
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ":");
    auth += "@";
  }
  var host = "";
  if (objURL.hostname) {
    host = auth + (objURL.hostname.indexOf(":") === -1 ? objURL.hostname : "[".concat(objURL.hostname, "]"));
    if (objURL.port) {
      host += ":".concat(objURL.port);
    }
  }
  var pathname = objURL.pathname || "";
  if (objURL.slashes) {
    host = "//".concat(host || "");
    if (pathname && pathname.charAt(0) !== "/") {
      pathname = "/".concat(pathname);
    }
  } else if (!host) {
    host = "";
  }
  var search = objURL.search || "";
  if (search && search.charAt(0) !== "?") {
    search = "?".concat(search);
  }
  var hash = objURL.hash || "";
  if (hash && hash.charAt(0) !== "#") {
    hash = "#".concat(hash);
  }
  pathname = pathname.replace(/[?#]/g,
  /**
   * @param {string} match
   * @returns {string}
   */
  function (match) {
    return encodeURIComponent(match);
  });
  search = search.replace("#", "%23");
  return "".concat(protocol).concat(host).concat(pathname).concat(search).concat(hash);
};

/**
 * @param {URL & { fromCurrentScript?: boolean }} parsedURL
 * @returns {string}
 */
var createSocketURL = function createSocketURL(parsedURL) {
  var hostname = parsedURL.hostname;

  // Node.js module parses it as `::`
  // `new URL(urlString, [baseURLString])` parses it as '[::]'
  var isInAddrAny = hostname === "0.0.0.0" || hostname === "::" || hostname === "[::]";

  // why do we need this check?
  // hostname n/a for file protocol (example, when using electron, ionic)
  // see: https://github.com/webpack/webpack-dev-server/pull/384
  if (isInAddrAny && self.location.hostname && self.location.protocol.indexOf("http") === 0) {
    hostname = self.location.hostname;
  }
  var socketURLProtocol = parsedURL.protocol || self.location.protocol;

  // When https is used in the app, secure web sockets are always necessary because the browser doesn't accept non-secure web sockets.
  if (socketURLProtocol === "auto:" || hostname && isInAddrAny && self.location.protocol === "https:") {
    socketURLProtocol = self.location.protocol;
  }
  socketURLProtocol = socketURLProtocol.replace(/^(?:http|.+-extension|file)/i, "ws");
  var socketURLAuth = "";

  // `new URL(urlString, [baseURLstring])` doesn't have `auth` property
  // Parse authentication credentials in case we need them
  if (parsedURL.username) {
    socketURLAuth = parsedURL.username;

    // Since HTTP basic authentication does not allow empty username,
    // we only include password if the username is not empty.
    if (parsedURL.password) {
      // Result: <username>:<password>
      socketURLAuth = socketURLAuth.concat(":", parsedURL.password);
    }
  }

  // In case the host is a raw IPv6 address, it can be enclosed in
  // the brackets as the brackets are needed in the final URL string.
  // Need to remove those as url.format blindly adds its own set of brackets
  // if the host string contains colons. That would lead to non-working
  // double brackets (e.g. [[::]]) host
  //
  // All of these web socket url params are optionally passed in through resourceQuery,
  // so we need to fall back to the default if they are not provided
  var socketURLHostname = (hostname || self.location.hostname || "localhost").replace(/^\[(.*)\]$/, "$1");
  var socketURLPort = parsedURL.port;
  if (!socketURLPort || socketURLPort === "0") {
    socketURLPort = self.location.port;
  }

  // If path is provided it'll be passed in via the resourceQuery as a
  // query param so it has to be parsed out of the querystring in order for the
  // client to open the socket to the correct location.
  var socketURLPathname = "/ws";
  if (parsedURL.pathname && !parsedURL.fromCurrentScript) {
    socketURLPathname = parsedURL.pathname;
  }
  return formatURL({
    protocol: socketURLProtocol,
    auth: socketURLAuth,
    hostname: socketURLHostname,
    port: socketURLPort,
    pathname: socketURLPathname,
    slashes: true
  });
};
var socketURL = createSocketURL(parsedResourceQuery);
(0,_socket_js__WEBPACK_IMPORTED_MODULE_2__["default"])(socketURL, onSocketMessage, options.reconnect);


/***/ }),

/***/ "../../node_modules/openmrs/node_modules/webpack-dev-server/client/modules/logger/index.js":
/*!*************************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/webpack-dev-server/client/modules/logger/index.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./client-src/modules/logger/tapable.js":
/*!**********************************************!*\
  !*** ./client-src/modules/logger/tapable.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __nested_webpack_exports__, __nested_webpack_require_372__) {

__nested_webpack_require_372__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_372__.d(__nested_webpack_exports__, {
/* harmony export */   SyncBailHook: function() { return /* binding */ SyncBailHook; }
/* harmony export */ });
function SyncBailHook() {
  return {
    call: function call() {}
  };
}

/**
 * Client stub for tapable SyncBailHook
 */
// eslint-disable-next-line import/prefer-default-export


/***/ }),

/***/ "./node_modules/webpack/lib/logging/Logger.js":
/*!****************************************************!*\
  !*** ./node_modules/webpack/lib/logging/Logger.js ***!
  \****************************************************/
/***/ (function(module) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }) && "symbol" == typeof (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }).iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }) && o.constructor === (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }) && o !== (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }).prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function _iterableToArray(r) {
  if ("undefined" != typeof (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }) && null != r[(typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }).iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[(typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }).toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var LogType = Object.freeze({
  error: (/** @type {"error"} */"error"),
  // message, c style arguments
  warn: (/** @type {"warn"} */"warn"),
  // message, c style arguments
  info: (/** @type {"info"} */"info"),
  // message, c style arguments
  log: (/** @type {"log"} */"log"),
  // message, c style arguments
  debug: (/** @type {"debug"} */"debug"),
  // message, c style arguments

  trace: (/** @type {"trace"} */"trace"),
  // no arguments

  group: (/** @type {"group"} */"group"),
  // [label]
  groupCollapsed: (/** @type {"groupCollapsed"} */"groupCollapsed"),
  // [label]
  groupEnd: (/** @type {"groupEnd"} */"groupEnd"),
  // [label]

  profile: (/** @type {"profile"} */"profile"),
  // [profileName]
  profileEnd: (/** @type {"profileEnd"} */"profileEnd"),
  // [profileName]

  time: (/** @type {"time"} */"time"),
  // name, time as [seconds, nanoseconds]

  clear: (/** @type {"clear"} */"clear"),
  // no arguments
  status: (/** @type {"status"} */"status") // message, arguments
});
module.exports.LogType = LogType;

/** @typedef {typeof LogType[keyof typeof LogType]} LogTypeEnum */

var LOG_SYMBOL = (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; })("webpack logger raw log method");
var TIMERS_SYMBOL = (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; })("webpack logger times");
var TIMERS_AGGREGATES_SYMBOL = (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; })("webpack logger aggregated times");
var WebpackLogger = /*#__PURE__*/function () {
  /**
   * @param {(type: LogTypeEnum, args?: EXPECTED_ANY[]) => void} log log function
   * @param {(name: string | (() => string)) => WebpackLogger} getChildLogger function to create child logger
   */
  function WebpackLogger(log, getChildLogger) {
    _classCallCheck(this, WebpackLogger);
    this[LOG_SYMBOL] = log;
    this.getChildLogger = getChildLogger;
  }

  /**
   * @param {...EXPECTED_ANY} args args
   */
  return _createClass(WebpackLogger, [{
    key: "error",
    value: function error() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      this[LOG_SYMBOL](LogType.error, args);
    }

    /**
     * @param {...EXPECTED_ANY} args args
     */
  }, {
    key: "warn",
    value: function warn() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      this[LOG_SYMBOL](LogType.warn, args);
    }

    /**
     * @param {...EXPECTED_ANY} args args
     */
  }, {
    key: "info",
    value: function info() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      this[LOG_SYMBOL](LogType.info, args);
    }

    /**
     * @param {...EXPECTED_ANY} args args
     */
  }, {
    key: "log",
    value: function log() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      this[LOG_SYMBOL](LogType.log, args);
    }

    /**
     * @param {...EXPECTED_ANY} args args
     */
  }, {
    key: "debug",
    value: function debug() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }
      this[LOG_SYMBOL](LogType.debug, args);
    }

    /**
     * @param {EXPECTED_ANY} assertion assertion
     * @param {...EXPECTED_ANY} args args
     */
  }, {
    key: "assert",
    value: function assert(assertion) {
      if (!assertion) {
        for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
          args[_key6 - 1] = arguments[_key6];
        }
        this[LOG_SYMBOL](LogType.error, args);
      }
    }
  }, {
    key: "trace",
    value: function trace() {
      this[LOG_SYMBOL](LogType.trace, ["Trace"]);
    }
  }, {
    key: "clear",
    value: function clear() {
      this[LOG_SYMBOL](LogType.clear);
    }

    /**
     * @param {...EXPECTED_ANY} args args
     */
  }, {
    key: "status",
    value: function status() {
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }
      this[LOG_SYMBOL](LogType.status, args);
    }

    /**
     * @param {...EXPECTED_ANY} args args
     */
  }, {
    key: "group",
    value: function group() {
      for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }
      this[LOG_SYMBOL](LogType.group, args);
    }

    /**
     * @param {...EXPECTED_ANY} args args
     */
  }, {
    key: "groupCollapsed",
    value: function groupCollapsed() {
      for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }
      this[LOG_SYMBOL](LogType.groupCollapsed, args);
    }
  }, {
    key: "groupEnd",
    value: function groupEnd() {
      this[LOG_SYMBOL](LogType.groupEnd);
    }

    /**
     * @param {string=} label label
     */
  }, {
    key: "profile",
    value: function profile(label) {
      this[LOG_SYMBOL](LogType.profile, [label]);
    }

    /**
     * @param {string=} label label
     */
  }, {
    key: "profileEnd",
    value: function profileEnd(label) {
      this[LOG_SYMBOL](LogType.profileEnd, [label]);
    }

    /**
     * @param {string} label label
     */
  }, {
    key: "time",
    value: function time(label) {
      /** @type {Map<string | undefined, [number, number]>} */
      this[TIMERS_SYMBOL] = this[TIMERS_SYMBOL] || new Map();
      this[TIMERS_SYMBOL].set(label, process.hrtime());
    }

    /**
     * @param {string=} label label
     */
  }, {
    key: "timeLog",
    value: function timeLog(label) {
      var prev = this[TIMERS_SYMBOL] && this[TIMERS_SYMBOL].get(label);
      if (!prev) {
        throw new Error("No such label '".concat(label, "' for WebpackLogger.timeLog()"));
      }
      var time = process.hrtime(prev);
      this[LOG_SYMBOL](LogType.time, [label].concat(_toConsumableArray(time)));
    }

    /**
     * @param {string=} label label
     */
  }, {
    key: "timeEnd",
    value: function timeEnd(label) {
      var prev = this[TIMERS_SYMBOL] && this[TIMERS_SYMBOL].get(label);
      if (!prev) {
        throw new Error("No such label '".concat(label, "' for WebpackLogger.timeEnd()"));
      }
      var time = process.hrtime(prev);
      /** @type {Map<string | undefined, [number, number]>} */
      this[TIMERS_SYMBOL].delete(label);
      this[LOG_SYMBOL](LogType.time, [label].concat(_toConsumableArray(time)));
    }

    /**
     * @param {string=} label label
     */
  }, {
    key: "timeAggregate",
    value: function timeAggregate(label) {
      var prev = this[TIMERS_SYMBOL] && this[TIMERS_SYMBOL].get(label);
      if (!prev) {
        throw new Error("No such label '".concat(label, "' for WebpackLogger.timeAggregate()"));
      }
      var time = process.hrtime(prev);
      /** @type {Map<string | undefined, [number, number]>} */
      this[TIMERS_SYMBOL].delete(label);
      /** @type {Map<string | undefined, [number, number]>} */
      this[TIMERS_AGGREGATES_SYMBOL] = this[TIMERS_AGGREGATES_SYMBOL] || new Map();
      var current = this[TIMERS_AGGREGATES_SYMBOL].get(label);
      if (current !== undefined) {
        if (time[1] + current[1] > 1e9) {
          time[0] += current[0] + 1;
          time[1] = time[1] - 1e9 + current[1];
        } else {
          time[0] += current[0];
          time[1] += current[1];
        }
      }
      this[TIMERS_AGGREGATES_SYMBOL].set(label, time);
    }

    /**
     * @param {string=} label label
     */
  }, {
    key: "timeAggregateEnd",
    value: function timeAggregateEnd(label) {
      if (this[TIMERS_AGGREGATES_SYMBOL] === undefined) return;
      var time = this[TIMERS_AGGREGATES_SYMBOL].get(label);
      if (time === undefined) return;
      this[TIMERS_AGGREGATES_SYMBOL].delete(label);
      this[LOG_SYMBOL](LogType.time, [label].concat(_toConsumableArray(time)));
    }
  }]);
}();
module.exports.Logger = WebpackLogger;

/***/ }),

/***/ "./node_modules/webpack/lib/logging/createConsoleLogger.js":
/*!*****************************************************************!*\
  !*** ./node_modules/webpack/lib/logging/createConsoleLogger.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __nested_webpack_require_12803__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }) && r[(typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }).iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function _iterableToArray(r) {
  if ("undefined" != typeof (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }) && null != r[(typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }).iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }) && "symbol" == typeof (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }).iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }) && o.constructor === (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }) && o !== (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }).prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
var _require = __nested_webpack_require_12803__(/*! ./Logger */ "./node_modules/webpack/lib/logging/Logger.js"),
  LogType = _require.LogType;

/** @typedef {import("../../declarations/WebpackOptions").FilterItemTypes} FilterItemTypes */
/** @typedef {import("../../declarations/WebpackOptions").FilterTypes} FilterTypes */
/** @typedef {import("./Logger").LogTypeEnum} LogTypeEnum */

/** @typedef {(item: string) => boolean} FilterFunction */
/** @typedef {(value: string, type: LogTypeEnum, args?: EXPECTED_ANY[]) => void} LoggingFunction */

/**
 * @typedef {object} LoggerConsole
 * @property {() => void} clear
 * @property {() => void} trace
 * @property {(...args: EXPECTED_ANY[]) => void} info
 * @property {(...args: EXPECTED_ANY[]) => void} log
 * @property {(...args: EXPECTED_ANY[]) => void} warn
 * @property {(...args: EXPECTED_ANY[]) => void} error
 * @property {(...args: EXPECTED_ANY[]) => void=} debug
 * @property {(...args: EXPECTED_ANY[]) => void=} group
 * @property {(...args: EXPECTED_ANY[]) => void=} groupCollapsed
 * @property {(...args: EXPECTED_ANY[]) => void=} groupEnd
 * @property {(...args: EXPECTED_ANY[]) => void=} status
 * @property {(...args: EXPECTED_ANY[]) => void=} profile
 * @property {(...args: EXPECTED_ANY[]) => void=} profileEnd
 * @property {(...args: EXPECTED_ANY[]) => void=} logTime
 */

/**
 * @typedef {object} LoggerOptions
 * @property {false|true|"none"|"error"|"warn"|"info"|"log"|"verbose"} level loglevel
 * @property {FilterTypes|boolean} debug filter for debug logging
 * @property {LoggerConsole} console the console to log to
 */

/**
 * @param {FilterItemTypes} item an input item
 * @returns {FilterFunction | undefined} filter function
 */
var filterToFunction = function filterToFunction(item) {
  if (typeof item === "string") {
    var regExp = new RegExp("[\\\\/]".concat(item.replace(/[-[\]{}()*+?.\\^$|]/g, "\\$&"), "([\\\\/]|$|!|\\?)"));
    return function (ident) {
      return regExp.test(ident);
    };
  }
  if (item && _typeof(item) === "object" && typeof item.test === "function") {
    return function (ident) {
      return item.test(ident);
    };
  }
  if (typeof item === "function") {
    return item;
  }
  if (typeof item === "boolean") {
    return function () {
      return item;
    };
  }
};

/**
 * @enum {number}
 */
var LogLevel = {
  none: 6,
  false: 6,
  error: 5,
  warn: 4,
  info: 3,
  log: 2,
  true: 2,
  verbose: 1
};

/**
 * @param {LoggerOptions} options options object
 * @returns {LoggingFunction} logging function
 */
module.exports = function (_ref) {
  var _ref$level = _ref.level,
    level = _ref$level === void 0 ? "info" : _ref$level,
    _ref$debug = _ref.debug,
    debug = _ref$debug === void 0 ? false : _ref$debug,
    console = _ref.console;
  var debugFilters = /** @type {FilterFunction[]} */

  typeof debug === "boolean" ? [function () {
    return debug;
  }] : /** @type {FilterItemTypes[]} */[].concat(debug).map(filterToFunction);
  var loglevel = LogLevel["".concat(level)] || 0;

  /**
   * @param {string} name name of the logger
   * @param {LogTypeEnum} type type of the log entry
   * @param {EXPECTED_ANY[]=} args arguments of the log entry
   * @returns {void}
   */
  var logger = function logger(name, type, args) {
    var labeledArgs = function labeledArgs() {
      if (Array.isArray(args)) {
        if (args.length > 0 && typeof args[0] === "string") {
          return ["[".concat(name, "] ").concat(args[0])].concat(_toConsumableArray(args.slice(1)));
        }
        return ["[".concat(name, "]")].concat(_toConsumableArray(args));
      }
      return [];
    };
    var debug = debugFilters.some(function (f) {
      return f(name);
    });
    switch (type) {
      case LogType.debug:
        if (!debug) return;
        if (typeof console.debug === "function") {
          console.debug.apply(console, _toConsumableArray(labeledArgs()));
        } else {
          console.log.apply(console, _toConsumableArray(labeledArgs()));
        }
        break;
      case LogType.log:
        if (!debug && loglevel > LogLevel.log) return;
        console.log.apply(console, _toConsumableArray(labeledArgs()));
        break;
      case LogType.info:
        if (!debug && loglevel > LogLevel.info) return;
        console.info.apply(console, _toConsumableArray(labeledArgs()));
        break;
      case LogType.warn:
        if (!debug && loglevel > LogLevel.warn) return;
        console.warn.apply(console, _toConsumableArray(labeledArgs()));
        break;
      case LogType.error:
        if (!debug && loglevel > LogLevel.error) return;
        console.error.apply(console, _toConsumableArray(labeledArgs()));
        break;
      case LogType.trace:
        if (!debug) return;
        console.trace();
        break;
      case LogType.groupCollapsed:
        if (!debug && loglevel > LogLevel.log) return;
        if (!debug && loglevel > LogLevel.verbose) {
          if (typeof console.groupCollapsed === "function") {
            console.groupCollapsed.apply(console, _toConsumableArray(labeledArgs()));
          } else {
            console.log.apply(console, _toConsumableArray(labeledArgs()));
          }
          break;
        }
      // falls through
      case LogType.group:
        if (!debug && loglevel > LogLevel.log) return;
        if (typeof console.group === "function") {
          console.group.apply(console, _toConsumableArray(labeledArgs()));
        } else {
          console.log.apply(console, _toConsumableArray(labeledArgs()));
        }
        break;
      case LogType.groupEnd:
        if (!debug && loglevel > LogLevel.log) return;
        if (typeof console.groupEnd === "function") {
          console.groupEnd();
        }
        break;
      case LogType.time:
        {
          if (!debug && loglevel > LogLevel.log) return;
          var _args = _slicedToArray(/** @type {[string, number, number]} */
            args, 3),
            label = _args[0],
            start = _args[1],
            end = _args[2];
          var ms = start * 1000 + end / 1000000;
          var msg = "[".concat(name, "] ").concat(label, ": ").concat(ms, " ms");
          if (typeof console.logTime === "function") {
            console.logTime(msg);
          } else {
            console.log(msg);
          }
          break;
        }
      case LogType.profile:
        if (typeof console.profile === "function") {
          console.profile.apply(console, _toConsumableArray(labeledArgs()));
        }
        break;
      case LogType.profileEnd:
        if (typeof console.profileEnd === "function") {
          console.profileEnd.apply(console, _toConsumableArray(labeledArgs()));
        }
        break;
      case LogType.clear:
        if (!debug && loglevel > LogLevel.log) return;
        if (typeof console.clear === "function") {
          console.clear();
        }
        break;
      case LogType.status:
        if (!debug && loglevel > LogLevel.info) return;
        if (typeof console.status === "function") {
          if (!args || args.length === 0) {
            console.status();
          } else {
            console.status.apply(console, _toConsumableArray(labeledArgs()));
          }
        } else if (args && args.length !== 0) {
          console.info.apply(console, _toConsumableArray(labeledArgs()));
        }
        break;
      default:
        throw new Error("Unexpected LogType ".concat(type));
    }
  };
  return logger;
};

/***/ }),

/***/ "./node_modules/webpack/lib/logging/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/webpack/lib/logging/runtime.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __nested_webpack_require_23778__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
var _require = __nested_webpack_require_23778__(/*! tapable */ "./client-src/modules/logger/tapable.js"),
  SyncBailHook = _require.SyncBailHook;
var _require2 = __nested_webpack_require_23778__(/*! ./Logger */ "./node_modules/webpack/lib/logging/Logger.js"),
  Logger = _require2.Logger;
var createConsoleLogger = __nested_webpack_require_23778__(/*! ./createConsoleLogger */ "./node_modules/webpack/lib/logging/createConsoleLogger.js");

/** @type {createConsoleLogger.LoggerOptions} */
var currentDefaultLoggerOptions = {
  level: "info",
  debug: false,
  console: console
};
var currentDefaultLogger = createConsoleLogger(currentDefaultLoggerOptions);

/**
 * @param {string} name name of the logger
 * @returns {Logger} a logger
 */
module.exports.getLogger = function (name) {
  return new Logger(function (type, args) {
    if (module.exports.hooks.log.call(name, type, args) === undefined) {
      currentDefaultLogger(name, type, args);
    }
  }, function (childName) {
    return module.exports.getLogger("".concat(name, "/").concat(childName));
  });
};

/**
 * @param {createConsoleLogger.LoggerOptions} options new options, merge with old options
 * @returns {void}
 */
module.exports.configureDefaultLogger = function (options) {
  _extends(currentDefaultLoggerOptions, options);
  currentDefaultLogger = createConsoleLogger(currentDefaultLoggerOptions);
};
module.exports.hooks = {
  log: new SyncBailHook(["origin", "type", "args"])
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_25855__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_25855__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__nested_webpack_require_25855__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__nested_webpack_require_25855__.o(definition, key) && !__nested_webpack_require_25855__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__nested_webpack_require_25855__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__nested_webpack_require_25855__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __nested_webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
!function() {
/*!********************************************!*\
  !*** ./client-src/modules/logger/index.js ***!
  \********************************************/
__nested_webpack_require_25855__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_25855__.d(__nested_webpack_exports__, {
/* harmony export */   "default": function() { return /* reexport default export from named module */ webpack_lib_logging_runtime_js__WEBPACK_IMPORTED_MODULE_0__; }
/* harmony export */ });
/* harmony import */ var webpack_lib_logging_runtime_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_25855__(/*! webpack/lib/logging/runtime.js */ "./node_modules/webpack/lib/logging/runtime.js");

}();
var __webpack_export_target__ = exports;
for(var __webpack_i__ in __nested_webpack_exports__) __webpack_export_target__[__webpack_i__] = __nested_webpack_exports__[__webpack_i__];
if(__nested_webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;

/***/ }),

/***/ "../../node_modules/openmrs/node_modules/webpack-dev-server/client/overlay.js":
/*!************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/webpack-dev-server/client/overlay.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createOverlay: () => (/* binding */ createOverlay),
/* harmony export */   formatProblem: () => (/* binding */ formatProblem)
/* harmony export */ });
/* harmony import */ var ansi_html_community__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ansi-html-community */ "../../node_modules/ansi-html-community/index.js");
/* harmony import */ var ansi_html_community__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ansi_html_community__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// The error overlay is inspired (and mostly copied) from Create React App (https://github.com/facebookincubator/create-react-app)
// They, in turn, got inspired by webpack-hot-middleware (https://github.com/glenjamin/webpack-hot-middleware).



/**
 * @type {(input: string, position: number) => string}
 */
var getCodePoint = String.prototype.codePointAt ? function (input, position) {
  return input.codePointAt(position);
} : function (input, position) {
  return (input.charCodeAt(position) - 0xd800) * 0x400 + input.charCodeAt(position + 1) - 0xdc00 + 0x10000;
};

/**
 * @param {string} macroText
 * @param {RegExp} macroRegExp
 * @param {(input: string) => string} macroReplacer
 * @returns {string}
 */
var replaceUsingRegExp = function replaceUsingRegExp(macroText, macroRegExp, macroReplacer) {
  macroRegExp.lastIndex = 0;
  var replaceMatch = macroRegExp.exec(macroText);
  var replaceResult;
  if (replaceMatch) {
    replaceResult = "";
    var replaceLastIndex = 0;
    do {
      if (replaceLastIndex !== replaceMatch.index) {
        replaceResult += macroText.substring(replaceLastIndex, replaceMatch.index);
      }
      var replaceInput = replaceMatch[0];
      replaceResult += macroReplacer(replaceInput);
      replaceLastIndex = replaceMatch.index + replaceInput.length;
      // eslint-disable-next-line no-cond-assign
    } while (replaceMatch = macroRegExp.exec(macroText));
    if (replaceLastIndex !== macroText.length) {
      replaceResult += macroText.substring(replaceLastIndex);
    }
  } else {
    replaceResult = macroText;
  }
  return replaceResult;
};
var references = {
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
  "&": "&amp;"
};

/**
 * @param {string} text text
 * @returns {string}
 */
function encode(text) {
  if (!text) {
    return "";
  }
  return replaceUsingRegExp(text, /[<>'"&]/g, function (input) {
    var result = references[input];
    if (!result) {
      var code = input.length > 1 ? getCodePoint(input, 0) : input.charCodeAt(0);
      result = "&#".concat(code, ";");
    }
    return result;
  });
}

/**
 * @typedef {Object} StateDefinitions
 * @property {{[event: string]: { target: string; actions?: Array<string> }}} [on]
 */

/**
 * @typedef {Object} Options
 * @property {{[state: string]: StateDefinitions}} states
 * @property {object} context;
 * @property {string} initial
 */

/**
 * @typedef {Object} Implementation
 * @property {{[actionName: string]: (ctx: object, event: any) => object}} actions
 */

/**
 * A simplified `createMachine` from `@xstate/fsm` with the following differences:
 *
 *  - the returned machine is technically a "service". No `interpret(machine).start()` is needed.
 *  - the state definition only support `on` and target must be declared with { target: 'nextState', actions: [] } explicitly.
 *  - event passed to `send` must be an object with `type` property.
 *  - actions implementation will be [assign action](https://xstate.js.org/docs/guides/context.html#assign-action) if you return any value.
 *  Do not return anything if you just want to invoke side effect.
 *
 * The goal of this custom function is to avoid installing the entire `'xstate/fsm'` package, while enabling modeling using
 * state machine. You can copy the first parameter into the editor at https://stately.ai/viz to visualize the state machine.
 *
 * @param {Options} options
 * @param {Implementation} implementation
 */
function createMachine(_ref, _ref2) {
  var states = _ref.states,
    context = _ref.context,
    initial = _ref.initial;
  var actions = _ref2.actions;
  var currentState = initial;
  var currentContext = context;
  return {
    send: function send(event) {
      var currentStateOn = states[currentState].on;
      var transitionConfig = currentStateOn && currentStateOn[event.type];
      if (transitionConfig) {
        currentState = transitionConfig.target;
        if (transitionConfig.actions) {
          transitionConfig.actions.forEach(function (actName) {
            var actionImpl = actions[actName];
            var nextContextValue = actionImpl && actionImpl(currentContext, event);
            if (nextContextValue) {
              currentContext = _objectSpread(_objectSpread({}, currentContext), nextContextValue);
            }
          });
        }
      }
    }
  };
}

/**
 * @typedef {Object} ShowOverlayData
 * @property {'warning' | 'error'} level
 * @property {Array<string  | { moduleIdentifier?: string, moduleName?: string, loc?: string, message?: string }>} messages
 * @property {'build' | 'runtime'} messageSource
 */

/**
 * @typedef {Object} CreateOverlayMachineOptions
 * @property {(data: ShowOverlayData) => void} showOverlay
 * @property {() => void} hideOverlay
 */

/**
 * @param {CreateOverlayMachineOptions} options
 */
var createOverlayMachine = function createOverlayMachine(options) {
  var hideOverlay = options.hideOverlay,
    showOverlay = options.showOverlay;
  return createMachine({
    initial: "hidden",
    context: {
      level: "error",
      messages: [],
      messageSource: "build"
    },
    states: {
      hidden: {
        on: {
          BUILD_ERROR: {
            target: "displayBuildError",
            actions: ["setMessages", "showOverlay"]
          },
          RUNTIME_ERROR: {
            target: "displayRuntimeError",
            actions: ["setMessages", "showOverlay"]
          }
        }
      },
      displayBuildError: {
        on: {
          DISMISS: {
            target: "hidden",
            actions: ["dismissMessages", "hideOverlay"]
          },
          BUILD_ERROR: {
            target: "displayBuildError",
            actions: ["appendMessages", "showOverlay"]
          }
        }
      },
      displayRuntimeError: {
        on: {
          DISMISS: {
            target: "hidden",
            actions: ["dismissMessages", "hideOverlay"]
          },
          RUNTIME_ERROR: {
            target: "displayRuntimeError",
            actions: ["appendMessages", "showOverlay"]
          },
          BUILD_ERROR: {
            target: "displayBuildError",
            actions: ["setMessages", "showOverlay"]
          }
        }
      }
    }
  }, {
    actions: {
      dismissMessages: function dismissMessages() {
        return {
          messages: [],
          level: "error",
          messageSource: "build"
        };
      },
      appendMessages: function appendMessages(context, event) {
        return {
          messages: context.messages.concat(event.messages),
          level: event.level || context.level,
          messageSource: event.type === "RUNTIME_ERROR" ? "runtime" : "build"
        };
      },
      setMessages: function setMessages(context, event) {
        return {
          messages: event.messages,
          level: event.level || context.level,
          messageSource: event.type === "RUNTIME_ERROR" ? "runtime" : "build"
        };
      },
      hideOverlay: hideOverlay,
      showOverlay: showOverlay
    }
  });
};

/**
 *
 * @param {Error} error
 */
var parseErrorToStacks = function parseErrorToStacks(error) {
  if (!error || !(error instanceof Error)) {
    throw new Error("parseErrorToStacks expects Error object");
  }
  if (typeof error.stack === "string") {
    return error.stack.split("\n").filter(function (stack) {
      return stack !== "Error: ".concat(error.message);
    });
  }
};

/**
 * @callback ErrorCallback
 * @param {ErrorEvent} error
 * @returns {void}
 */

/**
 * @param {ErrorCallback} callback
 */
var listenToRuntimeError = function listenToRuntimeError(callback) {
  window.addEventListener("error", callback);
  return function cleanup() {
    window.removeEventListener("error", callback);
  };
};

/**
 * @callback UnhandledRejectionCallback
 * @param {PromiseRejectionEvent} rejectionEvent
 * @returns {void}
 */

/**
 * @param {UnhandledRejectionCallback} callback
 */
var listenToUnhandledRejection = function listenToUnhandledRejection(callback) {
  window.addEventListener("unhandledrejection", callback);
  return function cleanup() {
    window.removeEventListener("unhandledrejection", callback);
  };
};

// Styles are inspired by `react-error-overlay`

var msgStyles = {
  error: {
    backgroundColor: "rgba(206, 17, 38, 0.1)",
    color: "#fccfcf"
  },
  warning: {
    backgroundColor: "rgba(251, 245, 180, 0.1)",
    color: "#fbf5b4"
  }
};
var iframeStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: "100vw",
  height: "100vh",
  border: "none",
  "z-index": 9999999999
};
var containerStyle = {
  position: "fixed",
  boxSizing: "border-box",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  width: "100vw",
  height: "100vh",
  fontSize: "large",
  padding: "2rem 2rem 4rem 2rem",
  lineHeight: "1.2",
  whiteSpace: "pre-wrap",
  overflow: "auto",
  backgroundColor: "rgba(0, 0, 0, 0.9)",
  color: "white"
};
var headerStyle = {
  color: "#e83b46",
  fontSize: "2em",
  whiteSpace: "pre-wrap",
  fontFamily: "sans-serif",
  margin: "0 2rem 2rem 0",
  flex: "0 0 auto",
  maxHeight: "50%",
  overflow: "auto"
};
var dismissButtonStyle = {
  color: "#ffffff",
  lineHeight: "1rem",
  fontSize: "1.5rem",
  padding: "1rem",
  cursor: "pointer",
  position: "absolute",
  right: 0,
  top: 0,
  backgroundColor: "transparent",
  border: "none"
};
var msgTypeStyle = {
  color: "#e83b46",
  fontSize: "1.2em",
  marginBottom: "1rem",
  fontFamily: "sans-serif"
};
var msgTextStyle = {
  lineHeight: "1.5",
  fontSize: "1rem",
  fontFamily: "Menlo, Consolas, monospace"
};

// ANSI HTML

var colors = {
  reset: ["transparent", "transparent"],
  black: "181818",
  red: "E36049",
  green: "B3CB74",
  yellow: "FFD080",
  blue: "7CAFC2",
  magenta: "7FACCA",
  cyan: "C3C2EF",
  lightgrey: "EBE7E3",
  darkgrey: "6D7891"
};
ansi_html_community__WEBPACK_IMPORTED_MODULE_0___default().setColors(colors);

/**
 * @param {string} type
 * @param {string  | { file?: string, moduleName?: string, loc?: string, message?: string; stack?: string[] }} item
 * @returns {{ header: string, body: string }}
 */
var formatProblem = function formatProblem(type, item) {
  var header = type === "warning" ? "WARNING" : "ERROR";
  var body = "";
  if (typeof item === "string") {
    body += item;
  } else {
    var file = item.file || "";
    // eslint-disable-next-line no-nested-ternary
    var moduleName = item.moduleName ? item.moduleName.indexOf("!") !== -1 ? "".concat(item.moduleName.replace(/^(\s|\S)*!/, ""), " (").concat(item.moduleName, ")") : "".concat(item.moduleName) : "";
    var loc = item.loc;
    header += "".concat(moduleName || file ? " in ".concat(moduleName ? "".concat(moduleName).concat(file ? " (".concat(file, ")") : "") : file).concat(loc ? " ".concat(loc) : "") : "");
    body += item.message || "";
  }
  if (Array.isArray(item.stack)) {
    item.stack.forEach(function (stack) {
      if (typeof stack === "string") {
        body += "\r\n".concat(stack);
      }
    });
  }
  return {
    header: header,
    body: body
  };
};

/**
 * @typedef {Object} CreateOverlayOptions
 * @property {string | null} trustedTypesPolicyName
 * @property {boolean | (error: Error) => void} [catchRuntimeError]
 */

/**
 *
 * @param {CreateOverlayOptions} options
 */
var createOverlay = function createOverlay(options) {
  /** @type {HTMLIFrameElement | null | undefined} */
  var iframeContainerElement;
  /** @type {HTMLDivElement | null | undefined} */
  var containerElement;
  /** @type {HTMLDivElement | null | undefined} */
  var headerElement;
  /** @type {Array<(element: HTMLDivElement) => void>} */
  var onLoadQueue = [];
  /** @type {TrustedTypePolicy | undefined} */
  var overlayTrustedTypesPolicy;

  /**
   *
   * @param {HTMLElement} element
   * @param {CSSStyleDeclaration} style
   */
  function applyStyle(element, style) {
    Object.keys(style).forEach(function (prop) {
      element.style[prop] = style[prop];
    });
  }

  /**
   * @param {string | null} trustedTypesPolicyName
   */
  function createContainer(trustedTypesPolicyName) {
    // Enable Trusted Types if they are available in the current browser.
    if (window.trustedTypes) {
      overlayTrustedTypesPolicy = window.trustedTypes.createPolicy(trustedTypesPolicyName || "webpack-dev-server#overlay", {
        createHTML: function createHTML(value) {
          return value;
        }
      });
    }
    iframeContainerElement = document.createElement("iframe");
    iframeContainerElement.id = "webpack-dev-server-client-overlay";
    iframeContainerElement.src = "about:blank";
    applyStyle(iframeContainerElement, iframeStyle);
    iframeContainerElement.onload = function () {
      var contentElement = /** @type {Document} */
      (/** @type {HTMLIFrameElement} */
      iframeContainerElement.contentDocument).createElement("div");
      containerElement = /** @type {Document} */
      (/** @type {HTMLIFrameElement} */
      iframeContainerElement.contentDocument).createElement("div");
      contentElement.id = "webpack-dev-server-client-overlay-div";
      applyStyle(contentElement, containerStyle);
      headerElement = document.createElement("div");
      headerElement.innerText = "Compiled with problems:";
      applyStyle(headerElement, headerStyle);
      var closeButtonElement = document.createElement("button");
      applyStyle(closeButtonElement, dismissButtonStyle);
      closeButtonElement.innerText = "×";
      closeButtonElement.ariaLabel = "Dismiss";
      closeButtonElement.addEventListener("click", function () {
        // eslint-disable-next-line no-use-before-define
        overlayService.send({
          type: "DISMISS"
        });
      });
      contentElement.appendChild(headerElement);
      contentElement.appendChild(closeButtonElement);
      contentElement.appendChild(containerElement);

      /** @type {Document} */
      (/** @type {HTMLIFrameElement} */
      iframeContainerElement.contentDocument).body.appendChild(contentElement);
      onLoadQueue.forEach(function (onLoad) {
        onLoad(/** @type {HTMLDivElement} */contentElement);
      });
      onLoadQueue = [];

      /** @type {HTMLIFrameElement} */
      iframeContainerElement.onload = null;
    };
    document.body.appendChild(iframeContainerElement);
  }

  /**
   * @param {(element: HTMLDivElement) => void} callback
   * @param {string | null} trustedTypesPolicyName
   */
  function ensureOverlayExists(callback, trustedTypesPolicyName) {
    if (containerElement) {
      containerElement.innerHTML = overlayTrustedTypesPolicy ? overlayTrustedTypesPolicy.createHTML("") : "";
      // Everything is ready, call the callback right away.
      callback(containerElement);
      return;
    }
    onLoadQueue.push(callback);
    if (iframeContainerElement) {
      return;
    }
    createContainer(trustedTypesPolicyName);
  }

  // Successful compilation.
  function hide() {
    if (!iframeContainerElement) {
      return;
    }

    // Clean up and reset internal state.
    document.body.removeChild(iframeContainerElement);
    iframeContainerElement = null;
    containerElement = null;
  }

  // Compilation with errors (e.g. syntax error or missing modules).
  /**
   * @param {string} type
   * @param {Array<string  | { moduleIdentifier?: string, moduleName?: string, loc?: string, message?: string }>} messages
   * @param {string | null} trustedTypesPolicyName
   * @param {'build' | 'runtime'} messageSource
   */
  function show(type, messages, trustedTypesPolicyName, messageSource) {
    ensureOverlayExists(function () {
      headerElement.innerText = messageSource === "runtime" ? "Uncaught runtime errors:" : "Compiled with problems:";
      messages.forEach(function (message) {
        var entryElement = document.createElement("div");
        var msgStyle = type === "warning" ? msgStyles.warning : msgStyles.error;
        applyStyle(entryElement, _objectSpread(_objectSpread({}, msgStyle), {}, {
          padding: "1rem 1rem 1.5rem 1rem"
        }));
        var typeElement = document.createElement("div");
        var _formatProblem = formatProblem(type, message),
          header = _formatProblem.header,
          body = _formatProblem.body;
        typeElement.innerText = header;
        applyStyle(typeElement, msgTypeStyle);
        if (message.moduleIdentifier) {
          applyStyle(typeElement, {
            cursor: "pointer"
          });
          // element.dataset not supported in IE
          typeElement.setAttribute("data-can-open", true);
          typeElement.addEventListener("click", function () {
            fetch("/webpack-dev-server/open-editor?fileName=".concat(message.moduleIdentifier));
          });
        }

        // Make it look similar to our terminal.
        var text = ansi_html_community__WEBPACK_IMPORTED_MODULE_0___default()(encode(body));
        var messageTextNode = document.createElement("div");
        applyStyle(messageTextNode, msgTextStyle);
        messageTextNode.innerHTML = overlayTrustedTypesPolicy ? overlayTrustedTypesPolicy.createHTML(text) : text;
        entryElement.appendChild(typeElement);
        entryElement.appendChild(messageTextNode);

        /** @type {HTMLDivElement} */
        containerElement.appendChild(entryElement);
      });
    }, trustedTypesPolicyName);
  }
  var overlayService = createOverlayMachine({
    showOverlay: function showOverlay(_ref3) {
      var _ref3$level = _ref3.level,
        level = _ref3$level === void 0 ? "error" : _ref3$level,
        messages = _ref3.messages,
        messageSource = _ref3.messageSource;
      return show(level, messages, options.trustedTypesPolicyName, messageSource);
    },
    hideOverlay: hide
  });
  if (options.catchRuntimeError) {
    /**
     * @param {Error | undefined} error
     * @param {string} fallbackMessage
     */
    var handleError = function handleError(error, fallbackMessage) {
      var errorObject = error instanceof Error ? error : new Error(error || fallbackMessage);
      var shouldDisplay = typeof options.catchRuntimeError === "function" ? options.catchRuntimeError(errorObject) : true;
      if (shouldDisplay) {
        overlayService.send({
          type: "RUNTIME_ERROR",
          messages: [{
            message: errorObject.message,
            stack: parseErrorToStacks(errorObject)
          }]
        });
      }
    };
    listenToRuntimeError(function (errorEvent) {
      // error property may be empty in older browser like IE
      var error = errorEvent.error,
        message = errorEvent.message;
      if (!error && !message) {
        return;
      }

      // if error stack indicates a React error boundary caught the error, do not show overlay.
      if (error && error.stack && error.stack.includes("invokeGuardedCallbackDev")) {
        return;
      }
      handleError(error, message);
    });
    listenToUnhandledRejection(function (promiseRejectionEvent) {
      var reason = promiseRejectionEvent.reason;
      handleError(reason, "Unknown promise rejection reason");
    });
  }
  return overlayService;
};


/***/ }),

/***/ "../../node_modules/openmrs/node_modules/webpack-dev-server/client/progress.js":
/*!*************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/webpack-dev-server/client/progress.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   defineProgressElement: () => (/* binding */ defineProgressElement),
/* harmony export */   isProgressSupported: () => (/* binding */ isProgressSupported)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _classPrivateMethodInitSpec(e, a) { _checkPrivateRedeclaration(e, a), a.add(e); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
function isProgressSupported() {
  return "customElements" in self && !!HTMLElement.prototype.attachShadow;
}
function defineProgressElement() {
  var _WebpackDevServerProgress;
  if (customElements.get("wds-progress")) {
    return;
  }
  var _WebpackDevServerProgress_brand = /*#__PURE__*/new WeakSet();
  var WebpackDevServerProgress = /*#__PURE__*/function (_HTMLElement) {
    function WebpackDevServerProgress() {
      var _this;
      _classCallCheck(this, WebpackDevServerProgress);
      _this = _callSuper(this, WebpackDevServerProgress);
      _classPrivateMethodInitSpec(_this, _WebpackDevServerProgress_brand);
      _this.attachShadow({
        mode: "open"
      });
      _this.maxDashOffset = -219.99078369140625;
      _this.animationTimer = null;
      return _this;
    }
    _inherits(WebpackDevServerProgress, _HTMLElement);
    return _createClass(WebpackDevServerProgress, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        _assertClassBrand(_WebpackDevServerProgress_brand, this, _reset).call(this);
      }
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, oldValue, newValue) {
        if (name === "progress") {
          _assertClassBrand(_WebpackDevServerProgress_brand, this, _update).call(this, Number(newValue));
        } else if (name === "type") {
          _assertClassBrand(_WebpackDevServerProgress_brand, this, _reset).call(this);
        }
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return ["progress", "type"];
      }
    }]);
  }(/*#__PURE__*/_wrapNativeSuper(HTMLElement));
  _WebpackDevServerProgress = WebpackDevServerProgress;
  function _reset() {
    var _this$getAttribute, _Number;
    clearTimeout(this.animationTimer);
    this.animationTimer = null;
    var typeAttr = (_this$getAttribute = this.getAttribute("type")) === null || _this$getAttribute === void 0 ? void 0 : _this$getAttribute.toLowerCase();
    this.type = typeAttr === "circular" ? "circular" : "linear";
    var innerHTML = this.type === "circular" ? _circularTemplate.call(_WebpackDevServerProgress) : _linearTemplate.call(_WebpackDevServerProgress);
    this.shadowRoot.innerHTML = innerHTML;
    this.initialProgress = (_Number = Number(this.getAttribute("progress"))) !== null && _Number !== void 0 ? _Number : 0;
    _assertClassBrand(_WebpackDevServerProgress_brand, this, _update).call(this, this.initialProgress);
  }
  function _circularTemplate() {
    return "\n        <style>\n        :host {\n            width: 200px;\n            height: 200px;\n            position: fixed;\n            right: 5%;\n            top: 5%;\n            transition: opacity .25s ease-in-out;\n            z-index: 2147483645;\n        }\n\n        circle {\n            fill: #282d35;\n        }\n\n        path {\n            fill: rgba(0, 0, 0, 0);\n            stroke: rgb(186, 223, 172);\n            stroke-dasharray: 219.99078369140625;\n            stroke-dashoffset: -219.99078369140625;\n            stroke-width: 10;\n            transform: rotate(90deg) translate(0px, -80px);\n        }\n\n        text {\n            font-family: 'Open Sans', sans-serif;\n            font-size: 18px;\n            fill: #ffffff;\n            dominant-baseline: middle;\n            text-anchor: middle;\n        }\n\n        tspan#percent-super {\n            fill: #bdc3c7;\n            font-size: 0.45em;\n            baseline-shift: 10%;\n        }\n\n        @keyframes fade {\n            0% { opacity: 1; transform: scale(1); }\n            100% { opacity: 0; transform: scale(0); }\n        }\n\n        .disappear {\n            animation: fade 0.3s;\n            animation-fill-mode: forwards;\n            animation-delay: 0.5s;\n        }\n\n        .hidden {\n            display: none;\n        }\n        </style>\n        <svg id=\"progress\" class=\"hidden noselect\" viewBox=\"0 0 80 80\">\n        <circle cx=\"50%\" cy=\"50%\" r=\"35\"></circle>\n        <path d=\"M5,40a35,35 0 1,0 70,0a35,35 0 1,0 -70,0\"></path>\n        <text x=\"50%\" y=\"51%\">\n            <tspan id=\"percent-value\">0</tspan>\n            <tspan id=\"percent-super\">%</tspan>\n        </text>\n        </svg>\n      ";
  }
  function _linearTemplate() {
    return "\n        <style>\n        :host {\n            position: fixed;\n            top: 0;\n            left: 0;\n            height: 4px;\n            width: 100vw;\n            z-index: 2147483645;\n        }\n\n        #bar {\n            width: 0%;\n            height: 4px;\n            background-color: rgb(186, 223, 172);\n        }\n\n        @keyframes fade {\n            0% { opacity: 1; }\n            100% { opacity: 0; }\n        }\n\n        .disappear {\n            animation: fade 0.3s;\n            animation-fill-mode: forwards;\n            animation-delay: 0.5s;\n        }\n\n        .hidden {\n            display: none;\n        }\n        </style>\n        <div id=\"progress\"></div>\n        ";
  }
  function _update(percent) {
    var element = this.shadowRoot.querySelector("#progress");
    if (this.type === "circular") {
      var path = this.shadowRoot.querySelector("path");
      var value = this.shadowRoot.querySelector("#percent-value");
      var offset = (100 - percent) / 100 * this.maxDashOffset;
      path.style.strokeDashoffset = offset;
      value.textContent = percent;
    } else {
      element.style.width = "".concat(percent, "%");
    }
    if (percent >= 100) {
      _assertClassBrand(_WebpackDevServerProgress_brand, this, _hide).call(this);
    } else if (percent > 0) {
      _assertClassBrand(_WebpackDevServerProgress_brand, this, _show).call(this);
    }
  }
  function _show() {
    var element = this.shadowRoot.querySelector("#progress");
    element.classList.remove("hidden");
  }
  function _hide() {
    var _this2 = this;
    var element = this.shadowRoot.querySelector("#progress");
    if (this.type === "circular") {
      element.classList.add("disappear");
      element.addEventListener("animationend", function () {
        element.classList.add("hidden");
        _assertClassBrand(_WebpackDevServerProgress_brand, _this2, _update).call(_this2, 0);
      }, {
        once: true
      });
    } else if (this.type === "linear") {
      element.classList.add("disappear");
      this.animationTimer = setTimeout(function () {
        element.classList.remove("disappear");
        element.classList.add("hidden");
        element.style.width = "0%";
        _this2.animationTimer = null;
      }, 800);
    }
  }
  customElements.define("wds-progress", WebpackDevServerProgress);
}

/***/ }),

/***/ "../../node_modules/openmrs/node_modules/webpack-dev-server/client/socket.js":
/*!***********************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/webpack-dev-server/client/socket.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   client: () => (/* binding */ client),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _clients_WebSocketClient_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./clients/WebSocketClient.js */ "../../node_modules/openmrs/node_modules/webpack-dev-server/client/clients/WebSocketClient.js");
/* harmony import */ var _utils_log_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/log.js */ "../../node_modules/openmrs/node_modules/webpack-dev-server/client/utils/log.js");
/* provided dependency */ var __webpack_dev_server_client__ = __webpack_require__(/*! ../../node_modules/openmrs/node_modules/webpack-dev-server/client/clients/WebSocketClient.js */ "../../node_modules/openmrs/node_modules/webpack-dev-server/client/clients/WebSocketClient.js");
/* global __webpack_dev_server_client__ */




// this WebsocketClient is here as a default fallback, in case the client is not injected
/* eslint-disable camelcase */
var Client =
// eslint-disable-next-line no-nested-ternary
typeof __webpack_dev_server_client__ !== "undefined" ? typeof __webpack_dev_server_client__.default !== "undefined" ? __webpack_dev_server_client__.default : __webpack_dev_server_client__ : _clients_WebSocketClient_js__WEBPACK_IMPORTED_MODULE_0__["default"];
/* eslint-enable camelcase */

var retries = 0;
var maxRetries = 10;

// Initialized client is exported so external consumers can utilize the same instance
// It is mutable to enforce singleton
// eslint-disable-next-line import/no-mutable-exports
var client = null;
var timeout;

/**
 * @param {string} url
 * @param {{ [handler: string]: (data?: any, params?: any) => any }} handlers
 * @param {number} [reconnect]
 */
var socket = function initSocket(url, handlers, reconnect) {
  client = new Client(url);
  client.onOpen(function () {
    retries = 0;
    if (timeout) {
      clearTimeout(timeout);
    }
    if (typeof reconnect !== "undefined") {
      maxRetries = reconnect;
    }
  });
  client.onClose(function () {
    if (retries === 0) {
      handlers.close();
    }

    // Try to reconnect.
    client = null;

    // After 10 retries stop trying, to prevent logspam.
    if (retries < maxRetries) {
      // Exponentially increase timeout to reconnect.
      // Respectfully copied from the package `got`.
      // eslint-disable-next-line no-restricted-properties
      var retryInMs = 1000 * Math.pow(2, retries) + Math.random() * 100;
      retries += 1;
      _utils_log_js__WEBPACK_IMPORTED_MODULE_1__.log.info("Trying to reconnect...");
      timeout = setTimeout(function () {
        socket(url, handlers, reconnect);
      }, retryInMs);
    }
  });
  client.onMessage(
  /**
   * @param {any} data
   */
  function (data) {
    var message = JSON.parse(data);
    if (handlers[message.type]) {
      handlers[message.type](message.data, message.params);
    }
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (socket);

/***/ }),

/***/ "../../node_modules/openmrs/node_modules/webpack-dev-server/client/utils/log.js":
/*!**************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/webpack-dev-server/client/utils/log.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   log: () => (/* binding */ log),
/* harmony export */   setLogLevel: () => (/* binding */ setLogLevel)
/* harmony export */ });
/* harmony import */ var _modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/logger/index.js */ "../../node_modules/openmrs/node_modules/webpack-dev-server/client/modules/logger/index.js");
/* harmony import */ var _modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0__);

var name = "webpack-dev-server";
// default level is set on the client side, so it does not need
// to be set by the CLI or API
var defaultLevel = "info";

// options new options, merge with old options
/**
 * @param {false | true | "none" | "error" | "warn" | "info" | "log" | "verbose"} level
 * @returns {void}
 */
function setLogLevel(level) {
  _modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0___default().configureDefaultLogger({
    level: level
  });
}
setLogLevel(defaultLevel);
var log = _modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0___default().getLogger(name);


/***/ }),

/***/ "../../node_modules/openmrs/node_modules/webpack-dev-server/client/utils/sendMessage.js":
/*!**********************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/webpack-dev-server/client/utils/sendMessage.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* global __resourceQuery WorkerGlobalScope */

// Send messages to the outside, so plugins can consume it.
/**
 * @param {string} type
 * @param {any} [data]
 */
function sendMsg(type, data) {
  if (typeof self !== "undefined" && (typeof WorkerGlobalScope === "undefined" || !(self instanceof WorkerGlobalScope))) {
    self.postMessage({
      type: "webpack".concat(type),
      data: data
    }, "*");
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sendMsg);

/***/ }),

/***/ "../../node_modules/openmrs/node_modules/webpack/hot/dev-server.js":
/*!*************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/webpack/hot/dev-server.js ***!
  \*************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/* globals __webpack_hash__ */
if (true) {
	/** @type {undefined|string} */
	var lastHash;
	var upToDate = function upToDate() {
		return /** @type {string} */ (lastHash).indexOf(__webpack_require__.h()) >= 0;
	};
	var log = __webpack_require__(/*! ./log */ "../../node_modules/openmrs/node_modules/webpack/hot/log.js");
	var check = function check() {
		module.hot
			.check(true)
			.then(function (updatedModules) {
				if (!updatedModules) {
					log(
						"warning",
						"[HMR] Cannot find update. " +
							(typeof window !== "undefined"
								? "Need to do a full reload!"
								: "Please reload manually!")
					);
					log(
						"warning",
						"[HMR] (Probably because of restarting the webpack-dev-server)"
					);
					if (typeof window !== "undefined") {
						window.location.reload();
					}
					return;
				}

				if (!upToDate()) {
					check();
				}

				__webpack_require__(/*! ./log-apply-result */ "../../node_modules/openmrs/node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);

				if (upToDate()) {
					log("info", "[HMR] App is up to date.");
				}
			})
			.catch(function (err) {
				var status = module.hot.status();
				if (["abort", "fail"].indexOf(status) >= 0) {
					log(
						"warning",
						"[HMR] Cannot apply update. " +
							(typeof window !== "undefined"
								? "Need to do a full reload!"
								: "Please reload manually!")
					);
					log("warning", "[HMR] " + log.formatError(err));
					if (typeof window !== "undefined") {
						window.location.reload();
					}
				} else {
					log("warning", "[HMR] Update failed: " + log.formatError(err));
				}
			});
	};
	var hotEmitter = __webpack_require__(/*! ./emitter */ "../../node_modules/openmrs/node_modules/webpack/hot/emitter.js");
	hotEmitter.on("webpackHotUpdate", function (currentHash) {
		lastHash = currentHash;
		if (!upToDate() && module.hot.status() === "idle") {
			log("info", "[HMR] Checking for updates on the server...");
			check();
		}
	});
	log("info", "[HMR] Waiting for update signal from WDS...");
} else {}


/***/ }),

/***/ "../../node_modules/openmrs/node_modules/webpack/hot/emitter.js":
/*!**********************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/webpack/hot/emitter.js ***!
  \**********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var EventEmitter = __webpack_require__(/*! events */ "../../node_modules/events/events.js");
module.exports = new EventEmitter();


/***/ }),

/***/ "../../node_modules/openmrs/node_modules/webpack/hot/log-apply-result.js":
/*!*******************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/webpack/hot/log-apply-result.js ***!
  \*******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

/**
 * @param {(string | number)[]} updatedModules updated modules
 * @param {(string | number)[] | null} renewedModules renewed modules
 */
module.exports = function (updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function (moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(/*! ./log */ "../../node_modules/openmrs/node_modules/webpack/hot/log.js");

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function (moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function (moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function (moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				'[HMR] Consider using the optimization.moduleIds: "named" for module names.'
			);
	}
};


/***/ }),

/***/ "../../node_modules/openmrs/node_modules/webpack/hot/log.js":
/*!******************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/webpack/hot/log.js ***!
  \******************************************************************/
/***/ ((module) => {

/** @typedef {"info" | "warning" | "error"} LogLevel */

/** @type {LogLevel} */
var logLevel = "info";

function dummy() {}

/**
 * @param {LogLevel} level log level
 * @returns {boolean} true, if should log
 */
function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

/**
 * @param {(msg?: string) => void} logFn log function
 * @returns {(level: LogLevel, msg?: string) => void} function that logs when log level is sufficient
 */
function logGroup(logFn) {
	return function (level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

/**
 * @param {LogLevel} level log level
 * @param {string|Error} msg message
 */
module.exports = function (level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

/**
 * @param {LogLevel} level log level
 */
module.exports.setLogLevel = function (level) {
	logLevel = level;
};

/**
 * @param {Error} err error
 * @returns {string} formatted error
 */
module.exports.formatError = function (err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	} else {
		return stack;
	}
};


/***/ }),

/***/ "./translations lazy .json$":
/*!************************************************!*\
  !*** ./translations/ lazy nonrecursive .json$ ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./am.json": [
		"./translations/am.json",
		"translations_am_json"
	],
	"./ar.json": [
		"./translations/ar.json",
		"translations_ar_json"
	],
	"./ar_SY.json": [
		"./translations/ar_SY.json",
		"translations_ar_SY_json"
	],
	"./bn.json": [
		"./translations/bn.json",
		"translations_bn_json"
	],
	"./de.json": [
		"./translations/de.json",
		"translations_de_json"
	],
	"./en.json": [
		"./translations/en.json",
		"translations_en_json"
	],
	"./en_US.json": [
		"./translations/en_US.json",
		"translations_en_US_json"
	],
	"./es.json": [
		"./translations/es.json",
		"translations_es_json"
	],
	"./es_MX.json": [
		"./translations/es_MX.json",
		"translations_es_MX_json"
	],
	"./fr.json": [
		"./translations/fr.json",
		"translations_fr_json"
	],
	"./he.json": [
		"./translations/he.json",
		"translations_he_json"
	],
	"./hi.json": [
		"./translations/hi.json",
		"translations_hi_json"
	],
	"./hi_IN.json": [
		"./translations/hi_IN.json",
		"translations_hi_IN_json"
	],
	"./id.json": [
		"./translations/id.json",
		"translations_id_json"
	],
	"./it.json": [
		"./translations/it.json",
		"translations_it_json"
	],
	"./ka.json": [
		"./translations/ka.json",
		"translations_ka_json"
	],
	"./km.json": [
		"./translations/km.json",
		"translations_km_json"
	],
	"./ku.json": [
		"./translations/ku.json",
		"translations_ku_json"
	],
	"./ky.json": [
		"./translations/ky.json",
		"translations_ky_json"
	],
	"./lg.json": [
		"./translations/lg.json",
		"translations_lg_json"
	],
	"./ne.json": [
		"./translations/ne.json",
		"translations_ne_json"
	],
	"./pl.json": [
		"./translations/pl.json",
		"translations_pl_json"
	],
	"./pt.json": [
		"./translations/pt.json",
		"translations_pt_json"
	],
	"./pt_BR.json": [
		"./translations/pt_BR.json",
		"translations_pt_BR_json"
	],
	"./qu.json": [
		"./translations/qu.json",
		"translations_qu_json"
	],
	"./ro_RO.json": [
		"./translations/ro_RO.json",
		"translations_ro_RO_json"
	],
	"./ru_RU.json": [
		"./translations/ru_RU.json",
		"translations_ru_RU_json"
	],
	"./si.json": [
		"./translations/si.json",
		"translations_si_json"
	],
	"./sw.json": [
		"./translations/sw.json",
		"translations_sw_json"
	],
	"./sw_KE.json": [
		"./translations/sw_KE.json",
		"translations_sw_KE_json"
	],
	"./tr.json": [
		"./translations/tr.json",
		"translations_tr_json"
	],
	"./tr_TR.json": [
		"./translations/tr_TR.json",
		"translations_tr_TR_json"
	],
	"./uk.json": [
		"./translations/uk.json",
		"translations_uk_json"
	],
	"./uz.json": [
		"./translations/uz.json",
		"translations_uz_json"
	],
	"./uz@Latn.json": [
		"./translations/uz@Latn.json",
		"translations_uz_Latn_json"
	],
	"./uz_UZ.json": [
		"./translations/uz_UZ.json",
		"translations_uz_UZ_json"
	],
	"./vi.json": [
		"./translations/vi.json",
		"translations_vi_json"
	],
	"./zh.json": [
		"./translations/zh.json",
		"translations_zh_json"
	],
	"./zh_CN.json": [
		"./translations/zh_CN.json",
		"translations_zh_CN_json"
	]
};
function webpackAsyncContext(req) {
	if(!__webpack_require__.o(map, req)) {
		return Promise.resolve().then(() => {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}

	var ids = map[req], id = ids[0];
	return __webpack_require__.e(ids[1]).then(() => {
		return __webpack_require__(id);
	});
}
webpackAsyncContext.keys = () => (Object.keys(map));
webpackAsyncContext.id = "./translations lazy .json$";
module.exports = webpackAsyncContext;

/***/ }),

/***/ "../../node_modules/classnames/index.js":
/*!**********************************************!*\
  !*** ../../node_modules/classnames/index.js ***!
  \**********************************************/
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (arg) {
				classes = appendClass(classes, parseValue(arg));
			}
		}

		return classes;
	}

	function parseValue (arg) {
		if (typeof arg === 'string' || typeof arg === 'number') {
			return arg;
		}

		if (typeof arg !== 'object') {
			return '';
		}

		if (Array.isArray(arg)) {
			return classNames.apply(null, arg);
		}

		if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
			return arg.toString();
		}

		var classes = '';

		for (var key in arg) {
			if (hasOwn.call(arg, key) && arg[key]) {
				classes = appendClass(classes, key);
			}
		}

		return classes;
	}

	function appendClass (value, newClass) {
		if (!newClass) {
			return value;
		}
	
		if (value) {
			return value + ' ' + newClass;
		}
	
		return value + newClass;
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ "../../node_modules/lodash-es/_Symbol.js":
/*!***********************************************!*\
  !*** ../../node_modules/lodash-es/_Symbol.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_root.js */ "../../node_modules/lodash-es/_root.js");


/** Built-in value references. */
var Symbol = _root_js__WEBPACK_IMPORTED_MODULE_0__["default"].Symbol;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Symbol);


/***/ }),

/***/ "../../node_modules/lodash-es/_arrayMap.js":
/*!*************************************************!*\
  !*** ../../node_modules/lodash-es/_arrayMap.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (arrayMap);


/***/ }),

/***/ "../../node_modules/lodash-es/_asciiToArray.js":
/*!*****************************************************!*\
  !*** ../../node_modules/lodash-es/_asciiToArray.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (asciiToArray);


/***/ }),

/***/ "../../node_modules/lodash-es/_baseGetTag.js":
/*!***************************************************!*\
  !*** ../../node_modules/lodash-es/_baseGetTag.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ "../../node_modules/lodash-es/_Symbol.js");
/* harmony import */ var _getRawTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getRawTag.js */ "../../node_modules/lodash-es/_getRawTag.js");
/* harmony import */ var _objectToString_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_objectToString.js */ "../../node_modules/lodash-es/_objectToString.js");




/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? (0,_getRawTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value)
    : (0,_objectToString_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseGetTag);


/***/ }),

/***/ "../../node_modules/lodash-es/_baseSlice.js":
/*!**************************************************!*\
  !*** ../../node_modules/lodash-es/_baseSlice.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseSlice);


/***/ }),

/***/ "../../node_modules/lodash-es/_baseToString.js":
/*!*****************************************************!*\
  !*** ../../node_modules/lodash-es/_baseToString.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ "../../node_modules/lodash-es/_Symbol.js");
/* harmony import */ var _arrayMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_arrayMap.js */ "../../node_modules/lodash-es/_arrayMap.js");
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isArray.js */ "../../node_modules/lodash-es/isArray.js");
/* harmony import */ var _isSymbol_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isSymbol.js */ "../../node_modules/lodash-es/isSymbol.js");





/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if ((0,_isArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return (0,_arrayMap_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value, baseToString) + '';
  }
  if ((0,_isSymbol_js__WEBPACK_IMPORTED_MODULE_3__["default"])(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseToString);


/***/ }),

/***/ "../../node_modules/lodash-es/_castSlice.js":
/*!**************************************************!*\
  !*** ../../node_modules/lodash-es/_castSlice.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseSlice_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseSlice.js */ "../../node_modules/lodash-es/_baseSlice.js");


/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return (!start && end >= length) ? array : (0,_baseSlice_js__WEBPACK_IMPORTED_MODULE_0__["default"])(array, start, end);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (castSlice);


/***/ }),

/***/ "../../node_modules/lodash-es/_createCaseFirst.js":
/*!********************************************************!*\
  !*** ../../node_modules/lodash-es/_createCaseFirst.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _castSlice_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_castSlice.js */ "../../node_modules/lodash-es/_castSlice.js");
/* harmony import */ var _hasUnicode_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_hasUnicode.js */ "../../node_modules/lodash-es/_hasUnicode.js");
/* harmony import */ var _stringToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_stringToArray.js */ "../../node_modules/lodash-es/_stringToArray.js");
/* harmony import */ var _toString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toString.js */ "../../node_modules/lodash-es/toString.js");





/**
 * Creates a function like `_.lowerFirst`.
 *
 * @private
 * @param {string} methodName The name of the `String` case method to use.
 * @returns {Function} Returns the new case function.
 */
function createCaseFirst(methodName) {
  return function(string) {
    string = (0,_toString_js__WEBPACK_IMPORTED_MODULE_0__["default"])(string);

    var strSymbols = (0,_hasUnicode_js__WEBPACK_IMPORTED_MODULE_1__["default"])(string)
      ? (0,_stringToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(string)
      : undefined;

    var chr = strSymbols
      ? strSymbols[0]
      : string.charAt(0);

    var trailing = strSymbols
      ? (0,_castSlice_js__WEBPACK_IMPORTED_MODULE_3__["default"])(strSymbols, 1).join('')
      : string.slice(1);

    return chr[methodName]() + trailing;
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createCaseFirst);


/***/ }),

/***/ "../../node_modules/lodash-es/_freeGlobal.js":
/*!***************************************************!*\
  !*** ../../node_modules/lodash-es/_freeGlobal.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (freeGlobal);


/***/ }),

/***/ "../../node_modules/lodash-es/_getRawTag.js":
/*!**************************************************!*\
  !*** ../../node_modules/lodash-es/_getRawTag.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ "../../node_modules/lodash-es/_Symbol.js");


/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getRawTag);


/***/ }),

/***/ "../../node_modules/lodash-es/_hasUnicode.js":
/*!***************************************************!*\
  !*** ../../node_modules/lodash-es/_hasUnicode.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (hasUnicode);


/***/ }),

/***/ "../../node_modules/lodash-es/_objectToString.js":
/*!*******************************************************!*\
  !*** ../../node_modules/lodash-es/_objectToString.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (objectToString);


/***/ }),

/***/ "../../node_modules/lodash-es/_root.js":
/*!*********************************************!*\
  !*** ../../node_modules/lodash-es/_root.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_freeGlobal.js */ "../../node_modules/lodash-es/_freeGlobal.js");


/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__["default"] || freeSelf || Function('return this')();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (root);


/***/ }),

/***/ "../../node_modules/lodash-es/_stringToArray.js":
/*!******************************************************!*\
  !*** ../../node_modules/lodash-es/_stringToArray.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _asciiToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_asciiToArray.js */ "../../node_modules/lodash-es/_asciiToArray.js");
/* harmony import */ var _hasUnicode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_hasUnicode.js */ "../../node_modules/lodash-es/_hasUnicode.js");
/* harmony import */ var _unicodeToArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_unicodeToArray.js */ "../../node_modules/lodash-es/_unicodeToArray.js");




/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return (0,_hasUnicode_js__WEBPACK_IMPORTED_MODULE_0__["default"])(string)
    ? (0,_unicodeToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(string)
    : (0,_asciiToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(string);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringToArray);


/***/ }),

/***/ "../../node_modules/lodash-es/_unicodeToArray.js":
/*!*******************************************************!*\
  !*** ../../node_modules/lodash-es/_unicodeToArray.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (unicodeToArray);


/***/ }),

/***/ "../../node_modules/lodash-es/capitalize.js":
/*!**************************************************!*\
  !*** ../../node_modules/lodash-es/capitalize.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _toString_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toString.js */ "../../node_modules/lodash-es/toString.js");
/* harmony import */ var _upperFirst_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./upperFirst.js */ "../../node_modules/lodash-es/upperFirst.js");



/**
 * Converts the first character of `string` to upper case and the remaining
 * to lower case.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to capitalize.
 * @returns {string} Returns the capitalized string.
 * @example
 *
 * _.capitalize('FRED');
 * // => 'Fred'
 */
function capitalize(string) {
  return (0,_upperFirst_js__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_toString_js__WEBPACK_IMPORTED_MODULE_1__["default"])(string).toLowerCase());
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (capitalize);


/***/ }),

/***/ "../../node_modules/lodash-es/isArray.js":
/*!***********************************************!*\
  !*** ../../node_modules/lodash-es/isArray.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isArray);


/***/ }),

/***/ "../../node_modules/lodash-es/isObjectLike.js":
/*!****************************************************!*\
  !*** ../../node_modules/lodash-es/isObjectLike.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isObjectLike);


/***/ }),

/***/ "../../node_modules/lodash-es/isSymbol.js":
/*!************************************************!*\
  !*** ../../node_modules/lodash-es/isSymbol.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseGetTag.js */ "../../node_modules/lodash-es/_baseGetTag.js");
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObjectLike.js */ "../../node_modules/lodash-es/isObjectLike.js");



/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    ((0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) && (0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) == symbolTag);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isSymbol);


/***/ }),

/***/ "../../node_modules/lodash-es/toString.js":
/*!************************************************!*\
  !*** ../../node_modules/lodash-es/toString.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseToString.js */ "../../node_modules/lodash-es/_baseToString.js");


/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : (0,_baseToString_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (toString);


/***/ }),

/***/ "../../node_modules/lodash-es/upperFirst.js":
/*!**************************************************!*\
  !*** ../../node_modules/lodash-es/upperFirst.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createCaseFirst_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createCaseFirst.js */ "../../node_modules/lodash-es/_createCaseFirst.js");


/**
 * Converts the first character of `string` to upper case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.upperFirst('fred');
 * // => 'Fred'
 *
 * _.upperFirst('FRED');
 * // => 'FRED'
 */
var upperFirst = (0,_createCaseFirst_js__WEBPACK_IMPORTED_MODULE_0__["default"])('toUpperCase');

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (upperFirst);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("main." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("20220efed19df5fa")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "@openmrs/esm-patient-chart-app:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/sharing */
/******/ 	(() => {
/******/ 		__webpack_require__.S = {};
/******/ 		var initPromises = {};
/******/ 		var initTokens = {};
/******/ 		__webpack_require__.I = (name, initScope) => {
/******/ 			if(!initScope) initScope = [];
/******/ 			// handling circular init calls
/******/ 			var initToken = initTokens[name];
/******/ 			if(!initToken) initToken = initTokens[name] = {};
/******/ 			if(initScope.indexOf(initToken) >= 0) return;
/******/ 			initScope.push(initToken);
/******/ 			// only runs once
/******/ 			if(initPromises[name]) return initPromises[name];
/******/ 			// creates a new share scope if needed
/******/ 			if(!__webpack_require__.o(__webpack_require__.S, name)) __webpack_require__.S[name] = {};
/******/ 			// runs all init snippets from all modules reachable
/******/ 			var scope = __webpack_require__.S[name];
/******/ 			var warn = (msg) => {
/******/ 				if (typeof console !== "undefined" && console.warn) console.warn(msg);
/******/ 			};
/******/ 			var uniqueName = "@openmrs/esm-patient-chart-app";
/******/ 			var register = (name, version, factory, eager) => {
/******/ 				var versions = scope[name] = scope[name] || {};
/******/ 				var activeVersion = versions[version];
/******/ 				if(!activeVersion || (!activeVersion.loaded && (!eager != !activeVersion.eager ? eager : uniqueName > activeVersion.from))) versions[version] = { get: factory, from: uniqueName, eager: !!eager };
/******/ 			};
/******/ 			var initExternal = (id) => {
/******/ 				var handleError = (err) => (warn("Initialization of sharing external failed: " + err));
/******/ 				try {
/******/ 					var module = __webpack_require__(id);
/******/ 					if(!module) return;
/******/ 					var initFn = (module) => (module && module.init && module.init(__webpack_require__.S[name], initScope))
/******/ 					if(module.then) return promises.push(module.then(initFn, handleError));
/******/ 					var initResult = initFn(module);
/******/ 					if(initResult && initResult.then) return promises.push(initResult['catch'](handleError));
/******/ 				} catch(err) { handleError(err); }
/******/ 			}
/******/ 			var promises = [];
/******/ 			switch(name) {
/******/ 				case "default": {
/******/ 					register("@carbon/react", "1.90.0", () => (Promise.all([__webpack_require__.e("vendors-node_modules_carbon_icons-react_es_Icon_js-node_modules_carbon_icons-react_es_iconPro-cf7878"), __webpack_require__.e("vendors-node_modules_react-dom_index_js"), __webpack_require__.e("vendors-node_modules_carbon_icons-react_es_generated_bucket-11_js-node_modules_carbon_icons-r-a40530"), __webpack_require__.e("vendors-node_modules_carbon_icons-react_es_generated_bucket-1_js"), __webpack_require__.e("vendors-node_modules_carbon_icons-react_es_generated_bucket-19_js"), __webpack_require__.e("vendors-node_modules_carbon_react_es_index_js"), __webpack_require__.e("webpack_sharing_consume_default_react_react"), __webpack_require__.e("node_modules_classnames_index_js")]).then(() => (() => (__webpack_require__(/*! ../../node_modules/@carbon/react/es/index.js */ "../../node_modules/@carbon/react/es/index.js"))))));
/******/ 					register("@openmrs/esm-framework", "6.3.1-pre.3250", () => (Promise.all([__webpack_require__.e("vendors-node_modules_swr_dist_index_index_mjs"), __webpack_require__.e("vendors-node_modules_carbon_icons-react_es_Icon_js-node_modules_carbon_icons-react_es_iconPro-cf7878"), __webpack_require__.e("vendors-node_modules_react-dom_index_js"), __webpack_require__.e("vendors-node_modules_carbon_icons-react_es_generated_bucket-11_js-node_modules_carbon_icons-r-a40530"), __webpack_require__.e("vendors-node_modules_openmrs_esm-framework_src_internal_ts"), __webpack_require__.e("webpack_sharing_consume_default_react_react"), __webpack_require__.e("webpack_sharing_consume_default_lodash-es_lodash-es-webpack_sharing_consume_default_swr_immut-59a49d"), __webpack_require__.e("webpack_sharing_consume_default_dayjs_dayjs"), __webpack_require__.e("webpack_sharing_consume_default_carbon_react_carbon_react-webpack_sharing_consume_default_ope-d17401"), __webpack_require__.e("webpack_sharing_consume_default_rxjs_rxjs-webpack_sharing_consume_default_single-spa-react_si-f2a261"), __webpack_require__.e("node_modules_openmrs_node_modules_css-loader_dist_runtime_api_js-node_modules_openmrs_node_mo-8f1e4b")]).then(() => (() => (__webpack_require__(/*! ../../node_modules/@openmrs/esm-framework/src/internal.ts */ "../../node_modules/@openmrs/esm-framework/src/internal.ts"))))));
/******/ 					register("@openmrs/esm-patient-common-lib", "10.2.0", () => (Promise.all([__webpack_require__.e("vendors-node_modules_swr_dist_index_index_mjs"), __webpack_require__.e("vendors-node_modules_lodash-es_uniqBy_js"), __webpack_require__.e("webpack_sharing_consume_default_react_react"), __webpack_require__.e("webpack_sharing_consume_default_lodash-es_lodash-es-webpack_sharing_consume_default_swr_immut-59a49d"), __webpack_require__.e("webpack_sharing_consume_default_carbon_react_carbon_react-webpack_sharing_consume_default_ope-d17401"), __webpack_require__.e("esm-patient-common-lib_src_nav-group_DashboardGroupExtension_tsx"), __webpack_require__.e("webpack_sharing_consume_default_openmrs_esm-patient-common-lib_openmrs_esm-patient-common-lib"), __webpack_require__.e("node_modules_openmrs_node_modules_css-loader_dist_runtime_api_js-node_modules_openmrs_node_mo-fee2c0")]).then(() => (() => (__webpack_require__(/*! ../esm-patient-common-lib/src/index.ts */ "../esm-patient-common-lib/src/index.ts"))))));
/******/ 					register("dayjs", "1.11.18", () => (__webpack_require__.e("node_modules_dayjs_dayjs_min_js").then(() => (() => (__webpack_require__(/*! ../../node_modules/dayjs/dayjs.min.js */ "../../node_modules/dayjs/dayjs.min.js"))))));
/******/ 					register("lodash-es", "4.17.21", () => (Promise.all([__webpack_require__.e("vendors-node_modules_lodash-es_uniqBy_js"), __webpack_require__.e("vendors-node_modules_lodash-es_lodash_js"), __webpack_require__.e("node_modules_lodash-es__baseGetTag_js-node_modules_lodash-es_isArray_js-node_modules_lodash-e-7aa194")]).then(() => (() => (__webpack_require__(/*! ../../node_modules/lodash-es/lodash.js */ "../../node_modules/lodash-es/lodash.js"))))));
/******/ 					register("react-i18next", "11.18.6", () => (Promise.all([__webpack_require__.e("vendors-node_modules_react-i18next_dist_es_index_js"), __webpack_require__.e("webpack_sharing_consume_default_react_react")]).then(() => (() => (__webpack_require__(/*! ../../node_modules/react-i18next/dist/es/index.js */ "../../node_modules/react-i18next/dist/es/index.js"))))));
/******/ 					register("react-router-dom", "6.30.1", () => (Promise.all([__webpack_require__.e("vendors-node_modules_react-dom_index_js"), __webpack_require__.e("vendors-node_modules_react-router-dom_dist_index_js"), __webpack_require__.e("webpack_sharing_consume_default_react_react")]).then(() => (() => (__webpack_require__(/*! ../../node_modules/react-router-dom/dist/index.js */ "../../node_modules/react-router-dom/dist/index.js"))))));
/******/ 					register("react", "18.3.1", () => (__webpack_require__.e("vendors-node_modules_react_index_js").then(() => (() => (__webpack_require__(/*! ../../node_modules/react/index.js */ "../../node_modules/react/index.js"))))));
/******/ 					register("rxjs", "6.6.7", () => (__webpack_require__.e("vendors-node_modules_rxjs__esm5_index_js").then(() => (() => (__webpack_require__(/*! ../../node_modules/rxjs/_esm5/index.js */ "../../node_modules/rxjs/_esm5/index.js"))))));
/******/ 					register("single-spa-react", "6.0.2", () => (__webpack_require__.e("node_modules_single-spa-react_lib_esm_single-spa-react_js").then(() => (() => (__webpack_require__(/*! ../../node_modules/single-spa-react/lib/esm/single-spa-react.js */ "../../node_modules/single-spa-react/lib/esm/single-spa-react.js"))))));
/******/ 					register("single-spa", "6.0.3", () => (__webpack_require__.e("vendors-node_modules_single-spa_lib_es2015_esm_single-spa_dev_js").then(() => (() => (__webpack_require__(/*! ../../node_modules/single-spa/lib/es2015/esm/single-spa.dev.js */ "../../node_modules/single-spa/lib/es2015/esm/single-spa.dev.js"))))));
/******/ 					register("swr/immutable", "2.3.6", () => (Promise.all([__webpack_require__.e("vendors-node_modules_swr_dist_index_index_mjs"), __webpack_require__.e("webpack_sharing_consume_default_react_react"), __webpack_require__.e("node_modules_swr_dist_immutable_index_mjs-_98200")]).then(() => (() => (__webpack_require__(/*! ../../node_modules/swr/dist/immutable/index.mjs */ "../../node_modules/swr/dist/immutable/index.mjs"))))));
/******/ 					register("swr/infinite", "2.3.6", () => (Promise.all([__webpack_require__.e("vendors-node_modules_swr_dist_index_index_mjs"), __webpack_require__.e("vendors-node_modules_swr_dist_infinite_index_mjs"), __webpack_require__.e("webpack_sharing_consume_default_react_react")]).then(() => (() => (__webpack_require__(/*! ../../node_modules/swr/dist/infinite/index.mjs */ "../../node_modules/swr/dist/infinite/index.mjs"))))));
/******/ 				}
/******/ 				break;
/******/ 			}
/******/ 			if(!promises.length) return initPromises[name] = 1;
/******/ 			return initPromises[name] = Promise.all(promises).then(() => (initPromises[name] = 1));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		// eslint-disable-next-line no-unused-vars
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results);
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							},
/******/ 							[])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/consumes */
/******/ 	(() => {
/******/ 		var parseVersion = (str) => {
/******/ 			// see webpack/lib/util/semver.js for original code
/******/ 			var p=p=>{return p.split(".").map((p=>{return+p==p?+p:p}))},n=/^([^-+]+)?(?:-([^+]+))?(?:\+(.+))?$/.exec(str),r=n[1]?p(n[1]):[];return n[2]&&(r.length++,r.push.apply(r,p(n[2]))),n[3]&&(r.push([]),r.push.apply(r,p(n[3]))),r;
/******/ 		}
/******/ 		var versionLt = (a, b) => {
/******/ 			// see webpack/lib/util/semver.js for original code
/******/ 			a=parseVersion(a),b=parseVersion(b);for(var r=0;;){if(r>=a.length)return r<b.length&&"u"!=(typeof b[r])[0];var e=a[r],n=(typeof e)[0];if(r>=b.length)return"u"==n;var t=b[r],f=(typeof t)[0];if(n!=f)return"o"==n&&"n"==f||("s"==f||"u"==n);if("o"!=n&&"u"!=n&&e!=t)return e<t;r++}
/******/ 		}
/******/ 		var rangeToString = (range) => {
/******/ 			// see webpack/lib/util/semver.js for original code
/******/ 			var r=range[0],n="";if(1===range.length)return"*";if(r+.5){n+=0==r?">=":-1==r?"<":1==r?"^":2==r?"~":r>0?"=":"!=";for(var e=1,a=1;a<range.length;a++){e--,n+="u"==(typeof(t=range[a]))[0]?"-":(e>0?".":"")+(e=2,t)}return n}var g=[];for(a=1;a<range.length;a++){var t=range[a];g.push(0===t?"not("+o()+")":1===t?"("+o()+" || "+o()+")":2===t?g.pop()+" "+g.pop():rangeToString(t))}return o();function o(){return g.pop().replace(/^\((.+)\)$/,"$1")}
/******/ 		}
/******/ 		var satisfy = (range, version) => {
/******/ 			// see webpack/lib/util/semver.js for original code
/******/ 			if(0 in range){version=parseVersion(version);var e=range[0],r=e<0;r&&(e=-e-1);for(var n=0,i=1,a=!0;;i++,n++){var f,s,g=i<range.length?(typeof range[i])[0]:"";if(n>=version.length||"o"==(s=(typeof(f=version[n]))[0]))return!a||("u"==g?i>e&&!r:""==g!=r);if("u"==s){if(!a||"u"!=g)return!1}else if(a)if(g==s)if(i<=e){if(f!=range[i])return!1}else{if(r?f>range[i]:f<range[i])return!1;f!=range[i]&&(a=!1)}else if("s"!=g&&"n"!=g){if(r||i<=e)return!1;a=!1,i--}else{if(i<=e||s<g!=r)return!1;a=!1}else"s"!=g&&"n"!=g&&(a=!1,i--)}}var t=[],o=t.pop.bind(t);for(n=1;n<range.length;n++){var u=range[n];t.push(1==u?o()|o():2==u?o()&o():u?satisfy(u,version):!o())}return!!o();
/******/ 		}
/******/ 		var ensureExistence = (scopeName, key) => {
/******/ 			var scope = __webpack_require__.S[scopeName];
/******/ 			if(!scope || !__webpack_require__.o(scope, key)) throw new Error("Shared module " + key + " doesn't exist in shared scope " + scopeName);
/******/ 			return scope;
/******/ 		};
/******/ 		var findVersion = (scope, key) => {
/******/ 			var versions = scope[key];
/******/ 			var key = Object.keys(versions).reduce((a, b) => {
/******/ 				return !a || versionLt(a, b) ? b : a;
/******/ 			}, 0);
/******/ 			return key && versions[key]
/******/ 		};
/******/ 		var findSingletonVersionKey = (scope, key) => {
/******/ 			var versions = scope[key];
/******/ 			return Object.keys(versions).reduce((a, b) => {
/******/ 				return !a || (!versions[a].loaded && versionLt(a, b)) ? b : a;
/******/ 			}, 0);
/******/ 		};
/******/ 		var getInvalidSingletonVersionMessage = (scope, key, version, requiredVersion) => {
/******/ 			return "Unsatisfied version " + version + " from " + (version && scope[key][version].from) + " of shared singleton module " + key + " (required " + rangeToString(requiredVersion) + ")"
/******/ 		};
/******/ 		var getSingleton = (scope, scopeName, key, requiredVersion) => {
/******/ 			var version = findSingletonVersionKey(scope, key);
/******/ 			return get(scope[key][version]);
/******/ 		};
/******/ 		var getSingletonVersion = (scope, scopeName, key, requiredVersion) => {
/******/ 			var version = findSingletonVersionKey(scope, key);
/******/ 			if (!satisfy(requiredVersion, version)) warn(getInvalidSingletonVersionMessage(scope, key, version, requiredVersion));
/******/ 			return get(scope[key][version]);
/******/ 		};
/******/ 		var getStrictSingletonVersion = (scope, scopeName, key, requiredVersion) => {
/******/ 			var version = findSingletonVersionKey(scope, key);
/******/ 			if (!satisfy(requiredVersion, version)) throw new Error(getInvalidSingletonVersionMessage(scope, key, version, requiredVersion));
/******/ 			return get(scope[key][version]);
/******/ 		};
/******/ 		var findValidVersion = (scope, key, requiredVersion) => {
/******/ 			var versions = scope[key];
/******/ 			var key = Object.keys(versions).reduce((a, b) => {
/******/ 				if (!satisfy(requiredVersion, b)) return a;
/******/ 				return !a || versionLt(a, b) ? b : a;
/******/ 			}, 0);
/******/ 			return key && versions[key]
/******/ 		};
/******/ 		var getInvalidVersionMessage = (scope, scopeName, key, requiredVersion) => {
/******/ 			var versions = scope[key];
/******/ 			return "No satisfying version (" + rangeToString(requiredVersion) + ") of shared module " + key + " found in shared scope " + scopeName + ".\n" +
/******/ 				"Available versions: " + Object.keys(versions).map((key) => {
/******/ 				return key + " from " + versions[key].from;
/******/ 			}).join(", ");
/******/ 		};
/******/ 		var getValidVersion = (scope, scopeName, key, requiredVersion) => {
/******/ 			var entry = findValidVersion(scope, key, requiredVersion);
/******/ 			if(entry) return get(entry);
/******/ 			throw new Error(getInvalidVersionMessage(scope, scopeName, key, requiredVersion));
/******/ 		};
/******/ 		var warn = (msg) => {
/******/ 			if (typeof console !== "undefined" && console.warn) console.warn(msg);
/******/ 		};
/******/ 		var warnInvalidVersion = (scope, scopeName, key, requiredVersion) => {
/******/ 			warn(getInvalidVersionMessage(scope, scopeName, key, requiredVersion));
/******/ 		};
/******/ 		var get = (entry) => {
/******/ 			entry.loaded = 1;
/******/ 			return entry.get()
/******/ 		};
/******/ 		var init = (fn) => (function(scopeName, a, b, c) {
/******/ 			var promise = __webpack_require__.I(scopeName);
/******/ 			if (promise && promise.then) return promise.then(fn.bind(fn, scopeName, __webpack_require__.S[scopeName], a, b, c));
/******/ 			return fn(scopeName, __webpack_require__.S[scopeName], a, b, c);
/******/ 		});
/******/ 		
/******/ 		var load = /*#__PURE__*/ init((scopeName, scope, key) => {
/******/ 			ensureExistence(scopeName, key);
/******/ 			return get(findVersion(scope, key));
/******/ 		});
/******/ 		var loadFallback = /*#__PURE__*/ init((scopeName, scope, key, fallback) => {
/******/ 			return scope && __webpack_require__.o(scope, key) ? get(findVersion(scope, key)) : fallback();
/******/ 		});
/******/ 		var loadVersionCheck = /*#__PURE__*/ init((scopeName, scope, key, version) => {
/******/ 			ensureExistence(scopeName, key);
/******/ 			return get(findValidVersion(scope, key, version) || warnInvalidVersion(scope, scopeName, key, version) || findVersion(scope, key));
/******/ 		});
/******/ 		var loadSingleton = /*#__PURE__*/ init((scopeName, scope, key) => {
/******/ 			ensureExistence(scopeName, key);
/******/ 			return getSingleton(scope, scopeName, key);
/******/ 		});
/******/ 		var loadSingletonVersionCheck = /*#__PURE__*/ init((scopeName, scope, key, version) => {
/******/ 			ensureExistence(scopeName, key);
/******/ 			return getSingletonVersion(scope, scopeName, key, version);
/******/ 		});
/******/ 		var loadStrictVersionCheck = /*#__PURE__*/ init((scopeName, scope, key, version) => {
/******/ 			ensureExistence(scopeName, key);
/******/ 			return getValidVersion(scope, scopeName, key, version);
/******/ 		});
/******/ 		var loadStrictSingletonVersionCheck = /*#__PURE__*/ init((scopeName, scope, key, version) => {
/******/ 			ensureExistence(scopeName, key);
/******/ 			return getStrictSingletonVersion(scope, scopeName, key, version);
/******/ 		});
/******/ 		var loadVersionCheckFallback = /*#__PURE__*/ init((scopeName, scope, key, version, fallback) => {
/******/ 			if(!scope || !__webpack_require__.o(scope, key)) return fallback();
/******/ 			return get(findValidVersion(scope, key, version) || warnInvalidVersion(scope, scopeName, key, version) || findVersion(scope, key));
/******/ 		});
/******/ 		var loadSingletonFallback = /*#__PURE__*/ init((scopeName, scope, key, fallback) => {
/******/ 			if(!scope || !__webpack_require__.o(scope, key)) return fallback();
/******/ 			return getSingleton(scope, scopeName, key);
/******/ 		});
/******/ 		var loadSingletonVersionCheckFallback = /*#__PURE__*/ init((scopeName, scope, key, version, fallback) => {
/******/ 			if(!scope || !__webpack_require__.o(scope, key)) return fallback();
/******/ 			return getSingletonVersion(scope, scopeName, key, version);
/******/ 		});
/******/ 		var loadStrictVersionCheckFallback = /*#__PURE__*/ init((scopeName, scope, key, version, fallback) => {
/******/ 			var entry = scope && __webpack_require__.o(scope, key) && findValidVersion(scope, key, version);
/******/ 			return entry ? get(entry) : fallback();
/******/ 		});
/******/ 		var loadStrictSingletonVersionCheckFallback = /*#__PURE__*/ init((scopeName, scope, key, version, fallback) => {
/******/ 			if(!scope || !__webpack_require__.o(scope, key)) return fallback();
/******/ 			return getStrictSingletonVersion(scope, scopeName, key, version);
/******/ 		});
/******/ 		var installedModules = {};
/******/ 		var moduleToHandlerMapping = {
/******/ 			"webpack/sharing/consume/default/dayjs/dayjs": () => (loadSingletonVersionCheckFallback("default", "dayjs", [1,1], () => (__webpack_require__.e("node_modules_dayjs_dayjs_min_js").then(() => (() => (__webpack_require__(/*! dayjs */ "../../node_modules/dayjs/dayjs.min.js"))))))),
/******/ 			"webpack/sharing/consume/default/lodash-es/lodash-es": () => (loadSingletonVersionCheckFallback("default", "lodash-es", [1,4], () => (Promise.all([__webpack_require__.e("vendors-node_modules_lodash-es_uniqBy_js"), __webpack_require__.e("vendors-node_modules_lodash-es_lodash_js")]).then(() => (() => (__webpack_require__(/*! lodash-es */ "../../node_modules/lodash-es/lodash.js"))))))),
/******/ 			"webpack/sharing/consume/default/swr/immutable/swr/immutable": () => (loadSingletonVersionCheckFallback("default", "swr/immutable", [1,2], () => (__webpack_require__.e("node_modules_swr_dist_immutable_index_mjs-_98201").then(() => (() => (__webpack_require__(/*! swr/immutable */ "../../node_modules/swr/dist/immutable/index.mjs"))))))),
/******/ 			"webpack/sharing/consume/default/rxjs/rxjs": () => (loadSingletonVersionCheckFallback("default", "rxjs", [1,6], () => (__webpack_require__.e("vendors-node_modules_rxjs__esm5_index_js").then(() => (() => (__webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js"))))))),
/******/ 			"webpack/sharing/consume/default/single-spa/single-spa": () => (loadSingletonVersionCheckFallback("default", "single-spa", [1,6], () => (__webpack_require__.e("vendors-node_modules_single-spa_lib_es2015_esm_single-spa_dev_js").then(() => (() => (__webpack_require__(/*! single-spa */ "../../node_modules/single-spa/lib/es2015/esm/single-spa.dev.js"))))))),
/******/ 			"webpack/sharing/consume/default/single-spa-react/single-spa-react": () => (loadSingletonVersionCheckFallback("default", "single-spa-react", [1,6], () => (__webpack_require__.e("node_modules_single-spa-react_lib_esm_single-spa-react_js").then(() => (() => (__webpack_require__(/*! single-spa-react */ "../../node_modules/single-spa-react/lib/esm/single-spa-react.js"))))))),
/******/ 			"webpack/sharing/consume/default/swr/infinite/swr/infinite": () => (loadSingletonVersionCheckFallback("default", "swr/infinite", [1,2], () => (__webpack_require__.e("vendors-node_modules_swr_dist_infinite_index_mjs").then(() => (() => (__webpack_require__(/*! swr/infinite */ "../../node_modules/swr/dist/infinite/index.mjs"))))))),
/******/ 			"webpack/sharing/consume/default/react/react": () => (loadSingletonVersionCheckFallback("default", "react", [1,18], () => (__webpack_require__.e("vendors-node_modules_react_index_js").then(() => (() => (__webpack_require__(/*! react */ "../../node_modules/react/index.js"))))))),
/******/ 			"webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework": () => (loadSingletonVersionCheckFallback("default", "@openmrs/esm-framework", [1,6], () => (Promise.all([__webpack_require__.e("vendors-node_modules_swr_dist_index_index_mjs"), __webpack_require__.e("vendors-node_modules_carbon_icons-react_es_Icon_js-node_modules_carbon_icons-react_es_iconPro-cf7878"), __webpack_require__.e("vendors-node_modules_react-dom_index_js"), __webpack_require__.e("vendors-node_modules_carbon_icons-react_es_generated_bucket-11_js-node_modules_carbon_icons-r-a40530"), __webpack_require__.e("vendors-node_modules_openmrs_esm-framework_src_internal_ts"), __webpack_require__.e("webpack_sharing_consume_default_lodash-es_lodash-es-webpack_sharing_consume_default_swr_immut-59a49d"), __webpack_require__.e("webpack_sharing_consume_default_dayjs_dayjs"), __webpack_require__.e("webpack_sharing_consume_default_rxjs_rxjs-webpack_sharing_consume_default_single-spa-react_si-f2a261")]).then(() => (() => (__webpack_require__(/*! @openmrs/esm-framework */ "../../node_modules/@openmrs/esm-framework/src/internal.ts"))))))),
/******/ 			"webpack/sharing/consume/default/react-router-dom/react-router-dom": () => (loadSingletonVersionCheckFallback("default", "react-router-dom", [1,6], () => (Promise.all([__webpack_require__.e("vendors-node_modules_react-dom_index_js"), __webpack_require__.e("vendors-node_modules_react-router-dom_dist_index_js")]).then(() => (() => (__webpack_require__(/*! react-router-dom */ "../../node_modules/react-router-dom/dist/index.js"))))))),
/******/ 			"webpack/sharing/consume/default/react-i18next/react-i18next": () => (loadSingletonVersionCheckFallback("default", "react-i18next", [1,11], () => (__webpack_require__.e("vendors-node_modules_react-i18next_dist_es_index_js").then(() => (() => (__webpack_require__(/*! react-i18next */ "../../node_modules/react-i18next/dist/es/index.js"))))))),
/******/ 			"webpack/sharing/consume/default/@carbon/react/@carbon/react": () => (loadSingletonVersionCheckFallback("default", "@carbon/react", [1,1], () => (Promise.all([__webpack_require__.e("vendors-node_modules_carbon_icons-react_es_Icon_js-node_modules_carbon_icons-react_es_iconPro-cf7878"), __webpack_require__.e("vendors-node_modules_react-dom_index_js"), __webpack_require__.e("vendors-node_modules_carbon_icons-react_es_generated_bucket-11_js-node_modules_carbon_icons-r-a40530"), __webpack_require__.e("vendors-node_modules_carbon_icons-react_es_generated_bucket-1_js"), __webpack_require__.e("vendors-node_modules_carbon_icons-react_es_generated_bucket-19_js"), __webpack_require__.e("vendors-node_modules_carbon_react_es_index_js")]).then(() => (() => (__webpack_require__(/*! @carbon/react */ "../../node_modules/@carbon/react/es/index.js"))))))),
/******/ 			"webpack/sharing/consume/default/@openmrs/esm-patient-common-lib/@openmrs/esm-patient-common-lib": () => (loadSingletonVersionCheckFallback("default", "@openmrs/esm-patient-common-lib", [0], () => (Promise.all([__webpack_require__.e("vendors-node_modules_swr_dist_index_index_mjs"), __webpack_require__.e("vendors-node_modules_lodash-es_uniqBy_js"), __webpack_require__.e("webpack_sharing_consume_default_lodash-es_lodash-es-webpack_sharing_consume_default_swr_immut-59a49d"), __webpack_require__.e("esm-patient-common-lib_src_nav-group_DashboardGroupExtension_tsx")]).then(() => (() => (__webpack_require__(/*! @openmrs/esm-patient-common-lib */ "../esm-patient-common-lib/src/index.ts")))))))
/******/ 		};
/******/ 		var initialConsumes = ["webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework","webpack/sharing/consume/default/@openmrs/esm-patient-common-lib/@openmrs/esm-patient-common-lib","webpack/sharing/consume/default/react/react","webpack/sharing/consume/default/react-i18next/react-i18next","webpack/sharing/consume/default/@carbon/react/@carbon/react","webpack/sharing/consume/default/react-router-dom/react-router-dom"];
/******/ 		initialConsumes.forEach((id) => {
/******/ 			__webpack_require__.m[id] = (module) => {
/******/ 				// Handle case when module is used sync
/******/ 				installedModules[id] = 0;
/******/ 				delete __webpack_require__.c[id];
/******/ 				var factory = moduleToHandlerMapping[id]();
/******/ 				if(typeof factory !== "function") throw new Error("Shared module is not available for eager consumption: " + id);
/******/ 				module.exports = factory();
/******/ 			}
/******/ 		});
/******/ 		var chunkMapping = {
/******/ 			"webpack_sharing_consume_default_dayjs_dayjs": [
/******/ 				"webpack/sharing/consume/default/dayjs/dayjs"
/******/ 			],
/******/ 			"webpack_sharing_consume_default_lodash-es_lodash-es-webpack_sharing_consume_default_swr_immut-59a49d": [
/******/ 				"webpack/sharing/consume/default/lodash-es/lodash-es",
/******/ 				"webpack/sharing/consume/default/swr/immutable/swr/immutable"
/******/ 			],
/******/ 			"webpack_sharing_consume_default_rxjs_rxjs-webpack_sharing_consume_default_single-spa-react_si-f2a261": [
/******/ 				"webpack/sharing/consume/default/rxjs/rxjs",
/******/ 				"webpack/sharing/consume/default/single-spa/single-spa",
/******/ 				"webpack/sharing/consume/default/single-spa-react/single-spa-react",
/******/ 				"webpack/sharing/consume/default/swr/infinite/swr/infinite"
/******/ 			],
/******/ 			"webpack_sharing_consume_default_react_react": [
/******/ 				"webpack/sharing/consume/default/react/react"
/******/ 			],
/******/ 			"webpack_sharing_consume_default_carbon_react_carbon_react-webpack_sharing_consume_default_ope-d17401": [
/******/ 				"webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework",
/******/ 				"webpack/sharing/consume/default/react-router-dom/react-router-dom",
/******/ 				"webpack/sharing/consume/default/react-i18next/react-i18next",
/******/ 				"webpack/sharing/consume/default/@carbon/react/@carbon/react"
/******/ 			],
/******/ 			"webpack_sharing_consume_default_openmrs_esm-patient-common-lib_openmrs_esm-patient-common-lib": [
/******/ 				"webpack/sharing/consume/default/@openmrs/esm-patient-common-lib/@openmrs/esm-patient-common-lib"
/******/ 			]
/******/ 		};
/******/ 		__webpack_require__.f.consumes = (chunkId, promises) => {
/******/ 			if(__webpack_require__.o(chunkMapping, chunkId)) {
/******/ 				chunkMapping[chunkId].forEach((id) => {
/******/ 					if(__webpack_require__.o(installedModules, id)) return promises.push(installedModules[id]);
/******/ 					var onFactory = (factory) => {
/******/ 						installedModules[id] = 0;
/******/ 						__webpack_require__.m[id] = (module) => {
/******/ 							delete __webpack_require__.c[id];
/******/ 							module.exports = factory();
/******/ 						}
/******/ 					};
/******/ 					var onError = (error) => {
/******/ 						delete installedModules[id];
/******/ 						__webpack_require__.m[id] = (module) => {
/******/ 							delete __webpack_require__.c[id];
/******/ 							throw error;
/******/ 						}
/******/ 					};
/******/ 					try {
/******/ 						var promise = moduleToHandlerMapping[id]();
/******/ 						if(promise.then) {
/******/ 							promises.push(installedModules[id] = promise.then(onFactory)['catch'](onError));
/******/ 						} else onFactory(promise);
/******/ 					} catch(e) { onError(e); }
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = __webpack_require__.hmrS_jsonp = __webpack_require__.hmrS_jsonp || {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(!/^webpack_sharing_consume_default_(carbon_react_carbon_react\-webpack_sharing_consume_default_ope\-d17401|dayjs_dayjs|lodash\-es_lodash\-es\-webpack_sharing_consume_default_swr_immut\-59a49d|openmrs_esm\-patient\-common\-lib_openmrs_esm\-patient\-common\-lib|react_react|rxjs_rxjs\-webpack_sharing_consume_default_single\-spa\-react_si\-f2a261)$/.test(chunkId)) {
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		var currentUpdatedModulesList;
/******/ 		var waitingUpdateResolves = {};
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			currentUpdatedModulesList = updatedModulesList;
/******/ 			return new Promise((resolve, reject) => {
/******/ 				waitingUpdateResolves[chunkId] = resolve;
/******/ 				// start update chunk loading
/******/ 				var url = __webpack_require__.p + __webpack_require__.hu(chunkId);
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				var loadingEnded = (event) => {
/******/ 					if(waitingUpdateResolves[chunkId]) {
/******/ 						waitingUpdateResolves[chunkId] = undefined
/******/ 						var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 						var realSrc = event && event.target && event.target.src;
/******/ 						error.message = 'Loading hot update chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 						error.name = 'ChunkLoadError';
/******/ 						error.type = errorType;
/******/ 						error.request = realSrc;
/******/ 						reject(error);
/******/ 					}
/******/ 				};
/******/ 				__webpack_require__.l(url, loadingEnded);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		globalThis["webpackHotUpdate_openmrs_esm_patient_chart_app"] = (chunkId, moreModules, runtime) => {
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = moreModules[moduleId];
/******/ 					if(currentUpdatedModulesList) currentUpdatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 			if(waitingUpdateResolves[chunkId]) {
/******/ 				waitingUpdateResolves[chunkId]();
/******/ 				waitingUpdateResolves[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.jsonpHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.jsonp = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.jsonp = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.jsonpHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = () => {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((response) => {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunk_openmrs_esm_patient_chart_app"] = globalThis["webpackChunk_openmrs_esm_patient_chart_app"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__("../../node_modules/openmrs/node_modules/webpack-dev-server/client/index.js?protocol=ws%3A&hostname=0.0.0.0&port=7001&pathname=%2Fws&logging=info&overlay=true&reconnect=10&hot=true&live-reload=true");
/******/ 	__webpack_require__("../../node_modules/openmrs/node_modules/webpack/hot/dev-server.js");
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.js.map