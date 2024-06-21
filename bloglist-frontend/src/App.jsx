import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';

const Notification = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000); // Notification hides after 5 seconds (5000 milliseconds)

      return () => clearTimeout(timer); // Clean up timer on unmount or message change
    }
  }, [message]);

  if (!isVisible) {
    return null;
  }

  const notificationStyle = {
    color: type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  };

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  );
};


const NewBlogForm = ({ handleNewBlog, setMessage, setMessageType }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [likes, setLikes] = useState('');

  const addBlog = async (event) => {
    event.preventDefault();
    try {
      const newBlog = await blogService.create({
        title,
        author,
        url,
        likes: Number(likes) || 0, // Ensure likes is a number, defaulting to 0
      });

      handleNewBlog(newBlog);
      setMessage(`A new blog ${newBlog.title} by ${newBlog.author} added`);
      setMessageType('success');
      setTitle('');
      setAuthor('');
      setUrl('');
      setLikes('');
    } catch (error) {
      setMessage(`Error adding blog: ${error.message}`);
      setMessageType('error');
      console.error('Error adding blog:', error);
      // Optionally handle and display error
    }
  };

  return (
    <div>
      <h2>Create New Blog</h2>
      <form onSubmit={addBlog}>
        <div>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          Author:
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div>
          URL:
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div>
          Likes:
          <input
            type="number"
            value={likes}
            onChange={(e) => setLikes(e.target.value)}
          />
        </div>
        <button type="submit">Create Blog</button>
      </form>
    </div>
  );
};

const Login = ({ handleLogin, setMessage, setMessageType }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = await blogService.login({
        username,
        password,
      });
      handleLogin(user);
      setMessage(`Logged in as ${user.username}`);
      setMessageType('success');
      setUsername('');
      setPassword('');
    } catch (exception) {
      setMessage('Wrong username or password');
      setMessageType('error');

      console.error('Login error:', exception);
      // Optionally handle and display login error
    }
  };

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

const BlogList = ({ blogs, handleLogout }) => (
  <div>
    <h2>Blogs</h2>
    <button onClick={handleLogout}>Logout</button>
    {blogs.map((blog) => (
      <Blog key={blog.id} blog={blog} />
    ))}
  </div>
);

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token); // Set token in blogService
    }
  }, []);

  useEffect(() => {
    if (user) {
      blogService.getAll().then((blogs) => setBlogs(blogs));
    }
  }, [user]);

  const handleLogin = async (userData) => {
    setUser(userData);
    blogService.setToken(userData.token); // Set token in blogService
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    blogService.setToken(null); // Clear token in blogService
    window.localStorage.removeItem('loggedBlogappUser');
    setMessage('You have been logged out');
    setMessageType('success');
  };
  const handleNewBlog = (newBlog) => {
    setBlogs([...blogs, newBlog]);
  };

  return (
    <div>
      <Notification message={message} type={messageType} />
      {!user ? (
        <Login handleLogin={handleLogin} setMessage={setMessage} setMessageType={setMessageType} />
      ) : (
        <>
        <BlogList blogs={blogs} handleLogout={handleLogout} />
        <NewBlogForm handleNewBlog={handleNewBlog} setMessage={setMessage} setMessageType={setMessageType}/>
        </>
      )}

    </div>
  );
};

export default App;
