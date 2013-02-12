var mongoose = require('mongoose');

var Adapter = function(opts) {};

Adapter.prototype.connect = function(cb) {
    this.conn = mongoose.createConnection('localhost', dbname, function(err)
    if (err) {
        console.error('error connecting to mongodb, is it running?');
        return cb(err);
    }
};

module.exports = Adapter;



