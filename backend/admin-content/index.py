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
        expected = hmac.new(secret.encode(), f"{username}:{int(time.time()) // 86400}".encode(), hashlib.sha256).hexdigest()
        if hmac.compare_digest(token, expected):
            return True
    return False

def is_auth(event):
    token = event.get('headers', {}).get('X-Auth-Token', '')
    return verify_token(token)

def handler(event: dict, context) -> dict:
    """CRUD для управления услугами, FAQ и настройками сайта через админку"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod')
    path = event.get('path', '/')

    # Публичные эндпоинты (без авторизации)
    if method == 'GET' and '/public/services' in path:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id, icon, title, description, price, sort_order FROM services WHERE is_active = true ORDER BY sort_order")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        services = [{'id': r[0], 'icon': r[1], 'title': r[2], 'description': r[3], 'price': r[4], 'sort_order': r[5]} for r in rows]
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(services, ensure_ascii=False)}

    if method == 'GET' and '/public/faq' in path:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id, question, answer FROM faq WHERE is_active = true ORDER BY sort_order")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        faq = [{'id': r[0], 'question': r[1], 'answer': r[2]} for r in rows]
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(faq, ensure_ascii=False)}

    if method == 'GET' and '/public/settings' in path:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT key, value FROM site_settings")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        settings = {r[0]: r[1] for r in rows}
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(settings, ensure_ascii=False)}

    # Все остальные — только для авторизованных
    if not is_auth(event):
        return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Не авторизован'})}

    # --- SERVICES ---
    if method == 'GET' and path.endswith('/services'):
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id, icon, title, description, price, sort_order, is_active FROM services ORDER BY sort_order")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        services = [{'id': r[0], 'icon': r[1], 'title': r[2], 'description': r[3], 'price': r[4], 'sort_order': r[5], 'is_active': r[6]} for r in rows]
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(services, ensure_ascii=False)}

    if method == 'POST' and path.endswith('/services'):
        body = json.loads(event.get('body') or '{}')
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO services (icon, title, description, price, sort_order, is_active) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
            (body.get('icon', 'Wrench'), body['title'], body.get('description', ''), body.get('price', ''), body.get('sort_order', 99), body.get('is_active', True))
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'id': new_id})}

    if method == 'PUT' and '/services/' in path:
        service_id = path.split('/')[-1]
        body = json.loads(event.get('body') or '{}')
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "UPDATE services SET icon=%s, title=%s, description=%s, price=%s, sort_order=%s, is_active=%s, updated_at=NOW() WHERE id=%s",
            (body.get('icon'), body.get('title'), body.get('description'), body.get('price'), body.get('sort_order'), body.get('is_active'), service_id)
        )
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

    if method == 'DELETE' and '/services/' in path:
        service_id = path.split('/')[-1]
        conn = get_db()
        cur = conn.cursor()
        cur.execute("DELETE FROM services WHERE id = %s", (service_id,))
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

    # --- FAQ ---
    if method == 'GET' and path.endswith('/faq'):
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id, question, answer, sort_order, is_active FROM faq ORDER BY sort_order")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        faq = [{'id': r[0], 'question': r[1], 'answer': r[2], 'sort_order': r[3], 'is_active': r[4]} for r in rows]
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(faq, ensure_ascii=False)}

    if method == 'POST' and path.endswith('/faq'):
        body = json.loads(event.get('body') or '{}')
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO faq (question, answer, sort_order) VALUES (%s, %s, %s) RETURNING id",
            (body['question'], body['answer'], body.get('sort_order', 99))
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'id': new_id})}

    if method == 'PUT' and '/faq/' in path:
        faq_id = path.split('/')[-1]
        body = json.loads(event.get('body') or '{}')
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "UPDATE faq SET question=%s, answer=%s, sort_order=%s, is_active=%s, updated_at=NOW() WHERE id=%s",
            (body.get('question'), body.get('answer'), body.get('sort_order'), body.get('is_active'), faq_id)
        )
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

    if method == 'DELETE' and '/faq/' in path:
        faq_id = path.split('/')[-1]
        conn = get_db()
        cur = conn.cursor()
        cur.execute("DELETE FROM faq WHERE id = %s", (faq_id,))
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

    # --- SETTINGS ---
    if method == 'GET' and '/settings' in path:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id, key, value, label FROM site_settings ORDER BY id")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        settings = [{'id': r[0], 'key': r[1], 'value': r[2], 'label': r[3]} for r in rows]
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(settings, ensure_ascii=False)}

    if method == 'PUT' and '/settings' in path:
        body = json.loads(event.get('body') or '{}')
        conn = get_db()
        cur = conn.cursor()
        for key, value in body.items():
            cur.execute("UPDATE site_settings SET value=%s, updated_at=NOW() WHERE key=%s", (value, key))
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

    # --- NEWS ---
    if method == 'GET' and '/public/news/all' in path:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id, title, content, image_url, created_at FROM news WHERE is_active = true ORDER BY sort_order, created_at DESC")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        news = [{'id': r[0], 'title': r[1], 'content': r[2], 'image_url': r[3], 'created_at': str(r[4])} for r in rows]
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(news, ensure_ascii=False)}

    if method == 'GET' and '/public/news' in path:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id, title, content, image_url, created_at FROM news WHERE is_active = true ORDER BY sort_order, created_at DESC LIMIT 4")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        news = [{'id': r[0], 'title': r[1], 'content': r[2], 'image_url': r[3], 'created_at': str(r[4])} for r in rows]
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(news, ensure_ascii=False)}

    if method == 'GET' and path.endswith('/news'):
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id, title, content, image_url, sort_order, is_active, created_at FROM news ORDER BY sort_order, created_at DESC")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        news = [{'id': r[0], 'title': r[1], 'content': r[2], 'image_url': r[3], 'sort_order': r[4], 'is_active': r[5], 'created_at': str(r[6])} for r in rows]
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(news, ensure_ascii=False)}

    if method == 'POST' and path.endswith('/news'):
        body = json.loads(event.get('body') or '{}')
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO news (title, content, image_url, sort_order, is_active) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (body['title'], body.get('content', ''), body.get('image_url', ''), body.get('sort_order', 99), body.get('is_active', True))
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'id': new_id})}

    if method == 'PUT' and '/news/' in path:
        news_id = path.split('/')[-1]
        body = json.loads(event.get('body') or '{}')
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "UPDATE news SET title=%s, content=%s, image_url=%s, sort_order=%s, is_active=%s, updated_at=NOW() WHERE id=%s",
            (body.get('title'), body.get('content'), body.get('image_url'), body.get('sort_order'), body.get('is_active'), news_id)
        )
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

    if method == 'DELETE' and '/news/' in path:
        news_id = path.split('/')[-1]
        conn = get_db()
        cur = conn.cursor()
        cur.execute("DELETE FROM news WHERE id = %s", (news_id,))
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

    return {'statusCode': 404, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Not found'})}