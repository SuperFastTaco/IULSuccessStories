import crypto from "crypto";

function hash(value: string | undefined): string | null {
  if (!value) return null;
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const {
      eventName = "Lead",
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
      clientIpAddress,
      testEventCode,
      eventId,
      fbp,
      fbc,
    } = req.body;

    const accessToken = process.env.META_ACCESS_TOKEN;
    const pixelId = process.env.META_PIXEL_ID;

    if (!accessToken || !pixelId) {
      console.error("Meta Credentials Missing: META_ACCESS_TOKEN or META_PIXEL_ID");
      return res.status(500).json({ error: "Configuration error: Meta key/id environment variables are missing." });
    }

    const userData: any = {};
    if (email) userData.em = [hash(email)];
    if (phone) userData.ph = [hash(phone)];
    if (firstName) userData.fn = [hash(firstName)];
    if (lastName) userData.ln = [hash(lastName)];
    if (city) userData.ct = [hash(city)];
    if (state) userData.st = [hash(state)];
    if (zip) userData.zp = [hash(zip)];
    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;

    userData.client_user_agent = clientUserAgent || req.headers["user-agent"];
    userData.client_ip_address = clientIpAddress || req.headers["x-forwarded-for"] || req.socket?.remoteAddress;

    const customData: any = {};
    if (contentName) customData.content_name = contentName;
    if (contentCategory) customData.content_category = contentCategory;

    const eventData: any = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId || undefined,
          action_source: "website",
          event_source_url: url || "",
          user_data: userData,
          custom_data: Object.keys(customData).length > 0 ? customData : undefined,
        },
      ],
    };

    if (testEventCode) {
      eventData.test_event_code = testEventCode;
    }

    const fbResponse = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      }
    );

    const result = (await fbResponse.json()) as any;

    if (!fbResponse.ok) {
      console.error("Meta CAPI Error Response:", result);
      return res.status(fbResponse.status).json({
        success: false,
        message: "Meta API rejected the event",
        details: result,
      });
    }

    return res.status(200).json({
      success: true,
      fbTraceId: result.fbtrace_id,
    });
  } catch (error: any) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
