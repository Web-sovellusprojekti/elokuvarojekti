import React from "react";

function MovieDetails({ movie }) {
  if (!movie) {
    return (
      <section className="movie-details">
        <p>Valitse elokuva nähdäksesi tiedot.</p>
      </section>
    );
  }

  return (
    <section className="movie-details">
      <h2>{movie.name}</h2>
      <div className="movie-poster">
        <img
          src="https://via.placeholder.com/200"
          alt={`Juliste: ${movie.name}`}
        />
      </div>
      <p>Elokuvan kuvaus: Tämä on kuvaus elokuvasta {movie.name}.</p>
      <div className="reviews">
        <h3>Arvostelut:</h3>
        <p>Käyttäjä1: Mahtava elokuva!</p>
        <p>Käyttäjä2: Ei vastannut odotuksia.</p>
      </div>
    </section>
  );
}

export default MovieDetails;
