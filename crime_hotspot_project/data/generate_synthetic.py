# generate_synthetic.py
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

random.seed(42)
np.random.seed(42)

def random_point(center_lat, center_lon, radius_km):
    # rough random around center (not precise geodesic) for testing
    u = np.random.rand()
    v = np.random.rand()
    w = radius_km/111 * np.sqrt(u)
    t = 2 * np.pi * v
    lat = center_lat + w * np.cos(t)
    lon = center_lon + w * np.sin(t)
    return lat, lon

centers = [
    (12.9345, 77.6101),  # city center
    (12.9400, 77.5950),  # another cluster
    (12.9200, 77.6200)
]

crime_types = ['theft','assault','burglary','robbery','vandalism']
rows = []
start = datetime(2025,1,1,0,0,0)
for i in range(2000):
    c = centers[np.random.randint(0, len(centers))]
    lat, lon = random_point(c[0], c[1], radius_km=1.0)
    t = start + timedelta(hours=np.random.randint(0, 24*180))
    rows.append({
        'latitude': lat,
        'longitude': lon,
        'time': t.isoformat(),
        'crime_type': np.random.choice(crime_types, p=[0.4,0.2,0.15,0.15,0.1]),
        'severity': int(np.random.choice([1,2,3], p=[0.6,0.3,0.1])),
        'district': 'Downtown'
    })

df = pd.DataFrame(rows)
df.to_csv('data/crime_data.csv', index=False)
print("Generated data/crime_data.csv with", len(df), "rows")
