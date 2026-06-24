import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/content";

export const runtime = "edge";
export const alt = `${siteConfig.name} — ${siteConfig.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #050508 0%, #0a0f1a 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "48px 64px",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <p style={{ color: "#00d4ff", fontSize: 14, letterSpacing: "0.15em", marginBottom: 16 }}>
            {"// SYS.ONLINE"}
          </p>
          <h1 style={{ color: "#e2e8f0", fontSize: 56, fontWeight: 700, margin: 0 }}>
            {siteConfig.name}
          </h1>
          <p style={{ color: "#00d4ff", fontSize: 28, marginTop: 12 }}>
            {siteConfig.title}
          </p>
          <p style={{ color: "#94a3b8", fontSize: 18, marginTop: 24, maxWidth: 600, textAlign: "center" }}>
            {siteConfig.description}
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
