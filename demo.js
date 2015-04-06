var timeDelta = require('./lib/time-delta.js');

var instance = timeDelta.create({
  locale: 'en' // default
});

var date1 = new Date('2015-04-01T21:00:00');
var date2 = new Date('2015-04-01T23:17:10');
var date3 = new Date('2016-07-12T14:10:10');


// Outputs: "2 hours, 17 minutes".
console.log(instance.format(date1, date2));


// Outputs: "2 hours, 17 minutes, 10 seconds".
console.log(instance.format(date1, date2, {
  span: 3
}));


// Outputs: "2 hr, 17 min, 10 sec".
console.log(instance.format(date1, date2, {
  span: 3,
  unitType: 'short'
}));


// Outputs: "2h 17m 10s".
console.log(instance.format(date1, date2, {
  span: 3,
  unitType: 'narrow',
  delimiter: ' '
}));


// Outputs: "1 yr, 4 mths".
console.log(instance.format(date1, date3, {
  unitType: 'short',
  span: 2 // default
}));


// Outputs: "1 year, 4 months, 2 weeks, 5 days, 17 hours, 10 minutes, 10 seconds".
console.log(instance.format(date1, date3, {
  unitType: 'long', // default
  span: 7
}));


// Outputs: "2 часа; 17 минут; 10 секунд".
console.log(instance.format(date1, date2, {
  locale: 'ru',
  span: 3,
  unitType: 'long', // default
  delimiter: '; '
}));
