/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_BOOK, ALL_BOOKS } from './queries';

const NewBook = ({ show }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  const [addBook, { loading, error }] = useMutation(ADD_BOOK, {
    update(cache, { data: { addBook } }) {
      // Read the current books from the cache
      const { allBooks } = cache.readQuery({ query: ALL_BOOKS });

      // Add the new book to the cache
      cache.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: allBooks.concat(addBook) },
      });
    },
    onError: (error) => {
      console.error('Error adding book:', error);
    },
  });

  if (!show) return null;

  const submit = async (event) => {
    event.preventDefault();
    if (!title || !author || !published || genres.length === 0) {
      alert('Please fill in all fields and add at least one genre.');
      return;
    }

    await addBook({
      variables: { title, author, published: parseInt(published), genres },
    });

    // Reset form fields
    setTitle('');
    setAuthor('');
    setPublished('');
    setGenres([]);
    setGenre('');
  };

  const addGenre = () => {
    if (genre.trim() && !genres.includes(genre.trim())) {
      setGenres([...genres, genre.trim()]);
      setGenre('');
    }
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label>
            Title
            <input
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
              placeholder="Book Title"
            />
          </label>
        </div>
        <div>
          <label>
            Author
            <input
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
              placeholder="Author Name"
            />
          </label>
        </div>
        <div>
          <label>
            Published
            <input
              type="number"
              value={published}
              onChange={({ target }) => setPublished(target.value)}
              placeholder="Publication Year"
            />
          </label>
        </div>
        <div>
          <label>
            Genre
            <input
              type="text"
              value={genre}
              onChange={({ target }) => setGenre(target.value)}
              placeholder="Genre"
            />
            <button type="button" onClick={addGenre}>
              Add Genre
            </button>
          </label>
        </div>
        <div>
          <p>Genres: {genres.length > 0 ? genres.join(', ') : 'None'}</p>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Book'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </div>
  );
};

export default NewBook;
