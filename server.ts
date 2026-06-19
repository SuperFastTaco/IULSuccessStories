import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Helper
  function hash(value: string | undefined): string | null {
    if (!value) return null;
    return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
  }

  // API routes
  app.get("/api/pixel-id", (req, res) => {
    const pixelId = process.env.META_PIXEL_ID;
    if (!pixelId) {
      return res.status(404).json({ error: "Meta Pixel ID not configured" });
    }
    return res.status(200).json({ pixelId });
  });

  app.get("/api/gtm-id", (req, res) => {
    const gtmId = process.env.GOOGLE_TAG_MANAGER_ID || "GTM-TP5FW48X";
    if (!gtmId) {
      return res.status(404).json({ error: "Google Tag Manager ID not configured" });
    }
    return res.status(200).json({ gtmId });
  });

  app.post("/api/lead", async (req, res) => {
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
        fbc,
        fbp,
      } = req.body;

      const accessToken = process.env.META_ACCESS_TOKEN;
      const pixelId = process.env.META_PIXEL_ID;

      if (!accessToken || !pixelId) {
        console.error("Meta Credentials Missing: META_ACCESS_TOKEN or META_PIXEL_ID");
        return res.status(500).json({ error: "Configuration error" });
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
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
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
