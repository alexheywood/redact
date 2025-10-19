import boto3
import os

s3 = boto3.client('s3')

def lambda_handler(event, context):
    job_id = event['jobId']
    upload_bucket = os.environ['UPLOAD_BUCKET']
    output_bucket = os.environ['OUTPUT_BUCKET']

    original_key = f"uploads/{job_id}.pdf"  # or .docx
    redacted_key = f"redacted/{job_id}.docx"

    # Delete original file
    s3.delete_object(Bucket=upload_bucket, Key=original_key)

    # Optionally delete redacted file
    s3.delete_object(Bucket=output_bucket, Key=redacted_key)

    return {
        'jobId': job_id,
        'cleanupStatus': 'Success'
    }
