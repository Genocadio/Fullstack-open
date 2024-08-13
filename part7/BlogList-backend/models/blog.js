const mongoose = require('mongoose');

// Define the comment schema
const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

// Define the blog schema with comments
const blogSchema = new mongoose.Schema({
    url: { type: String, required: true },
    title: { type: String, required: true },
    author: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: { type: Number, default: 0 },
    comments: [    {
        content: String,
      }] 
});

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
