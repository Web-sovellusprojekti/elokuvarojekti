import React from "react";

function Schedule({ onMovieSelect }) {
  const movies = [
    { id: 1, name: "Elokuva 1", time: "14:00" },
    { id: 2, name: "Elokuva 2", time: "16:30" },
    { id: 3, name: "Elokuva 3", time: "19:00" },
  ];

  return (
    <section className="schedule">
      <div className="calendar">
        <button>MA</button>
        <button>TI</button>
        <button>KE</button>
        <button>TO</button>
        <button>PE</button>
        <button>LA</button>
        <button>SU</button>
      </div>
      <div className="movie-list">
        <h3>Lista elokuvanäytöksistä</h3>
        <ul>
          {movies.map((movie) => (
            <li key={movie.id} onClick={() => onMovieSelect(movie)}>
              {movie.name} - klo {movie.time}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Schedule;
