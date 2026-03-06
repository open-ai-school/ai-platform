import { useTranslations } from "next-intl";
import Image from "next/image";
import { ScrollReveal } from "@open-ai-school/ai-ui-library";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      {/* Header */}
      <ScrollReveal animation="scale-in">
        <div className="text-center mb-16">
          <div className="relative w-36 h-36 mx-auto mb-6">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50 blur-xl animate-pulse-glow" />
            <div className="relative w-36 h-36 rounded-full overflow-hidden ring-4 ring-[var(--color-primary)]/20 shadow-2xl">
              <Image
                src="https://avatars.githubusercontent.com/u/134313151?v=4"
                alt="Ramesh Reddy Adutla — Founder of AI Educademy"
                width={144}
                height={144}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2">Ramesh Reddy Adutla</h1>
          <p className="text-lg text-[var(--color-primary)] font-semibold">
            {t("subtitle")}
          </p>

        </div>
      </ScrollReveal>

      {/* Mission */}
      <ScrollReveal animation="fade-up">
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🎯 {t("mission")}
          </h2>
          <p className="text-lg text-[var(--color-text-muted)] max-w-3xl mx-auto p-6 rounded-2xl glass-card">
            {t("missionText")}
          </p>
        </section>
      </ScrollReveal>

      {/* Story */}
      <ScrollReveal animation="fade-up">
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            📖 {t("story")}
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-[var(--color-text-muted)]">
            <p>{t("storyText1")}</p>
            <p>{t("storyText2")}</p>
            <p className="p-6 rounded-2xl bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-accent)]/5 border border-[var(--color-primary)]/20 italic">
              {t("storyText3")}
            </p>
            <p>{t("storyText4")}</p>
          </div>
        </section>
      </ScrollReveal>

      {/* Values */}
      <section className="mb-16">
        <ScrollReveal animation="fade-up">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            💎 {t("values")}
          </h2>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 gap-6">
          {["value1", "value2", "value3", "value4"].map((key, i) => (
            <ScrollReveal key={key} animation="fade-up" delay={i * 100}>
              <div className="gradient-border h-full">
                <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 card-hover card-glow h-full">
                  <div className="text-3xl mb-3">
                    {["🌐", "🤝", "💡", "🔓"][i]}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{t(`${key}.title`)}</h3>
                  <p className="text-[var(--color-text-muted)]">
                    {t(`${key}.description`)}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <hr className="section-divider mb-16" />

      {/* Connect */}
      <ScrollReveal animation="fade-up">
        <section className="text-center">
          <h2 className="text-lg font-semibold mb-4 text-[var(--color-text-muted)]">
            {t("connect")}
          </h2>
          <div className="flex items-center justify-center gap-5">
            <a
              href="https://github.com/rameshreddy-adutla"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-[var(--color-text-muted)] hover:text-[#333] dark:hover:text-white transition-all duration-200 hover:scale-110"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/rameshreddy-adutla"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[var(--color-text-muted)] hover:text-[#0077B5] transition-all duration-200 hover:scale-110"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="https://dev.to/rameshreddy-adutla"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Dev.to"
              className="text-[var(--color-text-muted)] hover:text-[#333] dark:hover:text-white transition-all duration-200 hover:scale-110"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6v4.36h.58c.37 0 .65-.08.84-.23.2-.16.29-.45.29-.84v-2.22c0-.39-.1-.68-.29-.84zM0 0v24h24V0H0zm8.1 15.01c-.28.4-.74.6-1.38.6H4.5V8.4h2.22c.64 0 1.1.2 1.38.6.28.4.42.98.42 1.76v2.5c0 .77-.14 1.35-.42 1.75zm4.38-5.46c0 .4-.1.7-.29.89-.2.2-.5.3-.89.3h-.77v2.67h-1.5V8.4h2.27c.4 0 .7.1.89.3.2.19.29.49.29.89v.96zm6.02 5.46h-1.5l-.9-4.38h-.06l.06 1.6v2.78h-1.36V8.4h1.5l.92 4.64h.05l-.05-1.66V8.4h1.34v7.01z" />
              </svg>
            </a>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
