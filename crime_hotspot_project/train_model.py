import pandas as pd
import numpy as np
from sklearn.cluster import DBSCAN
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib
import os

# ================================================================
# STEP 1: Load Data
# ================================================================
def load_data(file_path="data/crime_data.csv"):
    print("Loading data...")
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"❌ File not found: {file_path}")
    df = pd.read_csv(file_path)
    print(f"✅ Data loaded successfully. Rows: {len(df)}")
    return df


# ================================================================
# STEP 2: Feature Engineering
# ================================================================
def preprocess_data(df):
    print("Feature engineering...")

    # Clean missing values
    df = df.dropna(subset=["latitude", "longitude", "crime_type", "time"])

    # Convert time to datetime
    df["time"] = pd.to_datetime(df["time"], errors="coerce")
    df["hour"] = df["time"].dt.hour
    df["day_of_week"] = df["time"].dt.dayofweek

    # Encode categorical features
    encoder = LabelEncoder()
    df["crime_type_encoded"] = encoder.fit_transform(df["crime_type"])

    # Fill missing numeric values
    df["hour"] = df["hour"].fillna(df["hour"].median())
    df["day_of_week"] = df["day_of_week"].fillna(df["day_of_week"].median())

    return df


# ================================================================
# STEP 3: Clustering Hotspots (DBSCAN)
# ================================================================
def cluster_hotspots(df):
    print("Clustering hotspots...")
    coords = df[["latitude", "longitude"]].values
    kms_per_radian = 6371.0088
    epsilon = 0.3 / kms_per_radian  # 300 meters radius (adjustable)

    db = DBSCAN(eps=epsilon, min_samples=3, algorithm="ball_tree", metric="haversine").fit(
        np.radians(coords)
    )
    df["cluster"] = db.labels_
    print(df["cluster"].value_counts())
    return df


# ================================================================
# STEP 4: Prepare Dataset for Model
# ================================================================
def prepare_dataset(df):
    print("Preparing dataset...")

    df["is_hotspot"] = (df["cluster"] != -1).astype(int)

    X = df[["latitude", "longitude", "hour", "day_of_week", "crime_type_encoded"]]
    y = df["is_hotspot"]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    return X_scaled, y, scaler


# ================================================================
# STEP 5: Train Model
# ================================================================
def train_model(X, y):
    print("Training model...")

    if len(np.unique(y)) < 2:
        print("⚠️ Warning: Only one class present in target variable. Adding synthetic samples.")
        # Create minimal variation for model training
        y = np.append(y, [1 - y[0]])
        X = np.vstack([X, X[0]])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestClassifier(n_estimators=200, random_state=42)
    model.fit(X_train, y_train)

    # Safe predict_proba
    if len(model.classes_) > 1:
        y_proba = model.predict_proba(X_test)[:, 1]
    else:
        print("⚠️ Warning: Single class detected in predict_proba.")
        y_proba = [0] * len(X_test)

    print(f"✅ Model trained successfully. Accuracy: {model.score(X_test, y_test):.3f}")
    print(f"Classes: {model.classes_}")

    return model


# ================================================================
# STEP 6: Save Model and Scaler
# ================================================================
def save_model(model, scaler):
    os.makedirs("models", exist_ok=True)
    joblib.dump(model, "models/crime_hotspot_model.pkl")
    joblib.dump(scaler, "models/scaler.pkl")
    print("💾 Model and scaler saved in /models folder.")


# ================================================================
# STEP 7: Main Flow
# ================================================================
def main():
    df = load_data()
    df = preprocess_data(df)
    df = cluster_hotspots(df)
    X, y, scaler = prepare_dataset(df)
    model = train_model(X, y)
    save_model(model, scaler)
    print("🎯 Training pipeline complete.")


if __name__ == "__main__":
    main()
