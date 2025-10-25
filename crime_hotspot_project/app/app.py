from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
import os
from math import radians, cos, sin, asin, sqrt

# ---------------------------
# Load model and scaler
# ---------------------------
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../models/crime_hotspot_model.pkl")
SCALER_PATH = os.path.join(os.path.dirname(__file__), "../models/scaler.pkl")

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

FEATURES = ['latitude','longitude','hour','day_of_week','crime_type_enc','severity']

# ---------------------------
# Haversine distance function
# ---------------------------
def haversine(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    r = 6371
    return c * r

# ---------------------------
# Prepare incoming data
# ---------------------------
def prepare(df):
    df = df.copy()
    df['crime_type_enc'] = 0
    if 'severity' not in df.columns:
        df['severity'] = 0
    for c in ['latitude','longitude','hour','day_of_week','severity','crime_type_enc']:
        if c not in df.columns:
            df[c] = 0
    num_cols = ['latitude','longitude','hour','day_of_week','severity']
    df[num_cols] = scaler.transform(df[num_cols])
    return df[FEATURES]

# ---------------------------
# Flask app
# ---------------------------
app = Flask(__name__)

# ---------------------------
# Predict hotspots
# ---------------------------
@app.route('/api/predict_hotspots', methods=['POST'])
def predict_hotspots():
    payload = request.get_json()
    if payload is None:
        return jsonify({"error":"Invalid JSON"}), 400

    # Handle single dict or list of dicts
    if isinstance(payload, dict):
        df = pd.DataFrame([payload])
    elif isinstance(payload, list):
        df = pd.DataFrame(payload)
    else:
        return jsonify({"error":"Invalid payload format"}), 400

    X = prepare(df)

    # Safe handling if model has only one class
    if len(model.classes_) > 1:
        probs = model.predict_proba(X)[:,1]
    else:
        probs = [0] * len(X)

    df['risk_score'] = probs

    try:
        topn = int(request.args.get('topn', 10))
    except ValueError:
        topn = 10

    out = df.sort_values('risk_score', ascending=False).head(topn)
    return jsonify(out.to_dict(orient='records'))

# ---------------------------
# Patrol allocation
# ---------------------------
@app.route('/api/allocate_patrols', methods=['POST'])
def allocate_patrols_endpoint():
    payload = request.get_json()
    if payload is None:
        return jsonify({"error":"Invalid JSON"}), 400

    hotspots_data = payload.get('hotspots', payload)
    if isinstance(hotspots_data, dict):
        hotspots = pd.DataFrame([hotspots_data])
    elif isinstance(hotspots_data, list):
        hotspots = pd.DataFrame(hotspots_data)
    else:
        return jsonify({"error":"Invalid hotspots format"}), 400

    num_units = int(payload.get('num_units', 5))
    capacity = int(payload.get('capacity', 3))

    if 'zone_id' not in hotspots.columns:
        hotspots = hotspots.reset_index().rename(columns={'index':'zone_id'})

    assignments = allocate_patrols(hotspots, num_units=num_units, capacity_per_unit=capacity)
    return jsonify(assignments)

def allocate_patrols(hotspots_df, num_units=5, capacity_per_unit=3):
    hotspots = hotspots_df.sort_values('risk_score', ascending=False).copy()
    units = {i: [] for i in range(num_units)}
    unit_idx = 0

    for _, row in hotspots.iterrows():
        tries = 0
        assigned = False
        while tries < num_units:
            if len(units[unit_idx]) < capacity_per_unit:
                units[unit_idx].append(row.to_dict())
                assigned = True
                unit_idx = (unit_idx + 1) % num_units
                break
            else:
                unit_idx = (unit_idx + 1) % num_units
                tries += 1
        if not assigned:
            break

    assignments = []
    for u, zones in units.items():
        for z in zones:
            assignments.append({
                'unit': u,
                'zone_id': z.get('zone_id'),
                'latitude': z.get('latitude'),
                'longitude': z.get('longitude'),
                'risk_score': z.get('risk_score')
            })
    return assignments

# ---------------------------
# Run app
# ---------------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)
