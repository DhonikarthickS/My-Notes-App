"use client";

import React from "react";

const DeleteConfirmCard = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl w-80 text-center border border-gray-200 dark:border-gray-700 animate-fadeIn">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Are you sure you want to delete this note?
        </h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium transition"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmCard;
