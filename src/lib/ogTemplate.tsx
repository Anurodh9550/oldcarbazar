import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

export async function loadLogoDataUrl(): Promise<string> {
  const buffer = await readFile(
    join(process.cwd(), "public", "logocar.png")
  );
  const base64 = buffer.toString("base64");
  return `data:image/png;base64,${base64}`;
}

type OgCardProps = {
  logoSrc: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  accent?: string;
  highlights?: string[];
};

export function OgCard({
  logoSrc,
  eyebrow,
  title,
  subtitle,
  accent = "#f75d34",
  highlights,
}: OgCardProps) {
  const tags = highlights ?? [];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0f0f0f",
        backgroundImage:
          "linear-gradient(135deg, #0f0f0f 0%, #1c1c1c 100%)",
        padding: "60px 70px",
        color: "#ffffff",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 0,
          height: 0,
          display: "flex",
          borderTop: `220px solid ${accent}`,
          borderLeft: "220px solid transparent",
          opacity: 0.92,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 8,
          display: "flex",
          backgroundColor: accent,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <img
          src={logoSrc}
          width={92}
          height={92}
          alt=""
          style={{
            width: 92,
            height: 92,
            objectFit: "contain",
            borderRadius: 18,
            backgroundColor: "#ffffff",
            padding: 8,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              fontSize: 38,
              fontWeight: 900,
              letterSpacing: -1,
              color: "#ffffff",
              lineHeight: 1,
            }}
          >
            <span style={{ color: accent }}>Old</span>
            <span style={{ color: "#ffffff" }}>Car</span>
            <span style={{ color: accent }}>Bazar</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 6,
              fontSize: 16,
              letterSpacing: 4,
              color: "#a8a8a8",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Buy · Sell · Drive Better
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 60,
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            fontSize: 20,
            fontWeight: 700,
            color: accent,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 36,
              height: 4,
              backgroundColor: accent,
              borderRadius: 2,
            }}
          />
          <div style={{ display: "flex" }}>{eyebrow}</div>
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 78,
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: -2,
            color: "#ffffff",
            display: "flex",
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 22,
            fontSize: 30,
            lineHeight: 1.35,
            color: "#d4d4d4",
            fontWeight: 500,
            maxWidth: 980,
            display: "flex",
          }}
        >
          {subtitle}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 30,
          marginTop: 30,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          {tags.map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                padding: "10px 18px",
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 999,
                color: "#ffffff",
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: accent,
                }}
              />
              <div style={{ display: "flex" }}>{tag}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: 1,
          }}
        >
          oldcarbazar.com
        </div>
      </div>
    </div>
  );
}
