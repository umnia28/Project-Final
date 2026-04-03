"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function AdminNoticeboardPage() {
  const [noticeText, setNoticeText] = useState("");
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotices = async () => {
    try {
      const res = await axios.get(`${API}/api/noticeboard`);
      setNotices(res.data.notices || []);
    } catch (error) {
      console.error("FETCH NOTICE ERROR:", error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handlePostNotice = async (e) => {
    e.preventDefault();

    if (!noticeText.trim()) {
      alert("Please write an announcement");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/api/noticeboard`,
        { notice_description: noticeText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNoticeText("");
      fetchNotices();
      alert("Announcement posted successfully");
    } catch (error) {
      console.error("POST NOTICE ERROR:", error);
      alert(error.response?.data?.message || "Failed to post announcement");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Delete this announcement?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API}/api/noticeboard/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchNotices();
      alert("Announcement deleted");
    } catch (error) {
      console.error("DELETE NOTICE ERROR:", error);
      alert(error.response?.data?.message || "Failed to delete announcement");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Noticeboard / Announcements</h1>

      <form
        onSubmit={handlePostNotice}
        className="bg-white rounded-2xl shadow p-5 border mb-8"
      >
        <label className="block text-sm font-medium mb-2">
          Post Announcement
        </label>

        <textarea
          value={noticeText}
          onChange={(e) => setNoticeText(e.target.value)}
          rows={4}
          placeholder="Write announcement here..."
          className="w-full border rounded-xl px-4 py-3 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-black text-white px-5 py-2 rounded-xl"
        >
          {loading ? "Posting..." : "Post Announcement"}
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow border p-5">
        <h2 className="text-lg font-semibold mb-4">All Announcements</h2>

        {notices.length === 0 ? (
          <p className="text-gray-500">No announcements yet.</p>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice.notice_id}
                className="border rounded-xl p-4 flex items-start justify-between gap-4"
              >
                <div>
                  <p className="text-gray-800">{notice.notice_description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(notice.date_added).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(notice.notice_id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}