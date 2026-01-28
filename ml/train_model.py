import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
import re
import string
import os

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# --- 1. Data Cleaning Function ---
def clean_text(text):
    """
    Cleans text by removing URLs, HTML tags, and special characters.
    This helps the model focus on the actual words.
    """
    text = str(text).lower()
    text = re.sub(r'https?://\S+|www\.\S+', '', text) # Remove URLs
    text = re.sub(r'<.*?>', '', text)                 # Remove HTML tags
    text = re.sub(r'\[.*?\]', '', text)               # Remove brackets content
    text = re.sub(r'[%s]' % re.escape(string.punctuation), '', text) # Remove punctuation
    text = re.sub(r'\n', ' ', text)                   # Remove newlines
    return text

# --- 2. Data Loading ---
def load_data(filepath):
    try:
        print(f"Loading dataset from: {filepath}")
        df = pd.read_csv(filepath)
        
        # Drop rows missing critical data
        df.dropna(subset=['text', 'label'], inplace=True)
        
        # Apply the cleaning function
        df['text'] = df['text'].apply(clean_text)
        
        print(f"Dataset ready. {len(df)} valid rows.")
        return df
    except FileNotFoundError:
        print(f"Error: File not found at {filepath}")
        return None

# --- 3. Model Training with Auto-Tuning ---
def train_optimized_model(df):
    if df is None: return None

    print("\n--- Starting Optimized Training ---")
    X = df['text']
    y = df['label']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Define the Pipeline
    # max_features=12000 keeps the file small (~40MB) but precise
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english', ngram_range=(1, 2), max_features=12000)),
        ('clf', LogisticRegression(solver='liblinear', class_weight='balanced'))
    ])

    # Grid Search: Automatically finds the best 'C' parameter
    # C is the regularization strength. Smaller = simpler model, Larger = more complex.
    param_grid = {
        'clf__C': [0.1, 1.0, 5.0, 10.0] 
    }

    print("Tuning hyperparameters (Grid Search)...")
    grid_search = GridSearchCV(pipeline, param_grid, cv=3, verbose=1, n_jobs=-1)
    grid_search.fit(X_train, y_train)

    print(f"Best Model Found! Parameters: {grid_search.best_params_}")
    
    # Return the best model found
    return grid_search.best_estimator_, X_test, y_test

# --- 4. Evaluation ---
def evaluate_model(model, X_test, y_test):
    print("\n--- Final Evaluation ---")
    y_pred = model.predict(X_test)
    
    acc = accuracy_score(y_test, y_pred)
    print(f"🏆 Model Accuracy: {acc * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

# --- 5. Main Execution ---
if __name__ == "__main__":
    # Robust path handling
    script_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(script_dir, 'reports_dataset.csv')
    model_path = os.path.join(script_dir, 'misinformation_model.joblib')

    # Run
    df = load_data(dataset_path)
    if df is not None:
        best_model, X_test, y_test = train_optimized_model(df)
        evaluate_model(best_model, X_test, y_test)
        
        # Save
        joblib.dump(best_model, model_path)
        print(f"\nOptimized Model saved to: {model_path}")
        
        # Check size
        size_mb = os.path.getsize(model_path) / (1024 * 1024)
        print(f"File Size: {size_mb:.2f} MB (Safe for GitHub if < 100MB)")