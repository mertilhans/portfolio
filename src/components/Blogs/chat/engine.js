import projects from "../../Projects/projectData";
import { books } from "../readingData";
import { normalize, tokenize, similarity } from "./text";
import { buildIndex, search } from "./bm25";
import { buildDocuments } from "./corpus";

/*
  Sohbet motoru. Bir soru su sirayla karsilaniyor:

    1. Kalip niyetler  — selam, tesekkur, "neler sorabilirim"
    2. Baglam          — "tell me more", "which of those…", "does it…"
                         Onceki cevabin projelerini hatirlayarak cevaplanir.
    3. Yapisal sorgular — "which projects use C++", "how many…", "AI projects"
                         Etiket ve kategori dizininden, liste olarak.
    4. Serbest arama   — geri kalan her sey BM25 ile tum site metninde.

  Hicbiri yeterince guclu bir eslesme bulamazsa motor bilmedigini
  soyler. Uydurmak yerine susmak bu motorun tek kirmizi cizgisi.
*/

const index = buildIndex(buildDocuments());

// Serbest aramada bir cevabin kabul edilmesi icin gereken en dusuk puan.
// Testlerle ayarlandi: altinda kalan sonuclar hep tek bir bulanik
// eslesmeden geliyordu.
const MIN_SCORE = 1.6;
const MAX_CARDS = 6;

export const suggestions = [
  "What is 42?",
  "Which projects use C++?",
  "Which books have you read?",
  "Tell me about minishell",
  "How does this chatbot work?",
];

const RE = {
  greeting: /^((reis|abi|hocam|kanka)\s)?(hi|hello|hey|merhaba|selam|selamlar|slm|sa|sea|good (morning|evening))(\s(reis|abi|hocam|kanka|there))?$/,
  thanks: /\b(thanks|thank you|thx|tesekkur\w*|sagol\w*|eyvallah)\b/,
  help: /\b(help|what can you do|what do you know|what can i ask|neler yapabilirsin|ne sorabilirim|yardim)\b/,
  more: /^(more|tell me more|go on|continue|and|what else|daha|daha fazla|devam|devam et|baska)$|\b(tell me more|more about (it|this|that)|daha fazla|devam et)\b/,
  ofThose: /\b(of those|of them|among them|which one|hangisi|hangileri|bunlardan|onlardan|icinden|arasindan)\b/,
  pronoun: /\b(it|its|this|that|bu|bunu|bunun|onu|onun|bunda|onda)\b/,
  list: /\b(which|what projects|what else|list|projects|projeler\w*|hangi\w*|kullanan|kullanilan|kullaniyor\w*|uses?)\b/,
  count: /\b(how many|kac)\b/,
  books: /\b(books?|kitap\w*)\b/,
  related: /\b(relate|related|relates|ilgili|alakali)\b/,
  // Tamamen durak kelimelerden olusan kimlik sorulari ("who are you")
  // aramaya bir sey birakmiyor; kalip olarak yakalaniyorlar.
  identity: /\b(who are you|who is (he|mert)|about (you|yourself|mert)|introduce yourself|kimsin|mert kim\w*|kendini tanit|what (do|are) you (study|studying|do|doing)|ne okuyorsun|nerede okuyorsun)\b/,
  favorite: /\b(favou?rite|en sevdi\w*|en begendi\w*)\b/,
};

const CATEGORIES = [
  ["ai", /\b(ai|artificial intelligence|yapay zeka)\b/],
  ["data", /\b(data|veri)\b/],
  ["web", /\bweb\b/],
  ["42", /\b42\b/],
];

// ─── Dizinler ───

const byId = new Map(projects.map((p) => [p.id, p]));

// Etiket -> projeler. Cok kelimeli etiketler ("Ray Tracing") kelime
// listesi olarak tutuluyor ki soru tum kelimelerini icerdiginde eslessin.
const tagIndex = new Map();
projects.forEach((project) => {
  project.tags.forEach((tag) => {
    const key = normalize(tag);
    if (!tagIndex.has(key)) {
      tagIndex.set(key, { label: tag, words: key.split(" "), ids: [] });
    }
    tagIndex.get(key).ids.push(project.id);
  });
});

const projectTitleTokens = projects.map((project) => ({
  id: project.id,
  tokens: [...new Set([...tokenize(project.title), ...tokenize(project.id)])],
}));

function mentionedProject(tokens) {
  const hit = projectTitleTokens.find(
    ({ tokens: titleTokens }) =>
      titleTokens.length > 0 &&
      titleTokens.every((t) => tokens.some((q) => similarity(q, t) >= 0.7))
  );
  return hit ? hit.id : null;
}

// "c++" sorusu "c++98" etiketini bulmali, ama tek harfli "c" yalnizca
// tam eslesmeyle — yoksa "c++" sorusu C projelerini dondururdu.
function tokenMatchesTagWord(token, word) {
  if (token === word) return true;
  if (token.length < 2 || word.length < 2) return false;
  if (word.startsWith(token) || token.startsWith(word)) return true;
  // "dokcer" -> "docker": etiketlerde de yazim hatasi affediliyor.
  return Math.min(token.length, word.length) >= 4 && similarity(token, word) >= 0.7;
}

// ─── Cevap bicimlendirme ───

function listReply(intro, ids, noteFor) {
  const shown = ids.slice(0, MAX_CARDS);
  return {
    text: `${intro}: ${ids.map((id) => byId.get(id).title).join(", ")}.`,
    cards: shown.map((id) => ({ projectId: id, note: noteFor && noteFor(id) })),
    more: ids.length > MAX_CARDS ? ids.length - MAX_CARDS : 0,
  };
}

function unknown() {
  return {
    text:
      "I don't have anything on that. I only know what is published on this site — the projects, the books, the school and the tools. Try one of these:",
    unknown: true,
    followUps: suggestions.slice(0, 3),
  };
}

// Tek projelik bir cevabin ardindan sorulabilecek mantikli sorular.
function followUpsFor(reply, context) {
  if (reply.followUps) return reply.followUps;
  const cards = reply.cards || [];

  if (cards.length === 1) {
    const project = byId.get(cards[0].projectId);
    const ups = [];
    const shown = context.shown.get(project.id) || new Set();
    if ((project.highlights || []).length > shown.size) ups.push("Tell me more");

    const sharedTag = project.tags.find(
      (tag) => (tagIndex.get(normalize(tag))?.ids.length || 0) >= 2
    );
    if (sharedTag) ups.push(`What else uses ${sharedTag}?`);

    if (books.some((book) => book.usedIn.includes(project.id))) {
      ups.push("Which books relate to it?");
    }
    // Az once sorulan soru tekrar onerilmez — "Tell me more" haric: o
    // bolum bolum ilerledigi icin tekrar sorulmasi zaten beklenen sey.
    const fresh = ups.filter(
      (u) => u === "Tell me more" || normalize(u) !== context.lastQuestion
    );
    if (fresh.length) return fresh.slice(0, 3);
  } else if (cards.length > 1) {
    return cards
      .slice(0, 2)
      .map((card) => `Tell me about ${byId.get(card.projectId).title}`);
  }

  return suggestions.filter((s) => !context.lastQuestion.includes(normalize(s))).slice(0, 3);
}

// ─── Oturum ───

export function createChat() {
  const context = {
    lastProjects: [], // son cevaptaki projeler — "which of those" icin
    lastProject: null, // son tek proje — "tell me more", "it" icin
    shown: new Map(), // proje -> gosterilmis bolum indeksleri
    lastQuestion: "",
  };

  function remember(reply) {
    const ids = (reply.cards || []).map((card) => card.projectId);
    if (ids.length) {
      context.lastProjects = ids;
      if (ids.length === 1) context.lastProject = ids[0];
    }
    return reply;
  }

  function markShown(doc) {
    if (doc.kind !== "highlight") return;
    if (!context.shown.has(doc.projectId)) context.shown.set(doc.projectId, new Set());
    context.shown.get(doc.projectId).add(doc.highlightIndex);
  }

  // ── Baglam niyetleri ──

  function tellMore() {
    const project = byId.get(context.lastProject);
    if (!project) return null;

    const highlights = project.highlights || [];
    if (highlights.length === 0) {
      return {
        text: `${project.title} is documented in its own README — the project page renders all of it.`,
        cards: [{ projectId: project.id }],
      };
    }

    const shown = context.shown.get(project.id) || new Set();
    const next = highlights.findIndex((_, i) => !shown.has(i));
    if (next === -1) {
      return {
        text: `That's everything I have on ${project.title} — the project page has it all in one place.`,
        cards: [{ projectId: project.id }],
        followUps: suggestions.slice(0, 3),
      };
    }

    markShown({ kind: "highlight", projectId: project.id, highlightIndex: next });
    return {
      text: `${highlights[next].title}. ${highlights[next].body}`,
      cards: [
        { projectId: project.id, note: `${next + 1} of ${highlights.length}` },
      ],
    };
  }

  function relatedBooks() {
    const project = byId.get(context.lastProject);
    if (!project) return null;

    const related = books.filter((book) => book.usedIn.includes(project.id));
    if (related.length === 0) {
      return { text: `None of the books on the shelf are tied to ${project.title} yet.` };
    }
    return {
      text: `Books behind ${project.title}: ${related
        .map((book) => `${book.title} (${book.authors})`)
        .join("; ")}.`,
      link: { label: "The shelf", to: "/blogs" },
      cards: [{ projectId: project.id }],
    };
  }

  function ofThose(tokens) {
    const pool = new Set(context.lastProjects);
    const results = search(index, tokens, (doc) => pool.has(doc.projectId));
    if (!results.length || results[0].score < MIN_SCORE / 2) {
      return { text: "None of those mention that." };
    }

    const top = results[0].score;
    const picked = new Map();
    results.forEach((result) => {
      if (result.score >= top * 0.5 && !picked.has(result.doc.projectId)) {
        picked.set(result.doc.projectId, result.doc);
      }
    });

    const ids = [...picked.keys()];
    const noteFor = (id) => {
      const doc = picked.get(id);
      return doc.kind === "highlight"
        ? byId.get(id).highlights[doc.highlightIndex].title
        : undefined;
    };
    if (ids.length === 1) {
      const doc = picked.get(ids[0]);
      markShown(doc);
      const reply = doc.reply();
      return { ...reply, text: `Of those, only ${byId.get(ids[0]).title}. ${reply.text}` };
    }
    return listReply(`Of those, ${ids.length} do`, ids, noteFor);
  }

  // ── Yapisal sorgular ──

  function techList(norm, tokens) {
    if (!RE.list.test(norm) || mentionedProject(tokens)) return null;

    let best = null;
    tagIndex.forEach((entry, key) => {
      const hit = entry.words.every((word) =>
        tokens.some((token) => tokenMatchesTagWord(token, word))
      );
      // En uzun (en ozgul) etiket kazanir: "c++98", "c"ye yenilmemeli.
      if (hit && (!best || key.length > best.key.length)) best = { ...entry, key };
    });

    if (!best || best.ids.length < 2) return null;
    return listReply(`${best.ids.length} projects are tagged ${best.label}`, best.ids);
  }

  function categoryList(norm) {
    if (!/\b(projects?|projeler\w*)\b/.test(norm)) return null;
    const match = CATEGORIES.find(([, re]) => re.test(norm));
    if (!match) return null;

    const ids = projects.filter((p) => p.category === match[0]).map((p) => p.id);
    return ids.length ? listReply(`${ids.length} project${ids.length > 1 ? "s" : ""}`, ids) : null;
  }

  function count(norm) {
    if (!RE.count.test(norm)) return null;

    if (RE.books.test(norm)) {
      const n = (status) => books.filter((b) => b.status === status).length;
      return {
        text: `${books.length} books on the shelf: ${n("read")} finished, ${n("reading")} in progress and ${n("next")} on the list.`,
        link: { label: "The shelf", to: "/blogs" },
      };
    }

    const n = (category) => projects.filter((p) => p.category === category).length;
    return {
      text: `${projects.length} projects: ${n("42")} from the 42 cursus, ${n("ai")} AI, ${n("data")} data and ${n("web")} web.`,
      link: { label: "See all projects", to: "/project" },
    };
  }

  // ── Serbest arama ──

  function freeSearch(norm, tokens, filter) {
    const results = search(index, tokens, filter);
    if (!results.length) return null;

    const top = results[0];
    if (top.score < MIN_SCORE) return null;

    // "Which projects deal with signals?" gibi sorular tek bir projeye
    // degil, konuya dokunan her projeye karsilik gelir.
    if (!filter && RE.list.test(norm) && !mentionedProject(tokens)) {
      const picked = new Map();
      results.forEach((result) => {
        const id = result.doc.projectId;
        if (id && result.score >= top.score * 0.5 && !picked.has(id)) {
          picked.set(id, result.doc);
        }
      });
      if (picked.size >= 2) {
        const noteFor = (id) => {
          const doc = picked.get(id);
          return doc.kind === "highlight"
            ? byId.get(id).highlights[doc.highlightIndex].title
            : undefined;
        };
        return listReply(`${picked.size} projects touch on that`, [...picked.keys()], noteFor);
      }
    }

    markShown(top.doc);
    return top.doc.reply();
  }

  // ── Giris noktasi ──

  function ask(raw) {
    const norm = normalize(raw);
    const tokens = tokenize(raw);
    const previous = context.lastQuestion;
    context.lastQuestion = norm;

    const finish = (reply) => {
      const withContext = remember(reply);
      return { ...withContext, followUps: followUpsFor(withContext, { ...context, lastQuestion: norm }) };
    };

    if (!norm) {
      return {
        text: "Ask me about the projects, the books, the school or the tools behind this site.",
        followUps: suggestions.slice(0, 3),
      };
    }

    if (RE.greeting.test(norm)) {
      return {
        text: "Hey! I'm the guide to this portfolio. Ask me about a project, a book on the shelf, or 42 itself.",
        followUps: suggestions.slice(0, 3),
      };
    }
    if (RE.thanks.test(norm) && tokens.length <= 3) {
      return { text: "Anytime. Anything else you want to know?", followUps: suggestions.slice(1, 4) };
    }
    if (RE.help.test(norm)) {
      return {
        text: "I can walk you through any project on this site, list projects by technology (\"which projects use Docker?\"), explain what 42 is, tell you which books are on the shelf, and follow up — \"tell me more\", \"which of those…\", \"does it…\".",
        followUps: suggestions.slice(0, 3),
      };
    }

    if (RE.identity.test(norm)) {
      const who = index.docs.find((doc) => doc.id === "static:who");
      return finish(who.reply());
    }
    if (RE.favorite.test(norm) && RE.books.test(norm)) {
      const read = books.filter((b) => b.status === "read").map((b) => b.title);
      return finish({
        text: `There's no favourite on record, so I won't invent one. What is on record: finished ${read.join(", ")}.`,
        link: { label: "The shelf", to: "/blogs" },
      });
    }

    // Baglam: onceki cevaba atif yapan sorular.
    if (RE.more.test(norm) && context.lastProject) {
      const reply = tellMore();
      if (reply) return finish(reply);
    }
    if (RE.books.test(norm) && (RE.related.test(norm) || RE.pronoun.test(norm)) && context.lastProject) {
      const reply = relatedBooks();
      if (reply) return finish(reply);
    }
    if (RE.ofThose.test(norm) && context.lastProjects.length > 1 && tokens.length) {
      return finish(ofThose(tokens));
    }
    if (RE.pronoun.test(norm) && context.lastProject && !mentionedProject(tokens) && tokens.length) {
      const scoped = freeSearch(norm, tokens, (doc) => doc.projectId === context.lastProject);
      if (scoped) return finish(scoped);
    }

    // Yapisal sorgular.
    const structured = count(norm) || techList(norm, tokens) || categoryList(norm);
    if (structured) return finish(structured);

    // Serbest arama.
    const found = freeSearch(norm, tokens);
    if (found) return finish(found);

    context.lastQuestion = previous;
    return unknown();
  }

  function reset() {
    context.lastProjects = [];
    context.lastProject = null;
    context.shown = new Map();
    context.lastQuestion = "";
  }

  return { ask, reset };
}
