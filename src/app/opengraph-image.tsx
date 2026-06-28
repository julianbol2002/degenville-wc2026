import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Degenville World Cup 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A1628 0%, #0F1F2E 50%, #1A3A4A 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(42, 157, 143, 0.15)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-60px",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "rgba(42, 157, 143, 0.08)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            background: "rgba(42, 157, 143, 0.2)",
            border: "1px solid rgba(42, 157, 143, 0.5)",
            borderRadius: "999px",
            padding: "8px 24px",
            marginBottom: "24px",
            color: "#2A9D8F",
            fontSize: "22px",
            fontWeight: "600",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}
        >
          ⚽ Bracket Challenge
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              fontSize: "96px",
              fontWeight: "900",
              color: "#FFFFFF",
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            DEGENVILLE
          </div>
          <div
            style={{
              fontSize: "48px",
              fontWeight: "700",
              background: "linear-gradient(90deg, #2A9D8F, #FFD700)",
              backgroundClip: "text",
              color: "transparent",
              letterSpacing: "6px",
            }}
          >
            WORLD CUP 2026
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "40px",
            marginBottom: "40px",
          }}
        >
          {[
            { label: "Players", value: "17" },
            { label: "Games", value: "16" },
            { label: "Prize Pool", value: "$340" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                padding: "16px 32px",
              }}
            >
              <div style={{ fontSize: "42px", fontWeight: "800", color: "#FFD700" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "18px", color: "#94A3B8", marginTop: "4px" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            fontSize: "22px",
            color: "rgba(148, 163, 184, 0.8)",
            letterSpacing: "1px",
          }}
        >
          degenville-wc2026.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
