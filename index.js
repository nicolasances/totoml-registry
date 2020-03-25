var logger = require('toto-logger');
var Controller = require('toto-api-controller');
var totoEventPublisher = require('toto-event-publisher');
var moment = require('moment');

var postModel = require('./dlg/model/PostModel');
var getModels = require('./dlg/model/GetModels');
var getModel = require('./dlg/model/GetModel');
var deleteModel = require('./dlg/model/DeleteModel');
var postModelMetrics = require('./dlg/model/PostModelMetrics');
var getModelHistoricalMetrics = require('./dlg/model/GetModelHistoricalMetrics');

var getRetrained = require('./dlg/retrained/GetRetrainedModel');
var postRetrained = require('./dlg/retrained/PostRetrainedModel');
var promoteRetrainedModel = require('./dlg/retrained/PromoteRetrainedModel');

var getChallengers = require('./dlg/challenger/GetChallengers');
var getChallenger = require('./dlg/challenger/GetChallenger');
var postChallenger = require('./dlg/challenger/PostChallenger');

var getModelConfig = require('./dlg/config/GetModelConfig');
var postModelConfig = require('./dlg/config/PostModelConfig');
var getModelsConfig = require('./dlg/config/GetModelsConfig');

// Start the training and scoring crons
require('./cron/TrainingCron');
require('./cron/ScoringCron');

var apiName = 'totoml-registry';

totoEventPublisher.registerTopic({topicName: 'toto-ml-model-promoted', microservice: apiName}).then(() => {}, (err) => {console.log('Error while registering the topic.'); console.log(err);});

var api = new Controller(apiName, totoEventPublisher);

api.path('GET', '/models', getModels);
api.path('POST', '/models', postModel);
api.path('GET', '/models/:name', getModel);
api.path('DELETE', '/models/:name', deleteModel);
api.path('POST', '/models/:name/metrics', postModelMetrics);
api.path('GET', '/models/:name/metrics', getModelHistoricalMetrics);

api.path('GET', '/models/:modelName/retrained', getRetrained);
api.path('POST', '/models/:modelName/retrained', postRetrained);
api.path('POST', '/models/:modelName/retrained/promote', promoteRetrainedModel);

api.path('GET', '/models/:modelName/challengers', getChallengers);
api.path('POST', '/models/:modelName/challengers', postChallenger);
api.path('GET', '/challengers/:id', getChallenger);

api.path('GET', '/configs', getModelsConfig);
api.path('GET', '/models/:modelName/config', getModelConfig);
api.path('POST', '/models/:modelName/config', postModelConfig);
api.path('PUT', '/models/:modelName/config', postModelConfig);

api.listen();
