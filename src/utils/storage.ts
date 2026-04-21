import { Product, Order, AnalyticsEvent, StoreSettings } from '../types';
import { seedProducts } from '../data/seedProducts';

const KEYS = {
  PRODUCTS: 'lagwal_products',
  ORDERS: 'lagwal_orders',
  CART: 'lagwal_cart',
  ANALYTICS: 'lagwal_analytics',
  SETTINGS: 'lagwal_settings',
  AUTH: 'lagwal_admin_auth',
};

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Lagwal',
  currency: 'PKR',
  currencySymbol: 'Rs.',
  whatsappNumber: '923001234567',
  whatsappWebhookUrl: '',
  adminPassword: 'admin123',
};

// Generic storage helpers
function getItem<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Products
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products');
    if (response.ok) {
      const products = await response.json();
      // Sync local cache
      setItem(KEYS.PRODUCTS, products);
      return products;
    }
  } catch (e) {
    console.warn('Failed to fetch products from API, using cache');
  }
  
  const cached = getItem<Product[]>(KEYS.PRODUCTS, []);
  if (cached.length === 0) {
    setItem(KEYS.PRODUCTS, seedProducts);
    return seedProducts;
  }
  return cached;
}

export async function saveProducts(products: Product[]): Promise<void> {
  setItem(KEYS.PRODUCTS, products);
  try {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(products),
    });
  } catch (e) {
    console.error('Failed to sync products to database');
  }
}

export async function addProduct(product: Product): Promise<void> {
  const products = await getProducts();
  products.push(product);
  await saveProducts(products);
}

export async function updateProduct(updated: Product): Promise<void> {
  const products = (await getProducts()).map((p) =>
    p.id === updated.id ? updated : p
  );
  await saveProducts(products);
}

export async function deleteProduct(id: string): Promise<void> {
  const products = (await getProducts()).filter((p) => p.id !== id);
  await saveProducts(products);
}

// Orders
export async function getOrders(): Promise<Order[]> {
  try {
    const response = await fetch('/api/order');
    if (response.ok) {
      const orders = await response.json();
      setItem(KEYS.ORDERS, orders);
      return orders;
    }
  } catch (e) {
    console.warn('Failed to fetch orders from API');
  }
  return getItem<Order[]>(KEYS.ORDERS, []);
}

export async function saveOrders(orders: Order[]): Promise<void> {
  setItem(KEYS.ORDERS, orders);
}

export function addOrder(order: Order): void {
  // Note: Checkout.tsx handles the actual API call via sendToWhatsAppBot
  // which now also saves to the database on the server side.
  // We just update the local cache here.
  const orders = getItem<Order[]>(KEYS.ORDERS, []);
  orders.unshift(order);
  setItem(KEYS.ORDERS, orders);
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<void> {
  const orders = (await getOrders()).map((o) =>
    o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
  );
  // We need a way to save orders back. 
  // Let's add a generic saveOrders API if needed, or handle it via a specific status update route.
  // For now, we'll just update the whole list.
  try {
    await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orders), // In a real DB this would be a PATCH, but Blobs are simpler
    });
  } catch (e) {
    console.error('Failed to update order status in database');
  }
}

// Analytics
export function getAnalyticsEvents(): AnalyticsEvent[] {
  return getItem<AnalyticsEvent[]>(KEYS.ANALYTICS, []);
}

export function trackEvent(
  type: AnalyticsEvent['type'],
  data: Record<string, unknown> = {}
): void {
  const events = getAnalyticsEvents();
  events.push({
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    data,
    timestamp: new Date().toISOString(),
  });
  setItem(KEYS.ANALYTICS, events);
}

// Settings
export function getSettings(): StoreSettings {
  return getItem<StoreSettings>(KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function saveSettings(settings: StoreSettings): void {
  setItem(KEYS.SETTINGS, settings);
}

// Auth
export function isAdminAuthenticated(): boolean {
  return getItem<boolean>(KEYS.AUTH, false);
}

export function setAdminAuth(authenticated: boolean): void {
  setItem(KEYS.AUTH, authenticated);
}

export function formatPrice(price: number): string {
  const settings = getSettings();
  return `${settings.currencySymbol} ${price.toLocaleString()}`;
}

export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
