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
export function getProducts(): Product[] {
  const products = getItem<Product[]>(KEYS.PRODUCTS, []);
  
  // Migration: Ensure images is an array and check if we need to sync with seedProducts
  const needsSync = products.length === 0 || products.some(p => !Array.isArray(p.images) || p.images.length <= 1);
  
  if (needsSync) {
    const syncedProducts = seedProducts.map(seedP => {
      const existing = products.find(p => p.id === seedP.id);
      if (existing) {
        // Keep existing stock but use new images/description
        return { ...seedP, stock: existing.stock };
      }
      return seedP;
    });
    setItem(KEYS.PRODUCTS, syncedProducts);
    return syncedProducts;
  }
  
  return products;
}

export function saveProducts(products: Product[]): void {
  setItem(KEYS.PRODUCTS, products);
}

export function addProduct(product: Product): void {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
}

export function updateProduct(updated: Product): void {
  const products = getProducts().map((p) =>
    p.id === updated.id ? updated : p
  );
  saveProducts(products);
}

export function deleteProduct(id: string): void {
  const products = getProducts().filter((p) => p.id !== id);
  saveProducts(products);
}

// Orders
export function getOrders(): Order[] {
  return getItem<Order[]>(KEYS.ORDERS, []);
}

export function saveOrders(orders: Order[]): void {
  setItem(KEYS.ORDERS, orders);
}

export function addOrder(order: Order): void {
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);

  // Update Inventory (Stock)
  const products = getProducts();
  order.items.forEach(item => {
    const productIndex = products.findIndex(p => p.id === item.product.id);
    if (productIndex !== -1) {
      products[productIndex].stock = Math.max(0, products[productIndex].stock - item.quantity);
    }
  });
  saveProducts(products);
}

export function updateOrderStatus(
  orderId: string,
  status: Order['status']
): void {
  const orders = getOrders().map((o) =>
    o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
  );
  saveOrders(orders);
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
