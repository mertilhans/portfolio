import projects from "../../Projects/projectData";
import certifications from "../../Projects/certificationData";
import { books, quotes } from "../readingData";
import { podium2026, alsoTopTen2026, history } from "../wuriData";

/*
  Sitenin tum verisini aranabilir belgelere ceviriyor. Her belge:
    fields  — BM25'in puanladigi agirlikli metin alanlari
    reply() — bu belge kazanirsa verilecek cevap
    projectId / highlightIndex — sohbet hafizasi icin baglam

  Burada elle yazilan tek sey Turkce esanlamlilar (aliases): site
  Ingilizce, sorular Turkce gelebiliyor, ve "kitap" kelimesi hicbir
  kitap aciklamasinda gecmiyor.
*/

const CATEGORY_WORDS = {
  "42": "42 cursus school",
  ai: "ai artificial intelligence yapay zeka",
  data: "data analytics science veri analiz",
  web: "web frontend site",
};

const STATUS_LABEL = {
  read: "finished",
  reading: "currently reading",
  next: "on the reading list",
};

export function projectTitle(id) {
  const project = projects.find((p) => p.id === id);
  return project ? project.title : id;
}

function projectDocs() {
  const docs = [];

  projects.forEach((project) => {
    docs.push({
      id: `project:${project.id}`,
      kind: "project",
      projectId: project.id,
      fields: [
        { text: project.title, weight: 4 },
        { text: project.id.replace(/[-_]/g, " "), weight: 2 },
        { text: (project.repo || "").replace(/[-_]/g, " "), weight: 2 },
        { text: project.tags.join(" "), weight: 2 },
        { text: project.description, weight: 1 },
        { text: project.overview || "", weight: 1 },
        { text: CATEGORY_WORDS[project.category] || "", weight: 1 },
      ],
      reply: () => ({
        text: `${project.title} — ${project.description}${
          project.status ? ` (${project.status})` : ""
        }`,
        cards: [{ projectId: project.id }],
      }),
    });

    (project.highlights || []).forEach((highlight, index) => {
      docs.push({
        id: `highlight:${project.id}:${index}`,
        kind: "highlight",
        projectId: project.id,
        highlightIndex: index,
        fields: [
          { text: highlight.title, weight: 2 },
          { text: highlight.body, weight: 1 },
          { text: project.title, weight: 1 },
        ],
        reply: () => ({
          text: `${project.title} — ${highlight.title}. ${highlight.body}`,
          cards: [{ projectId: project.id, note: highlight.title }],
        }),
      });
    });
  });

  return docs;
}

function bookDocs() {
  return books.map((book) => ({
    id: `book:${book.id}`,
    kind: "book",
    fields: [
      { text: book.title, weight: 3 },
      { text: book.subtitle || "", weight: 1 },
      { text: book.authors, weight: 2 },
      { text: book.topics.join(" "), weight: 2 },
      { text: book.takeaway, weight: 1 },
      { text: "book kitap", weight: 1 },
    ],
    reply: () => ({
      text: `${book.title} by ${book.authors} (${book.year}) — ${
        STATUS_LABEL[book.status]
      }. ${book.takeaway}`,
      cards: book.usedIn
        .filter((id) => projects.some((p) => p.id === id))
        .map((id) => ({ projectId: id, note: "Used this book" })),
    }),
  }));
}

function quoteDocs() {
  return quotes.map((quote, index) => ({
    id: `quote:${index}`,
    kind: "quote",
    fields: [
      { text: quote.text, weight: 1 },
      { text: quote.attribution, weight: 2 },
      { text: quote.source, weight: 1 },
      { text: "quote quotes saying alinti soz", weight: 1 },
    ],
    reply: () => ({
      text: `"${quote.text}" — ${quote.attribution}, ${quote.source}.`,
    }),
  }));
}

function wuriDoc() {
  const years = history
    .map((item) => `${item.year}: #${item.rank}`)
    .join(", ");
  const top = podium2026.map((entry) => `${entry.rank}. ${entry.name}`).join(", ");
  const rest = alsoTopTen2026.map((school) => school.short).join(", ");

  return {
    id: "fact:wuri",
    kind: "fact",
    fields: [
      { text: "WURI ranking World's Universities with Real Impact", weight: 3 },
      {
        text:
          "innovation innovative ranking rank ranked siralama inovasyon universite university universities",
        weight: 2,
      },
      { text: `${rest} MIT Stanford Harvard Caltech Penn`, weight: 1 },
    ],
    reply: () => ({
      text: `In the WURI innovation ranking (World's Universities with Real Impact) 42 placed ${years}. The 2026 podium: ${top} — ahead of ${rest}.`,
      link: { label: "See the ranking", to: "/blogs" },
    }),
  };
}

function staticDocs() {
  const read = books.filter((b) => b.status === "read");
  const reading = books.filter((b) => b.status === "reading");
  const next = books.filter((b) => b.status === "next");

  return [
    {
      id: "static:who",
      kind: "static",
      fields: [
        { text: "Mert Ilhan", weight: 4 },
        { text: "who are you yourself introduce bio kimsin hakkinda tanit", weight: 2 },
      ],
      reply: () => ({
        text:
          "Mert Ilhan — a developer from Tekirdag, Turkey, and a student at 42 Kocaeli. First code in 2021, these days mostly C and C++ alongside artificial intelligence and data work.",
        link: { label: "About page", to: "/about" },
      }),
    },
    {
      id: "static:languages",
      kind: "static",
      fields: [
        { text: "languages programming language skills skillset stack", weight: 3 },
        { text: "dil diller yetenek bildigi", weight: 2 },
      ],
      reply: () => ({
        text:
          "C and C++ are the main ones — most of the cursus is written in them. Python for the AI and data work, plus C#, Swift and JavaScript with React on the web side.",
        link: { label: "Skillset", to: "/about" },
      }),
    },
    {
      id: "static:tools",
      kind: "static",
      fields: [
        { text: "tools editor ide environment setup", weight: 3 },
        { text: "arac araclar ortam editor", weight: 2 },
        { text: "linux macos docker git vscode jetbrains bash figma notion", weight: 1 },
      ],
      reply: () => ({
        text:
          "Linux and macOS day to day, bash for anything repetitive, Docker for environments, Git for everything. VS Code and the JetBrains IDEs for editing, plus Figma and Notion outside the code.",
        link: { label: "Tools I use", to: "/about" },
      }),
    },
    {
      id: "static:42",
      kind: "static",
      fields: [
        { text: "42", weight: 4 },
        {
          text:
            "school campus cursus piscine peer evaluation common core kocaeli okul kampus",
          weight: 2,
        },
      ],
      reply: () => ({
        text: `42 is a tuition-free programming school founded in Paris in 2013, now with campuses around the world — Mert studies at 42 Kocaeli. There are no teachers, no lectures and no textbooks: you learn by building projects, and every project is graded by other students in a face to face peer evaluation. Admission is a four-week trial called the Piscine, and the common core runs from rebuilding the C standard library (libft) to a full-stack multiplayer web app (ft_transcendence). In the WURI innovation ranking 42 was 6th in 2023 and 2024, then 3rd in the world in 2025 and 2026. ${
          projects.filter((p) => p.category === "42").length
        } of the projects on this site come from it.`,
        link: { label: "42 Cursus projects", to: "/project" },
      }),
    },
    {
      id: "static:contact",
      kind: "static",
      fields: [
        { text: "contact email mail reach hire", weight: 3 },
        { text: "iletisim eposta ulas", weight: 2 },
        { text: "linkedin github", weight: 1 },
      ],
      reply: () => ({
        text:
          "Email is the quickest: mertilhanbv@gmail.com. GitHub (github.com/mertilhans) and LinkedIn are linked in the footer and on the home page too.",
      }),
    },
    {
      id: "static:reading",
      kind: "static",
      fields: [
        { text: "reading list books read shelf finished", weight: 3 },
        { text: "kitap kitaplar okudum okudun okuma okuyor", weight: 2 },
      ],
      reply: () => ({
        text: `Finished: ${read.map((b) => b.title).join(", ")}. Currently reading ${reading
          .map((b) => b.title)
          .join(" and ")}, with ${next.length} more on the list.`,
        link: { label: "The shelf", to: "/blogs" },
      }),
    },
    {
      id: "static:certs",
      kind: "static",
      fields: [
        { text: "certifications certificate certified", weight: 3 },
        { text: "sertifika coursera google diploma", weight: 2 },
      ],
      reply: () => ({
        text: certifications.length
          ? `Certifications: ${certifications
              .map((c) => `${c.title} (${c.issuer}${c.year ? `, ${c.year}` : ""})`)
              .join("; ")}.`
          : "No certifications listed yet.",
        cards: projects
          .filter((p) => p.category === "data")
          .map((p) => ({ projectId: p.id, note: "Certificate capstone" })),
      }),
    },
    {
      id: "static:chatbot",
      kind: "static",
      fields: [
        { text: "chatbot bot work model llm gpt ai assistant", weight: 2 },
        { text: "nasil calisiyorsun calisir yapay", weight: 1 },
      ],
      reply: () => ({
        text:
          "No language model and no server. Every sentence on this site is indexed, your question is scored against it with BM25 — the ranking method classic search engines use — with typo tolerance and a short memory of the conversation. So I can only say what is published here, and I tell you when I don't know.",
      }),
    },
  ];
}

export function buildDocuments() {
  return [
    ...staticDocs(),
    wuriDoc(),
    ...projectDocs(),
    ...bookDocs(),
    ...quoteDocs(),
  ];
}
