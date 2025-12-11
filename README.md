🪵 Log Ingestion & Query System

A production-ready, containerized log ingestion platform built with Next.js, Node.js, MongoDB Atlas, and Redis, designed for real-time log collection, storage, querying, and visual analytics.

This system simulates a simplified version of how companies like Datadog, Splunk, Grafana Loki ingest and query logs at scale.

🏗️ System Architecture

The following diagram illustrates how different components interact within the system:

graph TD
    %% Styling
    classDef client fill:#f9f,stroke:#333,stroke-width:1px;
    classDef frontend fill:#aff,stroke:#333,stroke-width:1px;
    classDef backend fill:#ffa,stroke:#333,stroke-width:1px;
    classDef db fill:#bfb,stroke:#333,stroke-width:1px;

    %% Nodes
    User([👤 User / Browser])
    Postman([🚀 Postman / External Client])
    
    subgraph "🌐 Application Cluster"
        Frontend[🖥️ Next.js Frontend\n(Port 3001)]
        Backend[⚙️ Express Backend API\n(Port 3000)]
    end

    subgraph "📦 Data Layer"
        Redis[(⚡ Redis Cache)]
        Mongo[(🍃 MongoDB Atlas\nPrimary Data Store)]
    end

    %% Connections
    User -->|UI Interaction| Frontend
    Frontend -->|REST API Calls| Backend
    Postman -->|Direct API Hits| Backend
    Backend -->|Cache Read/Write| Redis
    Backend -->|Persist Logs| Mongo

    %% Apply Styles
    class User,Postman client;
    class Frontend frontend;
    class Backend backend;
    class Redis,Mongo db;

🔁 CI/CD Pipeline (GitHub Actions + Docker + Kubernetes)

This project uses an automated CI/CD pipeline:

When code is pushed → GitHub Actions builds Docker images

Images are pushed to Docker Hub

Kubernetes manifests are automatically applied for deployment

flowchart LR
    Push[💻 Developer Push] -->|Triggers| GH(🐙 GitHub Actions)
    
    subgraph "🏗️ CI Phase"
        GH --> Build[🔨 Build Docker Images]
        Build --> Tag[🏷️ Tag Images With Git SHA]
        Tag --> Images[📦 Docker Images Ready]
    end
    
    subgraph "🚀 CD Phase"
        Images --> PushHub[☁️ Push to Docker Hub]
        PushHub --> UpdateK8s[⚙️ Apply K8s Manifests]
        UpdateK8s --> K8sCluster[(☸️ Kubernetes Cluster)]
    end

    style K8sCluster fill:#326ce5,stroke:#fff,stroke-width:2px,color:#fff

🛠️ Tech Stack
Frontend

Next.js (App Router)

React

Tailwind CSS

GSAP + ScrollTrigger (smooth animations)

Axios API client

Backend

Node.js + Express.js

JWT Authentication + RBAC

MongoDB + Mongoose

Redis for caching

Centralized Error Handling

DevOps

Docker (Backend + Frontend images)

Docker Compose

Kubernetes (Deployments, Services, Ingress)

GitHub Actions (CI/CD)

MongoDB Atlas

Redis (Local or Cloud)

⚙️ Features
⭐ Backend Features

Log ingestion via POST /api/logs

Advanced querying with filters:

level, message, resourceId, traceId, date range, pagination

JWT-based authentication

RBAC (admin/viewer roles)

Redis caching for repeated queries

Healthcheck endpoint: /health

Production-ready folder structure

🎨 Frontend Features

Fully responsive UI

Modern dashboard design

Smooth GSAP animations

Advanced filters panel

Expandable JSON log viewer

Login + Register (side-by-side UI)

Uses localStorage-based JWT auth

🧪 DevOps Features

Multi-stage Docker builds (optimized)

Environment variables support for containers

Kubernetes manifests for:

Deployments

Services

Ingress Controller

Secrets & ConfigMaps

CI/CD workflow (GitHub Actions):

Auto-build

Auto-tag

Auto-deploy

🏃 Getting Started
✅ 1. Clone the Repo
git clone <your-repo-url>
cd log-ingestion-system

✅ 2. Setup Environment Variables
Backend .env.example
MONGO_URI=your-mongodb-atlas-url
JWT_SECRET=your-secret
TOKEN_EXPIRY=1d
REDIS_URL=redis://localhost:6379
PORT=3000

Frontend .env.example
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000


⚠️ Never commit actual .env files — only .env.example.

🐳 Run Using Docker Compose
Start backend + frontend + redis:
docker compose up --build -d

Access:

Frontend: http://localhost:3001

Backend API: http://localhost:3000

Healthcheck: http://localhost:3000/health

☸️ Kubernetes Deployment (Optional)

Create secret:

kubectl create secret generic app-secrets \
  --from-literal=MONGO_URI="..." \
  --from-literal=JWT_SECRET="..." \
  --from-literal=REDIS_URL="redis://redis:6379"


Apply manifests:

kubectl apply -f k8s/


Check:

kubectl get pods
kubectl get svc
kubectl get ingress

📁 Project Structure
log-ingestion-system/
│
├── backend/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── k8s/
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── ingress.yaml
│   └── secrets.example.yaml
│
├── docker-compose.yml
├── README.md
└── .gitignore

🎯 Future Enhancements

WebSocket real-time live log streaming

Integration with Kafka / RabbitMQ

Multi-tenant log storage

Grafana dashboards

OpenTelemetry tracinghost:3001)
-   **Backend:** [http://localhost:3000](http://localhost:3000)
