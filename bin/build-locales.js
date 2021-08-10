#!/usr/bin/env node

const { writeFile, unlink } = require('fs');
const { promisify } = require('util');
const { resolve: resolvePath } = require('path');

const $writeFile = promisify(writeFile);
const $unlink = promisify(unlink);

const cldr = require('cldr');
const pLimit = require('p-limit');
const del = require('del');
const { js: beautifyJs } = require('js-beautify');


const concurrency = 16;
const destinationPath = resolvePath(`${__dirname}/../locales`);
const { localeIds } = cldr;


(async function buildLocales() {

  // Deleting content of the destination directory,
  // but not the directory itself
  await del([
    `${destinationPath}/**`,
    `!${destinationPath}/`
  ]);

  const limit = pLimit(concurrency);

  const tasks = localeIds.map(localeId => (
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

  const outputFile = resolvePath(`${__dirname}/../docs/locales.md`);

  try {
    await $unlink(outputFile);

  } catch {
    // Ignoring errors…
  }

  const lines = [
    `# List of locales supported by Time Delta\n`,
    `Right now **${localeIds.length}** locales are supported.\n`,
    `Locale |`,
    `--- |`,
  ];

  lines.push(...localeIds.map(
    localeId => `[${localeId}](../locales/${localeId}.js) |`
  ));

  await $writeFile(outputFile, lines.join("\n"));

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

  for (const type of types) {

    if (!unitPatterns[type]) {
      continue;
    }

    data[type] = (data[type] || {});

    for (const field of fields) {
      const [key1, key2] = field;
      data[type][key1] = unitPatterns[type].unit['duration' + key2];
    }

  }

  return data;

}
