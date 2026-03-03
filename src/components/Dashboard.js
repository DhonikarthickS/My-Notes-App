// src/components/Dashboard.jsx
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
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import NoteCard from "./NoteCard";
import "../styles/App.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
        const q = query(collection(db, "notes"), where("userId", "==", u.uid));
        onSnapshot(q, (snapshot) => {
          const notesData = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          setNotes(notesData);
        });
      } else {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
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
      document
        .getElementById("note-input-top")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
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
    <div className="dashboard-wrapper">
      {/* ── HEADER ── */}
      <header className="dashboard-header">
        <div className="header-brand">
          <h1>My Notes</h1>
          <p>Welcome back, {user?.displayName || "User"} 👋</p>
        </div>

        <div className="header-right">
          <Link to="/profile" className="header-avatar">
            <img
              src={user?.photoURL}
              alt="Profile"
              referrerPolicy="no-referrer"
            />
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="dashboard-main">
        {/* Input card */}
        <div id="note-input-top" className="note-input-card">
          <h2>{editId ? "✏️ Edit Note" : "➕ New Note"}</h2>
          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="note-title-input"
          />
          <textarea
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="note-content-input"
          />
          <button
            onClick={handleAddOrUpdate}
            className={`submit-btn ${editId ? "editing" : ""}`}
          >
            {editId ? "Update Note" : "Add Note"}
          </button>
        </div>

        {/* Search */}
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Notes grid */}
        {sortedNotes.length > 0 ? (
          <div className="notes-grid">
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
          <div className="no-notes">
            <div className="no-notes-icon">📭</div>
            <p>
              {searchTerm ? "No notes match your search." : "No notes yet. Create your first one!"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
