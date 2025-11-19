"use client";

import { useState } from "react";
import { Pin, PinOff, Edit2, Trash2, Palette, X } from "lucide-react";

const NoteCard = ({ note, onEdit, onDelete, onPin, onColorChange }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const primaryColors = [
    "#fef3c7",
    "#fecaca",
    "#c7d2fe",
    "#bbf7d0",
    "#fda4af",
    "#fed7aa",
    "#e9d5ff",
  ];

  const getTextColor = (bgColor) => {
    const hex = bgColor.replace("#", "");
    const r = Number.parseInt(hex.substr(0, 2), 16);
    const g = Number.parseInt(hex.substr(2, 2), 16);
    const b = Number.parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155 ? "#1f2937" : "#ffffff";
  };

  const textColor = getTextColor(note.color || "#fef3c7");
  const isDarkText = textColor === "#1f2937";

  return (
    <>
      {/* CARD */}
      <div
        className="group relative rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-opacity-20 flex flex-col h-full"
        style={{
          backgroundColor: note.color || "#fef3c7",
          borderColor: textColor,
        }}
      >
        {note.pinned && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        )}

        <div className="p-4 sm:p-5 flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3
              className="text-lg sm:text-xl font-semibold line-clamp-2 flex-1 leading-tight"
              style={{ color: textColor }}
            >
              {note.title}
            </h3>

            <button
              onClick={() => onPin(note.id)}
              className="flex-shrink-0 p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                backgroundColor: isDarkText
                  ? "rgba(0,0,0,0.1)"
                  : "rgba(255,255,255,0.2)",
                color: textColor,
              }}
            >
              {note.pinned ? (
                <Pin size={20} className="fill-current" />
              ) : (
                <PinOff size={20} />
              )}
            </button>
          </div>

          {/* Content */}
          <p
            className="text-sm sm:text-base line-clamp-4 mb-4 leading-relaxed flex-1"
            style={{ color: textColor, opacity: 0.85 }}
          >
            {note.content}
          </p>

          {/* Buttons */}
          <div
            className="flex flex-col gap-2 pt-4 border-t border-opacity-20"
            style={{ borderColor: textColor }}
          >
            <div className="flex items-center gap-2">
              {/* EDIT */}
              <button
                onClick={() => {
                  onEdit(note);
                  setTimeout(() => {
                    const inputContainer =
                      document.getElementById("input-container");
                    if (inputContainer) {
                      inputContainer.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }, 100);
                }}
                className="flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: isDarkText
                    ? "rgba(0,0,0,0.15)"
                    : "rgba(255,255,255,0.25)",
                  color: textColor,
                }}
              >
                <Edit2 size={16} />
                <span className="hidden sm:inline">Edit</span>
              </button>

              {/* DELETE → Opens confirmation */}
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>

            {/* COLOR PICKER BUTTON */}
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 relative"
              style={{
                backgroundColor: isDarkText
                  ? "rgba(0,0,0,0.1)"
                  : "rgba(255,255,255,0.2)",
                color: textColor,
              }}
            >
              <Palette size={16} />
              <span>Change Color</span>
            </button>
          </div>

          {/* COLOR PICKER POPUP */}
          {showColorPicker && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={() => setShowColorPicker(false)}
              ></div>

              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowColorPicker(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X size={20} className="text-gray-600 dark:text-gray-400" />
                </button>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Choose a color
                </h3>

                <div className="grid grid-cols-4 gap-3">
                  {primaryColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        onColorChange(note.id, color);
                        setShowColorPicker(false);
                      }}
                      className="group relative w-full aspect-square rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg border-2 border-transparent"
                      style={{ backgroundColor: color }}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setConfirmDelete(false)}
          ></div>

          {/* Modal */}
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-sm w-full border border-gray-300 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Delete Note?
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mb-5">
              Are you sure you want to delete{" "}
              <b className="font-semibold">{note.title}</b>?
              <br />
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
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
