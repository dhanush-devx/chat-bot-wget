from flask import Flask, render_template, request, jsonify
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

SYSTEM_INSTRUCTION = """
You are a helpful AI assistant embedded in a website. 
Keep responses concise and web-friendly. 
Use markdown sparingly for formatting when needed.
"""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat_handler():
    try:
        user_message = request.json.get('message', '')
        if not user_message:
            return jsonify({'error': 'Empty message'}), 400

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[user_message],
            config=genai.types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                max_output_tokens=500,
                temperature=0.3
            )
        )
        
        return jsonify({'response': response.text})
    
    except Exception as e:
        app.logger.error(f"API Error: {str(e)}")
        return jsonify({'error': 'Service unavailable'}), 503

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
