const bcrypt = require('bcryptjs');
const usersRouter = require('express').Router();
const User = require('../models/user');


usersRouter.post('/', async (request, response) => {
    const body = request.body;

    if (!body.password || body.password.trim().length === 0) {
        return response.status(400).json({ error: 'Password is required' });
    }

    const saltRounds = 10;
    if (body.password.length < 3) {
        return response.status(400).json({error: 'password must be at least 3 characters long'});
    }
    const passwordHash = await bcrypt.hash(body.password, saltRounds);
    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash: passwordHash,
    });
    // console.log(user);
    const savedUser = await user.save();
    // console.log("saved user ", savedUser)
    response.status(201).json(savedUser);
});

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {  url: 1,  title: 1, author: 1});
    response.json(users);
});

module.exports = usersRouter;