# ⚡ Smart Task Tracker — MERN Stack Application

A full-stack task management app built with **MongoDB**, **Express.js**, **React (Vite)**, and **Node.js**.

---

## 📁 Project Structure

```
exp6/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   └── Task.js            # Mongoose Task schema
│   ├── routes/
│   │   └── taskRoutes.js      # REST API routes
│   ├── server.js              # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx   # Add new task form
│   │   │   ├── TaskItem.jsx   # Individual task card
│   │   │   └── TaskList.jsx   # Task list with filters & stats
│   │   ├── App.jsx            # Main app component
│   │   ├── App.css            # All styles
│   │   └── main.jsx           # React entry point
│   ├── index.html
│   └── package.json
└── README.md
```

---

## 🚀 Setup & Run Instructions

### Prerequisites

- **Node.js** (v18+)
- **MongoDB** running locally (via MongoDB Compass or `mongod`)
  - Connection: `mongodb://127.0.0.1:27017/tasktracker`

### 1. Install & Start Backend

```bash
cd exp6/backend
npm install
npm run dev
```

Backend runs on **http://localhost:5000**

### 2. Install & Start Frontend

```bash
cd exp6/frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## 📡 REST API Endpoints

| Method   | Endpoint          | Description       |
| -------- | ----------------- | ----------------- |
| `GET`    | `/api/tasks`      | Get all tasks     |
| `POST`   | `/api/tasks`      | Create a new task |
| `PUT`    | `/api/tasks/:id`  | Update a task     |
| `DELETE` | `/api/tasks/:id`  | Delete a task     |

### Sample POST Body

```json
{
  "title": "Complete assignment",
  "description": "FSD Experiment 6",
  "deadline": "2026-05-01",
  "priority": "High",
  "status": "Pending",
  "isImportant": true
}
```

---

## ✨ Features

- ✅ Add, update, delete tasks (full CRUD)
- 🔴🟡🟢 Priority levels (High / Medium / Low) — click to cycle
- ⭐ Mark tasks as important
- ⏰ Overdue task highlighting with blinking indicator
- 📊 Live stats: Total, Completed, Pending, Overdue counts
- 🔍 Search tasks by title/description
- 🏷️ Filter tabs: All, Pending, Completed, Important, Overdue
- 🌑 Premium dark theme with ambient animations
- 🔔 Toast notifications for all actions
- 📱 Fully responsive layout

---

## 🛠️ Tech Stack

| Layer      | Technology        |
| ---------- | ----------------- |
| Frontend   | React + Vite      |
| Backend    | Node.js + Express |
| Database   | MongoDB + Mongoose|
| HTTP Client| Axios             |
| Styling    | Vanilla CSS       |

---

## 📝 Task Model Schema

```js
{
  title:       { type: String, required: true },
  description: { type: String },
  deadline:    { type: Date },
  status:      { type: String, enum: ["Pending", "Completed"] },
  priority:    { type: String, enum: ["Low", "Medium", "High"] },
  isImportant: { type: Boolean, default: false },
  timestamps:  true  // createdAt, updatedAt
}
```
