var mongo = require('mongodb');
var config = require('../../config');
var converter = require('./Converter');

var MongoClient = mongo.MongoClient;

exports.do = function(req) {

  return new Promise(function(success, failure) {

    // Validation
    if (!req.params.modelName) {failure({code: 400, message: 'Missing the required path param  "modelName"'}); return;}

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      db.db(config.dbName).collection(config.collections.challengers).find(converter.find({modelName: req.params.modelName})).toArray(function(err, array) {

        db.close();

        if (array == null) {
          success({challengers: []});
          return;
        }

        var challengers = [];

        for (var i = 0; i < array.length; i++) {
          challengers.push(converter.challengerTO(array[i]));
        }

        success({challengers: challengers});

      });
    });
  });

}
