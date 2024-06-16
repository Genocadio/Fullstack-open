const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

const initialUsers = [
    {
        username: "yves",
        name: "Root",
        password: "password"
    },
    {
        username: "admin",
        name: "Admin",
        password: "password"
    }
]

describe('User API', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        let newObj = new User(initialUsers[0])
        await newObj.save()
        newObj = new User(initialUsers[1])
        await newObj.save()
    })
    test('Create a new user', async () => {
        const newUser = {
            username: 'newuser',
            name: 'New User',
            password: 'password'
        }
        await supertest(app)
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    })
    test('Usernames must be unique', async () => {
        const newUser = {
            username: 'yves',
            name: 'New User',
            password: 'password'
        }
        const result = await supertest(app)
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(result.body.error, 'username must be unique')
    })
    test('Username exceeds minimum length', async () => {
        const newUser = {
            username: 'y',
            name: 'New User',
            password: 'password'
        }
        const username = newUser.username
        const result = await supertest(app)
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(result.body.error, `User validation failed: username: Path \`username\` (\`${username}\`) is shorter than the minimum allowed length (3).`)
    })
    test('Password exceeds minimum length', async () => {
        const newUser = {
            username: 'newuser',
            name: 'New User',
            password: 'p'
        }
        const result = await supertest(app)
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(result.body.error, 'password must be at least 3 characters long')
    })
    test('Password is required', async () => {
        const newUser = {
            username: 'newuser',
            name: 'New User',
        }
        const result = await supertest(app)
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(result.body.error, 'Password is required')
    })
    test('Username is required', async () => {
        const newUser = {
            name: 'New User',
            password: 'password'
        }
        const result = await supertest(app)
           .post('/api/users')
           .send(newUser)
           .expect(400)
           .expect('Content-Type', /application\/json/)
           assert.strictEqual(result.body.error,  'User validation failed: username: Path `username` is required.')
    })

})

after(() => {
    mongoose.connection.close()
})