(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Copyright (C) 2015 yanni4night.com
 * bigpipe.js
 *
 * changelog
 * 2015-10-22[18:21:01]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

'use strict';

var extend = require('./extend');
var loader = require('./loader');

var allJs = [];

var Pagelet = function(config) {
  var id = config.id;
  var css = config.css || [];
  var js = config.js || [];
  var content = config.content || '';

  var targetElement = document.getElementById(id);
  loader.load(css).then(function() {
    targetElement.innerHTML = content;
    allJs = allJs.concat(js);
  }).catch(function() {
    console.log('id:' + id + ' error')
  });
};

var TBP = function(config) {
  if (!this instanceof TBP) {
    return new TBP(config);
  }
  new Pagelet(config);
};

extend(TBP, {
  view: function(config) {
    return new TBP(config);
  }
});

window.TBP = TBP;
},{"./extend":2,"./loader":3}],2:[function(require,module,exports){
/**
  * Copyright (C) 2014 yanni4night.com
  * extend.js
  *
  * changelog
  * 2015-10-25[20:47:36]:revised
  *
  * @author ljharb
  * @version 0.1.0
  * @since 0.1.0
  * @see https://github.com/justmoon/node-extend
  */


'use strict';
 
var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
 
var isArray = function isArray(arr) {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(arr);
    }
 
    return toStr.call(arr) === '[object Array]';
};
 
var isPlainObject = function isPlainObject(obj) {
    if (!obj || toStr.call(obj) !== '[object Object]') {
        return false;
    }
 
    var hasOwnConstructor = hasOwn.call(obj, 'constructor');
    var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
    // Not own constructor property must be Object
    if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
        return false;
    }
 
    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.
    var key;
    for (key in obj) {/**/}
 
    return typeof key === 'undefined' || hasOwn.call(obj, key);
};
 
module.exports = function extend() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0],
        i = 1,
        length = arguments.length,
        deep = false;
 
    // Handle a deep copy situation
    if (typeof target === 'boolean') {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2;
    } else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
        target = {};
    }
 
    for (; i < length; ++i) {
        options = arguments[i];
        // Only deal with non-null/undefined values
        if (options != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];
 
                // Prevent never-ending loop
                if (target !== copy) {
                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && isArray(src) ? src : [];
                        } else {
                            clone = src && isPlainObject(src) ? src : {};
                        }
 
                        // Never move original objects, clone them
                        target[name] = extend(deep, clone, copy);
 
                    // Don't bring in undefined values
                    } else if (typeof copy !== 'undefined') {
                        target[name] = copy;
                    }
                }
            }
        }
    }
 
    // Return the modified object
    return target;
};

},{}],3:[function(require,module,exports){
/**
 * Copyright (C) 2014 yanni4night.com
 * loader.js
 *
 * changelog
 * 2015-10-25[22:59:03]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

var doc = window.document;
var head = doc.head || doc.getElementsByTagName('head')[0];

var createElement = function(tag) {
    return doc.createElement(tag);
};

var resetEvents = function(ele, cb) {
    ele.onload = ele.onerror = ele.onreadystatechange = null;

    if (ele.removeEventListener && cb) {
        ele.removeEventListener('load', cb);
    }
};

function loadStyle(src, timeout) {

    var timeout = parseInt(timeout, 10);
    if (isNaN(timeout)) {
        timeout = 5e3;
    }

    return new Promise(function(resolve, reject) {
        var link = createElement('link');
        link.rel = "stylesheet";
        link.type = "text/css";

        var listener;

        link.onload = function() {
            resolve();
            resetEvents(link);
        };

        link.onreadystatechange = function() {
            var state = link.readyState;
            if ('complete' === state || 'loaded' === state) {
                resetEvents(link);
                resolve();
            } else if ('error' === state) {
                resetEvents(link);
                reject();
            }
        };

        link.onerror = function() {
            resetEvents(link);
            reject();
        };

        if (link.addEventListener) {
            link.addEventListener('load', listener = function() {
                resetEvents(link, listener);
                resolve();
            }, false);
        }

        setTimeout(function() {
            resetEvents(link);
            reject();
        }, timeout);

        link.href = src;
        head.appendChild(link);
    });
}

function loadScript(src, timeout) {

    var timeout = parseInt(timeout, 10);
    if (isNaN(timeout)) {
        timeout = 5e3;
    }

    return new Promise(function(resolve, reject) {
        var link = createElement('script');
        link.charset = "UTF-8";
        link.type = "text/javascript";

        var listener;

        link.onload = function() {
            resolve();
            resetEvents(link);
        };

        link.onreadystatechange = function() {
            var state = link.readyState;
            if ('complete' === state || 'loaded' === state) {
                resetEvents(link);
                resolve();
            } else if ('error' === state) {
                resetEvents(link);
                reject();
            }
        };

        link.onerror = function() {
            resetEvents(link);
            reject();
        };

        if (link.addEventListener) {
            link.addEventListener('load', listener = function() {
                resetEvents(link, listener);
                resolve();
            }, false);
        }

        setTimeout(function() {
            resetEvents(link);
            reject();
        }, timeout);

        link.href = src;
        head.appendChild(link);
    });
}


module.exports = {
    load: function(src, timeout) {

        // Make 'src' an array
        if (({}).toString.call(src) !== '[object Array]') {
            src = [src];
        }

        var promises = [],
            promise;

        for (var i = 0; i < src.length; ++i) {
            if (/\.js$/i.test(src)) {
                promise = loadScript(src, timeout);
            } else if (/\.css$/i.test(src)) {
                promise = loadStyle(src, timeout);
            } else {
                promise = new Promise(function(resolve, reject) {
                    resolve();
                });
            }
            promises.push(promise);
        }

        return Promise.all(promises);
    }
};
},{}]},{},[1]);
