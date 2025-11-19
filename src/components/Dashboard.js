// src/components/Dashboard.jsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import NoteCard from "./NoteCard";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
        const q = query(collection(db, "notes"), where("userId", "==", u.uid));
        onSnapshot(q, (snapshot) => {
          const notesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotes(notesData);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleAddOrUpdate = async () => {
    if (!title || !content) return alert("Please fill all fields");
    try {
      if (editId) {
        await updateDoc(doc(db, "notes", editId), { title, content });
        setEditId(null);
      } else {
        await addDoc(collection(db, "notes"), {
          title,
          content,
          userId: user.uid,
          pinned: false,
          createdAt: serverTimestamp(),
        });
      }
      setTitle("");
      setContent("");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note.id);
    setTimeout(() => {
      const inputContainer = document.getElementById("input-container");
      if (inputContainer) {
        inputContainer.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 200);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "notes", id));
  };

  const handlePin = async (id) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    await updateDoc(doc(db, "notes", id), { pinned: !note.pinned });
  };

  const handleColorChange = async (id, color) => {
    await updateDoc(doc(db, "notes", id), { color });
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedNotes = [...filteredNotes].sort((a, b) =>
    a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Notes
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Welcome, {user?.displayName || "User"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition"
            >
              <img
                src={user?.photoURL}
                alt="Profile"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Input box */}
        <div id="input-container" className="mb-8 bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {editId ? "Edit Note" : "Create a New Note"}
          </h2>
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-3 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Note Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-32 mb-3 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddOrUpdate}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg"
          >
            {editId ? "Update Note" : "Add Note"}
          </button>
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-3 text-gray-500 text-xl">🔍</span>
        </div>

        {/* Notes grid */}
        {sortedNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPin={handlePin}
                onColorChange={handleColorChange}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-20">No notes found</p>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
