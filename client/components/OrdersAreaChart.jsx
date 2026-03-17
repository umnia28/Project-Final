'use client'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function OrdersAreaChart({
  allOrders = [],
  sellerId = null,
  storeId = null,
  title = 'Orders / Day',
}) {
  const getOrderDate = (order) => {
    const raw =
      order?.createdAt ||
      order?.created_at ||
      order?.date_added ||
      order?.order_date ||
      order?.date

    const d = new Date(raw)
    if (Number.isNaN(d.getTime())) return null

    return d.toISOString().split('T')[0]
  }

  const orderBelongsToSeller = (order) => {
    // admin dashboard -> count all orders
    if (!sellerId && !storeId) return true

    // direct fields on order
    if (sellerId && String(order?.seller_id) === String(sellerId)) return true
    if (storeId && String(order?.store_id) === String(storeId)) return true

    // nested items
    const items = order?.items || order?.order_items || order?.orderItems || []

    if (Array.isArray(items)) {
      return items.some((item) => {
        if (sellerId && String(item?.seller_id) === String(sellerId)) return true
        if (sellerId && String(item?.sellerId) === String(sellerId)) return true
        if (storeId && String(item?.store_id) === String(storeId)) return true
        if (storeId && String(item?.storeId) === String(storeId)) return true
        return false
      })
    }

    return false
  }

  const filteredOrders = (allOrders || []).filter(orderBelongsToSeller)

  const ordersPerDay = filteredOrders.reduce((acc, order) => {
    const date = getOrderDate(order)
    if (!date) return acc

    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(ordersPerDay)
    .map(([date, count]) => ({
      date,
      orders: count,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="w-full max-w-4xl h-[300px] text-xs">
      <h3 className="text-lg font-medium text-slate-800 mb-4 pt-2 text-right">
        {title.includes('/') ? (
          <>
            <span className="text-slate-500">{title.split('/')[0].trim()} /</span>{' '}
            {title.split('/')[1]?.trim()}
          </>
        ) : (
          title
        )}
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            allowDecimals={false}
            label={{ value: 'Orders', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#4f46e5"
            fill="#8884d8"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
