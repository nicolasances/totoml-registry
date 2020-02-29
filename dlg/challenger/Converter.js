var moment = require('moment-timezone');

/**
 * Converts the provided mongodb json object into a TO
 */
exports.challengerTO = function(data) {

  if (data == null) return {};

  return {
    id: data._id,
    modelName: data.modelName,
    date: data.date
  };
}

/**
 * Creates a mongodb persistent object
 */
exports.challengerPO = function(modelName, data) {

  date = moment().tz('Europe/Rome').format('YYYYMMDD');
  
  return {
    modelName: modelName,
    date: date
  };
}

/**
 * Creates a find filter for mongo based on a HTTP query obj
 */
exports.find = (query) => {

  if (query.modelName) return {modelName: query.modelName};

  return {};
}

/**
 * Creates a PO from a TO
 */
exports.metricPO = (challengerId, data) => {

  metrics = []

  for (var i = 0; i < data.metrics.length; i++) {
    metric = data.metrics[i];

    metrics.push({
      name: metric.name, 
      value: metric.value
    })
  }
  
  return {
    challengerId: challengerId, 
    metrics: metrics
  }
}

/**
 * TO from PO
 */
exports.metricTO = (data) => {

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
    challengerId: data.challengerId, 
    metrics: metrics
  }
}