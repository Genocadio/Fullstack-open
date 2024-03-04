const mongoose = require('mongoose')
//mongo db database
// eslint-disable-next-line no-unused-vars
const Password = process.argv[2]
const url  = process.env.MONGODB_URI

console.log('Connecting to', url)
mongoose.set('strictQuery', false)
mongoose.connect(url)
    // eslint-disable-next-line no-unused-vars
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: function(v) {
                const hyphindex = v.indexOf('-')
                if (hyphindex === 2 || hyphindex === 3) {
                    return true
                }
                return false
            },
        }
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)
module.exports = Person