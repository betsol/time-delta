
const expect = require('expect.js');

const timeDelta = require('../lib/time-delta.js');


describe('Time delta module', function () {

  it('exposes factory', function () {
    expect(timeDelta).to.have.property('create');
    expect(timeDelta.create).to.be.a('function');
  });

  it('initializes correctly', function () {
    const instance = timeDelta.create();
    expect(instance).to.be.an('object');
  });

  describe('instance', function () {

    let instance, date1, date2, delimiter, span;

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
        const result = instance.format(date1, date2);
        expect(result).to.be.a('string');
      });

      it('respects span option', function () {
        const span = 3;
        const result = instance.format(date1, date2, {
          span: span
        });
        const parts = result.split(delimiter);
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
        const result = instance.format(date1, date2, config);
        const parts = result.split(delimiter);
        parts.forEach(function (part, key) {
          const subParts = part.split(' ');
          const timeUnit = subParts[1];
          expect(timeUnit).to.be(validUnits[key]);
        });
      }

    });

    it('provides formatting function', function () {
      expect(instance).to.have.property('format');
    });

    it('satisfies test cases', () => {

      const date1 = new Date('2015-04-01T21:00:00');
      const date2 = new Date('2015-04-01T23:17:10');
      const date3 = new Date('2016-07-12T14:10:10');

      const instance = timeDelta.create({
        locale: 'en',
      });

      expect(instance.format(date1, date2, {
        span: 3,
      }))
        .to.equal('2 hours, 17 minutes, 10 seconds')
      ;

      expect(instance.format(date1, date2, {
        span: 3,
        unitType: 'short',
      }))
        .to.equal('2 hr, 17 min, 10 sec')
      ;

      expect(instance.format(date1, date2, {
        span: 3,
        unitType: 'narrow',
        delimiter: ' ',
      }))
        .to.equal('2h 17m 10s')
      ;

      expect(instance.format(date1, date3, {
        unitType: 'short',
        span: 2,
      }))
        .to.equal('1 yr, 4 mths')
      ;

      expect(instance.format(date1, date3, {
        unitType: 'long',
        span: 7,
      }))
        .to.equal(
          '1 year, 4 months, 2 weeks, 5 days, ' +
          '17 hours, 10 minutes, 10 seconds'
        )
      ;

      expect(instance.format(date1, date2, {
        locale: 'ru',
        span: 3,
        unitType: 'long',
        delimiter: '; ',
      }))
        .to.equal('2 часа; 17 минут; 10 секунд')
      ;

    });

  });

});
