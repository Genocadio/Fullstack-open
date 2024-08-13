import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import store from './redux/store'
import App from './App'
import UserList from './UserList'
import UserDetail from './UserDetails'
import BlogDetail from './BlogDetail'
import BlogList from './BlogList'
import Navigation from './Navigation'
import { Container } from '@mui/material'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>
      <Container>
        <Navigation />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/blogs" element={<BlogList />} />
        </Routes>
      </Container>
    </Router>
  </Provider>
)
