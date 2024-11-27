import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
const apiKey = process.env.REACT_APP_API_KEY;

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`;
            const response = await fetch(url);
            const responseJson = await response.json();
            setMovie(responseJson);
        };

        fetchMovie();
    }, [id]);

    return (
        <div className='movie-detail'>
            {movie ? (
                <>
                    <h1>{movie.title}</h1>
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                    <p>{movie.overview}</p>
                    <p className='release-date'> Release Date: {movie.release_date}</p>
                    <p className='rating'> Rating: </p> <p className='ratingnumber'> {movie.vote_average}</p>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default MovieDetail;