var mongo = require('mongodb');
var config = require('../../config');
var converter = require('./Converter');

var MongoClient = mongo.MongoClient;

/**
 * This delegate updates the model to the next version
 */
exports.do = function(request) {

  let name = request.params.name;

  return new Promise(function(success, failure) {

    // Some validation
    if (!name) {failure({code: 400, message: 'Missing "name" path param.'}); return;}

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      db.db(config.dbName).collection(config.collections.models).findOne(converter.find(request.params), function(err, res) {

        // Get the version
        version = res.version;
        
        // Increase the version 
        version += 1;
        
        // Update the model
        db.db(config.dbName).collection(config.collections.models).updateOne(converter.find(request.params), converter.updateVersion(version), function(err, res) {

          db.close();

          success({version: version})

        });

      });
    });
  });
}
