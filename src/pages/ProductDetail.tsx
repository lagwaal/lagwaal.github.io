import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, ArrowLeft, Check } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { formatPrice, trackEvent } from '../utils/storage';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { getProductById, products } = useProducts();
  const { addToCart } = useCart();
  const product = getProductById(id || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0] || '');
      setMainImage(product.images[0] || '');
      trackEvent('product_view', { productId: product.id, name: product.name });
    }
    window.scrollTo(0, 0);
  }, [product]);

  if (!product) {
    return (
      <div className="page"><div className="container"><div className="empty-state">
        <h2>Product not found</h2>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>Back to Products</Link>
      </div></div></div>
    );
  }

  const handleAdd = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    trackEvent('add_to_cart', { productId: product.id, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="page">
      <div className="container">
        <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', marginTop: 24, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Products
        </Link>
        <div className="product-detail">
          <div className="product-detail-gallery">
            <div className="product-detail-img">
              {mainImage ? <img src={mainImage} alt={product.name} /> : <span>🧤</span>}
            </div>
            {product.images.length > 1 && (
              <div className="product-thumbnails">
                {product.images.map((img, i) => (
                  <div 
                    key={i} 
                    className={`thumbnail ${mainImage === img ? 'active' : ''}`}
                    onClick={() => setMainImage(img)}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="product-detail-info animate-in">
            <div className="category">{product.category}</div>
            <h1>{product.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '12px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--accent)', display: 'flex', gap: 2 }}>
                {Array.from({ length: 5 }, (_, i) => <Star key={i} size={14} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />)}
              </span>
              {product.rating} ({product.reviews} reviews)
            </div>
            <div className="price-row">
              <span className="price">{formatPrice(product.price)}</span>
              {product.originalPrice && <span className="original-price">{formatPrice(product.originalPrice)}</span>}
              {discount > 0 && <span className="badge badge-danger">{discount}% OFF</span>}
            </div>
            <p className="description">{product.description}</p>
            <div className="product-options">
              <div>
                <div className="option-label">Size</div>
                <div className="option-btns">
                  {product.sizes.map((s) => (
                    <button key={s} className={`option-btn ${selectedSize === s ? 'selected' : ''}`} onClick={() => setSelectedSize(s)}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="option-label">Color</div>
                <div className="option-btns">
                  {product.colors.map((c) => (
                    <button key={c} className={`option-btn ${selectedColor === c ? 'selected' : ''}`} onClick={() => setSelectedColor(c)}>{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="option-label">Quantity</div>
                <div className="quantity-picker">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                </div>
              </div>
            </div>
            <div className="detail-actions">
              <button className="btn btn-primary btn-lg" onClick={handleAdd} style={{ flex: 1 }}>
                {added ? <><Check size={18} /> Added!</> : <><ShoppingBag size={18} /> Add to Cart</>}
              </button>
              <button className="btn btn-secondary btn-lg"><Heart size={18} /></button>
            </div>
            <p style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {product.stock > 0 ? `✓ ${product.stock} in stock` : '✗ Out of stock'}
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <section style={{ padding: '60px 0 80px' }}>
            <h2 className="section-title" style={{ textAlign: 'left', fontSize: '1.5rem' }}>You May Also Like</h2>
            <div className="grid grid-4" style={{ marginTop: 24 }}>
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
