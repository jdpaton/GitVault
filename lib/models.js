var mongoose = require('mongoose');
var db = require('../lib/db');

// Repo
// ----
var schema = mongoose.Schema({ 
  name: { type: String, required: true },
  enabled: {type: Boolean, default: true},
  URI: { type: String, required: true },
  lastBackup: Date,
  failedBackups: Number,
  currentStatus: Number,
  backupMethod: String,
  backupFrequency: String,
  bundlePath: String,
  lastHEAD: String
});

//schema.virtual('validate.uri').get(function(){
//  return true;
//});

exports.Project = db.model('Project', schema);
