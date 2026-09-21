/*
  Depo istatistiklerinin tek kaynagi. Hem liste hem detay sayfasi burayi
  kullanir, boylece detay sayfasi ayri bir istek atmaz ve kimliksiz
  API'nin saatlik 60 istek limiti bos yere tuketilmez.

  Sonuc sessionStorage'da bir saat tutulur. Depolama erisilemezse
  (gizli sekme, dolu kota) onbelleksiz calismaya devam eder.
*/

export const GITHUB_USER = "mertilhans";

const CACHE_KEY = "gh-repo-stats";
const CACHE_TTL = 60 * 60 * 1000;

export function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw);
    if (Date.now() - at > CACHE_TTL) return null;
    return data;
  } catch (err) {
    return null;
  }
}

function writeCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch (err) {
    /* onbellek yoksa sorun degil */
  }
}

// Tum depolari tek istekte ceker ve depo adina gore indeksler.
export function fetchStats() {
  const cached = readCache();
  if (cached) return Promise.resolve(cached);

  return fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`
  )
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then((repos) => {
      if (!Array.isArray(repos)) throw new Error("beklenmeyen cevap");

      const byName = {};
      repos.forEach((repo) => {
        byName[repo.name] = {
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          updatedAt: repo.pushed_at,
        };
      });

      writeCache(byName);
      return byName;
    });
}
