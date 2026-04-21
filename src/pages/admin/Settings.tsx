import { useState, useEffect } from 'react';
import { Save, Check } from 'lucide-react';
import { getSettings, saveSettings } from '../../utils/storage';
import { StoreSettings } from '../../types';

export default function Settings() {
  const [form, setForm] = useState<StoreSettings>(getSettings());
  const [saved, setSaved] = useState(false);

  const [status, setStatus] = useState<{ loading: boolean; connected: boolean; error?: string }>({ loading: true, connected: false });

  useEffect(() => {
    setForm(getSettings());
    checkBackend();
  }, []);

  const checkBackend = async () => {
    setStatus({ loading: true, connected: false });
    try {
      const { apiUrl } = await import('../../utils/apiConfig');
      const res = await fetch(apiUrl('/api/products'));
      if (res.ok) {
        setStatus({ loading: false, connected: true });
      } else {
        const err = await res.json();
        setStatus({ loading: false, connected: false, error: err.error || `Error ${res.status}` });
      }
    } catch (e) {
      setStatus({ loading: false, connected: false, error: 'Cannot reach backend' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = (field: keyof StoreSettings, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div>
      <div className="admin-header"><h1>Settings</h1></div>
      
      {/* Backend Status Check */}
      <div className="card" style={{ maxWidth: 600, marginBottom: 24, borderLeft: `4px solid ${status.connected ? '#22c55e' : '#ef4444'}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', margin: 0, fontSize: '1.1rem' }}>Backend Connection</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {status.loading ? 'Checking connection...' : (status.connected ? '✅ All systems operational' : `❌ ${status.error}`)}
            </p>
          </div>
          <button onClick={checkBackend} className="btn btn-outline btn-sm" disabled={status.loading}>Re-check</button>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-heading)' }}>Store Configuration</h3>
          <div className="input-group">
            <label>Store Name</label>
            <input className="input-field" value={form.storeName} onChange={(e) => update('storeName', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="input-group">
              <label>Currency Code</label>
              <input className="input-field" value={form.currency} onChange={(e) => update('currency', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Currency Symbol</label>
              <input className="input-field" value={form.currencySymbol} onChange={(e) => update('currencySymbol', e.target.value)} />
            </div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)' }}>WhatsApp Notifications</h3>
          <div className="input-group">
            <label>WhatsApp Number (Manual fallback)</label>
            <input className="input-field" value={form.whatsappNumber} onChange={(e) => update('whatsappNumber', e.target.value)} placeholder="923001234567" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Backup number for manual WhatsApp opening</span>
          </div>
          <div className="input-group">
            <label>WhatsApp Bot Webhook URL (Automatic)</label>
            <input className="input-field" value={form.whatsappWebhookUrl || ''} onChange={(e) => update('whatsappWebhookUrl', e.target.value)} placeholder="https://your-bot-api.com/webhook" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Orders will be sent automatically to this endpoint</span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)' }}>Security</h3>
          <div className="input-group">
            <label>Admin Password</label>
            <input className="input-field" type="password" value={form.adminPassword} onChange={(e) => update('adminPassword', e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            {saved ? <><Check size={18} /> Saved!</> : <><Save size={18} /> Save Settings</>}
          </button>
        </form>
      </div>
    </div>
  );
}
