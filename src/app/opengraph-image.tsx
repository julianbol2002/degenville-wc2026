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
          background: "linear-gradient(180deg, #000000 0%, #1A1A1A 60%, #CC0000 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: "#CC0000",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "4px",
            padding: "8px 24px",
            marginBottom: "24px",
            color: "#FFFFFF",
            fontSize: "22px",
            fontWeight: "700",
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          Bracket Challenge
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
              letterSpacing: "-1px",
              lineHeight: 1,
            }}
          >
            DEGENVILLE
          </div>
          <div
            style={{
              fontSize: "48px",
              fontWeight: "700",
              color: "#CC0000",
              letterSpacing: "8px",
            }}
          >
            WORLD CUP 2026
          </div>
        </div>

        <div style={{ display: "flex", gap: "40px", marginBottom: "40px" }}>
          {[
            { label: "Players", value: "18" },
            { label: "Games", value: "16" },
            { label: "Prize Pool", value: "$340" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "8px",
                padding: "16px 32px",
              }}
            >
              <div style={{ fontSize: "42px", fontWeight: "800", color: "#CC0000" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "18px", color: "#B3B3B3", marginTop: "4px" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: "22px", color: "rgba(255,255,255,0.7)", letterSpacing: "1px" }}>
          degenville-wc2026.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
