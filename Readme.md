# 📊 Family Investment Dashboard

A full-stack web application that allows family members to view investment portfolios and chat with each other in real time.  
Built using **React**, **Express.js**, **Redis**, and **WebSockets**.

---

## 💠 Prerequisites

- Node.js (v18+ recommended)
- Redis server running locally on `localhost:6379`

To install Redis (Mac):

```bash
brew install redis
brew services start redis
```

---

## 📁 Project Structure

```
repo_name/
├── frontend/      # React.js (Client)
│   └── package.json
├── backend/       # Express.js API + WebSocket + Redis
│   └── package.json
```

---

## ✨ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/franklinjoseph360/mvp-invest-dashboard.git
cd mvp-invest-dashboard
```

---

### 2. Install Dependencies

#### 🔧 Backend

```bash
cd backend
npm install
```

#### 💼 Frontend

```bash
cd ../frontend
npm install
```

---

### 3. Build the Frontend

```bash
cd frontend
npm run build
```

This compiles your React app into static files at `frontend/dist`.

---

### 4. Load mock data

```bash
cd ../backend
node data/loadData.js
```

---

### 5. Start the Server

```bash
node server.js
```

This will:
- Serve the frontend at `http://localhost:3000/app`
- Launch the Express API
- Connect to Redis
- Start the WebSocket server

---

## 🔪 Development Tips

### Optional: Run frontend separately for development

```bash
cd frontend
npm run dev
```

### Optional: Use `nodemon` for backend hot reload

```bash
cd backend
npx nodemon server.js
```

---

## 🔌 WebSocket

- URL: `ws://localhost:3000`
- Used for real-time group chat in each family

---

## 📝 API Overview

| Endpoint                          | Description                     |
|----------------------------------|---------------------------------|
| `GET /api/v1/dashboard`          | Get user dashboard data         |
| `GET /api/v1/chat/:familyId/:userId` | Fetch family group messages     |
| `POST /api/v1/chat/:familyId/:userId` | Send new message                |
| `POST /api/v1/auth/login`        | Login user                      |
| `GET /api/v1/auth/authorize`     | Get logged-in user details      |
| `POST /api/v1/auth/logout`       | Logout user                     |

---

## 📷 Screenshots

> _(Add screenshots of the dashboard and chat interface here)_

---

## 📍 License

MIT License

---

### 🤝 Contributing

Pull requests are welcome. Let’s build something fun together!

