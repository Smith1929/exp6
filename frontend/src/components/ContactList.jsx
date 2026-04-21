export default function ContactList({ contacts, onDelete, onEdit }) {
  if (contacts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📇</div>
        <p className="empty-text">
          No contacts yet. Add your first contact above!
        </p>
      </div>
    );
  }

  return (
    <div className="contact-list">
      <div className="contact-list-header">
        <h3>
          <span className="form-icon">📋</span> All Contacts ({contacts.length})
        </h3>
      </div>

      <div className="contact-items">
        {contacts.map((contact) => (
          <div key={contact._id} className="contact-item">
            <div className="contact-avatar">
              {contact.name.charAt(0).toUpperCase()}
            </div>

            <div className="contact-info">
              <h4 className="contact-name">{contact.name}</h4>
              <div className="contact-details">
                <span className="contact-detail">
                  <span className="detail-icon">✉</span> {contact.email}
                </span>
                <span className="contact-detail">
                  <span className="detail-icon">☎</span> {contact.phone}
                </span>
              </div>
            </div>

            <div className="contact-actions">
              <button
                className="btn-icon-action"
                onClick={() => onEdit(contact)}
                title="Edit contact"
              >
                ✎
              </button>
              <button
                className="btn-icon-action btn-delete"
                onClick={() => onDelete(contact._id)}
                title="Delete contact"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
