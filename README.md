
# Time Delta

[![npm version](https://badge.fury.io/js/time-delta.svg)][repo-npm]
[![Build Status](https://api.travis-ci.com/betsol/time-delta.svg?branch=master)][travis]
[![CodeClimate maintainability](https://api.codeclimate.com/v1/badges/cbfb83afc478ed41797a/maintainability)][code-climate]

Formats difference between two dates as a human-readable string in almost any language.

## Example Output

- 2 hours, 17 minutes
- 2 hr, 17 min, 10 sec
- 2h 17m 10s
- 1 yr, 4 mths
- 1 year, 4 months, 2 weeks, 5 days, 17 hours, 10 minutes, 10 seconds
- 2 часа; 17 минут; 10 секунд


## Features

- Supports 789 locales by means of [CLDR][lib-cldr] (built-in). See the [full list][locales]
- Provides three different time unit formats for each locale: `long`, `short`, `narrow`
  (when supported by specific CLDR locale)
- Falls back to another unit type format if preferred one is not present in the target locale
- Supports both Node.js and browser environments
- All formatting aspects are customizable
- TypeScript support out of the box
- Minimal possible production dependencies


## Install

`npm install --save time-delta`


## Usage

### Node.js

In Node.js environment library will load requested locales automatically.

```js
const timeDelta = require('time-delta');

const instance = timeDelta.create({
  locale: 'en', // default
});

const date1 = new Date('2015-04-01T21:00:00');
const date2 = new Date('2015-04-01T23:17:10');

// Outputs: "2 hours, 17 minutes".
console.log(instance.format(date1, date2));

```

### Browser

In Browser environment you will need to load each locale manually.
This ensures minimal size of your application bundle.

```js
// Importing the library
import * as timeDelta from 'time-delta';

// Importing locales that you want to use
import enLocale from 'time-delta/locales/en';
import ruLocale from 'time-delta/locales/ru';

// Registering locale
timeDelta.addLocale(enLocale);

// You can register multiple locales
timeDelta.addLocale([enLocale, ruLocale]);

// Creating an instance
const instance = timeDelta.create({
  locale: 'en', // default
});

const date1 = new Date('2015-04-01T21:00:00');
const date2 = new Date('2015-04-01T23:17:10');

// Outputs: "2 hours, 17 minutes".
console.log(instance.format(date1, date2));

```


## Configuration

The library accepts the following [configuration object][config]:

| Option              | Type      | Default                       | Description
|---------------------|-----------|-------------------------------|-------------
| locale              | `string`  | `'en'`                        | Locale to use. See the [full list][locales]
| span                | `integer` | `2`                           | How much time units to include in the result
| delimiter           | `string`  | `', '`                        | Delimiter to use between time units
| unitType            | `string`  | `'long'`                      | Unit type format. One of `long`, `short` or `narrow`
| unitTypeLookupOrder | `array`   | `['long', 'short', 'narrow']` | Unit type lookup order (used for fallback)
| autoloadLocales     | `boolean` | `true`                        | Whether to auto-load locales in Node.js environment (doesn't work in browsers)

You can pass config to factory method during instantiation:

```js
const instance = timeDelta.create(config);
```

You can also specify it when calling the `format()` function:

```js
instance.format(date1, date2, config);
```

Instance-level config is automatically inherited when calling `format()`,
so you can customize the defaults.


## Changelog

Please see the [complete changelog][changelog] for list of changes.


## Contributors

- [Slava Fomin II](https://github.com/slavafomin) (author)


## Contributing

Fork, clone, `npm install`.

- Use `npm run build-locales` to download and build CLDR locales
- Use `npm run test` to test the library

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

If you like this library, consider to add star on [GitHub repository][repo-gh]
and on [NPM][repo-npm].

Thank you!


## License

The MIT License (MIT)

ⓒ 2015—2021 Slava Fomin II

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


  [changelog]: CHANGELOG.md
  [contributors]: https://github.com/betsol/time-delta/graphs/contributors
  [so-ask]: http://stackoverflow.com/questions/ask?tags=javascript,node.js,time,datediff
  [email]: mailto:s.fomin@betsol.ru
  [new-issue]: https://github.com/betsol/time-delta/issues/new
  [locales]: docs/locales.md
  [config]: https://github.com/betsol/time-delta/blob/master/lib/time-delta.js#L23
  [tests]: test/tests.js
  [lib-cldr]: https://github.com/papandreou/node-cldr
  [repo-gh]: https://github.com/betsol/time-delta
  [repo-npm]: https://www.npmjs.com/package/time-delta
  [travis]: https://travis-ci.com/github/betsol/time-delta
  [code-climate]: https://codeclimate.com/github/betsol/time-delta/maintainability
