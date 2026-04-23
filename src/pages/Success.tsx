import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, MessageCircle, Home, ShoppingBag, Info, AlertTriangle } from 'lucide-react';
import { Order } from '../types';
import { formatPrice } from '../utils/storage';

export default function Success() {
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const { botSuccess, botMessage, whatsappNumber, message } = location.state || {};

  useEffect(() => {
    if (location.state?.order) {
      setOrder(location.state.order);
    }
    // Scroll to top
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="page" style={{ background: 'radial-gradient(circle at 50% -20%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)' }}>
      <div className="container" style={{ paddingTop: 60, paddingBottom: 100, textAlign: 'center' }}>
        <div className="success-container" style={{ maxWidth: 700, margin: '0 auto' }}>
          
          <div className="success-icon-wrapper" style={{ 
            display: 'inline-flex', 
            padding: 24, 
            borderRadius: '50%', 
            background: 'rgba(34, 197, 94, 0.1)', 
            color: '#22c55e', 
            marginBottom: 32,
            boxShadow: '0 0 40px rgba(34, 197, 94, 0.2)',
            animation: 'pulse 2s infinite'
          }}>
            <CheckCircle size={80} strokeWidth={1.5} />
          </div>
          
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', marginBottom: 16, background: 'linear-gradient(to bottom, #fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Order Confirmed!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: 48, maxWidth: 500, margin: '0 auto 48px auto' }}>
            Thank you for choosing Lagwal. Your order <span style={{ color: 'var(--accent)', fontWeight: 600 }}>#{order?.id || 'ORD-XYZ'}</span> has been successfully placed.
          </p>

          {/* Bot Notification Status */}
          <div style={{ 
            background: botSuccess ? 'rgba(34, 197, 94, 0.05)' : 'rgba(234, 179, 8, 0.05)', 
            border: `1px solid ${botSuccess ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)'}`,
            padding: '20px 24px', 
            borderRadius: 20, 
            marginBottom: 40, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 16, 
            textAlign: 'left',
            backdropFilter: 'blur(5px)'
          }}>
            {botSuccess ? (
              <div style={{ color: '#22c55e', flexShrink: 0 }}><CheckCircle size={24} /></div>
            ) : (
              <div style={{ color: '#eab308', flexShrink: 0 }}><AlertTriangle size={24} /></div>
            )}
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem', color: botSuccess ? '#22c55e' : '#eab308' }}>
                {botSuccess ? 'Automated Notification Sent' : 'Manual Action Required'}
              </h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {botSuccess 
                  ? 'Our automated system has notified the warehouse team. You don\'t need to do anything else.' 
                  : botMessage || 'The automated notification failed. Please send the order manually via WhatsApp.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 48, textAlign: 'left' }}>
            <div style={{ background: 'var(--card-bg)', padding: 32, borderRadius: 24, border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Info size={20} className="text-accent" /> Order Summary
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {order?.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.product.name} <small>({item.selectedSize})</small> × {item.quantity}</span>
                    <span style={{ fontWeight: 500 }}>{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4, display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1rem' }}>
                  <span>Total Amount</span>
                  <span className="text-accent">{formatPrice(order?.total || 0)}</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--card-bg)', padding: 32, borderRadius: 24, border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: 20 }}>What's Next?</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', gap: 12 }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>1</span>
                  <span>Our team will verify your order within 2 hours.</span>
                </li>
                <li style={{ display: 'flex', gap: 12 }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>2</span>
                  <span>You will receive a confirmation call/message.</span>
                </li>
                <li style={{ display: 'flex', gap: 12 }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>3</span>
                  <span>Delivery tracking will be shared via WhatsApp.</span>
                </li>
              </ul>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            {!botSuccess && (
              <a 
                href={`https://wa.me/${whatsappNumber}?text=${message}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg" 
                style={{ background: '#25D366', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: 10, padding: '16px 32px' }}
              >
                <MessageCircle size={20} /> Send Manual WhatsApp
              </a>
            )}
            
            <Link to="/" className="btn btn-outline btn-lg" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 32px' }}>
              <Home size={20} /> Back to Home
            </Link>
            
            <Link to="/products" className="btn btn-outline btn-lg" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 32px' }}>
              <ShoppingBag size={20} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
