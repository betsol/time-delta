#!/usr/bin/env node

const { writeFile } = require('fs');
const { promisify } = require('util');
const { resolve: resolvePath } = require('path');

const $writeFile = promisify(writeFile);

const cldr = require('cldr');
const { js: beautifyJs } = require('js-beautify');
const pLimit = require('p-limit');
const del = require('del');


const concurrency = 16;
const destinationPath = resolvePath(`${__dirname}/../locales`);


(async function buildLocales() {

  // Deleting content of the destination directory,
  // but not the directory itself
  await del([
    `${destinationPath}/**`,
    `!${destinationPath}/`
  ]);

  const limit = pLimit(concurrency);

  const tasks = cldr.localeIds.map(localeId => (
    limit(() => {
      console.log(`Processing locale: ${localeId}`);
      const data = extractLocaleData(localeId);
      writeLocaleFile(localeId, data);
    })
  ));

  // Running tasks concurrently
  await Promise.all(tasks);

  await buildListOfLocales();

  console.log('Locales built successfully');

})();


//===========//
// FUNCTIONS //
//===========//

async function writeLocaleFile(locale, data) {

  // Building the source
  let source = (
    `module.exports = ${JSON.stringify({ id: locale, data })};`
  );

  source = beautifyJs(source, {
    indent_size: 2,
    end_with_newline: true,
    preserve_newlines: true,
  });

  const outputPath = `${destinationPath}/${locale}.js`;

  // Writing source to a file
  await $writeFile(outputPath, source);

  console.log('Data written to file for locale: ' + locale);

}

async function buildListOfLocales() {

  let source =
    '# List of locales supported by Time Delta' + "\n\n" +
    'Right now **' + locales.length + '** locales are supported.' + "\n\n" +
    'Locale |' + "\n" +
    '--- |' + "\n"
  ;

  locales.forEach(function (locale) {
    source += '[' + locale + '](../locales/' + locale + '.js)' + ' |' + "\n";
  });

  await $writeFile('./docs/locales.md', source);

  console.log('List of locales created');

}

/**
 * Extracts date and time localization data for specified locale from CLDR.
 *
 * @param {string} locale
 * @returns {object}
 */
function extractLocaleData(locale) {

  const types = ['long', 'narrow', 'short'];

  const fields = [
    ['years', 'Year'],
    ['months', 'Month'],
    ['weeks', 'Week'],
    ['days', 'Day'],
    ['hours', 'Hour'],
    ['minutes', 'Minute'],
    ['seconds', 'Second']
  ];

  const data = {};
  const unitPatterns = cldr.extractUnitPatterns(locale);

  types.forEach(function (type) {
    fields.forEach(function (field) {
      const key1 = field[0];
      const key2 = field[1];
      if ('undefined' === typeof data[type]) {
        data[type] = {};
      }
      if ('undefined' === typeof unitPatterns[type]) {
        // Continue
        return;
      }
      data[type][key1] = unitPatterns[type].unit['duration' + key2];
    });
  });

  return data;
}
