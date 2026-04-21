import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const order = request.body;
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;

  console.log('New Order Received:', order.orderId);

  // In a real app, you would save the order to a database here (e.g. Supabase, MongoDB)
  // For now, we simulate a successful database write.

  if (!webhookUrl) {
    console.warn('WHATSAPP_WEBHOOK_URL is not set in environment variables.');
    // We still return success because the order is "received" by the backend
    return response.status(200).json({ 
      success: true, 
      message: 'Order received but WhatsApp notification not sent (missing webhook configuration).',
      orderId: order.orderId
    });
  }

  try {
    const botResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    if (!botResponse.ok) {
      throw new Error(`Bot API responded with ${botResponse.status}`);
    }

    return response.status(200).json({ 
      success: true, 
      message: 'Order processed and WhatsApp notification sent.',
      orderId: order.orderId
    });
  } catch (error) {
    console.error('Error forwarding to WhatsApp bot:', error);
    return response.status(500).json({ 
      success: false, 
      message: 'Order received but failed to notify WhatsApp bot.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
