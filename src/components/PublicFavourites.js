import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieList from './MovieList';
import axios from 'axios';
const apiKey = process.env.REACT_APP_API_KEY;

const PublicFavourites = () => {
    const { userId } = useParams();
    const [favourites, setFavourites] = useState([]);
  
    useEffect(() => {
        const fetchFavouriteMovies = async () => {
          try {
            const response = await axios.get(`http://localhost:3001/api/favourites/${userId}`);
            const favouriteIds = response.data;
    
            const movieDetailsPromises = favouriteIds.map(id =>
              axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`)
            );
    
            const movies = await Promise.all(movieDetailsPromises);
            setFavourites(movies.map(response => response.data));
          } catch (error) {
            console.error('Error fetching favourite movies:', error);
          }
        };
    
        fetchFavouriteMovies();
      }, [userId]);
    
      return (
        <div>
          <h2>My favourite movies</h2>
          {favourites.length === 0 ? (
            <p>No favourites yet</p>
          ) : (
            <MovieList movies={favourites} isFavouriteList={true} />
          )}
        </div>
      );
    };
    
    export default PublicFavourites;