const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async(request,  response) => {
    const { username, password } = request.body

    const user = await User.findOne({ username })
    console.log(user)
    console.log('User password hash:', user.passwordHash);
    const passCorrect = user === null 
        ? false
        : await bcrypt.compare(password, user.passwordHash)
    

    if (!(user && passCorrect)) {
        return response.status(401).json({
            error: 'invalid username or passowrd'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id
    }

    console.log(process.env.SECRET)
    const token  = jwt.sign(userForToken, process.env.SECRET)

    response
        .status(200)
        .send({ token, username: user.username, name: user.name })

})

module.exports = loginRouter