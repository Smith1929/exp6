import { useState } from "react";

const defaultForm = {
  title: "",
  description: "",
  deadline: "",
  status: "Pending",
  priority: "Medium",
  isImportant: false,
};

export default function TaskForm({ onAdd }) {
  const [form, setForm] = useState({ ...defaultForm });
  const [errors, setErrors] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setErrors({ title: "Title is required" });
      return;
    }
    onAdd(form);
    setForm({ ...defaultForm });
    setErrors({});
  };

  return (
    <div className="task-form-card">
      <div
        className="form-header"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setIsExpanded(!isExpanded)}
      >
        <div className="form-header-left">
          <span className="form-icon">✦</span>
          <h2>New Task</h2>
        </div>
        <span className={`chevron ${isExpanded ? "expanded" : ""}`}>▾</span>
      </div>

      <form
        className={`task-form ${isExpanded ? "expanded" : ""}`}
        onSubmit={handleSubmit}
      >
        <div className="form-grid">
          <div className="form-group full-width">
            <label htmlFor="title">
              Title <span className="required">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              className={errors.title ? "error" : ""}
              autoComplete="off"
            />
            {errors.title && (
              <span className="error-text">{errors.title}</span>
            )}
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Add details about this task..."
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="deadline">Deadline</label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🔴 High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Pending">⏳ Pending</option>
              <option value="Completed">✅ Completed</option>
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isImportant"
                checked={form.isImportant}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <span>Mark as Important</span>
            </label>
          </div>
        </div>

        <button type="submit" className="btn-add">
          <span className="btn-icon">+</span>
          Add Task
        </button>
      </form>
    </div>
  );
}
