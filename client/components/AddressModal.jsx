'use client'
import { XIcon, MapPin, User, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createAddress } from "@/lib/features/address/addressSlice";

const AddressModal = ({ setShowAddressModal }) => {
  const dispatch = useDispatch();

  const [address, setAddress] = useState({
    name: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: ''
  });

  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please login first");
    }

    await dispatch(
      createAddress({
        city: address.city,
        address: address.street,
        shipping_state: address.state,
        zip_code: String(address.zip),
        country: address.country,
      })
    ).unwrap();

    toast.success("Address saved ✅");
    setShowAddressModal(false);
  };

  const inputStyle =
    "w-full rounded-xl border border-pink-200/70 bg-white/80 backdrop-blur-sm px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-pink-300 focus:border-pink-300 shadow-sm";

  return (
    <form
      onSubmit={(e) => toast.promise(handleSubmit(e), { loading: 'Adding Address...' })}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-200/40 via-purple-200/40 to-orange-200/40 backdrop-blur-lg"
    >

      {/* floating gradient orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-300 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-30"></div>

      <div className="relative w-full max-w-md mx-6 rounded-3xl border border-white/50 bg-white/80 backdrop-blur-xl shadow-2xl p-8 flex flex-col gap-6">

        {/* Close Button */}
        <XIcon
          size={28}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 cursor-pointer transition"
          onClick={() => setShowAddressModal(false)}
        />

        {/* Title */}
        <h2 className="text-3xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent">
          Add New Address
        </h2>

        {/* Name */}
        <div className="flex items-center gap-3">
          <User className="text-pink-400" size={18}/>
          <input
            name="name"
            onChange={handleAddressChange}
            value={address.name}
            className={inputStyle}
            type="text"
            placeholder="Your name"
            required
          />
        </div>

        {/* Email */}
        <div className="flex items-center gap-3">
          <Mail className="text-purple-400" size={18}/>
          <input
            name="email"
            onChange={handleAddressChange}
            value={address.email}
            className={inputStyle}
            type="email"
            placeholder="Email address"
            required
          />
        </div>

        {/* Street */}
        <div className="flex items-center gap-3">
          <MapPin className="text-orange-400" size={18}/>
          <input
            name="street"
            onChange={handleAddressChange}
            value={address.street}
            className={inputStyle}
            type="text"
            placeholder="Street address"
            required
          />
        </div>

        {/* City + State */}
        <div className="flex gap-4">
          <input
            name="city"
            onChange={handleAddressChange}
            value={address.city}
            className={inputStyle}
            type="text"
            placeholder="City"
            required
          />

          <input
            name="state"
            onChange={handleAddressChange}
            value={address.state}
            className={inputStyle}
            type="text"
            placeholder="State"
            required
          />
        </div>

        {/* Zip + Country */}
        <div className="flex gap-4">
          <input
            name="zip"
            onChange={handleAddressChange}
            value={address.zip}
            className={inputStyle}
            type="text"
            placeholder="Zip code"
            required
          />

          <input
            name="country"
            onChange={handleAddressChange}
            value={address.country}
            className={inputStyle}
            type="text"
            placeholder="Country"
            required
          />
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3">
          <Phone className="text-pink-400" size={18}/>
          <input
            name="phone"
            onChange={handleAddressChange}
            value={address.phone}
            className={inputStyle}
            type="text"
            placeholder="Phone number"
            required
          />
        </div>

        {/* Submit */}
        <button
          className="
          mt-3 py-3 rounded-xl
          bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400
          text-white font-semibold text-sm tracking-wide
          shadow-lg
          hover:scale-[1.02]
          hover:shadow-xl
          active:scale-95
          transition
          "
        >
          SAVE ADDRESS
        </button>
      </div>
    </form>
  );
};

export default AddressModal;