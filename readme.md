# 📄 PII Redaction App – Manual Deployment Guide

This project allows users to upload DOCX or PDF files via a React SPA. AWS services automatically extract and redact PII using Textract and Comprehend, then email a secure download link to the user. After successful processing, the original and redacted files are deleted from S3 for security and cost efficiency.

---

## 🧠 Architecture Overview

- **Frontend**: React SPA
- **Backend**: AWS Lambda + API Gateway
- **Workflow**: AWS Step Functions
- **Storage**: Amazon S3
- **Redaction**: Textract + Comprehend
- **Notification**: Amazon SES
- **Cleanup**: Lambda deletes files after completion

---

## 📦 Project Structure

pii-redaction-app/

```
├── frontend/ # React SPA
├── lambdas/ # Lambda functions (Python + Node.js)
├── docs/ # Architecture diagrams, flowcharts
```

---

## 🔧 Prerequisites

Before starting, ensure you have:

- AWS account with admin access
- Verified email in Amazon SES
- Node.js and npm installed (for frontend)
- Python 3.9+ installed (for Lambdas)
- IAM roles created for Lambda and Step Functions
- Textract and Comprehend enabled in your region
- S3 buckets created:
  - `pii-redaction-uploads`
  - `pii-redaction-output`

---

## 🚀 Manual Deployment Steps

### 1. 🪣 Create S3 Buckets

Create two buckets in the AWS Console:

- `pii-redaction-uploads` – for incoming files
- `pii-redaction-output` – for redacted documents

Enable versioning and encryption (SSE-S3 or SSE-KMS).

---

### 2. 🧬 Create Lambda Functions

Create each Lambda manually in the AWS Console:

| Function Name     | Runtime | Handler                   | Purpose                                     |
| ----------------- | ------- | ------------------------- | ------------------------------------------- |
| `UploadHandler`   | Node.js | `index.handler`           | Uploads file to S3, starts job              |
| `StatusHandler`   | Node.js | `index.handler`           | Checks job status                           |
| `ExtractText`     | Python  | `lambda_function.handler` | Uses Textract to extract text               |
| `DetectPII`       | Node.js | `index.handler`           | Uses Comprehend to find PII                 |
| `RedactText`      | Node.js | `index.handler`           | Replaces PII with `[REDACTED]`              |
| `RebuildDocument` | Python  | `lambda_function.handler` | Rebuilds DOCX or PDF                        |
| `StoreFile`       | Python  | `lambda_function.handler` | Uploads redacted file to S3                 |
| `SendEmail`       | Python  | `lambda_function.handler` | Sends SES email with link                   |
| `CleanupFiles`    | Python  | `lambda_function.handler` | Deletes original and redacted files from S3 |

Upload zipped code for each function via the Console. Set environment variables like:

- `UPLOAD_BUCKET`, `OUTPUT_BUCKET`, `SENDER_EMAIL`

Attach IAM roles with scoped permissions for S3, Textract, Comprehend, SES, and Step Functions.

---

### 3. 🔄 Create Step Function

Use the AWS Console to create a new state machine named `RedactPIIWorkflow`. Paste the JSON definition and wire in each Lambda ARN.

Final state sequence:

```json
"StartAt": "ExtractText",
"States": {
  "ExtractText": { ... },
  "DetectPII": { ... },
  "RedactText": { ... },
  "RebuildDocument": { ... },
  "StoreFile": { ... },
  "SendEmail": { ... },
  "CleanupFiles": {
    "Type": "Task",
    "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:CleanupFiles",
    "End": true
  }
}
```

---

### 4. Create API Gateway

Create a REST API with two endpoints:

POST /upload → triggers UploadHandler

GET /status/{jobId} → triggers StatusHandler

Enable CORS and binary media types for PDF/DOCX. Deploy to a stage (e.g., prod) and note the base URL.

---

### 5. Configure SES

Verify your sender email (e.g., alex@yourdomain.com)

Move SES out of sandbox mode if needed

Test sending emails manually from the Console

---

### 6. Deploy web app

Build frontend react app

Host in Amplify

Set up firewall rules
