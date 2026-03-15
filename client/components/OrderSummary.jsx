/*import { PlusIcon, SquarePenIcon, XIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import AddressModal from './AddressModal';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchAddresses } from "@/lib/features/address/addressSlice";

const OrderSummary = ({ totalPrice, items, onCheckout }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'Taka';
  const addressList = useSelector(state => state.address.list);
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [coupon, setCoupon] = useState('');

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleCouponCode = async (event) => {
    event.preventDefault();
    toast.error("Coupon not implemented yet");
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    try {
      if (!selectedAddress) {
        throw new Error("Please select an address");
      }

      const address_id = selectedAddress.address_id ?? selectedAddress.id;
      if (!address_id) {
        throw new Error("Selected address has no address_id");
      }

      const payment_method =
        paymentMethod === "COD"
          ? "cod"
          : paymentMethod === "STRIPE"
          ? "stripe_mock"
          : "cod";

      const promo_id = null;

      await onCheckout({ address_id, payment_method, promo_id });
    } catch (err) {
      console.error("PLACE ORDER ERROR:", err);
      throw err;
    }
  };

  return (
    <div className='w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7'>
      <h2 className='text-xl font-medium text-slate-600'>Payment Summary</h2>

      <p className='text-slate-400 text-xs my-4'>Payment Method</p>

      <div className='flex gap-2 items-center'>
        <input
          type="radio"
          id="COD"
          name="payment"
          onChange={() => setPaymentMethod('COD')}
          checked={paymentMethod === 'COD'}
          className='accent-gray-500'
        />
        <label htmlFor="COD" className='cursor-pointer'>COD</label>
      </div>

      <div className='flex gap-2 items-center mt-1'>
        <input
          type="radio"
          id="STRIPE"
          name='payment'
          onChange={() => setPaymentMethod('STRIPE')}
          checked={paymentMethod === 'STRIPE'}
          className='accent-gray-500'
        />
        <label htmlFor="STRIPE" className='cursor-pointer'>Stripe Payment (Mock)</label>
      </div>

      <div className='my-4 py-4 border-y border-slate-200 text-slate-400'>
        <p>Address</p>

        {selectedAddress ? (
          <div className='flex gap-2 items-center'>
            <p>
              {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.shipping_state}, {selectedAddress.zip_code}
            </p>
            <SquarePenIcon
              onClick={() => setSelectedAddress(null)}
              className='cursor-pointer'
              size={18}
            />
          </div>
        ) : (
          <div>
            {addressList.length > 0 && (
              <select
                className='border border-slate-400 p-2 w-full my-3 outline-none rounded'
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
              className='flex items-center gap-1 text-slate-600 mt-1'
              onClick={() => setShowAddressModal(true)}
            >
              Add Address <PlusIcon size={18} />
            </button>
          </div>
        )}
      </div>

      <div className='pb-4 border-b border-slate-200'>
        <div className='flex justify-between'>
          <div className='flex flex-col gap-1 text-slate-400'>
            <p>Subtotal:</p>
            <p>Shipping:</p>
            {coupon && <p>Coupon:</p>}
          </div>
          <div className='flex flex-col gap-1 font-medium text-right'>
            <p>{currency}{totalPrice.toLocaleString()}</p>
            <p>Free</p>
            {coupon && <p>{`-${currency}${(coupon.discount / 100 * totalPrice).toFixed(2)}`}</p>}
          </div>
        </div>

        {!coupon ? (
          <form
            onSubmit={(e) => toast.promise(handleCouponCode(e), { loading: 'Checking Coupon...' })}
            className='flex justify-center gap-3 mt-3'
          >
            <input
              onChange={(e) => setCouponCodeInput(e.target.value)}
              value={couponCodeInput}
              type="text"
              placeholder='Coupon Code'
              className='border border-slate-400 p-1.5 rounded w-full outline-none'
            />
            <button className='bg-slate-600 text-white px-3 rounded hover:bg-slate-800 active:scale-95 transition-all'>
              Apply
            </button>
          </form>
        ) : (
          <div className='w-full flex items-center justify-center gap-2 text-xs mt-2'>
            <p>Code: <span className='font-semibold ml-1'>{coupon.code.toUpperCase()}</span></p>
            <p>{coupon.description}</p>
            <XIcon
              size={18}
              onClick={() => setCoupon('')}
              className='hover:text-red-700 transition cursor-pointer'
            />
          </div>
        )}
      </div>

      <div className='flex justify-between py-4'>
        <p>Total:</p>
        <p className='font-medium text-right'>
          {currency}{coupon ? (totalPrice - (coupon.discount / 100 * totalPrice)).toFixed(2) : totalPrice.toLocaleString()}
        </p>
      </div>

      <button
        onClick={(e) =>
          toast.promise(handlePlaceOrder(e), {
            loading: 'Placing order...',
            success: 'Order placed successfully!',
            error: (err) => err.message || 'Failed to place order',
          })
        }
        className='w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all'
      >
        Place Order
      </button>

      {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}
    </div>
  );
};

export default OrderSummary;
*/

import { PlusIcon, SquarePenIcon, XIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import AddressModal from './AddressModal';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchAddresses } from "@/lib/features/address/addressSlice";

const OrderSummary = ({ totalPrice, items, onCheckout }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'Taka';
  const addressList = useSelector(state => state.address.list) || [];
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [coupon, setCoupon] = useState('');

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (addressList.length > 0 && !selectedAddress) {
      setSelectedAddress(addressList[0]);
    }
  }, [addressList, selectedAddress]);

  const handleCouponCode = async (event) => {
    event.preventDefault();
    toast.error("Coupon not implemented yet");
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    try {
      if (addressList.length === 0) {
        throw new Error("Please add an address first");
      }

      if (!selectedAddress) {
        throw new Error("Please select an address");
      }

      const address_id = selectedAddress.address_id ?? selectedAddress.id;
      if (!address_id) {
        throw new Error("Selected address has no address_id");
      }

      const payment_method =
        paymentMethod === "COD"
          ? "cod"
          : paymentMethod === "STRIPE"
          ? "stripe_mock"
          : "cod";

      const promo_id = null;

      await onCheckout({ address_id, payment_method, promo_id });
    } catch (err) {
      console.error("PLACE ORDER ERROR:", err);
      throw err;
    }
  };

  return (
    <div className='w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7'>
      <h2 className='text-xl font-medium text-slate-600'>Payment Summary</h2>

      <p className='text-slate-400 text-xs my-4'>Payment Method</p>

      <div className='flex gap-2 items-center'>
        <input
          type="radio"
          id="COD"
          name="payment"
          onChange={() => setPaymentMethod('COD')}
          checked={paymentMethod === 'COD'}
          className='accent-gray-500'
        />
        <label htmlFor="COD" className='cursor-pointer'>COD</label>
      </div>

      <div className='flex gap-2 items-center mt-1'>
        <input
          type="radio"
          id="STRIPE"
          name='payment'
          onChange={() => setPaymentMethod('STRIPE')}
          checked={paymentMethod === 'STRIPE'}
          className='accent-gray-500'
        />
        <label htmlFor="STRIPE" className='cursor-pointer'>Stripe Payment (Mock)</label>
      </div>

      <div className='my-4 py-4 border-y border-slate-200 text-slate-400'>
        <p>Address</p>

        {selectedAddress ? (
          <div className='flex gap-2 items-center justify-between mt-2'>
            <p className='flex-1'>
              {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.shipping_state}, {selectedAddress.zip_code}
            </p>
            <SquarePenIcon
              onClick={() => setSelectedAddress(null)}
              className='cursor-pointer shrink-0'
              size={18}
            />
          </div>
        ) : (
          <div>
            {addressList.length > 0 ? (
              <select
                className='border border-slate-400 p-2 w-full my-3 outline-none rounded'
                onChange={(e) => {
                  const idx = e.target.value;
                  if (idx === "") return;
                  setSelectedAddress(addressList[Number(idx)]);
                }}
                defaultValue=""
              >
                <option value="">Select Address</option>
                {addressList.map((address, index) => (
                  <option key={address.address_id ?? address.id ?? index} value={index}>
                    {address.address}, {address.city}, {address.shipping_state}, {address.zip_code}
                  </option>
                ))}
              </select>
            ) : (
              <p className='text-xs mt-2'>No saved address found.</p>
            )}

            <button
              type="button"
              className='flex items-center gap-1 text-slate-600 mt-1'
              onClick={() => setShowAddressModal(true)}
            >
              Add Address <PlusIcon size={18} />
            </button>
          </div>
        )}
      </div>

      <div className='pb-4 border-b border-slate-200'>
        <div className='flex justify-between'>
          <div className='flex flex-col gap-1 text-slate-400'>
            <p>Subtotal:</p>
            <p>Shipping:</p>
            {coupon && <p>Coupon:</p>}
          </div>
          <div className='flex flex-col gap-1 font-medium text-right'>
            <p>{currency}{totalPrice.toLocaleString()}</p>
            <p>Free</p>
            {coupon && <p>{`-${currency}${(coupon.discount / 100 * totalPrice).toFixed(2)}`}</p>}
          </div>
        </div>

        {!coupon ? (
          <form
            onSubmit={(e) => toast.promise(handleCouponCode(e), { loading: 'Checking Coupon...' })}
            className='flex justify-center gap-3 mt-3'
          >
            <input
              onChange={(e) => setCouponCodeInput(e.target.value)}
              value={couponCodeInput}
              type="text"
              placeholder='Coupon Code'
              className='border border-slate-400 p-1.5 rounded w-full outline-none'
            />
            <button className='bg-slate-600 text-white px-3 rounded hover:bg-slate-800 active:scale-95 transition-all'>
              Apply
            </button>
          </form>
        ) : (
          <div className='w-full flex items-center justify-center gap-2 text-xs mt-2'>
            <p>Code: <span className='font-semibold ml-1'>{coupon.code.toUpperCase()}</span></p>
            <p>{coupon.description}</p>
            <XIcon
              size={18}
              onClick={() => setCoupon('')}
              className='hover:text-red-700 transition cursor-pointer'
            />
          </div>
        )}
      </div>

      <div className='flex justify-between py-4'>
        <p>Total:</p>
        <p className='font-medium text-right'>
          {currency}{coupon ? (totalPrice - (coupon.discount / 100 * totalPrice)).toFixed(2) : totalPrice.toLocaleString()}
        </p>
      </div>

      <button
        onClick={(e) =>
          toast.promise(handlePlaceOrder(e), {
            loading: 'Placing order...',
            success: 'Order placed successfully!',
            error: (err) => err.message || 'Failed to place order',
          })
        }
        className='w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all'
      >
        Place Order
      </button>

      {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}
    </div>
  );
};

export default OrderSummary;