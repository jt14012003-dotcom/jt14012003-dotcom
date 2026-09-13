import os
from flask import Flask, jsonify, request, send_from_directory
from openai import OpenAI

app=Flask(__name__,static_folder='.',static_url_path='')
client=OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))
SYSTEM='''You are Nexa, a personal AI assistant created by Jethro. Be useful, concise, honest, and practical. Help with programming, learning, writing, planning, and everyday questions. Do not provide actionable instructions that facilitate serious harm, violence, weapon construction, malware, fraud, or dangerous wrongdoing. Refuse unsafe parts briefly and offer a safe alternative. Do not claim actions you did not take.'''

@app.get('/')
def index(): return send_from_directory('.', 'index.html')

@app.get('/nexa.html')
def nexa(): return send_from_directory('.', 'nexa.html')

@app.post('/api/chat')
def chat():
    data=request.get_json(silent=True) or {}
    message=str(data.get('message','')).strip()
    if not message: return jsonify(error='Message is required.'),400
    if len(message)>8000: return jsonify(error='Message is too long.'),400
    if not os.environ.get('OPENAI_API_KEY'): return jsonify(error='OPENAI_API_KEY is not configured.'),500
    try:
        r=client.chat.completions.create(model=os.environ.get('NEXA_MODEL','gpt-4-mini'),messages=[{'role':'system','content':SYSTEM},{'role':'user','content':message}])
        return jsonify(reply=r.choices[0].message.content)
    except Exception:
        app.logger.exception('Nexa request failed')
        return jsonify(error='Nexa could not process that request.'),502

if __name__=='__main__': app.run(host='127.0.0.1',port=5000,debug=True)
