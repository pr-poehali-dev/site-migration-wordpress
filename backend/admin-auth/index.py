import json
import os
import hashlib
import hmac
import time
import psycopg2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
}

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def make_token(username: str) -> str:
    secret = os.environ.get('ADMIN_SECRET_KEY', 'avtomexaniki_default_secret_2024')
    payload = f"{username}:{int(time.time()) // 86400}"
    return hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()

def verify_token(token: str) -> bool:
    if not token:
        return False
    secret = os.environ.get('ADMIN_SECRET_KEY', 'avtomexaniki_default_secret_2024')
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT username FROM admin_users")
    users = cur.fetchall()
    cur.close()
    conn.close()
    for (username,) in users:
        expected = hmac.new(secret.encode(), f"{username}:{int(time.time()) // 86400}".encode(), hashlib.sha256).hexdigest()
        if hmac.compare_digest(token, expected):
            return True
    return False

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: dict, context) -> dict:
    """Авторизация администратора и управление сессией"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod')
    path = event.get('path', '/')

    # POST /login
    if method == 'POST' and '/login' in path:
        body = json.loads(event.get('body') or '{}')
        username = body.get('username', '').strip()
        password = body.get('password', '').strip()

        if not username or not password:
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Укажите логин и пароль'})}

        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id FROM admin_users WHERE username = %s AND password_hash = %s", (username, hash_password(password)))
        user = cur.fetchone()
        cur.close()
        conn.close()

        if not user:
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неверный логин или пароль'})}

        token = make_token(username)
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'token': token, 'username': username})}

    # POST /setup — создание первого администратора
    if method == 'POST' and '/setup' in path:
        body = json.loads(event.get('body') or '{}')
        username = body.get('username', '').strip()
        password = body.get('password', '').strip()

        if not username or not password:
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Укажите логин и пароль'})}

        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM admin_users")
        count = cur.fetchone()[0]
        if count > 0:
            cur.close()
            conn.close()
            return {'statusCode': 403, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Администратор уже создан'})}

        cur.execute("INSERT INTO admin_users (username, password_hash) VALUES (%s, %s)", (username, hash_password(password)))
        conn.commit()
        cur.close()
        conn.close()
        token = make_token(username)
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'token': token, 'username': username})}

    # GET /verify
    if method == 'GET' and '/verify' in path:
        token = event.get('headers', {}).get('X-Auth-Token', '')
        if verify_token(token):
            return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}
        return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Не авторизован'})}

    return {'statusCode': 404, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Not found'})}
