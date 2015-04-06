
var expect = require('expect.js');

var timeDelta = require('../lib/time-delta.js');


describe('Time delta module', function () {

  it('exposes factory', function () {
    expect(timeDelta).to.have.property('create');
    expect(timeDelta.create).to.be.a('function');
  });

  it('initializes correctly', function () {
    var instance = timeDelta.create();
    expect(instance).to.be.an('object');
  });

  describe('instance', function () {

    var instance, date1, date2, delimiter, span;

    before(function () {

      // Difference between these two dates is:
      // 1 hour, 17 minutes and 03 seconds.
      date1 = new Date('2015-04-01T21:00:00');
      date2 = new Date('2015-04-01T22:17:03');

      delimiter = ',';
      span = 2;
      instance = timeDelta.create({
        span: span,
        delimiter: delimiter
      });
    });

    it('provides formatting function', function () {
      expect(instance).to.have.property('format');
    });

    describe('formatting function', function () {

      it('returns result as a string', function () {
        var result = instance.format(date1, date2);
        expect(result).to.be.a('string');
      });

      it('respects span option', function () {
        var span = 3;
        var result = instance.format(date1, date2, {
          span: span
        });
        var parts = result.split(delimiter);
        expect(parts).to.have.length(span);
      });

      it('pluralizes correctly with long English type', function () {
        // 1 hour, 17 minutes and 03 seconds.
        testUnitTypes(['hour', 'minutes'], {
          locale: 'en',
          unitType: 'long'
        });
      });

      it('pluralizes correctly with long Russian type', function () {
        // 1 hour, 17 minutes and 03 seconds.
        testUnitTypes(['час', 'минут', 'секунды'], {
          locale: 'ru'
        });
      });

      it('pluralizes correctly with short Russian type', function () {
        // 1 hour, 17 minutes and 03 seconds.
        testUnitTypes(['ч', 'мин', 'сек'], {
          locale: 'ru',
          unitType: 'short'
        });
      });

      it('pluralizes correctly with unit type fallback', function () {
        // 1 hour, 17 minutes and 03 seconds.
        testUnitTypes(['час', 'минут', 'секунды'], {
          locale: 'ru',
          unitType: 'missing',
          unitTypeLookupOrder: ['foo', 'bar', 'long']
        });
      });

      /**
       * Tests pluralized unit types.
       *
       * @param {Array} validUnits
       * @param {object} config
       */
      function testUnitTypes (validUnits, config) {
        var result = instance.format(date1, date2, config);
        var parts = result.split(delimiter);
        parts.forEach(function (part, key) {
          var subParts = part.split(' ');
          var timeUnit = subParts[1];
          expect(timeUnit).to.be(validUnits[key]);
        });
      }

    });

    it('provides formatting function', function () {
      expect(instance).to.have.property('format');
    });

  });

});
