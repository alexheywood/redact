import boto3
import os

s3 = boto3.client('s3')
ses = boto3.client('ses')

def lambda_handler(event, context):
    job_id = event['jobId']
    redacted_key = event['redactedFileKey']
    recipient = event.get('email')  # Optional: pass from earlier step

    bucket = os.environ['S3_BUCKET']
    sender = os.environ['SENDER_EMAIL']

    # Generate pre-signed URL
    url = s3.generate_presigned_url(
        ClientMethod='get_object',
        Params={'Bucket': bucket, 'Key': redacted_key},
        ExpiresIn=3600
    )

    # Send email
    ses.send_email(
        Source=sender,
        Destination={'ToAddresses': [recipient]},
        Message={
            'Subject': {'Data': 'Your Redacted Document is Ready'},
            'Body': {
                'Text': {
                    'Data': f"""Hello,

Your redacted file is ready. You can download it here:

{url}

This link will expire in 1 hour.

Best,
Redaction Service"""
                }
            }
        }
    )

    return {
        'jobId': job_id,
        'emailSent': True
    }
