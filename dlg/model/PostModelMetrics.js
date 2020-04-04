var mongo = require('mongodb');
var config = require('../../config');
var converter = require('./Converter');
var moment = require('moment-timezone')

var MongoClient = mongo.MongoClient;

/**
 * This method does 2 THINGS: 
 * 
 * 1. Update the CURRENT metrics of the champion model
 * 
 * 2. Add an item to the historical metrics of the model
 * 
 * This will allow to both easily retrieve the actual and current metrics of the champion mode, 
 * but also to plot the evolution of those metrics over time
 */
exports.do = function(request) {

  let body = request.body;

  return new Promise(function(success, failure) {

    // Some validation
    if (!request.params.name) {failure({code: 400, message: 'Missing "name" field.'}); return;}

    if (!body.metrics || body.metrics.length == 0) {failure({code: 400, message: 'Missing "metrics" in the body.'}); return;}

    // Validate the metrics data
    metrics = body.metrics;

    for (var i = 0; i < metrics.length; i++) {
      metric = metrics[i];
      if (!metric.name) {failure({code: 400, message: 'One of the metrics missed the "name" attribute'}); return;}
      if (!metric.value) {failure({code: 400, message: 'One of the metrics missed the "value" attribute'}); return;}
    }

    return MongoClient.connect(config.mongoUrl, function(err, db) {
      
      // Update the current model metrics
      db.db(config.dbName).collection(config.collections.models).updateOne({name: request.params.name}, converter.updateMetrics(body), function(err, res) {

        today = moment().tz('Europe/Rome').format('YYYYMMDD');

        options = {upsert: true}
        
        // Add a metric to the historical time serie of metrics
        db.db(config.dbName).collection(config.collections.historicalMetrics).updateOne({name: request.params.name, date: today}, converter.updateMetrics(body), options, function(err, res) {
  
          db.close();
  
          success({});

          // Post the metrics delta
          var deltaCalculator = require('../util/Deltas');
          
          deltaCalculator.calculateMetricDeltas(request.params.modelName).then((data) => {

            // Update the Champion Model
            var updateChampion = require('../model/PutModel');

            updateChampion.do({
              params: { name: request.params.modelName },
              body: { deltas : data.deltas }
            });
          });
        });
      });
    });
  });
}
