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

  const message = `🛒 *NEW ORDER — ${settings.storeName}*
━━━━━━━━━━━━━━━━━━

📋 *Order Details:*
${itemLines}

━━━━━━━━━━━━━━━━━━
💰 *Grand Total: ${formatPrice(total)}*

👤 *Customer Details:*
- *Name:* ${customer.name}
- *Phone:* ${customer.phone}
- *Email:* ${customer.email}
- *Address:* ${customer.address}, ${customer.city}
${customer.notes ? `- *Notes:* ${customer.notes}` : ''}

📅 *Date:* ${new Date().toLocaleDateString()}
⏰ *Time:* ${new Date().toLocaleTimeString()}

_Thank you for shopping with ${settings.storeName}!_`;

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
