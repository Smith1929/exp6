export default function TaskItem({ task, onDelete, onUpdate }) {
  const isOverdue =
    task.deadline &&
    new Date(task.deadline) < new Date() &&
    task.status !== "Completed";

  const toggleComplete = () => {
    onUpdate(task._id, {
      status: task.status === "Completed" ? "Pending" : "Completed",
    });
  };

  const toggleImportant = () => {
    onUpdate(task._id, { isImportant: !task.isImportant });
  };

  const cyclePriority = () => {
    const cycle = { Low: "Medium", Medium: "High", High: "Low" };
    onUpdate(task._id, { priority: cycle[task.priority] });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const priorityColors = {
    Low: "#10b981",
    Medium: "#f59e0b",
    High: "#ef4444",
  };

  const priorityIcons = {
    Low: "🟢",
    Medium: "🟡",
    High: "🔴",
  };

  return (
    <div
      className={`task-item 
        ${task.status === "Completed" ? "completed" : ""} 
        ${isOverdue ? "overdue" : ""} 
        ${task.isImportant ? "important" : ""}`}
    >
      {/* Priority accent bar */}
      <div
        className="priority-bar"
        style={{ backgroundColor: priorityColors[task.priority] }}
      />

      <div className="task-content">
        {/* Top row */}
        <div className="task-top-row">
          <div className="task-main">
            <button
              className={`check-btn ${task.status === "Completed" ? "checked" : ""}`}
              onClick={toggleComplete}
              title={
                task.status === "Completed"
                  ? "Mark as pending"
                  : "Mark as complete"
              }
            >
              {task.status === "Completed" ? "✓" : ""}
            </button>
            <div className="task-text">
              <h3 className="task-title">{task.title}</h3>
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
            </div>
          </div>

          <div className="task-actions">
            <button
              className={`btn-icon-action ${task.isImportant ? "active-star" : ""}`}
              onClick={toggleImportant}
              title="Toggle important"
            >
              {task.isImportant ? "★" : "☆"}
            </button>
            <button
              className="btn-icon-action btn-delete"
              onClick={() => onDelete(task._id)}
              title="Delete task"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Bottom row - meta */}
        <div className="task-meta">
          <button
            className="badge priority-badge"
            onClick={cyclePriority}
            style={{
              backgroundColor: `${priorityColors[task.priority]}18`,
              color: priorityColors[task.priority],
              borderColor: `${priorityColors[task.priority]}40`,
            }}
            title="Click to cycle priority"
          >
            {priorityIcons[task.priority]} {task.priority}
          </button>

          <span
            className={`badge status-badge ${task.status === "Completed" ? "status-done" : "status-pending"}`}
          >
            {task.status === "Completed" ? "✅" : "⏳"} {task.status}
          </span>

          {task.deadline && (
            <span className={`badge date-badge ${isOverdue ? "overdue-badge" : ""}`}>
              📅 {formatDate(task.deadline)}
              {isOverdue && <span className="overdue-label"> — Overdue!</span>}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
