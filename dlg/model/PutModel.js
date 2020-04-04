var mongo = require('mongodb');
var config = require('../../config');
var converter = require('./Converter');
var getModel = require('./GetModel');

var MongoClient = mongo.MongoClient;

exports.do = function(request) {

  let body = request.body;

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      updateModel = converter.updateModel(body)

      db.db(config.dbName).collection(config.collections.models).updateOne({name: body.name}, updateModel, function(err, res) {

        db.close();
        
        success(res)
      });
    });
  });
}
