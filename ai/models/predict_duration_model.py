import copy

import pandas as pd
import torch
import torch.nn as nn
from torch import optim


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

    return prediction.item()


def time_to_seconds(time_str):
    parts = time_str.split(':')
    if len(parts) == 3:
        h, m, s = parts
        return int(h) * 3600 + int(m) * 60 + int(s)
    elif len(parts) == 2:
        m, s = parts
        return int(m) * 60 + int(s)
    return int(parts[0])


def adapt_model_locally(model, scaler, activities, gender, learning_rate=0.001, epochs=20):
    if not activities:
        return model

    adapted_model = copy.deepcopy(model)
    adapted_model.train()

    X_local = []
    y_local = []

    for activity in activities:
        distance = float(activity['distance'].replace(' km', '')) * 1000
        elevation_gain = int(activity['totalElevationGain'])
        heart_rate = int(activity['averageHeartrate'])
        moving_time = time_to_seconds(activity['movingTime'])

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

        X_local.append(input_scaled[0])
        y_local.append(moving_time)

    X_local = torch.tensor(X_local, dtype=torch.float32)
    y_local = torch.tensor(y_local, dtype=torch.float32).reshape(-1, 1)

    optimizer = optim.Adam(adapted_model.parameters(), lr=learning_rate)
    loss_fn = nn.MSELoss()

    for epoch in range(epochs):
        y_pred = adapted_model(X_local)
        loss = loss_fn(y_pred, y_local)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        print(f"Epoch {epoch + 1}/{epochs}, Loss: {loss.item():.4f}")

    adapted_model.eval()
    return adapted_model
