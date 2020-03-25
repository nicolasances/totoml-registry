var mongo = require('mongodb');
var config = require('../../config');
var converter = require('./Converter');

var trainingCron = require('../../cron/TrainingCron').cron;
var scoringCron = require('../../cron/ScoringCron').cron;

var MongoClient = mongo.MongoClient;

exports.do = function(request) {

  let body = request.body;
  let correlationId = request.headers['x-correlation-id'];

  return new Promise(function(success, failure) {

    // Some validation
    if (!request.params.modelName) {failure({code: 400, message: 'Missing "modelName" path param.'}); return;}

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      updateModelConfig = converter.updateModelConfig(body)

      db.db(config.dbName).collection(config.collections.modelConfig).updateOne({modelName: request.params.modelName}, updateModelConfig, {upsert: true}, function(err, res) {

        db.close();

        if (body.trainingSchedule) trainingCron.changeCron(body.trainingSchedule, request.params.modelName, correlationId);
        if (body.scoringSchedule) scoringCron.changeCron(body.scoringSchedule, request.params.modelName, correlationId);
        
        success(res)

      });
    });
  });
}
