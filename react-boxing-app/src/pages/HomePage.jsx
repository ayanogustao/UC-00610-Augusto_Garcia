import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="text-center py-5">
      <h1 className="display-4 mb-4">React Boxe</h1>
      <p className="lead mb-5" style={{fontSize: '1.3rem', opacity: 0.9}}>
        Explora os maiores campeões mundiais de boxe
      </p>
      <Link to="/lutadores" className="btn btn-dark btn-lg px-5 py-3">
        Ver Lutadores 🥊
      </Link>
      <p className="mt-5 text-muted">
        Projeto de Augusto Garcia - UC Desenvolvimento de Aplicações Web com React
      </p>
      <small className="text-muted">
        Nota: Algumas imagens são da Wikipedia ou placeholders (picsum).
      </small>
    </div>
  );
}

export default HomePage;