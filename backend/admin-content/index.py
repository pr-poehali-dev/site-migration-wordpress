import json
import os
import hashlib
# v2
import hmac
import time
import psycopg2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
}

def get_db():
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'], options='-c search_path=' + schema)
    return conn

def verify_token(token):
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
        expected = hmac.new(secret.encode(), (username + ':' + str(int(time.time()) // 86400)).encode(), hashlib.sha256).hexdigest()
        if hmac.compare_digest(token, expected):
            return True
    return False

def is_auth(event):
    token = event.get('headers', {}).get('X-Auth-Token', '')
    return verify_token(token)

def handler(event: dict, context) -> dict:
    """CRUD для управления услугами, FAQ, новостями и настройками сайта"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    qs = event.get('queryStringParameters') or {}
    action = qs.get('action', '')
    item_id = qs.get('id', '')

    # --- ПУБЛИЧНЫЕ (без авторизации) ---

    if action == 'public_services':
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id, icon, title, description, price, sort_order FROM services WHERE is_active = true ORDER BY sort_order")
        rows = cur.fetchall()
        cur.close(); conn.close()
        data = [{'id': r[0], 'icon': r[1], 'title': r[2], 'description': r[3], 'price': r[4], 'sort_order': r[5]} for r in rows]
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(data, ensure_ascii=False)}

    if action == 'public_faq':
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id, question, answer FROM faq WHERE is_active = true ORDER BY sort_order")
        rows = cur.fetchall()
        cur.close(); conn.close()
        data = [{'id': r[0], 'question': r[1], 'answer': r[2]} for r in rows]
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(data, ensure_ascii=False)}

    if action == 'public_settings':
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT key, value FROM site_settings")
        rows = cur.fetchall()
        cur.close(); conn.close()
        data = {r[0]: r[1] for r in rows}
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(data, ensure_ascii=False)}

    if action == 'public_news':
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id, title, content, image_url, created_at FROM news WHERE is_active = true ORDER BY sort_order, created_at DESC LIMIT 4")
        rows = cur.fetchall()
        cur.close(); conn.close()
        data = [{'id': r[0], 'title': r[1], 'content': r[2], 'image_url': r[3], 'created_at': str(r[4])} for r in rows]
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(data, ensure_ascii=False)}

    if action == 'public_news_all':
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id, title, content, image_url, created_at FROM news WHERE is_active = true ORDER BY sort_order, created_at DESC")
        rows = cur.fetchall()
        cur.close(); conn.close()
        data = [{'id': r[0], 'title': r[1], 'content': r[2], 'image_url': r[3], 'created_at': str(r[4])} for r in rows]
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(data, ensure_ascii=False)}

    # --- ЗАЩИЩЁННЫЕ (требуют авторизации) ---
    if not is_auth(event):
        return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Не авторизован'})}

    body = json.loads(event.get('body') or '{}')

    # SERVICES
    if action == 'services':
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id, icon, title, description, price, sort_order, is_active FROM services ORDER BY sort_order")
        rows = cur.fetchall()
        cur.close(); conn.close()
        data = [{'id': r[0], 'icon': r[1], 'title': r[2], 'description': r[3], 'price': r[4], 'sort_order': r[5], 'is_active': r[6]} for r in rows]
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(data, ensure_ascii=False)}

    if action == 'services_create':
        conn = get_db()
        cur = conn.cursor()
        cur.execute("INSERT INTO services (icon, title, description, price, sort_order, is_active) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
            (body.get('icon', 'Wrench'), body['title'], body.get('description', ''), body.get('price', ''), body.get('sort_order', 99), body.get('is_active', True)))
        new_id = cur.fetchone()[0]
        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'id': new_id})}

    if action == 'services_update':
        conn = get_db()
        cur = conn.cursor()
        cur.execute("UPDATE services SET icon=%s, title=%s, description=%s, price=%s, sort_order=%s, is_active=%s, updated_at=NOW() WHERE id=%s",
            (body.get('icon'), body.get('title'), body.get('description'), body.get('price'), body.get('sort_order'), body.get('is_active'), item_id))
        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

    if action == 'services_delete':
        conn = get_db()
        cur = conn.cursor()
        cur.execute("DELETE FROM services WHERE id = %s", (item_id,))
        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

    # FAQ
    if action == 'faq':
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id, question, answer, sort_order, is_active FROM faq ORDER BY sort_order")
        rows = cur.fetchall()
        cur.close(); conn.close()
        data = [{'id': r[0], 'question': r[1], 'answer': r[2], 'sort_order': r[3], 'is_active': r[4]} for r in rows]
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(data, ensure_ascii=False)}

    if action == 'faq_create':
        conn = get_db()
        cur = conn.cursor()
        cur.execute("INSERT INTO faq (question, answer, sort_order) VALUES (%s, %s, %s) RETURNING id",
            (body['question'], body['answer'], body.get('sort_order', 99)))
        new_id = cur.fetchone()[0]
        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'id': new_id})}

    if action == 'faq_update':
        conn = get_db()
        cur = conn.cursor()
        cur.execute("UPDATE faq SET question=%s, answer=%s, sort_order=%s, is_active=%s, updated_at=NOW() WHERE id=%s",
            (body.get('question'), body.get('answer'), body.get('sort_order'), body.get('is_active'), item_id))
        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

    if action == 'faq_delete':
        conn = get_db()
        cur = conn.cursor()
        cur.execute("DELETE FROM faq WHERE id = %s", (item_id,))
        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

    # SETTINGS
    if action == 'settings':
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id, key, value, label FROM site_settings ORDER BY id")
        rows = cur.fetchall()
        cur.close(); conn.close()
        data = [{'id': r[0], 'key': r[1], 'value': r[2], 'label': r[3]} for r in rows]
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(data, ensure_ascii=False)}

    if action == 'settings_update':
        conn = get_db()
        cur = conn.cursor()
        for key, value in body.items():
            cur.execute("UPDATE site_settings SET value=%s, updated_at=NOW() WHERE key=%s", (value, key))
        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

    # NEWS
    if action == 'news':
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id, title, content, image_url, sort_order, is_active, created_at FROM news ORDER BY sort_order, created_at DESC")
        rows = cur.fetchall()
        cur.close(); conn.close()
        data = [{'id': r[0], 'title': r[1], 'content': r[2], 'image_url': r[3], 'sort_order': r[4], 'is_active': r[5], 'created_at': str(r[6])} for r in rows]
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(data, ensure_ascii=False)}

    if action == 'news_create':
        conn = get_db()
        cur = conn.cursor()
        cur.execute("INSERT INTO news (title, content, image_url, sort_order, is_active) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (body['title'], body.get('content', ''), body.get('image_url', ''), body.get('sort_order', 99), body.get('is_active', True)))
        new_id = cur.fetchone()[0]
        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'id': new_id})}

    if action == 'news_update':
        conn = get_db()
        cur = conn.cursor()
        cur.execute("UPDATE news SET title=%s, content=%s, image_url=%s, sort_order=%s, is_active=%s, updated_at=NOW() WHERE id=%s",
            (body.get('title'), body.get('content'), body.get('image_url'), body.get('sort_order'), body.get('is_active'), item_id))
        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

    if action == 'news_delete':
        conn = get_db()
        cur = conn.cursor()
        cur.execute("DELETE FROM news WHERE id = %s", (item_id,))
        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

    return {'statusCode': 404, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Unknown action: ' + action})}