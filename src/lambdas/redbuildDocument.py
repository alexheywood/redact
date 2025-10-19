import boto3
import os
import uuid
from docx import Document

s3 = boto3.client('s3')

def lambda_handler(event, context):
    job_id = event['jobId']
    redacted_text = event['redactedText']
    bucket = os.environ['S3_BUCKET']
    output_key = f"redacted/{job_id}.docx"

    # Create a new Word document
    doc = Document()
    for paragraph in redacted_text.split('\n'):
        doc.add_paragraph(paragraph)

    # Save to /tmp (Lambda's writable directory)
    temp_path = f"/tmp/{job_id}.docx"
    doc.save(temp_path)

    # Upload to S3
    with open(temp_path, 'rb') as f:
        s3.upload_fileobj(f, bucket, output_key, ExtraArgs={'ContentType': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'})

    return {
        'jobId': job_id,
        'redactedFileKey': output_key
    }
