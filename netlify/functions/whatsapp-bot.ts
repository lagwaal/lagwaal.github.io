import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const order = JSON.parse(event.body || '{}');
  
  // These variables must be set in your Netlify Dashboard
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const myNumber = process.env.WHATSAPP_RECIPIENT_NUMBER; // Your number (e.g. 92300...)

  if (!accessToken || !phoneNumberId || !myNumber) {
    console.error('WhatsApp Bot configuration missing!');
    return { statusCode: 500, body: JSON.stringify({ error: 'Bot configuration missing' }) };
  }

  // Format the message for yourself
  const messageText = `🚀 *NEW ORDER RECEIVED!*
  
📦 *Order ID:* ${order.id}
👤 *Customer:* ${order.customer.name} (${order.customer.phone})
📍 *Address:* ${order.customer.address}, ${order.customer.city}
💰 *Total:* Rs. ${order.total.toLocaleString()}

🛍️ *Items:*
${order.items.map((item: any) => `• ${item.name} (${item.variant}) x${item.quantity}`).join('\n')}

_Please check the Admin Dashboard to fulfill this order._`;

  try {
    const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: myNumber,
        type: 'text',
        text: { body: messageText },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to send WhatsApp message');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'WhatsApp notification sent!' }),
    };
  } catch (error: any) {
    console.error('WhatsApp Bot Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};

export { handler };
