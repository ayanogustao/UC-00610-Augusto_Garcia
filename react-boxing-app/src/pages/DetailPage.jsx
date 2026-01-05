import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getChampionDetails } from "../services/BoxingApiService.js";

function DetailPage() {
  const { id } = useParams();

  const [champion, setChampion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    async function fetchDetails() {
      try {
        setLoading(true);
        setError(null);

        const data = await getChampionDetails(id);
        if (alive) setChampion(data);
      } catch (err) {
        console.error("Erro ao carregar detalhes do lutador:", err);
        if (alive) setError(err);
      } finally {
        if (alive) setLoading(false);
      }
    }

    fetchDetails();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="page text-center py-5">
        <h2 className="mb-4">Detalhes do Lutador</h2>
        <p>Carregando detalhes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page text-center py-5">
        <h2 className="mb-4">Detalhes do Lutador</h2>
        <div className="alert alert-danger" role="alert">
          Não foi possível carregar os detalhes do lutador.
        </div>
        <Link to="/lutadores" className="btn btn-dark mt-3">
          ← Voltar à lista
        </Link>
      </div>
    );
  }

  if (!champion) return null;

  const { name, born } = champion.champion;
  const fullName = `${name.first} ${name.last}`.trim();

  const totalReigns = champion.reigns?.length ?? 0;
  const totalBouts = champion.bouts?.length ?? 0;

  return (
    <div className="dp-page">
      <div className="dp-wrap">
        {/* HERO */}
        <div className="dp-hero">
          <div className="dp-hero-inner">
            <div className="dp-hero-left">
              <div className="dp-avatar">{fullName[0] || "?"}</div>

              <div>
                <h2 className="dp-title">{fullName}</h2>

                <div className="dp-sub">
                  <span className="dp-chip">
                    <span className="dot" /> Boxer Profile
                  </span>
                  <span className="dp-meta">Nascimento: {born || "—"}</span>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2">
              <Link to="/lutadores" className="dp-btn">
                ← Voltar
              </Link>
              <Link to="/" className="dp-btn">
                Início
              </Link>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="dp-grid">
          {/* TÍTULOS */}
          <div className="dp-card">
            <div className="dp-card-head">
              <h3 className="dp-h2">🏆 Títulos conquistados</h3>
              <span className="dp-pill">{totalReigns} no total</span>
            </div>

            {totalReigns > 0 ? (
              <div className="dp-badges">
                {champion.reigns.map((reign) => {
                  const titulo = reign.title;
                  const peso = titulo?.weight?.class || "—";
                  const org = titulo?.org?.name?.short || "—";
                  const inicio = reign?.period?.begins || "—";
                  const fim = reign?.period?.current ? "presente" : reign?.period?.ends || "—";

                  return (
                    <div className="dp-badge" key={reign.reign_id}>
                      <div className="dp-badge-top">
                        <div className="dp-badge-title">{peso}</div>
                        <div className="dp-badge-org">{org}</div>
                      </div>
                      <div className="dp-badge-sub">
                        {inicio} — {fim}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="dp-muted">Este lutador não possui títulos mundiais.</p>
            )}
          </div>

          {/* COMBATES */}
          <div className="dp-card">
            <div className="dp-card-head">
              <h3 className="dp-h2">🥊 Combates</h3>
              <span className="dp-pill">{totalBouts} registos</span>
            </div>

            {totalBouts > 0 ? (
              <ul className="dp-fights">
                {champion.bouts.slice(0, 10).map((bout) => {
                  const nomeA = bout?.boxers?.boxerA?.name?.short || "Boxer A";
                  const nomeB = bout?.boxers?.boxerB?.name?.short || "Boxer B";

                  let resultado = "Sem resultado";
                  let resultClass = "";

                  if (bout?.result?.winner === "DRAW") {
                    resultado = "Empate";
                    resultClass = "draw";
                  } else if (bout?.result?.winner === "BOXER A" || bout?.result?.winner === "BOXER B") {
                    const vencedor = bout.result.winner === "BOXER A" ? nomeA : nomeB;
                    const metodo = bout?.result?.methodOfVictory || "";
                    resultado = `Vencedor: ${vencedor}${metodo ? ` (${metodo})` : ""}`;
                    resultClass = "win";
                  }

                  return (
                    <li className="dp-fight" key={bout?.boutId || `${bout?.date}-${nomeA}-${nomeB}`}>
                      <div>
                        <div className="dp-fight-date">{bout?.date || "—"}</div>
                      </div>

                      <div>
                        <div className="dp-fight-names">
                          <span>{nomeA}</span>
                          <span className="vs">vs</span>
                          <span>{nomeB}</span>
                        </div>

                        <div className={`dp-fight-result ${resultClass}`}>{resultado}</div>
                      </div>
                    </li>
                  );
                })}

                {champion.bouts.length > 10 && (
                  <li className="dp-muted">... e mais {champion.bouts.length - 10} combates</li>
                )}
              </ul>
            ) : (
              <p className="dp-muted">Não há registo de combates para este lutador.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
