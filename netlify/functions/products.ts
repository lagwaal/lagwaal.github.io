import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  try {
    const store = getStore('lagwal_store');
    
    // Handle GET - Fetch products
    if (event.httpMethod === 'GET') {
      const products = await store.get('products', { type: 'json' }) || [];
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify(products),
      };
    }

    // Handle POST - Save/Update products
    if (event.httpMethod === 'POST') {
      const products = JSON.parse(event.body || '[]');
      await store.setJSON('products', products);
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ success: true }),
      };
    }

    return { statusCode: 405, headers: CORS_HEADERS, body: 'Method Not Allowed' };
  } catch (error: any) {
    console.error('Products Function Error:', error);
    
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
