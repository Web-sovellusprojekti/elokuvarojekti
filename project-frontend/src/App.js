import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Schedule from "./components/Schedule";
import MovieDetails from "./components/MovieDetails";
import "./css/App.css";
import Login from "./components/login/Login";
import Register from "./components/register/Register";

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loginActive, setLoginActive] = useState(false);
  const [registerActive, setRegisterActive] = useState(false);

  const handleLogin = (state) => {
    setLoginActive(state);
  }

  const handleRegister = (state) => {
    setRegisterActive(state);
  }

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
  };

  if (loginActive) {
    return <Login handleLogin={handleLogin} />;
  }
  if (registerActive) {
    return <Register handleRegister={handleRegister} />;
  }

  return (
    <div className="app">
      <Header handleLogin={handleLogin} handleRegister={handleRegister}/>
      <div className="main">
        <Schedule onMovieSelect={handleMovieSelect} />
        <MovieDetails movie={selectedMovie} />
      </div>
    </div>
  );
}

export default App;
