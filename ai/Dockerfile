FROM python:3.13-slim-bookworm

WORKDIR /app

COPY ai/ .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["python", "main.py"]
