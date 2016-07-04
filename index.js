var fs = require('fs');

var parser = require('./ai');

var tick = fs.readFileSync('./tick.ai', {encoding: 'utf8'});

var results = parser.parse(tick);

// console.log(results.summary);
//
// console.log(results.full);
