import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function describeImage(filename) {
  const filePath = path.join(".", "public", "picture", filename);
  if (!fs.existsSync(filePath)) {
    console.log(`${filename} does not exist`);
    return;
  }
  const fileBuffer = fs.readFileSync(filePath);
  const base64Data = fileBuffer.toString("base64");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          { text: "What are the main headlines, charts, and numbers shown in this image? Write a short, clear 2-paragraph summary of its contents so I know what this image represents." },
          {
            inlineData: {
              data: base64Data,
              mimeType: "image/png"
            }
          }
        ]
      }
    ]
  });

  console.log(`=== ${filename} ===`);
  console.log(response.text);
  console.log("\n");
}

async function main() {
  try {
    await describeImage("image1.png");
    await describeImage("image2.png");
    await describeImage("image3.png");
  } catch (err) {
    console.error("Error generating description:", err);
  }
}

main();
