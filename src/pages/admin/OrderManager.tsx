import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus, formatPrice } from '../../utils/storage';
import { Order } from '../../types';
import { Eye, X } from 'lucide-react';

const statusOptions: Order['status'][] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => { 
    getOrders().then(setOrders); 
  }, []);

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    await updateOrderStatus(orderId, status);
    const updatedOrders = await getOrders();
    setOrders(updatedOrders);
    if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, status });
  };

  return (
    <div>
      <div className="admin-header"><h1>Orders</h1></div>

      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
        <table className="admin-table">
          <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{o.id.slice(0, 18)}</td>
                <td>{o.customer.name}</td>
                <td>{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
                <td style={{ fontWeight: 600 }}>{formatPrice(o.total)}</td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value as Order['status'])}
                    className="input-field"
                    style={{ padding: '6px 10px', fontSize: '0.8rem', width: 'auto' }}
                  >
                    {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => setSelectedOrder(o)}><Eye size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No orders yet</p>}
      </div>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2>Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><strong>Order ID:</strong> <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{selectedOrder.id}</span></div>
              <div><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</div>
              <div><strong>Status:</strong> <span className={`badge badge-${selectedOrder.status === 'delivered' ? 'success' : selectedOrder.status === 'cancelled' ? 'danger' : 'warning'}`}>{selectedOrder.status}</span></div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
              <h3 style={{ fontSize: '1rem' }}>Customer</h3>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <p>{selectedOrder.customer.name}</p>
                <p>{selectedOrder.customer.phone}</p>
                <p>{selectedOrder.customer.email}</p>
                <p>{selectedOrder.customer.address}, {selectedOrder.customer.city}</p>
                {selectedOrder.customer.notes && <p>Notes: {selectedOrder.customer.notes}</p>}
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
              <h3 style={{ fontSize: '1rem' }}>Items</h3>
              {selectedOrder.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>{item.product.name} ({item.selectedSize}/{item.selectedColor}) × {item.quantity}</span>
                  <span>{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent)' }}>
                <span>Total</span><span>{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
