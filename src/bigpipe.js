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