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
    date: data.date, 
    metrics: metrics
  };
}

/**
 * Creates a mongodb persistent object
 */
exports.modelPO = function(data) {

  date = moment().tz('Europe/Rome').format('YYYYMMDD');
  
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

    console.log({$set: {metrics: metrics}});
    

    return {$set: {metrics: metrics}}

}

/**
 * Creates a find filter for mongo based on a HTTP query obj
 */
exports.find = (query) => {

  if (query.name) return {name: query.name};

  return {};
}