var moment = require('moment-timezone');

/**
 * Converts the provided mongodb json object into a TO
 */
exports.challengerTO = function(data) {

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
    metrics: metrics
  };
}

/**
 * Creates a mongodb persistent object
 */
exports.challengerPO = function(modelName, data) {

  // Date of creation of this challenger
  date = moment().tz('Europe/Rome').format('YYYYMMDD');

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
