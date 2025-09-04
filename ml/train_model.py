# train_model.py

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# --- 1. Data Loading and Initial Exploration ---
def load_data(filepath):
    """Loads dataset from a CSV file and cleans it."""
    try:
        df = pd.read_csv(filepath)
        print(f"✅ Dataset loaded successfully with {len(df)} rows.")

        # --- FIX: Add this line to remove rows with missing text or labels ---
        df.dropna(subset=['text', 'label'], inplace=True)
        
        print(f"✨ Dataset cleaned. {len(df)} rows remaining after removing missing values.")
        
        print("\nFirst 5 rows of cleaned data:")
        print(df.head())
        print("\nDataset Info:")
        df.info()
        return df
    except FileNotFoundError:
        print(f"❌ Error: Dataset file not found at '{filepath}'.")
        print("Please create a CSV file with 'text' and 'label' columns.")
        return None


# --- 2. Data Visualization ---
def visualize_data_distribution(df):
    """Visualizes the distribution of labels in the dataset."""
    if df is None or 'label' not in df.columns:
        print("⚠️ Cannot visualize: DataFrame is empty or 'label' column is missing.")
        return
        
    plt.figure(figsize=(10, 6))
    sns.countplot(x='label', data=df, palette='mako')
    plt.title('Distribution of Labels in the Dataset', fontsize=16)
    plt.xlabel('Label', fontsize=12)
    plt.ylabel('Count', fontsize=12)
    plt.xticks(rotation=0)
    plt.show()

# --- 3. Model Training ---
def train_model(df):
    """Trains a text classification model and returns the pipeline."""
    if df is None:
        print("❌ Model training skipped: No data available.")
        return None

    print("\n--- Starting Model Training ---")
    
    # Define features (X) and target (y)
    X = df['text']
    y = df['label']

    # Split data into training and testing sets (80/20 split)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"Data split: {len(X_train)} training samples, {len(X_test)} testing samples.")

    # Create a scikit-learn pipeline
    # This standardizes the process: text vectorization -> classification
    model_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english', ngram_range=(1, 2))),
        ('clf', LogisticRegression(random_state=42, solver='liblinear')),
    ])

    # Train the model
    print("Fitting the model on the training data...")
    model_pipeline.fit(X_train, y_train)
    print("✅ Model training complete.")
    
    return model_pipeline, X_test, y_test

# --- 4. Model Evaluation ---
def evaluate_model(pipeline, X_test, y_test):
    """Evaluates the model and prints performance metrics."""
    if pipeline is None:
        print("❌ Model evaluation skipped: No model trained.")
        return

    print("\n--- Evaluating Model Performance ---")
    
    # Make predictions on the test set
    y_pred = pipeline.predict(X_test)

    # Calculate and print accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(f"📊 Model Accuracy on Test Set: {accuracy * 100:.2f}%")

    # Print a detailed classification report
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # Visualize the confusion matrix
    conf_matrix = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(10, 7))
    sns.heatmap(
        conf_matrix, 
        annot=True, 
        fmt='d', 
        cmap='Blues',
        xticklabels=pipeline.classes_, 
        yticklabels=pipeline.classes_
    )
    plt.title('Confusion Matrix', fontsize=16)
    plt.xlabel('Predicted Label', fontsize=12)
    plt.ylabel('True Label', fontsize=12)
    plt.show()

# --- 5. Saving the Model ---
def save_model(pipeline, filename):
    """Saves the trained model pipeline to a file."""
    if pipeline is None:
        print("❌ Model saving skipped: No model to save.")
        return
        
    joblib.dump(pipeline, filename)
    print(f"\n✅ Model successfully saved as '{filename}'")
    print("This file can now be loaded by your backend API for inference.")

# --- Main Execution Block ---
import os # Make sure to import the os library at the top of your file

# --- Main Execution Block ---
if __name__ == "__main__":
    # Get the absolute path to the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Create the full, correct path to the dataset file
    dataset_path = os.path.join(script_dir, 'reports_dataset.csv')
    
    print(f"Attempting to load dataset from: {dataset_path}")
    
    # Run the full pipeline with the correct path
    dataframe = load_data(dataset_path)
    
    if dataframe is not None:
        visualize_data_distribution(dataframe)
        trained_pipeline, X_test_data, y_test_data = train_model(dataframe)
        evaluate_model(trained_pipeline, X_test_data, y_test_data)
        
        # Also save the model in the same directory as the script
        model_filename = os.path.join(script_dir, 'misinformation_model.joblib')
        save_model(trained_pipeline, model_filename)

