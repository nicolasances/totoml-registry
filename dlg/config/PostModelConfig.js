var mongo = require('mongodb');
var config = require('../../config');
var converter = require('./Converter');

var MongoClient = mongo.MongoClient;

exports.do = function(request) {

  let body = request.body;

  return new Promise(function(success, failure) {

    // Some validation
    if (!request.params.modelName) {failure({code: 400, message: 'Missing "modelName" path param.'}); return;}

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      updateModelConfig = converter.updateModelConfig(body)

      db.db(config.dbName).collection(config.collections.modelConfig).updateOne({modelName: request.params.modelName}, updateModelConfig, {upsert: true}, function(err, res) {

        db.close();
        
        success(data)

      });
    });
  });
}
