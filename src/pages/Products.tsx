import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { trackEvent } from '../utils/storage';

export default function Products() {
  const { products, getCategories, getProductsByCategory } = useProducts();
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) setActiveCategory(cat);
    trackEvent('page_view', { page: 'products' });
  }, [searchParams]);

  const categories = getCategories();
  let filtered = getProductsByCategory(activeCategory);

  if (sortBy === 'price-low') filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-high') filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  else filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div className="page-header">
          <h1>Our Collection</h1>
          <p>Explore {products.length} premium gloves crafted for every occasion</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <div className="filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
            style={{ width: 'auto', minWidth: 160 }}
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No products found</h2>
            <p>Try a different category or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
