'use strict';
var net = require('net');
var multilevel = require('multileve');

var db = multilevel.client();
db._separator = '~';
db._rangeLowerLimit = '!';
db._rangeUpperLimit = '~';
db._makeKey = makeKey;


var conn = net.connect(parseInt(process.env.DB_PORT_3001_TCP_PORT));
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
