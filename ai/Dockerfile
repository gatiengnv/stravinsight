FROM pytorch/pytorch:2.7.0-cuda11.8-cudnn9-runtime

WORKDIR /app

COPY ai/ .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["python", "main.py"]
