import { useState, useEffect, useMemo } from 'react';
import { DollarSign, ShoppingCart, Package, TrendingUp, CheckCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getOrders } from '../../utils/storage';
import { useProducts } from '../../context/ProductContext';
import { formatPrice } from '../../utils/storage';

const COLORS = ['#d4a853', '#e6bc6a', '#b8942e', '#f0d78c', '#967321', '#c4a24a', '#dcc06b', '#a88535'];

export default function Dashboard() {
  const { products } = useProducts();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    getOrders().then(data => {
      setOrders(data);
      setLoadingOrders(false);
    });
  }, []);

  const stats = useMemo(() => {
    if (loadingOrders) return null;
    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    const avgOrder = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Revenue by day (last 7 days)
    const days: Record<string, number> = {};
    const ordersByDay: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      days[key] = 0;
      ordersByDay[key] = 0;
    }
    orders.forEach((o) => {
      const key = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (key in days) { days[key] += o.total; ordersByDay[key] += 1; }
    });

    const revenueByDay = Object.entries(days).map(([date, revenue]) => ({ date, revenue }));
    const ordersChartData = Object.entries(ordersByDay).map(([date, count]) => ({ date, orders: count }));

    // Top products
    const productSales: Record<string, number> = {};
    orders.forEach((o: any) => o.items.forEach((item: any) => {
      productSales[item.product.name] = (productSales[item.product.name] || 0) + item.quantity;
    }));
    const topProducts = Object.entries(productSales).map(([name, sales]) => ({ name, sales })).sort((a, b) => b.sales - a.sales).slice(0, 6);

    const lowStockProducts = products.filter(p => p.stock < 10).sort((a, b) => a.stock - b.stock);

    return { totalRevenue, totalOrders: orders.length, totalProducts: products.length, avgOrder, revenueByDay, ordersChartData, topProducts, lowStockProducts };
  }, [orders, products]);

  if (!stats) {
    return <div className="admin-content"><p>Loading dashboard data...</p></div>;
  }

  return (
    <div>
      <div className="admin-header"><h1>Dashboard</h1></div>

      <div className="grid grid-4" style={{ marginBottom: 32 }}>
        <div className="stats-card">
          <div className="stats-card-icon"><DollarSign size={22} /></div>
          <div>
            <div className="stats-card-value">{formatPrice(stats.totalRevenue)}</div>
            <div className="stats-card-label">Total Revenue</div>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-card-icon"><ShoppingCart size={22} /></div>
          <div>
            <div className="stats-card-value">{stats.totalOrders}</div>
            <div className="stats-card-label">Total Orders</div>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-card-icon"><Package size={22} /></div>
          <div>
            <div className="stats-card-value">{stats.totalProducts}</div>
            <div className="stats-card-label">Products</div>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-card-icon"><TrendingUp size={22} /></div>
          <div>
            <div className="stats-card-value">{formatPrice(Math.round(stats.avgOrder))}</div>
            <div className="stats-card-label">Avg Order Value</div>
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 32 }}>
        <div className="chart-card">
          <h3>Revenue (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stats.revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1a1a25', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, color: '#f0f0f5' }} />
              <Line type="monotone" dataKey="revenue" stroke="#d4a853" strokeWidth={2} dot={{ fill: '#d4a853', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3>Orders (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.ordersChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1a1a25', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, color: '#f0f0f5' }} />
              <Bar dataKey="orders" fill="#d4a853" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: 32 }}>
        <div className="chart-card">
          <h3>Top Products</h3>
          {stats.topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={stats.topProducts} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`} labelLine={false} fontSize={11}>
                  {stats.topProducts.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1a25', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, color: '#f0f0f5' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={{ color: 'var(--text-muted)', padding: 40, textAlign: 'center' }}>No sales data yet</p>}
        </div>
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3>Low Stock Alert</h3>
            {stats.lowStockProducts.length > 0 && <span className="badge badge-danger">{stats.lowStockProducts.length} items</span>}
          </div>
          {stats.lowStockProducts.length > 0 ? (
            <table className="admin-table">
              <thead><tr><th>Product</th><th>Category</th><th>Stock</th></tr></thead>
              <tbody>
                {stats.lowStockProducts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td><span style={{ color: '#ef4444', fontWeight: 600 }}>{p.stock}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle size={40} style={{ color: '#22c55e', marginBottom: 12, opacity: 0.5 }} />
              <p style={{ color: 'var(--text-secondary)' }}>All products are well-stocked.</p>
            </div>
          )}
        </div>
      </div>

      <div className="chart-card" style={{ marginTop: 32 }}>
        <h3>Recent Orders</h3>
        {orders.length > 0 ? (
          <table className="admin-table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {orders.slice(0, 10).map((o) => (
                <tr key={o.id}>
                  <td style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{o.id}</td>
                  <td>{o.customer?.name || 'Guest'}</td>
                  <td>{formatPrice(o.total)}</td>
                  <td><span className={`badge badge-${o.status === 'delivered' ? 'success' : o.status === 'cancelled' ? 'danger' : 'warning'}`}>{o.status}</span></td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p style={{ color: 'var(--text-muted)', padding: 40, textAlign: 'center' }}>No orders yet</p>}
      </div>
    </div>
  );
}
