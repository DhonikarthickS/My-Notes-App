"use client";

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
} from "recharts";
import { useNavigate } from "react-router-dom";

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
      }
    });

    return () => unsubscribe();
  }, []);

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
      const noteDate = note.createdAt.toDate();
      if (noteDate.getMonth() === month && noteDate.getFullYear() === year) {
        const index = noteDate.getDate() - 1;
        dailyData[index].notes += 1;
      }
    }
  });

  const pinnedCount = notes.filter((n) => n.pinned).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Profile
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            View your account details and activity
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-md"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Profile Card */}
      {user && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-indigo-500 shadow-md"
              referrerPolicy="no-referrer"
            />

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {user.displayName}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {user.email}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-4">
                  <p className="text-sm text-indigo-600 dark:text-indigo-400">
                    Total Notes
                  </p>
                  <p className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">
                    {notes.length}
                  </p>
                </div>

                <div className="bg-amber-100 dark:bg-amber-900/30 rounded-lg p-4">
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    Pinned Notes
                  </p>
                  <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                    {pinnedCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Notes Activity
        </h3>

        {notes.length > 0 ? (
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />

                {/* ✅ FIXED LINE (FULL BAR COMPONENT) */}
                <Bar dataKey="notes" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No notes available for this month.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
