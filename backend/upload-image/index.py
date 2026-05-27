import json
import os
import base64
import uuid
import boto3

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
}

AUTH_URL = "https://functions.poehali.dev/702f1c91-73d4-425c-b71e-b2f5560c31b1"

def get_s3():
    return boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )

def handler(event: dict, context) -> dict:
    """Загрузка изображения в S3. Принимает base64, возвращает CDN URL."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    token = event.get('headers', {}).get('X-Auth-Token', '')
    if not token:
        return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Unauthorized'})}

    body = json.loads(event.get('body') or '{}')
    image_data = body.get('image')
    filename = body.get('filename', 'image.jpg')

    if not image_data:
        return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'No image'})}

    if ',' in image_data:
        header, image_data = image_data.split(',', 1)
    else:
        header = ''

    ext = 'jpg'
    if 'png' in header or filename.lower().endswith('.png'):
        ext = 'png'
    elif 'webp' in header or filename.lower().endswith('.webp'):
        ext = 'webp'
    elif 'gif' in header or filename.lower().endswith('.gif'):
        ext = 'gif'

    content_type_map = {'jpg': 'image/jpeg', 'png': 'image/png', 'webp': 'image/webp', 'gif': 'image/gif'}
    content_type = content_type_map.get(ext, 'image/jpeg')

    key = f"news/{uuid.uuid4()}.{ext}"
    image_bytes = base64.b64decode(image_data)

    s3 = get_s3()
    s3.put_object(Bucket='files', Key=key, Body=image_bytes, ContentType=content_type)

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
    return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'url': cdn_url})}
