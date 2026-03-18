"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Bell, CheckCircle2, Clock3 } from "lucide-react";

const API = "http://localhost:5000";

export default function DeliverymanNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState(null);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/api/deliveryman/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Notifications fetch error:", err);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markSeen = async (id) => {
    try {
      setMarkingId(id);

      const token = localStorage.getItem("token");

      const res = await axios.patch(
        `${API}/api/deliveryman/notifications/${id}/seen`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success(res.data.message || "Notification marked as seen");
      await fetchNotifications();
    } catch (err) {
      console.error("Mark seen error:", err);
      toast.error(err.response?.data?.message || "Failed to update notification");
    } finally {
      setMarkingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="rounded-[28px] border border-[#d9e9fb] bg-white/70 px-8 py-6 text-slate-600 shadow-[0_12px_35px_rgba(160,180,220,0.16)] backdrop-blur-md">
          Loading notifications...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(186,230,253,0.28),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(221,214,254,0.28),_transparent_22%),linear-gradient(to_bottom,_#fffdf9,_#f7fbff,_#faf7ff)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 rounded-[30px] bg-gradient-to-r from-[#f4dec2] via-[#ddd6fe] to-[#bae6fd] p-[2px] shadow-[0_18px_45px_rgba(181,190,222,0.22)]">
          <div className="rounded-[30px] bg-white/75 px-6 py-7 backdrop-blur-md md:px-8">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
              Notifications
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Stay updated with delivery assignments and status alerts.
            </p>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="rounded-[28px] border border-[#d9e9fb] bg-white/75 p-8 text-slate-500 shadow-[0_12px_35px_rgba(160,180,220,0.14)] backdrop-blur-md">
            No notifications found.
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.notification_id}
                className="rounded-[26px] border border-white/70 bg-white/75 p-5 shadow-[0_14px_35px_rgba(170,180,210,0.14)] backdrop-blur-md"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                        notification.seen_status
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-[#f3edff] text-[#7a5db4]"
                      }`}
                    >
                      <Bell className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-base font-medium text-slate-800">
                        {notification.notification_description}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${
                            notification.seen_status
                              ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                              : "border-[#d9ccf4] bg-[#eee7fb] text-[#7a5db4]"
                          }`}
                        >
                          {notification.seen_status ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <Clock3 className="h-3.5 w-3.5" />
                          )}
                          {notification.seen_status ? "Seen" : "Unread"}
                        </span>

                        <span className="text-sm text-slate-500">
                          {notification.time_added
                            ? new Date(notification.time_added).toLocaleString()
                            : "No time available"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!notification.seen_status && (
                    <button
                      onClick={() => markSeen(notification.notification_id)}
                      disabled={markingId === notification.notification_id}
                      className="inline-flex items-center rounded-full bg-gradient-to-r from-[#f4dec2] via-[#c4b5fd] to-[#7dd3fc] px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-[0_12px_28px_rgba(167,139,250,0.22)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {markingId === notification.notification_id
                        ? "Updating..."
                        : "Mark as Seen"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}