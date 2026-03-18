"use client";

import { useEffect, useState } from "react";
import axios from "axios";

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
      <div className="max-w-5xl mx-auto p-6">
        <div className="rounded-3xl border border-white/60 bg-gradient-to-r from-[#f5f0e6] via-[#eef4ff] to-[#f3eeff] p-6 text-slate-600 shadow-[0_10px_35px_rgba(180,160,255,0.10)]">
          Loading notifications...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 text-slate-700">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Admin{" "}
          <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Notifications
          </span>
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Review platform alerts and mark unseen notifications as seen.
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-3xl border border-white/60 bg-gradient-to-r from-[#f5f0e6] via-[#f8fbff] to-[#f3eeff] p-8 text-slate-500 shadow-[0_10px_35px_rgba(180,160,255,0.10)]">
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
              className={`cursor-pointer rounded-3xl border p-5 transition-all duration-200 shadow-[0_8px_28px_rgba(180,160,255,0.08)] ${
                notification.seen_status
                  ? "border-white/60 bg-white/80 backdrop-blur-md"
                  : "border-[#c7d2fe] bg-gradient-to-r from-[#f5f0e6] via-[#eef6ff] to-[#f3eeff]"
              }`}
            >
              <p className="text-slate-700 leading-7">
                {notification.notification_description}
              </p>

              <div className="mt-4 flex items-center justify-between gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    notification.seen_status
                      ? "bg-[#eef2ff] text-slate-600"
                      : "bg-gradient-to-r from-[#e0f2fe] via-[#e9d5ff] to-[#f5f0e6] text-slate-700"
                  }`}
                >
                  {notification.seen_status ? "Seen" : "New"}
                </span>

                <p className="text-xs text-slate-500">
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