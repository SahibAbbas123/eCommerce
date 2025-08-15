# ShopFlow – Full-Stack eCommerce Platform

> A modern, full-featured e-commerce solution with a Next.js frontend and a Node.js + Prisma backend, developed as part of our final project.

[![Frontend: Next.js](https://img.shields.io/badge/Frontend-Next.js_15-black)](https://nextjs.org/)
[![Backend: Node.js](https://img.shields.io/badge/Backend-Node.js_Express-green)](https://nodejs.org/)
[![Database: Prisma](https://img.shields.io/badge/Database-Prisma_ORM-blue)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC)](https://tailwindcss.com/)

---
## 👥 Authors

S. M. Shahinul Karim – 21701023 \
Sahib Abbas Bahar Chowdhury – 21701022 \
Misbah Ul Haque Arafat – 21701033


## 📦 Overview

This repository is the **parent** for the ShopFlow project.  
It contains two Git submodules that together form the complete application:

- **[Frontend – shopflow_frontend](https://github.com/ShahinulRafi/shopflow_frontend.git)**  
  Next.js 15 App Router storefront + admin dashboard with Tailwind CSS, Zustand, and TypeScript.

- **[Backend – shopflow_backend](https://github.com/ShahinulRafi/shopflow_backend.git)**  
  Node.js + Express + Prisma API with authentication, product management, and order processing.

The parent repo **only stores submodule references** (specific commits) to keep frontend and backend in sync.

---

## 🛠️ Architecture

```mermaid
graph LR
    subgraph Frontend [Frontend - Next.js]
        UI[Storefront & Admin Dashboard]
        UI --> API_Calls
    end

    subgraph Backend [Backend - Node.js + Prisma]
        API[REST API Endpoints]
        API --> DB[(Database)]
    end

    API_Calls --> API
````

---

## 📂 Repository Structure

```
eCommerce/
├── shopflow_backend/     # Backend submodule
├── shopflow_frontend/    # Frontend submodule
├── .gitmodules           # Submodule config
└── .gitignore
```

---

## 🚀 Quick Start – Full Stack

### 1️⃣ Clone with Submodules

```bash
git clone --recurse-submodules https://github.com/SahibAbbas123/eCommerce.git
```

If already cloned:

```bash
git submodule init
git submodule update
```

---

### 2️⃣ Setup Backend

```bash
cd shopflow_backend
npm install
cp .env.example .env   # Set DB + JWT secret
npx prisma migrate dev
npm run seed
npm run dev            # Runs on http://localhost:4001
```

---

### 3️⃣ Setup Frontend

```bash
cd ../shopflow_frontend
npm install
cp .env.example .env.local   # Set NEXT_PUBLIC_API_BASE to backend URL
npm run dev                  # Runs on http://localhost:3000
```

---

### 4️⃣ Access the App

* Storefront → [http://localhost:3000](http://localhost:3000)
* Admin Dashboard → [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🔄 Development Workflow

1. Work in the **appropriate submodule** (frontend or backend).
2. Commit & push changes in that submodule’s repo.
3. Update the parent repo to track the new commit:

   ```bash
   cd ..
   git add shopflow_backend  # or shopflow_frontend
   git commit -m "Update backend to latest commit"
   git push
   ```

---

## 📚 Related Documentation

* [Frontend README](https://github.com/ShahinulRafi/shopflow_frontend.git)
* [Backend README](https://github.com/ShahinulRafi/shopflow_backend.git)


---
