export async function getWikipediaImage(name) {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`;
    const response = await fetch(url);

    if (!response.ok) return null;

    const data = await response.json();

    // A Wikipedia devolve imagem em "thumbnail.source"
    return data.thumbnail?.source || null;
  } catch (error) {
    console.error("Erro ao buscar imagem da Wikipedia:", error);
    return null;
  }
}
