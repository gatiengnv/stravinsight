import pandas as pd
import torch
import torch.nn as nn


def load_model(path: str):
    model = nn.Sequential(
        nn.Linear(4, 24),
        nn.ReLU(),
        nn.Linear(24, 12),
        nn.ReLU(),
        nn.Linear(12, 6),
        nn.ReLU(),
        nn.Linear(6, 1)
    )
    from torch.serialization import add_safe_globals
    from sklearn.preprocessing._data import StandardScaler
    add_safe_globals([StandardScaler])

    checkpoint = torch.load(path, weights_only=False)

    model.load_state_dict(checkpoint['model_state_dict'])

    scaler_charge = checkpoint['scaler']

    model.eval()

    return model, scaler_charge


def predict_duration(distance, elevation_gain, heart_rate, gender, model, scaler):
    input_data_raw = pd.DataFrame({
        'distance': [distance],
        'elevation_gain': [elevation_gain],
        'average_heart_rate': [heart_rate],
        'gender': [gender]
    })

    input_data = pd.get_dummies(input_data_raw, columns=['gender'], drop_first=True)

    missing_cols = set(scaler.feature_names_in_) - set(input_data.columns)
    for col in missing_cols:
        input_data[col] = 0

    input_data = input_data[scaler.feature_names_in_]

    input_scaled = scaler.transform(input_data)

    input_tensor = torch.tensor(input_scaled, dtype=torch.float32)

    with torch.no_grad():
        prediction = model(input_tensor)

    seconds = prediction.item()

    return seconds
