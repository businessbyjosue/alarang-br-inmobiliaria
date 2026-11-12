import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Logotipo "Cima" (mismo trazo que components/Logo.tsx) para iOS.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#F3F1EC" }}>
        <svg width="180" height="180" viewBox="0 0 120 120">
          <path d="M60 26 L84 78 L72 78 L60 52 L48 78 L36 78 Z" fill="#1B2A45" />
          <rect x="30" y="86" width="60" height="4" fill="#B08D57" />
        </svg>
      </div>
    ),
    size
  );
}
