import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieList from './MovieList';
import MovieListHeading from './MovieListHeading';
import SearchBox from './SearchBox';
import AddFavourite from './AddFavourite';
import ScheduleContainer from './ScheduleContainer';
import './schedule.css'
const apiKey = process.env.REACT_APP_API_KEY;

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [sortOrder, setSortOrder] = useState('popularity.desc');
  const [favourites, setFavourites] = useState([]);

  const getMovieRequest = async () => {
    let url;

    if (searchValue) {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchValue}`;
    } else {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`;
    }

    if (selectedGenre) {
      url += `&with_genres=${selectedGenre}`;
    }
    if (selectedYear) {
      url += `&primary_release_year=${selectedYear}`;
    }
    if (selectedRating) {
      url += `&vote_average.gte=${selectedRating}`;
    }

    url += `&sort_by=${sortOrder}`;

    try {
      const response = await fetch(url);
      const responseJson = await response.json();
      if (responseJson.results) {
        setMovies(responseJson.results);
      } else {
        console.error('No results:', responseJson);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };


  const fetchFavouriteMovies = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3001/api/favourites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavourites(response.data);
    } catch (error) {
      console.error('Error fetching favourite movies:', error);
    }
  };

  const handleResetFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedRating('');
    setSortOrder('popularity.desc');
  };

  useEffect(() => {
    getMovieRequest();
  }, [searchValue, selectedGenre, selectedYear, selectedRating, sortOrder]);

  useEffect(() => {
    getMovieRequest();
    fetchFavouriteMovies();
  }, []);

  const addFavouriteMovie = async (movie) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    // debuggin
    console.log('Current favourites:', favourites);
    console.log('Movie to be added:', movie);

    // is movie already in the favourites
    const isAlreadyFavourite = favourites.some(fav => fav.tmdb_id === movie.id);
    console.log('Is already favourite:', isAlreadyFavourite);
    if (isAlreadyFavourite) {
      alert('Movie is already in favourites!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/favourites', {
        movieId: movie.id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        const newFavouriteList = [...favourites, { tmdb_id: movie.id }];
        setFavourites(newFavouriteList);
        alert('Movie added to favourites');
      }
    } catch (error) {
      console.error('Error adding to favourites:', error);
      alert('Failed to add movie to favourites');
    }
  };

  const deleteFavouriteMovie = async (movie) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
  
    try {
      const response = await axios.delete(`http://localhost:3001/api/favourites/${movie.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        const newFavouriteList = favourites.filter(fav => fav.tmdb_id !== movie.id);
        setFavourites(newFavouriteList);
        alert('Movie removed from favourites!');
      }
    } catch (error) {
      console.error('Error removing from favourites:', error);
      alert('Failed to remove movie from favourites');
    }
  };


  return (
    <div className='container-fluid movie-app'>
    <ScheduleContainer />
      <div className='row d-flex align-items-center mt-4 mb-4'>
        <MovieListHeading heading='Movies' />
        <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>

      <div className='row d-flex align-items-center'>
        <div className='col'>
          <label>Genre:</label>
          <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
            <option value=''>All</option>
            <option value='28'>Action</option>
            <option value='35'>Comedy</option>
            <option value='18'>Drama</option>
            <option value='27'>Horror</option>
          </select>
        </div>
        <div className='col'>
          <label>Year:</label>
          <input
            type='number'
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            placeholder='Year'
          />
        </div>
        <div className='col'>
          <label>Rating:</label>
          <input
            type='number'
            step='0.1'
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            placeholder='Rating'
          />
        </div>
        <div className='col'>
          <label>Sort By:</label>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value='popularity.desc'>Popularity (Descending)</option>
            <option value='popularity.asc'>Popularity (Ascending)</option>
            <option value='release_date.desc'>Release Date (Newest First)</option>
            <option value='release_date.asc'>Release Date (Oldest First)</option>
            <option value='vote_average.desc'>Rating (Highest First)</option>
            <option value='vote_average.asc'>Rating (Lowest First)</option>
          </select>
        </div>
        <div className='col'>
          <button className='btn btn-secondary' onClick={handleResetFilters}>
            Reset Filters
          </button>
        </div>
      </div>
      <div className='movieRow'>
        <MovieList
          movies={movies}
          favouriteComponent={AddFavourite}
          handleFavouritesClick={addFavouriteMovie}
          handleDeleteClick={deleteFavouriteMovie}
        />
      </div>
    </div>
  );
};

export default Home;