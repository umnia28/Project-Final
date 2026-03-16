/*'use client'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const BestSelling = () => {

    const displayQuantity = 8
    const products = useSelector(state => state.product.list)

    return (
        <div className='px-10 my-30 max-w-7xl mx-auto font-serif'>
            <Title title='Hall Of Fame' description={`Showing ${products.length < displayQuantity ? products.length : displayQuantity} of ${products.length} products`} href='/shop' />
            <div className='mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between'>
                {products.slice().sort((a, b) => b.rating.length - a.rating.length).slice(0, displayQuantity).map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    )
}

export default BestSelling
*/


'use client'
import { useEffect, useMemo } from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDbProducts } from '@/lib/features/product/productSlice'

const BestSelling = () => {
  const dispatch = useDispatch()
  const displayQuantity = 8

  const { list: products, loading } = useSelector((state) => state.product)

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(fetchDbProducts())
    }
  }, [dispatch, products])

  const getBestSellingScore = (product) => {
    if (typeof product?.sold === 'number') return product.sold
    if (typeof product?.sold_count === 'number') return product.sold_count
    if (typeof product?.total_sold === 'number') return product.total_sold
    if (typeof product?.totalSold === 'number') return product.totalSold
    if (typeof product?.qty_sold === 'number') return product.qty_sold
    if (typeof product?.orders_count === 'number') return product.orders_count

    if (!isNaN(Number(product?.sold))) return Number(product.sold)
    if (!isNaN(Number(product?.sold_count))) return Number(product.sold_count)
    if (!isNaN(Number(product?.total_sold))) return Number(product.total_sold)
    if (!isNaN(Number(product?.totalSold))) return Number(product.totalSold)
    if (!isNaN(Number(product?.qty_sold))) return Number(product.qty_sold)
    if (!isNaN(Number(product?.orders_count))) return Number(product.orders_count)

    if (Array.isArray(product?.rating)) return product.rating.length
    if (typeof product?.rating_count === 'number') return product.rating_count
    if (!isNaN(Number(product?.rating_count))) return Number(product.rating_count)

    return 0
  }

  const bestSellingProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return []

    return [...products]
      .sort((a, b) => getBestSellingScore(b) - getBestSellingScore(a))
      .slice(0, displayQuantity)
  }, [products])

  return (
    <div className='px-10 my-30 max-w-7xl mx-auto font-serif'>
      <Title
        title='Hall Of Fame'
        description={`Showing ${bestSellingProducts.length} of ${products.length} products`}
        href='/shop'
      />

      <div className='mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between'>
        {loading ? (
          <p className='text-slate-500'>Loading products...</p>
        ) : bestSellingProducts.length > 0 ? (
          bestSellingProducts.map((product, index) => (
            <ProductCard
              key={product?.id || product?.product_id || index}
              product={product}
            />
          ))
        ) : (
          <p className='text-slate-500'>No products found.</p>
        )}
      </div>
    </div>
  )
}

export default BestSelling