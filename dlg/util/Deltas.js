
/**
 * This function calculates the delta in the metrics between a Champion Model 
 * and a Retrained Model.
 * 
 * Note that the deltas are the delta between the Retrained Model and the Champion Model (in that order). 
 * 
 * Returns
 * -------
 * A json with the following fields: 
 * - deltas :    [{metricName: <name>, delta: <float>}]
 */
exports.calculateMetricDeltas = (modelName) => {

    return new Promise((success, failure) => {

        var getModel = require('../model/GetModel');
    
        getModel.do({params: {name: modelName}}).then((model) => {

            var getRetrainedModel = require('../retrained/GetRetrainedModel');
    
            getRetrainedModel.do({params: {modelName: modelName}}).then((retrainedModel) => {
    
                let champMetrics = model.metrics;
                let retrainedMetrics = retrainedModel.metrics;
    
                // Deltas
                // That's an array of [{metricName, delta}, ...]
                let deltas = [];
    
                // If there are no metrics
                if (champMetrics == null || champMetrics.length == 0) { success({}); return; }
                if (retrainedMetrics == null || retrainedMetrics.length == 0) { success({}); return; }
    
                // Now let's compare
                for (var i = 0; i < champMetrics.length; i++) {
    
                    let metricName = champMetrics[i].name;
                    let champValue = champMetrics[i].value;
    
                    for (var j = 0; j < retrainedMetrics.length; j++) {
    
                        if (retrainedMetrics[j].name == metricName) {
    
                            let retrainedValue = retrainedMetrics[j].value;
    
                            let delta = retrainedValue - champValue;
    
                            deltas.push[{metricName: metricName, delta: delta}]
                        }
                    }
                }

                success({deltas: deltas});
    
            }, failure);
        }, failure);
    });

}