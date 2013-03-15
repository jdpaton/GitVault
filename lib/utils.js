var uuid = require('node-uuid');

exports.mergeRecursive = function(obj1, obj2) {

  for (var p in obj2.value) {
    try {
      // Property in destination object set; update its value.
      if ( obj2.value[p].constructor === Object ) {
        obj1[p] = mergeRecursive(obj1[p], obj2.value[p]);
      } else {
        obj1[p] = obj2.value[p];

      }

    } catch(e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2.value[p];

    }
  }
  return obj1;
}

exports.generateID = function() {
  return uuid.v1().replace('-','');
}
