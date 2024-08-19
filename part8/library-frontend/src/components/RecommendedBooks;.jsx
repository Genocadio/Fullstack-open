/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from './queries';

const RecommendedBooks = ({ favoriteGenre }) => {
  const { loading, error, data } = useQuery(ALL_BOOKS);
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  useEffect(() => {
    if (data && data.allBooks && favoriteGenre) {
      setRecommendedBooks(
        data.allBooks.filter(book => book.genres.includes(favoriteGenre))
      );
    }
  }, [data, favoriteGenre]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching recommended books</div>;
  }

  return (
    <div>
      <h2>Recommended for you based on your favorite genre: {favoriteGenre}</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {recommendedBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecommendedBooks;
