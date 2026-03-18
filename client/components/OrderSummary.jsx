import { PlusIcon, SquarePenIcon, XIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import AddressModal from './AddressModal';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchAddresses } from "@/lib/features/address/addressSlice";

const OrderSummary = ({
  totalPrice,
  items,
  onCheckout,
  disabled = false,
  paymentMethod,
  setPaymentMethod,
}) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '৳';
  const addressList = useSelector(state => state.address.list);
  const dispatch = useDispatch();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [coupon, setCoupon] = useState('');

  const deliveryCharge = 60;
  const discountAmount = coupon ? (Number(coupon.discount || 0) / 100) * Number(totalPrice) : 0;
  const finalTotal = Number(totalPrice) - discountAmount + deliveryCharge;

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleCouponCode = async (event) => {
    event.preventDefault();

    if (!couponCodeInput.trim()) {
      throw new Error("Please enter a coupon");
    }

    const res = await fetch(`http://localhost:5000/api/promos/${couponCodeInput.trim()}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Invalid coupon");
    }

    setCoupon(data.promo);
    setCouponCodeInput("");
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    try {
      if (disabled) {
        throw new Error("Please fix out-of-stock or over-quantity items before checkout");
      }

      if (!selectedAddress) {
        throw new Error("Please select an address");
      }

      const address_id = selectedAddress.address_id ?? selectedAddress.id;
      if (!address_id) {
        throw new Error("Selected address has no address_id");
      }

      const promo_id = coupon?.promo_id ?? null;

      await onCheckout({
        address_id,
        payment_method: paymentMethod,
        promo_id,
      });
    } catch (err) {
      console.error("PLACE ORDER ERROR:", err);
      throw err;
    }
  };

  return (
    <div className='w-full max-w-lg lg:max-w-[340px] rounded-[1.5rem] border border-[#e5dfec] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,248,255,0.92))] p-7 text-sm text-slate-500 shadow-[0_18px_45px_rgba(140,152,190,0.08)]'>
      <h2 className='text-xl font-medium text-slate-700'>Payment Summary</h2>

      <p className='my-4 text-xs text-slate-400'>Payment Method</p>

      <div className='flex items-center gap-2'>
        <input
          type="radio"
          id="COD"
          name="payment"
          onChange={() => setPaymentMethod('cod')}
          checked={paymentMethod === 'cod'}
          className='accent-[#8b7bd6]'
        />
        <label htmlFor="COD" className='cursor-pointer text-slate-600'>Cash on Delivery</label>
      </div>

      <div className='mt-1 flex items-center gap-2'>
        <input
          type="radio"
          id="ONLINE"
          name='payment'
          onChange={() => setPaymentMethod('online')}
          checked={paymentMethod === 'online'}
          className='accent-[#7fb6ea]'
        />
        <label htmlFor="ONLINE" className='cursor-pointer text-slate-600'>Online Payment</label>
      </div>

      <div className='my-4 border-y border-[#e8e2ef] py-4 text-slate-400'>
        <p>Address</p>

        {selectedAddress ? (
          <div className='flex items-center gap-2'>
            <p className='text-slate-600'>
              {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.shipping_state}, {selectedAddress.zip_code}
            </p>
            <SquarePenIcon
              onClick={() => setSelectedAddress(null)}
              className='cursor-pointer text-[#8b7bd6] hover:text-[#6f5fb0] transition'
              size={18}
            />
          </div>
        ) : (
          <div>
            {addressList.length > 0 && (
              <select
                className='my-3 w-full rounded-xl border border-[#e5dfec] bg-white/80 p-2.5 outline-none focus:border-[#a78bdb] focus:ring-2 focus:ring-[#e7ddf7]'
                onChange={(e) => {
                  const idx = e.target.value;
                  if (idx === "") return;
                  setSelectedAddress(addressList[idx]);
                }}
                defaultValue=""
              >
                <option value="">Select Address</option>
                {addressList.map((address, index) => (
                  <option key={index} value={index}>
                    {address.address}, {address.city}, {address.shipping_state}, {address.zip_code}
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              className='mt-1 flex items-center gap-1 text-[#8b7bd6] hover:text-[#6daee8] transition'
              onClick={() => setShowAddressModal(true)}
            >
              Add Address <PlusIcon size={18} />
            </button>
          </div>
        )}
      </div>

      <div className='border-b border-[#e8e2ef] pb-4'>
        <div className='flex justify-between'>
          <div className='flex flex-col gap-1 text-slate-400'>
            <p>Subtotal:</p>
            <p>Shipping:</p>
            {coupon && <p>Coupon:</p>}
          </div>

          <div className='flex flex-col gap-1 text-right font-medium text-slate-700'>
            <p>{currency}{Number(totalPrice).toLocaleString()}</p>
            <p>{currency}{deliveryCharge.toLocaleString()}</p>
            {coupon && (
              <p>
                -{currency}{discountAmount.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {!coupon ? (
          <form
            onSubmit={(e) => toast.promise(handleCouponCode(e), { loading: 'Checking Coupon...' })}
            className='mt-3 flex justify-center gap-3'
          >
            <input
              onChange={(e) => setCouponCodeInput(e.target.value)}
              value={couponCodeInput}
              type="text"
              placeholder='Coupon Code'
              className='w-full rounded-xl border border-[#e5dfec] bg-white/80 p-2 outline-none focus:border-[#7fb6ea] focus:ring-2 focus:ring-[#dfeffc]'
            />
            <button className='rounded-full bg-gradient-to-r from-[#d8c3a5] via-[#a78bdb] to-[#7fb6ea] px-4 text-white shadow-sm transition-all hover:scale-[1.02] active:scale-95'>
              Apply
            </button>
          </form>
        ) : (
          <div className='mt-2 flex w-full items-center justify-center gap-2 text-xs text-slate-600'>
            <p>Code: <span className='ml-1 font-semibold'>{coupon.code?.toUpperCase()}</span></p>
            <p>{coupon.description}</p>
            <XIcon
              size={18}
              onClick={() => setCoupon('')}
              className='cursor-pointer transition hover:text-red-700'
            />
          </div>
        )}
      </div>

      <div className='flex justify-between py-4'>
        <p className='text-slate-600'>Total:</p>
        <p className='text-right font-semibold text-slate-700'>
          {currency}{finalTotal.toFixed(2)}
        </p>
      </div>

      {disabled && (
        <div className='mb-3 rounded-xl border border-[#e0d6ee] bg-[linear-gradient(180deg,#faf7ff,#f2eeff)] px-3 py-2'>
          <p className='text-xs text-[#7c63b6]'>
            Please fix out-of-stock or over-quantity items before placing the order.
          </p>
        </div>
      )}

      <button
        onClick={(e) =>
          toast.promise(handlePlaceOrder(e), {
            loading: 'Placing order...',
            success: 'Order placed successfully!',
            error: (err) => err.message || 'Failed to place order',
          })
        }
        disabled={disabled}
        className={`w-full rounded-full py-3 font-medium transition-all ${
          disabled
            ? 'cursor-not-allowed bg-slate-300 text-white'
            : 'bg-gradient-to-r from-[#d8c3a5] via-[#a78bdb] to-[#7fb6ea] text-white shadow-[0_14px_30px_rgba(167,139,219,0.18)] hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(127,182,234,0.22)] active:scale-95'
        }`}
      >
        Place Order
      </button>

      {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}
    </div>
  );
};

export default OrderSummary;

// import { PlusIcon, SquarePenIcon, XIcon } from 'lucide-react';
// import React, { useState, useEffect } from 'react';
// import AddressModal from './AddressModal';
// import { useSelector, useDispatch } from 'react-redux';
// import toast from 'react-hot-toast';
// import { fetchAddresses } from "@/lib/features/address/addressSlice";

// const OrderSummary = ({
//   totalPrice,
//   items,
//   onCheckout,
//   disabled = false,
//   paymentMethod,
//   setPaymentMethod,
// }) => {
//   const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '৳';
//   const addressList = useSelector(state => state.address.list);
//   const dispatch = useDispatch();

//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [showAddressModal, setShowAddressModal] = useState(false);
//   const [couponCodeInput, setCouponCodeInput] = useState('');
//   const [coupon, setCoupon] = useState('');

//   const deliveryCharge = 60;
//   const discountAmount = coupon ? (Number(coupon.discount || 0) / 100) * Number(totalPrice) : 0;
//   const finalTotal = Number(totalPrice) - discountAmount + deliveryCharge;

//   useEffect(() => {
//     dispatch(fetchAddresses());
//   }, [dispatch]);

//   const handleCouponCode = async (event) => {
//     event.preventDefault();

//     if (!couponCodeInput.trim()) {
//       throw new Error("Please enter a coupon");
//     }

//     const res = await fetch(`http://localhost:5000/api/promos/${couponCodeInput.trim()}`);
//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.message || "Invalid coupon");
//     }

//     setCoupon(data.promo);
//     setCouponCodeInput("");
//   };

//   const handlePlaceOrder = async (e) => {
//     e.preventDefault();

//     try {
//       if (disabled) {
//         throw new Error("Please fix out-of-stock or over-quantity items before checkout");
//       }

//       if (!selectedAddress) {
//         throw new Error("Please select an address");
//       }

//       const address_id = selectedAddress.address_id ?? selectedAddress.id;
//       if (!address_id) {
//         throw new Error("Selected address has no address_id");
//       }

//       const promo_id = coupon?.promo_id ?? null;

//       await onCheckout({
//         address_id,
//         payment_method: paymentMethod,
//         promo_id,
//       });
//     } catch (err) {
//       console.error("PLACE ORDER ERROR:", err);
//       throw err;
//     }
//   };

//   return (
//     <div className='w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7'>
//       <h2 className='text-xl font-medium text-slate-600'>Payment Summary</h2>

//       <p className='text-slate-400 text-xs my-4'>Payment Method</p>

//       <div className='flex gap-2 items-center'>
//         <input
//           type="radio"
//           id="COD"
//           name="payment"
//           onChange={() => setPaymentMethod('cod')}
//           checked={paymentMethod === 'cod'}
//           className='accent-gray-500'
//         />
//         <label htmlFor="COD" className='cursor-pointer'>Cash on Delivery</label>
//       </div>

//       <div className='flex gap-2 items-center mt-1'>
//         <input
//           type="radio"
//           id="ONLINE"
//           name='payment'
//           onChange={() => setPaymentMethod('online')}
//           checked={paymentMethod === 'online'}
//           className='accent-gray-500'
//         />
//         <label htmlFor="ONLINE" className='cursor-pointer'>Online Payment</label>
//       </div>

//       <div className='my-4 py-4 border-y border-slate-200 text-slate-400'>
//         <p>Address</p>

//         {selectedAddress ? (
//           <div className='flex gap-2 items-center'>
//             <p>
//               {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.shipping_state}, {selectedAddress.zip_code}
//             </p>
//             <SquarePenIcon
//               onClick={() => setSelectedAddress(null)}
//               className='cursor-pointer'
//               size={18}
//             />
//           </div>
//         ) : (
//           <div>
//             {addressList.length > 0 && (
//               <select
//                 className='border border-slate-400 p-2 w-full my-3 outline-none rounded'
//                 onChange={(e) => {
//                   const idx = e.target.value;
//                   if (idx === "") return;
//                   setSelectedAddress(addressList[idx]);
//                 }}
//                 defaultValue=""
//               >
//                 <option value="">Select Address</option>
//                 {addressList.map((address, index) => (
//                   <option key={index} value={index}>
//                     {address.address}, {address.city}, {address.shipping_state}, {address.zip_code}
//                   </option>
//                 ))}
//               </select>
//             )}

//             <button
//               type="button"
//               className='flex items-center gap-1 text-slate-600 mt-1'
//               onClick={() => setShowAddressModal(true)}
//             >
//               Add Address <PlusIcon size={18} />
//             </button>
//           </div>
//         )}
//       </div>

//       <div className='pb-4 border-b border-slate-200'>
//         <div className='flex justify-between'>
//           <div className='flex flex-col gap-1 text-slate-400'>
//             <p>Subtotal:</p>
//             <p>Shipping:</p>
//             {coupon && <p>Coupon:</p>}
//           </div>

//           <div className='flex flex-col gap-1 font-medium text-right'>
//             <p>{currency}{Number(totalPrice).toLocaleString()}</p>
//             <p>{currency}{deliveryCharge.toLocaleString()}</p>
//             {coupon && (
//               <p>
//                 -{currency}{discountAmount.toFixed(2)}
//               </p>
//             )}
//           </div>
//         </div>

//         {!coupon ? (
//           <form
//             onSubmit={(e) => toast.promise(handleCouponCode(e), { loading: 'Checking Coupon...' })}
//             className='flex justify-center gap-3 mt-3'
//           >
//             <input
//               onChange={(e) => setCouponCodeInput(e.target.value)}
//               value={couponCodeInput}
//               type="text"
//               placeholder='Coupon Code'
//               className='border border-slate-400 p-1.5 rounded w-full outline-none'
//             />
//             <button className='bg-slate-600 text-white px-3 rounded hover:bg-slate-800 active:scale-95 transition-all'>
//               Apply
//             </button>
//           </form>
//         ) : (
//           <div className='w-full flex items-center justify-center gap-2 text-xs mt-2'>
//             <p>Code: <span className='font-semibold ml-1'>{coupon.code?.toUpperCase()}</span></p>
//             <p>{coupon.description}</p>
//             <XIcon
//               size={18}
//               onClick={() => setCoupon('')}
//               className='hover:text-red-700 transition cursor-pointer'
//             />
//           </div>
//         )}
//       </div>

//       <div className='flex justify-between py-4'>
//         <p>Total:</p>
//         <p className='font-medium text-right'>
//           {currency}{finalTotal.toFixed(2)}
//         </p>
//       </div>

//       {disabled && (
//         <div className='mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2'>
//           <p className='text-red-600 text-xs'>
//             Please fix out-of-stock or over-quantity items before placing the order.
//           </p>
//         </div>
//       )}

//       <button
//         onClick={(e) =>
//           toast.promise(handlePlaceOrder(e), {
//             loading: 'Placing order...',
//             success: 'Order placed successfully!',
//             error: (err) => err.message || 'Failed to place order',
//           })
//         }
//         disabled={disabled}
//         className={`w-full py-2.5 rounded transition-all ${disabled
//             ? 'bg-slate-300 text-white cursor-not-allowed'
//             : 'bg-slate-700 text-white hover:bg-slate-900 active:scale-95'
//           }`}
//       >
//         Place Order
//       </button>

//       {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}
//     </div>
//   );
// };

// export default OrderSummary;