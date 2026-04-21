import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

const handler: Handler = async (event) => {
  if (event.httpMethod === 'POST') {
    const store = getStore('lagwal_store');
    const order = JSON.parse(event.body || '{}');
    const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;

    console.log('Processing Order via Netlify Database:', order.id);

    try {
      // 1. Save to Netlify Database (Blobs)
      const existingOrders: any[] = await store.get('orders', { type: 'json' }) || [];
      existingOrders.unshift(order);
      await store.setJSON('orders', existingOrders);

      // 2. Update Inventory (Decrement Stock)
      const products: any[] = await store.get('products', { type: 'json' }) || [];
      order.items.forEach((item: any) => {
        const pIdx = products.findIndex(p => p.id === item.product.id);
        if (pIdx !== -1) {
          products[pIdx].stock = Math.max(0, products[pIdx].stock - item.quantity);
        }
      });
      await store.setJSON('products', products);

      // 3. Notify WhatsApp Bot (if configured)
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order),
        });
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true, 
          message: 'Order saved to database and processed.',
          orderId: order.id 
        }),
      };
    } catch (error) {
      console.error('Database Error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, error: 'Failed to save to database' }),
      };
    }
  }

  // Handle GET - Fetch all orders (for Admin Dashboard)
  if (event.httpMethod === 'GET') {
    const store = getStore('lagwal_store');
    const orders = await store.get('orders', { type: 'json' }) || [];
    return {
      statusCode: 200,
      body: JSON.stringify(orders),
    };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};

export { handler };
