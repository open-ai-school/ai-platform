"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/MotionWrappers";
import {
  Download,
  Mail,
  User,
  CheckCircle,
  BookOpen,
  Briefcase,
  Wrench,
  Map,
  MessageSquare,
  Loader2,
  FileText,
  Sparkles,
  Zap,
} from "lucide-react";

type FormStatus = "idle" | "submitting" | "success" | "error" | "rateLimit";

const WHAT_INSIDE_ICONS = [Map, BookOpen, Briefcase, Wrench, MessageSquare] as const;
const WHAT_INSIDE_KEYS = ["roadmap", "concepts", "careers", "tools", "interview"] as const;

export default function AIStarterKitPage() {
  const t = useTranslations("leadMagnet");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [downloadUrl, setDownloadUrl] = useState("");

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = t("errorNameRequired");
    if (!email.trim()) errs.email = t("errorInvalidEmail");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = t("errorInvalidEmail");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      if (res.status === 429) {
        setStatus("rateLimit");
        return;
      }

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setDownloadUrl(data.downloadUrl ?? "/api/lead-magnet/download");
        setErrors({});
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] min-h-[48px] disabled:opacity-50";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      {/* ── Hero Section ── */}
      <AnimatedSection animation="fade-up">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6 bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
            <Sparkles size={14} />
            {t("freeForever")} &middot; {t("pageCount")} &middot; {t("instantDownload")}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[var(--color-primary)] to-[#a855f7] bg-clip-text text-transparent leading-tight">
            {t("title")}
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
      </AnimatedSection>

      {/* ── What's Inside ── */}
      <AnimatedSection animation="fade-up" delay={100}>
        <div
          className="rounded-2xl p-8 mb-12 border backdrop-blur-sm"
          style={{
            background: "var(--color-glass)",
            borderColor: "var(--color-glass-border)",
          }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FileText size={20} className="text-[var(--color-primary)]" />
            {t("whatInsideTitle")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {WHAT_INSIDE_KEYS.map((key, i) => {
              const Icon = WHAT_INSIDE_ICONS[i];
              return (
                <div
                  key={key}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--color-bg-section)] transition-colors"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                    <Icon size={18} className="text-[var(--color-primary)]" />
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed pt-1.5">
                    {t(`whatInside.${key}`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* ── Email Capture Form ── */}
      <AnimatedSection animation="fade-up" delay={200}>
        <div
          className="rounded-2xl p-8 border backdrop-blur-sm"
          style={{
            background: "var(--color-glass)",
            borderColor: "var(--color-glass-border)",
          }}
        >
          {status === "success" ? (
            /* ── Success State ── */
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-accent)]/10 mb-4">
                <CheckCircle size={32} className="text-[var(--color-accent)]" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{t("successTitle")}</h3>
              <p className="text-[var(--color-text-muted)] mb-6 max-w-md mx-auto">
                {t("successMessage")}
              </p>
              <a
                href={downloadUrl}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold text-sm hover:brightness-110 transition-all"
              >
                <Download size={18} />
                {t("successDownload")}
              </a>
            </div>
          ) : (
            /* ── Form ── */
            <>
              {/* Social proof */}
              <p className="text-center text-sm text-[var(--color-text-muted)] mb-6 flex items-center justify-center gap-2">
                <Zap size={14} className="text-[var(--color-primary)]" />
                {t("socialProof", { count: "1,000" })}
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-4 max-w-md mx-auto">
                {/* Name */}
                <div>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                    />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("namePlaceholder")}
                      disabled={status === "submitting"}
                      className={`${inputCls} pl-9`}
                      aria-label={t("namePlaceholder")}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-[var(--color-secondary)] mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("emailPlaceholder")}
                      disabled={status === "submitting"}
                      className={`${inputCls} pl-9`}
                      aria-label={t("emailPlaceholder")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-[var(--color-secondary)] mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full px-6 py-3.5 bg-gradient-to-r from-[var(--color-primary)] to-[#a855f7] text-white rounded-xl font-semibold text-sm hover:brightness-110 transition-all cursor-pointer min-h-[48px] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {t("submitting")}
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      {t("submitButton")}
                    </>
                  )}
                </button>

                {/* Error banners */}
                {status === "error" && (
                  <p className="text-sm text-[var(--color-secondary)] text-center">
                    {t("errorGeneric")}
                  </p>
                )}
                {status === "rateLimit" && (
                  <p className="text-sm text-[var(--color-secondary)] text-center">
                    {t("errorRateLimit")}
                  </p>
                )}

                {/* Privacy note */}
                <p className="text-xs text-[var(--color-text-muted)] text-center pt-2">
                  {t("privacyNote")}
                </p>
              </form>
            </>
          )}
        </div>
      </AnimatedSection>

      {/* ── Description / extra nudge ── */}
      <AnimatedSection animation="fade-up" delay={300}>
        <p className="text-center text-sm text-[var(--color-text-muted)] mt-8 max-w-lg mx-auto">
          {t("description")}
        </p>
      </AnimatedSection>
    </div>
  );
}
