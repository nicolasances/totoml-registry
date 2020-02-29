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
exports.challengerPO = function(data) {

  date = moment().tz('Europe/Rome').format('YYYYMMDD');
  
  return {
    modelName: data.modelName,
    date: date
  };
}

/**
 * Creates a find filter for mongo based on a HTTP query obj
 */
exports.find = (query) => {

  if (query.modelName) return {name: query.modelName};

  return {};
}