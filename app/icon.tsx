import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050508",
          borderRadius: 6,
          border: "1px solid rgba(0,212,255,0.4)",
          color: "#00d4ff",
          fontSize: 14,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        GS
      </div>
    ),
    { ...size }
  );
}
