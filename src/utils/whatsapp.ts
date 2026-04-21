import { CartItem, CustomerInfo } from '../types';
import { formatPrice, getSettings } from './storage';

export function buildWhatsAppMessage(
  items: CartItem[],
  customer: CustomerInfo,
  total: number
): string {
  const settings = getSettings();
  const itemLines = items
    .map(
      (item) =>
        `• ${item.product.name} (${item.selectedSize}/${item.selectedColor}) × ${item.quantity} — ${formatPrice(item.product.price * item.quantity)}`
    )
    .join('\n');

  const message = `🛒 *New Order — ${settings.storeName}*
━━━━━━━━━━━━━━━━━━

📦 *Items:*
${itemLines}

━━━━━━━━━━━━━━━━━━
💰 *Total: ${formatPrice(total)}*

📍 *Ship to:*
👤 ${customer.name}
📞 ${customer.phone}
📧 ${customer.email}
🏠 ${customer.address}, ${customer.city}
${customer.notes ? `📝 Notes: ${customer.notes}` : ''}

⏰ ${new Date().toLocaleString()}`;

  return message;
}

export function sendWhatsAppOrder(
  items: CartItem[],
  customer: CustomerInfo,
  total: number
): void {
  const settings = getSettings();
  const message = buildWhatsAppMessage(items, customer, total);
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${settings.whatsappNumber}?text=${encodedMessage}`;
  window.open(url, '_blank');
}
