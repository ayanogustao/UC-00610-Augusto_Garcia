const API_BASE_URL = 'https://openboxing.org/api';

export async function getAllChampions() {
  const response = await fetch(`${API_BASE_URL}/champions/all.json`);
  if (!response.ok) {
    throw new Error('Erro na resposta da API (getAllChampions)');
  }
  // Retorna os dados em formato JavaScript (array de campeões)
  return await response.json();
}

export async function getChampionDetails(id) {
  const response = await fetch(`${API_BASE_URL}/champions/${id}.json`);
  if (!response.ok) {
    throw new Error('Erro na resposta da API (getChampionDetails)');
  }
  // Retorna os detalhes do campeão (objeto com champion, reigns, bouts)
  return await response.json();
}
