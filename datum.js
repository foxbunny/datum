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

  var resetTime = datum.resetTime = function (date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  var diff = datum.diff = curry(function (date1, date2) {
    var d1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    var d2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    var diffMs = Math.abs(d2 - d1);
    return {
      days: diffMs / DAY_MS,
      milliseconds: diffMs
    };
  });

  var shiftDate = datum.shiftDate = curry(function (days, date) {
    var d = new Date(date.valueOf());
    d.setDate(d.getDate() + days);
    return d;
  });

  var range = datum.range = curry(function (n, date) {
    if (n === 0) return [];
    date = datum.resetTime(date);
    var shiftBy = n < 0 ? -1 : 1;
    var count = Math.abs(n);
    return (function generateDates(acc, lastDate) {
      if (acc.length === count) return acc;
      var nextDate = shiftDate(shiftBy, lastDate);
      return generateDates(acc.concat(nextDate), nextDate);
    })([date], date);
  });

  var weekDayOffset = datum.weekDayOffset = curry(function (firstDayIndex, date) {
    var shifted = date.getDay() - firstDayIndex;
    return shifted < 0 ?
      7 + shifted
      : shifted;
  });

  var weekStart = datum.weekStart = curry(function (offsetFn, date) {
    return shiftDate(0 - offsetFn(date), date);
  });

  var DEFAULTS = {
    daysPerWeek: 7,
    weekDayOffset: weekDayOffset(0),
    decorate: function () {}
  };

  datum.Week = Week;

  function Week(year, month, date, options) {
    options = Object.assign({}, DEFAULTS, options || {});
    this.start = weekStart(options.weekDayOffset, new Date(year, month, date));
    this.days = range(options.daysPerWeek, this.start);
    this.end = last(this.days);
    options.decorate(this, year, month, date);
  }

  Week.factory = function (options) {
    return function (year, month, date) {
      return new Week(year, month, date, options);
    };
  };

  function curry(fn, args) {
    var arity = fn.length;
    if (arity === 0) return fn;
    return function () {
      var newArgs = (args || []).concat([].slice.call(arguments));
      if (newArgs.length >= arity) return fn.apply(null, newArgs);
      return curry(fn, newArgs);
    };
  }

  function last(a) {
    return a[a.length - 1];
  }
});
