import { tokenize, similarity } from "./text";

/*
  BM25: arama motorlarinin klasik puanlama yontemi. Bir kelime bir
  belgede ne kadar sik geciyorsa o kadar puan getirir, ama bu artis
  doyuma ulasir (k1) ve uzun belgeler sirf uzun olduklari icin kazanmaz
  (b). Nadir kelimeler (idf) sik kelimelerden cok daha degerlidir —
  "minishell" soran birinin niyeti "project" soranin niyetinden cok daha
  nettir.

  Her belge agirlikli alanlardan olusuyor: baslik gibi bir alani 4 ile
  carpmak, o alandaki kelimeleri 4 kez yazmakla ayni etkiyi yapiyor.
*/

const K1 = 1.4;
const B = 0.75;
const MAX_EXPANSIONS = 4;

export function buildIndex(docs) {
  const df = new Map();

  const docTerms = docs.map((doc) => {
    const tf = new Map();
    let length = 0;

    doc.fields.forEach(({ text, weight }) => {
      tokenize(text).forEach((term) => {
        tf.set(term, (tf.get(term) || 0) + weight);
        length += weight;
      });
    });

    tf.forEach((_, term) => df.set(term, (df.get(term) || 0) + 1));
    return { tf, length };
  });

  const totalLength = docTerms.reduce((sum, d) => sum + d.length, 0);

  return {
    docs,
    docTerms,
    df,
    size: docs.length,
    avgLength: totalLength / Math.max(docs.length, 1),
    vocabulary: [...df.keys()],
    expansions: new Map(),
  };
}

function idf(index, term) {
  const n = index.df.get(term) || 0;
  return Math.log(1 + (index.size - n + 0.5) / (n + 0.5));
}

/*
  Sorudaki kelimeyi sozlukteki en benzer birkac kelimeye genisletir.
  Sonuc onbellege aliniyor: sozluk birkac bin kelime, her soruda ayni
  kelimeleri bastan karsilastirmaya gerek yok.
*/
function expand(index, queryTerm) {
  if (index.expansions.has(queryTerm)) return index.expansions.get(queryTerm);

  const matches = [];
  index.vocabulary.forEach((term) => {
    const sim = similarity(queryTerm, term);
    if (sim > 0) matches.push({ term, sim });
  });

  matches.sort((a, b) => b.sim - a.sim || idf(index, b.term) - idf(index, a.term));
  const top = matches.slice(0, MAX_EXPANSIONS);
  index.expansions.set(queryTerm, top);
  return top;
}

/*
  Sonuclar puana gore sirali doner. Her sonuc, sorudaki kac kelimenin
  bu belgede karsilik buldugunu da tasir (matched) — tek bir kelimenin
  bulanik eslesmesiyle gelen zayif sonuclari ayiklamak icin.
*/
export function search(index, queryTokens, filter) {
  const expansions = queryTokens.map((q) => expand(index, q));
  const results = [];

  index.docs.forEach((doc, i) => {
    if (filter && !filter(doc)) return;

    const { tf, length } = index.docTerms[i];
    const norm = K1 * (1 - B + (B * length) / index.avgLength);
    let score = 0;
    let matched = 0;
    let bestSim = 0;

    expansions.forEach((candidates) => {
      let best = 0;
      let sim = 0;
      candidates.forEach(({ term, sim: s }) => {
        const f = tf.get(term);
        if (!f) return;
        const part = (s * idf(index, term) * (f * (K1 + 1))) / (f + norm);
        if (part > best) {
          best = part;
          sim = s;
        }
      });
      if (best > 0) {
        score += best;
        matched += 1;
        bestSim = Math.max(bestSim, sim);
      }
    });

    if (score > 0) results.push({ doc, score, matched, bestSim });
  });

  return results.sort((a, b) => b.score - a.score);
}
