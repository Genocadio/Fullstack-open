const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3, // Example validation rule
  },
  published: {
    type: Number,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genres: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model('Book', bookSchema);