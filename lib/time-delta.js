//==============//
// DEPENDENCIES //
//==============//

var extend = require('xtend');
var numerous = require('numerous');


//================//
// MODULE GLOBALS //
//================//

var timeUnits = [
  ['seconds', 1000],
  ['minutes',   60],
  ['hours',     60],
  ['days',      24],
  ['weeks',      7],
  ['months',     4],
  ['years',     12]
];

var defaultConfig = {
  locale: 'en',
  span: 2,
  delimiter: ', ',
  unitType: 'long',
  unitTypeLookupOrder: ['long', 'short', 'narrow']
};

var locales = {};

initTimeUnits();

//===============//
// NODE EXPOSURE //
//===============//

module.exports = {
  addLocale: addLocale,
  create: factory
};


//===========//
// FUNCTIONS //
//===========//

/**
 * Returns true if specified locale is loaded, false otherwise.
 *
 * @param {string} locale
 *
 * @returns {boolean}
 */
function hasLocale (locale) {
  return ('undefined' !== typeof locales[locale]);
}


/**
 * Adds pluralization function for specified locale.
 * Usually externally called by locale itself.
 *
 * @param {string} locale
 * @param {function} callable
 */
function addLocale (locale, callable) {
  locales[locale] = callable;
}


/**
 * Checks if locale is loaded. If not, tries to load it.
 *
 * @param {string} locale
 */
function checkLocale (locale) {
  if (!hasLocale(locale)) {
    requireLocale(locale);
  }
}


/**
 * Tries to load the specified locale.
 *
 * @param {string} locale
 */
function requireLocale (locale) {
  try {
    require('../locales/' + locale + '.js');
  } catch (error) {
    throw Error('Failed to load the following locale: ' + locale);
  }
}


/**
 * Creates new instance.
 *
 * @param {object} config
 *
 * @returns {object}
 */
function factory (config) {

  // Initializing config by extending default one.
  config = extend({}, defaultConfig, config);

  // Making sure config is correct.
  validateConfig(config);

  return {

    /**
     * Public proxy for internal format function.
     *
     * @param {Date} firstDate
     * @param {Date} secondDate
     * @param {object} options
     *
     * @returns {string}
     */
    format: function (firstDate, secondDate, options) {

      // Allowing to override config with each individual call.
      options = extend({}, config, options);

      // Making sure config is correct.
      validateConfig(options);

      return format(firstDate, secondDate, options);
    }

  };

}


/**
 * Makes sure that specified config is correct.
 * Throws errors in case of a trouble. Returns nothing.
 *
 * @param {object} config
 */
function validateConfig (config) {
  // @todo: implement this!
}


/**
 * Calculating absolute millisecond value for each
 * time unit.
 */
function initTimeUnits () {
  var divider = 1;
  timeUnits.forEach(function (unit) {
    divider = divider * unit[1];
    unit[1] = divider;
  });
  timeUnits.reverse();
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
function format (firstDate, secondDate, config) {

  checkLocale(config.locale);

  // Handling input arguments.
  // -----

  if (!firstDate) {
    throw new Error('Missing first date');
  }

  if (!secondDate) {
    throw new Error('Missing second date');
  }

  // Calculating.
  // -----

  var difference = getDifference(firstDate, secondDate);
  var parts = [];
  difference.some(function (unit) {
    var name = unit[0];
    var value = unit[1];
    if (value > 0) {
      parts.push(pluralize(name, value, config));
    }
    if (parts.length >= config.span) {
      // Breaking the loop.
      return true;
    }
  });

  // Returning the string value.
  return parts.join(config.delimiter);
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
function pluralize (unit, value, config) {
  var unitTypeData = getLocaleDataForUnitType(config);
  var unitString = numerous.pluralize(
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
function getLocaleDataForUnitType (config) {

  var localeData = locales[config.locale];

  // Making a copy of array from config.
  var lookupOrder = config.unitTypeLookupOrder.slice();

  // Adding interested type to the top.
  lookupOrder.unshift(config.unitType);

  // Making sure only unique items are present.
  lookupOrder = arrayUnique(lookupOrder);

  var unitTypeData = null;
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
 * Returns difference as separate time units.
 *
 * @param {Date} firstDate
 * @param {Date} secondDate
 *
 * @returns {Array}
 */
function getDifference (firstDate, secondDate) {
  var difference = secondDate - firstDate;
  var results = [];
  timeUnits.some(function (unit) {
    var name = unit[0];
    var divider = unit[1];
    var value = Math.floor(difference / divider);
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
 * Returns array with only unique items.
 *
 * @param {Array} array
 *
 * @returns {Array}
 */
function arrayUnique (array) {
  return array.filter(function(item, pos, self) {
    return (self.indexOf(item) == pos);
  });
}
