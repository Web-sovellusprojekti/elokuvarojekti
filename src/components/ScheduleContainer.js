import React, { useState } from 'react';
import Schedule from './Schedule';
import MovieDetails from './MovieDetails';

const ScheduleContainer = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
  };

  return (
    <div className='schedule-container'>
      <Schedule onMovieSelect={handleMovieSelect} />
      <MovieDetails movie={selectedMovie} />
    </div>
  );
};

export default ScheduleContainer;