import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import crypto from "crypto";

const isProduction = process.env.NODE_ENV === "production";

// In-memory rate limiting for server protection
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (entry.count >= limit) {
    return true;
  }

  entry.count += 1;
  return false;
}

// Clean up stale rate limit entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000).unref?.();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: "1mb" }));

  // API Helper
  function hash(value: string | undefined): string | null {
    if (!value) return null;
    return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
  }

  // API routes with throttling
  app.get("/api/pixel-id", (req, res) => {
    const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
    if (isRateLimited(`pixel_${clientIp}`, 60, 60 * 1000)) {
      return res.status(429).json({ error: "Too many requests. Please try again later." });
    }

    const pixelId = process.env.META_PIXEL_ID;
    if (!pixelId) {
      return res.status(404).json({ error: "Meta Pixel ID not configured" });
    }
    return res.status(200).json({ pixelId });
  });

  app.get("/api/gtm-id", (req, res) => {
    const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
    if (isRateLimited(`gtm_${clientIp}`, 60, 60 * 1000)) {
      return res.status(429).json({ error: "Too many requests. Please try again later." });
    }

    const gtmId = process.env.GOOGLE_TAG_MANAGER_ID || "GTM-TP5FW48X";
    if (!gtmId) {
      return res.status(404).json({ error: "Google Tag Manager ID not configured" });
    }
    return res.status(200).json({ gtmId });
  });

  app.post("/api/lead", async (req, res) => {
    try {
      const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
      // Allow up to 40 tracking/lead events per minute per IP to prevent unconstrained flooding
      if (isRateLimited(`lead_${clientIp}`, 40, 60 * 1000)) {
        return res.status(429).json({
          success: false,
          error: "Rate limit exceeded. Please slow down event dispatches.",
        });
      }

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
        fbc,
        fbp,
      } = req.body;

      const accessToken = process.env.META_ACCESS_TOKEN;
      const pixelId = process.env.META_PIXEL_ID;

      if (!accessToken || !pixelId) {
        // Return 200 with soft warning if preview/unconfigured so client tracking doesn't break UI flow
        return res.status(200).json({
          success: true,
          status: "simulated_preview",
          message: "Meta credentials not configured in environment.",
        });
      }

      const userData: any = {};
      if (email) userData.em = [hash(email)];
      if (phone) userData.ph = [hash(phone)];
      if (firstName) userData.fn = [hash(firstName)];
      if (lastName) userData.ln = [hash(lastName)];
      if (city) userData.ct = [hash(city)];
      if (state) userData.st = [hash(state)];
      if (zip) userData.zp = [hash(zip)];
      if (fbc) userData.fbc = fbc;
      if (fbp) userData.fbp = fbp;

      userData.client_user_agent = clientUserAgent || req.headers["user-agent"];
      userData.client_ip_address = clientIpAddress || req.headers["x-forwarded-for"] || req.socket.remoteAddress;

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

      // Add a 8-second AbortController timeout to prevent unconstrained hung requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const fbResponse = await fetch(
          `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(eventData),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);
        const result = (await fbResponse.json()) as any;

        if (!fbResponse.ok) {
          console.warn("Meta CAPI Error Response:", result);
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
      } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        if (fetchErr.name === "AbortError") {
          return res.status(504).json({ success: false, error: "Meta API timeout" });
        }
        throw fetchErr;
      }
    } catch (error: any) {
      console.error("Internal Server Error in /api/lead:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  // Vite middleware for development
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
