const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

exports.handler = async (event) => {
  const s3 = new AWS.S3();
  const jobId = uuidv4();
  const fileContent = Buffer.from(event.body, "base64"); // if binary
  const fileName = `${jobId}.pdf`; // or .docx

  await s3
    .putObject({
      Bucket: "your-upload-bucket",
      Key: `uploads/${fileName}`,
      Body: fileContent,
      ContentType: "application/pdf",
    })
    .promise();

  // Trigger redaction workflow (e.g., EventBridge or Step Function)
  // Save job metadata to DynamoDB if needed

  return {
    statusCode: 200,
    body: JSON.stringify({ jobId }),
  };
};
