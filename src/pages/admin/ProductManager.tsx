import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { formatPrice, generateId } from '../../utils/storage';
import { Product } from '../../types';

const emptyProduct: Omit<Product, 'id' | 'createdAt'> = {
  name: '', description: '', price: 0, category: '', sizes: [], colors: [],
  stock: 0, images: [''], featured: false, rating: 0, reviews: 0,
};

export default function ProductManager() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const openNew = () => { setEditing(null); setForm(emptyProduct); setSizeInput(''); setColorInput(''); setShowModal(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, price: p.price, originalPrice: p.originalPrice, category: p.category, sizes: p.sizes, colors: p.colors, stock: p.stock, images: p.images, featured: p.featured, rating: p.rating, reviews: p.reviews });
    setSizeInput(p.sizes.join(', '));
    setColorInput(p.colors.join(', '));
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sizes = sizeInput.split(',').map((s) => s.trim()).filter(Boolean);
    const colors = colorInput.split(',').map((s) => s.trim()).filter(Boolean);
    if (editing) {
      updateProduct({ ...editing, ...form, sizes, colors });
    } else {
      addProduct({ ...form, sizes, colors, id: generateId('glv'), createdAt: new Date().toISOString() } as Product);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => { deleteProduct(id); setDeleteConfirm(null); };

  return (
    <div>
      <div className="admin-header">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={openNew}><Plus size={18} /> Add Product</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 500 }}>{p.name}</td>
                <td><span className="badge badge-accent">{p.category}</span></td>
                <td>{formatPrice(p.price)}</td>
                <td>{p.stock}</td>
                <td>{p.featured ? '⭐' : '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}><Edit2 size={14} /></button>
                    {deleteConfirm === p.id ? (
                      <>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Confirm</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                      </>
                    ) : (
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(p.id)}><Trash2 size={14} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No products yet. Add your first product!</p>}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2>{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label>Name *</label>
                <input className="input-field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="input-group">
                  <label>Price *</label>
                  <input className="input-field" type="number" required value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                </div>
                <div className="input-group">
                  <label>Original Price</label>
                  <input className="input-field" type="number" value={form.originalPrice || ''} onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) || undefined })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="input-group">
                  <label>Category *</label>
                  <input className="input-field" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g., Leather" />
                </div>
                <div className="input-group">
                  <label>Stock *</label>
                  <input className="input-field" type="number" required value={form.stock || ''} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
                </div>
              </div>
              <div className="input-group">
                <label>Sizes (comma-separated)</label>
                <input className="input-field" value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} placeholder="S, M, L, XL" />
              </div>
              <div className="input-group">
                <label>Colors (comma-separated)</label>
                <input className="input-field" value={colorInput} onChange={(e) => setColorInput(e.target.value)} placeholder="Black, Brown, Tan" />
              </div>
              <div className="input-group">
                <label>Image URLs (comma-separated for gallery)</label>
                <textarea className="input-field" rows={2} value={form.images.join(', ')} onChange={(e) => setForm({ ...form, images: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="/img1.jpg, /img2.jpg" />
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>First image will be the primary one.</p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                Featured product
              </label>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add'} Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
