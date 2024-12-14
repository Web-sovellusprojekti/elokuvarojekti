import { Link } from 'react-router-dom';
import '../App.css';

const MovieList = (props) => {
    const FavouriteComponent = props.favouriteComponent;
    const isFavouriteList = props.isFavouriteList; //prop to indicate if it's the favourite list

    return (
      <>
        {props.movies.map((movie, index) => (
          <div key={index} className='image-container d-flex justify-content-start m-3'>
            <Link to={`/movie/${movie.id}`}>
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            </Link>
            {props.handleFavouritesClick && (
              <div
                onClick={() => props.handleFavouritesClick(movie)}
                className='overlay d-flex align-items-center justify-content-center'
              >
                <FavouriteComponent movie={movie} />
              </div>
            )}
            {isFavouriteList && 
            props.handleDeleteClick && (
              <button
                onClick={() => props.handleDeleteClick(movie)}
                className="btn btn-danger btn-danger-custom"
                > X
                </button>
              )}
            </div>
          ))}
        </>
      );
    };


export default MovieList;