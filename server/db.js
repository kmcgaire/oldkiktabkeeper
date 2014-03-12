/**
 * Created by kevinmcgaire on 3/11/2014.
 */

var mongojs = require('mongojs');

var db = mongojs('tabkeeper');

module.exports = db;
