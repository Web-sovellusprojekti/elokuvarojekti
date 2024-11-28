import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieList from './MovieList';
import MovieListHeading from './MovieListHeading';
import '../App.css';
const apiKey = process.env.REACT_APP_API_KEY;

const Profile = () => {
  const [user, setUser] = useState('');
  const [favourites, setFavourites] = useState([]);
  const [favouriteMovies, setFavouriteMovies] = useState([]);
  const token = localStorage.getItem('token');

  
  useEffect(() => {
    if (!token) return; 
    
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('http://localhost:3001/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchFavouriteMovies = async () => {
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

    fetchProfile();
    fetchFavouriteMovies();
  }, [token]);

  useEffect(() => {
    if (favourites.length === 0) return;

    const fetchMovieDetails = async () => {
      const movieDetailsPromises = favourites.map(fav =>
        axios.get(`https://api.themoviedb.org/3/movie/${fav.tmdb_id}?api_key=${apiKey}`)
      );

      try {
        const movies = await Promise.all(movieDetailsPromises);
        setFavouriteMovies(movies.map(response => response.data));
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [favourites]);

  const deleteFavouriteMovie = async (movie) => {
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

  const deleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmed) {
      return;
    }
  
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
  
    try {
      const response = await axios.delete('http://localhost:3001/auth/delete', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        alert('Account deleted successfully');
        localStorage.removeItem('token');
        window.location.href = '/'; // redirect to home page
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account');
    }
  };


  return (
    <div>
      <h1 style={{ fontSize: '50px' }}>Profile</h1>
      <p>
        <span style={{ fontWeight: 'bold' }}>Username:</span> {user.email}
      </p>
      <button onClick={deleteAccount} style={{ backgroundColor: 'red', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}>
        Delete Account
      </button>
     
      <div className='container-fluid movie-app'>
        <div className='row d-flex align-items-center mt-4 mb-4'>
          <MovieListHeading heading='Favourites' />
        </div>
        <div className='favourite'>
          {favouriteMovies.length === 0 ? (
            <div style={{ textAlign: 'center' }}>
              <p>No favourites yet</p>
            </div>
          ) : (
            <div className='favourite-movie-item'>
              <MovieList 
                movies={favouriteMovies}
                isFavouriteList={true} // favourite list with x button true
                handleDeleteClick={deleteFavouriteMovie} // delete function
              />
            </div>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href={`/public-favourites/${user.id}`} target="_blank" rel="noopener noreferrer">
            Share your favourites
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;