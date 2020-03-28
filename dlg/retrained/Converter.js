var moment = require('moment-timezone');

/**
 * Converts the provided mongodb json object into a TO
 */
exports.retrainedTO = function(data) {

  if (data == null) return {};

  metrics = []

  for (var i = 0; i < data.metrics.length; i++) {
    metric = data.metrics[i];
    
    metrics.push({
      name: metric.name, 
      value: metric.value
    })
  }

  return {
    id: data._id,
    modelName: data.modelName,
    date: data.date, 
    time: data.time,
    metrics: metrics
  };
}

/**
 * Creates a mongodb persistent object
 */
exports.retrainedPO = function(modelName, data) {

  // Date of creation of this challenger
  date = moment().tz('Europe/Rome').format('YYYYMMDD');
  time = moment().tz('Europe/Rome').format('HH:mm');

  // Metrics of this challenger
  metrics = []

  for (var i = 0; i < data.metrics.length; i++) {
    metric = data.metrics[i];

    metrics.push({
      name: metric.name, 
      value: metric.value
    })
  }
  
  return {
    modelName: modelName,
    date: date, 
    time: time,
    metrics: metrics
  };
}

/**
 * Creates a find filter for mongo based on a HTTP query obj
 */
exports.find = (query) => {

  if (query.modelName) return {modelName: query.modelName};

  return {};
}
