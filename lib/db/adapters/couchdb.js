var cradle = require('cradle');

var Adapter = function(opts) {
  for( var opt in opts){
    this[opt] = opts[opt];
  }
};

Adapter.prototype.connect = function(cb) {
   this.conn = new(cradle.Connection);
   this.db = this.conn.database('gitvault');
   var self = this;

   this.db.exists(function (err, exists) {
    if (err) {
      cb(err);
    } else if (exists) {
      cb();
    } else {
      self.db.create(function(){

        self.db.save('_design/project', {
          views: {
            enabled: {
              map: 'function (doc) { if (doc.enabled === true) { emit(doc._id, doc) } }'
            }
          }
        }, function(err,res){
          console.log('Database Error: ', err, res);
          cb()
        });
      });

    }
  });;

};

module.exports = Adapter;



