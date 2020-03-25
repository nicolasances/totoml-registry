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
 * This class has the responsibility of scoring a single model
 * It provides the method score() which will trigger the scoring process for 
 * a given model
 */
class Scorer {

    constructor(modelName) {

        this.modelName = modelName;

        this.score = this.score.bind(this);

    }

    /**
     * Scoring function
     */
    score() {

        let correlationId = cid();

        logger.compute(correlationId, 'TRAINING CRON: Triggering [ ' + this.modelName + ' ] /scoring process', 'info');

        if (!this.modelName) return;

        let apiServer = process.env.TOTO_HOST
        let auth = process.env.TOTO_API_AUTH

        let req = {
            url : 'https://' + apiServer + '/apis/model/' + this.modelName + '/score',
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
 * This class creates all the scoring crons for all the jobs. 
 * It will get all the models from the configuration and create a cron for them 
 * (based on what's defined in the configuration)
 */
class ScoringCron {

    constructor() {

        this.changeCron = this.changeCron.bind(this);

        let correlationId = cid();

        logger.compute(correlationId, 'Retrieving cron configuration for scoring jobs', 'info');

        // 1. Load all the models
        getModelsConfig.do().then((data) => {

            if (!data || !data.configs || data.configs.length == 0) return;

            this.tasks = [];
            this.scorers = [];

            for (var i = 0; i < data.configs.length; i++) {

                let config = data.configs[i];
                
                // If there is no scoring schedule for the model, skip
                if (!config.scoringSchedule) continue;

                logger.compute(correlationId, 'Found scoring configuration for model ' + config.modelName + ': ' + config.scoringSchedule + ' ', 'info');

                // Create the scorer
                let scorer = new Scorer(config.modelName);
                scorer.task = cron.schedule(config.scoringSchedule, scorer.score, {
                    scheduled: true, 
                    timezone: 'Europe/Rome'
                });
                
                this.scorers.push(scorer);
            }
        })
    }

    /**
     * Changes the schedule of the cron job
     * @param {string} schedule the new cron schedule
     * @param {string} modelName the name of the model
     */
    changeCron(schedule, modelName, correlationId) {

        // In case there were no scorers, initialize
        if (!this.scorers) this.scorers = []

        for (var i = 0; i < this.scorers.length; i++) {
            
            if (this.scorers[i].modelName == modelName) {
                this.scorers[i].task.destroy()
                this.scorers[i].task = cron.schedule(schedule, this.scorers[i].score, {
                    scheduled: true, 
                    timezone: 'Europe/Rome'
                });

                logger.compute(correlationId, 'Changed scoring cron for model [ ' + modelName + ' ] : ' + schedule, 'info');

                return;
            }
        }

        // If you're here, it means there was no scorer created for this model
        // => create it
        let scorer = new Scorer(modelName);
        scorer.task = cron.schedule(schedule, scorer.score, {
            scheduled: true, 
            timezone: 'Europe/Rome'
        });
        
        this.scorers.push(scorer);

        logger.compute(correlationId, 'Created scoring cron for model [ ' + modelName + ' ] : ' + schedule, 'info');

    }
}

exports.cron = new ScoringCron();