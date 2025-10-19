import boto3
import os

s3 = boto3.client('s3')

def lambda_handler(event, context):
    job_id = event['jobId']
    temp_path = f"/tmp/{job_id}.docx"  # or .pdf
    bucket = os.environ['S3_BUCKET']
    output_key = f"redacted/{job_id}.docx"

    # Assume the rebuilt document is already saved to /tmp
    with open(temp_path, 'rb') as f:
        s3.upload_fileobj(f, bucket, output_key, ExtraArgs={
            'ContentType': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        })

    return {
        'jobId': job_id,
        'redactedFileKey': output_key
    }
