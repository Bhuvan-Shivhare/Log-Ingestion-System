# 🪵 Log Ingestion & Query System  

A full-stack, production-ready **Log Ingestion & Query Platform** built with:  
**Next.js**, **Node.js**, **MongoDB Atlas**, **Redis**, **GSAP**, **Docker**, and **Kubernetes**.  
This system simulates real-world distributed logging pipelines used in companies.

## 🎥 Project Demo Video

[![Demo Video]](https://drive.google.com/file/d/1ezY5iY3yN9hr-pu9mjW-nbHuwSP6gwYn/view?usp=sharing)

#DEMO PHOTOS
<img width="1436" height="715" alt="Screenshot 2025-12-11 at 11 37 40 PM" src="https://github.com/user-attachments/assets/0b389c18-6a33-449b-b03c-9e04ffc53cdf" />

  <img width="1440" height="816" alt="Screenshot 2025-12-11 at 11 37 24 PM" src="https://github.com/user-attachments/assets/6c1ec757-b22b-4438-94b6-0d01cd976ff2" />


---

## 📌 Features Overview

### 🔥 Backend (Node.js + Express + MongoDB + Redis)
- Log ingestion API → `POST /api/logs`
- Advanced log querying → `GET /api/logs`
  - Level, message, resourceId, traceId filters
  - Date range filters
  - Pagination + sorting
- JWT Authentication (Register + Login)
- RBAC roles → Admin / Viewer
- Redis-backed caching (faster repeated log queries)
- MongoDB Atlas persistent storage
- Full error-handling + healthcheck `/health`

---

## 🎨 Frontend (Next.js + Tailwind + GSAP Animations)
- Modern responsive UI
- GSAP + ScrollTrigger animations
- Combined Login + Register screen
- Smooth route transitions (Login → Dashboard)
- Logs Dashboard:
  - Filters panel
  - Logs table with pagination
  - Expandable log JSON viewer
  - Cache status indicator (Live / Cached)
- Axios client for backend communication

---

## ⚙️ DevOps (Docker + Kubernetes + GitHub Actions)
- Dockerized backend and frontend (multi-stage builds)
- Kubernetes manifests:
  - Deployments
  - Services
  - Ingress
  - ConfigMaps & Secrets
- Redis + Backend + Frontend containerized
- GitHub Actions (CI/CD ready)
- Works with Minikube / Docker Desktop Kubernetes / Cloud (GKE, EKS, DO)

---
# 🏗️ System Architecture
```
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
└── README.md

```
Environment Variables
Backend → .env.example
```MONGO_URI=
JWT_SECRET=
TOKEN_EXPIRY=1d
REDIS_URL=redis://localhost:6379
PORT=3000
```

Frontend → .env.example
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000


Running Locally (Backend + Frontend)
Install dependencies
cd backend && npm install
cd ../frontend && npm install

Run backend
npm run dev

Run frontend
npm run dev

#Kuberenets Deployment 
``` 
    kubectl create secret generic app-secrets \
  --from-literal=MONGO_URI="..." \
  --from-literal=JWT_SECRET="..." \
  --from-literal=REDIS_URL="redis://redis:6379"
  ```
  🧪 API Endpoints Summary
🔐 Authentication
Method	Endpoint	Description
POST	/auth/register	Register a new user
POST	/auth/login	Login & receive JWT
📝 Log APIs
Method	Endpoint	Description
POST	/api/logs	Ingest log
GET	/api/logs	Query logs with filters
Filters supported
level=
message=
resourceId=
traceId=
from=
to=
page=
limit=

🎯 Why This Project Stands Out (Resume / Interview Ready)

Real backend engineering (auth, caching, querying, pagination)
Professional frontend with animations
Distributed architecture simulation
DevOps CI/CD pipeline ready
Full containerized microservice setup
Cloud-ready deployment

Demonstrates system design + production engineering skills

Perfect for:

Backend Developer
Fullstack Developer
DevOps / Cloud Engineer
Portfolio Enhancement

👤 Author

Bhuvan Shivhare
Backend | Fullstack | DevOps
⭐ Feel free to star the repo if you like this project!


---

# 🟢 DONE!  



