var _ = require('lodash');


const dummy  =(blogs) => {
    return 1
}



const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    let maxLikes = -1
    let favorite = null

    for (const blog of blogs) {
        if (blog.likes > maxLikes) {
            maxLikes = blog.likes;
            favorite = blog;
        }
    }
    delete favorite._id
    delete favorite.url
    delete favorite.__v
    return favorite
}

const mostBlogs = (blogs) => {
    const blogCounts = _.countBy(blogs, 'author')
    const authorBlogsArray = _.map(blogCounts, (blogs, author) => ({ author, blogs }));
    const topAuthor = _.maxBy(authorBlogsArray, 'blogs');
    return topAuthor
}

const mostLikes = (blogs) => {
    const blogLikes = _.reduce(blogs, (result, blog) => {
        if (!result[blog.author]) {
            result[blog.author] = 0
        }
        result[blog.author] += blog.likes
        return result
    }, {})
    const authorLikesArray = _.map(blogLikes, (likes, author) => ({ author, likes }));
    const topAuthor = _.maxBy(authorLikesArray, 'likes');
    return topAuthor
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}