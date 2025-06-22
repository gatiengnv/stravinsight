# Stravinsight – Symfony Docker

Stravinsight is a powerful data-driven web application that syncs and analyzes your sports activity data from Strava.
Built with Symfony, FrankenPHP, and Caddy, it offers real-time dashboards, AI-powered insights via Gemini, and a sleek Google Maps-based visualization interface.

This Dockerized setup makes it easy to launch Stravinsight in both development and production environments with modern tooling and optimal performance.

[Test Stravinsight online](https://stravinsight.com)

![CI](https://github.com/dunglas/symfony-docker/workflows/CI/badge.svg)

## 🚀 Getting Started
1. Clone the repository
```bash
   git clone https://github.com/gatiengnv/stravinsight
```
2. Make sure [Docker Compose](https://docs.docker.com/compose/install/) (v2.10+) is installed.
3. Build the Docker images fresh:
```bash
  DOMAIN=localhost docker compose build --no-cache
```

Start the full stack with:
```bash
    DOMAIN=localhost docker compose -f compose.traefik.yaml -f compose.yaml -f compose.override.yaml up --pull always -d --wait
```
Open your browser at `https://localhost` and accept the auto-generated TLS certificate.

Stop everything cleanly:
```bash
   DOMAIN=localhost docker compose down --remove-orphans
```

## 🔐 Required Environment Variables

Before running, create a `.env.local` file or set these variables in your environment:

```env
### OAuth – Strava ###
OAUTH_STRAVA_CLIENT_ID=YOUR_STRAVA_CLIENT_ID
OAUTH_STRAVA_CLIENT_SECRET=YOUR_STRAVA_CLIENT_SECRET

### Google APIs ###
GOOGLE_MAP_API_KEY=YOUR_GOOGLE_MAP_API_KEY
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

### Symfony App ###
APP_SECRET=ChangeThisToARealSecret

### PostgreSQL Database ###
DATABASE_URL=postgresql://app:password@database:5432/app?serverVersion=16&charset=utf8
POSTGRES_USER=app
POSTGRES_PASSWORD=password
POSTGRES_DB=app

### Premium Mode ###
PREMIUM_MODE=1
```

## ✨ Features

- Strava OAuth2 Integration for activity sync
- Real-time metrics and map views
- AI insights powered by Gemini (Google AI)
- Google Maps for route visualizations
- Full HTTPS with Traefik and Caddy
- Powered by FrankenPHP for performance
- One-command launch with Docker Compose

## 🧑‍💻 Credits

- Created by [Gatien Genevois](https://www.linkedin.com/in/gatiengnv/) as part of the Stravinsight project
- Based on Symfony Docker by Kévin Dunglas

Happy syncing & running with Stravinsight!
