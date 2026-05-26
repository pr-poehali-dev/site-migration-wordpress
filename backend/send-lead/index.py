import json
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправляет заявку с сайта на почту через Mail.ru SMTP."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()
    phone = body.get('phone', '').strip()
    car = body.get('car', '').strip()
    message = body.get('message', '').strip()

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Имя и телефон обязательны'}, ensure_ascii=False)
        }

    smtp_user = os.environ['SMTP_USER']
    smtp_password = os.environ['SMTP_PASSWORD']
    to_email = 'info@avtomexaniki.ru'

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка с сайта — {name}'
    msg['From'] = smtp_user
    msg['To'] = to_email

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0055b3; padding: 24px; border-radius: 12px 12px 0 0;">
        <h2 style="color: white; margin: 0;">Новая заявка с сайта АвтоМеханики</h2>
      </div>
      <div style="background: #f4f6fa; padding: 24px; border-radius: 0 0 12px 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #666; width: 140px;">Имя:</td><td style="padding: 8px 0; font-weight: bold; color: #1a1f2e;">{name}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Телефон:</td><td style="padding: 8px 0; font-weight: bold; color: #ff6600;"><a href="tel:{phone}" style="color: #ff6600;">{phone}</a></td></tr>
          {'<tr><td style="padding: 8px 0; color: #666;">Авто:</td><td style="padding: 8px 0; color: #1a1f2e;">' + car + '</td></tr>' if car else ''}
          {'<tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Проблема:</td><td style="padding: 8px 0; color: #1a1f2e;">' + message + '</td></tr>' if message else ''}
        </table>
        <div style="margin-top: 20px; padding: 12px; background: #fff3e0; border-radius: 8px; color: #e55a00; font-size: 14px;">
          Перезвоните клиенту в течение 15 минут!
        </div>
      </div>
    </div>
    """

    msg.attach(MIMEText(html, 'html'))

    with smtplib.SMTP_SSL('smtp.mail.ru', 465) as server:
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, to_email, msg.as_string())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True})
    }