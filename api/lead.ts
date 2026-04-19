import crypto from 'crypto';

/**
 * Meta Conversions API (CAPI) Lead Event Handler
 * This is designed as a Vercel Serverless Function (Node.js)
 */

function hash(value: string | undefined): string | null {
  if (!value) return null;
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

export default async function handler(req: any, res: any) {
  // Add CORS headers for your frontend
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      eventName = 'Lead',
      firstName, 
      lastName, 
      email, 
      phone, 
      zip, 
      city, 
      state, 
      url,
      contentName,
      contentCategory,
      clientUserAgent,
      clientIpAddress 
    } = req.body;

    const accessToken = process.env.META_ACCESS_TOKEN;
    const pixelId = process.env.META_PIXEL_ID;

    if (!accessToken || !pixelId) {
      console.error('Meta Credentials Missing: META_ACCESS_TOKEN or META_PIXEL_ID');
      return res.status(500).json({ error: 'Configuration error' });
    }

    // Build User Data according to Meta Conversion API requirements
    // https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters
    const userData: any = {};
    
    if (email) userData.em = [hash(email)];
    if (phone) userData.ph = [hash(phone)];
    if (firstName) userData.fn = [hash(firstName)];
    if (lastName) userData.ln = [hash(lastName)];
    if (city) userData.ct = [hash(city)];
    if (state) userData.st = [hash(state)];
    if (zip) userData.zp = [hash(zip)];

    // Use provided client info or headers
    userData.client_user_agent = clientUserAgent || req.headers['user-agent'];
    userData.client_ip_address = clientIpAddress || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const customData: any = {};
    if (contentName) customData.content_name = contentName;
    if (contentCategory) customData.content_category = contentCategory;

    const eventData = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: url || '',
          user_data: userData,
          custom_data: Object.keys(customData).length > 0 ? customData : undefined,
        },
      ],
    };

    const fbResponse = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      }
    );

    const result = await fbResponse.json();

    if (!fbResponse.ok) {
      console.error('Meta CAPI Error Response:', result);
      return res.status(fbResponse.status).json({ 
        success: false, 
        message: 'Meta API rejected the event',
        details: result 
      });
    }

    return res.status(200).json({ 
      success: true, 
      fbTraceId: result.fbtrace_id 
    });

  } catch (error: any) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
