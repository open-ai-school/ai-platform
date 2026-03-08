import Link from "next/link";

export default function RootNotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ textAlign: "center", maxWidth: "400px" }}>
        <div style={{ fontSize: "5rem", fontWeight: 700, color: "#6366f1", opacity: 0.2 }}>404</div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Page not found</h1>
        <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>The page you are looking for does not exist.</p>
        <Link
          href="/"
          style={{ display: "inline-block", padding: "0.75rem 1.5rem", background: "#6366f1", color: "white", textDecoration: "none", borderRadius: "0.75rem", fontWeight: 600 }}
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
