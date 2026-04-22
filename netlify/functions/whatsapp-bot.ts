import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'lagwal_bot_verify_2026';

  // 1. Handle Meta Webhook Verification (GET)
  if (event.httpMethod === 'GET') {
    const mode = event.queryStringParameters?.['hub.mode'];
    const token = event.queryStringParameters?.['hub.verify_token'];
    const challenge = event.queryStringParameters?.['hub.challenge'];

    if (mode === 'subscribe' && token === verifyToken) {
      console.log('Webhook Verified Successfully!');
      return {
        statusCode: 200,
        body: challenge,
      };
    }
    return { statusCode: 403, body: 'Verification failed' };
  }

  // 2. Handle Order Notifications (POST)
  if (event.httpMethod === 'POST') {
    const order = JSON.parse(event.body || '{}');
    
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const myNumber = process.env.WHATSAPP_RECIPIENT_NUMBER;

    if (!accessToken || !phoneNumberId || !myNumber) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Bot configuration missing in Netlify' }) };
    }

    const messageText = `🛒 *NEW ORDER: ${order.id}*
━━━━━━━━━━━━━━━━━━
👤 *Customer:* ${order.customer.name}
📞 *Phone:* ${order.customer.phone}
📍 *City:* ${order.customer.city}
💰 *Total:* Rs. ${order.total.toLocaleString()}

🛍️ *Items:*
${order.items.map((item: any) => `• ${item.name} (x${item.quantity})`).join('\n')}
━━━━━━━━━━━━━━━━━━
_Check Admin Panel for full details._`;

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

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    } catch (error: any) {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, error: error.message }),
      };
    }
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};

export { handler };
