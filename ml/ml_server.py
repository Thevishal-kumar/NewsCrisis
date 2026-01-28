from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)  
# LOAD MODEL AT STARTUP ---
print("Loading ML Model...")
try:
    # This finds the directory where this script is running
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, 'misinformation_model.joblib')
    
    pipeline = joblib.load(model_path)
    print("Model Loaded Successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    pipeline = None

# DEFINE THE PREDICT ENDPOINT ---
@app.route('/predict', methods=['POST'])
def predict():
    if pipeline is None:
        return jsonify({'error': 'Model not loaded'}), 500

    try:
        data = request.json
        text = data.get('text', '')

        if not text:
            return jsonify({'error': 'No text provided'}), 400

        # Run Prediction
        prediction = pipeline.predict([text])[0]
        probs = pipeline.predict_proba([text])
        confidence = np.max(probs) * 100

        # Map the numeric result to text
        # Assumes: 1 = Fake, 0 = Real (Adjust if your training data is opposite)
        label_text = "Misinformation" if str(prediction) == "1" else "Verified Real"

        return jsonify({
            'label': label_text,
            'score': float(confidence)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Runs on localhost port 5000
    app.run(port=5000, debug=True)