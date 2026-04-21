import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  try {
    const store = getStore('lagwal_store');

    if (event.httpMethod === 'POST') {
      const order = JSON.parse(event.body || '{}');
      const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;

      console.log('Processing Order via Netlify Database:', order.id);

      // 1. Save to Netlify Database (Blobs)
      const existingOrders: any[] = await store.get('orders', { type: 'json' }) || [];
      existingOrders.unshift(order);
      await store.setJSON('orders', existingOrders);

      // 2. Update Inventory (Decrement Stock)
      const products: any[] = await store.get('products', { type: 'json' }) || [];
      order.items.forEach((item: any) => {
        const pIdx = products.findIndex((p: any) => p.id === item.product.id);
        if (pIdx !== -1) {
          products[pIdx].stock = Math.max(0, products[pIdx].stock - item.quantity);
        }
      });
      await store.setJSON('products', products);

      // 3. Notify WhatsApp Bot (if configured)
      if (webhookUrl) {
        try {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order),
          });
        } catch (webhookErr) {
          console.warn('Webhook notification failed but order saved:', webhookErr);
        }
      }

      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ 
          success: true, 
          message: 'Order saved to database and processed.',
          orderId: order.id 
        }),
      };
    }

    // Handle GET - Fetch all orders (for Admin Dashboard)
    if (event.httpMethod === 'GET') {
      const orders = await store.get('orders', { type: 'json' }) || [];
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify(orders),
      };
    }

    return { statusCode: 405, headers: CORS_HEADERS, body: 'Method Not Allowed' };
  } catch (error: any) {
    console.error('Order Function Error:', error);
    
    // Check for missing Blobs environment
    const isBlobsMissing = error.name === 'MissingBlobsEnvironmentError' || error.message?.includes('Blobs');

    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ 
        success: false, 
        error: isBlobsMissing ? 'Netlify Blobs not enabled' : 'Internal server error',
        details: error.message
      }),
    };
  }
};

export { handler };
