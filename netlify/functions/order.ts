import { Handler } from '@netlify/functions';

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const order = JSON.parse(event.body || '{}');
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;

  console.log('New Order Received via Netlify:', order.orderId);

  if (!webhookUrl) {
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Order received but WhatsApp notification not sent (missing webhook configuration).',
        orderId: order.orderId
      }),
    };
  }

  try {
    const botResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });

    if (!botResponse.ok) throw new Error(`Bot API responded with ${botResponse.status}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Order processed and WhatsApp notification sent.',
        orderId: order.orderId
      }),
    };
  } catch (error) {
    console.error('Error forwarding to WhatsApp bot:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        message: 'Order received but failed to notify WhatsApp bot.',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

export { handler };
