
//==============//
// DEPENDENCIES //
//==============//

const numerous = require('numerous');
const isNode = require('is-node');


//================//
// MODULE GLOBALS //
//================//

/**
 * Pre-calculating millisecond values for each time unit.
 */
const timeUnits = [
  ['years', 12 * 4 * 7 * 24 * 60 * 60 * 1000],
  ['months', 4 * 7 * 24 * 60 * 60 * 1000],
  ['weeks', 7 * 24 * 60 * 60 * 1000],
  ['days', 24 * 60 * 60 * 1000],
  ['hours', 60 * 60 * 1000],
  ['minutes', 60 * 1000],
  ['seconds', 1000],
];

const defaultConfig = {
  locale: 'en',
  span: 2,
  delimiter: ', ',
  unitType: 'long',
  unitTypeLookupOrder: ['long', 'short', 'narrow'],
  autoloadLocales: true,
};

/**
 * Contains data of loaded locales.
 * @type {Object}
 */
const locales = {};


//=========//
// EXPORTS //
//=========//

module.exports = {
  create: timeDeltaFactory,
  addLocale,
  defaultConfig,
};


//===========//
// FUNCTIONS //
//===========//

/**
 * Adds pluralization data for the specified locale.
 * Should be called in browser.
 *
 * @param {Object|Object[]} localeData
 */
function addLocale(localeData) {

  // Normalizing input
  if (!Array.isArray(localeData)) {
    localeData = [localeData];
  }

  for (const item of localeData) {
    const { id, data } = item;
    locales[id] = data;
  }

}


/**
 * Creates new instance.
 *
 * @param {object?} config
 *
 * @returns {object}
 */
function timeDeltaFactory(config) {

  // Initializing config by extending the default one
  config = Object.assign({}, defaultConfig, config || {});

  return {

    /**
     * Public proxy for internal format function.
     *
     * @param {Date} firstDate
     * @param {Date} secondDate
     * @param {object?} options
     *
     * @returns {string}
     */
    format: function (firstDate, secondDate, options) {

      // Allowing to override config with each individual call
      options = Object.assign({}, config, options || {});

      return format(firstDate, secondDate, options);

    }

  };

}


/**
 * Returns difference between two dates as a text string.
 *
 * @param {Date} firstDate
 * @param {Date} secondDate
 * @param {object} config
 *
 * @returns {string}
 */
function format(firstDate, secondDate, config) {

  ensureLocaleLoadedOrThrow(config.locale, {
    autoload: config.autoloadLocales,
  });

  // Handling input arguments
  // -----

  if (!firstDate) {
    throw new Error('Missing first date argument');
  }

  if (!secondDate) {
    throw new Error('Missing second date argument');
  }

  // Calculating
  // -----

  const difference = getDifference(firstDate, secondDate);
  const parts = [];

  for (const unit of difference) {
    const [name, value] = unit;
    if (value > 0) {
      parts.push(pluralize(name, value, config));
    }
    if (parts.length >= config.span) {
      break;
    }
  }

  // Returning the string value
  return parts.join(config.delimiter);

}


/**
 * Checks if locale is loaded. If not, tries to load it in Node.js,
 * or throws and error in Browser.
 *
 * @param {string} locale
 * @param {Object?} options
 */
function ensureLocaleLoadedOrThrow(locale, options) {

  const { autoload } = options;

  if (hasLocale(locale)) {
    return;
  }

  if (isNode && autoload) {
    requireLocale(locale);

  } else {
    throw new Error(
      `Missing locale: ${locale}, you must load it manually before using it`
    );
  }

}


/**
 * Returns true if specified locale is loaded, false otherwise.
 *
 * @param {string} localeId
 *
 * @returns {boolean}
 */
function hasLocale(localeId) {
  return Boolean(locales[localeId]);
}

/**
 * Tries to load the specified locale.
 *
 * @param {string} localeId
 */
function requireLocale(localeId) {
  try {
    addLocale(
      require(`../locales/${localeId}.js`)
    );

  } catch (error) {
    throw Error(`Failed to load locale: ${localeId}`);

  }
}


/**
 * Returns difference as separate time units.
 *
 * @param {Date} firstDate
 * @param {Date} secondDate
 *
 * @returns {Array}
 */
function getDifference(firstDate, secondDate) {
  let difference = (secondDate - firstDate);
  const results = [];
  timeUnits.some(function (unit) {
    const name = unit[0];
    const divider = unit[1];
    const value = Math.floor(difference / divider);
    difference -= value * divider;
    results.push([name, value]);
    if (difference <= 0) {
      // Breaking the loop.
      return true;
    }
  });
  return results;
}

/**
 * Returns localized and pluralized time unit.
 *
 * @param {string} unit
 * @param {int} value
 * @param {object} config
 *
 * @returns {string}
 */
function pluralize(unit, value, config) {
  const unitTypeData = getLocaleDataForUnitType(config);
  const unitString = numerous.pluralize(
    config.locale,
    value,
    unitTypeData[unit]
  );
  return unitString.replace('{0}', value);
}


/**
 * Returns locale data for preferred unit type.
 *
 * @param {object} config
 *
 * @returns {Array}
 */
function getLocaleDataForUnitType(config) {

  const localeData = locales[config.locale];

  // Making a copy of array from config.
  let lookupOrder = config.unitTypeLookupOrder.slice();

  // Adding interested type to the top.
  lookupOrder.unshift(config.unitType);

  // Making sure only unique items are present.
  lookupOrder = arrayUnique(lookupOrder);

  let unitTypeData = null;
  lookupOrder.some(function (unitType) {
    if ('undefined' !== typeof localeData[unitType]) {
      unitTypeData = localeData[unitType];
      // Breaking the loop.
      return true;
    }
  });

  if (null === unitTypeData) {
    throw new Error('Can not find any unit type data for locale: ' + config.locale);
  }

  return unitTypeData;
}

/**
 * Returns array with only unique items.
 *
 * @param {Array} array
 *
 * @returns {Array}
 */
function arrayUnique(array) {
  return Array.from(
    new Set(array)
  );
}
