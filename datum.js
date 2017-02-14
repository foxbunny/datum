(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    factory(exports);
  } else {
    factory((window.datum = {}));
  }
})(function (datum) {
  'use strict';

  var DAY_MS = 24 * 60 * 60 * 1000;

  datum.resetTime = function (date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  datum.diff = curry(function (date1, date2) {
    var d1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    var d2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.abs(d2 - d1);
  });

  datum.shiftDate = curry(function (days, date) {
    var d = new Date(date.valueOf());
    d.setDate(d.getDate() + days);
    return d;
  });

  function curry(fn, args) {
    var arity = fn.length;
    if (arity === 0) return fn;
    return function () {
      var newArgs = (args || []).concat([].slice.call(arguments));
      if (newArgs.length >= arity) return fn.apply(null, newArgs);
      return curry(fn, newArgs);
    };
  }
});