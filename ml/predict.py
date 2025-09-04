import sys
import joblib
import json
import os
import numpy as np

def predict(text):
    """Loads the trained model and makes a prediction."""
    try:
        # Get the directory where the script is located
        script_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(script_dir, 'misinformation_model.joblib')
        
        # Load the pre-trained pipeline
        pipeline = joblib.load(model_path)
        
        # Make predictions
        prediction = pipeline.predict([text])[0]
        probabilities = pipeline.predict_proba([text])
        confidence = np.max(probabilities) * 100
        
        # --- FIX: Convert NumPy types to native Python types for JSON serialization ---
        result = {
            "label": str(prediction),       # Ensure label is a string
            "score": confidence.item()      # Convert numpy.float64 to a standard Python float
        }
        # --- End of FIX ---
        
        return result
        
    except Exception as e:
        # Return any errors in a JSON format so Node.js can parse them
        return {"error": str(e)}

if __name__ == "__main__":
    # Check if a command-line argument for the text was provided
    if len(sys.argv) > 1:
        # --- FIX: Use sys.argv[1] to get the first argument, not sys.argv[11] ---
        input_text = sys.argv[1] 
        result = predict(input_text)
        print(json.dumps(result))
    else:
        # If no text is passed, print a clear error in JSON format
        error_result = {"error": "No input text was provided to the prediction script."}
        print(json.dumps(error_result))

