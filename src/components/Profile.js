// src/components/Profile.jsx
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
        const q = query(collection(db, "notes"), where("userId", "==", u.uid));
        onSnapshot(q, (snapshot) => {
          setNotes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });
      } else {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    notes: 0,
  }));

  notes.forEach((note) => {
    if (note.createdAt?.toDate) {
      const d = note.createdAt.toDate();
      if (d.getMonth() === month && d.getFullYear() === year) {
        dailyData[d.getDate() - 1].notes += 1;
      }
    }
  });

  const pinnedCount = notes.filter((n) => n.pinned).length;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div
          style={{
            background: "#1e1a35",
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: 10,
            padding: "8px 14px",
            color: "#e8eaf6",
            fontSize: "0.85rem",
          }}
        >
          <p>Day {label}</p>
          <p style={{ color: "#818cf8", fontWeight: 700 }}>
            {payload[0].value} note{payload[0].value !== 1 ? "s" : ""}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div>
          <h1>Profile</h1>
          <p>Your account details and activity</p>
        </div>
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          ← Back to Dashboard
        </button>
      </div>

      {/* Profile card */}
      {user && (
        <div className="profile-card">
          <div className="profile-user-row">
            <img
              src={user.photoURL}
              alt="Profile"
              className="profile-avatar"
              referrerPolicy="no-referrer"
            />
            <div className="profile-user-info">
              <h2>{user.displayName}</h2>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-chip">
              <p>Total Notes</p>
              <p>{notes.length}</p>
            </div>
            <div className="stat-chip pinned">
              <p>Pinned Notes</p>
              <p>{pinnedCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Activity chart */}
      <div className="chart-card">
        <h3>📊 Notes Activity — {today.toLocaleString("default", { month: "long" })} {year}</h3>

        {notes.length > 0 ? (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#8892b0", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#8892b0", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.08)" }} />
                <Bar dataKey="notes" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#8892b0", padding: "3rem 0" }}>
            No notes this month yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
