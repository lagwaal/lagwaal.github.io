import { Order } from '../types';
import { getSettings } from './storage';

export async function sendToWhatsAppBot(order: Order): Promise<{ success: boolean; message: string }> {
  const settings = getSettings();
  
  const payload = {
    source: 'Lagwal Ecommerce',
    type: 'new_order',
    orderId: order.id,
    customer: order.customer,
    items: order.items.map(item => ({
      name: item.product.name,
      variant: `${item.selectedSize}/${item.selectedColor}`,
      quantity: item.quantity,
      price: item.product.price
    })),
    total: order.total,
    timestamp: order.createdAt
  };

  try {
    // Try calling our internal Vercel API first
    const apiResponse = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (apiResponse.ok) {
      const result = await apiResponse.json();
      return { success: true, message: result.message || 'Order processed via Vercel backend.' };
    }
  } catch (e) {
    console.log('Internal API not available, trying direct webhook fallback...');
  }

  // Fallback to direct webhook if configured in settings (legacy/local dev support)
  if (!settings.whatsappWebhookUrl) {
    return { 
      success: false, 
      message: 'Backend API and Webhook URL not configured. Order saved locally only.' 
    };
  }

  try {
    const response = await fetch(settings.whatsappWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`Bot API responded with ${response.status}`);

    return { success: true, message: 'Order sent to WhatsApp bot via direct webhook.' };
  } catch (error) {
    console.error('Failed to send order to WhatsApp bot:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred.' 
    };
  }
}
