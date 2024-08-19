/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Select from 'react-select';
import { ALL_AUTHORS } from './queries';
import { EDIT_AUTHOR_BIRTH_YEAR } from './queries';

const Authors = () => {
  const { loading, error, data } = useQuery(ALL_AUTHORS);
  const [editAuthor] = useMutation(EDIT_AUTHOR_BIRTH_YEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.error('Error editing author:', error);
    }
  });

  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [birthYear, setBirthYear] = useState('');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching authors: {error.message}</p>;

  const authors = data.allAuthors.map(author => ({
    value: author.name,
    label: author.name,
  }));

  const handleChange = (selectedOption) => {
    setSelectedAuthor(selectedOption);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedAuthor) {
      await editAuthor({
        variables: { name: selectedAuthor.value, setBornTo: parseInt(birthYear) },
      });

      setSelectedAuthor(null);
      setBirthYear('');
    }
  };

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Born</th>
          </tr>
          {data.allAuthors.map(author => (
            <tr key={author.name}>
              <td>{author.name}</td>
              <td>{author.born || 'Not set'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Set Author Birth Year</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <Select
            value={selectedAuthor}
            onChange={handleChange}
            options={authors}
            placeholder="Select an author"
          />
        </div>
        <div>
          <input
            type="number"
            value={birthYear}
            onChange={({ target }) => setBirthYear(target.value)}
            placeholder="Birth Year"
          />
        </div>
        <button type="submit">Update Birth Year</button>
      </form>
    </div>
  );
};

export default Authors;
