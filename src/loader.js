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