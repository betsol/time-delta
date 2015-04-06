#!/usr/bin/env node

var cldr = require('cldr');
var fs = require('fs');
var beautify = require('node-beautify').beautifyJs;
var async = require('async');

var tasks = [];
var supportedLocales = [];

cldr.localeIds.some(function (locale) {

  console.log('Loading data for locale: ' + locale);

  var data = extractLocaleData(locale);

  // @todo: make sure that locale is actually supported.
  // Right now CLDR module always returns some data
  // even for missing locale.
  // https://github.com/papandreou/node-cldr/issues/23
  supportedLocales.push(locale);

  // Adding task to a list.
  (function (locale, data) {
    tasks.push(function (callback) {
      writeDataToFileForLocale(locale, data, callback);
    });
  })(locale, data);

});

// Running all tasks in parallel.
async.parallel(tasks, function (error, results) {
  if (error) {
    console.log(error);
  } else {
    buildListOfSupportedLocales(function (error) {
      if (error) {
        console.log(error);
      } else {
        console.log('Locales built successfully');
      }
    });
  }
});


//===========//
// FUNCTIONS //
//===========//

function writeDataToFileForLocale (locale, data, callback) {

  // Building the source.
  var source =
    "var timeDelta = require('../lib/time-delta.js');" +
    "timeDelta.addLocale('" + locale + "', " + JSON.stringify(data) + ");"
  ;

  // Beautifying the source.
  source = beautify(source);

  // Writing source to a file.
  var path = './locales/' + locale + '.js';
  fs.writeFile(path, source, function (error) {
    if (error) {
      callback(error);
    }
    console.log('Data written to file for locale: ' + locale);
    callback();
  });

}

function buildListOfSupportedLocales (callback) {

  var source =
    '# List of locales supported by Time Delta' + "\n\n" +
    'Right now **' + supportedLocales.length + '** locales are supported.' + "\n\n" +
    'Locale |' + "\n" +
    '--- |' + "\n"
  ;

  supportedLocales.forEach(function (locale) {
    source += '[' + locale + '](../locales/' + locale + '.js)' + ' |' + "\n";
  });

  fs.writeFile('./docs/locales.md', source, function (error) {
    if (error) {
      callback(error);
    }
    console.log('List of locales created');
    callback();
  });
}

/**
 * Extracts date and time localization data for specified locale from CLDR.
 *
 * @param {string} locale
 * @returns {object}
 */
function extractLocaleData (locale) {

  var types = ['long', 'narrow', 'short'];

  var fields = [
    ['years',   'Year'],
    ['months',  'Month'],
    ['weeks',   'Week'],
    ['days',    'Day'],
    ['hours',   'Hour'],
    ['minutes', 'Minute'],
    ['seconds', 'Second']
  ];

  var data = {};
  var unitPatterns = cldr.extractUnitPatterns(locale);

  types.forEach(function (type) {
    fields.forEach(function (field) {
      var key1 = field[0];
      var key2 = field[1];
      if ('undefined' === typeof data[type]) {
        data[type] = {};
      }
      if ('undefined' === typeof unitPatterns[type]) {
        // Continue.
        return;
      }
      data[type][key1] = unitPatterns[type].unit['duration' + key2];
    });
  });

  return data;
}
