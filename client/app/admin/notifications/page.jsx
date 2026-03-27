"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Bell,
  Sparkles,
  Clock3,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/admin/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Admin notifications fetch error:", err);
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
        `http://localhost:5000/api/admin/notifications/${notificationId}/seen`,
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
      console.error("Mark admin notification seen error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(232,220,198,0.28),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(191,218,246,0.24),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(217,198,239,0.26),_transparent_24%),linear-gradient(to_bottom,_#fcfaf6,_#f7f1fb,_#f4f9ff)] p-4 md:p-6">
        <div className="max-w-5xl mx-auto min-h-[70vh] flex items-center justify-center">
          <div className="w-full max-w-xl rounded-[32px] border border-white/60 bg-white/80 backdrop-blur-md p-10 text-center shadow-[0_12px_40px_rgba(170,185,210,0.10)]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#f7f1e6] via-[#f2ecff] to-[#eaf4ff] shadow-sm border border-white/60">
              <Bell size={24} className="text-violet-500 animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-700">
              Loading notifications...
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Gathering your latest admin alerts and activity updates.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(232,220,198,0.28),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(191,218,246,0.24),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(217,198,239,0.26),_transparent_24%),linear-gradient(to_bottom,_#fcfaf6,_#f7f1fb,_#f4f9ff)] p-4 md:p-6">
      <div className="max-w-5xl mx-auto text-slate-700">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-[34px] border border-white/60 bg-gradient-to-r from-[#ead9c2] via-[#d8c4ee] to-[#bcd7f3] shadow-[0_24px_70px_rgba(170,185,210,0.18)] mb-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.34),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.26),_transparent_24%)]" />
          <div className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-[#d9c6ef]/35 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-[#bfdaf6]/35 blur-3xl" />

          <div className="relative px-6 md:px-10 py-8 md:py-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/55 px-4 py-2 text-sm text-slate-700 backdrop-blur-sm shadow-sm">
                <ShieldCheck size={16} />
                Admin Notification Center
              </div>

              <h1 className="mt-5 text-3xl md:text-5xl font-bold tracking-tight text-slate-700 leading-tight">
                Admin{" "}
                <span className="bg-gradient-to-r from-[#b9d8f6] via-[#c9b0eb] to-[#e6d8c3] bg-clip-text text-transparent">
                  Notifications
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-slate-600 leading-7 text-[15px]">
                Review platform alerts, monitor new activity, and mark unseen notifications as seen in one clean premium view.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 min-w-[260px]">
              <div className="rounded-[22px] border border-white/50 bg-white/60 p-4 backdrop-blur-sm shadow-[0_10px_30px_rgba(170,185,210,0.10)]">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Bell size={16} />
                  Total
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-700">
                  {notifications.length}
                </p>
              </div>

              <div className="rounded-[22px] border border-white/50 bg-white/60 p-4 backdrop-blur-sm shadow-[0_10px_30px_rgba(170,185,210,0.10)]">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Sparkles size={16} />
                  Unseen
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-700">
                  {notifications.filter((item) => !item.seen_status).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="rounded-[30px] border border-white/60 bg-white/80 backdrop-blur-md p-10 text-center shadow-[0_12px_40px_rgba(170,185,210,0.10)]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#f7f1e6] via-[#f2ecff] to-[#eaf4ff] shadow-sm border border-white/60">
              <Bell size={24} className="text-sky-500" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-700">
              No notifications found
            </h2>
            <p className="mt-3 text-slate-500">
              New admin alerts and updates will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {notifications.map((notification) => (
              <div
                key={notification.notification_id}
                onClick={() => {
                  if (!notification.seen_status) {
                    markAsSeen(notification.notification_id);
                  }
                }}
                className={`group cursor-pointer rounded-[28px] border p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 ${
                  notification.seen_status
                    ? "border-white/60 bg-white/80 backdrop-blur-md shadow-[0_10px_30px_rgba(170,185,210,0.08)]"
                    : "border-[#d7c4ef] bg-gradient-to-r from-[#f8f2e8] via-[#f3ecff] to-[#eef7ff] shadow-[0_14px_36px_rgba(170,185,210,0.14)]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div
                      className={`shrink-0 flex h-12 w-12 items-center justify-center rounded-[16px] border ${
                        notification.seen_status
                          ? "bg-gradient-to-br from-[#f7f1e6] to-[#eaf4ff] border-white/60"
                          : "bg-gradient-to-br from-[#f8f2e8] via-[#f2ecff] to-[#eef7ff] border-[#e7e1f0]"
                      }`}
                    >
                      {notification.seen_status ? (
                        <CheckCircle2 size={20} className="text-emerald-500" />
                      ) : (
                        <Bell size={20} className="text-violet-500" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] md:text-base leading-7 text-slate-700">
                        {notification.notification_description}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                            notification.seen_status
                              ? "bg-[#ecfdf5] text-emerald-700 border border-emerald-100"
                              : "bg-gradient-to-r from-[#f8f2e8] via-[#f2ecff] to-[#eef7ff] text-slate-700 border border-[#e7e1f0]"
                          }`}
                        >
                          {notification.seen_status ? (
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

                        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium bg-white/70 border border-white/60 text-slate-500">
                          <Clock3 size={13} />
                          {new Date(notification.time_added).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white/70 border border-white/60 text-slate-400 group-hover:text-slate-600 transition-colors">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function AdminNotificationsPage() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchNotifications = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.get("http://localhost:5000/api/admin/notifications", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true,
//       });

//       setNotifications(res.data.notifications || []);
//     } catch (err) {
//       console.error("Admin notifications fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const markAsSeen = async (notificationId) => {
//     try {
//       const token = localStorage.getItem("token");

//       await axios.patch(
//         `http://localhost:5000/api/admin/notifications/${notificationId}/seen`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           withCredentials: true,
//         }
//       );

//       setNotifications((prev) =>
//         prev.map((item) =>
//           item.notification_id === notificationId
//             ? { ...item, seen_status: true }
//             : item
//         )
//       );
//     } catch (err) {
//       console.error("Mark admin notification seen error:", err);
//     }
//   };

//   if (loading) {
//     return <div className="text-white p-6">Loading notifications...</div>;
//   }

//   return (
//     <div className="text-white max-w-5xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">Admin Notifications</h1>

//       {notifications.length === 0 ? (
//         <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-zinc-400">
//           No notifications found.
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {notifications.map((notification) => (
//             <div
//               key={notification.notification_id}
//               onClick={() => {
//                 if (!notification.seen_status) {
//                   markAsSeen(notification.notification_id);
//                 }
//               }}
//               className={`rounded-xl p-4 border cursor-pointer ${
//                 notification.seen_status
//                   ? "bg-zinc-900 border-zinc-800"
//                   : "bg-zinc-800 border-pink-600"
//               }`}
//             >
//               <p className="text-zinc-200">{notification.notification_description}</p>

//               <div className="flex items-center justify-between mt-3">
//                 <span
//                   className={`text-xs px-2 py-1 rounded-full ${
//                     notification.seen_status
//                       ? "bg-zinc-700 text-zinc-300"
//                       : "bg-pink-600/20 text-pink-400"
//                   }`}
//                 >
//                   {notification.seen_status ? "Seen" : "New"}
//                 </span>

//                 <p className="text-xs text-zinc-500">
//                   {new Date(notification.time_added).toLocaleString()}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }