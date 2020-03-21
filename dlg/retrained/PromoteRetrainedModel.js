var mongo = require('mongodb');
var config = require('../../config');
var converter = require('./Converter');
var newModelVersion = require('../model/NewModelVersion');
var postMetrics = require('../model/PostModelMetrics');
var logger = require('toto-logger');
const {Storage} = require('@google-cloud/storage');

const storage = new Storage();

var MongoClient = mongo.MongoClient;

/**
 * This delegate promotes a retrained model to a champion model. 
 * It follows the following steps: 
 * 
 * 1. Change the champion model version
 * 2. Update the champion model metrics
 * 3. Update the champion model's pickle in Storage
 */
exports.do = function(request) {

    let body = request.body;
    let correlationId = request.headers['x-correlation-id'];

    return new Promise(function(success, failure) {

        // Some validation
        if (!request.params.modelName) {failure({code: 400, message: 'Missing "modelName" in the path.'}); return;}

        modelName = request.params.modelName;

        return MongoClient.connect(config.mongoUrl, function(err, db) {

            // Get the retrained model 
            db.db(config.dbName).collection(config.collections.retrained).findOne({modelName: request.params.modelName}, (err, res) => {

                logger.compute(correlationId, '[ MODEL PROMOTE ] - Updating the model champion version', 'info');

                if (res == null) {
                    logger.compute(correlationId, '[ MODEL PROMOTE ] - No retrained model to promote', 'info');
                    success({});
                    return;
                }

                // Update the champion model: 
                // - version
                newModelVersion.do({params: {name: modelName}}).then((newVersionData) => {
                    
                    metricsUpdate = {
                        params: { name: modelName }, 
                        body: { metrics: res.metrics }
                    }

                    newModelVersion = newVersionData.version;

                    logger.compute(correlationId, '[ MODEL PROMOTE ] - Updating the model champion metrics with the retrained model metrics', 'info');
                    
                    // Update the champion model:
                    // - metrics
                    postMetrics.do(metricsUpdate).then(() => {

                        // Update the model file in GCP Storage
                        logger.compute(correlationId, '[ MODEL PROMOTE ] - Updating the Storage champion model', 'info');

                        storageBucket = 'toto-' + process.env.TOTO_ENV + '-model-storage';

                        // Read all the files in the bucket
                        sourceFolder = modelName + '/retrained';
                        destFolder = modelName + '/champion/v' + newModelVersion;

                        storage.bucket(storageBucket).getFiles({prefix: sourceFolder}, (err, files) => {
                            if (!err) {

                                files.forEach(file => {
                                    
                                    logger.compute(correlationId, '[ MODEL PROMOTE ] - Moving file: ' + file.name, 'info');

                                    destFilename = file.name.substring(sourceFolder.length + 1)

                                    file.move(destFolder + "/" + destFilename);
                                })
                            }
                        })

                        // Delete the retrained model
                        logger.compute(correlationId, '[ MODEL PROMOTE ] - Deleting the retrained model', 'info');

                        db.db(config.dbName).collection(config.collections.retrained).deleteOne({modelName: request.params.modelName}, (err, res) => {
                            
                            db.close();

                            success({
                                modelName: modelName, 
                                newVersion: newModelVersion
                            });
                        });

                        // TODO: post a message on the <model>-promoted queue

                    }, failure)

                }, failure);

            });
        });
    });
}
