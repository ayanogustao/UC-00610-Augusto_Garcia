import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getChampionDetails } from "../services/BoxingApiService.js";

function DetailPage() {
  const { id } = useParams(); // obtém o ID da URL
  const [champion, setChampion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Busca detalhes do lutador sempre que o ID muda
  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      setError(null);
      try {
        const data = await getChampionDetails(id);
        setChampion(data);
      } catch (err) {
        console.error('Erro ao carregar detalhes do lutador:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  if (loading) {
    return <p>Carregando detalhes do lutador...</p>;
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Não foi possível carregar os detalhes do lutador.
      </div>
    );
  }

  // Se champion estiver carregado, extrai dados úteis
  if (champion) {
    const { name, born } = champion.champion; // dados do lutador
    const fullName = name.first + ' ' + name.last;

    return (



      
      <div>
        <h2>{fullName}</h2>
        <p><strong>Data de Nascimento:</strong> {born}</p>

        {/* Lista de títulos (reigns) conquistados pelo lutador */}
        <h4>Títulos Conquistados:</h4>
        {champion.reigns.length > 0 ? (
          <ul>
            {champion.reigns.map((reign) => {
              const titulo = reign.title;
              const peso = titulo.weight.class;       // categoria de peso (ex: "Heavyweight")
              const org = titulo.org.name.short;      // organização (ex: "WBA", "WBC")
              const inicio = reign.period.begins;
              const fim = reign.period.current ? 'presente' : reign.period.ends;
              return (
                <li key={reign.reign_id}>
                  {peso} - {org} ({inicio} a {fim})
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Este lutador não possui títulos mundiais.</p>
        )}

        {/* Lista de combates (bouts) do lutador */}
        <h4>Combates:</h4>
        {champion.bouts.length > 0 ? (
          <ul>
            {champion.bouts.slice(0, 5).map((bout) => {
              // Obter nomes dos dois lutadores envolvidos no combate
              const nomeA = bout.boxers.boxerA.name.short;
              const nomeB = bout.boxers.boxerB.name.short;
              // Determinar vencedor do combate (ou "Empate" se aplicável)
              let resultado;
              if (bout.result.winner === 'DRAW') {
                resultado = 'Empate';
              } else {
                const vencedor = bout.result.winner === 'BOXER A' ? nomeA : nomeB;
                const metodo = bout.result.methodOfVictory; // ex: KO, Decision
                resultado = `Vencedor: ${vencedor} (${metodo})`;
              }
              return (
                <li key={bout.boutId}>
                  {bout.date}: {nomeA} vs {nomeB} – {resultado}
                </li>
              );
            })}
            {champion.bouts.length > 5 && <li>... (lista truncada)</li>}
          </ul>
        ) : (
          <p>Não há registo de combates para este lutador.</p>
        )}
      </div>
    );
  }

  // Caso champion seja null (não carregado) e não esteja em loading, retorna nulo
  return null;
}

export default DetailPage;
