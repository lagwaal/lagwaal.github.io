import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

export const handler: Handler = async (event) => {
  const store = getStore('lagwal_store');
  
  // Handle GET - Fetch products
  if (event.httpMethod === 'GET') {
    const products = await store.get('products', { type: 'json' }) || [];
    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  }

  // Handle POST - Save/Update products
  if (event.httpMethod === 'POST') {
    const products = JSON.parse(event.body || '[]');
    await store.setJSON('products', products);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
