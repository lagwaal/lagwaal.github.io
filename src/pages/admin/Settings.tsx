import { useState, useEffect } from 'react';
import { Save, Check } from 'lucide-react';
import { getSettings, saveSettings } from '../../utils/storage';
import { StoreSettings } from '../../types';

export default function Settings() {
  const [form, setForm] = useState<StoreSettings>(getSettings());
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(getSettings()); }, []);

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
