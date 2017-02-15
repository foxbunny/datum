# DatumJS

DatumJS is a library of abstractions for working with dates in JavaScript.
Unlike most date libraries (e.g., moment) this library is not concerned with the
human-facing aspects of dates (formatting, parsing, etc). It's main purpose is
to complement the native `Date` objects to provide higher-level data
abstractions for working with dates, and related concepts (e.g., weeks, months).

This library can be used for many things but it was mainly developed as a
building block for calendars and datepickers.

## Working with weeks

The `datum.Week` constructor is used to create `Week` object which represent a
single week. The constructor takes four arguments. The three required arguments
are `year`, `month`, and `date`. They should be the same values used by the
3-argument version of the `Date` constructor call. The fourth optional argument
is an `options` object which is used to customize the `Week` objects.

At its simplest, a `Week` object is creted like so:

```javascript
var w = new datum.Week(2017, 1, 15);
```

The `Week` objects are constructed from the given date such that the result is a
week that contains the specified date. The date does not have to be the start or
end day of the week.

Each week object has `start`, `end`, and `days` properties, which, respectively,
represent the `Date` object of the first day of the week, `Date` object of the
last day of the week, and an array of days belonging to that week.

```javascript
w.start
// => Date(2017, 1, 12, 0, 0, 0)
w.end
// => Date(2017, 1, 18, 0, 0, 0)
w.days
// => [Date(2017, 1, 12, 0, 0, 0), Date(2017, 1, 13, 0, 0, 0), ..., Date(2017, 1, 18, 0, 0, 0)]
```

By default, week objects start on Sunday (JavaScript default). This can be
customized by passing in an `options` object that has a `weekDayOffset`
function. This function takes a `Date` object and returns its index within the
week, where 0 is the first day, and 6 the last. For convenience,
`datum.weekDayOffset()` function can be used to create such functions. Here is
an example for a week that starts on Monday:

```javascript
var wm = new datum.Week(2017, 1, 15, { weekDayOffset: datum.weekDayOffset(1) });
wm.start
// => Date(2017, 1, 13, 0, 0, 0)
wm.end
// => Date(2017, 1, 19, 0, 0, 0)
```

In some situations, it may be necessary to limit the week to a certain set of
days. For instance, we may wish to exclude weekends. The desired number of days
per week can be customized using the `daysPerWeek` option, which should be an
integer. The following example represents a week only containing the work days.

```javascript
var wwo = new datum.Week(2017, 1, 15, {
  daysPerWeek: 5,
  weekDayOffset: datum.weekDayOffset(1)
});
wwo.start
// => Date(2017, 1, 13, 0, 0, 0)
wwo.end
// => Date(2017, 1, 17, 0, 0, 0)
wwo.days.length
// => 5
```

When using the `daysPerWeek` option, as long as the supplied is within the 7 day
period between start and end days, the supplied date is not necessarily included
in the range of dates represented by the `Week` object. For instance, given a
week that starts on Monday, and `daysPerWeek` of 5, we can supply a Sunday as
the input, and this date will not be found in the `days` array beause it does
not fit the 5-day window.

```javascript
var wwo = new datum.Week(2017, 1, 18, {
  daysPerWeek: 5,
  weekDayOffset: datum.weekDayOffset(1)
});
wwo.days.map(function (date) { return date.getDate(); });
// => [ 13, 14, 15, 16, 17 ]
```

The `Week` object in its default form does not provide many pieces of
information that may be critical for your particular use case. For example, it
does not provide information about ISO week number. This is by design. Rather
than writing a library that will satisfy a large number of use cases out fo the
box, we opted for a lightweight library that can be easily extended to include
such cases. The `decorate` option can be used for just that.

In the following example, we will add an `isoWeek` property to a `Week` object
by using a simple decorator. ISO weeks start on Monday, so we will also
customize the `weekDayOffset` option as well.

```javascript
var monWeek = datum.weekDayOffset(1);
var monWeekStart = datum.weekStart(monWeek);

function firstIsoWeekStart(year) {
  // A week that contains January 4th of the given year
  return monWeekStart(new Date(year, 0, 4));
}

function isoWeek(date) {
  // NOTE: Naive calculation, does not worry about edge cases
  var year = date.getFullYear();
  return datum.diff(firstIsoWeekStart(year), date).days / 7 + 1;
}

var w = new datum.Week(2017, 1, 15, {
  weekDayOffset: monWeek,
  decorate: function (week) {
    week.isoWeek = isoWeek(week.start);
  }
});

w.isoWeek
// => 7
```

It may seem cumbersome that you need to supply the options every time you want
to create a week object like the one in the example. To address this, the `Week`
constructor has a `Week.factory()` function which takes an options object and
returns a function that returns `Week` objects with just the `year`, `month`,
and `date` arguments. For example:

```javascript
var isoWeeks = datum.Week.factory({
  weekDayOffset: monWeek,
  decorate: function (week) {
    week.isoWeek = isoWeek(week.start);
  }
});

w = isoWeeks(2017, 1, 15);
w.isoWeek
// => 7
```

`isoWeek` is not a constructor so `new` keyword is not required when invoking
it.

## Utility functions

The following are utility functions provided by the library.

**NOTE:** Functions that take more than 2 arguments are auto-curried. This means
that they will return a partially applied version of the function whenever less
than the maximum number of arguments is passed.

### `datum.resetTime(date)`

Returns a copy of a `Date` object with time set to midnight local time.

The input `Date` object is not modified in any way.

```javascript
datum.resetTime(new Date(2017, 1, 14, 11, 30, 2));
// => Date(2017, 1, 14, 0, 0, 0)
```

### `datum.diff(date1, date2)`

Returns the absolute difference between two `Date` objects in milliseconds and
days. The return value is an object with `days` and `milliseconds` properties.
Since the return value is an absolute difference, the order of arguments does
not matter.

```javascript
datum.diff(new Date(2017, 1, 14, 11, 30, 2), new Date(2017, 3, 12, 10, 0, 2));
// => { days: 57, milliseconds: 4924800000 }
datum.diff(new Date(2017, 3, 12, 10, 0, 2), new Date(2017, 1, 14, 11, 30, 2));
// => { days: 57, milliseconds: 4924800000 }
```

### `datum.shiftDate(n, date)`

Returns a `Date` object representing the input `Date` object shifted by the
specified number of days. Shifting is done towards future, where positive `n`
shifts by adding, and negative by subtracting.

The input `Date` object is not modified.

```javascript
datum.shiftDate(12, new Date(2017, 8, 2));
// => Date(2017, 8, 14, 0, 0, 0)
```

### `datum.range(n, date)`

Returns an array of `Date` object starting on the date of the input `Date`
object `date`, and containig the specified number of days `n`.

```javascript
datum.range(4, new Date(2017, 3, 22, 12, 0, 3));
// => [
//   Date(2017, 3, 22, 0, 0, 0),
//   Date(2017, 3, 23, 0, 0, 0),
//   Date(2017, 3, 24, 0, 0, 0),
//   Date(2017, 3, 25, 0, 0, 0)
// ]
```

### `datum.weekDayOffset(n, date)`

Returns a function that calculates the index of a `Date` object's day of week
(Monday, Tuesday, etc) when the first day is at index `n`, where `n === 0` is
Sunday, and `n === 6` is Saturday.

```javascript
// What is the week day index of Wednesday, if first day of week is Monday?
datum.weekDayOffset(1, new Date(2017, 1, 15));
// => 2

// What is the week day index of Thursday if first day of week is Saturday?
datum.weekDayOffset(6, new Date(2017, 1, 16));
// => 5
```

## `datum.weekStart(offsetFn, date)`

Returns a `Date` object representing the first day of the week in which `date`
is at the index caluclated by the `offsetFn`. For convenience,
`datum.weekDayOffset()` function can be partially applied to supply the
appropriate `offsetFn` function.

```javascript
var offsetFromMonday = datum.weekDayOffset(1);
datum.weekStart(offsetFromMonday, new Date(2017, 5, 1));
// => Date(2017, 4, 29, 0, 0, 0)
```