
/**
 * Creates the update statement for the model configuration
 */
exports.updateModelConfig = (data) => {

  updates = {}

  // Promotion configuration
  if (data.enableManualPromote != null) updates.enableManualPromote = data.enableManualPromote;
  if (data.enableAutoPromote != null) updates.enableAutoPromote = data.enableAutoPromote;

  // Training configuration
  if (data.trainingSchedule) updates.trainingSchedule = data.trainingSchedule;

  // Scoring configuration
  if (data.scoringSchedule) updates.scoringSchedule = data.scoringSchedule;

  return {$set: updates}

}

/**
 * Translates the model config to a TO
 */
exports.modelConfigTO = (data) => {

  return {
    modelName: data.modelName, 
    enableManualPromote: data.enableManualPromote, 
    enableAutoPromote: data.enableAutoPromote,
    trainingSchedule: data.trainingSchedule,
    scoringSchedule: data.scoringSchedule
  }

}
