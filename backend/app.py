from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS to handle requests from SvelteKit
CORS(app)

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'pong'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6200, debug=True)