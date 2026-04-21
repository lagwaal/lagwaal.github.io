import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, addOrder, generateId, trackEvent, getSettings } from '../utils/storage';
import { buildWhatsAppMessage } from '../utils/whatsapp';
import { sendToWhatsAppBot } from '../utils/whatsappBot';
import { CustomerInfo, Order } from '../types';

export default function Checkout() {
  const { items, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CustomerInfo>({ name: '', email: '', phone: '', address: '', city: '', notes: '' });

  useEffect(() => { trackEvent('checkout_start', {}); }, []);

  if (items.length === 0) {
    return (
      <div className="page"><div className="container" style={{ paddingTop: 120 }}>
        <div className="empty-state">
          <h2>No items to checkout</h2>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>Browse Products</Link>
        </div>
      </div></div>
    );
  }

  const total = getCartTotal();
  const shipping = total >= 3000 ? 0 : 250;
  const grandTotal = total + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const order: Order = {
      id: generateId('ORD'),
      items: [...items],
      customer: form,
      subtotal: total,
      total: grandTotal,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save locally
    addOrder(order);
    trackEvent('purchase', { orderId: order.id, total: grandTotal, items: items.length });
    
    // Send to Bot
    const botResponse = await sendToWhatsAppBot(order);
    
    const settings = getSettings();
    const message = buildWhatsAppMessage(items, form, grandTotal);
    
    clearCart();
    
    navigate('/success', { 
      state: { 
        order, 
        message: encodeURIComponent(message),
        whatsappNumber: settings.whatsappNumber,
        botSuccess: botResponse.success,
        botMessage: botResponse.message
      } 
    });
  };

  const update = (field: keyof CustomerInfo, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', marginBottom: 24, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Cart
        </Link>
        <div className="page-header"><h1>Checkout</h1></div>
        <div className="checkout-page">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: 4 }}>Shipping Information</h3>
            <div className="input-group">
              <label>Full Name *</label>
              <input className="input-field" required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your full name" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="input-group">
                <label>Email *</label>
                <input className="input-field" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="email@example.com" />
              </div>
              <div className="input-group">
                <label>Phone *</label>
                <input className="input-field" required value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="03XX-XXXXXXX" />
              </div>
            </div>
            <div className="input-group">
              <label>Address *</label>
              <input className="input-field" required value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Street address" />
            </div>
            <div className="input-group">
              <label>City *</label>
              <input className="input-field" required value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="City" />
            </div>
            <div className="input-group">
              <label>Order Notes (optional)</label>
              <textarea className="input-field" rows={3} value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Special instructions..." />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting} style={{ marginTop: 12 }}>
              <Send size={18} /> {submitting ? 'Confirming...' : 'Place Order Now'}
            </button>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Your order will be automatically sent to our team for confirmation.
            </p>
          </form>
          <div className="cart-summary">
            <h3>Order Summary</h3>
            {items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{item.product.name} × {item.quantity}</span>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
            <div className="cart-summary-row" style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 8 }}>
              <span>Subtotal</span><span>{formatPrice(total)}</span>
            </div>
            <div className="cart-summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
            <div className="cart-summary-row total"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
