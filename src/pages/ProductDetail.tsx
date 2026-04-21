import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, ArrowLeft, Check, ZoomIn, ZoomOut, Move } from 'lucide-react';
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

  // Zoom & Pan state
  const [isZoomed, setIsZoomed] = useState(false);
  const [panPos, setPanPos] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const imgContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0] || '');
      setMainImage(product.images[0] || '');
      trackEvent('product_view', { productId: product.id, name: product.name });
    }
    window.scrollTo(0, 0);
  }, [product]);

  // Reset zoom when image changes
  useEffect(() => {
    setIsZoomed(false);
    setPanPos({ x: 50, y: 50 });
  }, [mainImage]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isZoomed) {
      // Click to zoom in
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPanPos({ x, y });
      setIsZoomed(true);
    } else {
      // Start dragging in zoomed mode
      setIsDragging(true);
    }
  }, [isZoomed]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isZoomed || !isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPanPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  }, [isZoomed, isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const toggleZoom = useCallback(() => {
    if (isZoomed) {
      setIsZoomed(false);
      setPanPos({ x: 50, y: 50 });
    } else {
      setIsZoomed(true);
    }
  }, [isZoomed]);

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
            <div 
              ref={imgContainerRef}
              className={`product-detail-img ${isZoomed ? 'zoomed' : ''}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: isZoomed ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
            >
              {mainImage ? (
                <img 
                  src={mainImage} 
                  alt={product.name} 
                  draggable={false}
                  style={{ 
                    transformOrigin: `${panPos.x}% ${panPos.y}%`,
                  }}
                />
              ) : <span>🧤</span>}
              {/* Zoom indicator */}
              <button 
                onClick={(e) => { e.stopPropagation(); toggleZoom(); }}
                style={{
                  position: 'absolute', bottom: 12, right: 12, 
                  background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 8, padding: '8px 12px', color: '#fff',
                  display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem',
                  cursor: 'pointer', backdropFilter: 'blur(8px)', zIndex: 2,
                }}
              >
                {isZoomed ? <><ZoomOut size={14} /> Zoom Out</> : <><ZoomIn size={14} /> Click to Zoom</>}
              </button>
              {isZoomed && (
                <div style={{
                  position: 'absolute', top: 12, left: 12,
                  background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 8, padding: '6px 10px', color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 4,
                  backdropFilter: 'blur(8px)', zIndex: 2,
                }}>
                  <Move size={12} /> Drag to pan
                </div>
              )}
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
