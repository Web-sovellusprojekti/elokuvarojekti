import React, { useState } from "react";
import Header from "./components/Header";
import Schedule from "./components/Schedule";
import MovieDetails from "./components/MovieDetails";
import "./App.css";

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
  };

  return (
    <div className="app">
      <Header />
      <div className="main">
        <Schedule onMovieSelect={handleMovieSelect} />
        <MovieDetails movie={selectedMovie} />
      </div>
    </div>
  );
}

export default App;
