import { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import "./App.css";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TASK_API = BASE + "/api/tasks";
const CONTACT_API = BASE + "/api/contacts";

function App() {
  const [activeTab, setActiveTab] = useState("tasks");

  // ─── Task State ───
  const [tasks, setTasks] = useState([]);
  const [taskLoading, setTaskLoading] = useState(true);
  const [taskError, setTaskError] = useState("");

  // ─── Contact State ───
  const [contacts, setContacts] = useState([]);
  const [contactLoading, setContactLoading] = useState(true);
  const [contactError, setContactError] = useState("");
  const [editingContact, setEditingContact] = useState(null);

  // ─── Toast ───
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ══════════════════════════════════
  // TASK CRUD
  // ══════════════════════════════════
  const fetchTasks = async () => {
    try {
      setTaskLoading(true);
      const res = await axios.get(TASK_API);
      setTasks(res.data.data);
      setTaskError("");
    } catch (err) {
      setTaskError("Failed to load tasks. Is the backend running?");
    } finally {
      setTaskLoading(false);
    }
  };

  const addTask = async (task) => {
    try {
      const res = await axios.post(TASK_API, task);
      setTasks((prev) => [res.data.data, ...prev]);
      showToast("Task created successfully!");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to add task",
        "error"
      );
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const res = await axios.put(`${TASK_API}/${id}`, updates);
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

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${TASK_API}/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      showToast("Task deleted!");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to delete task",
        "error"
      );
    }
  };

  // ══════════════════════════════════
  // CONTACT CRUD
  // ══════════════════════════════════
  const fetchContacts = async () => {
    try {
      setContactLoading(true);
      const res = await axios.get(CONTACT_API);
      setContacts(res.data.data);
      setContactError("");
    } catch (err) {
      setContactError("Failed to load contacts. Is the backend running?");
    } finally {
      setContactLoading(false);
    }
  };

  const addContact = async (contact) => {
    try {
      const res = await axios.post(CONTACT_API, contact);
      setContacts((prev) => [res.data.data, ...prev]);
      showToast("Contact added successfully!");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to add contact",
        "error"
      );
    }
  };

  const updateContact = async (id, updates) => {
    try {
      const res = await axios.put(`${CONTACT_API}/${id}`, updates);
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? res.data.data : c))
      );
      setEditingContact(null);
      showToast("Contact updated!");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update contact",
        "error"
      );
    }
  };

  const deleteContact = async (id) => {
    try {
      await axios.delete(`${CONTACT_API}/${id}`);
      setContacts((prev) => prev.filter((c) => c._id !== id));
      if (editingContact?._id === id) setEditingContact(null);
      showToast("Contact deleted!");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to delete contact",
        "error"
      );
    }
  };

  // ─── Fetch data on mount & tab change ───
  useEffect(() => {
    fetchTasks();
    fetchContacts();
  }, []);

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

        {/* ─── Tab Navigation ─── */}
        <nav className="tab-nav">
          <button
            className={`tab-btn ${activeTab === "tasks" ? "active" : ""}`}
            onClick={() => setActiveTab("tasks")}
          >
            <span className="tab-icon">📝</span>
            Tasks
          </button>
          <button
            className={`tab-btn ${activeTab === "contacts" ? "active" : ""}`}
            onClick={() => setActiveTab("contacts")}
          >
            <span className="tab-icon">👤</span>
            Contacts
          </button>
        </nav>
      </header>

      <main className="main-content">
        {/* ══════ TASKS TAB ══════ */}
        {activeTab === "tasks" && (
          <>
            <TaskForm onAdd={addTask} />

            {taskLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading tasks...</p>
              </div>
            ) : taskError ? (
              <div className="error-state">
                <p>{taskError}</p>
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
          </>
        )}

        {/* ══════ CONTACTS TAB ══════ */}
        {activeTab === "contacts" && (
          <>
            <ContactForm
              key={editingContact ? editingContact._id : "new"}
              onAdd={addContact}
              editingContact={editingContact}
              onUpdate={updateContact}
              onCancelEdit={() => setEditingContact(null)}
            />

            {contactLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading contacts...</p>
              </div>
            ) : contactError ? (
              <div className="error-state">
                <p>{contactError}</p>
                <button className="btn-retry" onClick={fetchContacts}>
                  Retry
                </button>
              </div>
            ) : (
              <ContactList
                contacts={contacts}
                onDelete={deleteContact}
                onEdit={(contact) => setEditingContact(contact)}
              />
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Just Do It</p>
      </footer>
    </div>
  );
}

export default App;
