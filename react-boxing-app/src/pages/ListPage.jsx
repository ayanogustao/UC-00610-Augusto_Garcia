import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllChampions } from "../services/BoxingApiService.js";
import { getWikipediaImage } from "../services/getImageFromWikipedia.js";
import { FAMOUS_BOXERS } from "../data/famousBoxers.js";

function ListPage() {
  const [fighters, setFighters] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const nomeCompleto = (f) => `${f.name.first} ${f.name.last}`.trim();

  useEffect(() => {
    let alive = true;

    async function fetchData() {
      try {
        setLoading(true);

        const data = await getAllChampions();

        // 1) ordenar candidatos: primeiro famosos que existem no OpenBoxing
        const byName = new Map();
        data.forEach((f) => byName.set(nomeCompleto(f), f));

        const ordered = [];

        // famosos primeiro
        for (const nm of FAMOUS_BOXERS) {
          if (byName.has(nm)) ordered.push(byName.get(nm));
        }

        // depois o resto (pra completar caso falte)
        for (const f of data) {
          if (!ordered.includes(f)) ordered.push(f);
        }

        // 2) agora garantir 100 COM IMAGEM REAL
        const result = [];
        for (const fighter of ordered) {
          if (result.length >= 100) break;

          const fullName = nomeCompleto(fighter);

          // evitar repetidos por nome
          if (result.some((x) => nomeCompleto(x) === fullName)) continue;

          const img = await getWikipediaImage(fullName);

          // só entra se tiver imagem REAL
          if (!img) continue;

          result.push({ ...fighter, foto: img });
        }

        if (alive) setFighters(result);
      } catch (e) {
        console.error(e);
        if (alive) setFighters([]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    fetchData();
    return () => {
      alive = false;
    };
  }, []);

  const fightersFiltrados = fighters.filter((f) =>
    nomeCompleto(f).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/" className="btn btn-outline-light">
          ← Página inicial
        </Link>

        {!loading && (
          <span style={{ opacity: 0.85, fontSize: "1rem" }}>
            {fightersFiltrados.length} resultado(s)
          </span>
        )}
      </div>

      <h2 className="mb-4">Lutadores Mais Conhecidos</h2>

      {loading && (
        <p className="text-center mt-5" style={{ fontSize: "1.2rem" }}>
          Carregando lutadores com imagem...
        </p>
      )}

      {!loading && fighters.length < 100 && (
        <p className="text-center" style={{ opacity: 0.85 }}>
          Só encontrei {fighters.length} com thumbnail disponível na Wikipedia.
          (Se quiseres, eu aumento a lista de famosos para bater 100 certinho.)
        </p>
      )}

      {!loading && (
        <>
          <div className="search-container">
            <input
              type="text"
              placeholder="Pesquisar lutador..."
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {fightersFiltrados.length === 0 ? (
            <p className="text-center mt-4" style={{ opacity: 0.85 }}>
              Nenhum lutador encontrado 😭
            </p>
          ) : (
            <div className="row g-4">
              {fightersFiltrados.map((f) => {
                const fullName = nomeCompleto(f);

                return (
                  <div key={f.championId} className="col-md-3">
                    <div className="card shadow-sm">
                      <div className="position-relative">
                        <img
                          src={f.foto}
                          alt={fullName}
                          className="card-img-top"
                          style={{ height: "250px", objectFit: "cover" }}
                          loading="lazy"
                        />
                        <div
                          className="position-absolute bottom-0 w-100 p-2"
                          style={{
                            background:
                              "linear-gradient(transparent, rgba(0,0,0,0.9))",
                          }}
                        />
                      </div>

                      <div className="card-body text-center">
                        <h5 className="card-title">{fullName}</h5>

                        <Link
                          to={`/lutadores/${f.championId}`}
                          className="btn btn-dark w-100 mt-2"
                        >
                          Ver Detalhes
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ListPage;
