'use strict';
var net = require('net');
var multilevel = require('multilevel');

var db = multilevel.client();
db._separator = '~';
db._rangeLowerLimit = '!';
db._rangeUpperLimit = '~';
db._makeKey = makeKey;


var conn = net.connect({
  port: parseInt(process.env.DB_PORT_3001_TCP_PORT),
  host: process.env.DB_PORT_3001_TCP_ADDR
});

console.log('Connect to multilevel through ' + process.env.DB_PORT_3001_TCP_ADDR + ':' + process.env.DB_PORT_3001_TCP_PORT);
conn.pipe(db.createRpcStream()).pipe(conn);

module.exports = exports = db;

/**
 * makeKey -- Create a key prefix to be used by a given constructor.
 *
 * @param constructor{String} -- constructor function.
 * @return {String} -- prefix key.
 */
function makeKey(constructor) {
  return constructor.name.toLowerCase() + db._separator;
}
