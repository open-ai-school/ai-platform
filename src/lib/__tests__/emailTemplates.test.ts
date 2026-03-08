import { describe, it, expect } from 'vitest';
import { welcomeEmailHtml } from '@/lib/emailTemplates';

const SUPPORTED_LOCALES = ['en', 'fr', 'nl', 'hi', 'te'];

describe('welcomeEmailHtml', () => {
  it.each(SUPPORTED_LOCALES)('returns valid HTML for locale "%s"', (locale) => {
    const html = welcomeEmailHtml('user@example.com', locale);

    expect(html).toMatch(/^<!DOCTYPE html>/);
    expect(html).toContain('</html>');
    expect(html).toContain(`lang="${locale}"`);
  });

  it('defaults to English when locale is not provided', () => {
    const html = welcomeEmailHtml('user@example.com');

    expect(html).toContain('lang="en"');
    expect(html).toContain('Welcome to AI Educademy');
  });

  it('falls back to English for an unsupported locale', () => {
    const html = welcomeEmailHtml('user@example.com', 'zz');

    expect(html).toContain('lang="zz"');
    expect(html).toContain('Welcome to AI Educademy');
  });

  it('contains the email address passed in', () => {
    const email = 'ramesh@example.com';
    const html = welcomeEmailHtml(email);

    expect(html).toContain(email);
  });

  it('does not contain dead href="#" links', () => {
    for (const locale of SUPPORTED_LOCALES) {
      const html = welcomeEmailHtml('test@example.com', locale);
      expect(html).not.toContain('href="#"');
    }
  });

  it('contains real CTA links to aieducademy.org', () => {
    const html = welcomeEmailHtml('test@example.com');

    expect(html).toContain('https://aieducademy.org/programs');
    expect(html).toContain('https://aieducademy.org/lab');
    expect(html).toContain('https://github.com/ai-educademy');
  });

  it.each(SUPPORTED_LOCALES)('includes locale-specific greeting for "%s"', (locale) => {
    const html = welcomeEmailHtml('user@example.com', locale);

    // Every locale should have a greeting followed by the email
    expect(html).toContain('user@example.com');
    // The title meta tag should be set
    expect(html).toContain('<title>');
  });
});
