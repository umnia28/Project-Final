'use client';

import { useEffect, useState } from "react";
import RequireRole from "@/components/RequireRole";
import Loading from "@/components/Loading";
import {
    CircleDollarSignIcon,
    WalletIcon,
    StoreIcon,
    CheckCircle2Icon,
} from "lucide-react";

export default function AdminPayoutsPage() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳";

    const [loading, setLoading] = useState(true);
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState("");
    const [preview, setPreview] = useState({
        unpaid_items: 0,
        pending_amount: 0,
        seller_id: null,
        store_name: "",
    });
    const [payouts, setPayouts] = useState([]);
    const [creating, setCreating] = useState(false);
    const [payingId, setPayingId] = useState(null);

    const [payForm, setPayForm] = useState({
        method: "",
        reference_no: "",
    });

    const API = "http://localhost:5000/api";

    const getToken = () => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("token");
    };

    const fetchStores = async () => {
        try {
            const token = getToken();

            const res = await fetch(`${API}/admin/stores`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (res.ok) {
                setStores(data.stores || data.data || []);
            } else {
                console.error("Failed to load stores:", data);
            }
        } catch (err) {
            console.error("Store fetch failed", err);
        }
    };

    const fetchPayoutHistory = async () => {
        try {
            const token = getToken();

            const res = await fetch(`${API}/payouts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                setPayouts(data.payouts || data.data || []);
            } else {
                console.error("Failed to load payouts:", data);
            }
        } catch (err) {
            console.error("Payout history fetch failed", err);
        }
    };

    const fetchPreview = async (storeId) => {
        if (!storeId) return;

        try {
            const token = getToken();

            const res = await fetch(`${API}/payouts/preview/${storeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                setPreview({
                    unpaid_items: data.unpaid_items || 0,
                    pending_amount: Number(data.pending_amount || 0),
                    seller_id: data.seller_id || null,
                    store_name: data.store_name || "",
                });
            } else {
                console.error("Preview fetch failed:", data);
                setPreview({
                    unpaid_items: 0,
                    pending_amount: 0,
                    seller_id: null,
                    store_name: "",
                });
            }
        } catch (err) {
            console.error("Preview fetch failed", err);
        }
    };

    const handleCreatePayout = async () => {
        if (!selectedStore) {
            alert("Please select a store first.");
            return;
        }

        try {
            setCreating(true);
            const token = getToken();

            const res = await fetch(`${API}/payouts/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    store_id: Number(selectedStore),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Failed to create payout");
                return;
            }

            alert("Payout created successfully");
            await fetchPreview(selectedStore);
            await fetchPayoutHistory();
        } catch (err) {
            console.error("Create payout failed", err);
            alert("Create payout failed");
        } finally {
            setCreating(false);
        }
    };

    const handleMarkPaid = async (payoutId) => {
        if (!payForm.method || !payForm.reference_no) {
            alert("Please enter payment method and reference number.");
            return;
        }

        try {
            setPayingId(payoutId);
            const token = getToken();

            const res = await fetch(`${API}/payouts/${payoutId}/pay`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    method: payForm.method,
                    reference_no: payForm.reference_no,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Failed to mark payout as paid");
                return;
            }

            alert("Payout marked as paid");
            setPayForm({ method: "", reference_no: "" });
            await fetchPayoutHistory();
            if (selectedStore) await fetchPreview(selectedStore);
        } catch (err) {
            console.error("Mark paid failed", err);
            alert("Mark paid failed");
        } finally {
            setPayingId(null);
        }
    };

    useEffect(() => {
        const init = async () => {
            await Promise.all([fetchStores(), fetchPayoutHistory()]);
            setLoading(false);
        };
        init();
    }, []);

    useEffect(() => {
        if (selectedStore) {
            fetchPreview(selectedStore);
        }
    }, [selectedStore]);

    if (loading) return <Loading />;

    return (
        <RequireRole allowedRoles={["admin"]}>
            <div className="text-slate-500 p-6">
                <h1 className="text-2xl mb-6">
                    Admin <span className="text-slate-800 font-medium">Payouts</span>
                </h1>

                {/* Top Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    <div className="flex items-center justify-between border border-slate-200 p-4 rounded-lg bg-white">
                        <div>
                            <p className="text-sm">Selected Store Pending</p>
                            <h2 className="text-2xl font-semibold text-slate-800">
                                {currency}{preview.pending_amount}
                            </h2>
                        </div>
                        <WalletIcon className="w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full" />
                    </div>

                    <div className="flex items-center justify-between border border-slate-200 p-4 rounded-lg bg-white">
                        <div>
                            <p className="text-sm">Unpaid Order Items</p>
                            <h2 className="text-2xl font-semibold text-slate-800">
                                {preview.unpaid_items}
                            </h2>
                        </div>
                        <CircleDollarSignIcon className="w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full" />
                    </div>

                    <div className="flex items-center justify-between border border-slate-200 p-4 rounded-lg bg-white">
                        <div>
                            <p className="text-sm">Selected Store</p>
                            <h2 className="text-lg font-semibold text-slate-800">
                                {preview.store_name || "None"}
                            </h2>
                        </div>
                        <StoreIcon className="w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full" />
                    </div>
                </div>

                {/* Create Payout */}
                <div className="border border-slate-200 rounded-lg p-5 bg-white mb-8">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Create Payout</h2>

                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                        <div className="w-full md:w-80">
                            <label className="block text-sm mb-2 text-slate-600">Select Store</label>
                            <select
                                value={selectedStore}
                                onChange={(e) => setSelectedStore(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none"
                            >
                                <option value="">Choose store</option>
                                {stores.map((store) => (
                                    <option key={store.store_id} value={store.store_id}>
                                        {store.store_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleCreatePayout}
                            disabled={creating}
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg transition disabled:opacity-50"
                        >
                            {creating ? "Creating..." : "Create Payout"}
                        </button>
                    </div>
                </div>

                {/* Mark Paid Form */}
                <div className="border border-slate-200 rounded-lg p-5 bg-white mb-8">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Mark Payout as Paid</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Method (bkash / bank / নগদ)"
                            value={payForm.method}
                            onChange={(e) =>
                                setPayForm((prev) => ({ ...prev, method: e.target.value }))
                            }
                            className="border border-slate-300 rounded-lg px-4 py-3 outline-none"
                        />

                        <input
                            type="text"
                            placeholder="Reference No"
                            value={payForm.reference_no}
                            onChange={(e) =>
                                setPayForm((prev) => ({ ...prev, reference_no: e.target.value }))
                            }
                            className="border border-slate-300 rounded-lg px-4 py-3 outline-none"
                        />
                    </div>
                </div>

                {/* Payout History */}
                <div className="border border-slate-200 rounded-lg p-5 bg-white overflow-x-auto">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Payout History</h2>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-left text-slate-600">
                                <th className="py-3 pr-4">Payout ID</th>
                                <th className="py-3 pr-4">Store ID</th>
                                <th className="py-3 pr-4">Seller ID</th>
                                <th className="py-3 pr-4">Amount</th>
                                <th className="py-3 pr-4">Status</th>
                                <th className="py-3 pr-4">Method</th>
                                <th className="py-3 pr-4">Reference</th>
                                <th className="py-3 pr-4">Date</th>
                                <th className="py-3 pr-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payouts.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="py-6 text-center text-slate-400">
                                        No payouts found
                                    </td>
                                </tr>
                            ) : (
                                payouts.map((payout) => (
                                    <tr key={payout.payout_id} className="border-b border-slate-100">
                                        <td className="py-3 pr-4">{payout.payout_id}</td>
                                        <td className="py-3 pr-4">{payout.store_id}</td>
                                        <td className="py-3 pr-4">{payout.seller_id}</td>
                                        <td className="py-3 pr-4">
                                            {currency}{payout.amount}
                                        </td>
                                        <td className="py-3 pr-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${payout.payout_status === "paid"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {payout.payout_status}
                                            </span>
                                        </td>
                                        <td className="py-3 pr-4">{payout.method || "-"}</td>
                                        <td className="py-3 pr-4">{payout.reference_no || "-"}</td>
                                        <td className="py-3 pr-4">
                                            {payout.payout_date
                                                ? new Date(payout.payout_date).toLocaleDateString()
                                                : "-"}
                                        </td>
                                        <td className="py-3 pr-4">
                                            {payout.payout_status !== "paid" ? (
                                                // <button
                                                //   onClick={() => handleMarkPaid(payout.payout_id)}
                                                //   disabled={payingId === payout.payout_id}
                                                //   className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs disabled:opacity-50"
                                                // >
                                                <button
                                                    onClick={() => handleMarkPaid(payout.payout_id)}
                                                    disabled={payingId === payout.payout_id || !payForm.method || !payForm.reference_no}
                                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs disabled:opacity-50"
                                                >
                                                    <CheckCircle2Icon className="w-4 h-4" />
                                                    {payingId === payout.payout_id ? "Updating..." : "Mark Paid"}
                                                </button>
                                            ) : (
                                                <span className="text-slate-400">Done</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </RequireRole>
    );
}