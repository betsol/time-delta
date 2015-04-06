# Node Time Delta

[![npm version](https://badge.fury.io/js/time-delta.svg)][repo-npm]
[![Build Status](https://travis-ci.org/betsol/time-delta.svg)][travis]

Formats difference between two dates as a human-readable string in almost any language.

Examples:

- 2 hours, 17 minutes
- 2 hr, 17 min, 10 sec
- 2h 17m 10s
- 1 yr, 4 mths
- 1 year, 4 months, 2 weeks, 5 days, 17 hours, 10 minutes, 10 seconds
- 2 часа; 17 минут; 10 секунд


## Features

- Supports ~688 locales by means of [CLDR][lib-cldr] (built-in). See the [full list][locales]
- Provides three different time unit formats for each locale (`long`, `short`, `narrow`)
- Falls back to another unit type format if preferred one is not present in the target locale


## Usage

1. Require library
2. ???
3. Format!


### Examples

```javascript

var timeDelta = require('./lib/time-delta.js');

var instance = timeDelta.create({
  locale: 'en' // default
});

var date1 = new Date('2015-04-01T21:00:00');
var date2 = new Date('2015-04-01T23:17:10');

// Outputs: "2 hours, 17 minutes".
console.log(instance.format(date1, date2));

```

See [demo.js][demo] for more examples.


## Installation

It's exactly like you've already guessed:

`npm install --save time-delta` or `npm install --save-dev time-delta`.


## Configuration

The library accepts the following [configuration object][config]:

| Option              | Type                               | Default                                     | Description
|---------------------|------------------------------------|---------------------------------------------|-------------
| locale              | `string`                           | `'en'`                                      | Locale to use. See the [full list][locales]
| span                | `integer`                          | `2`                                         | How much time units to include in the result
| delimiter           | `string`                           | `', '`                                      | Delimiter to use between time units
| unitType            | `string`                           | `'long'`                                    | Unit type format. One of `long`, `short` or `narrow`
| unitTypeLookupOrder | `array`                            | `['long', 'short', 'narrow']`               | Unit type lookup order (used for fallback)

You can pass config to factory method during instantiation:

`var instance = timeDelta.create(myInstanceConfig);`

You can also specify it for each call to `format()`:

`instance.format(date1, date2, myCallConfig);`


## Changelog

Please see the [complete changelog][changelog] for list of changes.


## Contributors

This library was made possible by [it's contributors][contributors].


## Developer guide

Fork, clone, `npm install`.

- Use `make locales` to build the locales
- Use `make test` to test the library

If you do a PR, make sure to cover it with [tests][tests].


## Feedback

If you have found a bug or have another issue with the library —
please [create an issue][new-issue].

If you have a question regarding the library or it's integration with your project —
consider asking a question at [StackOverflow][so-ask] and sending me a
link via [E-Mail][email]. I will be glad to help.

Have any ideas or propositions? Feel free to contact me by [E-Mail][email].

Cheers!


## Support

If you like this library consider to add star on [GitHub repository][repo-gh]
and on [NPM][repo-npm].

Thank you!


## License

The MIT License (MIT)

Copyright (c) 2015 Slava Fomin II, BETTER SOLUTIONS

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


  [changelog]: changelog.md
  [contributors]: https://github.com/betsol/time-delta/graphs/contributors
  [so-ask]: http://stackoverflow.com/questions/ask?tags=angularjs,javascript,datetime,internationalization
  [email]: mailto:s.fomin@betsol.ru
  [new-issue]: https://github.com/betsol/time-delta/issues/new
  [locales]: docs/locales.md
  [demo]: demo.js
  [config]: demo.js
  [tests]: test/tests.js
  [lib-cldr]: https://github.com/papandreou/node-cldr
  [repo-gh]: https://github.com/betsol/time-delta
  [repo-npm]: https://www.npmjs.com/package/time-delta
  [travis]: https://travis-ci.org/betsol/time-delta
