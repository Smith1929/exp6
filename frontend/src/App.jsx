import { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setTasks(res.data.data);
      setError("");
    } catch (err) {
      setError("Failed to load tasks. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  const addTask = async (task) => {
    try {
      const res = await axios.post(API, task);
      setTasks((prev) => [res.data.data, ...prev]);
      showToast("Task created successfully!");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to add task",
        "error"
      );
    }
  };

  // Update task
  const updateTask = async (id, updates) => {
    try {
      const res = await axios.put(`${API}/${id}`, updates);
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? res.data.data : t))
      );
      showToast("Task updated!");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update task",
        "error"
      );
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      showToast("Task deleted!");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to delete task",
        "error"
      );
    }
  };

  return (
    <div className="app">
      {/* Ambient background shapes */}
      <div className="bg-shapes">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span>{toast.type === "success" ? "+" : "x"}</span>
          {toast.message}
        </div>
      )}

      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <h1>Just Do It</h1>
          </div>
          <p className="subtitle">
            Organize, prioritize, and conquer your tasks
          </p>
        </div>
      </header>

      <main className="main-content">
        <TaskForm onAdd={addTask} />

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading tasks...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button className="btn-retry" onClick={fetchTasks}>
              Retry
            </button>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Just Do It</p>
      </footer>
    </div>
  );
}

export default App;
