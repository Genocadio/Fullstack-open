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

        const saltRounds = 10
        const passwordHash1 = await bcrypt.hash(initialUsers[0].password, saltRounds)
        const passwordHash2 = await bcrypt.hash(initialUsers[1].password, saltRounds)

        const user1 = new User({ username: initialUsers[0].username, name: initialUsers[0].name, passwordHash: passwordHash1 })
        const user2 = new User({ username: initialUsers[1].username, name: initialUsers[1].name, passwordHash: passwordHash2 })

        await user1.save()
        await user2.save()
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

    test('Username exceeds minimum length', async () => {
        const newUser = {
            username: 'y',
            name: 'New User',
            password: 'password'
        }
        const result = await supertest(app)
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(result.body.error, `User validation failed: username: Path \`username\` (\`y\`) is shorter than the minimum allowed length (3).`)
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

        assert.strictEqual(result.body.error, 'User validation failed: username: Path `username` is required.')
    })
})
describe ('Username cant be used twice', () => {
    test('Usernames must be unique', async () => {
        await User.deleteMany({})
        const newUser1 = {
            username: 'yves',
            name: 'Yves Le Bihan',
            password: 'password123'
        };
    
        const newUser2 = {
            username: 'yves', // Attempting to create a second user with the same username
            name: 'Another User',
            password: 'password456'
        };
    
        // First, create the first user successfully
        await supertest(app)
            .post('/api/users')
            .send(newUser1)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        // console.log('first user created')
    
        // Now attempt to create the second user with the same username
        const response = await supertest(app)
            .post('/api/users')
            .send(newUser2)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        // console.log('second user created')
    
        assert.strictEqual(response.body.error, 'username must be unique');
    });

})
after(async () => {
    await User.deleteMany({})
    await mongoose.connection.close()
})
