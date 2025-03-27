import flask
from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib

class PatrolAllocationSystem:
    def __init__(self):
        # Initialize ML model and scaler
        self.crime_prediction_model = None
        self.scaler = StandardScaler()
        self.load_or_train_model()

    def load_or_train_model(self):
        """
        Load existing model or train a new one if not available
        """
        try:
            # Try to load existing model
            self.crime_prediction_model = joblib.load('crime_prediction_model.pkl')
            self.scaler = joblib.load('scaler.pkl')
        except FileNotFoundError:
            # Train a new model if no existing model found
            self.train_initial_model()

    def train_initial_model(self):
        """
        Train initial ML model for crime prediction
        """
        # Simulated historical crime data
        data = pd.DataFrame({
            'time_of_day': np.random.uniform(0, 24, 1000),
            'day_of_week': np.random.randint(0, 7, 1000),
            'location_risk': np.random.uniform(0, 1, 1000),
            'previous_incidents': np.random.randint(0, 50, 1000),
            'crime_severity': np.random.randint(0, 3, 1000)
        })
        
        # Create target variable (number of patrols needed)
        data['patrols_needed'] = data.apply(self.calculate_patrols, axis=1)
        
        # Prepare features and target
        X = data[['time_of_day', 'day_of_week', 'location_risk', 'previous_incidents', 'crime_severity']]
        y = data['patrols_needed']
        
        # Split and train model
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train Random Forest Classifier
        self.crime_prediction_model = RandomForestClassifier(n_estimators=100)
        self.crime_prediction_model.fit(X_train_scaled, y_train)
        
        # Save model and scaler
        joblib.dump(self.crime_prediction_model, 'crime_prediction_model.pkl')
        joblib.dump(self.scaler, 'scaler.pkl')

    def calculate_patrols(self, row):
        """
        Calculate patrol allocation based on incident characteristics
        """
        # Simulate patrol allocation logic
        total_incidents = row['previous_incidents']
        severity = row['crime_severity']
        
        # Base patrol allocation
        if total_incidents <= 5:
            base_patrols = 2
        elif total_incidents <= 10:
            base_patrols = 5
        elif total_incidents <= 15:
            base_patrols = 10
        elif total_incidents <= 20:
            base_patrols = 20
        else:
            base_patrols = 30 + ((total_incidents - 20) // 10 * 10)
        
        # Severity multiplier
        if severity == 2:  # High severity
            base_patrols *= 2
        elif severity == 1:  # Medium severity
            base_patrols *= 1.5
        
        return int(base_patrols)

    def predict_patrols(self, input_data):
        """
        Predict number of patrols needed
        """
        # Preprocess input data
        input_scaled = self.scaler.transform([input_data])
        
        # Predict patrols
        predicted_patrols = self.crime_prediction_model.predict(input_scaled)
        return int(predicted_patrols[0])

# Flask Server Setup
app = Flask(__name__)
patrol_system = PatrolAllocationSystem()

@app.route('/predict_patrols', methods=['POST'])
def predict_patrol_allocation():
    """
    API endpoint for patrol prediction
    """
    data = request.json
    
    # Required input features
    required_features = [
        'time_of_day', 
        'day_of_week', 
        'location_risk', 
        'previous_incidents', 
        'crime_severity'
    ]
    
    # Validate input
    if not all(feature in data for feature in required_features):
        return jsonify({
            'error': 'Missing required input features',
            'required_features': required_features
        }), 400
    
    # Extract features
    input_features = [
        data['time_of_day'],
        data['day_of_week'],
        data['location_risk'],
        data['previous_incidents'],
        data['crime_severity']
    ]
    
    try:
        # Predict patrols
        predicted_patrols = patrol_system.predict_patrols(input_features)
        
        return jsonify({
            'predicted_patrols': predicted_patrols,
            'input_data': data
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/train_model', methods=['POST'])
def retrain_model():
    """
    Endpoint to retrain the model with new data
    """
    try:
        patrol_system.load_or_train_model()
        return jsonify({
            'status': 'Model retrained successfully'
        })
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)