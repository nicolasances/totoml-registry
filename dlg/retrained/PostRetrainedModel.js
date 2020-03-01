var mongo = require('mongodb');
var config = require('../../config');
var converter = require('./Converter');

var MongoClient = mongo.MongoClient;

exports.do = function(request) {

  let body = request.body;

  return new Promise(function(success, failure) {

    // Some validation
    if (!request.params.modelName) {failure({code: 400, message: 'Missing "modelName" in the path.'}); return;}
    if (!body.metrics || body.metrics.length == 0) {failure({code: 400, message: 'Missing "metrics" in the body.'}); return;}

    // Validate the metrics data
    metrics = body.metrics;

    for (var i = 0; i < metrics.length; i++) {
      metric = metrics[i];
      if (!metric.name) {failure({code: 400, message: 'One of the metrics missed the "name" attribute'}); return;}
      if (!metric.value) {failure({code: 400, message: 'One of the metrics missed the "value" attribute'}); return;}
    }

    return MongoClient.connect(config.mongoUrl, function(err, db) {
      
      // Delete the previously retrained model
      db.db(config.dbName).collection(config.collections.retrained).deleteOne({modelName: request.params.modelName}, (err, res) => {
        
        // Post the new model
        db.db(config.dbName).collection(config.collections.retrained).insertOne(converter.retrainedPO(request.params.modelName, body), function(err, res) {
  
          db.close();
  
          success({id: res.insertedId});
  
        });

      });
    });
  });
}
