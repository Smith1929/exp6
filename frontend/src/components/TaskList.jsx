import { useState } from "react";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onDelete, onUpdate }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = tasks.filter((t) => {
    if (filter === "completed" && t.status !== "Completed") return false;
    if (filter === "pending" && t.status !== "Pending") return false;
    if (filter === "important" && !t.isImportant) return false;
    if (
      filter === "overdue" &&
      !(t.deadline && new Date(t.deadline) < new Date() && t.status !== "Completed")
    )
      return false;
    if (
      search &&
      !t.title.toLowerCase().includes(search.toLowerCase()) &&
      !t.description?.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const pending = total - completed;
  const overdue = tasks.filter(
    (t) =>
      t.deadline &&
      new Date(t.deadline) < new Date() &&
      t.status !== "Completed"
  ).length;

  return (
    <div className="task-list-section">
      {/* Stats bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <span className="stat-number">{total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card stat-completed">
          <span className="stat-number">{completed}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-card stat-pending">
          <span className="stat-number">{pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        {overdue > 0 && (
          <div className="stat-card stat-overdue">
            <span className="stat-number">{overdue}</span>
            <span className="stat-label">Overdue</span>
          </div>
        )}
      </div>

      {/* Filter + Search */}
      <div className="controls-bar">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-tabs">
          {["all", "pending", "completed", "important", "overdue"].map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Task items */}
      <div className="task-items">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p className="empty-text">
              {tasks.length === 0
                ? "No tasks yet. Create your first task above!"
                : "No tasks match the current filter."}
            </p>
          </div>
        ) : (
          filtered.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
}
