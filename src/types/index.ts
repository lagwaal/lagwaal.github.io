export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  images: string[];
  featured: boolean;
  rating: number;
  reviews: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  total: number;
  subtotal: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}

export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'product_view' | 'add_to_cart' | 'remove_from_cart' | 'purchase' | 'checkout_start';
  data: Record<string, unknown>;
  timestamp: string;
}

export interface StoreSettings {
  storeName: string;
  currency: string;
  currencySymbol: string;
  whatsappNumber: string;
  whatsappWebhookUrl?: string;
  adminPassword: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  averageOrderValue: number;
  revenueByDay: { date: string; revenue: number }[];
  ordersByDay: { date: string; orders: number }[];
  topProducts: { name: string; sales: number }[];
  recentOrders: Order[];
}
