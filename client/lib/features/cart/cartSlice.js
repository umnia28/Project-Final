import { createSlice } from '@reduxjs/toolkit'

const makeCartKey = (productId, selectedAttributes = {}) => {
  const sortedAttributes = Object.keys(selectedAttributes)
    .sort()
    .reduce((acc, key) => {
      acc[key] = selectedAttributes[key]
      return acc
    }, {})

  return `${productId}__${JSON.stringify(sortedAttributes)}`
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    total: 0,
    cartItems: {},
  },
  reducers: {
    addToCart: (state, action) => {
      const { productId, selectedAttributes = {} } = action.payload
      const cartKey = makeCartKey(productId, selectedAttributes)

      if (state.cartItems[cartKey]) {
        state.cartItems[cartKey].quantity += 1
      } else {
        state.cartItems[cartKey] = {
          productId,
          quantity: 1,
          selectedAttributes,
        }
      }

      state.total += 1
    },

    removeFromCart: (state, action) => {
      const { productId, selectedAttributes = {} } = action.payload
      const cartKey = makeCartKey(productId, selectedAttributes)

      if (state.cartItems[cartKey]) {
        state.cartItems[cartKey].quantity -= 1

        if (state.cartItems[cartKey].quantity <= 0) {
          delete state.cartItems[cartKey]
        }

        state.total = Math.max(0, state.total - 1)
      }
    },

    deleteItemFromCart: (state, action) => {
      const { productId, selectedAttributes = {} } = action.payload
      const cartKey = makeCartKey(productId, selectedAttributes)

      if (state.cartItems[cartKey]) {
        state.total -= state.cartItems[cartKey].quantity
        delete state.cartItems[cartKey]
      }

      if (state.total < 0) state.total = 0
    },

    clearCart: (state) => {
      state.cartItems = {}
      state.total = 0
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  clearCart,
  deleteItemFromCart,
} = cartSlice.actions

export default cartSlice.reducer
export { makeCartKey }