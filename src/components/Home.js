import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieList from './MovieList';
import MovieListHeading from './MovieListHeading';
import SearchBox from './SearchBox';
import AddFavourite from './AddFavourite';
import ScheduleContainer from './ScheduleContainer';
import './schedule.css'

// tmdb api avain
const apiKey = process.env.REACT_APP_API_KEY;

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [sortOrder, setSortOrder] = useState('popularity.desc');
  const [favourites, setFavourites] = useState([]);

  // Finnkino states
  const [movieName, setMovieName] = useState('');
  const [theater, setTheater] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [theaters, setTheaters] = useState([]);

  // Fetch theaters for Finnkino
  useEffect(() => {
    async function fetchTheaters() {
      try {
        const response = await axios.get('https://www.finnkino.fi/xml/TheatreAreas/');
        const parser = new DOMParser();
        const xml = parser.parseFromString(response.data, 'text/xml');
        const theaterNodes = Array.from(xml.getElementsByTagName('TheatreArea'));
        const theaterList = theaterNodes.map((node) => ({
          id: node.getElementsByTagName('ID')[0].textContent,
          name: node.getElementsByTagName('Name')[0].textContent,
        }));
        setTheaters(theaterList);
      } catch (error) {
        console.error('Error fetching theaters:', error);
      }
    }
    fetchTheaters();
  }, []);

  // Finnkino search functionality
  const handleFinnkinoSearch = async () => {
    if (!theater) {
      alert('Please select a theater to search for movies.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.finnkino.fi/xml/Schedule/?theatreArea=${theater}`
      );
      const parser = new DOMParser();
      const xml = parser.parseFromString(response.data, 'text/xml');
      const shows = Array.from(xml.getElementsByTagName('Show')).map((show) => ({
        title: show.getElementsByTagName('Title')[0]?.textContent || 'Unknown Title',
        theater: show.getElementsByTagName('Theatre')[0]?.textContent || 'Unknown Theater',
        time: show.getElementsByTagName('dttmShowStart')[0]?.textContent || null,
        image: show.getElementsByTagName('EventSmallImagePortrait')[0]?.textContent || null,
      }));

      // Filter results by movie name if provided
      const filteredResults = movieName
        ? shows.filter((show) =>
            show.title.toLowerCase().includes(movieName.toLowerCase())
          )
        : shows;

      setResults(filteredResults);
    } catch (error) {
      console.error('Error fetching theater shows:', error);
    } finally {
      setLoading(false);
    }
  };

  // TMDb API request
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

  // Favourite movie functionality (existing)
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
    fetchFavouriteMovies();
  }, [searchValue, selectedGenre, selectedYear, selectedRating, sortOrder]);

  const addFavouriteMovie = async (movie) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    // Checking if movie is already in favourites
    const isAlreadyFavourite = favourites.some(fav => fav.tmdb_id === movie.id);
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

      {/* TMDb Search Bar */}
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

      {/* Finnkino Search Bar */}
      <div className="mt-4">
        <h2>Finnkino Movie Search</h2>
        <div className="d-flex align-items-center">
          <input
            type="text"
            placeholder="Enter Movie Name"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            className="form-control mb-2 me-2"
          />
          <select
            className="form-control me-2"
            value={theater}
            onChange={(e) => setTheater(e.target.value)}
          >
            <option value="">Select a Theater</option>
            {theaters.map((theaterOption) => (
              <option key={theaterOption.id} value={theaterOption.id}>
                {theaterOption.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleFinnkinoSearch}
            className="btn btn-primary"
          >
            Search Finnkino Movies
          </button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {results.map((show, index) => (
              <div key={index}>
                <h5>{show.title}</h5>
                <p>{show.theater} - {show.time}</p>
                {show.image && <img src={show.image} alt={show.title} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
