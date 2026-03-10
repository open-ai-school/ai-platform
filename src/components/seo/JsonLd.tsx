"use client";

const BASE_URL = "https://aieducademy.org";
const SUPPORTED_LANGUAGES = [
  "en", "fr", "nl", "hi", "te", "es", "pt", "de", "ja", "zh", "ar",
];

function proficiencyLevel(level: number): string {
  return level <= 1 ? "Beginner" : level <= 3 ? "Intermediate" : "Advanced";
}

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI Educademy",
    url: BASE_URL,
    description:
      "Free AI education platform with interactive lessons in 11 languages",
    inLanguage: SUPPORTED_LANGUAGES,
    publisher: {
      "@type": "Organization",
      name: "AI Educademy",
      url: BASE_URL,
      logo: `${BASE_URL}/icon-512.png`,
      founder: {
        "@type": "Person",
        name: "Ramesh Reddy Adutla",
        url: "https://github.com/rameshreddy-adutla",
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/en/programs?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function CourseJsonLd({
  locale,
  name,
  description,
  slug,
  level,
  estimatedHours,
  provider = "AI Educademy",
}: {
  locale: string;
  name: string;
  description: string;
  slug: string;
  level: number;
  estimatedHours?: number;
  provider?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url: `${BASE_URL}/${locale}/programs/${slug}`,
    provider: {
      "@type": "Organization",
      name: provider,
      url: BASE_URL,
    },
    inLanguage: locale,
    isAccessibleForFree: true,
    educationalLevel: proficiencyLevel(level),
    numberOfCredits: 0,
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `PT${estimatedHours ?? 2}H`,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function CourseListJsonLd({
  courses,
  locale,
}: {
  courses: { name: string; description: string; slug: string; level: number }[];
  locale: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: courses.map((course, index) => ({
      "@type": "Course",
      position: index + 1,
      name: course.name,
      description: course.description,
      provider: { "@type": "Organization", name: "AI Educademy" },
      isAccessibleForFree: true,
      inLanguage: SUPPORTED_LANGUAGES,
      educationalLevel: proficiencyLevel(course.level),
      url: `${BASE_URL}/${locale}/programs/${course.slug}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function LearningResourceJsonLd({
  name,
  description,
  educationalLevel,
  duration,
  locale,
  courseName,
}: {
  name: string;
  description: string;
  educationalLevel: string;
  duration: number;
  locale: string;
  courseName: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name,
    description,
    educationalLevel,
    timeRequired: `PT${duration}M`,
    isAccessibleForFree: true,
    inLanguage: locale,
    isPartOf: { "@type": "Course", name: courseName },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ArticleJsonLd({
  headline,
  description,
  datePublished,
  dateModified,
  author,
  image,
  url,
  tags,
}: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  image?: string;
  url: string;
  tags?: string[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    datePublished,
    dateModified: dateModified || datePublished,
    author: { "@type": "Person", name: author },
    publisher: {
      "@type": "Organization",
      name: "AI Educademy",
      url: BASE_URL,
    },
    image,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: tags?.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FAQJsonLd({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
