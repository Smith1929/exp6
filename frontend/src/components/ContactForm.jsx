import { useState } from "react";

const defaultForm = {
  name: "",
  email: "",
  phone: "",
};

export default function ContactForm({ onAdd, editingContact, onUpdate, onCancelEdit }) {
  const [form, setForm] = useState(
    editingContact
      ? { name: editingContact.name, email: editingContact.email, phone: editingContact.phone }
      : { ...defaultForm }
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "Please enter a valid email";
      }
    }
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingContact) {
      onUpdate(editingContact._id, form);
    } else {
      onAdd(form);
    }
    setForm({ ...defaultForm });
    setErrors({});
  };

  return (
    <div className="task-form-card contact-form-card">
      <div className="form-header form-header-static">
        <div className="form-header-left">
          <span className="form-icon">👤</span>
          <h2>{editingContact ? "Edit Contact" : "New Contact"}</h2>
        </div>
      </div>

      <form className="task-form expanded" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group full-width">
            <label htmlFor="contact-name">
              Name <span className="required">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
              autoComplete="off"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contact-email">
              Email <span className="required">*</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="text"
              placeholder="email@example.com"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              autoComplete="off"
            />
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="contact-phone">
              Phone <span className="required">*</span>
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="text"
              placeholder="+1 234 567 890"
              value={form.phone}
              onChange={handleChange}
              className={errors.phone ? "error" : ""}
              autoComplete="off"
            />
            {errors.phone && (
              <span className="error-text">{errors.phone}</span>
            )}
          </div>
        </div>

        <div className="contact-form-actions">
          <button type="submit" className="btn-add">
            <span className="btn-icon">{editingContact ? "✓" : "+"}</span>
            {editingContact ? "Update Contact" : "Add Contact"}
          </button>
          {editingContact && (
            <button
              type="button"
              className="btn-add btn-cancel"
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
