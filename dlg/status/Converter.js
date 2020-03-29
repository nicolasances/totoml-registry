
exports.updateStatus = (data) => {

    update = {}

    if (data.trainingStatus) update.trainingStatus = data.trainingStatus;
    if (data.scoringStatus) update.scoringStatus = data.scoringStatus;
    if (data.promotionStatus) update.promotionStatus = data.promotionStatus;

    return {$set: update};
}

exports.statusTO = (data) => {

    if (!data) return {}

    return {
        trainingStatus: data.trainingStatus, 
        scoringStatus: data.scoringStatus, 
        promotionStatus: data.promotionStatus
    }
}