/**
 * Generate the "2026 AI Starter Kit" PDF using pdf-lib.
 *
 * Run:  npx tsx scripts/generate-lead-magnet-pdf.ts
 *
 * Outputs: public/downloads/ai-starter-kit-2026.pdf
 */

import { PDFDocument, rgb, StandardFonts, PageSizes } from "pdf-lib";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

/* ─── Color palette ─── */
const INDIGO = rgb(0.4, 0.42, 0.94);    // #667eea
const PURPLE = rgb(0.46, 0.29, 0.64);   // #764ba2
const DARK = rgb(0.06, 0.09, 0.16);     // #0f172a
const MUTED = rgb(0.39, 0.45, 0.55);    // #64748b
const LIGHT_BG = rgb(0.97, 0.98, 0.99); // #f8fafc
const WHITE = rgb(1, 1, 1);
const ACCENT = rgb(0.06, 0.73, 0.51);   // #10b981

const PAGE_W = PageSizes.A4[0]; // 595.28
const PAGE_H = PageSizes.A4[1]; // 841.89
const MARGIN = 50;
const CONTENT_W = PAGE_W - MARGIN * 2;

/* ─── Helpers ─── */

function drawPageNumber(page: ReturnType<PDFDocument["addPage"]>, num: number, font: Awaited<ReturnType<PDFDocument["embedFont"]>>) {
  page.drawText(`${num}`, { x: PAGE_W / 2 - 4, y: 25, size: 9, font, color: MUTED });
}

function drawSectionHeader(page: ReturnType<PDFDocument["addPage"]>, y: number, text: string, font: Awaited<ReturnType<PDFDocument["embedFont"]>>) {
  // Draw accent bar
  page.drawRectangle({ x: MARGIN, y: y - 2, width: 4, height: 20, color: INDIGO });
  page.drawText(text, { x: MARGIN + 14, y, size: 18, font, color: DARK });
  return y - 35;
}

function drawBullet(page: ReturnType<PDFDocument["addPage"]>, y: number, text: string, font: Awaited<ReturnType<PDFDocument["embedFont"]>>, boldFont: Awaited<ReturnType<PDFDocument["embedFont"]>>, bulletTitle?: string) {
  page.drawText("•", { x: MARGIN + 10, y, size: 11, font: boldFont, color: INDIGO });
  if (bulletTitle) {
    const titleWidth = boldFont.widthOfTextAtSize(bulletTitle, 11);
    page.drawText(bulletTitle, { x: MARGIN + 25, y, size: 11, font: boldFont, color: DARK });
    page.drawText(` — ${text}`, { x: MARGIN + 25 + titleWidth, y, size: 11, font, color: MUTED });
  } else {
    page.drawText(text, { x: MARGIN + 25, y, size: 11, font, color: MUTED });
  }
  return y - 20;
}

function wrapText(text: string, font: Awaited<ReturnType<PDFDocument["embedFont"]>>, size: number, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) > maxWidth) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawWrappedText(
  page: ReturnType<PDFDocument["addPage"]>,
  y: number,
  text: string,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  opts: { size?: number; color?: ReturnType<typeof rgb>; maxWidth?: number; lineHeight?: number; x?: number } = {}
) {
  const { size = 11, color = MUTED, maxWidth = CONTENT_W - 20, lineHeight = 18, x = MARGIN } = opts;
  const lines = wrapText(text, font, size, maxWidth);
  for (const line of lines) {
    page.drawText(line, { x, y, size, font, color });
    y -= lineHeight;
  }
  return y;
}

/* ─── Content data ─── */

const ROADMAP_STAGES = [
  { title: "Stage 1: Foundations (Weeks 1–4)", items: [
    "What is AI, ML, and Deep Learning?",
    "Python basics for AI (variables, loops, functions)",
    "Math essentials: linear algebra, probability, statistics",
    "Hands-on: Build your first classifier with scikit-learn",
  ]},
  { title: "Stage 2: Core ML (Weeks 5–8)", items: [
    "Supervised learning: regression, classification, decision trees",
    "Unsupervised learning: clustering, dimensionality reduction",
    "Model evaluation: accuracy, precision, recall, F1",
    "Hands-on: Predict house prices with a real dataset",
  ]},
  { title: "Stage 3: Deep Learning (Weeks 9–12)", items: [
    "Neural networks from scratch — perceptrons to CNNs",
    "Natural Language Processing (NLP) fundamentals",
    "Transfer learning with pre-trained models",
    "Hands-on: Build an image classifier with PyTorch",
  ]},
  { title: "Stage 4: Advanced & Applied (Weeks 13–16)", items: [
    "Generative AI: GANs, VAEs, and Diffusion Models",
    "Large Language Models — GPT, Claude, Gemini",
    "Prompt engineering and RAG architectures",
    "Hands-on: Build an AI-powered chatbot",
  ]},
  { title: "Stage 5: Career Ready (Weeks 17–20)", items: [
    "Build a portfolio with 3–5 AI projects",
    "Contribute to open source AI projects",
    "Prepare for technical interviews",
    "Apply to AI roles — ML Engineer, Data Scientist, AI Researcher",
  ]},
];

const TOP_CONCEPTS = [
  { title: "Machine Learning", desc: "Algorithms that learn patterns from data without being explicitly programmed. The foundation of modern AI." },
  { title: "Neural Networks", desc: "Computing systems inspired by biological brains. Layers of interconnected nodes that process information." },
  { title: "Natural Language Processing", desc: "AI that understands, interprets, and generates human language. Powers chatbots, translation, and search." },
  { title: "Computer Vision", desc: "AI that extracts information from images and videos. Used in self-driving cars, medical imaging, and more." },
  { title: "Reinforcement Learning", desc: "Agents that learn by trial and error, receiving rewards for good actions. Powers game AI and robotics." },
  { title: "Transfer Learning", desc: "Reusing a pre-trained model on a new task. Dramatically reduces training time and data requirements." },
  { title: "Generative AI", desc: "Models that create new content — text, images, code, music. Includes GPT, DALL-E, Stable Diffusion." },
  { title: "Transformer Architecture", desc: "The architecture behind LLMs. Uses self-attention to process sequences in parallel, revolutionizing NLP." },
  { title: "RAG (Retrieval-Augmented Generation)", desc: "Combining LLMs with external knowledge bases for accurate, up-to-date responses." },
  { title: "AI Ethics & Safety", desc: "Ensuring AI systems are fair, transparent, accountable, and aligned with human values." },
];

const CAREER_PATHS = [
  { role: "ML Engineer", salary: "$130K – $200K", desc: "Build and deploy ML models in production. Bridges data science and software engineering." },
  { role: "Data Scientist", salary: "$120K – $180K", desc: "Analyze data, build models, and extract insights. Strong stats and business acumen needed." },
  { role: "AI Research Scientist", salary: "$150K – $250K", desc: "Push the boundaries of AI capabilities. Requires PhD or strong research background." },
  { role: "NLP Engineer", salary: "$140K – $210K", desc: "Specialize in language models, chatbots, and text processing systems." },
  { role: "Computer Vision Engineer", salary: "$135K – $200K", desc: "Build systems that understand images and video. Autonomous vehicles, medical imaging." },
  { role: "MLOps Engineer", salary: "$130K – $190K", desc: "Infrastructure for ML model deployment, monitoring, and lifecycle management." },
  { role: "AI Product Manager", salary: "$140K – $220K", desc: "Define AI product strategy. Bridge between technical teams and business stakeholders." },
  { role: "Prompt Engineer", salary: "$100K – $160K", desc: "Craft and optimize prompts for LLMs. A new role born from the generative AI revolution." },
];

const AI_TOOLS = [
  { category: "Learning Platforms", tools: "AI Educademy, Coursera, fast.ai, Kaggle Learn, DeepLearning.AI" },
  { category: "Programming", tools: "Python, Jupyter Notebooks, VS Code + Copilot, Google Colab" },
  { category: "ML Frameworks", tools: "PyTorch, TensorFlow, scikit-learn, Hugging Face Transformers" },
  { category: "LLM APIs", tools: "OpenAI API, Anthropic Claude, Google Gemini, Groq" },
  { category: "Data Tools", tools: "Pandas, NumPy, Matplotlib, Seaborn, Plotly" },
  { category: "MLOps & Deployment", tools: "MLflow, Weights & Biases, Docker, AWS SageMaker, Vercel AI SDK" },
  { category: "Datasets", tools: "Kaggle Datasets, Hugging Face Datasets, UCI ML Repository" },
  { category: "Community", tools: "GitHub, Stack Overflow, Reddit r/MachineLearning, Discord AI communities" },
];

const INTERVIEW_TOPICS = [
  { topic: "ML Fundamentals", questions: [
    "Explain the bias-variance tradeoff.",
    "What is overfitting and how do you prevent it?",
    "Describe the difference between L1 and L2 regularization.",
    "When would you use a decision tree vs. a neural network?",
  ]},
  { topic: "Deep Learning", questions: [
    "How does backpropagation work?",
    "What is the vanishing gradient problem?",
    "Explain attention mechanism in transformers.",
    "What is batch normalization and why is it useful?",
  ]},
  { topic: "System Design", questions: [
    "Design a recommendation system for an e-commerce platform.",
    "How would you build a real-time fraud detection system?",
    "Design a content moderation pipeline using AI.",
    "How do you handle model versioning in production?",
  ]},
  { topic: "Coding & Problem Solving", questions: [
    "Implement K-means clustering from scratch.",
    "Write a function to compute TF-IDF scores.",
    "Implement a simple neural network forward pass.",
    "Write code to handle class imbalance in a dataset.",
  ]},
];

/* ─── Main PDF generation ─── */

async function generatePDF() {
  const doc = await PDFDocument.create();
  doc.setTitle("The 2026 AI Starter Kit");
  doc.setAuthor("AI Educademy");
  doc.setSubject("Complete guide to starting your AI journey");
  doc.setCreator("AI Educademy — aieducademy.org");

  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
  let pageNum = 0;

  /* ── Cover Page ── */
  {
    const page = doc.addPage(PageSizes.A4);
    // Gradient background simulation — draw colored rectangles
    page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: rgb(0.04, 0.04, 0.06) });
    // Decorative accent blocks
    page.drawRectangle({ x: 0, y: PAGE_H - 8, width: PAGE_W, height: 8, color: INDIGO });
    page.drawRectangle({ x: MARGIN, y: PAGE_H - 300, width: 4, height: 80, color: INDIGO });

    // Title
    page.drawText("The 2026", { x: MARGIN + 20, y: PAGE_H - 260, size: 28, font: helvetica, color: rgb(0.6, 0.6, 0.7) });
    page.drawText("AI Starter Kit", { x: MARGIN + 20, y: PAGE_H - 300, size: 40, font: helveticaBold, color: WHITE });

    // Subtitle
    page.drawText("Your Complete Guide to Learning AI", { x: MARGIN + 20, y: PAGE_H - 340, size: 16, font: helvetica, color: rgb(0.5, 0.55, 0.65) });

    // Decorative divider
    page.drawRectangle({ x: MARGIN + 20, y: PAGE_H - 365, width: 60, height: 2, color: INDIGO });

    // What's inside
    const insideItems = [
      "AI Learning Roadmap",
      "Top 10 AI Concepts",
      "Career Paths & Salaries",
      "Essential Tools & Resources",
      "Interview Prep Reference",
    ];
    let insideY = PAGE_H - 400;
    for (const item of insideItems) {
      page.drawText(">", { x: MARGIN + 20, y: insideY, size: 12, font: helveticaBold, color: INDIGO });
      page.drawText(item, { x: MARGIN + 42, y: insideY, size: 12, font: helvetica, color: rgb(0.7, 0.7, 0.8) });
      insideY -= 24;
    }

    // By AI Educademy
    page.drawText("by AI Educademy", { x: MARGIN + 20, y: 80, size: 14, font: helveticaBold, color: INDIGO });
    page.drawText("aieducademy.org", { x: MARGIN + 20, y: 60, size: 11, font: helvetica, color: rgb(0.5, 0.5, 0.6) });
    page.drawText("Free · Open Source · 11 Languages", { x: MARGIN + 20, y: 42, size: 10, font: helvetica, color: rgb(0.4, 0.4, 0.5) });
  }

  /* ── Page 1-2: AI Learning Roadmap ── */
  {
    const page1 = doc.addPage(PageSizes.A4);
    pageNum++;
    page1.drawRectangle({ x: 0, y: PAGE_H - 4, width: PAGE_W, height: 4, color: INDIGO });
    let y = PAGE_H - 60;
    y = drawSectionHeader(page1, y, "AI Learning Roadmap", helveticaBold);
    y = drawWrappedText(page1, y, "A structured 20-week path from complete beginner to job-ready AI practitioner. Each stage builds on the previous one.", helvetica, { color: MUTED }) - 10;

    for (const stage of ROADMAP_STAGES.slice(0, 3)) {
      page1.drawText(stage.title, { x: MARGIN + 10, y, size: 13, font: helveticaBold, color: DARK });
      y -= 22;
      for (const item of stage.items) {
        y = drawBullet(page1, y, item, helvetica, helveticaBold);
      }
      y -= 10;
    }
    drawPageNumber(page1, pageNum, helvetica);

    // Page 2
    const page2 = doc.addPage(PageSizes.A4);
    pageNum++;
    page2.drawRectangle({ x: 0, y: PAGE_H - 4, width: PAGE_W, height: 4, color: INDIGO });
    y = PAGE_H - 60;
    y = drawSectionHeader(page2, y, "AI Learning Roadmap (continued)", helveticaBold);

    for (const stage of ROADMAP_STAGES.slice(3)) {
      page2.drawText(stage.title, { x: MARGIN + 10, y, size: 13, font: helveticaBold, color: DARK });
      y -= 22;
      for (const item of stage.items) {
        y = drawBullet(page2, y, item, helvetica, helveticaBold);
      }
      y -= 10;
    }

    // Pro tip box
    y -= 10;
    page2.drawRectangle({ x: MARGIN, y: y - 70, width: CONTENT_W, height: 80, color: LIGHT_BG, borderColor: INDIGO, borderWidth: 1 });
    page2.drawText("[Pro Tip]", { x: MARGIN + 15, y: y - 10, size: 12, font: helveticaBold, color: INDIGO });
    drawWrappedText(page2, y - 30, "Don't try to learn everything at once. Focus on one stage at a time, build projects, and share your work. Consistency beats intensity — 1 hour daily is better than 10 hours on a weekend.", helvetica, { x: MARGIN + 15, maxWidth: CONTENT_W - 30, size: 10, color: MUTED });
    drawPageNumber(page2, pageNum, helvetica);
  }

  /* ── Page 3-4: Top 10 AI Concepts ── */
  {
    const page3 = doc.addPage(PageSizes.A4);
    pageNum++;
    page3.drawRectangle({ x: 0, y: PAGE_H - 4, width: PAGE_W, height: 4, color: PURPLE });
    let y = PAGE_H - 60;
    y = drawSectionHeader(page3, y, "Top 10 AI Concepts You Must Know", helveticaBold);
    y = drawWrappedText(page3, y, "Master these core concepts and you'll understand 90% of AI conversations, papers, and job descriptions.", helvetica) - 10;

    for (let i = 0; i < 5; i++) {
      const c = TOP_CONCEPTS[i];
      page3.drawText(`${i + 1}.`, { x: MARGIN + 5, y, size: 12, font: helveticaBold, color: INDIGO });
      page3.drawText(c.title, { x: MARGIN + 25, y, size: 12, font: helveticaBold, color: DARK });
      y -= 18;
      y = drawWrappedText(page3, y, c.desc, helvetica, { x: MARGIN + 25, maxWidth: CONTENT_W - 30, size: 10 }) - 12;
    }
    drawPageNumber(page3, pageNum, helvetica);

    const page4 = doc.addPage(PageSizes.A4);
    pageNum++;
    page4.drawRectangle({ x: 0, y: PAGE_H - 4, width: PAGE_W, height: 4, color: PURPLE });
    y = PAGE_H - 60;
    y = drawSectionHeader(page4, y, "Top 10 AI Concepts (continued)", helveticaBold);

    for (let i = 5; i < 10; i++) {
      const c = TOP_CONCEPTS[i];
      page4.drawText(`${i + 1}.`, { x: MARGIN + 5, y, size: 12, font: helveticaBold, color: INDIGO });
      page4.drawText(c.title, { x: MARGIN + 25, y, size: 12, font: helveticaBold, color: DARK });
      y -= 18;
      y = drawWrappedText(page4, y, c.desc, helvetica, { x: MARGIN + 25, maxWidth: CONTENT_W - 30, size: 10 }) - 12;
    }
    drawPageNumber(page4, pageNum, helvetica);
  }

  /* ── Page 5-6: Career Paths & Salary Guide ── */
  {
    const page5 = doc.addPage(PageSizes.A4);
    pageNum++;
    page5.drawRectangle({ x: 0, y: PAGE_H - 4, width: PAGE_W, height: 4, color: ACCENT });
    let y = PAGE_H - 60;
    y = drawSectionHeader(page5, y, "AI Career Paths & Salary Guide", helveticaBold);
    y = drawWrappedText(page5, y, "The AI job market is booming. Here are the top roles, expected salaries (US market, 2026), and what each role entails.", helvetica) - 10;

    for (let i = 0; i < 4; i++) {
      const c = CAREER_PATHS[i];
      // Role name and salary on same line
      page5.drawText(c.role, { x: MARGIN + 10, y, size: 13, font: helveticaBold, color: DARK });
      page5.drawText(c.salary, { x: PAGE_W - MARGIN - helvetica.widthOfTextAtSize(c.salary, 11), y: y + 1, size: 11, font: helveticaBold, color: ACCENT });
      y -= 18;
      y = drawWrappedText(page5, y, c.desc, helvetica, { x: MARGIN + 10, maxWidth: CONTENT_W - 20, size: 10 }) - 14;
    }
    drawPageNumber(page5, pageNum, helvetica);

    const page6 = doc.addPage(PageSizes.A4);
    pageNum++;
    page6.drawRectangle({ x: 0, y: PAGE_H - 4, width: PAGE_W, height: 4, color: ACCENT });
    y = PAGE_H - 60;
    y = drawSectionHeader(page6, y, "AI Career Paths (continued)", helveticaBold);

    for (let i = 4; i < CAREER_PATHS.length; i++) {
      const c = CAREER_PATHS[i];
      page6.drawText(c.role, { x: MARGIN + 10, y, size: 13, font: helveticaBold, color: DARK });
      page6.drawText(c.salary, { x: PAGE_W - MARGIN - helvetica.widthOfTextAtSize(c.salary, 11), y: y + 1, size: 11, font: helveticaBold, color: ACCENT });
      y -= 18;
      y = drawWrappedText(page6, y, c.desc, helvetica, { x: MARGIN + 10, maxWidth: CONTENT_W - 20, size: 10 }) - 14;
    }

    // Tip box
    y -= 10;
    page6.drawRectangle({ x: MARGIN, y: y - 70, width: CONTENT_W, height: 80, color: LIGHT_BG, borderColor: ACCENT, borderWidth: 1 });
    page6.drawText("[Market Insight]", { x: MARGIN + 15, y: y - 10, size: 12, font: helveticaBold, color: ACCENT });
    drawWrappedText(page6, y - 30, "AI roles grew 3.5x faster than all other tech roles in 2025. Companies are hiring at all levels — from junior ML engineers to senior AI researchers. The best time to start is now.", helvetica, { x: MARGIN + 15, maxWidth: CONTENT_W - 30, size: 10, color: MUTED });
    drawPageNumber(page6, pageNum, helvetica);
  }

  /* ── Page 7-8: Essential AI Tools & Resources ── */
  {
    const page7 = doc.addPage(PageSizes.A4);
    pageNum++;
    page7.drawRectangle({ x: 0, y: PAGE_H - 4, width: PAGE_W, height: 4, color: INDIGO });
    let y = PAGE_H - 60;
    y = drawSectionHeader(page7, y, "Essential AI Tools & Resources", helveticaBold);
    y = drawWrappedText(page7, y, "The right tools make all the difference. Here's our curated list of the best tools for every stage of your AI journey.", helvetica) - 10;

    for (const cat of AI_TOOLS) {
      page7.drawText(cat.category, { x: MARGIN + 10, y, size: 12, font: helveticaBold, color: DARK });
      y -= 18;
      y = drawWrappedText(page7, y, cat.tools, helvetica, { x: MARGIN + 10, maxWidth: CONTENT_W - 20, size: 10 }) - 14;
    }

    // Recommended learning path
    y -= 10;
    page7.drawRectangle({ x: MARGIN, y: y - 90, width: CONTENT_W, height: 100, color: LIGHT_BG, borderColor: INDIGO, borderWidth: 1 });
    page7.drawText("[Recommended Stack for Beginners]", { x: MARGIN + 15, y: y - 10, size: 12, font: helveticaBold, color: INDIGO });
    const beginnerStack = [
      "1. Start with Python in Google Colab (free, no setup needed)",
      "2. Learn ML basics with scikit-learn + Kaggle datasets",
      "3. Move to PyTorch for deep learning projects",
      "4. Use Hugging Face for NLP and pre-trained models",
    ];
    let by = y - 30;
    for (const item of beginnerStack) {
      page7.drawText(item, { x: MARGIN + 15, y: by, size: 10, font: helvetica, color: MUTED });
      by -= 16;
    }
    drawPageNumber(page7, pageNum, helvetica);

    // Page 8 — additional resources & reading list
    const page8 = doc.addPage(PageSizes.A4);
    pageNum++;
    page8.drawRectangle({ x: 0, y: PAGE_H - 4, width: PAGE_W, height: 4, color: INDIGO });
    y = PAGE_H - 60;
    y = drawSectionHeader(page8, y, "Recommended Reading & Courses", helveticaBold);

    const reading = [
      { title: "Books", items: [
        '"Hands-On Machine Learning" by Aurélien Géron',
        '"Deep Learning" by Goodfellow, Bengio, and Courville',
        '"AI Superpowers" by Kai-Fu Lee',
        '"The Alignment Problem" by Brian Christian',
      ]},
      { title: "Free Courses", items: [
        "AI Educademy — 15 programs, 11 languages (aieducademy.org)",
        "fast.ai — Practical Deep Learning for Coders",
        "Stanford CS229 — Machine Learning (YouTube)",
        "Andrew Ng's ML Specialization (Coursera)",
      ]},
      { title: "Newsletters & Blogs", items: [
        "The Batch (deeplearning.ai) — weekly AI news",
        "Papers With Code — latest research with implementations",
        "Distill.pub — clear explanations of ML concepts",
        "AI Educademy Blog — tutorials and guides",
      ]},
    ];

    for (const section of reading) {
      page8.drawText(section.title, { x: MARGIN + 10, y, size: 13, font: helveticaBold, color: DARK });
      y -= 20;
      for (const item of section.items) {
        y = drawBullet(page8, y, item, helvetica, helveticaBold);
      }
      y -= 12;
    }
    drawPageNumber(page8, pageNum, helvetica);
  }

  /* ── Page 9-10: Interview Prep ── */
  {
    const page9 = doc.addPage(PageSizes.A4);
    pageNum++;
    page9.drawRectangle({ x: 0, y: PAGE_H - 4, width: PAGE_W, height: 4, color: PURPLE });
    let y = PAGE_H - 60;
    y = drawSectionHeader(page9, y, "AI Interview Prep Quick Reference", helveticaBold);
    y = drawWrappedText(page9, y, "Common interview questions organized by category. Practice these and you'll be well prepared for AI/ML technical interviews.", helvetica) - 10;

    for (let i = 0; i < 2; i++) {
      const topic = INTERVIEW_TOPICS[i];
      page9.drawText(topic.topic, { x: MARGIN + 10, y, size: 13, font: helveticaBold, color: DARK });
      y -= 20;
      for (const q of topic.questions) {
        page9.drawText(">", { x: MARGIN + 15, y, size: 10, font: helveticaBold, color: PURPLE });
        y = drawWrappedText(page9, y, q, helvetica, { x: MARGIN + 30, maxWidth: CONTENT_W - 40, size: 10 }) - 6;
      }
      y -= 12;
    }
    drawPageNumber(page9, pageNum, helvetica);

    const page10 = doc.addPage(PageSizes.A4);
    pageNum++;
    page10.drawRectangle({ x: 0, y: PAGE_H - 4, width: PAGE_W, height: 4, color: PURPLE });
    y = PAGE_H - 60;
    y = drawSectionHeader(page10, y, "Interview Prep (continued)", helveticaBold);

    for (let i = 2; i < INTERVIEW_TOPICS.length; i++) {
      const topic = INTERVIEW_TOPICS[i];
      page10.drawText(topic.topic, { x: MARGIN + 10, y, size: 13, font: helveticaBold, color: DARK });
      y -= 20;
      for (const q of topic.questions) {
        page10.drawText(">", { x: MARGIN + 15, y, size: 10, font: helveticaBold, color: PURPLE });
        y = drawWrappedText(page10, y, q, helvetica, { x: MARGIN + 30, maxWidth: CONTENT_W - 40, size: 10 }) - 6;
      }
      y -= 12;
    }

    // Interview tips box
    y -= 10;
    page10.drawRectangle({ x: MARGIN, y: y - 100, width: CONTENT_W, height: 110, color: LIGHT_BG, borderColor: PURPLE, borderWidth: 1 });
    page10.drawText("[Interview Tips]", { x: MARGIN + 15, y: y - 10, size: 12, font: helveticaBold, color: PURPLE });
    const tips = [
      "1. Always explain your thought process — interviewers care about how you think.",
      "2. Ask clarifying questions before diving into solutions.",
      "3. Know the tradeoffs — no algorithm is universally best.",
      "4. Practice coding on a whiteboard or shared editor (not your IDE).",
      "5. Prepare 2–3 project stories using the STAR method.",
    ];
    let ty = y - 30;
    for (const tip of tips) {
      page10.drawText(tip, { x: MARGIN + 15, y: ty, size: 9, font: helvetica, color: MUTED });
      ty -= 14;
    }
    drawPageNumber(page10, pageNum, helvetica);
  }

  /* ── Back Page ── */
  {
    const page = doc.addPage(PageSizes.A4);
    page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: rgb(0.04, 0.04, 0.06) });
    page.drawRectangle({ x: 0, y: PAGE_H - 8, width: PAGE_W, height: 8, color: INDIGO });

    const centerX = PAGE_W / 2;

    // Thank you message
    page.drawText("Thank You for Downloading!", {
      x: centerX - helveticaBold.widthOfTextAtSize("Thank You for Downloading!", 28) / 2,
      y: PAGE_H - 280,
      size: 28,
      font: helveticaBold,
      color: WHITE,
    });

    // Divider
    page.drawRectangle({ x: centerX - 30, y: PAGE_H - 305, width: 60, height: 2, color: INDIGO });

    // CTA message
    const ctaLine1 = "Ready to go beyond the basics?";
    page.drawText(ctaLine1, {
      x: centerX - helvetica.widthOfTextAtSize(ctaLine1, 16) / 2,
      y: PAGE_H - 340,
      size: 16,
      font: helvetica,
      color: rgb(0.6, 0.6, 0.7),
    });

    // CTA button simulation
    const btnText = "Continue Learning at aieducademy.org";
    const btnW = helveticaBold.widthOfTextAtSize(btnText, 14) + 40;
    page.drawRectangle({ x: centerX - btnW / 2, y: PAGE_H - 395, width: btnW, height: 44, color: INDIGO, borderColor: INDIGO, borderWidth: 0 });
    page.drawText(btnText, {
      x: centerX - helveticaBold.widthOfTextAtSize(btnText, 14) / 2,
      y: PAGE_H - 380,
      size: 14,
      font: helveticaBold,
      color: WHITE,
    });

    // Features
    const features = [
      "15 Programs · 500+ Lessons · 11 Languages",
      "Interactive AI Lab · Mock Interviews",
      "Free · Open Source · Community Driven",
    ];
    let fy = PAGE_H - 440;
    for (const f of features) {
      page.drawText(f, {
        x: centerX - helvetica.widthOfTextAtSize(f, 11) / 2,
        y: fy,
        size: 11,
        font: helvetica,
        color: rgb(0.5, 0.5, 0.6),
      });
      fy -= 20;
    }

    // Footer
    page.drawText("(c) 2026 AI Educademy. All rights reserved.", {
      x: centerX - helvetica.widthOfTextAtSize("(c) 2026 AI Educademy. All rights reserved.", 9) / 2,
      y: 40,
      size: 9,
      font: helvetica,
      color: rgb(0.3, 0.3, 0.4),
    });
  }

  /* ── Save ── */
  const pdfBytes = await doc.save();
  const outDir = join(process.cwd(), "public", "downloads");
  await mkdir(outDir, { recursive: true });
  const outPath = join(outDir, "ai-starter-kit-2026.pdf");
  await writeFile(outPath, pdfBytes);
  console.log(`✅ PDF generated: ${outPath} (${(pdfBytes.length / 1024).toFixed(1)} KB, ${doc.getPageCount()} pages)`);
}

generatePDF().catch((err) => {
  console.error("Failed to generate PDF:", err);
  process.exit(1);
});
