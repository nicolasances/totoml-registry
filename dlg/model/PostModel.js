var mongo = require('mongodb');
var config = require('../../config');
var converter = require('./Converter');
var getModel = require('./GetModel');

var MongoClient = mongo.MongoClient;

exports.do = function(request) {

  let body = request.body;

  return new Promise(function(success, failure) {

    // Some validation
    if (!body.name) {failure({code: 400, message: 'Missing "name" field.'}); return;}

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      updateModel = converter.updateModel(body)

      db.db(config.dbName).collection(config.collections.models).updateOne({name: body.name}, updateModel, {upsert: true}, function(err, res) {

        // Read back the model
        getModel.do({params: {name: body.name}}).then((data) => {

          db.close();
          
          success(data)

        });
      });
    });
  });
}
