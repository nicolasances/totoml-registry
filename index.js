var logger = require('toto-logger');
var Controller = require('toto-api-controller');
var totoEventPublisher = require('toto-event-publisher');
var TotoEventConsumer = require('toto-event-consumer');

var postModel = require('./dlg/model/PostModel');
var getModels = require('./dlg/model/GetModels');
var getModel = require('./dlg/model/GetModel');

var getChallengers = require('./dlg/challenger/GetChallengers');
var getChallenger = require('./dlg/challenger/GetChallenger');
var postChallenger = require('./dlg/challenger/PostChallenger');

var apiName = 'models';

var api = new Controller(apiName);

api.path('GET', '/models', getModels);
api.path('POST', '/models', postModel);
api.path('GET', '/models/:name', getModel);

api.path('GET', '/models/:modelName/challengers', getChallengers);
api.path('POST', '/models/:modelName/challengers', postChallenger);
api.path('GET', '/challengers/:id', getChallenger);

api.listen();
