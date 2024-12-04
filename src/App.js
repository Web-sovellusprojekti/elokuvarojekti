//importit
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './App.module.css';

//components
function App() {
   //state variables to manage user inputs and fetched data
  const [movieName, setMovieName] = useState('');
  const [genre, setGenre] = useState('');
  const [theater, setTheater] = useState(''); //tietty teatteri
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [theaters, setTheaters] = useState([]); //lista teattereista

  //Fetch genre list from moviedatabase
  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await axios.get(
          'https://api.themoviedb.org/3/genre/movie/list',
          {
            params: {
              api_key: process.env.REACT_APP_TMDB_API_KEY,
            },
          }
        );
        setGenres(response.data.genres);  //update genres state with fetched data
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    }
    fetchGenres();
  }, []);

  //fetch theater list from Finnkino API
  useEffect(() => {
    async function fetchTheaters() {
      try {
        const response = await axios.get('https://www.finnkino.fi/xml/TheatreAreas/');
        const parser = new DOMParser(); //Provides the ability to parse XML or HTML source code from a string into a DOM Document
        const xml = parser.parseFromString(response.data, 'text/xml');
        const theaterNodes = Array.from(xml.getElementsByTagName('TheatreArea')); //takes ThreatreArea xml from finnkino.fi
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

  //handles search function
  const handleSearch = async () => {
    setLoading(true);
    try {
      let apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
  
      //add filters to the API request if present
      if (genre) {
        apiUrl += `&with_genres=${genre}`;
      }
  
      //if we have a movie name and no theater selected use the themoviedatabase API to search by movie name
      if (movieName && !theater) {
        apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${movieName}`;
      }
  
      //if theater is selected, fetch movies from Finnkino based on the selected theater
      if (theater) {
        try {
          const theaterMovies = await axios.get(
            `https://www.finnkino.fi/xml/Schedule/?theatreArea=${theater}`
          );
          const parser = new DOMParser();
          const xml = parser.parseFromString(theaterMovies.data, 'text/xml');
          const shows = Array.from(xml.getElementsByTagName('Show')).map((show) => ({
            title: show.getElementsByTagName('Title')[0]?.textContent || 'Unknown Title',
            theater: show.getElementsByTagName('Theatre')[0]?.textContent || 'Unknown Theater',
            time: show.getElementsByTagName('dttmShowStart')[0]?.textContent || null,
            image: show.getElementsByTagName('EventSmallImagePortrait')[0]?.textContent || null,
          }));
  
          // If a movie name is specified, filter the results to match it
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
        return; //return early to prevent overwriting results
      }
  
      // If no theater is selected and there is no movie name fall back to fetching movies by genre
      const response = await axios.get(apiUrl);
      setResults(response.data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Webprojekti16</h1>
      
      {/*Movie name search*/}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Enter Movie Name"
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
          className={styles.input}
        />
      </div>

      {/*Genre selection*/}
      <div className={styles.searchBar}>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className={styles.dropdown}
        >
          <option value="">Select Genre</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {/*Theater selector*/}
      <div className={styles.searchBar}>
        <select
          value={theater}
          onChange={(e) => setTheater(e.target.value)}
          className={styles.dropdown}
        >
          <option value="">Select Theater</option>
          {theaters.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/*Search Button*/}
      <div className={styles.searchBar}>
        <button onClick={handleSearch} className={styles.searchButton}>Search</button>
      </div>

      {/*Loading Indicator*/}
      {loading && <div className={styles.loading}>Loading...</div>}

      {/* Results Display*/}
      <div className={styles.results}>
        <ul className={styles.movieList}>
          {results.map((result, index) => (
            <li key={index} className={styles.movieItem}>
              {result.image && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${result.image}`}
                  alt={result.title}
                  className={styles.movieImage}
                />
              )}
              <div className={styles.movieDetails}>
                <h2>{result.title}</h2>
                <p>Theater: {result.theater || 'N/A'}</p>
                <p>Time: {result.time ? new Date(result.time).toLocaleString() : 'N/A'}</p>
                <p>{result.overview}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;