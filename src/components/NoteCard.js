import { useState } from "react";
import { Pin, PinOff, Edit2, Trash2, Palette, X } from "lucide-react";
import "../styles/NoteCard.css";

const NoteCard = ({ note, onEdit, onDelete, onPin, onColorChange }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const primaryColors = [
    "#fef3c7", "#fecaca", "#c7d2fe", "#bbf7d0",
    "#fda4af", "#fed7aa", "#e9d5ff", "#bae6fd",
  ];

  const getTextColor = (bgColor) => {
    const hex = bgColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155 ? "#1f2937" : "#ffffff";
  };

  const textColor = getTextColor(note.color || "#fef3c7");
  const isDarkText = textColor === "#1f2937";
  const overlayBg = isDarkText ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)";
  const overlayBgStrong = isDarkText ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.25)";

  return (
    <>
      {/* ── NOTE CARD ── */}
      <div
        className="nc-card"
        style={{ backgroundColor: note.color || "#fef3c7", borderColor: textColor }}
      >
        {/* Pinned accent bar */}
        {note.pinned && <div className="nc-pin-bar" />}

        <div className="nc-body">
          {/* Header row */}
          <div className="nc-header">
            <h3 className="nc-title" style={{ color: textColor }}>
              {note.title}
            </h3>
            <button
              className="nc-pin-btn"
              onClick={() => onPin(note.id)}
              style={{ backgroundColor: overlayBg, color: textColor }}
              title={note.pinned ? "Unpin" : "Pin"}
            >
              {note.pinned ? <Pin size={18} /> : <PinOff size={18} />}
            </button>
          </div>

          {/* Content */}
          <p className="nc-content" style={{ color: textColor }}>
            {note.content}
          </p>

          {/* Action buttons */}
          <div className="nc-actions" style={{ borderColor: textColor }}>
            <div className="nc-actions-row">
              {/* Edit */}
              <button
                className="nc-btn nc-btn-edit"
                style={{ backgroundColor: overlayBgStrong, color: textColor }}
                onClick={() => {
                  onEdit(note);
                  setTimeout(() => {
                    document
                      .getElementById("note-input-top")
                      ?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }, 100);
                }}
              >
                <Edit2 size={15} />
                <span>Edit</span>
              </button>

              {/* Delete */}
              <button
                className="nc-btn nc-btn-delete"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 size={15} />
                <span>Delete</span>
              </button>
            </div>

            {/* Color picker toggle */}
            <button
              className="nc-btn nc-btn-color"
              style={{ backgroundColor: overlayBg, color: textColor }}
              onClick={() => setShowColorPicker(true)}
            >
              <Palette size={15} />
              <span>Change Color</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── COLOR PICKER MODAL ── */}
      {showColorPicker && (
        <div className="nc-modal-backdrop" onClick={() => setShowColorPicker(false)}>
          <div className="nc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="nc-modal-header">
              <h3>Choose a color</h3>
              <button className="nc-modal-close" onClick={() => setShowColorPicker(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="nc-color-grid">
              {primaryColors.map((color) => (
                <button
                  key={color}
                  className="nc-color-swatch"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    onColorChange(note.id, color);
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {confirmDelete && (
        <div className="nc-modal-backdrop" onClick={() => setConfirmDelete(false)}>
          <div className="nc-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="nc-modal-title">Delete Note?</h3>
            <p className="nc-modal-body">
              Are you sure you want to delete <strong>"{note.title}"</strong>?
              <br />This action cannot be undone.
            </p>
            <div className="nc-modal-footer">
              <button
                className="nc-modal-btn nc-modal-btn-cancel"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
              <button
                className="nc-modal-btn nc-modal-btn-confirm"
                onClick={() => {
                  onDelete(note.id);
                  setConfirmDelete(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NoteCard;
