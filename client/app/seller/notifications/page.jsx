// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function SellerNotificationsPage() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchNotifications = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.get("http://localhost:5000/api/seller/notifications", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true,
//       });

//       setNotifications(res.data.notifications || []);
//     } catch (err) {
//       console.error("Seller notifications fetch error:", err);
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
//         `http://localhost:5000/api/seller/notifications/${notificationId}/seen`,
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
//       console.error("Mark seller notification seen error:", err);
//     }
//   };

//   if (loading) {
//     return <div className="text-white p-6">Loading notifications...</div>;
//   }

//   return (
//     <div className="text-white max-w-5xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">Notifications</h1>

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

"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function SellerNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/seller/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Seller notifications fetch error:", err);
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
        `http://localhost:5000/api/seller/notifications/${notificationId}/seen`,
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
      console.error("Mark seller notification seen error:", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="rounded-2xl border border-[#E8E1F0] bg-gradient-to-br from-[#FFFCF8] via-[#F8F2FE] to-[#EAF4FF] p-6 text-stone-500">
          Loading notifications...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-stone-800">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-[#E8E1F0] bg-gradient-to-br from-[#FFFCF8] via-[#F8F2FE] to-[#EAF4FF] p-6 text-stone-500">
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
              className={`rounded-2xl p-4 border cursor-pointer transition ${
                notification.seen_status
                  ? "bg-[#FFFCF8] border-[#E8E1F0]"
                  : "bg-gradient-to-br from-[#FAEAD7] via-[#F1E7FB] to-[#E7F1FD] border-[#D9C2F0]"
              }`}
            >
              <p className="text-stone-700">
                {notification.notification_description}
              </p>

              <div className="flex items-center justify-between mt-3">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    notification.seen_status
                      ? "bg-[#F1E7FB] text-[#8D6DB3]"
                      : "bg-[#D9C2F0]/40 text-[#8D6DB3]"
                  }`}
                >
                  {notification.seen_status ? "Seen" : "New"}
                </span>

                <p className="text-xs text-stone-500">
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