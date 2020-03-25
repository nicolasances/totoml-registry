var mongo = require('mongodb');
var config = require('../../config');
var converter = require('./Converter');

var MongoClient = mongo.MongoClient;

exports.do = function(req) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      db.db(config.dbName).collection(config.collections.modelConfig).find().toArray(function(err, array) {

        db.close();

        if (array == null) {
          success({configs: []});
          return;
        }

        var configs = [];

        for (var i = 0; i < array.length; i++) {
          configs.push(converter.modelConfigTO(array[i]));
        }

        success({configs: configs});

      });
    });
  });

}
