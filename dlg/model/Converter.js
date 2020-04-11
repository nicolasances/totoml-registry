var moment = require('moment-timezone');

/**
 * Converts the provided mongodb json object into a TO
 */
exports.modelTO = function(data) {

  if (data == null) return {};

  metrics = []

  if (data.metrics != null) {
    for (var i = 0; i < data.metrics.length; i++) {
      metric = data.metrics[i];
      
      metrics.push({
        name: metric.name, 
        value: metric.value
      })
    }
  }

  return {
    id: data._id,
    name: data.name,
    version: data.version,
    totomlPythonSDKVersion: data.totomlPythonSDKVersion,
    date: data.date, 
    description: data.description,
    metrics: metrics,
    deltas: data.deltas
  };
}

/**
 * Creates a mongodb persistent object
 */
exports.modelPO = function(data) {

  date = moment().tz('Europe/Rome').format('YYYYMMDD');
  time = moment().tz('Europe/Rome').format('HH:mm');
  
  version = data.version;
  if (!version) version = 1;

  metrics = []

  if (data.metrics != null) {
    for (var i = 0; i < data.metrics.length; i++) {
      metric = data.metrics[i];
      
      metrics.push({
        name: metric.name, 
        value: metric.value
      })
    }
  }
  
  return {
    name: data.name,
    version: version,
    date: date, 
    time: time,
    metrics: metrics
  };
}

/**
 * Converts the provided mongodb json object into a TO
 */
exports.modelHistoricalMetricTO = function(data) {

  if (data == null) return {};

  metrics = []

  if (data.metrics != null) {
    for (var i = 0; i < data.metrics.length; i++) {
      metric = data.metrics[i];
      
      metrics.push({
        name: metric.name, 
        value: metric.value
      })
    }
  }

  return {
    id: data._id,
    name: data.name,
    date: data.date, 
    metrics: metrics
  };
}
/**
 * Converts the provided data into a statement to update the metrics
 */
exports.updateMetrics = (data) => {

  // Metrics of this challenger
  metrics = []

  if (data.metrics != null) {
    for (var i = 0; i < data.metrics.length; i++) {
      metric = data.metrics[i];

      metrics.push({
        name: metric.name, 
        value: metric.value
      })
    }
  }

  return {$set: {metrics: metrics}}

}

/**
 * Updates the version of the model
 */
exports.updateVersion = (newVersion) => {

  date = moment().tz('Europe/Rome').format('YYYYMMDD');
  time = moment().tz('Europe/Rome').format('HH:mm');

  return {$set: {version: newVersion, date: date, time: time}}
}

exports.updateModel = (data) => {

  // If we're updating the version of the model
  if (data.version) {

    date = data.date;
    if (!date) date = moment().tz('Europe/Rome').format('YYYYMMDD');
    
    version = data.version;
    if (!version) version = 1;
  
    metrics = []
  
    if (data.metrics != null) {
      for (var i = 0; i < data.metrics.length; i++) {
        metric = data.metrics[i];
        
        metrics.push({
          name: metric.name, 
          value: metric.value
        })
      }
    }
    
    return {$set: {
      version: version,
      date: date, 
      metrics: metrics
    }};
  }

  // Otherwise 
  let upd = {};

  if (data.name) upd.name = data.name;
  if (data.description) upd.description = data.description;
  if (data.deltas) upd.deltas = data.deltas;
  if (data.totomlPythonSDKVersion) upd.totomlPythonSDKVersion = data.totomlPythonSDKVersion;

  return {$set: upd};
}

/**
 * Creates a find filter for mongo based on a HTTP query obj
 */
exports.find = (query) => {

  if (query.name) return {name: query.name};

  return {};
}