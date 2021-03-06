var mongo = require('mongodb');
var config = require('../../config');
var converter = require('./Converter');

var MongoClient = mongo.MongoClient;

exports.do = function(request) {

  let body = request.body;

  return new Promise(function(success, failure) {

    // Some validation
    if (!request.params.modelName) {failure({code: 400, message: 'Missing "modelName" field.'}); return;}

    // One of "trainingStatus", "scoringStatus", "promotionStatus" should be passed
    if (!body.trainingStatus && !body.scoringStatus &&!body.promotionStatus) {failure({code: 400, message: 'Missing one of "trainingStatus", "scoringStatus", "promotionStatus".'}); return;}

    // Validate types
    // Training status
    if (body.trainingStatus) {
      // Allowed values: 'training', 'not-training'
      if (body.trainingStatus != 'training' && body.trainingStatus != 'not-training') {failure({code: 400, message: 'Not acceptable value for "trainingStatus"'}); return;}
    }

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      updateStatus = converter.updateStatus(body)

      db.db(config.dbName).collection(config.collections.status).updateOne({modelName: request.params.modelName}, updateStatus, {upsert: true}, function(err, res) {

        db.close();
        
        success(res)

      });
    });
  });
}
