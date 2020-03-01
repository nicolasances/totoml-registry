var mongo = require('mongodb');
var config = require('../../config');
var converter = require('./Converter');

var MongoClient = mongo.MongoClient;

exports.do = function(request) {

  return new Promise(function(success, failure) {

    // Some validation
    if (!request.params.modelName) {failure({code: 400, message: 'Missing "modelName" in the path.'}); return;}

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      db.db(config.dbName).collection(config.collections.retrained).find({modelName: request.params.modelName}).toArray(function(err, array) {

        db.close();

        if (array == null || array.length == 0) {
          success({})
          return;
        }

        success(converter.retrainedTO(array[0]));

      });
    });
  });

}
