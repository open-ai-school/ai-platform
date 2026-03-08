"use client";

import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Root Error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#0f0a1e", color: "#e2e8f0" }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ textAlign: "center", maxWidth: "400px" }}>
            <div style={{ fontSize: "3.5rem" }}>⚠️</div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Something went wrong</h1>
            <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>An unexpected error occurred. Please try again.</p>
            <button
              onClick={reset}
              style={{ padding: "0.75rem 1.5rem", background: "#6366f1", color: "white", border: "none", borderRadius: "0.75rem", fontWeight: 600, cursor: "pointer", fontSize: "1rem" }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
