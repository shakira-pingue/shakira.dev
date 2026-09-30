# shakira.dev

This project is a personal portfolio website with a Next.js frontend and a FastAPI backend. The frontend renders the portfolio experience, while the backend exposes simple API routes such as health checks and track metadata.

## Project structure

- `frontend/` — Next.js application
- `backend/` — FastAPI application and serverless handler
- `infrastructure/` — Terraform environment configuration

## Prerequisites

Before running the project, make sure you have:

- Node.js 20+ and npm
- Python 3.11+ and pip
- A terminal with access to the project folder

## Backend setup

1. Open a terminal and go to the backend folder:

   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install the backend dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Start the API:

   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

5. The backend is now available at:

   - http://localhost:8000/health
   - http://localhost:8000/tracks

## Frontend setup

1. Open a new terminal and go to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the local development server:

   ```bash
   npm run dev
   ```

4. Open the app in a browser:

   - http://localhost:3000

## Production build

To create a production build for the frontend:

```bash
cd frontend
npm run build
npm run start
```

## Testing

At the moment, this repository does not include a dedicated automated test suite for either the frontend or the backend. The current validation steps are:

### Frontend linting

```bash
cd frontend
npm run lint
```

### Backend smoke checks

Once the backend is running, test the API manually:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/tracks
```

If both commands return successful JSON responses, the backend is running correctly.

## Environment variables

The backend reads environment variables from a `.env` file if present. The main defaults are:

- `ENVIRONMENT=dev`
- `SHAKIRA-DEV-MEDIA-URL=https://shakira-dev-media.s3.eu-west-2.amazonaws.com`

The app also allows localhost CORS access on port 3000 by default.

## Common troubleshooting

- If the frontend cannot reach the backend, confirm the API is running on port 8000.
- If you see CORS issues, make sure the backend is started before the frontend and that the allowed origins include your local frontend URL.
- If Python modules are missing, re-run the install command inside the backend virtual environment.
- If Node dependencies are missing, run `npm install` again inside the frontend folder.

## Typical local workflow

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000 in the browser.
