var Knwl = require('../knwl.js');

var knwl = new Knwl('english');

knwl.init('What if I go to the united states tomorrow?');

console.log(knwl.get('places'));