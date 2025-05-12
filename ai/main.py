from flask import Flask, jsonify, request

from models.predict_duration_model import load_model, predict_duration

app = Flask(__name__)

model, scaler = load_model('models/predict_duration_model.pth')


@app.route('/predict_duration')
def predict_duration_route():
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

    return jsonify({
        'seconds': seconds,
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
