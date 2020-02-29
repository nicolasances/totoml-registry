var mongo = require('mongodb');
var config = require('../../config');
var converter = require('./Converter');

var MongoClient = mongo.MongoClient;

exports.do = function(req) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      db.db(config.dbName).collection(config.collections.models).find(converter.find(req.query)).toArray(function(err, array) {

        db.close();

        if (array == null) {
          success({models: []});
          return;
        }

        var models = [];

        for (var i = 0; i < array.length; i++) {
          models.push(converter.modelTO(array[i]));
        }

        success({models: models});

      });
    });
  });

}
