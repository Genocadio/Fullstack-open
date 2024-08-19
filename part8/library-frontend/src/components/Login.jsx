/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { useMutation, gql } from "@apollo/client";

import { LOGIN } from "./queries";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data, loading, error }] = useMutation(LOGIN);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ variables: { username, password } });
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("user-token", token);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          username <input value={username} onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          password <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button type="submit">login</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default Login;
