# FitTrack - CV/Resume ATS Optimizer

A React + TypeScript application for optimizing CVs/resumes for Applicant Tracking Systems (ATS) with AI-powered analysis and adaptation.

## Features

- **ATS Format Checking**: Analyze your CV/resume for ATS compatibility
- **CV Adaptation**: Adapt your CV to match specific job descriptions
- **LaTeX Generation**: Generate LaTeX code for professional CV formatting
- **Multi-Provider Support**: Works with OpenAI and Anthropic (Claude) APIs
- **Secure Backend**: API keys are handled securely through a backend proxy

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Express.js, Node.js
- **APIs**: OpenAI, Anthropic Claude

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (optional for development):

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 3. Development

#### Option A: Run Both Frontend and Backend Together

```bash
npm run dev:all
```

This will start:
- Backend API server on `http://localhost:3001`
- Frontend dev server on `http://localhost:5173`

#### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 4. Production Build

Build the frontend:
```bash
npm run build
```

Build the backend:
```bash
npm run build:server
```

Start the backend server:
```bash
npm run start:server
```

For production, make sure to set the `VITE_API_URL` environment variable in your frontend build to point to your backend API URL.

## Usage

1. **Configure API**: Click the "⚙️ Configure API" button and enter your API key
2. **Upload CV**: Upload your CV/resume as a text file or paste the content
3. **Check ATS Format**: Get your CV analyzed for ATS compatibility
4. **Adapt CV**: Provide a job description to adapt your CV accordingly
5. **Download**: Download the LaTeX code or PDF (if available)

## Security Notes

- API keys are sent from the frontend to the backend proxy
- The backend securely forwards requests to the actual API providers
- Never commit `.env` files or expose API keys in client-side code
- For production, consider implementing server-side API key storage

## Project Structure

```
FitTrack/
├── server/          # Backend API server
│   └── index.ts     # Express server with API proxy
├── src/             # Frontend React application
│   ├── services/    # API service layer
│   └── App.tsx      # Main application component
└── vite.config.ts   # Vite configuration with proxy
```

## Docker Deployment

### Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

### Quick Start with Docker

1. **Build and run both containers:**
   ```bash
   docker-compose up --build
   ```

2. **Run in detached mode (background):**
   ```bash
   docker-compose up -d --build
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Stop containers:**
   ```bash
   docker-compose down
   ```

### Access the Application

- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### Docker Services

The application consists of two containers:

1. **Backend Container** (`fittrack-backend`)
   - Express.js API server
   - Port: 3001
   - Handles API proxy requests
   - Health check endpoint available

2. **Frontend Container** (`fittrack-frontend`)
   - Nginx web server serving React app
   - Port: 80
   - Proxies API requests to backend
   - SPA routing configured

### Docker Commands

**Build images:**
```bash
docker-compose build
```

**Start services:**
```bash
docker-compose start
```

**Stop services:**
```bash
docker-compose stop
```

**Remove containers and volumes:**
```bash
docker-compose down -v
```

**View service status:**
```bash
docker-compose ps
```

**Rebuild specific service:**
```bash
docker-compose build backend
docker-compose build frontend
```

### Production Deployment

For production, you may want to:

1. **Use environment-specific docker-compose file:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Set environment variables:**
   - Update `FRONTEND_URL` in docker-compose.yml
   - Configure proper domain names
   - Set up SSL/TLS certificates (consider using a reverse proxy like Traefik)

3. **Use Docker secrets** for sensitive data (API keys, etc.)

4. **Configure resource limits** in docker-compose.yml:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1'
         memory: 512M
   ```

## License

MIT
