/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useQuery, useSubscription } from '@apollo/client';
import Authors from "./components/Authors";
import Books from "./components/Books";
import RecommendedBooks from "./components/RecommendedBooks;";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import { GET_USER_FAVORITE_GENRE, BOOK_ADDED, ALL_BOOKS } from './components/queries';

// function that takes care of manipulating cache
const updateCache = (cache, query, addedBook) => {
  // Helper function to ensure no duplicates are saved
  const uniqByTitle = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.title;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook)),
    };
  });
};

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const [favoriteGenre, setFavoriteGenre] = useState(null);

  const { data, loading, error } = useQuery(GET_USER_FAVORITE_GENRE, {
    skip: !token, // Skip query if not logged in
    context: { headers: { Authorization: `bearer ${token}` } }
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("user-token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      console.log(data)
      const addedBook = data.data.bookAdded;
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
    },
  });

  useEffect(() => {
    if (data && data.me) {
      setFavoriteGenre(data.me.favoriteGenre);
    }
  }, [data]);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("user-token");
    setPage("authors"); // Redirect to authors page after logout
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && <button onClick={() => setPage("recommended")}>recommended</button>}
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {token ? (
          <button onClick={logout}>logout</button>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      {page === "authors" && <Authors />}
      {page === "books" && <Books show={page === "books"} />}
      {page === "recommended" && <RecommendedBooks favoriteGenre={favoriteGenre} />}
      {token && page === "add" && <NewBook token={token} show={page === "add"} />}
      {page === "login" && <Login setToken={setToken} />}
    </div>
  );
};

export default App;
