import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Award, Star } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { useEffect } from 'react';
import { trackEvent } from '../utils/storage';

export default function Home() {
  const { getFeaturedProducts, products } = useProducts();
  const featured = getFeaturedProducts().slice(0, 4);

  useEffect(() => {
    trackEvent('page_view', { page: 'home' });
  }, []);

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container">
          <div className="hero-content animate-slide">
            <div className="hero-badge">
              <Star size={14} /> Premium Handcrafted Collection
            </div>
            <h1>Crafted for <span>Elegance</span>, Built for Life</h1>
            <p>
              Discover our exclusive collection of premium gloves — from luxurious leather 
              to rugged work essentials. Every pair tells a story of craftsmanship.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop Collection <ArrowRight size={18} />
              </Link>
              <a href="#features" className="btn btn-secondary btn-lg">Learn More</a>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-value">{products.length}+</div>
                <div className="hero-stat-label">Products</div>
              </div>
              <div>
                <div className="hero-stat-value">2K+</div>
                <div className="hero-stat-label">Customers</div>
              </div>
              <div>
                <div className="hero-stat-value">4.8</div>
                <div className="hero-stat-label">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" id="features">
        <div className="container">
          <h2 className="section-title">Why Choose Lagwal?</h2>
          <p className="section-subtitle">We don't just make gloves — we craft experiences</p>
          <div className="grid grid-3">
            <div className="card animate-in" style={{ textAlign: 'center', padding: '40px 24px' }}>
              <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-sm)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--accent)' }}>
                <Shield size={24} />
              </div>
              <h3 style={{ marginBottom: 8 }}>Premium Quality</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Sourced from the finest materials worldwide, every pair undergoes rigorous quality checks.
              </p>
            </div>
            <div className="card animate-in" style={{ textAlign: 'center', padding: '40px 24px', animationDelay: '0.1s' }}>
              <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-sm)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--accent)' }}>
                <Truck size={24} />
              </div>
              <h3 style={{ marginBottom: 8 }}>Fast Delivery</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Free nationwide shipping on orders above Rs. 3,000. Delivered within 3-5 business days.
              </p>
            </div>
            <div className="card animate-in" style={{ textAlign: 'center', padding: '40px 24px', animationDelay: '0.2s' }}>
              <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-sm)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--accent)' }}>
                <Award size={24} />
              </div>
              <h3 style={{ marginBottom: 8 }}>Satisfaction Guaranteed</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Not happy? Return within 14 days for a full refund. No questions asked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 className="section-title">Featured Collection</h2>
          <p className="section-subtitle">Our most loved handpicked selections</p>
          <div className="grid grid-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/products" className="btn btn-primary btn-lg">
              View All Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Real reviews from real customers</p>
          <div className="grid grid-3">
            {[
              { name: 'Ahmed K.', text: 'The leather gloves are absolutely stunning. Best purchase I\'ve made this year!', rating: 5 },
              { name: 'Sara M.', text: 'Perfect winter gloves — warm, stylish, and the touchscreen feature actually works!', rating: 5 },
              { name: 'Bilal R.', text: 'Ordered the tactical gloves for hiking. Incredible grip and durability. Highly recommend.', rating: 4 },
            ].map((t, i) => (
              <div key={i} className="card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 16, color: 'var(--accent)' }}>
                  {Array.from({ length: t.rating }, (_, j) => <Star key={j} size={14} fill="currentColor" />)}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 20 }}>"{t.text}"</p>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: 'var(--bg-secondary)', textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-title">Ready to Elevate Your Style?</h2>
          <p className="section-subtitle">Browse our complete collection and find your perfect pair</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Shop Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
