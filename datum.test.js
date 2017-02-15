var datum = require('./datum');

test('resetTime zeroes out time on a Date object', function () {
  var d1 = new Date(2017, 4, 12, 12, 33, 0);
  var d2 = datum.resetTime(d1);
  expect(d2.getHours()).toBe(0);
  expect(d2.getMinutes()).toBe(0);
  expect(d2.getSeconds()).toBe(0);
});

test('resetTime returns a new Date instance', function () {
  var d1 = new Date(2017, 4, 12, 12, 33, 0);
  var d2 = datum.resetTime(d1);
  expect(d1).not.toBe(d2);
});

test('diff returns difference between two dates objects in ms', function () {
  var d1 = new Date(2017, 4, 12, 12, 33, 0);
  var d2 = new Date(2017, 4, 13, 5, 18, 0);
  expect(datum.diff(d1, d2)).toEqual({
    days: 1,
    milliseconds: 86400000
  });

  d1 = new Date(2017, 4, 12, 12, 33, 0);
  d2 = new Date(2017, 4, 14, 5, 18, 0);
  expect(datum.diff(d1, d2)).toEqual({
    days: 2,
    milliseconds: 172800000
  });
});

test('diff returns absolute difference', function () {
  var d1 = new Date(2017, 4, 12, 12, 33, 0);
  var d2 = new Date(2017, 4, 14, 5, 18, 0);
  expect(datum.diff(d1, d2)).toEqual({
    days: 2,
    milliseconds: 172800000
  });
  expect(datum.diff(d2, d1)).toEqual({
    days: 2,
    milliseconds: 172800000
  });
});

test('diff does not care about time', function () {
  var d1 = new Date(2017, 4, 12, 12, 33, 0);
  var d2 = new Date(2017, 4, 14, 5, 18, 0);
  var d3 = new Date(2017, 4, 14, 8, 18, 0);
  expect(datum.diff(d1, d2)).toEqual(datum.diff(d1, d3));
});

test('diff is curried', function () {
  var ref = new Date(2017, 4, 12, 12, 33, 0);
  var diffFromRef = datum.diff(ref);
  var d2 = new Date(2017, 4, 14, 5, 18, 0);
  var d3 = new Date(2017, 3, 5, 8, 18, 0);
  expect(diffFromRef(d2)).toEqual({
    days: 2,
    milliseconds: 172800000
  });
  expect(diffFromRef(d3)).toEqual({
    days: 37,
    milliseconds: 3196800000
  });
});

test('shiftDate returns a date object shifted by specified number of days', function () {
  var d1 = new Date(2017, 4, 3);
  var d2 = datum.shiftDate(12, d1);
  expect(d2.getFullYear()).toBe(2017);
  expect(d2.getMonth()).toBe(4);
  expect(d2.getDate()).toBe(15);
});

test('shiftDate can shift across months', function () {
  var d1 = new Date(2015, 6, 3);
  var d2 = datum.shiftDate(-4, d1);
  expect(d2.getFullYear()).toBe(2015);
  expect(d2.getMonth()).toBe(5);
  expect(d2.getDate()).toBe(29);
});

test('shiftDate can shift across years', function () {
  var d1 = new Date(2016, 1, 10);
  var d2 = datum.shiftDate(-100, d1);
  expect(d2.getFullYear()).toBe(2015);
  expect(d2.getMonth()).toBe(10);
  expect(d2.getDate()).toBe(2);
});

test('shiftDate is curried', function () {
  var nextDay = datum.shiftDate(1);
  var d1 = new Date(2016, 1, 16);
  var d2 = new Date(2016, 5, 22);
  expect(nextDay(d1).getDate()).toBe(17);
  expect(nextDay(d2).getDate()).toBe(23);
});

test('shiftDate returns a copy of the Date object', function () {
  var d1 = new Date(2016, 1, 16);
  var d2 = datum.shiftDate(1, d1);
  expect(d1).not.toBe(d2);
});

test('range returns an array of Date objects', function () {
  var start = new Date(2016, 2, 15);
  var dates = datum.range(2, start);
  expect(dates.length).toBe(2);
  expect(dates[0].getDate()).toBe(15);
  expect(dates[1].getDate()).toBe(16);
});

test('range returns an empty array, if number of days is 0', function () {
  var start = new Date(2016, 2, 15);
  var dates = datum.range(0, start);
  expect(dates).toEqual([]);
});

test('range returns dates in reverse if number of days is less than 0', function () {
  var start = new Date(2016, 2, 15);
  var dates = datum.range(-2, start);
  expect(dates[0].getDate()).toBe(15);
  expect(dates[1].getDate()).toBe(14);
});

test('weekDayOffset returns week day index at given offset', function () {
  var d = new Date(2017, 1, 15);  // day 3 when Sunday is 0
  expect(datum.weekDayOffset(1, d)).toBe(2);
  expect(datum.weekDayOffset(3, d)).toBe(0);
  expect(datum.weekDayOffset(5, d)).toBe(5);
});

test('weekDayOffset is curried', function () {
  var d = new Date(2017, 1, 15);  // day 3 when Sunday is 0
  var wdo = datum.weekDayOffset(5);
  expect(wdo(d)).toBe(5);
});

test('weekStart returns a date of the start of a week', function () {
  var d1 = new Date(2017, 1, 15);
  var d2 = new Date(2017, 1, 13);
  var start1 = datum.weekStart(datum.weekDayOffset(0), d1);
  expect(start1.getFullYear()).toBe(2017);
  expect(start1.getMonth()).toBe(1);
  expect(start1.getDate()).toBe(12);
  var start2 = datum.weekStart(datum.weekDayOffset(0), d2);
  expect(start2.getFullYear()).toBe(2017);
  expect(start2.getMonth()).toBe(1);
  expect(start2.getDate()).toBe(12);
});

test('weekStart is curried', function () {
  var ws = datum.weekStart(datum.weekDayOffset(0));
  var d1 = new Date(2017, 1, 15);
  var d2 = new Date(2017, 1, 13);
  expect(ws(d1).getDate()).toBe(12);
  expect(ws(d2).getDate()).toBe(12);
});
