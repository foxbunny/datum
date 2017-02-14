# DatumJS

DatumJS is a library of abstractions for working with dates in JavaScript.
Unlike most date libraries (e.g., moment) this library is not concerned with the
human-facing aspects of dates (formatting, parsing, etc). It's main purpose is
to complement the native `Date` objects to provide higher-level data
abstractions for working with dates, and related concepts (e.g., weeks, months).

This library can be used for many things but it was mainly developed as a
building block for calendars and datepickers.

## Utility functions

The following are utility functions provided by the library.

**NOTE:** Functions that take more than 2 arguments are auto-curried. This means
that they will return a partially applied version of the function whenever less
than the maximum number of arguments is passed.

### `datum.resetTime(d)`

Returns a copy of a `Date` object with time set to midnight local time.

The input `Date` object is not modified in any way.

```javascript
datum.resetTime(new Date(2017, 1, 14, 11, 30, 2));
// => Date(2017, 1, 14, 0, 0, 0)
```

### `datum.diff(d1, d2)`

Returns the absolute difference between two `Date` objects in milliseconds.

```javascript
datum.diff(new Date(2017, 1, 14, 11, 30, 2), new Date(2017, 3, 12, 10, 0, 2));
// => 4924800000
datum.diff(new Date(2017, 3, 12, 10, 0, 2), new Date(2017, 1, 14, 11, 30, 2));
// => 4924800000
```

### `datum.shiftDate(n, d)`

Returns a `Date` object representing the input `Date` object shifted by the
specified number of days. Shifting is done towards future, where positive `n`
shifts by adding, and negative by subtracting.

The input `Date` object is not modified.

```javascript
datum.shiftDate(12, new Date(2017, 8, 2));
// => Date(2017, 8, 14, 0, 0, 0)
```