/*"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function CustomerNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/customer/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Customer notifications fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsSeen = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/api/customer/notifications/${notificationId}/seen`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item.notification_id === notificationId
            ? { ...item, seen_status: true }
            : item
        )
      );
    } catch (err) {
      console.error("Mark customer notification seen error:", err);
    }
  };

  if (loading) {
    return <div className="text-white p-6">Loading notifications...</div>;
  }

  return (
    <div className="text-white max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-zinc-400">
          No notifications found.
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.notification_id}
              onClick={() => {
                if (!notification.seen_status) {
                  markAsSeen(notification.notification_id);
                }
              }}
              className={`rounded-xl p-4 border cursor-pointer ${
                notification.seen_status
                  ? "bg-zinc-900 border-zinc-800"
                  : "bg-zinc-800 border-pink-600"
              }`}
            >
              <p className="text-zinc-200">{notification.notification_description}</p>

              <div className="flex items-center justify-between mt-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    notification.seen_status
                      ? "bg-zinc-700 text-zinc-300"
                      : "bg-pink-600/20 text-pink-400"
                  }`}
                >
                  {notification.seen_status ? "Seen" : "New"}
                </span>

                <p className="text-xs text-zinc-500">
                  {new Date(notification.time_added).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
  */
 "use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Bell, Sparkles, Clock3, CheckCircle2, ArrowUpRight } from "lucide-react";

export default function CustomerNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/customer/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Customer notifications fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsSeen = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/api/customer/notifications/${notificationId}/seen`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item.notification_id === notificationId
            ? { ...item, seen_status: true }
            : item
        )
      );
    } catch (err) {
      console.error("Mark customer notification seen error:", err);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen px-4 py-8"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(236,72,153,0.12), transparent 28%), radial-gradient(circle at top right, rgba(168,85,247,0.12), transparent 28%), radial-gradient(circle at bottom center, rgba(249,115,22,0.08), transparent 25%), linear-gradient(180deg, #fcf7ff 0%, #fff8f4 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto min-h-[80vh] flex items-center justify-center">
          <div
            className="rounded-[30px] px-10 py-12 text-center max-w-xl w-full"
            style={{
              background: "rgba(255,255,255,0.76)",
              border: "1px solid rgba(255,255,255,0.82)",
              backdropFilter: "blur(18px)",
              boxShadow: "0 20px 50px rgba(168,85,247,0.08)",
            }}
          >
            <div
              className="mx-auto mb-5 h-14 w-14 rounded-[18px] flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg,#fce7f3,#ede9fe,#ffedd5)",
                boxShadow: "0 14px 28px rgba(168,85,247,0.12)",
              }}
            >
              <Bell size={22} className="text-violet-600 animate-pulse" />
            </div>

            <h1
              className="text-3xl font-semibold"
              style={{
                color: "#18181b",
                fontFamily: "Georgia, serif",
              }}
            >
              Loading notifications...
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Gathering your latest updates in a softer premium view.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-8"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(236,72,153,0.12), transparent 28%), radial-gradient(circle at top right, rgba(168,85,247,0.12), transparent 28%), radial-gradient(circle at bottom center, rgba(249,115,22,0.08), transparent 25%), linear-gradient(180deg, #fcf7ff 0%, #fff8f4 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div
          className="mb-8 rounded-[34px] p-8 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,250,247,0.80))",
            border: "1px solid rgba(255,255,255,0.86)",
            boxShadow: "0 24px 70px rgba(168,85,247,0.10)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            className="absolute -top-10 -right-10 w-44 h-44 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(236,72,153,0.14), transparent 70%)",
            }}
          />
          <div
            className="absolute -bottom-12 -left-10 w-52 h-52 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)",
            }}
          />

          <div className="relative z-[1] flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
            <div className="max-w-3xl">
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4"
                style={{
                  background: "linear-gradient(135deg,#fce7f3,#ede9fe,#ffedd5)",
                  color: "#7c3aed",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                <Sparkles size={13} />
                Notification Center
              </div>

              <h1
                className="m-0 text-[36px] leading-tight font-semibold"
                style={{ color: "#18181b", fontFamily: "Georgia, serif" }}
              >
                A refined space for your latest updates
              </h1>

              <p className="mt-3 mb-0 max-w-2xl text-sm md:text-[15px] leading-7 text-slate-500">
                Keep track of account activity, recent updates, and important customer alerts in one elegant premium view.
              </p>
            </div>

            <div className="flex flex-wrap items-stretch gap-4">
              <div
                className="min-w-[190px] rounded-[22px] px-5 py-5"
                style={{
                  background: "rgba(255,255,255,0.72)",
                  border: "1px solid rgba(255,255,255,0.86)",
                  boxShadow: "0 14px 30px rgba(236,72,153,0.08)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7c6f64]">
                    Total Notifications
                  </span>
                  <div
                    className="w-10 h-10 rounded-[14px] flex items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.88)",
                      border: "1px solid #e9d5ff",
                    }}
                  >
                    <Bell size={18} className="text-violet-600" />
                  </div>
                </div>
                <p
                  className="m-0 text-[30px] font-semibold leading-none"
                  style={{ color: "#18181b", fontFamily: "Georgia, serif" }}
                >
                  {notifications.length}
                </p>
              </div>

              <div
                className="min-w-[190px] rounded-[22px] px-5 py-5"
                style={{
                  background: "rgba(255,255,255,0.72)",
                  border: "1px solid rgba(255,255,255,0.86)",
                  boxShadow: "0 14px 30px rgba(168,85,247,0.08)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7c6f64]">
                    Unseen
                  </span>
                  <div
                    className="w-10 h-10 rounded-[14px] flex items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.88)",
                      border: "1px solid #fde68a",
                    }}
                  >
                    <ArrowUpRight size={18} className="text-amber-600" />
                  </div>
                </div>
                <p
                  className="m-0 text-[30px] font-semibold leading-none"
                  style={{ color: "#18181b", fontFamily: "Georgia, serif" }}
                >
                  {notifications.filter((item) => !item.seen_status).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {notifications.length === 0 ? (
          <div
            className="rounded-[32px] px-10 py-14 text-center"
            style={{
              background: "rgba(255,255,255,0.76)",
              border: "1px solid rgba(255,255,255,0.86)",
              backdropFilter: "blur(18px)",
              boxShadow: "0 20px 50px rgba(168,85,247,0.08)",
            }}
          >
            <div
              className="mx-auto mb-5 w-20 h-20 rounded-[22px] flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg,#fce7f3,#ede9fe,#ffedd5)",
              }}
            >
              <Bell size={30} className="text-violet-600" />
            </div>

            <h2
              className="text-3xl font-semibold"
              style={{ color: "#18181b", fontFamily: "Georgia, serif" }}
            >
              No notifications found
            </h2>

            <p className="mt-3 text-slate-500">
              Your latest customer updates will appear here once they arrive.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {notifications.map((notification) => {
              const isSeen = notification.seen_status;

              return (
                <div
                  key={notification.notification_id}
                  onClick={() => {
                    if (!notification.seen_status) {
                      markAsSeen(notification.notification_id);
                    }
                  }}
                  className="rounded-[28px] p-5 md:p-6 cursor-pointer transition-all duration-300 hover:-translate-y-[2px]"
                  style={{
                    background: isSeen
                      ? "linear-gradient(135deg, rgba(255,255,255,0.82), rgba(255,250,247,0.84))"
                      : "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,247,251,0.96))",
                    border: isSeen
                      ? "1px solid rgba(255,255,255,0.86)"
                      : "1px solid rgba(244,114,182,0.18)",
                    boxShadow: isSeen
                      ? "0 18px 42px rgba(168,85,247,0.07)"
                      : "0 20px 48px rgba(236,72,153,0.10)",
                    backdropFilter: "blur(18px)",
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 ${
                          !isSeen ? "animate-pulse" : ""
                        }`}
                        style={{
                          background: isSeen
                            ? "linear-gradient(135deg,#f5f3ff,#fff7ed)"
                            : "linear-gradient(135deg,#fce7f3,#ede9fe,#ffedd5)",
                          border: isSeen
                            ? "1px solid rgba(221,214,254,0.95)"
                            : "1px solid rgba(244,114,182,0.20)",
                        }}
                      >
                        {isSeen ? (
                          <CheckCircle2 size={20} className="text-emerald-600" />
                        ) : (
                          <Bell size={20} className="text-violet-600" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="m-0 text-slate-700 leading-7 text-[15px] md:text-base break-words">
                          {notification.notification_description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mt-4">
                          <span
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold"
                            style={{
                              background: isSeen ? "#ecfdf5" : "#fdf2f8",
                              color: isSeen ? "#047857" : "#be185d",
                              border: isSeen
                                ? "1px solid #a7f3d0"
                                : "1px solid #f9a8d4",
                            }}
                          >
                            {isSeen ? (
                              <>
                                <CheckCircle2 size={13} />
                                Seen
                              </>
                            ) : (
                              <>
                                <Sparkles size={13} />
                                New
                              </>
                            )}
                          </span>

                          <span
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold"
                            style={{
                              background: "#fff7ed",
                              color: "#b45309",
                              border: "1px solid #fde68a",
                            }}
                          >
                            <Clock3 size={13} />
                            {new Date(notification.time_added).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}