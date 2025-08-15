

# eCommerce Project

## Author

S. M. Shahinul Karim - 21701023 \
Sahib Abbas Bahar Chowdhury - 21701022 \
Misbah Ul Haque Arafat - 21701033

This repository serves as the **parent repository** for the eCommerce project, which is split into two submodules:

- **[shopflow_backend](https://github.com/SahibAbbas123/shopflow_backend)** – Node.js backend API, authentication, and database logic.  
- **[shopflow_frontend](https://github.com/SahibAbbas123/shopflow_frontend)** – Next.js frontend application with UI components and API integration.  

The parent repo tracks **specific commits** of each submodule to ensure reproducible setups and consistent versions.

---

## Repository Structure

```

eCommerce/
├── shopflow\_backend/    # Backend submodule
├── shopflow\_frontend/   # Frontend submodule
├── .gitmodules           # Submodule configuration
└── .gitignore            # Ignore unnecessary files

````

- Each submodule has its own `.git` history and remote repository.  
- The parent repo stores only the **commit reference** for each submodule.

---

## Cloning the Repository

To clone the parent repo along with submodules:

```bash
git clone --recurse-submodules https://github.com/SahibAbbas123/eCommerce.git
````

If you already cloned without `--recurse-submodules`:

```bash
git submodule init
git submodule update
```

This ensures both backend and frontend are checked out at the commits tracked by the parent repo.

---

## Getting Started (Run Locally)

### 1️⃣ Backend

1. Navigate to the backend folder:

```bash
cd shopflow_backend
```

2. Install dependencies:

```bash
npm install
```

3. Set environment variables if needed (e.g., `.env` file).

4. Run the backend server:

```bash
npm run dev
```

* By default, it may run on `http://localhost:4000` (check backend README for details).

---

### 2️⃣ Frontend

1. Navigate to the frontend folder:

```bash
cd shopflow_frontend
```

2. Install dependencies:

```bash
npm install
```

3. Update `.env.local` or config files if needed (e.g., `API_BASE` URL).

4. Run the frontend server:

```bash
npm run dev
```

* By default, it may run on `http://localhost:3000` and connect to the backend API.

---

### 3️⃣ Verify Full App

* Open your browser at `http://localhost:3000` and check that the frontend communicates with the backend.
* Any changes in submodules should be committed in their own repo first, then the parent repo updated to track the latest commit.

---

## Development Workflow

### Updating a Submodule

1. Navigate into the submodule:

```bash
cd shopflow_backend  # or shopflow_frontend
```

2. Make changes, commit, and push:

```bash
git add .
git commit -m "Your message"
git push origin main
```

3. Update the parent repo to point to the new submodule commit:

```bash
cd ..
git add shopflow_backend  # or shopflow_frontend
git commit -m "Update submodule to latest commit"
git push
```

---

### Pulling Updates

To pull the latest updates for the parent repo and all submodules:

```bash
git pull --recurse-submodules
git submodule update --remote --merge
```

---

## Notes

* `.DS_Store` and `node_modules` are ignored in both parent and submodules.
* Always commit and push changes in submodules first, then update the parent repo to track the latest submodule commits.
* This setup ensures the backend and frontend stay in sync with each other for stable development.

---

## References

* [shopflow\_backend README](https://github.com/SahibAbbas123/shopflow_backend)
* [shopflow\_frontend README](https://github.com/SahibAbbas123/shopflow_frontend)
---
