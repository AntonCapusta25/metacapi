import { ServerEvent, EventRequest, UserData } from 'facebook-nodejs-business-sdk';

const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const PIXEL_B_ID = process.env.META_PIXEL_B_ID || '1572408953943015';

// Enable CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).setHeader('Access-Control-Allow-Origin', '*').end();
  }

  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for access token
  if (!ACCESS_TOKEN) {
    return res.status(500).json({ error: 'META_ACCESS_TOKEN not configured' });
  }

  try {
    const {
      eventName = 'SubmitApplication',
      eventSourceUrl,
      fbp,
      fbc,
      userAgent,
      ipAddress,
      email,
      phone,
      externalId,
      eventId,
      customData = {},
    } = req.body;

    // Validate required fields
    if (!eventSourceUrl) {
      return res.status(400).json({ error: 'eventSourceUrl is required' });
    }

    // Build UserData
    const userData = new UserData()
      .setClientIpAddress(ipAddress || req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress)
      .setClientUserAgent(userAgent || req.headers['user-agent']);

    if (fbp) userData.setFbp(fbp);
    if (fbc) userData.setFbc(fbc);
    if (email) userData.setEmail(email);
    if (phone) userData.setPhone(phone);
    if (externalId) userData.setExternalId(externalId);

    // Build ServerEvent
    const serverEvent = new ServerEvent()
      .setEventName(eventName)
      .setEventTime(Math.floor(Date.now() / 1000))
      .setUserData(userData)
      .setEventSourceUrl(eventSourceUrl)
      .setActionSource('website');

    if (eventId) serverEvent.setEventId(eventId);
    if (Object.keys(customData).length > 0) {
      serverEvent.setCustomData(customData);
    }

    // Send to Meta
    const eventRequest = new EventRequest(ACCESS_TOKEN, PIXEL_B_ID)
      .setEvents([serverEvent]);

    const response = await eventRequest.execute();

    return res.status(200).json({
      success: true,
      eventsReceived: response.events_received,
      messages: response.messages,
      fbtrace_id: response.fbtrace_id,
    });

  } catch (error) {
    console.error('CAPI Error:', error);
    return res.status(500).json({
      error: 'Failed to send event',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}
