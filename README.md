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
# Backend Configuration
PORT=3001
HOSTNAME=0.0.0.0
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Frontend Configuration (for build)
VITE_API_URL=http://localhost:3001
```

**Backend Variables:**
- `PORT` - Backend server port (default: 3001)
- `HOSTNAME` - Host to bind to (default: 0.0.0.0)
- `NODE_ENV` - Environment mode (development/production)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)

**Frontend Variables:**
- `VITE_API_URL` - Backend API URL (used during build, default: http://localhost:3001)

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
│   ├── index.ts     # Express server with API proxy
│   └── Dockerfile   # Backend container configuration
├── src/             # Frontend React application
│   ├── services/    # API service layer
│   └── App.tsx      # Main application component
└── vite.config.ts   # Vite configuration with proxy
```

## Backend API

The backend is an Express.js server that acts as a secure proxy for OpenAI and Anthropic API requests. It handles API key authentication and forwards requests to the respective providers.

### API Endpoints

#### Health Check
- **GET** `/health`
  - Returns server status and timestamp
  - Response: `{ status: 'ok', timestamp: 'ISO8601' }`

#### Anthropic (Claude) API Proxy
- **POST** `/api/anthropic/v1/messages`
  - Proxies requests to Anthropic Claude API
  - **Headers:**
    - `x-api-key`: Your Anthropic API key (required)
    - `anthropic-version`: API version (defaults to '2023-06-01')
  - **Body:** Standard Anthropic messages API request format
  - Returns the response from Anthropic API

#### OpenAI API Proxy
- **POST** `/api/openai/v1/chat/completions`
  - Proxies requests to OpenAI API
  - **Headers:**
    - `Authorization`: Bearer token with your OpenAI API key (required)
    - Format: `Bearer <your-api-key>`
  - **Body:** Standard OpenAI chat completions API request format
  - Returns the response from OpenAI API

### Backend Configuration

#### Environment Variables

Create a `.env` file in the root directory (optional for development):

```env
# Server Configuration
PORT=3001
HOSTNAME=0.0.0.0
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Environment Variables:**
- `PORT` (default: 3001) - Port the backend server listens on
- `HOSTNAME` (default: 0.0.0.0) - Host address to bind to
- `NODE_ENV` - Environment mode (development/production)
- `FRONTEND_URL` - Frontend URL for CORS configuration

#### CORS Configuration

The backend automatically allows requests from:
- The configured `FRONTEND_URL`
- `http://localhost:5173` (development)
- `http://localhost:80` (Docker frontend)
- `http://frontend:80` (Docker internal network)
- `http://localhost:3000` (alternative dev port)
- All origins in development mode (`NODE_ENV=development`)

### Backend Development

#### Running the Backend

**Development mode (with hot reload):**
```bash
npm run dev:server
```

**Production build:**
```bash
# Build TypeScript
npm run build:server

# Run the server
npm run start:server
```

#### Backend Structure

- **`server/index.ts`** - Main Express server file
  - Sets up CORS middleware
  - Configures API proxy endpoints
  - Handles health checks
  - Manages request forwarding to OpenAI/Anthropic

### Backend Docker Setup

The backend uses a separate Dockerfile at `server/Dockerfile`:

**Build Process:**
1. Multi-stage build using Node.js 20 Alpine
2. Installs dependencies with `npm ci`
3. Compiles TypeScript to JavaScript
4. Runs as non-root user (nodejs) for security
5. Exposes port 3001

**Key Features:**
- Production-optimized image
- Non-root user execution
- Minimal Alpine-based image size
- Separate build and runtime stages

## Docker Deployment

### Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

### Quick Start with Docker

1. **Build and run both containers:**
   ```bash
   docker-compose up --build
   ```
   
   Or use the npm script:
   ```bash
   npm run docker:build && npm run docker:up
   ```

2. **Run in detached mode (background):**
   ```bash
   docker-compose up -d --build
   ```
   
   Or use the npm script:
   ```bash
   npm run docker:up
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```
   
   Or use the npm script:
   ```bash
   npm run docker:logs
   ```

4. **Stop containers:**
   ```bash
   docker-compose down
   ```
   
   Or use the npm script:
   ```bash
   npm run docker:down
   ```

5. **Restart containers:**
   ```bash
   npm run docker:restart
   ```

### Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### Docker Services

The application consists of two containers:

1. **Backend Container** (`fittrack-backend`)
   - **Technology:** Express.js API server (Node.js 20)
   - **Port:** 3001 (exposed to host)
   - **Dockerfile:** `server/Dockerfile`
   - **Build Context:** Root directory (uses `server/` subdirectory)
   - **Features:**
     - Handles API proxy requests to OpenAI and Anthropic
     - Health check endpoint at `/health`
     - CORS configured for frontend communication
     - Runs as non-root user (nodejs) for security
     - Health check configured in docker-compose (waits for service to be ready)
   - **Environment Variables:**
     - `NODE_ENV=production`
     - `PORT=3001`
     - `HOSTNAME=0.0.0.0`
     - `FRONTEND_URL=http://localhost:80`
   - **Dependencies:** Frontend waits for backend health check before starting

2. **Frontend Container** (`fittrack-frontend`)
   - **Technology:** Nginx web server serving React app
   - **Internal Port:** 80
   - **External Port:** 8080 (mapped in docker-compose)
   - **Dockerfile:** Root `Dockerfile`
   - **Features:**
     - Serves built React application
     - Proxies API requests to backend container
     - SPA routing configured (all routes serve index.html)
     - Gzip compression enabled
     - Security headers configured
     - Static asset caching
   - **Build Args:**
     - `VITE_API_URL=http://localhost:3001` (API URL for frontend)
   - **Dependencies:** Waits for backend to be healthy before starting

### Docker Commands

**Build images:**
```bash
docker-compose build
# Or use npm script:
npm run docker:build
```

**Start services:**
```bash
docker-compose start
# Or use npm script:
npm run docker:up
```

**Stop services:**
```bash
docker-compose stop
# Or use npm script:
npm run docker:down
```

**View logs:**
```bash
docker-compose logs -f
# Or use npm script:
npm run docker:logs
```

**Restart services:**
```bash
npm run docker:restart
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

### Available NPM Docker Scripts

The project includes convenient npm scripts for Docker operations:

- `npm run docker:build` - Build Docker images
- `npm run docker:up` - Start containers in detached mode
- `npm run docker:down` - Stop and remove containers
- `npm run docker:logs` - View container logs (follow mode)
- `npm run docker:restart` - Restart all containers

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
