// src/services/getImageFromWikipedia.js

// Cache simples (para não pedir sempre as mesmas cenas)
const memCache = new Map();

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) return null;
  return await res.json();
}

async function getThumbFromTitle(title) {
  // MediaWiki API (muito melhor que REST summary)
  const url =
    "https://en.wikipedia.org/w/api.php" +
    `?action=query&format=json&origin=*` +
    `&prop=pageimages&piprop=thumbnail&pithumbsize=500` +
    `&titles=${encodeURIComponent(title)}`;

  const data = await fetchJson(url);
  if (!data?.query?.pages) return null;

  const pages = Object.values(data.query.pages);
  const page = pages?.[0];
  return page?.thumbnail?.source || null;
}

async function searchBestTitle(query) {
  // procura o melhor título quando o nome não bate certo
  const url =
    "https://en.wikipedia.org/w/api.php" +
    `?action=query&format=json&origin=*` +
    `&list=search&srsearch=${encodeURIComponent(query)}&srlimit=1`;

  const data = await fetchJson(url);
  return data?.query?.search?.[0]?.title || null;
}

export async function getWikipediaImage(name) {
  if (!name) return null;

  // cache em memória
  if (memCache.has(name)) return memCache.get(name);

  // cache no sessionStorage (fica mais rápido ao voltar atrás)
  const key = `wikiImg:${name}`;
  const cached = sessionStorage.getItem(key);
  if (cached) {
    memCache.set(name, cached);
    return cached;
  }

  // 1) tentar direto pelo título
  let img = await getThumbFromTitle(name);

  // 2) se falhar, pesquisar e tentar pelo melhor título encontrado
  if (!img) {
    const bestTitle = await searchBestTitle(name);
    if (bestTitle) img = await getThumbFromTitle(bestTitle);
  }

  // guardar cache (mesmo null, pra não spammar)
  memCache.set(name, img);
  sessionStorage.setItem(key, img || "");
  return img || null;
}
