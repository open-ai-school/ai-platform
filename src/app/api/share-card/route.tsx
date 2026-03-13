import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const program = searchParams.get("program") ?? "Unknown Program";
  const user = searchParams.get("user") ?? "A Learner";

  // Map slug to readable title
  const programTitles: Record<string, string> = {
    "ai-seeds": "AI Seeds",
    "ai-sprouts": "AI Sprouts",
    "ai-branches": "AI Branches",
    "ai-canopy": "AI Canopy",
    "ai-forest": "AI Forest",
    "ai-sketch": "AI Sketch",
    "ai-chisel": "AI Chisel",
    "ai-craft": "AI Craft",
    "ai-polish": "AI Polish",
    "ai-masterpiece": "AI Masterpiece",
    "ai-launchpad": "Interview Launchpad",
    "ai-behavioral": "Behavioral Mastery",
    "ai-technical": "Technical Interviews",
    "ai-ml-interview": "AI & ML Interviews",
    "ai-offer": "Offer & Beyond",
  };

  const programName = programTitles[program] ?? program;

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
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #581c87 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Glow effect */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            padding: "40px",
          }}
        >
          {/* Logo text */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "32px",
            }}
          >
            <span style={{ fontSize: "36px" }}>🤖</span>
            <span
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "-0.5px",
              }}
            >
              AI Educademy
            </span>
          </div>

          {/* Achievement heading */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <span style={{ fontSize: "40px" }}>🎉</span>
            <span
              style={{
                fontSize: "36px",
                fontWeight: 700,
                color: "#fbbf24",
                letterSpacing: "-0.5px",
              }}
            >
              Achievement Unlocked!
            </span>
          </div>

          {/* Program name */}
          <div
            style={{
              fontSize: "52px",
              fontWeight: 800,
              color: "white",
              textAlign: "center",
              lineHeight: 1.2,
              marginBottom: "20px",
              maxWidth: "900px",
              letterSpacing: "-1px",
            }}
          >
            {programName}
          </div>

          {/* Completed by */}
          <div
            style={{
              fontSize: "26px",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "40px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>Completed by</span>
            <span
              style={{
                fontWeight: 700,
                color: "rgba(255,255,255,0.95)",
              }}
            >
              {user}
            </span>
          </div>

          {/* URL */}
          <div
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "1px",
            }}
          >
            aieducademy.org
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    },
  );
}
