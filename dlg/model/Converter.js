var moment = require('moment-timezone');

/**
 * Converts the provided mongodb json object into a TO
 */
exports.modelTO = function(data) {

  if (data == null) return {};

  return {
    id: data._id,
    name: data.name,
    version: data.version,
    date: data.date
  };
}

/**
 * Creates a mongodb persistent object
 */
exports.modelPO = function(data) {

  date = moment().tz('Europe/Rome').format('YYYYMMDD');
  
  version = data.version;
  if (!version) version = 1;
  
  return {
    name: data.name,
    version: version,
    date: date
  };
}

/**
 * Creates a find filter for mongo based on a HTTP query obj
 */
exports.find = (query) => {

  if (query.name) return {name: query.name};

  return {};
}