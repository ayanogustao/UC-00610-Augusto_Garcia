import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllChampions } from "../services/BoxingApiService.js";
import { getWikipediaImage } from "../services/getImageFromWikipedia.js";

function ListPage() {
  const [fighters, setFighters] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const nomeCompleto = (f) => `${f.name.first} ${f.name.last}`;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getAllChampions();

        // adiciona imagem real automática
        const enriched = await Promise.all(
          data.map(async (fighter) => {
            const fullName = nomeCompleto(fighter);
            const wikiImage = await getWikipediaImage(fullName);

            return {
              ...fighter,
              foto:
                wikiImage ||
                `https://picsum.photos/seed/${encodeURIComponent(fullName)}/400/400`,
            };
          })
        );

        setFighters(enriched);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const fightersFiltrados = fighters.filter((f) =>
    nomeCompleto(f).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="mb-4">Lista de Lutadores</h2>

      <input
        type="text"
        placeholder="Pesquisar lutador..."
        className="form-control mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="row g-4">
        {fightersFiltrados.map((f) => {
          const fullName = nomeCompleto(f);

          return (
            <div key={f.championId} className="col-md-3">
              <div className="card shadow-sm">
                <img
                  src={f.foto}
                  alt={fullName}
                  className="card-img-top"
                  style={{ height: "250px", objectFit: "cover" }}
                />
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
    </div>
  );
}

export default ListPage;
