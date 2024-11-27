import React from 'react';

/* this is just "movies" title for movie row/element */
const MovieListHeading = (props) => {
    return (
        <div className='movieheader'>
            <h1>{props.heading}</h1>
        </div>
    );
};

export default MovieListHeading;
