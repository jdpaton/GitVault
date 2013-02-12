var rethink = require('rethinkdb');

var Adapter = function(opts) {

  for( opt in opts){
    this[opt] = opts[opt];
  }

};

Adapter.prototype.connect = function(cb) {
  var self = this;
  rethink.connect({ host: 'localhost', port: 28015 }, function(conn) {
    rethink.dbCreate(self.dbname).run();
    rethink.db(self.dbname).tableCreate('projects').run();
    conn.use(self.dbname);
  });

  this.conn = rethink;

};

module.exports = Adapter;



