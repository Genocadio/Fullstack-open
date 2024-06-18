const { test, after, beforeEach, describe, afterEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

describe('Blogs API', () => {
  let token;
let userId;

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({ username: 'testuser', passwordHash })
  const savedUser = await user.save()

  userId = savedUser._id

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  }


  token = jwt.sign(userForToken, process.env.SECRET)

  const initialBlogs = [
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      user: savedUser._id,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      user: savedUser._id,
    }
  ]

  await Blog.insertMany(initialBlogs)
})

afterEach( async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  // console.log('cleared all')
})

const api = supertest(app)

test('Blogs are returned as JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('There are two blogs', async () => {
  const result = await api.get('/api/blogs')
  assert.strictEqual(result.body.length, 2)
})

test('Blog post unique identifier is "id" not "_id"', async () => {
  const result = await api.get('/api/blogs')
  const blog = result.body[0]
  // assert.strictEqual(blog.id, blog._id.toString())
  assert.strictEqual(blog._id, undefined)
})

test('POST request to /api/blogs creates a new blog post', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'New Author',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const result = await api.get('/api/blogs')
  assert.strictEqual(result.body.length, 3)
  const titles = result.body.map(e => e.title)
  assert(titles.includes('New Blog'))
})

test('likes defaults to 0 if missing from the request', async () => {
  const newBlog = {
    title: 'Test blog',
    author: 'yves',
    url: 'www.testlikes'
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const result = await api.get('/api/blogs')
  const blog = result.body.find(e => e.title === 'Test blog')
  assert.strictEqual(blog.likes, 0)
})

test('responds with 400 Bad Request if title is missing', async () => {
  const newBlog = {
    author: 'New Author',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('responds with 400 Bad Request if url is missing', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'New Author',
    likes: 5,
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('delete blog post', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'New Author',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const result = await api.get('/api/blogs')
  const blog = result.body.find(e => e.title === 'New Blog')

  await api
    .delete(`/api/blogs/${blog.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const result2 = await api.get('/api/blogs')
  assert.strictEqual(result2.body.length, 2)
})

test('update a blog post', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'New Author',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const result = await api.get('/api/blogs')
  const blog = result.body.find(e => e.title === 'New Blog')

  const updatedBlog = {
    title: 'Updated Blog',
    author: 'Updated Author',
    url: blog.url,
    likes: 10,
  }

  await api
    .put(`/api/blogs/${blog.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const result2 = await api.get('/api/blogs')
  const updated = result2.body.find(e => e.title === 'Updated Blog')
  assert.strictEqual(updated.likes, 10)
  assert.strictEqual(updated.author, 'Updated Author')
})
})

describe('Adding a blog no token', () => {
  const api = supertest(app)
  beforeEach(async () => {
    // Clear the database or perform any necessary setup
    await Blog.deleteMany({});
  });

  test('Fails with status code 401 if token is not provided', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://example.com',
      likes: 10
    };

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.error, 'Unauthorized');
  });

  // You can add more test cases as needed

});


after(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  await mongoose.connection.close()
})

