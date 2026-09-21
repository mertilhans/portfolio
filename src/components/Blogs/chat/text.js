/*
  Metin katmani: normallestirme, kelimelere ayirma ve iki kelimenin
  birbirine ne kadar benzedigi. Arama motoru (bm25.js) ve niyet
  algilama (engine.js) ikisi de buradan besleniyor.
*/

const TR = {
  ı: "i", İ: "i", ş: "s", Ş: "s", ğ: "g", Ğ: "g",
  ü: "u", Ü: "u", ö: "o", Ö: "o", ç: "c", Ç: "c",
};

// Turkce karakterler kucuk harfe cevrilmeden once sadelestiriliyor:
// "İ".toLowerCase() tek bir "i" degil, "i" + birlesik nokta uretir.
export function normalize(text) {
  return String(text)
    .replace(/[ıİşŞğĞüÜöÖçÇ]/g, (ch) => TR[ch])
    .toLowerCase()
    .replace(/[^a-z0-9+#\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Soru kaliplari ve baglaclar. Icerik tasimadiklari icin aramaya
// girmiyorlar; niyet algilama bunlara ham metin uzerinden bakiyor.
const STOP = new Set([
  // Ingilizce
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "do", "does",
  "did", "what", "which", "who", "how", "why", "when", "where", "you",
  "your", "yours", "he", "his", "him", "she", "her", "it", "its", "this",
  "that", "these", "those", "them", "they", "about", "tell", "me", "my",
  "of", "for", "in", "on", "to", "and", "or", "can", "could", "would",
  "with", "have", "has", "had", "any", "some", "use", "uses", "used",
  "using", "there", "one", "ones", "please", "show", "give", "know",
  "more", "i", "we", "our", "at", "by", "from", "as", "into", "than",
  "else", "project", "projects", "deal", "deals", "work", "works",
  // Kanaat ve dolgu kelimeleri: "is it good" bir alintidaki "Good
  // programmers" ile eslesiyordu; bunlar soru icerigi degil.
  "good", "bad", "nice", "cool", "great", "awesome", "old", "ok", "okay",
  "yes", "no", "lol", "hmm", "really", "very", "so", "like", "love",
  "want", "need", "never", "always", "ever", "doing", "time", "say",
  "said", "think",
  // Turkce
  "ne", "nedir", "neler", "hangi", "hangisi", "hangileri", "nasil",
  "nicin", "neden", "kim", "kimdir", "bana", "bir", "bu", "su", "o",
  "ile", "ve", "veya", "icin", "mi", "mu", "anlat", "soyle", "var",
  "yok", "bunlardan", "onlardan", "icinden", "onu", "bunu", "onun",
  "bunun", "da", "de", "ki", "gibi", "daha", "cok", "biraz", "sen",
  "senin", "ben", "benim", "proje", "projeler", "projelerin", "evet",
  "hayir", "tamam", "iyi", "guzel", "misin", "musun", "lan", "favori",
]);

// Tek harfli kelimeler genelde gurultu, ama "C" ve "R" gercek dil adlari.
const SHORT_TERMS = new Set(["c", "r"]);

export function tokenize(text) {
  return normalize(text)
    .split(" ")
    .filter(
      (word) =>
        (word.length > 1 || SHORT_TERMS.has(word)) && !STOP.has(word)
    );
}

/*
  Kisitli Damerau-Levenshtein (OSA) mesafesi: harf ekleme, silme,
  degistirme ve komsu iki harfin yer degistirmesi birer adim. Son madde
  onemli — "dokcer" gibi en yaygin yazim hatasi tam olarak budur.
  max asildiginda erken cikiyor, cunku sadece "yakin mi" diye soruyoruz.
*/
export function editDistance(a, b, max = 2) {
  if (Math.abs(a.length - b.length) > max) return max + 1;

  let prevPrev = null;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);

  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + cost);
      if (
        prevPrev &&
        i > 1 &&
        j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1]
      ) {
        value = Math.min(value, prevPrev[j - 2] + 1);
      }
      row.push(value);
      rowMin = Math.min(rowMin, value);
    }
    if (rowMin > max) return max + 1;
    prevPrev = prev;
    prev = row;
  }
  return prev[b.length];
}

function commonPrefix(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

/*
  Sorudaki bir kelimenin sozlukteki bir kelimeye benzerligi, 0 ile 1
  arasi. Kok bulma (stemming) yerine bunu kullaniyoruz, cunku site
  Ingilizce ama sorular Turkce de gelebiliyor ve iki dil icin ayri kok
  bulucu yazmak yerine "ortak bas + kucuk yazim farki" ikisini de
  yakaliyor:
    kitaplari ~ kitap        (Turkce ek)
    processes ~ process      (Ingilizce cogul)
    parsing   ~ parser       (ortak kok)
    minishel  ~ minishell    (yazim hatasi)
*/
export function similarity(query, term) {
  if (query === term) return 1;

  const shorter = Math.min(query.length, term.length);
  if (shorter >= 4 && (term.startsWith(query) || query.startsWith(term))) {
    return 0.8;
  }

  const prefix = commonPrefix(query, term);
  // 4 harflik ortak on ek 5 harfli kelimelerde tesadufi ("sever" / "seven").
  if (prefix >= 5 || (prefix >= 4 && shorter >= 6 && prefix >= 0.75 * shorter)) return 0.7;

  /*
    Kisa kelimelerde tek harf farki cok sey eslestiriyordu: "evet" -> "ever",
    "sever" -> "never". Bu yuzden 4-5 harfte yalnizca yan yana iki harfin
    yer degistirmesi (dokcer tipi hata), 6 harften itibaren tek harf, 8
    harften itibaren iki harf farki kabul ediliyor.
  */
  if (shorter >= 4 && shorter <= 5 && isTransposition(query, term)) return 0.7;
  if (shorter >= 6 && editDistance(query, term, 1) <= 1) return 0.7;
  if (shorter >= 8 && editDistance(query, term, 2) <= 2) return 0.5;

  return 0;
}

// Ayni harfler, yalnizca yan yana iki tanesi yer degistirmis mi (ab -> ba)?
function isTransposition(a, b) {
  if (a.length !== b.length) return false;
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  if (i >= a.length - 1) return false;
  return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2);
}
