var datum = require('./datum');

test('Week creates a week object from a date', function () {
  var w = new datum.Week(2017, 1, 12);
});

test('Week has an array of dates', function () {
  var w = new datum.Week(2017, 1, 12);
  var d0 = w.days[0];
  var d6 = w.days[6];
  expect(w.days.length).toBe(7);
  expect(d0.getDay()).toBe(0);
  expect(d6.getDay()).toBe(6);
  expect(d0.getDate()).toBe(12);
  expect(d6.getDate()).toBe(18);
});

test('Week has start and end', function () {
  var w = new datum.Week(2016, 9, 20);
  expect(w.start.getDay()).toBe(0);
  expect(w.end.getDay()).toBe(6);
  expect(w.start.getDate()).toBe(16);
  expect(w.end.getDate()).toBe(22);
});

test('Number of days in a week can be customized', function () {
  var w = new datum.Week(2016, 9, 20, {
    daysPerWeek: 5
  });
  expect(w.days.length).toBe(5);
  expect(w.start.getDate()).toBe(16);
  expect(w.end.getDate()).toBe(20);
});

test('Week day offset formula can be changed', function () {
  var w = new datum.Week(2016, 9, 20, {
    weekDayOffset: datum.weekDayOffset(1)
  });
  expect(w.start.getDate()).toBe(17);
  expect(w.end.getDate()).toBe(23);
});

test('Week object can be decorated arbitrarily', function () {
  var w = new datum.Week(2017, 1, 15, {
    decorate: function (week) { week.foo = 'bar'; }
  });
  expect(w.foo).toEqual('bar');
});

test('Week.factory can be used to create custom week factories', function () {
  var wf = datum.Week.factory({
    decorate: function (week) { week.foo = 'bar'; }
  });
  var w = wf(2017, 1, 15);
  expect(w.foo).toEqual('bar');
});
