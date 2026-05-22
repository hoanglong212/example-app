# Product Manager

Project da duoc tach thanh 2 phan rieng:

- `backend/`: Laravel API.
- `frontend/`: React + Vite app.

## Chay backend

```bash
cd backend
composer install
php artisan migrate
php artisan storage:link
php artisan serve
```

Backend mac dinh chay tai `http://127.0.0.1:8000`, API nam duoi `/api`.

## Chay frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend mac dinh chay tai `http://127.0.0.1:5173`. Khi dev, Vite proxy request `/api` sang backend.

Neu muon doi backend URL, copy `frontend/.env.example` thanh `frontend/.env` va sua:

```bash
VITE_API_BASE_URL=/api
VITE_BACKEND_URL=http://127.0.0.1:8000
```

## Build frontend

```bash
cd frontend
npm run build
```
