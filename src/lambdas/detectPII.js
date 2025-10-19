const AWS = require("aws-sdk");
const comprehend = new AWS.Comprehend();

exports.handler = async (event) => {
  try {
    const { jobId, extractedText } = event;

    const params = {
      Text: extractedText,
      LanguageCode: "en",
    };

    const result = await comprehend.detectPiiEntities(params).promise();

    const redactions = result.Entities.map((entity) => ({
      Type: entity.Type,
      Score: entity.Score,
      BeginOffset: entity.BeginOffset,
      EndOffset: entity.EndOffset,
    }));

    return {
      jobId,
      redactions,
      originalText: extractedText,
    };
  } catch (err) {
    console.error("PII detection failed:", err);
    throw new Error("PII detection error");
  }
};
