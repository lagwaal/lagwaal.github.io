import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, trackEvent } from '../utils/storage';
import { useEffect } from 'react';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();

  useEffect(() => { trackEvent('page_view', { page: 'cart' }); }, []);

  if (items.length === 0) {
    return (
      <div className="page"><div className="container">
        <div className="empty-state" style={{ paddingTop: 120 }}>
          <ShoppingBag size={64} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
          <h2>Your Cart is Empty</h2>
          <p style={{ marginBottom: 24 }}>Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </div></div>
    );
  }

  const total = getCartTotal();
  const shipping = total >= 3000 ? 0 : 250;

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div className="page-header"><h1>Shopping Cart</h1><p>{items.length} item(s)</p></div>
        <div className="cart-page">
          <div className="cart-items">
            {items.map((item, idx) => (
              <div key={idx} className="cart-item animate-in">
                <div className="cart-item-img">
                  {item.product.images[0] ? <img src={item.product.images[0]} alt={item.product.name} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} /> : null}
                  🧤
                </div>
                <div className="cart-item-info">
                  <h3>{item.product.name}</h3>
                  <p className="variant">{item.selectedSize} / {item.selectedColor}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div className="quantity-picker">
                      <button onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}>+</button>
                    </div>
                    <span className="price">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                </div>
                <button className="cart-item-remove" onClick={() => { removeFromCart(item.product.id, item.selectedSize, item.selectedColor); trackEvent('remove_from_cart', { productId: item.product.id }); }}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="cart-summary-row"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
            <div className="cart-summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
            <div className="cart-summary-row total"><span>Total</span><span>{formatPrice(total + shipping)}</span></div>
            {total < 3000 && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>Free shipping on orders above Rs. 3,000</p>}
            <Link to="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 20 }}>
              Proceed to Checkout <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
