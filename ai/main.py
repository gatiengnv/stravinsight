import json

from flask import Flask, jsonify, request
from flask_cors import CORS

from models.predict_duration_model import load_model, predict_duration

app = Flask(__name__)
CORS(app)

model, scaler = load_model('models/predict_duration_model.pth')


def time_to_seconds(time_str):
    parts = time_str.split(':')
    if len(parts) == 3:
        hours, minutes, seconds = map(int, parts)
        return hours * 3600 + minutes * 60 + seconds
    elif len(parts) == 2:
        minutes, seconds = map(int, parts)
        return minutes * 60 + seconds
    else:
        raise ValueError("Invalid time format")


@app.route('/predict_duration')
def predict_duration_route():
    # Calculate first prediction
    distance = float(request.args.get('distance', 10000))
    elevation_gain = float(request.args.get('elevation_gain', 0))
    heart_rate = float(request.args.get('heart_rate', 150))
    gender = request.args.get('gender', 'M')
    seconds = predict_duration(
        distance=distance,
        elevation_gain=elevation_gain,
        heart_rate=heart_rate,
        gender=gender,
        model=model,
        scaler=scaler
    )

    # init the correction factor
    correction_factor = 1.0
    correction_factor_sum = 0.0

    try:
        similar_activities_json = request.args.get('similar_activities', '[]')
        similar_activities = json.loads(similar_activities_json)
        for activity in similar_activities:
            distance = float(activity['distance'].replace(' km', '')) * 1000
            elevation_gain = int(activity['totalElevationGain'])
            heart_rate = int(activity['averageHeartrate'])
            moving_time = time_to_seconds(activity['movingTime'])

            # Calculate the correction factor
            prediction = predict_duration(
                distance=distance,
                elevation_gain=elevation_gain,
                heart_rate=heart_rate,
                gender=gender,
                model=model,
                scaler=scaler
            )

            # Calculate the correction factor for this activity
            correction_factor_sum += moving_time / prediction
            print(f"Prediction {prediction}, Real time {moving_time}, Correction factor {moving_time / prediction}")

        if similar_activities:
            # Calculate the average correction factor
            correction_factor = correction_factor_sum / len(similar_activities)



    except json.JSONDecodeError:
        print("Error decoding JSON for activities")

    return jsonify({
        'seconds': seconds * correction_factor,
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
