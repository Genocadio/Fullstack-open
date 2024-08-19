/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from './queries';

const Books = (props) => {
  const { loading, error, data } = useQuery(ALL_BOOKS);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    if (data && data.allBooks) {
      // Filter books based on the selected genre
      if (selectedGenre === 'All') {
        setFilteredBooks(data.allBooks);
      } else {
        setFilteredBooks(
          data.allBooks.filter(book => book.genres.includes(selectedGenre))
        );
      }
    }
  }, [data, selectedGenre]);
  
  if (!props.show) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching books</div>;
  }

  // Get unique genres from the books data
  const genres = ['All', ...new Set(data.allBooks.flatMap(book => book.genres))];

  return (
    <div>
      <h2>Books</h2>

      {/* Genre filter buttons */}
      <div>
        {genres.map(genre => (
          <button key={genre} onClick={() => setSelectedGenre(genre)}>
            {genre}
          </button>
        ))}
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
            {/* <th>ID</th> */}
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
              {/* <td>{book.id}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
