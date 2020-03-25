var moment = require('moment-timezone');
var logger = require('toto-logger');
var cron = require('node-cron');
var http = require('request');

var getModelsConfig = require('../dlg/config/GetModelsConfig');

var cid = () => {

    // 20200308 130803 408
    let ts = moment().tz('Europe/Rome').format('YYYYMMDDHHmmssSSS');

    // -11617
    let random = (Math.random() * 100000).toFixed(0).padStart(5, '0');

    return ts + '' + random;
}

/**
 * This class has the responsibility of training a single model
 * It provides the method train() which will trigger the training process for 
 * a given model
 */
class Trainer {

    constructor(modelName) {

        this.modelName = modelName;

        this.train = this.train.bind(this);

    }

    /**
     * Training function
     */
    train() {

        let correlationId = cid();

        logger.compute(correlationId, 'TRAINING CRON: Triggering [ ' + this.modelName + ' ] /training process', 'info');

        if (!this.modelName) return;

        let apiServer = process.env.TOTO_HOST
        let auth = process.env.TOTO_API_AUTH

        let req = {
            url : 'https://' + apiServer + '/apis/model/' + this.modelName + '/train',
            method: 'GET',
            headers : {
                'User-Agent' : 'node.js',
                'Authorization': auth, 
                'x-correlation-id': correlationId
            }
        }
        http(req, (err, resp, body) => { if (err) logger.compute(correlationId, err, 'error') });
    
    }
}

/**
 * This class creates all the training crons for all the jobs. 
 * It will get all the models from the configuration and create a cron for them 
 * (based on what's defined in the configuration)
 */
class TrainingCron {

    constructor() {

        this.changeCron = this.changeCron.bind(this);

        let correlationId = cid();

        logger.compute(correlationId, 'Retrieving cron configuration for training jobs', 'info');

        // 1. Load all the models
        getModelsConfig.do().then((data) => {

            if (!data || !data.configs || data.configs.length == 0) return;

            this.tasks = [];
            this.trainers = [];

            for (var i = 0; i < data.configs.length; i++) {

                let config = data.configs[i];

                logger.compute(correlationId, 'Found training configuration for model ' + config.modelName + ': ' + config.trainingSchedule + ' ', 'info');

                // If there is no training schedule for the model, skip
                if (!config.trainingSchedule) continue;

                // Create the trainer
                let trainer = new Trainer(config.modelName);
                trainer.task = cron.schedule(config.trainingSchedule, trainer.train, {
                    scheduled: true, 
                    timezone: 'Europe/Rome'
                });
                
                this.trainers.push(trainer);
            }
        })
    }

    /**
     * Changes the schedule of the cron job
     * @param {string} schedule the new cron schedule
     * @param {string} modelName the name of the model
     */
    changeCron(schedule, modelName) {

        // In case there were no trainers, initialize
        if (!this.trainers) this.trainers = []

        for (var i = 0; i < this.trainers.length; i++) {
            
            if (this.trainers[i].modelName == modelName) {
                this.trainers[i].task.destroy()
                this.trainers[i].task = cron.schedule(schedule, this.trainers[i].train, {
                    scheduled: true, 
                    timezone: 'Europe/Rome'
                });

                return;
            }
        }

        // If you're here, it means there was no trainer created for this model
        // => create it
        let trainer = Trainer(modelName);
        trainer.task = cron.schedule(schedule, trainer.train, {
            scheduled: true, 
            timezone: 'Europe/Rome'
        });
        
        this.trainers.push(trainer);

    }
}

exports.cron = new TrainingCron();