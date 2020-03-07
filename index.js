var logger = require('toto-logger');
var Controller = require('toto-api-controller');
var totoEventPublisher = require('toto-event-publisher');
var TotoEventConsumer = require('toto-event-consumer');

var postModel = require('./dlg/model/PostModel');
var getModels = require('./dlg/model/GetModels');
var getModel = require('./dlg/model/GetModel');
var deleteModel = require('./dlg/model/DeleteModel');
var postModelMetrics = require('./dlg/model/PostModelMetrics');

var getRetrained = require('./dlg/retrained/GetRetrainedModel');
var postRetrained = require('./dlg/retrained/PostRetrainedModel');

var getChallengers = require('./dlg/challenger/GetChallengers');
var getChallenger = require('./dlg/challenger/GetChallenger');
var postChallenger = require('./dlg/challenger/PostChallenger');

var apiName = 'totoml-registry';

var api = new Controller(apiName);

api.path('GET', '/models', getModels);
api.path('POST', '/models', postModel);
api.path('GET', '/models/:name', getModel);
api.path('DELETE', '/models/:name', deleteModel);
api.path('POST', '/models/:name/metrics', postModelMetrics);

api.path('GET', '/models/:modelName/retrained', getRetrained);
api.path('POST', '/models/:modelName/retrained', postRetrained);

api.path('GET', '/models/:modelName/challengers', getChallengers);
api.path('POST', '/models/:modelName/challengers', postChallenger);
api.path('GET', '/challengers/:id', getChallenger);

api.listen();
