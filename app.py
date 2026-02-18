from flask import Flask, render_template, request, jsonify
from utils.encrypt import text_to_morse
from utils.decrypt import morse_to_text

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/convert', methods=['POST'])
def convert():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data received'}), 400

    input_text = data.get('text', '').strip()
    mode = data.get('mode', '')  # 'encode' or 'decode'

    if not input_text:
        return jsonify({'error': 'Please enter some text to convert.'}), 400

    if mode == 'encode':
        result, error = text_to_morse(input_text)
    elif mode == 'decode':
        result, error = morse_to_text(input_text)
    else:
        return jsonify({'error': 'Invalid mode. Use encode or decode.'}), 400

    if error:
        return jsonify({'error': error}), 400

    return jsonify({'result': result, 'mode': mode})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
